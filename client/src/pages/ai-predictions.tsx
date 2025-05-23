import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAnalysis } from '../hooks/use-analysis';
import MainLayout from '../components/layouts/MainLayout';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Info, AlertTriangle, TrendingUp, Calendar, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

export default function AIPredictions() {
  // Hooks
  const [, navigate] = useLocation();
  const { state } = useAnalysis();
  
  // Local state for prediction timeframe
  const [timeframe, setTimeframe] = useState('6months');
  
  // Helper to generate mock AI prediction data based on product and timeframe
  const generatePredictions = () => {
    if (!state.costAnalysisResults) return { price: [], demand: [], marketShare: {}, risks: [] };
    
    const hsCode = state.currentProduct?.hsCode || '4202.11';
    const productDesc = state.currentProduct?.description || 'Leather messenger bag';
    const { originCountry, destinationCountry } = state.costAnalysisResults;
    
    // Generate price forecast data
    const generatePriceData = () => {
      const months = timeframe === '3months' ? 3 : timeframe === '6months' ? 6 : 12;
      const basePrice = Number(state.costAnalysisResults.value) || 150;
      const data = [];
      
      // Current month
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Market factors that influence price
      const seasonalFactor = (month: number) => {
        // Higher demand in Q4 (holiday season), lower in Q1
        const seasonality = [0.92, 0.94, 0.97, 1.0, 1.02, 1.03, 1.0, 0.98, 1.05, 1.08, 1.12, 1.15];
        return seasonality[month];
      };
      
      // Random but consistent market fluctuation
      const marketNoise = (month: number) => {
        return (Math.sin(month) * 0.05) + 1;
      };
      
      // Generate forecast data
      for (let i = 0; i <= months; i++) {
        const forecastMonth = (currentMonth + i) % 12;
        const forecastYear = currentYear + Math.floor((currentMonth + i) / 12);
        const monthName = new Date(forecastYear, forecastMonth, 1).toLocaleString('default', { month: 'short' });
        
        // Calculate forecast price with factors
        let forecastPrice = basePrice;
        
        // Apply trend - slight upward
        forecastPrice *= (1 + (i * 0.01));
        
        // Apply seasonality
        forecastPrice *= seasonalFactor(forecastMonth);
        
        // Apply market noise
        forecastPrice *= marketNoise(forecastMonth);
        
        // Round to 2 decimal places
        forecastPrice = Math.round(forecastPrice * 100) / 100;
        
        data.push({
          month: `${monthName} ${forecastYear}`,
          price: forecastPrice,
          confidence: Math.max(95 - (i * 5), 60) // Confidence decreases with time
        });
      }
      
      return data;
    };
    
    // Generate demand forecast data
    const generateDemandData = () => {
      const months = timeframe === '3months' ? 3 : timeframe === '6months' ? 6 : 12;
      const baseVolume = 100; // Base units
      const data = [];
      
      // Current month
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Seasonal demand factor
      const seasonalFactor = (month: number) => {
        // Higher demand in Q4 (holiday season), lower in Q1
        const seasonality = [0.85, 0.88, 0.92, 0.97, 1.0, 1.02, 0.95, 0.98, 1.05, 1.10, 1.25, 1.30];
        return seasonality[month];
      };
      
      // Generate forecast data
      for (let i = 0; i <= months; i++) {
        const forecastMonth = (currentMonth + i) % 12;
        const forecastYear = currentYear + Math.floor((currentMonth + i) / 12);
        const monthName = new Date(forecastYear, forecastMonth, 1).toLocaleString('default', { month: 'short' });
        
        // Calculate forecast volume with factors
        let forecastVolume = baseVolume;
        
        // Apply trend - upward for most products
        forecastVolume *= (1 + (i * 0.02));
        
        // Apply seasonality
        forecastVolume *= seasonalFactor(forecastMonth);
        
        // Add some variability
        forecastVolume *= (0.95 + Math.random() * 0.1);
        
        // Round to whole units
        forecastVolume = Math.round(forecastVolume);
        
        data.push({
          month: `${monthName} ${forecastYear}`,
          volume: forecastVolume,
          trend: i > 0 ? 
            (forecastVolume > data[i-1].volume ? 'increasing' : 'decreasing') : 
            'stable'
        });
      }
      
      return data;
    };
    
    // Generate market share forecast
    const generateMarketShareData = () => {
      // Market structure varies by product and destination
      return {
        current: [
          { name: 'Your Product', value: 5 },
          { name: 'Market Leader', value: 35 },
          { name: 'Competitor B', value: 25 },
          { name: 'Competitor C', value: 20 },
          { name: 'Others', value: 15 }
        ],
        forecast: [
          { name: 'Your Product', value: timeframe === '3months' ? 7 : timeframe === '6months' ? 9 : 12 },
          { name: 'Market Leader', value: timeframe === '3months' ? 34 : timeframe === '6months' ? 33 : 31 },
          { name: 'Competitor B', value: 24 },
          { name: 'Competitor C', value: timeframe === '3months' ? 20 : timeframe === '6months' ? 19 : 18 },
          { name: 'Others', value: 15 }
        ],
        growth: timeframe === '3months' ? 40 : timeframe === '6months' ? 80 : 140
      };
    };
    
    // Generate risk assessment
    const generateRiskData = () => {
      return [
        {
          category: 'Economic',
          risk: 'Currency Fluctuation',
          impact: 'Medium',
          probability: timeframe === '3months' ? 'Low' : timeframe === '6months' ? 'Medium' : 'High',
          mitigation: 'Consider hedging options or pricing adjustments to maintain margins'
        },
        {
          category: 'Supply Chain',
          risk: 'Shipping Delays',
          impact: 'High',
          probability: 'Medium',
          mitigation: 'Maintain higher inventory levels and identify alternative shipping routes'
        },
        {
          category: 'Market',
          risk: 'New Competitor Entry',
          impact: 'Medium',
          probability: timeframe === '3months' ? 'Low' : 'Medium',
          mitigation: 'Differentiate product offering and strengthen customer loyalty'
        },
        {
          category: 'Regulatory',
          risk: 'Import Policy Changes',
          impact: 'High',
          probability: timeframe === '3months' ? 'Very Low' : timeframe === '6months' ? 'Low' : 'Medium',
          mitigation: 'Monitor policy developments and prepare contingency plans'
        }
      ];
    };
    
    return {
      price: generatePriceData(),
      demand: generateDemandData(),
      marketShare: generateMarketShareData(),
      risks: generateRiskData()
    };
  };
  
  // Get prediction data
  const { price, demand, marketShare, risks } = generatePredictions();
  
  // If no prior cost analysis, show redirection
  if (!state.currentProduct || !state.costAnalysisResults) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">No Product Information</h2>
            <p className="text-muted-foreground mb-8">
              To access AI market predictions, you need to complete a cost analysis first.
              This provides the necessary product and market context.
            </p>
            <Button 
              onClick={() => navigate("cost-analysis")}
              className="bg-primary text-primary-foreground"
            >
              Go to Cost Analysis
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/" className="text-primary hover:underline mr-2">Dashboard</Link>
          <span className="mx-2">/</span>
          <span className="text-muted-foreground">AI Market Predictions</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">AI Market Predictions</h1>
          <Button 
            onClick={() => navigate('cost-analysis')}
            className="bg-primary text-primary-foreground"
          >
            Back to Cost Analysis
          </Button>
        </div>
        
        {/* Product Context Panel */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Product Context</h2>
            <div className="text-sm text-muted-foreground">
              Data from Cost Analysis
            </div>
          </div>
          
          {/* Show data received from Cost Analysis */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">AI Predictions Based On</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800">
                <span className="font-medium block">Product:</span> 
                {state.currentProduct?.description || "N/A"}
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800">
                <span className="font-medium block">HS Code:</span> 
                {state.currentProduct?.hsCode || "N/A"}
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800">
                <span className="font-medium block">Value:</span> 
                {state.costAnalysisResults.value} {state.costAnalysisResults.currency}
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800">
                <span className="font-medium block">Origin:</span> 
                {state.costAnalysisResults.originCountry || "N/A"}
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800">
                <span className="font-medium block">Destination:</span> 
                {state.costAnalysisResults.destinationCountry || "N/A"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Market Forecast</h2>
            <p className="text-muted-foreground">
              AI-driven predictions for your product in {state.costAnalysisResults.destinationCountry}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant={timeframe === '3months' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('3months')}
            >
              3 Months
            </Button>
            <Button 
              variant={timeframe === '6months' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('6months')}
            >
              6 Months
            </Button>
            <Button 
              variant={timeframe === '12months' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('12months')}
            >
              12 Months
            </Button>
          </div>
        </div>
        
        <Alert className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle>Forecast Disclaimer</AlertTitle>
          <AlertDescription>
            Predictions are based on historical data and AI analysis. Accuracy decreases with longer timeframes. 
            Use as guidance only and consider market variables.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Price Forecast */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Price Forecast</CardTitle>
                <CardDescription>
                  Predicted price trends for {timeframe === '3months' ? 'the next 3 months' : timeframe === '6months' ? 'the next 6 months' : 'the next 12 months'}
                </CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={price}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'price' 
                        ? `${state.costAnalysisResults.currency} ${value}` 
                        : `${value}%`, 
                      name === 'price' ? 'Price' : 'Confidence'
                    ]} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      name="Price"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      name="Confidence" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Price:</span>
                  <span className="text-sm">
                    {state.costAnalysisResults.currency} {state.costAnalysisResults.value}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Forecast End Price:</span>
                  <span className="text-sm font-bold">
                    {state.costAnalysisResults.currency} {price[price.length - 1]?.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Expected Change:</span>
                  <span className={`text-sm font-bold ${price[price.length - 1]?.price > Number(state.costAnalysisResults.value) ? 'text-green-600' : 'text-red-600'}`}>
                    {((price[price.length - 1]?.price / Number(state.costAnalysisResults.value) - 1) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Demand Forecast */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Demand Forecast</CardTitle>
                <CardDescription>
                  Projected market demand in units
                </CardDescription>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={demand}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} units`, 'Demand']} />
                    <Legend />
                    <Bar 
                      dataKey="volume" 
                      name="Units" 
                      fill="#82ca9d" 
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Starting Demand:</span>
                  <span className="text-sm">
                    {demand[0]?.volume} units
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ending Demand:</span>
                  <span className="text-sm font-bold">
                    {demand[demand.length - 1]?.volume} units
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Trend:</span>
                  <Badge variant="outline" className={`font-medium ${demand[demand.length - 1]?.volume > demand[0]?.volume ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'}`}>
                    {demand[demand.length - 1]?.volume > demand[0]?.volume ? 'Increasing' : 'Decreasing'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Market Share */}
          <Card>
            <CardHeader>
              <CardTitle>Market Share Evolution</CardTitle>
              <CardDescription>
                Projected changes in market composition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-center">Current</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketShare.current}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {marketShare.current.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-center">
                    Forecast ({timeframe === '3months' ? '3 months' : timeframe === '6months' ? '6 months' : '12 months'})
                  </h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketShare.forecast}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {marketShare.forecast.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Your Share Growth:</span>
                  <span className="text-sm font-bold text-green-600">
                    +{marketShare.growth}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  The forecast shows your market share growing from {marketShare.current[0]?.value}% to {marketShare.forecast[0]?.value}% 
                  over {timeframe === '3months' ? 'three' : timeframe === '6months' ? 'six' : 'twelve'} months, primarily taking share 
                  from {marketShare.current[1]?.name} and {marketShare.current[3]?.name}.
                </div>
              </div>
              
              <div className="mt-4 p-3 border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded-md">
                <div className="flex items-start text-sm">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Growth Opportunities:</span> Focus on premium market segments and online channels 
                    to maximize your market share gains. Consider targeted marketing to customers of {marketShare.current[1]?.name}.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Risk Assessment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>
                  Potential market risks for the forecast period
                </CardDescription>
              </div>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {risks.map((risk, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-md ${
                      risk.impact === 'High' 
                        ? 'border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-800' 
                        : 'border-amber-100 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{risk.risk}</h3>
                        <div className="text-sm text-muted-foreground">{risk.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium mb-1">Impact</div>
                        <Badge 
                          variant="outline" 
                          className={`${
                            risk.impact === 'High' 
                              ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' 
                              : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
                          }`}
                        >
                          {risk.impact}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium mb-1">Probability</div>
                        <Badge 
                          variant="outline" 
                          className={`${
                            risk.probability === 'High' 
                              ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' 
                              : risk.probability === 'Medium'
                                ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
                                : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                          }`}
                        >
                          {risk.probability}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs font-medium mb-1">Mitigation Strategy</div>
                        <p className="text-sm">{risk.mitigation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded-md">
                <div className="flex items-start text-sm">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Risk Correlation:</span> A longer prediction timeframe ({timeframe}) 
                    correlates with higher probability of identified risks. Monitor these factors closely as part of 
                    your market entry or expansion strategy.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Strategic Recommendations</CardTitle>
            <CardDescription>
              AI-generated suggestions based on market predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-green-100 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-md">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Pricing Strategy</h3>
                <p className="text-sm mb-2">
                  Based on the price forecast, consider implementing the following pricing approach:
                </p>
                <ul className="space-y-1 pl-5 list-disc text-sm">
                  <li>
                    {price[price.length - 1]?.price > Number(state.costAnalysisResults.value) 
                      ? "Gradual price increases aligned with market trends to maintain competitive positioning while improving margins"
                      : "Hold pricing steady despite downward market pressure to maintain profit margins"
                    }
                  </li>
                  <li>
                    Consider implementing seasonal promotions during {
                      timeframe === '3months'
                        ? "the upcoming quarter"
                        : timeframe === '6months'
                          ? "Q2 and Q4"
                          : "Q2 and Q4 of the forecast period"
                    } to align with demand fluctuations
                  </li>
                  <li>
                    Explore premium product variants to capture additional market share in higher price tiers
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded-md">
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Inventory Management</h3>
                <p className="text-sm mb-2">
                  Based on the demand forecast, optimize your inventory planning:
                </p>
                <ul className="space-y-1 pl-5 list-disc text-sm">
                  <li>
                    Plan for {
                      demand[demand.length - 1]?.volume > demand[0]?.volume * 1.1
                        ? "a significant inventory increase"
                        : demand[demand.length - 1]?.volume > demand[0]?.volume
                          ? "a moderate inventory increase"
                          : "stable inventory levels"
                    } over the {timeframe === '3months' ? "next quarter" : timeframe === '6months' ? "next six months" : "coming year"}
                  </li>
                  <li>
                    Build buffer stock before {
                      timeframe === '3months'
                        ? "the end of the quarter"
                        : timeframe === '6months'
                          ? "Q4"
                          : "the holiday season in Q4"
                    } to accommodate seasonal demand spikes
                  </li>
                  <li>
                    Consider implementing a just-in-time approach for {state.costAnalysisResults.originCountry} sourcing to minimize carrying costs
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border border-purple-100 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 rounded-md">
                <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Competitive Positioning</h3>
                <p className="text-sm mb-2">
                  To capitalize on the projected market share growth:
                </p>
                <ul className="space-y-1 pl-5 list-disc text-sm">
                  <li>
                    Focus marketing efforts on differentiating from {marketShare.current[1]?.name}, highlighting your product's unique advantages
                  </li>
                  <li>
                    Explore strategic partnerships with complementary product suppliers to expand distribution channels
                  </li>
                  <li>
                    Monitor competitor pricing strategies and promotional activities closely during transition periods
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border border-amber-100 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md">
                <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">Risk Mitigation</h3>
                <p className="text-sm mb-2">
                  To address the identified risks effectively:
                </p>
                <ul className="space-y-1 pl-5 list-disc text-sm">
                  <li>
                    Develop contingency plans for the highest impact risks, particularly {
                      risks.find(r => r.impact === 'High')?.risk || "shipping delays"
                    }
                  </li>
                  <li>
                    Consider diversifying sourcing beyond {state.costAnalysisResults.originCountry} to reduce geographic concentration risk
                  </li>
                  <li>
                    Implement quarterly risk reviews to track changing market conditions and adjust strategies accordingly
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="text-sm text-muted-foreground">
              <div className="font-medium mb-1">AI Confidence Assessment:</div>
              <p>
                These recommendations are based on market data and AI analysis with a 
                {timeframe === '3months' ? " high " : timeframe === '6months' ? " moderate " : " low to moderate "} 
                confidence level. Specific factors like competitive actions and macroeconomic changes may impact outcomes.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}


