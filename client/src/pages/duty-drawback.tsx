import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { RefreshCw, DollarSign, FileText, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useCostData } from "../providers/CostDataProvider";

export default function DutyDrawback() {
  const { costData } = useCostData();

  // Extract key information from cost analysis
  const productCategory = costData?.productCategory || 'Not specified';
  const originCountry = costData?.originCountry || 'Not specified';
  const destinationCountry = costData?.destinationCountry || 'Not specified';
  const unitPrice = costData?.unitPrice || 0;
  const quantity = costData?.quantity || 1;
  const totalValue = unitPrice * quantity;

  // Dynamic drawback eligibility assessment
  const getDrawbackEligibility = () => {
    if (!costData || productCategory === 'Not specified') {
      return null;
    }

    // Calculate potential duty paid (estimated)
    const estimatedDutyRate = productCategory.includes('Electronics') ? 0.065 : 
                             productCategory.includes('Textiles') ? 0.128 : 0.05;
    const dutyPaid = Math.round(totalValue * estimatedDutyRate);

    // Determine drawback types based on product and value
    const drawbackTypes = [];

    // Manufacturing Drawback (19 USC 1313(b))
    if (productCategory.includes('Electronics') || productCategory.includes('Machinery') || 
        productCategory.includes('Automotive') || totalValue > 10000) {
      drawbackTypes.push({
        type: 'Manufacturing Drawback',
        section: '19 USC 1313(b)',
        recoveryRate: 99,
        potentialRecovery: Math.round(dutyPaid * 0.99),
        requirements: [
          'Use imported materials in manufacturing',
          'Export finished products within 5 years',
          'Maintain detailed production records',
          'File drawback claim within 3 years of export'
        ],
        timeline: '6-12 months processing',
        eligibility: totalValue > 5000 ? 'High' : 'Medium',
        description: 'Recover duties on materials used to manufacture exported goods'
      });
    }

    // Substitution Manufacturing Drawback (19 USC 1313(j))
    if (totalValue > 25000) {
      drawbackTypes.push({
        type: 'Substitution Manufacturing',
        section: '19 USC 1313(j)',
        recoveryRate: 99,
        potentialRecovery: Math.round(dutyPaid * 0.99),
        requirements: [
          'Use substitutable merchandise of same kind and quality',
          'Export within 3 years of import',
          'Maintain inventory tracking systems',
          'Submit detailed manufacturing records'
        ],
        timeline: '8-14 months processing',
        eligibility: 'Medium',
        description: 'Use commercially interchangeable domestic materials for export production'
      });
    }

    // Rejected Merchandise Drawback (19 USC 1313(c))
    drawbackTypes.push({
      type: 'Rejected Merchandise',
      section: '19 USC 1313(c)',
      recoveryRate: 99,
      potentialRecovery: Math.round(dutyPaid * 0.99),
      requirements: [
        'Goods must be defective or not conform to specifications',
        'Export or destroy within 90 days of rejection',
        'Obtain CBP approval before destruction',
        'Provide evidence of rejection'
      ],
      timeline: '3-6 months processing',
      eligibility: 'High',
      description: 'Recover duties on defective or non-conforming imported goods'
    });

    // Unused Merchandise Drawback (19 USC 1313(j)(1))
    if (costData?.urgencyLevel !== 'Urgent') {
      drawbackTypes.push({
        type: 'Unused Merchandise',
        section: '19 USC 1313(j)(1)',
        recoveryRate: 99,
        potentialRecovery: Math.round(dutyPaid * 0.99),
        requirements: [
          'Goods must be exported in same condition as imported',
          'Export within 3 years of import',
          'No use in the United States',
          'Maintain chain of custody documentation'
        ],
        timeline: '4-8 months processing',
        eligibility: 'Medium',
        description: 'Recover duties on unused imported goods that are re-exported'
      });
    }

    return {
      dutyPaid,
      estimatedDutyRate: Math.round(estimatedDutyRate * 100),
      drawbackTypes,
      totalPotentialRecovery: Math.max(...drawbackTypes.map(d => d.potentialRecovery))
    };
  };

  const drawbackData = getDrawbackEligibility();

  // Calculate cost-benefit analysis
  const getCostBenefitAnalysis = () => {
    if (!drawbackData) return null;

    const administrativeCosts = Math.min(5000, Math.max(1500, totalValue * 0.02));
    const brokerFees = Math.round(drawbackData.totalPotentialRecovery * 0.15);
    const totalCosts = administrativeCosts + brokerFees;
    const netBenefit = drawbackData.totalPotentialRecovery - totalCosts;

    return {
      administrativeCosts,
      brokerFees,
      totalCosts,
      netBenefit,
      roi: Math.round((netBenefit / totalCosts) * 100)
    };
  };

  const costAnalysis = getCostBenefitAnalysis();

  const getEligibilityColor = (eligibility) => {
    switch (eligibility) {
      case 'High': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with context from Cost Analysis */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <RefreshCw className="mr-3 text-green-600" />
            Duty Drawback
          </h1>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-800">Product:</span>
                  <p className="text-green-700">{productCategory}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Import Value:</span>
                  <p className="text-green-700">${totalValue.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Estimated Duties:</span>
                  <p className="text-green-700">${drawbackData?.dutyPaid.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Recovery Potential:</span>
                  <p className="text-green-700 font-bold">${drawbackData?.totalPotentialRecovery.toLocaleString() || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {drawbackData ? (
          <div className="space-y-6">
            {/* Drawback Programs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="mr-2 text-green-600" />
                  Available Drawback Programs
                </CardTitle>
                <CardDescription>
                  Duty recovery opportunities for your {productCategory} imports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drawbackData.drawbackTypes.map((program, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-lg">{program.type}</h3>
                            <Badge className={getEligibilityColor(program.eligibility)}>
                              {program.eligibility} Eligibility
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                          <Badge variant="outline">{program.section}</Badge>
                        </div>
                        <div className="text-right ml-4">
                          <span className="font-bold text-green-600 text-xl">
                            ${program.potentialRecovery.toLocaleString()}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {program.recoveryRate}% recovery rate
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                          <ul className="text-sm space-y-1">
                            {program.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Processing Time:</span>
                              <Badge variant="secondary">{program.timeline}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Recovery Rate:</span>
                              <Badge variant="outline">{program.recoveryRate}%</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Legal Authority:</span>
                              <Badge variant="outline">{program.section}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        variant={program.eligibility === 'High' ? 'default' : 'outline'}
                      >
                        {program.eligibility === 'High' ? 'Start Application' : 'Learn More'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost-Benefit Analysis */}
            {costAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 text-blue-600" />
                    Cost-Benefit Analysis
                  </CardTitle>
                  <CardDescription>
                    Financial analysis of pursuing duty drawback claims
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Costs</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Administrative costs</span>
                          <span>${costAnalysis.administrativeCosts.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Broker/legal fees (15%)</span>
                          <span>${costAnalysis.brokerFees.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total Costs</span>
                            <span>${costAnalysis.totalCosts.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Benefits</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Duty recovery</span>
                          <span>${drawbackData.totalPotentialRecovery.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Original duty rate</span>
                          <span>{drawbackData.estimatedDutyRate}%</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium text-green-600">
                            <span>Net Benefit</span>
                            <span>${costAnalysis.netBenefit.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-800">Return on Investment</span>
                      <span className="text-2xl font-bold text-blue-600">{costAnalysis.roi}%</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      {costAnalysis.roi > 100 
                        ? 'Excellent ROI - strongly recommended to pursue drawback claims'
                        : costAnalysis.roi > 50 
                        ? 'Good ROI - drawback claims are financially beneficial'
                        : 'Consider higher volume operations to improve cost-effectiveness'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Process Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 text-purple-600" />
                  Drawback Process Timeline
                </CardTitle>
                <CardDescription>
                  Step-by-step process for claiming duty drawback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Import & Record Keeping</h4>
                      <p className="text-sm text-muted-foreground">
                        Import goods and maintain detailed records of duties paid and merchandise received
                      </p>
                      <Badge variant="outline" className="mt-1">Ongoing</Badge>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Manufacturing/Processing</h4>
                      <p className="text-sm text-muted-foreground">
                        Use imported materials in production or prepare for re-export
                      </p>
                      <Badge variant="outline" className="mt-1">1-12 months</Badge>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Export</h4>
                      <p className="text-sm text-muted-foreground">
                        Export finished products or unused merchandise within required timeframes
                      </p>
                      <Badge variant="outline" className="mt-1">Within 3-5 years</Badge>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium">File Drawback Claim</h4>
                      <p className="text-sm text-muted-foreground">
                        Submit Form 331 and supporting documentation to CBP
                      </p>
                      <Badge variant="outline" className="mt-1">Within 3 years of export</Badge>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">5</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Receive Refund</h4>
                      <p className="text-sm text-muted-foreground">
                        CBP processes claim and issues duty refund
                      </p>
                      <Badge className="mt-1 bg-green-100 text-green-800">6-12 months processing</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Implementation Steps</CardTitle>
                <CardDescription>
                  Get started with your duty drawback program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Record Keeping</h4>
                    <p className="text-sm text-green-700">
                      Establish detailed tracking systems for all imported materials and production processes
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Legal Compliance</h4>
                    <p className="text-sm text-blue-700">
                      Work with customs broker to ensure all requirements are met for chosen drawback type
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Export Planning</h4>
                    <p className="text-sm text-purple-700">
                      Develop export strategy that maximizes drawback benefits within time limits
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Documentation</h4>
                    <p className="text-sm text-orange-700">
                      Prepare comprehensive documentation package for CBP filing
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button className="w-full">
                    Start Drawback Program Setup
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 w-4 h-4" />
                    Download Documentation Checklist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <RefreshCw className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Complete Your Cost Analysis First</h3>
              <p className="text-muted-foreground mb-4">
                Duty drawback analysis will show recovery opportunities based on your import details
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


