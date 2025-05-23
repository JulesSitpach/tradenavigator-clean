import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AlertTriangle, CheckCircle2, FileText, Clock, Shield, Info } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useCostData } from "../providers/CostDataProvider";

export default function Regulations() {
  const { costData } = useCostData();

  // Extract key information from cost analysis
  const productCategory = costData?.productCategory || 'Not specified';
  const originCountry = costData?.originCountry || 'Not specified';
  const destinationCountry = costData?.destinationCountry || 'Not specified';
  const hsCode = costData?.hsCode || 'Not provided';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with context from Cost Analysis */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Shield className="mr-3 text-blue-600" />
            Basic Regulations
          </h1>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Product:</span>
                  <p className="text-blue-700">{productCategory}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">From:</span>
                  <p className="text-blue-700">{originCountry}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">To:</span>
                  <p className="text-blue-700">{destinationCountry}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">HS Code:</span>
                  <p className="text-blue-700">{hsCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Essential Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 text-green-600" />
                Essential Requirements
              </CardTitle>
              <CardDescription>
                Basic compliance checklist for importing {productCategory}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Commercial Invoice</h4>
                    <p className="text-sm text-muted-foreground">Detailed invoice with product description and value</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Packing List</h4>
                    <p className="text-sm text-muted-foreground">Complete list of contents and packaging details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Bill of Lading/Airway Bill</h4>
                    <p className="text-sm text-muted-foreground">Transportation document and title of goods</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Certificate of Origin</h4>
                    <p className="text-sm text-muted-foreground">May be required for preferential duty rates</p>
                    <Badge variant="outline" className="mt-1">Check trade agreements</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product-Specific Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 text-purple-600" />
                Product-Specific Permits
              </CardTitle>
              <CardDescription>
                Special requirements for {productCategory} imports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {costData && productCategory !== 'Not specified' ? (
                <div className="space-y-3">
                  {/* Dynamic requirements based on actual user input */}
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Category-Specific Requirements</h4>
                      <p className="text-sm text-muted-foreground">
                        Requirements for {productCategory} imported from {originCountry} to {destinationCountry}
                      </p>
                    </div>
                  </div>
                  
                  {/* Show relevant requirements based on destination country */}
                  {destinationCountry.includes('United States') && (
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">U.S. Import Requirements</h4>
                        <p className="text-sm text-muted-foreground">
                          Additional documentation may be required for {productCategory}
                        </p>
                        <Badge variant="outline" className="mt-1">Check with CBP</Badge>
                      </div>
                    </div>
                  )}
                  
                  {/* Show HS Code specific requirements */}
                  {hsCode && hsCode !== 'Not provided' && (
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">HS Code: {hsCode}</h4>
                        <p className="text-sm text-muted-foreground">
                          Classification-specific permits and licenses may apply
                        </p>
                        <Badge variant="outline" className="mt-1">Verify classification</Badge>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Complete your Cost Analysis first</p>
                  <p className="text-sm">Product-specific requirements will appear here based on your inputs</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/cost-analysis'}>
                    Go to Cost Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clearance Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 text-orange-600" />
                Clearance Timeline
              </CardTitle>
              <CardDescription>
                Expected customs processing times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Document Review</span>
                  <Badge variant="secondary">1-2 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Physical Inspection</span>
                  <Badge variant="secondary">2-24 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Duty Assessment</span>
                  <Badge variant="secondary">1-4 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Release Authorization</span>
                  <Badge variant="secondary">30 minutes</Badge>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Expected Time</span>
                    <Badge className="bg-green-100 text-green-800">4-30 hours</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Continue your import planning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 w-4 h-4" />
                View Detailed Regulations
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 w-4 h-4" />
                Check Available Exemptions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle2 className="mr-2 w-4 h-4" />
                Generate Compliance Checklist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}


