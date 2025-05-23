import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Plane, Ship, Truck, Clock, DollarSign, MapPin, Route } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCostData } from '../../providers/CostDataProvider';

export default function RouteAnalysis() {
  const { costData } = useCostData();

  // Extract key information from cost analysis
  const productCategory = costData?.productCategory || 'Not specified';
  const originCountry = costData?.originCountry || 'Not specified';
  const destinationCountry = costData?.destinationCountry || 'Not specified';
  const shippingMethod = costData?.shippingMethod || 'Not specified';
  const urgencyLevel = costData?.urgencyLevel || 'Not specified';
  const unitPrice = costData?.unitPrice || 0;
  const quantity = costData?.quantity || 1;
  const totalValue = unitPrice * quantity;

  // Dynamic route calculations based on user inputs
  const getRouteOptions = () => {
    if (!costData || originCountry === 'Not specified' || destinationCountry === 'Not specified') {
      return [];
    }

    const baseDistance = 5000; // Approximate distance for calculations
    const selectedMethod = shippingMethod.toLowerCase();
    const isUrgent = urgencyLevel.toLowerCase().includes('urgent') || urgencyLevel.toLowerCase().includes('express');

    return [
      {
        method: 'Ocean Freight',
        icon: Ship,
        transitTime: isUrgent ? '12-18 days' : '18-25 days',
        cost: Math.round((totalValue * 0.08) + 500),
        reliability: '95%',
        recommended: selectedMethod.includes('ocean') && !isUrgent,
        carbonFootprint: 'Low',
        notes: `Best for large shipments from ${originCountry}`
      },
      {
        method: 'Air Freight',
        icon: Plane,
        transitTime: isUrgent ? '2-4 days' : '5-7 days',
        cost: Math.round((totalValue * 0.15) + 800),
        reliability: '98%',
        recommended: selectedMethod.includes('air') || isUrgent,
        carbonFootprint: 'High',
        notes: `Fastest option for ${productCategory}`
      },
      {
        method: 'Express Courier',
        icon: Truck,
        transitTime: isUrgent ? '1-3 days' : '3-5 days',
        cost: Math.round((totalValue * 0.12) + 200),
        reliability: '99%',
        recommended: urgencyLevel.toLowerCase().includes('urgent') && totalValue < 10000,
        carbonFootprint: 'Medium',
        notes: 'Door-to-door service with tracking'
      }
    ];
  };

  const routeOptions = getRouteOptions();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with context from Cost Analysis */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Route className="mr-3 text-purple-600" />
            Alternative Routes
          </h1>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="font-medium text-purple-800">Product:</span>
                  <p className="text-purple-700">{productCategory}</p>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Route:</span>
                  <p className="text-purple-700">{originCountry} → {destinationCountry}</p>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Selected Method:</span>
                  <p className="text-purple-700">{shippingMethod}</p>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Urgency:</span>
                  <p className="text-purple-700">{urgencyLevel}</p>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Value:</span>
                  <p className="text-purple-700">${totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {routeOptions.length > 0 ? (
          <div className="space-y-6">
            {/* Route Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {routeOptions.map((route, index) => (
                <Card key={index} className={`relative ${route.recommended ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
                  {route.recommended && (
                    <Badge className="absolute -top-2 left-4 bg-green-500 text-white">
                      Best Match
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <route.icon className="mr-2 text-purple-600" />
                      {route.method}
                    </CardTitle>
                    <CardDescription>{route.notes}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-orange-500" />
                          Transit Time
                        </span>
                        <Badge variant="outline">{route.transitTime}</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                          Estimated Cost
                        </span>
                        <Badge variant="outline">${route.cost.toLocaleString()}</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Reliability</span>
                        <Badge variant="secondary">{route.reliability}</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Carbon Impact</span>
                        <Badge 
                          variant="outline"
                          className={
                            route.carbonFootprint === 'Low' ? 'border-green-500 text-green-700' :
                            route.carbonFootprint === 'Medium' ? 'border-orange-500 text-orange-700' :
                            'border-red-500 text-red-700'
                          }
                        >
                          {route.carbonFootprint}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button 
                      variant={route.recommended ? "default" : "outline"} 
                      className="w-full"
                    >
                      {route.recommended ? 'Select This Route' : 'Get Quote'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Route Optimization Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 text-blue-600" />
                  Optimization Recommendations
                </CardTitle>
                <CardDescription>
                  Based on your {productCategory} shipment from {originCountry} to {destinationCountry}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Cost Optimization</h4>
                    <p className="text-sm text-blue-700">
                      {urgencyLevel.toLowerCase().includes('urgent') 
                        ? 'Consider consolidating shipments for better rates on future orders'
                        : 'Ocean freight offers the best value for your timeline'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Time Optimization</h4>
                    <p className="text-sm text-green-700">
                      {urgencyLevel.toLowerCase().includes('urgent')
                        ? 'Express courier recommended for your urgent timeline'
                        : 'Plan 2-3 weeks ahead to use cost-effective ocean freight'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Risk Management</h4>
                    <p className="text-sm text-purple-700">
                      Consider insurance for shipments over $5,000 value
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Sustainability</h4>
                    <p className="text-sm text-orange-700">
                      Ocean freight reduces carbon footprint by 90% vs air freight
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Route className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Complete Your Cost Analysis First</h3>
              <p className="text-muted-foreground mb-4">
                Route analysis will show personalized shipping options based on your product and requirements
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



