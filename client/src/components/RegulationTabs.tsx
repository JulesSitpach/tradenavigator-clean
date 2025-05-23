import React from 'react';
import { useLocation } from 'wouter';
import { Button } from "../components/ui/button";

/**
 * A simple navigation component for regulations pages
 * Focuses just on direct navigation between regulations tabs
 */
export default function RegulationTabs() {
  const navigate = (path: string) => {
    // Use the simplest approach - directly setting window.location.hash
    window.location.hash = path;
  };

  // The styling matches the design system used in the rest of the app
  return (
    <div className="bg-card shadow-sm rounded-lg p-4 mb-6 flex justify-center space-x-4">
      <Button 
        variant="outline"
        onClick={() => navigate('regulations')}
        className="min-w-32"
      >
        Basic Regulations
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate('regulations-detailed')}
        className="min-w-32"
      >
        Detailed Regulations
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate('regulations-exemptions')}
        className="min-w-32"
      >
        Exemptions
      </Button>
    </div>
  );
}
