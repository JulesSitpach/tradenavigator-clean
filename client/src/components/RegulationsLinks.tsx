import React from 'react';

/**
 * Simple component with direct navigation links for regulations pages
 */
const RegulationsLinks = () => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg mb-6">
      <h2 className="text-lg font-semibold">Regulations Pages Navigation</h2>
      <div className="flex gap-4">
        <a 
          href="#regulations"
          className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm"
        >
          Basic Regulations
        </a>
        <a 
          href="#regulations-detailed"
          className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm"
        >
          Detailed Regulations
        </a>
        <a 
          href="#regulations-exemptions"
          className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm"
        >
          Exemptions
        </a>
      </div>
    </div>
  );
};

export default RegulationsLinks;
