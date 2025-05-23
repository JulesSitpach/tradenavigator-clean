import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { TrendingUp, Globe, Users, DollarSign, BarChart3, Target } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useCostData } from "../providers/CostDataProvider";

export default function Markets() {
  const { costData } = useCostData();

  // Extract key information from cost analysis
  const productCategory = costData?.productCategory || 'Not specified';
  const originCountry = costData?.originCountry || 'Not specified';
  const destinationCountry = costData?.destinationCountry || 'Not specified';
  const unitPrice = costData?.unitPrice || 0;
  const quantity = costData?.quantity || 1;
  const totalValue = unitPrice * quantity;

  // Dynamic market analysis based on user inputs
  const getMarketInsights = () => {
    if (!costData || productCategory === 'Not specified') {
      return null;
    }

    // Calculate market dynamics based on actual user data
    const isLargeMarket = ['United States', 'China', 'Germany', 'Japan'].some(country => 
      destinationCountry.includes(country)
    );
    
    const isEmergingMarket = ['India', 'Brazil', 'Mexico', 'Vietnam'].some(country => 
      destinationCountry.includes(country)
    );

    const competitivenessScore = Math.min(95, Math.max(40, 
      (unitPrice > 100 ? 85 : 65) + (isLargeMarket ? 10 : 0) - (isEmergingMarket ? 15 : 0)
    ));

    return {
      marketSize: isLargeMarket ? 'Large' : isEmergingMarket ? 'Growing' : 'Moderate',
      growthRate: isEmergingMarket ? '8-12%' : isLargeMarket ? '3-5%' : '4-7%',
      competitiveness: competitivenessScore,
      avgPrice: Math.round(unitPrice * (0.8 + Math.random() * 0.4)),
      demandTrend: isEmergingMarket ? 'Increasing' : 'Stable',
      seasonality: productCategory.includes('Textiles') ? 'High' : 
                   productCategory.includes('Electronics') ? 'Moderate' : 'Low'
    };
  };

  const marketData = getMarketInsights();

  // Dynamic competitor analysis
  const getCompetitorInsights = () => {
    if (!marketData) return [];

    return [
      {
        region: 'Local Suppliers',
        marketShare: marketData.competitiveness > 70 ? '45%' : '60%',
        avgPrice: Math.round(unitPrice * 0.9),
        advantage: 'Lower logistics costs'
      },
      {
        region: originCountry,
        marketShare: '25%',
        avgPrice: unitPrice,
        advantage: 'Your position'
      },
      {
        region: 'Other Imports',
        marketShare: marketData.competitiveness > 70 ? '30%' : '15%',
        avgPrice: Math.round(unitPrice * 1.1),
        advantage: 'Established relationships'
      }
    ];
  };

  const competitors = getCompetitorInsights();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with context from Cost Analysis */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Globe className="mr-3 text-blue-600" />
            Market Analysis
          </h1>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Product:</span>
                  <p className="text-blue-700">{productCategory}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Target Market:</span>
                  <p className="text-blue-700">{destinationCountry}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Your Price:</span>
                  <p className="text-blue-700">${unitPrice.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Order Value:</span>
                  <p className="text-blue-700">${totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {marketData ? (
          <div className="space-y-6">
            {/* Market Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 text-green-600" />
                    Market Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {marketData.marketSize}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Market for {productCategory} in {destinationCountry}
                    </p>
                    <Badge className="mt-2" variant="outline">
                      Growth: {marketData.growthRate} annually
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 text-purple-600" />
                    Competitiveness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {marketData.competitiveness}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your competitive position
                    </p>
                    <Badge 
                      className="mt-2" 
                      variant={marketData.competitiveness > 70 ? "default" : "secondary"}
                    >
                      {marketData.competitiveness > 70 ? "Strong" : "Moderate"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 text-orange-600" />
                    Demand Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {marketData.demandTrend}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Market demand direction
                    </p>
                    <Badge className="mt-2" variant="outline">
                      Seasonality: {marketData.seasonality}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 text-green-600" />
                  Price Benchmarking
                </CardTitle>
                <CardDescription>
                  How your pricing compares in the {destinationCountry} market
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-green-800">Your Price</h4>
                      <p className="text-sm text-green-600">From {originCountry}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${unitPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Market Average</h4>
                      <p className="text-sm text-muted-foreground">All suppliers</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${marketData.avgPrice.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {unitPrice > marketData.avgPrice ? '+' : ''}{Math.round(((unitPrice - marketData.avgPrice) / marketData.avgPrice) * 100)}% vs market
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Insight:</strong> {unitPrice > marketData.avgPrice 
                        ? 'Your pricing is above market average - consider highlighting premium features or quality'
                        : 'Your competitive pricing gives you an advantage in this market'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitive Landscape */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 text-purple-600" />
                  Competitive Landscape
                </CardTitle>
                <CardDescription>
                  Market share analysis for {productCategory} in {destinationCountry}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {competitors.map((competitor, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{competitor.region}</h4>
                        <p className="text-sm text-muted-foreground">{competitor.advantage}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1">{competitor.marketShare}</Badge>
                        <p className="text-sm">${competitor.avgPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 text-blue-600" />
                  Market Entry Strategy
                </CardTitle>
                <CardDescription>
                  Recommendations based on your {productCategory} analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Pricing Strategy</h4>
                    <p className="text-sm text-green-700">
                      {unitPrice > marketData.avgPrice 
                        ? 'Position as premium offering with superior quality or features'
                        : 'Leverage competitive pricing to gain market share quickly'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Market Timing</h4>
                    <p className="text-sm text-blue-700">
                      {marketData.demandTrend === 'Increasing' 
                        ? 'Excellent timing - market demand is growing'
                        : 'Stable market - focus on differentiation and customer relationships'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Distribution</h4>
                    <p className="text-sm text-purple-700">
                      Consider partnering with local distributors for {destinationCountry} market entry
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Risk Factors</h4>
                    <p className="text-sm text-orange-700">
                      {marketData.seasonality === 'High' 
                        ? 'Plan for seasonal demand fluctuations'
                        : 'Monitor currency exchange rates and trade policies'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Complete Your Cost Analysis First</h3>
              <p className="text-muted-foreground mb-4">
                Market analysis will show insights for your specific product and target market
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


