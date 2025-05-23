import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function RegulationsMenu() {
  const handleNavigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Regulations Navigation</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary transition-colors">
            <CardHeader className="pb-2">
              <CardTitle>Basic Regulations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                View standard import/export requirements and documentation needed for international trade.
              </p>
              <button
                onClick={() => handleNavigate('regulations')}
                className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Go to Basic Regulations
              </button>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary transition-colors">
            <CardHeader className="pb-2">
              <CardTitle>Detailed Regulations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Explore comprehensive regulatory information including product-specific requirements.
              </p>
              <button
                onClick={() => handleNavigate('regulations-detailed')}
                className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Go to Detailed Regulations
              </button>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary transition-colors">
            <CardHeader className="pb-2">
              <CardTitle>Exemptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Check if your shipment qualifies for duty exemptions or special programs.
              </p>
              <button
                onClick={() => handleNavigate('regulations-exemptions')}
                className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Go to Exemptions
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}


