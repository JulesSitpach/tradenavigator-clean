import axios from 'axios';

const SHIPPO_API_URL = 'https://api.goshippo.com/';

// Initialize Shippo client with API key
const shippoClient = axios.create({
  baseURL: SHIPPO_API_URL,
  headers: {
    'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Get shipping rates for a package
 * @param originCountry Origin country code
 * @param destinationCountry Destination country code
 * @param weight Weight in kg
 * @param dimensions Package dimensions in cm
 * @returns Shipping rate information
 */
export async function getShippingRates(
  originCountry: string,
  destinationCountry: string,
  weight: number,
  dimensions: { length: number; width: number; height: number }
) {
  try {
    // Create a shipment object
    const shipmentData = {
      address_from: {
        country: originCountry.toUpperCase(),
      },
      address_to: {
        country: destinationCountry.toUpperCase(),
      },
      parcels: [{
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
        distance_unit: 'cm',
        weight,
        mass_unit: 'kg'
      }],
      async: false
    };

    // Create shipment
    const shipmentResponse = await shippoClient.post('shipments/', shipmentData);
    const shipment = shipmentResponse.data;

    // Get rates for the shipment
    const ratesResponse = await shippoClient.get(`shipments/${shipment.object_id}/rates/`);
    return ratesResponse.data;
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Estimate customs duties and taxes for international shipment
 * @param originCountry Origin country code
 * @param destinationCountry Destination country code
 * @param declaredValue Value of goods in USD
 * @param hsCode HS code of the product
 * @returns Estimated duties and taxes
 */
export async function estimateDutiesAndTaxes(
  originCountry: string,
  destinationCountry: string,
  declaredValue: number,
  hsCode: string
) {
  try {
    const data = {
      origin_country: originCountry.toUpperCase(),
      destination_country: destinationCountry.toUpperCase(),
      declared_value: declaredValue,
      declared_currency: 'USD',
      hs_code: hsCode
    };

    const response = await shippoClient.post('customs/duties/', data);
    return response.data;
  } catch (error) {
    console.error('Error estimating duties and taxes:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error',
      // Fallback estimates based on general averages
      estimated_duties: declaredValue * 0.05, // 5% average duty
      estimated_taxes: declaredValue * 0.07  // 7% average tax
    };
  }
}

// Export a simpler function for handling errors and providing defaults
export async function getShippingEstimate(
  originCountry: string,
  destinationCountry: string,
  weight: number,
  dimensions: { length: number; width: number; height: number },
  declaredValue: number,
  hsCode: string
) {
  try {
    // Get shipping rates
    const ratesResponse = await getShippingRates(
      originCountry,
      destinationCountry,
      weight,
      dimensions
    );
    
    // Get duties and taxes
    const dutiesResponse = await estimateDutiesAndTaxes(
      originCountry,
      destinationCountry,
      declaredValue,
      hsCode
    );
    
    // Find the most economical shipping option
    let shippingCost = 0;
    let shippingService = '';
    let estimatedDeliveryDays = 0;
    
    if (!ratesResponse.error && ratesResponse.results && ratesResponse.results.length > 0) {
      // Sort by price
      const sortedRates = ratesResponse.results.sort((a: any, b: any) => 
        parseFloat(a.amount) - parseFloat(b.amount)
      );
      
      // Get the cheapest option
      const cheapestRate = sortedRates[0];
      shippingCost = parseFloat(cheapestRate.amount);
      shippingService = cheapestRate.provider;
      estimatedDeliveryDays = cheapestRate.estimated_days || 14;
    } else {
      // Fallback calculation if API fails
      const baseRate = weight * 10; // $10 per kg
      const distanceFactor = 1.5; // International shipping multiplier
      shippingCost = baseRate * distanceFactor;
      shippingService = 'Standard International';
      estimatedDeliveryDays = 14;
    }
    
    // Calculate duties and taxes
    let dutyAmount = 0;
    let taxAmount = 0;
    
    if (!dutiesResponse.error) {
      dutyAmount = dutiesResponse.estimated_duties || (declaredValue * 0.05);
      taxAmount = dutiesResponse.estimated_taxes || (declaredValue * 0.07);
    } else {
      dutyAmount = declaredValue * 0.05; // 5% average duty
      taxAmount = declaredValue * 0.07;  // 7% average tax
    }
    
    return {
      shippingCost,
      shippingService,
      estimatedDeliveryDays,
      dutyAmount,
      taxAmount,
      totalLandedCost: declaredValue + shippingCost + dutyAmount + taxAmount
    };
  } catch (error) {
    console.error('Error getting shipping estimate:', error);
    
    // Return fallback estimates
    const shippingCost = weight * 15; // $15 per kg fallback
    const dutyAmount = declaredValue * 0.05; // 5% average duty
    const taxAmount = declaredValue * 0.07;  // 7% average tax
    
    return {
      shippingCost,
      shippingService: 'Standard International',
      estimatedDeliveryDays: 14,
      dutyAmount,
      taxAmount,
      totalLandedCost: declaredValue + shippingCost + dutyAmount + taxAmount,
      isEstimate: true
    };
  }
}