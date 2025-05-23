import { apiRequest } from "./queryClient";
import { mockApiCall } from "./mockApi";

// Check if we're in production (Netlify) environment
const isProduction = import.meta.env.PROD;

// Use mock API in production, real API in development
const api = isProduction ? mockApiCall : apiRequest;

// Products API
export const fetchProducts = async () => {
  if (isProduction) {
    return mockApiCall('/api/products').then(res => res.products || []);
  }
  const res = await apiRequest("GET", "/api/products");
  const data = await res.json();
  return data.products;
};

export const createProduct = async (product) => {
  if (isProduction) {
    return mockApiCall('/api/products', 'POST', product).then(res => res.product || {});
  }
  const res = await apiRequest("POST", "/api/products", product);
  const data = await res.json();
  return data.product;
};

export const updateProduct = async (id, product) => {
  if (isProduction) {
    return mockApiCall(`/api/products/${id}`, 'PUT', product).then(res => res.product || {});
  }
  const res = await apiRequest("PUT", `/api/products/${id}`, product);
  const data = await res.json();
  return data.product;
};

export const deleteProduct = async (id) => {
  if (isProduction) {
    return mockApiCall(`/api/products/${id}`, 'DELETE');
  }
  await apiRequest("DELETE", `/api/products/${id}`);
};

// Analyses API
export const fetchAnalyses = async (type) => {
  if (isProduction) {
    return mockApiCall('/api/analyses').then(res => res.analyses || []);
  }
  const url = type ? `/api/analyses?type=${type}` : "/api/analyses";
  const res = await apiRequest("GET", url);
  const data = await res.json();
  return data.analyses;
};

export const createAnalysis = async (analysis) => {
  if (isProduction) {
    return mockApiCall('/api/analyses', 'POST', analysis).then(res => res.analysis || {});
  }
  const res = await apiRequest("POST", "/api/analyses", analysis);
  const data = await res.json();
  return data.analysis;
};

export const fetchAnalysisById = async (id) => {
  if (isProduction) {
    return mockApiCall(`/api/analyses/${id}`).then(res => res.analysis || {});
  }
  const res = await apiRequest("GET", `/api/analyses/${id}`);
  const data = await res.json();
  return data.analysis;
};

export const deleteAnalysis = async (id) => {
  if (isProduction) {
    return mockApiCall(`/api/analyses/${id}`, 'DELETE');
  }
  await apiRequest("DELETE", `/api/analyses/${id}`);
};

// Compliance Requirements API
export const fetchComplianceRequirements = async () => {
  if (isProduction) {
    return mockApiCall('/api/compliance').then(res => res.requirements || []);
  }
  const res = await apiRequest("GET", "/api/compliance");
  const data = await res.json();
  return data.requirements;
};

export const createComplianceRequirement = async (requirement) => {
  if (isProduction) {
    return mockApiCall('/api/compliance', 'POST', requirement).then(res => res.requirement || {});
  }
  const res = await apiRequest("POST", "/api/compliance", requirement);
  const data = await res.json();
  return data.requirement;
};

export const updateComplianceRequirement = async (id, requirement) => {
  if (isProduction) {
    return mockApiCall(`/api/compliance/${id}`, 'PUT', requirement).then(res => res.requirement || {});
  }
  const res = await apiRequest("PUT", `/api/compliance/${id}`, requirement);
  const data = await res.json();
  return data.requirement;
};

// Tariff API
export const fetchTariffData = async (hsCode, origin, destination) => {
  if (isProduction) {
    return mockApiCall(`/api/tariff/${hsCode}?origin=${origin}&destination=${destination}`);
  }
  const res = await apiRequest("GET", `/api/tariff/${hsCode}?origin=${origin}&destination=${destination}`);
  const data = await res.json();
  return data;
};

export const fetchHSCodeSuggestions = async (description) => {
  if (isProduction) {
    return mockApiCall(`/api/hscode/suggest?description=${encodeURIComponent(description)}`).then(res => res.suggestions || []);
  }
  const res = await apiRequest("GET", `/api/hscode/suggest?description=${encodeURIComponent(description)}`);
  const data = await res.json();
  return data.suggestions;
};

// Shipping API
export const fetchShippingEstimates = async (params) => {
  if (isProduction) {
    return mockApiCall('/api/shipping/estimate', 'POST', params).then(res => res.routes || []);
  }
  const res = await apiRequest("POST", "/api/shipping/estimate", params);
  const data = await res.json();
  return data.routes;
};

// Currency API
export const convertCurrency = async (amount, from, to) => {
  if (isProduction) {
    return mockApiCall('/api/currency/convert', 'POST', { amount, from, to });
  }
  const res = await apiRequest("POST", "/api/currency/convert", { amount, from, to });
  const data = await res.json();
  return data;
};

export const fetchCurrencies = async () => {
  if (isProduction) {
    return mockApiCall('/api/currency/list').then(res => res.currencies || []);
  }
  const res = await apiRequest("GET", "/api/currency/list");
  const data = await res.json();
  return data.currencies;
};
