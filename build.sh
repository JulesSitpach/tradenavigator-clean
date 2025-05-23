#!/bin/bash

# Create directories for Netlify
echo "Creating directories for Netlify..."
mkdir -p dist
mkdir -p netlify/functions

# Install dependencies
echo "Installing dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
npm run build
cd ..

# Copy client build to dist
echo "Copying client build to dist..."
cp -r client/dist/* dist/

echo "Build completed successfully!"
