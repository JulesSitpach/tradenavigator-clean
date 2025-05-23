// This file mocks API responses for the frontend
// Place this in the client/src/lib directory

export const API_MOCKS = {
  // Mock user data
  user: {
    id: 1,
    email: 'demo@example.com',
    companyName: 'Demo Trading Co.',
    industry: 'Electronics'
  },
  
  // Mock cost analysis data
  costAnalysis: {
    productCategory: 'Electronics',
    productName: 'Wireless Headphones',
    productDescription: 'High-quality wireless bluetooth headphones',
    hsCode: '851830',
    originCountry: 'China',
    destinationCountry: 'United States',
    shippingMethod: 'Ocean Freight',
    incoterms: 'FOB',
    urgencyLevel: 'Standard',
    customsHandling: 'Broker',
    tradeAgreement: 'None',
    quantity: 1000,
    unitPrice: 25,
    totalValue: 25000,
    weight: 0.3,
    dimensions: {
      length: 20,
      width: 15,
      height: 8
    }
  },
  
  // Add other mock data as needed
};

// Use this function instead of API calls
export const mockApiCall = (endpoint, method = 'GET', data = null) => {
  console.log(`Mock API call: ${method} ${endpoint}`);
  
  // Return a promise to simulate API behavior
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (endpoint) {
        case '/api/auth/profile':
          resolve({ user: API_MOCKS.user });
          break;
        case '/api/cost-analysis':
          resolve({ data: API_MOCKS.costAnalysis });
          break;
        // Add other endpoints as needed
        default:
          resolve({ message: 'Mock API endpoint not found' });
      }
    }, 500); // Simulate network delay
  });
};
