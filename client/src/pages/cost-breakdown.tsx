import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCostData } from "../providers/CostDataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { ArrowLeft, Calculator, ClipboardList, DollarSign, PackageCheck, Ship, TruckIcon, AlertCircle, RefreshCw, Download, FileText, Share2, BarChart3, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import MainLayout from '../components/layouts/MainLayout';
import { DashboardHeader } from '../components/layouts/DashboardHeader';
import axios from 'axios';

interface ShippingEstimate {
  shippingCost: number;
  shippingService: string;
  estimatedDeliveryDays: number;
  dutyAmount: number;
  taxAmount: number;
  totalLandedCost: number;
  isEstimate?: boolean;
}

interface TariffData {
  hsCode: string;
  dutyRate: number;
  description: string;
  isEstimate?: boolean;
}

const CostBreakdown: React.FC = () => {
  const navigate = useNavigate();
  const { costData, isDataReady } = useCostData();
  const [isLoading, setIsLoading] = useState(true);
  const [shippingData, setShippingData] = useState<ShippingEstimate | null>(null);
  const [tariffData, setTariffData] = useState<TariffData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect to cost analysis if no data
  React.useEffect(() => {
    if (!isDataReady) {
      navigate('/cost-analysis');
    }
  }, [isDataReady, navigate]);

  // Fetch shipping and tariff data from API
  useEffect(() => {
    if (!isDataReady) return;

    const fetchShippingData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Calculate volumetric weight
        const volumeInCm = costData.dimensions.length * costData.dimensions.width * costData.dimensions.height;
        const volumetricWeight = volumeInCm / 5000; // Industry standard divisor
        
        // Use the greater of actual weight or volumetric weight
        const chargeableWeight = Math.max(costData.weight, volumetricWeight);

        // Fetch shipping rates
        const shippingResponse = await axios.get('/api/shipping/rates', {
          params: {
            originCountry: costData.originCountry,
            destinationCountry: costData.destinationCountry,
            weight: chargeableWeight,
            length: costData.dimensions.length,
            width: costData.dimensions.width,
            height: costData.dimensions.height,
            value: costData.totalValue,
            hsCode: costData.hsCode
          }
        });
        
        setShippingData(shippingResponse.data);
        
        // Fetch tariff data
        const tariffResponse = await axios.get('/api/tariffs/data', {
          params: {
            hsCode: costData.hsCode,
            originCountry: costData.originCountry,
            destinationCountry: costData.destinationCountry
          }
        });
        
        setTariffData(tariffResponse.data);
        
      } catch (err) {
        console.error('Error fetching shipping or tariff data:', err);
        setError('Unable to fetch shipping and tariff data. Using estimated values.');
        // Generate fallback data
        generateFallbackData();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShippingData();
  }, [costData, isDataReady]);
  
  // Generate fallback data if API fails
  const generateFallbackData = () => {
    // Calculate volumetric weight
    const volumeInCm = costData.dimensions.length * costData.dimensions.width * costData.dimensions.height;
    const volumetricWeight = volumeInCm / 5000; // Industry standard divisor
    
    // Use the greater of actual weight or volumetric weight
    const chargeableWeight = Math.max(costData.weight, volumetricWeight);
    
    // Calculate shipping costs (simplified)
    const baseShippingRate = 10; // $10 per kg
    const shippingCost = chargeableWeight * baseShippingRate;
    
    // Base duty rate - typically varies by HS code and countries involved
    const dutyRate = 0.05; // 5% duty rate
    
    // Calculate duty amount
    const dutyAmount = costData.totalValue * dutyRate;
    
    // Calculate taxes
    const taxAmount = costData.totalValue * 0.07; // 7% tax rate
    
    // Calculate total landed cost
    const totalLandedCost = costData.totalValue + dutyAmount + taxAmount + shippingCost;
    
    setShippingData({
      shippingCost,
      shippingService: 'Standard International',
      estimatedDeliveryDays: 14,
      dutyAmount,
      taxAmount,
      totalLandedCost,
      isEstimate: true
    });
    
    setTariffData({
      hsCode: costData.hsCode || 'Generic',
      dutyRate: 0.05,
      description: 'Estimated tariff rate',
      isEstimate: true
    });
  };

  // Calculate total costs based on the product data and API responses
  const calculateCosts = () => {
    if (!isDataReady || !shippingData) return null;
    
    // Get duty rate from tariff data or use a default
    const dutyRate = tariffData?.dutyRate || 0.05;
    
    // Customs processing fee
    const customsFee = 25 + (costData.totalValue * 0.01); // $25 base + 1% of value
    
    // Insurance cost
    const insuranceCost = costData.totalValue * 0.02; // 2% of value
    
    // Handling and documentation
    const handlingFee = 45;
    
    // Calculate total landed cost
    const totalCost = costData.totalValue + 
                      shippingData.dutyAmount + 
                      shippingData.taxAmount + 
                      shippingData.shippingCost + 
                      customsFee + 
                      insuranceCost + 
                      handlingFee;
    
    // Calculate volumetric weight for display
    const volumeInCm = costData.dimensions.length * costData.dimensions.width * costData.dimensions.height;
    const volumetricWeight = volumeInCm / 5000; // Industry standard divisor
    const chargeableWeight = Math.max(costData.weight, volumetricWeight);
    
    return {
      dutyRate,
      dutyAmount: shippingData.dutyAmount,
      taxAmount: shippingData.taxAmount,
      customsFee,
      shippingCost: shippingData.shippingCost,
      shippingService: shippingData.shippingService,
      estimatedDeliveryDays: shippingData.estimatedDeliveryDays,
      insuranceCost,
      handlingFee,
      totalCost,
      chargeableWeight,
      isEstimate: shippingData.isEstimate || tariffData?.isEstimate
    };
  };

  const costs = calculateCosts();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // If not ready or still loading, show loading state
  if (!isDataReady || !costs) {
    if (isLoading) {
      return (
        <div className="container mx-auto py-6 max-w-4xl">
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Cost Breakdown Analysis
              </CardTitle>
              <CardDescription>
                Loading real-time shipping and tariff data...
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Calculating costs...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return null; // The redirect will handle it if not loading
  }

  const getCountryName = (code: string) => {
    const countries: Record<string, string> = {
      'us': 'United States',
      'ca': 'Canada',
      'mx': 'Mexico',
      'cn': 'China',
      'jp': 'Japan',
      'kr': 'South Korea',
      'gb': 'United Kingdom',
      'fr': 'France',
      'de': 'Germany',
      'it': 'Italy',
      'es': 'Spain',
      'br': 'Brazil',
      'in': 'India',
      'au': 'Australia',
    };
    return countries[code.toLowerCase()] || code;
  };

  // Export functions following your UX guide requirements
  const exportToPDF = () => {
    window.print(); // This will open print dialog for PDF export
  };

  const exportToCSV = () => {
    const csvData = [
      ['Cost Component', 'Amount (USD)', 'Percentage'],
      ['Product Value', (costData.totalValue || 0).toFixed(2), (((costData.totalValue || 0) / costs.totalCost) * 100).toFixed(1) + '%'],
      ['Shipping Cost', costs.shippingCost.toFixed(2), ((costs.shippingCost / costs.totalCost) * 100).toFixed(1) + '%'],
      ['Duty Amount', costs.dutyAmount.toFixed(2), ((costs.dutyAmount / costs.totalCost) * 100).toFixed(1) + '%'],
      ['Tax Amount', costs.taxAmount.toFixed(2), ((costs.taxAmount / costs.totalCost) * 100).toFixed(1) + '%'],
      ['Total Cost', costs.totalCost.toFixed(2), '100%']
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost-breakdown-${costData.productName || 'analysis'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Cost Breakdown - Takes 3/4 width */}
          <div className="xl:col-span-3">
            <Card>
              <DashboardHeader
                title="Cost Breakdown Analysis"
                description="Detailed breakdown of all import costs and fees with export options"
                icon={<Calculator className="h-6 w-6" />}
                variant="blue"
              />
              
              {/* Export Actions Bar */}
              <div className="px-6 py-4 border-b bg-slate-50">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={exportToPDF} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToCSV} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Analysis
                  </Button>
                </div>
              </div>
        
        <CardContent className="pt-6">
          {/* API Data Status */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Data Notice</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {costs.isEstimate && !error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Using Estimated Data</AlertTitle>
              <AlertDescription>
                Some values are based on industry averages rather than real-time data.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Product Summary */}
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <PackageCheck className="h-5 w-5" />
              Product Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Product Name</p>
                <p className="font-medium">{costData.productName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">HS Code</p>
                <p className="font-medium">{costData.hsCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Origin Country</p>
                <p className="font-medium">{getCountryName(costData.originCountry)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destination Country</p>
                <p className="font-medium">{getCountryName(costData.destinationCountry)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Product Value</p>
                <p className="font-medium">{formatCurrency(costData.totalValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{costData.quantity} units</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transport Mode</p>
                <p className="font-medium">{costs.shippingService || "Standard International"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chargeable Weight</p>
                <p className="font-medium">{costs.chargeableWeight.toFixed(2)} kg</p>
              </div>
            </div>
          </div>
          
          {/* Shipping Information */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mb-6 border border-blue-100 dark:border-blue-900">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Ship className="h-5 w-5" />
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-600/70 dark:text-blue-400/70">Carrier</p>
                <p className="font-medium">{costs.shippingService || "Standard International"}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600/70 dark:text-blue-400/70">Estimated Delivery</p>
                <p className="font-medium">{costs.estimatedDeliveryDays || 14} days</p>
              </div>
              <div>
                <p className="text-sm text-blue-600/70 dark:text-blue-400/70">Shipping Cost</p>
                <p className="font-medium">{formatCurrency(costs.shippingCost)}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600/70 dark:text-blue-400/70">Insurance (2%)</p>
                <p className="font-medium">{formatCurrency(costs.insuranceCost)}</p>
              </div>
            </div>
          </div>
          
          {/* Tariff Information */}
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg mb-6 border border-amber-100 dark:border-amber-900">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <TruckIcon className="h-5 w-5" />
              Tariff & Duties
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Duty Rate</p>
                <p className="font-medium">{(costs.dutyRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Duty Amount</p>
                <p className="font-medium">{formatCurrency(costs.dutyAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">VAT/Tax</p>
                <p className="font-medium">{formatCurrency(costs.taxAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Customs Processing</p>
                <p className="font-medium">{formatCurrency(costs.customsFee)}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Cost Breakdown */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Breakdown
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Product Value</span>
                </div>
                <span className="font-medium">{formatCurrency(costData.totalValue)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-muted-foreground" />
                  <span>Shipping Cost ({costs.shippingService})</span>
                </div>
                <span className="font-medium">{formatCurrency(costs.shippingCost)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Duty ({(costs.dutyRate * 100).toFixed(1)}%)</span>
                </div>
                <span className="font-medium">{formatCurrency(costs.dutyAmount)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-4 w-4 text-muted-foreground" />
                  <span>VAT/Tax</span>
                </div>
                <span className="font-medium">{formatCurrency(costs.taxAmount)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span>Customs Processing Fee</span>
                </div>
                <span className="font-medium">{formatCurrency(costs.customsFee)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span>Insurance</span>
                </div>
                <span className="font-medium">{formatCurrency(costs.insuranceCost)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span>Handling & Documentation</span>
                </div>
                <span className="font-medium">{formatCurrency(costs.handlingFee)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 bg-primary/5 px-3 rounded-lg mt-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <span className="font-semibold">Total Landed Cost</span>
                </div>
                <span className="font-bold text-lg">{formatCurrency(costs.totalCost)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/cost-analysis')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cost Analysis
            </Button>
            
            <Button 
              className="flex items-center gap-2"
              onClick={() => navigate('/regulations')}
            >
              View Regulatory Requirements
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Analytics Sidebar - Takes 1/4 width */}
      <div className="xl:col-span-1 space-y-6">
        {/* Cost Optimization Tips */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Cost Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">💡 Save up to 15%</p>
              <p className="text-xs text-green-700 mt-1">Consider consolidating shipments to reduce per-unit shipping costs</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">📋 Trade Agreement</p>
              <p className="text-xs text-blue-700 mt-1">Check if USMCA benefits apply to reduce duty rates</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium">⚡ Faster Clearance</p>
              <p className="text-xs text-amber-700 mt-1">Pre-file customs documents to expedite processing</p>
            </div>
          </CardContent>
        </Card>

        {/* Cost Comparison Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Product Value</span>
                <span className="font-medium">${(costData.totalValue || 0).toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${((costData.totalValue || 0) / costs.totalCost) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="font-medium">${costs.shippingCost.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(costs.shippingCost / costs.totalCost) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Duties & Taxes</span>
                <span className="font-medium">${(costs.dutyAmount + costs.taxAmount).toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${((costs.dutyAmount + costs.taxAmount) / costs.totalCost) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Shipping Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Ship className="h-5 w-5 text-purple-600" />
              Shipping Alternatives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Express Air</span>
                <span className="text-sm text-green-600">3-5 days</span>
              </div>
              <p className="text-xs text-gray-500">Current selection</p>
              <p className="text-sm font-bold">${costs.shippingCost.toFixed(2)}</p>
            </div>
            
            <div className="p-3 border rounded-lg bg-blue-50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Standard Air</span>
                <span className="text-sm text-blue-600">7-10 days</span>
              </div>
              <p className="text-xs text-gray-500">Save 25%</p>
              <p className="text-sm font-bold">${(costs.shippingCost * 0.75).toFixed(2)}</p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Ocean Freight</span>
                <span className="text-sm text-orange-600">25-35 days</span>
              </div>
              <p className="text-xs text-gray-500">Save 60%</p>
              <p className="text-sm font-bold">${(costs.shippingCost * 0.40).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default CostBreakdown;


