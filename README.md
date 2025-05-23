# TradeNavigator

TradeNavigator is a comprehensive platform for international trade analysis, helping businesses navigate complex trade regulations, tariffs, and shipping routes.

## Deployment Instructions

### Deploying to Netlify

1. **Prerequisites**:
   - Ensure you have a [Netlify account](https://app.netlify.com/signup)
   - Make sure your code is pushed to a GitHub repository

2. **Deploy from GitHub**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose GitHub as your Git provider
   - Select your TradeNavigator repository
   - Use the following build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Show advanced" and add the following environment variables:
     - `JWT_SECRET`: A random string for JWT token signing (e.g., generate one with `openssl rand -base64 32`)
   - Click "Deploy site"

3. **After Deployment**:
   - Once deployment is complete, Netlify will provide a URL for your site
   - Test the application by navigating to the provided URL
   - You can use the demo login credentials:
     - Email: `demo@example.com`
     - Password: `password123`

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Features

- Cost Analysis
- Route Optimization
- Tariff Analysis
- Regulations Compliance
- Special Programs
- AI-powered HS Code Suggestions
- Trade Data Visualization
- Market Analysis

## Project Structure

- `/client`: React frontend application
- `/server`: Express backend server
- `/netlify/functions`: Serverless functions for Netlify deployment
- `/shared`: Shared types and schemas

## License

MIT
