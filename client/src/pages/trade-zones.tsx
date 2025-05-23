import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, Factory, Truck, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useCostData } from "../providers/CostDataProvider";

export default function TradeZones() {
  const { costData } = useCostData();

  // Extract key information from cost analysis
  const productCategory = costData?.productCategory || 'Not specified';
  const originCountry = costData?.originCountry || 'Not specified';
  const destinationCountry = costData?.destinationCountry || 'Not specified';
  const unitPrice = costData?.unitPrice || 0;
  const quantity = costData?.quantity || 1;
  const totalValue = unitPrice * quantity;
  const urgencyLevel = costData?.urgencyLevel || 'Not specified';

  // Dynamic trade zone recommendations based on user's actual data
  const getTradeZoneOptions = () => {
    if (!costData || destinationCountry === 'Not specified') {
      return [];
    }

    const zones = [];

    // Major US trade zones based on destination
    if (destinationCountry.includes('United States')) {
      // East Coast zones
      if (destinationCountry.includes('New York') || destinationCountry.includes('Northeast')) {
        zones.push({
          name: 'Foreign Trade Zone 1 - New York/Newark',
          location: 'New York/New Jersey Port Area',
          distance: '5 miles from port',
          benefits: ['Duty deferral', 'Duty elimination on re-exports', 'Reduced inventory carrying costs'],
          savings: Math.round(totalValue * 0.07),
          setupTime: '2-4 weeks',
          features: ['General Purpose Zone', 'Manufacturing allowed', '24/7 operations'],
          icon: MapPin
        });
      }

      // West Coast zones
      if (destinationCountry.includes('California') || destinationCountry.includes('Los Angeles')) {
        zones.push({
          name: 'Foreign Trade Zone 202 - Los Angeles',
          location: 'Los Angeles/Long Beach Port Complex',
          distance: '3 miles from port',
          benefits: ['Manufacturing zone', 'Value-added processing', 'Inverted tariff benefits'],
          savings: Math.round(totalValue * 0.09),
          setupTime: '3-5 weeks',
          features: ['Manufacturing Subzone', 'Asian trade specialization', 'Automotive focus'],
          icon: Factory
        });
      }

      // Gulf Coast zones
      if (destinationCountry.includes('Texas') || destinationCountry.includes('Houston')) {
        zones.push({
          name: 'Foreign Trade Zone 84 - Houston',
          location: 'Port of Houston Authority',
          distance: '2 miles from port',
          benefits: ['Petrochemical processing', 'Energy sector focus', 'NAFTA advantages'],
          savings: Math.round(totalValue * 0.06),
          setupTime: '2-3 weeks',
          features: ['Energy specialization', 'Chemical processing', 'Rail connectivity'],
          icon: Factory
        });
      }

      // Midwest zones
      if (destinationCountry.includes('Chicago') || destinationCountry.includes('Illinois')) {
        zones.push({
          name: 'Foreign Trade Zone 22 - Chicago',
          location: 'Chicago Area Port District',
          distance: '10 miles from O\'Hare Airport',
          benefits: ['Central distribution', 'Multi-modal transport', 'Manufacturing hub'],
          savings: Math.round(totalValue * 0.05),
          setupTime: '3-4 weeks',
          features: ['Distribution center', 'Air cargo focus', 'Midwest gateway'],
          icon: Truck
        });
      }
    }

    // If no specific zones found, add a general option
    if (zones.length === 0 && destinationCountry.includes('United States')) {
      zones.push({
        name: 'Nearest Available FTZ',
        location: 'To be determined based on your location',
        distance: 'Varies by location',
        benefits: ['Duty deferral', 'Reduced carrying costs', 'Customs flexibility'],
        savings: Math.round(totalValue * 0.04),
        setupTime: '2-6 weeks',
        features: ['General purpose', 'Standard benefits', 'Basic operations'],
        icon: MapPin
      });
    }

    return zones;
  };

  const tradeZones = getTradeZoneOptions();

  // Calculate manufacturing benefits based on product category
  const getManufacturingBenefits = () => {
    if (!costData || productCategory === 'Not specified') return null;

    const benefits = [];

    if (productCategory.includes('Electronics') || productCategory.includes('Machinery')) {
      benefits.push({
        process: 'Assembly Operations',
        dutyBenefit: 'Pay duty only on final product classification',
        savings: Math.round(totalValue * 0.12),
        description: 'Assemble components with potentially lower duty rates'
      });
    }

    if (productCategory.includes('Textiles') || productCategory.includes('Automotive')) {
      benefits.push({
        process: 'Value-Added Processing',
        dutyBenefit: 'Inverted tariff relief',
        savings: Math.round(totalValue * 0.08),
        description: 'Process raw materials into finished goods with duty advantages'
      });
    }

    if (totalValue > 50000) {
      benefits.push({
        process: 'Bulk Breaking & Repackaging',
        dutyBenefit: 'Duty deferral until withdrawal',
        savings: Math.round(totalValue * 0.03),
        description: 'Import in bulk, repackage for distribution without immediate duty payment'
      });
    }

    return benefits;
  };

  const manufacturingBenefits = getManufacturingBenefits();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with context from Cost Analysis */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Factory className="mr-3 text-blue-600" />
            Trade Zones
          </h1>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Product:</span>
                  <p className="text-blue-700">{productCategory}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Destination:</span>
                  <p className="text-blue-700">{destinationCountry}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Value:</span>
                  <p className="text-blue-700">${totalValue.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Urgency:</span>
                  <p className="text-blue-700">{urgencyLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {tradeZones.length > 0 ? (
          <div className="space-y-6">
            {/* Available Trade Zones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 text-blue-600" />
                  Recommended Trade Zones
                </CardTitle>
                <CardDescription>
                  Foreign Trade Zones near your {destinationCountry} destination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tradeZones.map((zone, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <zone.icon className="w-6 h-6 text-blue-600 mt-1" />
                          <div>
                            <h3 className="font-medium text-lg">{zone.name}</h3>
                            <p className="text-sm text-muted-foreground">{zone.location}</p>
                            <Badge variant="outline" className="mt-1">{zone.distance}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-600 text-lg">
                            ${zone.savings.toLocaleString()}
                          </span>
                          <p className="text-sm text-muted-foreground">Potential annual savings</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Key Benefits:</h4>
                          <ul className="text-sm space-y-1">
                            {zone.benefits.map((benefit, benefitIndex) => (
                              <li key={benefitIndex} className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Zone Features:</h4>
                          <div className="space-y-1">
                            {zone.features.map((feature, featureIndex) => (
                              <Badge key={featureIndex} variant="secondary" className="mr-1 mb-1">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3">
                            <Badge className="flex items-center w-fit">
                              <Clock className="w-3 h-3 mr-1" />
                              Setup: {zone.setupTime}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full">
                        Request Zone Information Package
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Manufacturing Benefits */}
            {manufacturingBenefits && manufacturingBenefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Factory className="mr-2 text-purple-600" />
                    Manufacturing Zone Benefits
                  </CardTitle>
                  <CardDescription>
                    Additional savings opportunities for {productCategory} processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {manufacturingBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex-1">
                          <h4 className="font-medium text-purple-800">{benefit.process}</h4>
                          <p className="text-sm text-purple-600 mt-1">{benefit.description}</p>
                          <Badge variant="outline" className="mt-2">{benefit.dutyBenefit}</Badge>
                        </div>
                        <div className="text-right ml-4">
                          <span className="font-bold text-purple-600 text-lg">
                            ${benefit.savings.toLocaleString()}
                          </span>
                          <p className="text-sm text-muted-foreground">Additional savings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost-Benefit Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 text-green-600" />
                  Cost-Benefit Analysis
                </CardTitle>
                <CardDescription>
                  Financial impact of using trade zones for your imports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Annual Costs</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Zone admission fees</span>
                        <span>$2,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Inventory carrying costs</span>
                        <span>${Math.round(totalValue * 0.02).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Additional handling</span>
                        <span>$1,500</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total Annual Costs</span>
                          <span>${(4000 + Math.round(totalValue * 0.02)).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Annual Benefits</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Duty deferral savings</span>
                        <span>${Math.round(totalValue * 0.05).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Inventory cost reduction</span>
                        <span>${Math.round(totalValue * 0.03).toLocaleString()}</span>
                      </div>
                      {manufacturingBenefits && (
                        <div className="flex justify-between">
                          <span className="text-sm">Manufacturing benefits</span>
                          <span>${Math.round(totalValue * 0.04).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-medium text-green-600">
                          <span>Total Annual Benefits</span>
                          <span>${Math.round(totalValue * (manufacturingBenefits ? 0.12 : 0.08)).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-800">Net Annual Savings</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${Math.max(0, Math.round(totalValue * (manufacturingBenefits ? 0.12 : 0.08)) - (4000 + Math.round(totalValue * 0.02))).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    {Math.max(0, Math.round(totalValue * (manufacturingBenefits ? 0.12 : 0.08)) - (4000 + Math.round(totalValue * 0.02))) > 0 
                      ? 'Trade zone usage is financially beneficial for your operation'
                      : 'Consider higher volume or manufacturing activities to maximize benefits'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Implementation Steps</CardTitle>
                <CardDescription>
                  How to get started with trade zone benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Phase 1: Evaluation</h4>
                    <p className="text-sm text-blue-700">
                      Assess volume requirements and select optimal zone location
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Phase 2: Application</h4>
                    <p className="text-sm text-green-700">
                      Submit admission application and establish operating procedures
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Phase 3: Setup</h4>
                    <p className="text-sm text-purple-700">
                      Coordinate with zone operator and customs for initial operations
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Phase 4: Operations</h4>
                    <p className="text-sm text-orange-700">
                      Begin zone operations with ongoing compliance monitoring
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button className="w-full">
                    Start Trade Zone Application Process
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule Zone Facility Tour
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Factory className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Complete Your Cost Analysis First</h3>
              <p className="text-muted-foreground mb-4">
                Trade zone analysis will show cost savings opportunities based on your destination and product details
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


