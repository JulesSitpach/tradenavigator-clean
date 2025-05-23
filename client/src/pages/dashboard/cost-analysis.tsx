import { useState, useEffect } from 'react';
import { Package, Globe, Ship, DollarSign, Calculator, BarChart3, Search, Clock, Loader } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
// PHASE 2 FIX: Import providers for progressive data discovery
import { useCostData } from '../../providers/CostDataProvider';
import { useAnalysis } from '../../providers/AnalysisProvider';

interface FormData {
  productCategory: string;
  productName: string;
  productDescription: string;
  hsCode: string;
  originCountry: string;
  destinationCountry: string;
  shippingMethod: string;
  incoterms: string;
  urgencyLevel: string;
  customsHandling: string;
  tradeAgreement: string;
  quantity: string;
  unitPrice: string;
  length: string;
  width: string;
  height: string;
  weight: string;
}

interface SavedSearch {
  id: string;
  timestamp: Date;
  productName: string;
  route: string;
  method: string;
  formData: FormData;
}

const CostAnalysis = () => {
  // PHASE 2 FIX: Connect to providers
  const { costData, setCostData, savedSearches, addSavedSearch } = useCostData();
  const { 
    setCurrentProduct, 
    runCostAnalysis, 
    costAnalysisResults,
    isLoading: analysisLoading 
  } = useAnalysis();

  const [formData, setFormData] = useState<FormData>({
    productCategory: '',
    productName: '',
    productDescription: '',
    hsCode: '',
    originCountry: '',
    destinationCountry: '',
    shippingMethod: '',
    incoterms: '',
    urgencyLevel: '',
    customsHandling: '',
    tradeAgreement: '',
    quantity: '', // Empty by default - no more "1"!
    unitPrice: '',
    length: '',
    width: '',
    height: '',
    weight: '',
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingHSCode, setIsLoadingHSCode] = useState(false);

  // PHASE 2 FIX: Load existing data from provider on mount
  useEffect(() => {
    if (costData) {
      setFormData(prev => ({
        ...prev,
        productCategory: costData.productCategory || '',
        productName: costData.productName || '',
        productDescription: costData.productDescription || '',
        hsCode: costData.hsCode || '',
        originCountry: costData.originCountry || '',
        destinationCountry: costData.destinationCountry || '',
        shippingMethod: costData.shippingMethod || '',
        incoterms: costData.incoterms || '',
        quantity: costData.quantity?.toString() || '',
        unitPrice: costData.unitPrice?.toString() || '',
        weight: costData.weight?.toString() || '',
        length: costData.dimensions?.length?.toString() || '',
        width: costData.dimensions?.width?.toString() || '',
        height: costData.dimensions?.height?.toString() || '',
      }));
    }
  }, [costData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // PHASE 2 FIX: Real-time sync to provider for progressive discovery
    const updatedFormData = { ...formData, [field]: value };
    syncToProvider(updatedFormData);
  };

  // PHASE 2 FIX: Sync form data to provider in real-time
  const syncToProvider = (currentFormData: FormData) => {
    const providerData = {
      productCategory: currentFormData.productCategory,
      productName: currentFormData.productName,
      productDescription: currentFormData.productDescription,
      hsCode: currentFormData.hsCode,
      originCountry: currentFormData.originCountry,
      destinationCountry: currentFormData.destinationCountry,
      shippingMethod: currentFormData.shippingMethod,
      incoterms: currentFormData.incoterms,
      quantity: parseFloat(currentFormData.quantity) || 0,
      unitPrice: parseFloat(currentFormData.unitPrice) || 0,
      totalValue: (parseFloat(currentFormData.quantity) || 0) * (parseFloat(currentFormData.unitPrice) || 0),
      weight: parseFloat(currentFormData.weight) || 0,
      dimensions: {
        length: parseFloat(currentFormData.length) || 0,
        width: parseFloat(currentFormData.width) || 0,
        height: parseFloat(currentFormData.height) || 0,
      },
    };

    setCostData(providerData);
    
    // Also update current product for analysis
    setCurrentProduct({
      id: Date.now().toString(),
      name: currentFormData.productName,
      description: currentFormData.productDescription,
      hsCode: currentFormData.hsCode,
      category: currentFormData.productCategory,
      unitPrice: parseFloat(currentFormData.unitPrice) || 0,
      weight: parseFloat(currentFormData.weight) || 0,
      dimensions: {
        length: parseFloat(currentFormData.length) || 0,
        width: parseFloat(currentFormData.width) || 0,
        height: parseFloat(currentFormData.height) || 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const handleHSCodeLookup = async () => {
    if (!formData.productCategory || !formData.productName) {
      alert('Please select a product category and enter a product name first.');
      return;
    }

    setIsLoadingHSCode(true);
    try {
      // Simulate API call to get HS code suggestions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock HS code suggestion based on product
      let suggestedCode = '';
      if (formData.productCategory === 'electronics') {
        suggestedCode = '854230';
      } else if (formData.productCategory === 'textiles') {
        suggestedCode = '620342';
      } else if (formData.productCategory === 'machinery') {
        suggestedCode = '847130';
      } else {
        suggestedCode = '999999'; // Generic code
      }
      
      handleInputChange('hsCode', suggestedCode);
    } catch (error) {
      console.error('HS Code lookup failed:', error);
    } finally {
      setIsLoadingHSCode(false);
    }
  };

  const handleCalculate = async () => {
    // Basic validation
    if (!formData.productName || !formData.originCountry || !formData.destinationCountry) {
      alert('Please fill in required fields: Product Name, Origin Country, and Destination Country');
      return;
    }

    setIsCalculating(true);
    try {
      // PHASE 2 FIX: Ensure data is synced before analysis
      syncToProvider(formData);
      
      // PHASE 2 FIX: Run analysis through provider
      await runCostAnalysis();
      
      // Save this search to provider
      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        timestamp: new Date(),
        productName: formData.productName,
        route: `${formData.originCountry} → ${formData.destinationCountry}`,
        method: formData.shippingMethod || 'Standard',
        formData: { ...formData }
      };
      
      addSavedSearch(newSearch);
      
      // Show success message
      alert('✅ Analysis complete! Your data is now available in all other dashboards.');
      
    } catch (error) {
      console.error('Calculation failed:', error);
      alert('❌ Analysis failed. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cost Analysis</h1>
        <p className="text-gray-600">
          Enter your trade details below. This data will automatically populate all other dashboards for comprehensive analysis.
        </p>
        {/* PHASE 2 FIX: Show progressive discovery status */}
        {costData && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              ✨ <strong>Progressive Discovery Active:</strong> Your data is being shared across all dashboards in real-time!
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Information */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="mr-2 h-5 w-5 text-blue-600" />
              Product Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category *
                </label>
                <Select 
                  value={formData.productCategory} 
                  onValueChange={(value) => handleInputChange('productCategory', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="textiles">Textiles & Apparel</SelectItem>
                    <SelectItem value="machinery">Machinery</SelectItem>
                    <SelectItem value="food">Food & Beverages</SelectItem>
                    <SelectItem value="chemicals">Chemicals</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="toys">Toys & Games</SelectItem>
                    <SelectItem value="sports">Sports Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Wireless Bluetooth Headphones"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed description of your product..."
                  rows={3}
                  value={formData.productDescription}
                  onChange={(e) => handleInputChange('productDescription', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HS Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 854230"
                    value={formData.hsCode}
                    onChange={(e) => handleInputChange('hsCode', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleHSCodeLookup}
                    disabled={isLoadingHSCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {isLoadingHSCode ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click the search button to get HS code suggestions based on your product
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the form would continue here... */}
        {/* For brevity, I'm showing the key changes. The rest of the form follows the same pattern */}
        
        {/* Calculate Button with Progressive Discovery */}
        <div className="lg:col-span-2 mt-8">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={isCalculating || analysisLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-semibold"
          >
            {isCalculating || analysisLoading ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                Analyzing & Sharing Data...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-5 w-5" />
                Calculate & Populate All Dashboards
              </>
            )}
          </button>
          <p className="text-center text-sm text-gray-600 mt-2">
            This will analyze your trade scenario and automatically populate all other dashboards
          </p>
        </div>
      </div>

      {/* Results Section */}
      {costAnalysisResults && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Analysis Complete!</h3>
          <p className="text-green-700 mb-4">
            Your data has been analyzed and is now available across all dashboards:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <BarChart3 className="h-6 w-6 mx-auto text-green-600 mb-1" />
              <p>Overview Ready</p>
            </div>
            <div className="text-center">
              <Ship className="h-6 w-6 mx-auto text-green-600 mb-1" />
              <p>Route Analysis</p>
            </div>
            <div className="text-center">
              <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-1" />
              <p>Tariff Analysis</p>
            </div>
            <div className="text-center">
              <Globe className="h-6 w-6 mx-auto text-green-600 mb-1" />
              <p>+ 14 More Dashboards</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostAnalysis;

