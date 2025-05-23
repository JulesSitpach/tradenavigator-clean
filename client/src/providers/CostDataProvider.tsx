import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for our cost data
export interface CostData {
  productCategory: string;
  productName: string;
  productDescription: string;
  hsCode: string;
  originCountry: string;
  destinationCountry: string;
  shippingMethod: string;
  incoterms: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  insuranceRequired: boolean;
  urgencyLevel: string;
  customsBroker: string;
  tradeAgreement: string;
}

// Initial empty state
const initialCostData: CostData = {
  productCategory: '',
  productName: '',
  productDescription: '',
  hsCode: '',
  originCountry: '',
  destinationCountry: '',
  shippingMethod: '',
  incoterms: '',
  quantity: 0,
  unitPrice: 0,
  totalValue: 0,
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0
  },
  insuranceRequired: false,
  urgencyLevel: '',
  customsBroker: '',
  tradeAgreement: ''
};

// Create the context
interface CostDataContextType {
  costData: CostData;
  setCostData: React.Dispatch<React.SetStateAction<CostData>>;
  isDataReady: boolean;
  setIsDataReady: React.Dispatch<React.SetStateAction<boolean>>;
}

const CostDataContext = createContext<CostDataContextType | undefined>(undefined);

// Create the provider component
export const CostDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [costData, setCostData] = useState<CostData>(initialCostData);
  const [isDataReady, setIsDataReady] = useState<boolean>(false);

  return (
    <CostDataContext.Provider value={{ costData, setCostData, isDataReady, setIsDataReady }}>
      {children}
    </CostDataContext.Provider>
  );
};

// Create a hook for using the context
export const useCostData = (): CostDataContextType => {
  const context = useContext(CostDataContext);
  if (context === undefined) {
    throw new Error('useCostData must be used within a CostDataProvider');
  }
  return context;
};
