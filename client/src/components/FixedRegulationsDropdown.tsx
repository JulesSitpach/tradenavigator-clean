import React from 'react';

/**
 * A dropdown component specifically for Regulations navigation
 * This uses direct hash manipulation for reliable navigation in the Replit environment
 */
const FixedRegulationsDropdown: React.FC = () => {
  const handleNavigate = (path: string) => {
    // Clean the path (remove any leading slashes)
    const cleanPath = path.replace(/^\/+/, '');
    // Set the hash directly
    window.location.hash = cleanPath;
  };
  
  return (
    <div className="fixed left-1/2 top-20 -translate-x-1/2 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3">Regulations Navigation</h3>
      <div className="flex flex-col gap-2">
        <button 
          className="px-4 py-2 text-left bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          onClick={() => handleNavigate('regulations')}
        >
          Basic Regulations
        </button>
        <button 
          className="px-4 py-2 text-left bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          onClick={() => handleNavigate('regulations-detailed')}
        >
          Detailed Regulations
        </button>
        <button 
          className="px-4 py-2 text-left bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          onClick={() => handleNavigate('regulations-exemptions')}
        >
          Exemptions
        </button>
      </div>
    </div>
  );
};

export default FixedRegulationsDropdown;
