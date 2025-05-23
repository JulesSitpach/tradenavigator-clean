# TradeNavigator Implementation Plan

This document provides specific technical implementation tasks to complete TradeNavigator for production release, including code snippets and implementation guidance.

## Phase 1: Technical Implementation Tasks

### 1. Fix Routing Inconsistencies

**Issues identified:**
- Login.tsx uses wouter while other pages use React Router
- Some navigation uses hash-based routing

**Implementation tasks:**
```typescript
// 1. Update login.tsx to use React Router consistently
// Replace wouter imports with react-router-dom
import { Link, useNavigate } from 'react-router-dom';

// 2. Replace useLocation with useNavigate
const navigate = useNavigate();

// 3. Replace hash navigation in AuthProvider.tsx
// Change this:
window.location.hash = '/';
// To this:
navigate('/');
```

### 2. Fix API Client

**Issues identified:**
- Inconsistent API call patterns
- Mock API usage in production

**Implementation tasks:**
```typescript
// 1. Standardize API client in lib/api.ts
export const API_BASE_URL = import.meta.env.PROD 
  ? '/api' // Use relative path in production
  : '/api'; // Use relative path in development

// 2. Create consistent API helper
export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('trade_navigator_token');
  
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers
  });
}
```

### 3. Complete Data Flow Between Dashboards

**Issues identified:**
- Data flow between dashboards is incomplete
- Cost Analysis data doesn't fully propagate

**Implementation tasks:**
```typescript
// 1. Create a centralized AnalysisContext
// In providers/AnalysisProvider.tsx:

export const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [costAnalysisData, setCostAnalysisData] = useState<CostAnalysisData | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<Analysis[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('tradenavigator_analysis');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCostAnalysisData(parsed.costAnalysisData);
        setAnalysisHistory(parsed.analysisHistory);
      } catch (error) {
        console.error('Failed to load saved analysis data', error);
      }
    }
  }, []);
  
  // Save to localStorage when data changes
  useEffect(() => {
    if (costAnalysisData) {
      localStorage.setItem('tradenavigator_analysis', JSON.stringify({
        costAnalysisData,
        analysisHistory
      }));
    }
  }, [costAnalysisData, analysisHistory]);
  
  // Function to update cost analysis data
  const updateCostAnalysis = (data: CostAnalysisData) => {
    setCostAnalysisData(data);
    
    // Add to history
    setAnalysisHistory(prev => [
      {
        id: Date.now(),
        type: 'cost',
        data,
        timestamp: new Date().toISOString()
      },
      ...prev
    ].slice(0, 10)); // Keep only last 10
    
    // Save to database if user is authenticated
    if (localStorage.getItem('trade_navigator_token')) {
      apiRequest('/api/analysis', {
        method: 'POST',
        body: JSON.stringify({ type: 'cost', data }),
      });
    }
  };
  
  return (
    <AnalysisContext.Provider 
      value={{ 
        costAnalysisData, 
        analysisHistory, 
        updateCostAnalysis 
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}
```

### 4. Fix Database Connection

**Issues identified:**
- Database connection needs proper setup for production
- Error handling is incomplete

**Implementation tasks:**
```typescript
// In server/storage.ts:

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

// Add error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Add connection testing
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Export the test function
export { testConnection };
```

### 5. Implement Proper Error Handling

**Issues identified:**
- API error handling is inconsistent
- No retry mechanism

**Implementation tasks:**
```typescript
// In lib/api.ts:

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  retries = 2
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: getAuthHeaders(options.headers),
    });
    
    const responseData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401) {
        localStorage.removeItem('trade_navigator_token');
        window.location.href = '/auth/login';
        return { error: 'Session expired. Please log in again.', status: 401 };
      }
      
      // Handle retry for server errors
      if (response.status >= 500 && retries > 0) {
        console.log(`Retrying request to ${url}. Attempts remaining: ${retries}`);
        return apiRequest(url, options, retries - 1);
      }
      
      return { 
        error: responseData.error || 'An unexpected error occurred', 
        status: response.status 
      };
    }
    
    return { data: responseData, status: response.status };
  } catch (error) {
    // Handle network errors
    if (retries > 0) {
      console.log(`Network error. Retrying request to ${url}. Attempts remaining: ${retries}`);
      return apiRequest(url, options, retries - 1);
    }
    
    return { 
      error: 'Network error. Please check your connection.', 
      status: 0 
    };
  }
}
```

