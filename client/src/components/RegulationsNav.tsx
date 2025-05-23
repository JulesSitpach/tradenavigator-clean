import React from 'react';

/**
 * A specialized component just for regulations navigation
 * Created to avoid routing complexity with the existing navigation
 */
export default function RegulationsNav() {
  const handleNavigation = (path: string) => {
    window.location.hash = path;
  };
  
  return (
    <div className="flex gap-4 mb-6">
      <button 
        onClick={() => handleNavigation('/regulations')}
        className="px-4 py-2 text-sm hover:bg-muted bg-card rounded-md"
      >
        Basic Regulations
      </button>
      <button 
        onClick={() => handleNavigation('/regulations-detailed')}
        className="px-4 py-2 text-sm hover:bg-muted bg-card rounded-md"
      >
        Detailed Regulations
      </button>
      <button 
        onClick={() => handleNavigation('/regulations-exemptions')}
        className="px-4 py-2 text-sm hover:bg-muted bg-card rounded-md"
      >
        Exemptions
      </button>
    </div>
  );
}
