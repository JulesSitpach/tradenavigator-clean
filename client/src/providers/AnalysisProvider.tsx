import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Analysis } from '@shared/schema';
import { useToast } from '../hooks/use-toast';
import { apiRequest } from '../lib/queryClient';

// Define the types for our analysis state
interface AnalysisState {
  // Product and shipment details
  currentProduct: Product | null;
  currentAnalysis: Analysis | null;
  
  // Analysis results for different modules
  costAnalysisResults: any | null;
  tariffAnalysisResults: any | null;
  routeAnalysisResults: any | null;
  regulationsResults: any | null;
  specialProgramsResults: any | null;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
}

// Define the context interface with state and methods
interface AnalysisContextType {
  state: AnalysisState;
  setCurrentProduct: (product: Product | null) => void;
  setCurrentAnalysis: (analysis: Analysis | null) => void;
  saveAnalysis: (type: string, data: any) => Promise<void>;
  loadProductAndAnalysis: (productId?: number, analysisId?: number) => Promise<void>;
  updateCostAnalysisResults: (results: any) => void;
  updateTariffAnalysisResults: (results: any) => void;
  updateRouteAnalysisResults: (results: any) => void;
  updateRegulationsResults: (results: any) => void;
  updateSpecialProgramsResults: (results: any) => void;
  clearAllData: () => void;
  // Test methods for data flow simulation
  updateCurrentProduct: (data: any) => void;
  clearRouteAnalysisResults: () => void;
  clearTariffAnalysisResults: () => void;
}

// Create the context with a default value
const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

// Initial state for the analysis
const initialState: AnalysisState = {
  currentProduct: null,
  currentAnalysis: null,
  costAnalysisResults: null,
  tariffAnalysisResults: null,
  routeAnalysisResults: null,
  regulationsResults: null,
  specialProgramsResults: null,
  isLoading: false,
  error: null,
};

// The provider component that will wrap the application
export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AnalysisState>(initialState);
  const { toast } = useToast();

  // Load any existing analysis from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('analysisState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setState(parsedState);
      } catch (error) {
        console.error('Failed to parse saved analysis state:', error);
      }
    }
  }, []);

  // Save state to local storage when it changes
  useEffect(() => {
    // Don't save if we're in the initial state
    if (state.currentProduct !== null || state.currentAnalysis !== null) {
      localStorage.setItem('analysisState', JSON.stringify(state));
    }
  }, [state]);

  // Set the current product
  const setCurrentProduct = (product: Product | null) => {
    setState(prevState => ({
      ...prevState,
      currentProduct: product,
    }));
  };

  // Set the current analysis
  const setCurrentAnalysis = (analysis: Analysis | null) => {
    setState(prevState => ({
      ...prevState,
      currentAnalysis: analysis,
    }));
  };

  // Save analysis to the backend
  const saveAnalysis = async (type: string, data: any) => {
    if (!state.currentProduct) {
      toast({
        variant: 'destructive',
        title: 'No product selected',
        description: 'Please create or select a product before saving an analysis.',
      });
      return;
    }

    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      const analysisData = {
        productId: state.currentProduct.id,
        type,
        data: JSON.stringify(data),
      };

      const method = state.currentAnalysis ? 'PATCH' : 'POST';
      const url = state.currentAnalysis 
        ? `/api/analyses/${state.currentAnalysis.id}` 
        : '/api/analyses';

      const response = await apiRequest(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        throw new Error('Failed to save analysis');
      }

      const savedAnalysis = await response.json();
      
      setState(prevState => ({
        ...prevState,
        currentAnalysis: savedAnalysis,
        isLoading: false,
      }));

      toast({
        title: 'Analysis saved',
        description: 'Your analysis has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
      setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false,
      }));

      toast({
        variant: 'destructive',
        title: 'Error saving analysis',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  // Load a product and its analysis
  const loadProductAndAnalysis = async (productId?: number, analysisId?: number) => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      // Load product
      if (productId) {
        const productResponse = await apiRequest(`/api/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error('Failed to load product');
        }
        const product = await productResponse.json();
        setCurrentProduct(product);
      }

      // Load analysis
      if (analysisId) {
        const analysisResponse = await apiRequest(`/api/analyses/${analysisId}`);
        if (!analysisResponse.ok) {
          throw new Error('Failed to load analysis');
        }
        const analysis = await analysisResponse.json();
        setCurrentAnalysis(analysis);

        // Parse analysis data based on type
        if (analysis.type && analysis.data) {
          const parsedData = JSON.parse(analysis.data);
          
          switch (analysis.type) {
            case 'cost':
              updateCostAnalysisResults(parsedData);
              break;
            case 'tariff':
              updateTariffAnalysisResults(parsedData);
              break;
            case 'route':
              updateRouteAnalysisResults(parsedData);
              break;
            case 'regulations':
              updateRegulationsResults(parsedData);
              break;
            case 'special_programs':
              updateSpecialProgramsResults(parsedData);
              break;
            default:
              console.warn(`Unknown analysis type: ${analysis.type}`);
          }
        }
      }

      setState(prevState => ({ ...prevState, isLoading: false }));
    } catch (error) {
      console.error('Error loading product and analysis:', error);
      setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false,
      }));

      toast({
        variant: 'destructive',
        title: 'Error loading data',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  // Update cost analysis results
  const updateCostAnalysisResults = (results: any) => {
    setState(prevState => ({
      ...prevState,
      costAnalysisResults: results,
    }));
  };

  // Update tariff analysis results
  const updateTariffAnalysisResults = (results: any) => {
    setState(prevState => ({
      ...prevState,
      tariffAnalysisResults: results,
    }));
  };

  // Update route analysis results
  const updateRouteAnalysisResults = (results: any) => {
    setState(prevState => ({
      ...prevState,
      routeAnalysisResults: results,
    }));
  };

  // Update regulations results
  const updateRegulationsResults = (results: any) => {
    setState(prevState => ({
      ...prevState,
      regulationsResults: results,
    }));
  };

  // Update special programs results
  const updateSpecialProgramsResults = (results: any) => {
    setState(prevState => ({
      ...prevState,
      specialProgramsResults: results,
    }));
  };

  // Clear all data
  const clearAllData = () => {
    setState(initialState);
    localStorage.removeItem('analysisState');
    
    toast({
      title: 'Data cleared',
      description: 'All analysis data has been cleared.',
    });
  };

  // Method for test pages to update current product (without requiring a full Product object)
  const updateCurrentProduct = (data: any) => {
    setState(prevState => ({
      ...prevState,
      currentProduct: data,
    }));
  };
  
  // Method to clear route analysis results
  const clearRouteAnalysisResults = () => {
    setState(prevState => ({
      ...prevState,
      routeAnalysisResults: null,
    }));
  };
  
  // Method to clear tariff analysis results
  const clearTariffAnalysisResults = () => {
    setState(prevState => ({
      ...prevState,
      tariffAnalysisResults: null,
    }));
  };

  // Create the value object that will be provided to consumers
  const value: AnalysisContextType = {
    state,
    setCurrentProduct,
    setCurrentAnalysis,
    saveAnalysis,
    loadProductAndAnalysis,
    updateCostAnalysisResults,
    updateTariffAnalysisResults,
    updateRouteAnalysisResults,
    updateRegulationsResults,
    updateSpecialProgramsResults,
    clearAllData,
    // Test methods
    updateCurrentProduct,
    clearRouteAnalysisResults,
    clearTariffAnalysisResults,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

// Hook for consumers to access the context
export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
