import React from 'react';
import { useLocation } from 'wouter';
import { useAnalysis } from '../hooks/use-analysis';
import MainLayout from '../components/layouts/MainLayout';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Check, Info, AlertTriangle, Ban } from 'lucide-react';

export default function RegulationsDetailed() {
  // Hooks
  const [, navigate] = useLocation();
  
  // Use our analysis context to access shared state
  const { state } = useAnalysis();
  
  // Generate detailed regulatory requirements based on cost analysis data
  const generateDetailedRequirements = () => {
    if (!state.costAnalysisResults) return [];
    
    const { originCountry, destinationCountry } = state.costAnalysisResults;
    const productCategory = state.currentProduct?.hsCode?.substring(0, 2) || "42";
    
    // Detailed regulations
    return [
      {
        id: 5,
        title: "Import License",
        description: `Authorization from ${destinationCountry} for importing specific goods`,
        required: productCategory === "42" ? false : true,
        status: productCategory === "42" ? "Not Required" : "Required",
        icon: productCategory === "42" ? <Info className="h-5 w-5 text-blue-500" /> : <Check className="h-5 w-5 text-green-500" />
      },
      {
        id: 6,
        title: "Sanitary/Phytosanitary Certificate",
        description: "Certifies that products meet health standards",
        required: false,
        status: "Not Applicable",
        icon: <Ban className="h-5 w-5 text-gray-500" />
      },
      {
        id: 7,
        title: "Dangerous Goods Declaration",
        description: "Required for hazardous materials",
        required: false,
        status: "Not Applicable",
        icon: <Ban className="h-5 w-5 text-gray-500" />
      },
      {
        id: 8,
        title: productCategory === "42" ? "Leather Products Certification" : "Product Certification",
        description: `Confirms compliance with ${destinationCountry} standards`,
        required: true,
        status: "Required",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
      },
      {
        id: 9,
        title: "Labeling Requirements",
        description: `Product labels must comply with ${destinationCountry} regulations`,
        required: true,
        status: "Required",
        icon: <Check className="h-5 w-5 text-green-500" />
      },
      {
        id: 10,
        title: "Safety Standards Certification",
        description: `Proof of compliance with safety standards in ${destinationCountry}`,
        required: productCategory === "85" || productCategory === "84",
        status: productCategory === "85" || productCategory === "84" ? "Required" : "Not Required",
        icon: productCategory === "85" || productCategory === "84" ? <Check className="h-5 w-5 text-green-500" /> : <Info className="h-5 w-5 text-blue-500" />
      }
    ];
  };
  
  // Get the regulatory requirements
  const detailedRegs = generateDetailedRequirements();
  
  // If no prior cost analysis, show redirection
  if (!state.currentProduct || !state.costAnalysisResults) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">No Shipment Information</h2>
            <p className="text-muted-foreground mb-8">
              To view detailed regulatory requirements, you need to complete a cost analysis first.
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
          <a href="#" className="text-primary hover:underline mr-2">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-muted-foreground">Detailed Regulations</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Detailed Regulatory Requirements</h1>
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
        
        {/* Detailed Regulations Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Documentation</CardTitle>
              <CardDescription>
                Specific certificates and licenses that may be required based on product category and destination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detailedRegs.map(reg => (
                  <div key={reg.id} className="flex items-start p-4 border border-border rounded-md">
                    <div className="mr-4 mt-1">{reg.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{reg.title}</h3>
                        <Badge variant={reg.required ? "default" : "secondary"}>
                          {reg.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{reg.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Compliance Notes</CardTitle>
              <CardDescription>
                Additional information about regulatory compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-md">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Important Compliance Information
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-2">
                  Products shipped to {state.costAnalysisResults.destinationCountry} may be subject to additional inspection
                  upon arrival. Ensure all documentation is accurate and complete to avoid delays at customs.
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-2">
                  For HS Code {state.currentProduct?.hsCode}, additional permits may be required if the product contains 
                  protected species or restricted materials. Check with customs broker for specific requirements.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between mt-6">
            <Button 
              onClick={() => window.location.hash = '/regulations'}
              variant="outline"
            >
              View Basic Regulations
            </Button>
            <Button 
              onClick={() => window.location.hash = '/regulations-exemptions'}
              variant="outline"
            >
              View Exemptions
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}


