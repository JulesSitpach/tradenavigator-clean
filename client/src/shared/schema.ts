import { z } from 'zod';

// User schema for authentication
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// Product schema
export const productSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  description: z.string(),
  hsCode: z.string(),
  category: z.string(),
  value: z.number(),
  valueUnit: z.string(),
  currency: z.string(),
  weight: z.number().optional(),
  weightUnit: z.string().optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    unit: z.string().optional(),
  }).optional(),
  originCountry: z.string(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Product = z.infer<typeof productSchema>;

// Analysis schema
export const analysisSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  productId: z.number(),
  analysisType: z.enum(['cost', 'route', 'tariff', 'regulatory', 'program']),
  destinationCountry: z.string(),
  shippingMethod: z.string().optional(),
  carrier: z.string().optional(),
  totalCost: z.number().optional(),
  currency: z.string().optional(),
  breakdown: z.object({
    productCost: z.number().optional(),
    freight: z.number().optional(),
    insurance: z.number().optional(),
    duties: z.number().optional(),
    taxes: z.number().optional(),
    customsClearance: z.number().optional(),
    handling: z.number().optional(),
    lastMile: z.number().optional(),
    other: z.number().optional(),
  }).optional(),
  optimizationSuggestions: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
      potentialSavings: z.number().optional(),
      implementation: z.string().optional(),
      confidence: z.number().optional(),
    })
  ).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Analysis = z.infer<typeof analysisSchema>;

// Tariff data schema
export const tariffDataSchema = z.object({
  id: z.number().optional(),
  hsCode: z.string(),
  description: z.string(),
  originCountry: z.string(),
  destinationCountry: z.string(),
  baseRate: z.number(),
  preferentialRates: z.array(
    z.object({
      program: z.string(),
      rate: z.number(),
      requirements: z.array(z.string()),
    })
  ).optional(),
  restrictions: z.array(z.string()).optional(),
  lastUpdated: z.date().optional(),
});

export type TariffData = z.infer<typeof tariffDataSchema>;

// Compliance requirements schema
export const complianceRequirementSchema = z.object({
  id: z.number().optional(),
  userId: z.number().optional(),
  productCategory: z.string(),
  originCountry: z.string(),
  destinationCountry: z.string(),
  requirementType: z.string(),
  description: z.string(),
  agency: z.string().optional(),
  documentation: z.array(z.string()).optional(),
  estimatedCost: z.number().optional(),
  estimatedTime: z.number().optional(), // days
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ComplianceRequirement = z.infer<typeof complianceRequirementSchema>;
