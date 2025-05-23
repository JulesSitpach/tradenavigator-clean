#!/bin/bash

echo "🔧 Fixing all import issues..."

# Fix MainLayout imports
find client/src -name "*.tsx" -type f -exec sed -i.bak 's|from "\.\./components/MainLayout"|from "../layouts/MainLayout"|g' {} \;
find client/src -name "*.tsx" -type f -exec sed -i.bak 's|from "\.\./\.\./components/MainLayout"|from "../../layouts/MainLayout"|g' {} \;

# Fix all @/ imports to relative paths
find client/src -name "*.tsx" -type f -exec sed -i.bak 's|@/components/ui/|../ui/|g' {} \;

# Fix UI imports for pages directory
find client/src/pages -name "*.tsx" -type f -exec sed -i.bak 's|from "\.\./ui/|from "../../components/ui/|g' {} \; 2>/dev/null || true

# Remove backup files
find client/src -name "*.bak" -delete

echo "✅ All imports fixed!"