## Phase 2: Quality Assurance Tasks

### 1. Add Loading States

**Issues identified:**
- Inconsistent loading indicators
- Poor user feedback during API calls

**Implementation tasks:**
```typescript
// In components/ui/loader.tsx:

export function Loader({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const sizeClass = {
    small: 'h-4 w-4',
    default: 'h-6 w-6',
    large: 'h-8 w-8'
  }[size];
  
  return (
    <div className="flex items-center justify-center">
      <svg
        className={`animate-spin ${sizeClass} text-primary`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

// In hooks/useAsync.ts:

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);

    return asyncFn()
      .then((response) => {
        setValue(response);
        setStatus('success');
        return response;
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
        throw error;
      });
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error, isLoading: status === 'pending' };
}
```

### 2. Implement Form Validation

**Issues identified:**
- Inconsistent form validation
- Poor error messages

**Implementation tasks:**
```typescript
// In lib/validations.ts:

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .nonempty('Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .nonempty('Password is required'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .nonempty('Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .nonempty('Password is required'),
  confirmPassword: z
    .string()
    .nonempty('Please confirm your password'),
  companyName: z
    .string()
    .nonempty('Company name is required'),
  industry: z
    .string()
    .optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Add more schemas as needed for other forms
```

### 3. Complete Authentication Flow

**Issues identified:**
- Token refresh is missing
- Authentication persistence has issues

**Implementation tasks:**
```typescript
// In providers/AuthProvider.tsx:

// Add token refresh mechanism
useEffect(() => {
  // Set up token refresh interval
  const refreshToken = async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return;
    
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      } else {
        // If refresh fails, log out
        handleLogout();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  };
  
  // Refresh token every 30 minutes
  const intervalId = setInterval(refreshToken, 30 * 60 * 1000);
  
  // Clean up interval on unmount
  return () => clearInterval(intervalId);
}, []);
```

## Phase 3: Deployment Preparation

### 1. Setup Environment Variables

**Issues identified:**
- Environment variables need clear documentation
- Default values are missing

**Implementation tasks:**
```typescript
// In .env.example:

# Server Configuration
PORT=3000
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=24h

# API Keys
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/tradenavigator

# In server/config.ts:

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'development-jwt-secret',
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
  },
  api: {
    openaiKey: process.env.OPENAI_API_KEY || '',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tradenavigator',
  },
};
```

### 2. Create Database Migration Scripts

**Issues identified:**
- Missing database migration process
- No schema documentation

**Implementation tasks:**
```typescript
// In server/db/schema.sql:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analyses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  analysis_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  hs_code VARCHAR(50),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compliance_requirements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  country VARCHAR(100) NOT NULL,
  product_category VARCHAR(100) NOT NULL,
  requirement TEXT NOT NULL,
  details TEXT,
  authority_name VARCHAR(255),
  authority_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// In server/db/migrate.js:

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false
  });

  try {
    console.log('Running database migrations...');
    
    const schema = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );
    
    await pool.query(schema);
    
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await pool.end();
  }
}

migrate();
```

### 3. Create Health Check Endpoint

**Issues identified:**
- No health check for monitoring
- No system status endpoint

**Implementation tasks:**
```typescript
// In server/routes.ts:

// Add health check endpoint
app.get('/api/health', async (req, res) => {
  const dbConnection = await testConnection();
  
  res.json({
    status: 'ok',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: dbConnection ? 'connected' : 'disconnected',
  });
});
```

### 4. Create Deployment Script for Railway

**Issues identified:**
- Need clear deployment process
- Configuration for Railway

**Implementation tasks:**
```typescript
// In railway.json:

{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && cd client && npm install && npm run build && cd .. && npm run build:server"
  },
  "deploy": {
    "startCommand": "node dist/index.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 60,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## Next Steps

1. Implement the changes in Phase 1 to fix critical technical issues
2. Move to Phase 2 for quality assurance tasks
3. Prepare for deployment with Phase 3 tasks

Once these changes are implemented, TradeNavigator will be ready for production deployment.
