import { Request, Response } from 'express';
import { Express } from 'express';
import { getShippingEstimate } from '../services/shippoService';
import { getTariffData, getHSCodeSuggestions } from '../services/unComtradeService';

export function setupShippingRoutes(app: Express) {
  app.get('/api/shipping/rates', getShippingRates);
  app.get('/api/tariffs/data', getTariffRates);
  app.get('/api/hscode/suggest', getHSCodeSuggestion);
}

/**
 * Get shipping rates based on origin, destination, and package details
 */
export const getShippingRates = async (req: Request, res: Response) => {
  try {
    const { 
      originCountry, 
      destinationCountry, 
      weight,
      length,
      width, 
      height,
      value,
      hsCode
    } = req.query;
    
    // Validate required parameters
    if (!originCountry || !destinationCountry || !weight) {
      return res.status(400).json({ 
        error: 'Missing required parameters. Please provide originCountry, destinationCountry, and weight.' 
      });
    }
    
    // Convert to the right types
    const weightNum = parseFloat(weight as string);
    const lengthNum = parseFloat(length as string) || 10;
    const widthNum = parseFloat(width as string) || 10;
    const heightNum = parseFloat(height as string) || 10;
    const valueNum = parseFloat(value as string) || 100;
    
    // Get shipping estimate using Shippo API
    const estimate = await getShippingEstimate(
      originCountry as string,
      destinationCountry as string,
      weightNum,
      { length: lengthNum, width: widthNum, height: heightNum },
      valueNum,
      hsCode as string || '8471.30'
    );
    
    res.json(estimate);
  } catch (error) {
    console.error('Error in getShippingRates:', error);
    res.status(500).json({ 
      error: 'Failed to get shipping rates',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get tariff rates based on HS code and countries
 */
export const getTariffRates = async (req: Request, res: Response) => {
  try {
    const { hsCode, originCountry, destinationCountry } = req.query;
    
    // Validate required parameters
    if (!hsCode || !originCountry || !destinationCountry) {
      return res.status(400).json({ 
        error: 'Missing required parameters. Please provide hsCode, originCountry, and destinationCountry.' 
      });
    }
    
    // Get tariff data using UN Comtrade API
    const tariffData = await getTariffData(
      hsCode as string,
      originCountry as string,
      destinationCountry as string
    );
    
    res.json(tariffData);
  } catch (error) {
    console.error('Error in getTariffRates:', error);
    res.status(500).json({ 
      error: 'Failed to get tariff rates',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get HS code suggestions based on product description
 */
export const getHSCodeSuggestion = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Missing query parameter. Please provide a product description.' 
      });
    }
    
    // Get HS code suggestions
    const suggestions = await getHSCodeSuggestions(query as string);
    
    res.json(suggestions);
  } catch (error) {
    console.error('Error in getHSCodeSuggestion:', error);
    res.status(500).json({ 
      error: 'Failed to get HS code suggestions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};