import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAnalysis } from '../hooks/use-analysis';
import MainLayout from '../components/layouts/MainLayout';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Check, Ban } from 'lucide-react';

export default function RegulationsExemptions() {
  // Hooks
  const [, navigate] = useLocation();
  
  // Use our analysis context to access shared state
  const { state } = useAnalysis();
  
  // Generate exemptions based on cost analysis data
  const generateExemptions = () => {
    if (!state.costAnalysisResults) return [];
    
    const { originCountry, destinationCountry } = state.costAnalysisResults;
    
    return [
      {
        id: 9,
        title: "De Minimis Value Exemption",
        description: `Shipments valued under threshold may be exempt from duties in ${destinationCountry}`,
        applicable: Number(state.costAnalysisResults.value) < 800,
        threshold: `800 ${state.costAnalysisResults.currency}`,
        icon: Number(state.costAnalysisResults.value) < 800 ? <Check className="h-5 w-5 text-green-500" /> : <Ban className="h-5 w-5 text-gray-500" />
      },
      {
        id: 10,
        title: "Returned Goods Exemption",
        description: "Goods returning to the country of origin may be exempt from duties",
        applicable: originCountry === destinationCountry,
        icon: originCountry === destinationCountry ? <Check className="h-5 w-5 text-green-500" /> : <Ban className="h-5 w-5 text-gray-500" />
      },
      {
        id: 11,
        title: "Samples Exemption",
        description: "Commercial samples may be exempt if marked as 'No Commercial Value'",
        applicable: false,
        icon: <Ban className="h-5 w-5 text-gray-500" />
      },
      {
        id: 12,
        title: "Temporary Import Exemption",
        description: "Goods imported temporarily for exhibition, demonstration, or repair",
        applicable: false,
        icon: <Ban className="h-5 w-5 text-gray-500" />
      },
      {
        id: 13,
        title: "Educational Materials Exemption",
        description: "Books, publications, and other educational materials may qualify for duty exemption",
        applicable: state.currentProduct?.hsCode?.startsWith('49'),
        icon: state.currentProduct?.hsCode?.startsWith('49') ? <Check className="h-5 w-5 text-green-500" /> : <Ban className="h-5 w-5 text-gray-500" />
      },
      {
        id: 14,
        title: "Charitable Donation Exemption",
        description: "Goods imported for charitable purposes may be duty-exempt",
        applicable: false,
        icon: <Ban className="h-5 w-5 text-gray-500" />
      }
    ];
  };
  
  // Get the exemptions
  const exemptions = generateExemptions();
  
  // If no prior cost analysis, show redirection
  if (!state.currentProduct || !state.costAnalysisResults) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">No Shipment Information</h2>
            <p className="text-muted-foreground mb-8">
              To view duty exemptions, you need to complete a cost analysis first.
              This provides the necessary product and shipment information.
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
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="#" className="text-primary hover:underline mr-2">Dashboard</Link>
          <span className="mx-2">/</span>
          <span className="text-muted-foreground">Duty Exemptions</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Potential Duty Exemptions</h1>
          <Button 
            onClick={() => navigate('cost-analysis')}
            className="bg-primary text-primary-foreground"
          >
            Back to Cost Analysis
          </Button>
        </div>
        
        {/* Shipment Information Panel */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Shipment Information</h2>
            <div className="text-sm text-muted-foreground">
              Data from Cost Analysis
            </div>
          </div>
          
          {/* Show data received from Cost Analysis */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Imported Data from Cost Analysis</h3>
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
                <span className="font-medium block">Origin:</span> 
                {state.costAnalysisResults.originCountry || "N/A"}
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800">
                <span className="font-medium block">Destination:</span> 
                {state.costAnalysisResults.destinationCountry || "N/A"}
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800">
                <span className="font-medium block">Value:</span> 
                {state.costAnalysisResults.value} {state.costAnalysisResults.currency}
              </div>
            </div>
          </div>
        </div>
        
        {/* Exemptions Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Potential Duty Exemptions</CardTitle>
              <CardDescription>
                Conditions under which your shipment may qualify for duty exemptions or reductions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exemptions.map(exemption => (
                  <div key={exemption.id} className="flex items-start p-4 border border-border rounded-md">
                    <div className="mr-4 mt-1">{exemption.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{exemption.title}</h3>
                        <Badge variant={exemption.applicable ? "default" : "secondary"}>
                          {exemption.applicable ? "Applicable" : "Not Applicable"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{exemption.description}</p>
                      {exemption.threshold && (
                        <p className="text-sm mt-1">
                          <span className="font-medium">Threshold:</span> {exemption.threshold}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trade Agreements</CardTitle>
              <CardDescription>
                Agreements that may provide preferential treatment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-border rounded-md">
                <h3 className="font-medium">
                  {state.costAnalysisResults.originCountry} - {state.costAnalysisResults.destinationCountry} Trade Agreement
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Products qualifying under this agreement may be eligible for reduced or zero duty rates.
                  Requires Certificate of Origin and compliance with Rules of Origin.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between mt-6">
            <Button 
              onClick={() => navigate('regulations')}
              variant="outline"
            >
              View Basic Regulations
            </Button>
            <Button 
              onClick={() => navigate('regulations-detailed')}
              variant="outline"
            >
              View Detailed Regulations
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}


