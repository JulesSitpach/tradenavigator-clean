import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BarChart3, PieChart, TrendingUp, Globe, DollarSign, Clock } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useCostData } from "../providers/CostDataProvider";

export default function Visualizations() {
  const { costData } = useCostData();

  // Extract key information from cost analysis
  const productCategory = costData?.productCategory || 'Not specified';
  const originCountry = costData?.originCountry || 'Not specified';
  const destinationCountry = costData?.destinationCountry || 'Not specified';
  const unitPrice = costData?.unitPrice || 0;
  const quantity = costData?.quantity || 1;
  const totalValue = unitPrice * quantity;
  const shippingMethod = costData?.shippingMethod || 'Not specified';
  const urgencyLevel = costData?.urgencyLevel || 'Not specified';

  // Generate cost breakdown data based on user inputs
  const getCostBreakdown = () => {
    if (!costData || productCategory === 'Not specified') return null;

    const baseShippingCost = shippingMethod.toLowerCase().includes('air') ? totalValue * 0.15 :
                            shippingMethod.toLowerCase().includes('express') ? totalValue * 0.25 :
                            totalValue * 0.08;

    const dutyRate = productCategory.includes('Electronics') ? 0.065 :
                    productCategory.includes('Textiles') ? 0.128 :
                    productCategory.includes('Automotive') ? 0.025 : 0.05;

    const duties = Math.round(totalValue * dutyRate);
    const shipping = Math.round(baseShippingCost);
    const insurance = Math.round(totalValue * 0.005);
    const handling = Math.round(totalValue * 0.02);
    const customs = 150;

    return [
      { category: 'Product Cost', amount: totalValue, percentage: Math.round((totalValue / (totalValue + duties + shipping + insurance + handling + customs)) * 100), color: '#3b82f6' },
      { category: 'Duties & Tariffs', amount: duties, percentage: Math.round((duties / (totalValue + duties + shipping + insurance + handling + customs)) * 100), color: '#ef4444' },
      { category: 'Shipping', amount: shipping, percentage: Math.round((shipping / (totalValue + duties + shipping + insurance + handling + customs)) * 100), color: '#10b981' },
      { category: 'Insurance', amount: insurance, percentage: Math.round((insurance / (totalValue + duties + shipping + insurance + handling + customs)) * 100), color: '#f59e0b' },
      { category: 'Handling', amount: handling, percentage: Math.round((handling / (totalValue + duties + shipping + insurance + handling + customs)) * 100), color: '#8b5cf6' },
      { category: 'Customs Fees', amount: customs, percentage: Math.round((customs / (totalValue + duties + shipping + insurance + handling + customs)) * 100), color: '#6b7280' }
    ];
  };

  // Generate timeline visualization data
  const getTimelineData = () => {
    if (!costData) return null;

    const baseTime = urgencyLevel.toLowerCase().includes('urgent') ? 5 :
                    urgencyLevel.toLowerCase().includes('standard') ? 14 : 30;

    const isAirShipping = shippingMethod.toLowerCase().includes('air');
    const isExpressShipping = shippingMethod.toLowerCase().includes('express');

    return [
      { phase: 'Order Processing', days: 2, color: '#3b82f6' },
      { phase: 'Manufacturing', days: isExpressShipping ? 3 : 7, color: '#10b981' },
      { phase: 'Shipping', days: isAirShipping ? 3 : isExpressShipping ? 2 : 21, color: '#f59e0b' },
      { phase: 'Customs Clearance', days: 2, color: '#ef4444' },
      { phase: 'Final Delivery', days: 1, color: '#8b5cf6' }
    ];
  };

  // Generate regional comparison data
  const getRegionalComparison = () => {
    if (!costData) return null;

    const baseCost = totalValue;
    
    return [
      { region: 'North America', totalCost: baseCost + (baseCost * 0.12), savings: 0, efficiency: 95 },
      { region: 'Europe', totalCost: baseCost + (baseCost * 0.18), savings: -6, efficiency: 88 },
      { region: 'Asia Pacific', totalCost: baseCost + (baseCost * 0.08), savings: 4, efficiency: 92 },
      { region: 'Latin America', totalCost: baseCost + (baseCost * 0.15), savings: -3, efficiency: 85 }
    ];
  };

  const costBreakdown = getCostBreakdown();
  const timelineData = getTimelineData();
  const regionalData = getRegionalComparison();

  // Calculate totals
  const totalCost = costBreakdown?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const totalDays = timelineData?.reduce((sum, item) => sum + item.days, 0) || 0;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with context from Cost Analysis */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <BarChart3 className="mr-3 text-indigo-600" />
            Trade Visualizations
          </h1>
          <Card className="bg-indigo-50 border-indigo-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-indigo-800">Product:</span>
                  <p className="text-indigo-700">{productCategory}</p>
                </div>
                <div>
                  <span className="font-medium text-indigo-800">Route:</span>
                  <p className="text-indigo-700">{originCountry} → {destinationCountry}</p>
                </div>
                <div>
                  <span className="font-medium text-indigo-800">Total Cost:</span>
                  <p className="text-indigo-700 font-bold">${totalCost.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-indigo-800">Timeline:</span>
                  <p className="text-indigo-700">{totalDays} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {costBreakdown ? (
          <div className="space-y-6">
            {/* Cost Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 text-indigo-600" />
                  Cost Breakdown Analysis
                </CardTitle>
                <CardDescription>
                  Visual breakdown of all costs for your {productCategory} import
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Visual Bar Chart */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Cost Distribution</h4>
                    {costBreakdown.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-sm">${item.amount.toLocaleString()} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${item.percentage}%`, 
                              backgroundColor: item.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Statistics */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Key Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">${totalCost.toLocaleString()}</div>
                        <p className="text-sm text-blue-700">Total Landed Cost</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {costBreakdown.find(item => item.category === 'Duties & Tariffs')?.percentage}%
                        </div>
                        <p className="text-sm text-red-700">Duty Rate Impact</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ${costBreakdown.find(item => item.category === 'Shipping')?.amount.toLocaleString()}
                        </div>
                        <p className="text-sm text-green-700">Shipping Costs</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(((totalCost - totalValue) / totalValue) * 100)}%
                        </div>
                        <p className="text-sm text-purple-700">Additional Costs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Visualization */}
            {timelineData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 text-orange-600" />
                    Delivery Timeline
                  </CardTitle>
                  <CardDescription>
                    Visual timeline for your {shippingMethod} shipment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Total Duration: {totalDays} days</span>
                      <Badge variant="secondary">{urgencyLevel} Priority</Badge>
                    </div>
                    
                    <div className="relative">
                      {/* Timeline visualization */}
                      <div className="flex items-center space-x-2 mb-6">
                        {timelineData.map((phase, index) => (
                          <div key={index} className="flex-1">
                            <div className="text-center">
                              <div 
                                className="h-8 rounded flex items-center justify-center text-white text-xs font-medium mb-2"
                                style={{ backgroundColor: phase.color }}
                              >
                                {phase.days} day{phase.days !== 1 ? 's' : ''}
                              </div>
                              <p className="text-xs text-muted-foreground">{phase.phase}</p>
                            </div>
                            {index < timelineData.length - 1 && (
                              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Detailed breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {timelineData.map((phase, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: phase.color }}
                              ></div>
                              <span className="text-sm font-medium">{phase.phase}</span>
                            </div>
                            <div className="text-lg font-bold">{phase.days} days</div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round((phase.days / totalDays) * 100)}% of total time
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Regional Comparison */}
            {regionalData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 text-green-600" />
                    Regional Cost Comparison
                  </CardTitle>
                  <CardDescription>
                    How your route compares to alternative regional options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionalData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <div>
                            <h4 className="font-medium">{region.region}</h4>
                            <p className="text-sm text-muted-foreground">
                              Efficiency: {region.efficiency}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            ${Math.round(region.totalCost).toLocaleString()}
                          </div>
                          <div className={`text-sm ${region.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {region.savings >= 0 ? '+' : ''}{region.savings}% vs current
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Optimization Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 text-purple-600" />
                  Optimization Insights
                </CardTitle>
                <CardDescription>
                  Visual insights for cost and time optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Cost Optimization</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      ${Math.round(totalCost * 0.15).toLocaleString()}
                    </div>
                    <p className="text-sm text-blue-700">
                      Potential savings with route optimization
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Time Optimization</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {Math.max(5, totalDays - 7)} days
                    </div>
                    <p className="text-sm text-green-700">
                      Faster delivery with express options
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-800">Efficiency Score</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {Math.round(85 + (Math.random() * 10))}%
                    </div>
                    <p className="text-sm text-purple-700">
                      Overall trade efficiency rating
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export & Share</CardTitle>
                <CardDescription>
                  Download or share your trade analysis visualizations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="mr-2 w-4 h-4" />
                    Export Charts as PDF
                  </Button>
                  <Button className="w-full" variant="outline">
                    <PieChart className="mr-2 w-4 h-4" />
                    Download Data as Excel
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Globe className="mr-2 w-4 h-4" />
                    Generate Presentation
                  </Button>
                  <Button className="w-full" variant="outline">
                    <TrendingUp className="mr-2 w-4 h-4" />
                    Share Analysis Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Complete Your Cost Analysis First</h3>
              <p className="text-muted-foreground mb-4">
                Trade visualizations will display interactive charts based on your specific import details
              </p>
              <Button onClick={() => window.location.href = '/cost-analysis'}>
                Go to Cost Analysis
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}


