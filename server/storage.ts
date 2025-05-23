import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  User, InsertUser,
  Product, InsertProduct,
  Analysis, InsertAnalysis,
  TariffData, InsertTariffData,
  ComplianceRequirement, InsertComplianceRequirement,
  users, products, analyses, tariffData, complianceRequirements
} from "../shared/schema";
import { eq, and } from "drizzle-orm";

const { Pool } = pg;

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a Drizzle instance
const db = drizzle(pool);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;

  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByUser(userId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Analysis methods
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getAnalysesByUser(userId: number): Promise<Analysis[]>;
  getAnalysesByType(userId: number, type: string): Promise<Analysis[]>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  updateAnalysis(id: number, data: Partial<InsertAnalysis>): Promise<Analysis | undefined>;
  deleteAnalysis(id: number): Promise<boolean>;

  // Tariff data methods
  getTariffData(id: number): Promise<TariffData | undefined>;
  getTariffDataByHsCode(hsCode: string, originCountry: string, destinationCountry: string): Promise<TariffData | undefined>;
  createTariffData(data: InsertTariffData): Promise<TariffData>;

  // Compliance requirements methods
  getComplianceRequirement(id: number): Promise<ComplianceRequirement | undefined>;
  getComplianceRequirementsByUser(userId: number): Promise<ComplianceRequirement[]>;
  createComplianceRequirement(requirement: InsertComplianceRequirement): Promise<ComplianceRequirement>;
  updateComplianceRequirement(id: number, data: Partial<InsertComplianceRequirement>): Promise<ComplianceRequirement | undefined>;
  deleteComplianceRequirement(id: number): Promise<boolean>;
}

export class DrizzleStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductsByUser(userId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.userId, userId));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products).set(data).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  // Analysis methods
  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const result = await db.select().from(analyses).where(eq(analyses.id, id));
    return result[0];
  }

  async getAnalysesByUser(userId: number): Promise<Analysis[]> {
    return await db.select().from(analyses).where(eq(analyses.userId, userId));
  }

  async getAnalysesByType(userId: number, type: string): Promise<Analysis[]> {
    return await db.select().from(analyses).where(
      and(eq(analyses.userId, userId), eq(analyses.analysisType, type))
    );
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const result = await db.insert(analyses).values(insertAnalysis).returning();
    return result[0];
  }

  async updateAnalysis(id: number, data: Partial<InsertAnalysis>): Promise<Analysis | undefined> {
    const result = await db.update(analyses).set(data).where(eq(analyses.id, id)).returning();
    return result[0];
  }

  async deleteAnalysis(id: number): Promise<boolean> {
    const result = await db.delete(analyses).where(eq(analyses.id, id)).returning();
    return result.length > 0;
  }

  // Tariff data methods
  async getTariffData(id: number): Promise<TariffData | undefined> {
    const result = await db.select().from(tariffData).where(eq(tariffData.id, id));
    return result[0];
  }

  async getTariffDataByHsCode(hsCode: string, originCountry: string, destinationCountry: string): Promise<TariffData | undefined> {
    const result = await db.select().from(tariffData).where(
      and(
        eq(tariffData.hsCode, hsCode),
        eq(tariffData.originCountry, originCountry),
        eq(tariffData.destinationCountry, destinationCountry)
      )
    );
    return result[0];
  }

  async createTariffData(insertTariffData: InsertTariffData): Promise<TariffData> {
    const result = await db.insert(tariffData).values(insertTariffData).returning();
    return result[0];
  }

  // Compliance requirements methods
  async getComplianceRequirement(id: number): Promise<ComplianceRequirement | undefined> {
    const result = await db.select().from(complianceRequirements).where(eq(complianceRequirements.id, id));
    return result[0];
  }

  async getComplianceRequirementsByUser(userId: number): Promise<ComplianceRequirement[]> {
    return await db.select().from(complianceRequirements).where(eq(complianceRequirements.userId, userId));
  }

  async createComplianceRequirement(insertRequirement: InsertComplianceRequirement): Promise<ComplianceRequirement> {
    const result = await db.insert(complianceRequirements).values(insertRequirement).returning();
    return result[0];
  }

  async updateComplianceRequirement(id: number, data: Partial<InsertComplianceRequirement>): Promise<ComplianceRequirement | undefined> {
    const result = await db.update(complianceRequirements).set(data).where(eq(complianceRequirements.id, id)).returning();
    return result[0];
  }

  async deleteComplianceRequirement(id: number): Promise<boolean> {
    const result = await db.delete(complianceRequirements).where(eq(complianceRequirements.id, id)).returning();
    return result.length > 0;
  }
}

// Export an instance of the storage
export const storage = new DrizzleStorage();