import { Express, Request, Response } from "express";
import { tradeDataService } from "../services/tradeDataService";

export function setupTradeDataRoutes(app: Express) {
  // Get real countries from UN Comtrade
  app.get("/api/countries", async (req: Request, res: Response) => {
    try {
      const countries = await tradeDataService.getCountries();
      res.json({ success: true, countries });
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch country data. Please check API credentials." 
      });
    }
  });

  // Search real HS codes with descriptions
  app.get("/api/hs-codes/search", async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ 
          success: false, 
          error: "Query parameter 'q' is required" 
        });
      }

      const hsCodes = await tradeDataService.searchHSCodes(q);
      res.json({ success: true, hsCodes });
    } catch (error) {
      console.error("Error searching HS codes:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to search HS codes. Please check API credentials." 
      });
    }
  });

  // Get tariff data for product and country combination
  app.get("/api/tariff-data", async (req: Request, res: Response) => {
    try {
      const { hsCode, originCountry, destinationCountry } = req.query;
      
      if (!hsCode || !originCountry || !destinationCountry) {
        return res.status(400).json({ 
          success: false, 
          error: "hsCode, originCountry, and destinationCountry are required" 
        });
      }

      const tariffData = await tradeDataService.getTariffData(
        hsCode as string, 
        originCountry as string, 
        destinationCountry as string
      );

      if (!tariffData) {
        return res.status(404).json({ 
          success: false, 
          error: "No tariff data found for this combination" 
        });
      }

      res.json({ success: true, tariffData });
    } catch (error) {
      console.error("Error fetching tariff data:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch tariff data. Please check API credentials." 
      });
    }
  });

  // Get trade flow between countries
  app.get("/api/trade-flow", async (req: Request, res: Response) => {
    try {
      const { reporterCode, partnerCode, hsCode } = req.query;
      
      if (!reporterCode || !partnerCode) {
        return res.status(400).json({ 
          success: false, 
          error: "reporterCode and partnerCode are required" 
        });
      }

      const tradeFlow = await tradeDataService.getTradeFlow(
        reporterCode as string, 
        partnerCode as string, 
        hsCode as string
      );

      res.json({ success: true, tradeFlow });
    } catch (error) {
      console.error("Error fetching trade flow:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch trade flow data. Please check API credentials." 
      });
    }
  });
}