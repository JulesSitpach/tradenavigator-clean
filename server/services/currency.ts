import axios from 'axios';

// External API keys - should be environment variables
const CURRENCY_API_KEY = process.env.CURRENCY_API_KEY || 'demo_key';

interface CurrencyConversionResult {
  from: string;
  to: string;
  rate: number;
  result: number;
  timestamp: number;
}

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<CurrencyConversionResult | null> => {
  try {
    // This is a placeholder for currency conversion API call
    // In a real implementation, we would use an actual API
    
    // Simulate API call
    // const response = await axios.get(
    //   'https://api.currencyapi.com/v3/latest',
    //   {
    //     params: {
    //       apikey: CURRENCY_API_KEY,
    //       base_currency: fromCurrency,
    //       currencies: toCurrency
    //     }
    //   }
    // );
    
    // Mock exchange rates (simplified)
    const mockRates: Record<string, Record<string, number>> = {
      'USD': { 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.23, 'CAD': 1.36, 'AUD': 1.52 },
      'EUR': { 'USD': 1.09, 'GBP': 0.86, 'JPY': 162.21, 'CAD': 1.48, 'AUD': 1.65 },
      'GBP': { 'USD': 1.27, 'EUR': 1.16, 'JPY': 188.89, 'CAD': 1.72, 'AUD': 1.92 },
      'JPY': { 'USD': 0.0067, 'EUR': 0.0062, 'GBP': 0.0053, 'CAD': 0.0091, 'AUD': 0.0102 },
      'CAD': { 'USD': 0.74, 'EUR': 0.68, 'GBP': 0.58, 'JPY': 109.73, 'AUD': 1.12 },
      'AUD': { 'USD': 0.66, 'EUR': 0.61, 'GBP': 0.52, 'JPY': 98.18, 'CAD': 0.89 }
    };
    
    // Default to 1 if same currency or rate not found
    const rate = fromCurrency === toCurrency 
      ? 1 
      : (mockRates[fromCurrency]?.[toCurrency] || 1);
    
    const result = amount * rate;
    
    return {
      from: fromCurrency,
      to: toCurrency,
      rate,
      result,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error converting currency:', error);
    return null;
  }
};

export const getSupportedCurrencies = async (): Promise<string[]> => {
  // This would typically call an API, but we'll return a fixed list
  return [
    'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'HKD', 'NZD', 
    'SEK', 'KRW', 'SGD', 'NOK', 'MXN', 'INR', 'RUB', 'ZAR', 'TRY', 'BRL'
  ];
};
