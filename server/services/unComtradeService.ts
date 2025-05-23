import axios from 'axios';

const UN_COMTRADE_API_URL = 'https://comtradeapi.un.org/public/v1/preview';
const PRIMARY_KEY = process.env.UN_COMTRADE_PRIMARY_KEY;
const SECONDARY_KEY = process.env.UN_COMTRADE_SECONDARY_KEY;

// Initialize UN Comtrade API client
const comtradeClient = axios.create({
  baseURL: UN_COMTRADE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'subscription-key': PRIMARY_KEY
  }
});

// Switch to secondary key if primary fails
comtradeClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401 && SECONDARY_KEY) {
      // Switch to secondary key and retry
      const originalRequest = error.config;
      originalRequest.headers['subscription-key'] = SECONDARY_KEY;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

/**
 * Get tariff data for a specific HS code between two countries
 * @param hsCode HS code of the product
 * @param originCountry Origin country code
 * @param destinationCountry Destination country code
 * @returns Tariff data
 */
export async function getTariffData(
  hsCode: string,
  originCountry: string,
  destinationCountry: string
) {
  try {
    // Clean up the HS code - remove any dots or spaces
    const cleanHsCode = hsCode.replace(/[.\s]/g, '');
    
    // Get the first 6 digits of the HS code (international standard)
    const hsCode6Digit = cleanHsCode.substring(0, 6);
    
    // Convert country codes to ISO3 format (UN Comtrade uses 3-letter codes)
    const originISO3 = convertToISO3(originCountry);
    const destinationISO3 = convertToISO3(destinationCountry);
    
    // Query for tariff data using the Trade Flow endpoint
    const response = await comtradeClient.get('/tariffline/query', {
      params: {
        reporterCode: destinationISO3,
        partnerCode: originISO3,
        commodityCode: hsCode6Digit,
        period: 'latest'
      }
    });
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      // Process the tariff data
      const tariffData = processTariffData(response.data.data, hsCode6Digit);
      return tariffData;
    }
    
    // If no data found, return default estimates
    return getDefaultTariffEstimate(destinationCountry);
    
  } catch (error) {
    console.error('Error fetching tariff data:', error);
    // Return default estimates if API call fails
    return getDefaultTariffEstimate(destinationCountry);
  }
}

/**
 * Process raw tariff data from UN Comtrade API
 */
function processTariffData(data: any[], hsCode: string) {
  // Find the most specific tariff data matching our HS code
  const matchingTariffs = data.filter((item: any) => 
    item.cmdCode && item.cmdCode.startsWith(hsCode)
  );
  
  if (matchingTariffs.length === 0) {
    return {
      hsCode,
      dutyRate: 0.05, // Default 5%
      description: 'No specific tariff data found',
      isEstimate: true
    };
  }
  
  // Sort by specificity (longer commodity code = more specific)
  matchingTariffs.sort((a: any, b: any) => 
    (b.cmdCode?.length || 0) - (a.cmdCode?.length || 0)
  );
  
  const bestMatch = matchingTariffs[0];
  
  return {
    hsCode,
    dutyRate: bestMatch.dutyRate || 0.05,
    description: bestMatch.cmdDescE || 'Imported goods',
    isEstimate: false
  };
}

/**
 * Convert 2-letter country code to 3-letter ISO code
 */
function convertToISO3(countryCode: string): string {
  const countryMapping: Record<string, string> = {
    'us': 'USA',
    'ca': 'CAN',
    'mx': 'MEX',
    'cn': 'CHN',
    'jp': 'JPN',
    'kr': 'KOR',
    'gb': 'GBR',
    'fr': 'FRA',
    'de': 'DEU',
    'it': 'ITA',
    'es': 'ESP',
    'br': 'BRA',
    'in': 'IND',
    'au': 'AUS'
  };
  
  return countryMapping[countryCode.toLowerCase()] || countryCode.toUpperCase();
}

/**
 * Get default tariff estimates based on destination country
 */
function getDefaultTariffEstimate(destinationCountry: string) {
  // Different regions have different average tariff rates
  const regionRates: Record<string, number> = {
    'us': 0.03, // 3% average for US
    'ca': 0.04, // 4% for Canada
    'mx': 0.07, // 7% for Mexico
    'cn': 0.08, // 8% for China
    'jp': 0.04, // 4% for Japan
    'kr': 0.07, // 7% for South Korea
    'gb': 0.04, // 4% for UK
    'fr': 0.05, // 5% for France (EU)
    'de': 0.05, // 5% for Germany (EU)
    'it': 0.05, // 5% for Italy (EU)
    'es': 0.05, // 5% for Spain (EU)
    'br': 0.10, // 10% for Brazil
    'in': 0.10, // 10% for India
    'au': 0.05  // 5% for Australia
  };
  
  // Get rate for the destination country or default to 5%
  const rate = regionRates[destinationCountry.toLowerCase()] || 0.05;
  
  return {
    hsCode: 'Generic',
    dutyRate: rate,
    description: 'Estimated tariff rate',
    isEstimate: true
  };
}

/**
 * Get HS code suggestions based on product description
 */
export async function getHSCodeSuggestions(productDescription: string) {
  try {
    const response = await comtradeClient.get('/classificationLookup', {
      params: {
        classification: 'HS',
        searchText: productDescription
      }
    });
    
    if (response.data && response.data.data) {
      return response.data.data.slice(0, 5).map((item: any) => ({
        code: item.id,
        description: item.text
      }));
    }
    
    return getDefaultHSCodeSuggestions();
    
  } catch (error) {
    console.error('Error fetching HS code suggestions:', error);
    return getDefaultHSCodeSuggestions();
  }
}

/**
 * Get default HS code suggestions for common products
 */
function getDefaultHSCodeSuggestions() {
  return [
    { code: '8471.30', description: 'Laptops and portable computers' },
    { code: '8517.12', description: 'Mobile phones and smartphones' },
    { code: '8528.72', description: 'TVs and monitors' },
    { code: '6110.20', description: 'Cotton sweaters and pullovers' },
    { code: '9503.00', description: 'Toys and games' }
  ];
}

export default {
  getTariffData,
  getHSCodeSuggestions
};