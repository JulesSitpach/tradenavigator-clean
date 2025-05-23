# Route Configuration for AI HS Code Suggestions

To connect the enhanced controller, add this to your main routes file:

```typescript
import { optionalAuth, logRequest } from './middleware/optionalAuth';
import { getAIHSCodeSuggestionsEnhanced } from './controllers/hsCodeEnhanced';

// Add this route with optional authentication
app.post('/api/hs-code-suggestions', 
  logRequest,           // Log all requests for debugging
  optionalAuth,         // Allow both authenticated and guest users  
  getAIHSCodeSuggestionsEnhanced
);
```

This will:
- ✅ Log all API requests for debugging
- ✅ Allow both authenticated and guest users
- ✅ Provide detailed error messages
- ✅ Return mock data until OpenAI is connected
- ✅ Prevent the "Failed to get HS code suggestions" error

## OpenRouter Integration (READY TO USE):
- ✅ client/src/providers/AuthProvider.tsx (enhanced)
- ✅ client/src/components/HSCodeAssistant.tsx (enhanced)  
- ✅ server/middleware/optionalAuth.ts (new)
- ✅ server/controllers/hsCodeEnhanced.ts (new)
- ✅ server/utils/openRouterClient.ts (OpenRouter-specific)

## Environment Variables Needed:
```
OPENROUTER_API_KEY=your_openrouter_key_here
# OR
OPENAI_API_KEY=your_openrouter_key_here
```

## Files NOT Modified (Restricted):
- ❌ package.json
- ❌ vite.config.ts
- ❌ drizzle.config.ts
- ❌ server/vite.ts
