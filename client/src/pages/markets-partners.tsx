import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';

const MarketsPartners = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link to="/markets" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Markets
          </Link>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Trade Partner Recommendations</CardTitle>
            <CardDescription>
              Find ideal trade partners based on your business profile and market needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Partner Matching System</h3>
                <p>
                  Our intelligent partner matching system analyzes thousands of potential trade partners
                  across global markets to identify the best matches for your specific business needs,
                  product portfolio, and growth targets.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Partner Quality Scores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-muted rounded flex items-center justify-center">
                      [Partner Quality Chart Placeholder]
                    </div>
                    <p className="mt-4 text-sm">
                      Partners are scored based on reliability, market reach, and business compatibility.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Regional Partner Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-muted rounded flex items-center justify-center">
                      [Regional Distribution Chart Placeholder]
                    </div>
                    <p className="mt-4 text-sm">
                      View potential partners by region to identify geographic coverage opportunities.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Key Benefits</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Identify partners with complementary business models</li>
                  <li>Find distributors with established channels in your target markets</li>
                  <li>Connect with suppliers offering favorable terms and reliable delivery</li>
                  <li>Discover logistics partners with experience in your product category</li>
                  <li>Evaluate potential partners based on verified performance metrics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Partner Compatibility Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our compatibility analysis evaluates cultural fit, business alignment, and operational
                compatibility to ensure successful long-term partnerships.
              </p>
              <Button>Run Compatibility Analysis</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Partner Introduction Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Let our team facilitate warm introductions to vetted partners who match your
                specific requirements and business objectives.
              </p>
              <Button variant="outline">Request Introductions</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default MarketsPartners;


