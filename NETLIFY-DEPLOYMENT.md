# TradeNavigator Netlify Deployment Guide

## Prerequisites

1. Install Netlify CLI (if not already installed):
   ```
   npm install -g netlify-cli
   ```

2. Ensure you have the following environment variables set up in Netlify:
   - `DATABASE_URL` - Your database connection string
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `NODE_VERSION` - Set to 18.x or higher

## Deployment Steps

### 1. Local Testing

Before deploying to Netlify, test locally:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test using Netlify CLI
netlify dev
```

### 2. Deploy to Netlify

Option 1: Using Netlify CLI:

```bash
# Login to Netlify
netlify login

# Initialize Netlify site if not already done
netlify init

# Deploy
netlify deploy --prod
```

Option 2: Using Netlify UI:

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Log in to Netlify and click "New site from Git"
3. Connect to your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### 3. Verify Deployment

1. Check your Netlify site URL for the deployed frontend
2. Test API functionality via the `/api` endpoints

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Netlify UI
   - Ensure all dependencies are included in package.json
   - Verify NODE_VERSION is set correctly

2. **API Not Working**:
   - Check that environment variables are set correctly
   - Verify API routes are correctly configured in netlify.toml
   - Check Netlify Function logs

3. **404 Errors**:
   - Make sure redirects are properly set up in netlify.toml
   - Ensure client-side routing works with the catch-all redirect

### Getting Help

If you continue to face issues, you can:
1. Check Netlify documentation: https://docs.netlify.com/
2. Visit Netlify support forums: https://answers.netlify.com/
