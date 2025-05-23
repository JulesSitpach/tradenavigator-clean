# TradeNavigator Build Fix

## Common Build Issues and Solutions

### 1. Path Resolution Problems

If you encounter errors like:
```
Failed to resolve import "@/components/..." from "..."
```

Run the fix-imports.js script:
```bash
npm run fix-imports
```

This script automatically corrects import paths that might cause build failures.

### 2. TypeScript Errors

For TypeScript errors related to missing types or modules:

1. Check that types are properly defined in shared/schema.ts
2. Make sure tsconfig.json has correct path mappings
3. Run TypeScript check before building:
```bash
npm run check
```

### 3. Environment Variables

Ensure all required environment variables are set properly:
- In development: Use .env file
- In production: Set variables in your deployment platform (e.g., Netlify)

Required variables:
- DATABASE_URL
- OPENAI_API_KEY
- NODE_ENV (set to "production" for builds)

### 4. API Endpoint Issues

If your API calls fail after deployment:

1. Check that API URLs are correctly configured to use Netlify functions
2. Verify Netlify redirects are properly set up
3. Test API endpoints directly via Netlify function URLs

### 5. Deployment Build Configuration

When deploying:
1. Ensure the correct build command is used: `npm run build`
2. Set the publish directory to: `dist`
3. Configure functions directory as: `netlify/functions`

### 6. WebSocket Connection Issues

If WebSockets aren't working in production:
- WebSockets aren't supported in Netlify functions by default
- Consider using a separate WebSocket service or fallback to HTTP polling

### Need More Help?

For further assistance with build issues, check:
- The project's documentation
- Netlify's documentation: https://docs.netlify.com/
- Open an issue in the project repository
