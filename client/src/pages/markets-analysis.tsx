import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';

const MarketsAnalysis = () => {
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
            <CardTitle>Market Analysis</CardTitle>
            <CardDescription>
              Detailed market analysis and insights for international trade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Market Overview</h3>
                <p>
                  This page provides in-depth analysis of global markets and trade opportunities.
                  You can explore market trends, growth opportunities, and competitive analysis for
                  various regions and industries.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Regional Market Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-muted rounded flex items-center justify-center">
                      [Market Growth Chart Placeholder]
                    </div>
                    <p className="mt-4 text-sm">
                      Year-over-year growth analysis for key markets across different regions.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Market Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-muted rounded flex items-center justify-center">
                      [Market Comparison Chart Placeholder]
                    </div>
                    <p className="mt-4 text-sm">
                      Compare market potential, barriers to entry, and regulatory environments.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Comprehensive market size and growth projections</li>
                  <li>Competitor analysis and market share data</li>
                  <li>Consumer behavior and demographic trends</li>
                  <li>Supply chain and logistics insights</li>
                  <li>Regulatory and compliance environment overview</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Opportunity Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our proprietary Market Opportunity Score helps you identify the most promising
                markets for your products or services.
              </p>
              <Button>Generate Opportunity Report</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Use our AI-powered market analysis tools to uncover hidden trends and opportunities
                in global markets.
              </p>
              <Button variant="outline">
                <Link to="/ai-predictions" className="flex items-center">
                  Explore AI Predictions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default MarketsAnalysis;


