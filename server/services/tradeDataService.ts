import axios from 'axios';

// UN Comtrade API service for real trade data
export class TradeDataService {
  private readonly baseUrl = 'https://comtradeapi.un.org/data/v1';
  private readonly primaryKey = process.env.UN_COMTRADE_PRIMARY_KEY;
  private readonly secondaryKey = process.env.UN_COMTRADE_SECONDARY_KEY;

  // Get real countries from UN Comtrade
  async getCountries() {
    try {
      const response = await axios.get(`${this.baseUrl}/references/Partners`, {
        headers: {
          'Ocp-Apim-Subscription-Key': this.primaryKey
        }
      });
      
      return response.data.results?.map((country: any) => ({
        code: country.id,
        name: country.text,
        iso: country.id
      })) || [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw new Error('Failed to fetch country data from UN Comtrade');
    }
  }

  // Search real HS codes with descriptions
  async searchHSCodes(query: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/references/HS`, {
        params: {
          q: query,
          max: 20
        },
        headers: {
          'Ocp-Apim-Subscription-Key': this.primaryKey
        }
      });
      
      return response.data.results?.map((hs: any) => ({
        code: hs.id,
        description: hs.text,
        parentCode: hs.parent,
        level: hs.aggLevel
      })) || [];
    } catch (error) {
      console.error('Error searching HS codes:', error);
      throw new Error('Failed to search HS codes from UN Comtrade');
    }
  }

  // Get trade flow data between countries
  async getTradeFlow(reporterCode: string, partnerCode: string, hsCode?: string) {
    try {
      const params: any = {
        reporterCode,
        partnerCode,
        period: '2023',
        cmdCode: hsCode || 'TOTAL',
        flowCode: 'M', // Import
        max: 1
      };

      const response = await axios.get(`${this.baseUrl}/get`, {
        params,
        headers: {
          'Ocp-Apim-Subscription-Key': this.primaryKey
        }
      });
      
      return response.data.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching trade flow:', error);
      throw new Error('Failed to fetch trade flow data from UN Comtrade');
    }
  }

  // Get tariff data for specific product and country combination
  async getTariffData(hsCode: string, originCountry: string, destinationCountry: string) {
    try {
      // This would integrate with tariff databases
      // For now, we'll use trade flow data to estimate
      const tradeData = await this.getTradeFlow(destinationCountry, originCountry, hsCode);
      
      if (tradeData) {
        return {
          hsCode,
          description: tradeData.cmdDesc,
          dutyRate: this.estimateDutyRate(hsCode, originCountry, destinationCountry),
          tradeValue: tradeData.primaryValue,
          isEstimate: true
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching tariff data:', error);
      throw new Error('Failed to fetch tariff data');
    }
  }

  // Estimate duty rates based on trade agreements and product type
  private estimateDutyRate(hsCode: string, originCountry: string, destinationCountry: string): number {
    // Real logic would check trade agreements (USMCA, EU, etc.)
    // and official tariff schedules
    const hsCategory = hsCode.substring(0, 2);
    
    // Different categories have different typical duty rates
    const categoryRates: Record<string, number> = {
      '01': 0.05, // Live animals
      '02': 0.08, // Meat
      '03': 0.04, // Fish
      '84': 0.03, // Machinery
      '85': 0.02, // Electrical equipment
      '87': 0.06, // Vehicles
      '61': 0.12, // Apparel (knitted)
      '62': 0.15, // Apparel (not knitted)
      '64': 0.18, // Footwear
    };
    
    return categoryRates[hsCategory] || 0.05; // Default 5%
  }
}

export const tradeDataService = new TradeDataService();