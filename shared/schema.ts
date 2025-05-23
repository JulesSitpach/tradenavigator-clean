export interface Product {
  id: number;
  name: string;
  description: string;
  hsCode?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analysis {
  id: number;
  type: string;
  title: string;
  description?: string;
  data: any;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceRequirement {
  id: number;
  country: string;
  productCategory: string;
  requirement: string;
  details: string;
  authorityName: string;
  authorityUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
