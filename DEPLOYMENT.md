# TradeNavigator Deployment Guide

This guide will help you deploy the TradeNavigator application to Vercel.

## Prerequisites

- Node.js v18 or higher
- npm v8 or higher
- Vercel account
- Vercel CLI installed (`npm install -g vercel`)

## Project Structure

The project is structured as follows:

- `client/`: React frontend code
- `server/`: Express backend code
- `shared/`: Shared types and utilities
- `dist/`: Build output directory

## Setup for Deployment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tradenavigator-clean
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your environment variables:
   - `JWT_SECRET`: Secret key for JWT authentication
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `DATABASE_URL`: Your database connection string

## Running Locally

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Fix import issues (if needed):
   ```bash
   npm run fix-imports
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Start the production server:
   ```bash
   npm start
   ```

## Deploying to Vercel

1. Log in to Vercel:
   ```bash
   vercel login
   ```

2. Configure your project:
   ```bash
   vercel
   ```

3. Follow the prompts to link your repository and set environment variables.

4. Deploy to production:
   ```bash
   vercel --prod
   ```

## Troubleshooting

- If you encounter import errors, run `npm run fix-imports` to fix path issues.
- If the server can't find the build directory, ensure you've run `npm run build` first.
- Check the Vercel logs for detailed error information if deployment fails.

## Environment Variables

Make sure to set these environment variables in your Vercel project settings:

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (production/development)
- `JWT_SECRET`: Secret key for JWT authentication
- `JWT_EXPIRY`: JWT token expiry (default: 24h)
- `OPENAI_API_KEY`: Your OpenAI API key
- `DATABASE_URL`: Your database connection string
