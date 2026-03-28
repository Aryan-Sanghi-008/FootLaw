#!/bin/bash

# FootLaw Monorepo Resilience Cleanup Script
# This script surgical deletes caches and build artifacts to resolve Metro/Turbo worker crashes.

echo "🧹 Starting FootLaw production-grade cleanup..."

# 1. Kill any zombie node/metro processes
echo "🟢 Terminating zombie processes..."
pkill -f "node|metro|expo" 2>/dev/null

# 2. Clear Metro & Expo Caches
echo "🟢 Clearing Metro and Expo caches..."
rm -rf apps/mobile/.expo
rm -rf apps/mobile/dist
rm -rf ~/.metro-health-check* 2>/dev/null
find . -name ".metro-health-check*" -exec rm -rf {} + 2>/dev/null

# 3. Clear Turbo Cache
echo "🟢 Clearing Turbo cache..."
rm -rf .turbo

# 4. Clear Package Build Artifacts
echo "🟢 Clearing package build artifacts..."
find . -name "dist" -type d -not -path "*/node_modules/*" -exec rm -rf {} +
find . -name "build" -type d -not -path "*/node_modules/*" -exec rm -rf {} +
find . -name "*.tsbuildinfo" -exec rm -f {} +

# 5. Optional: Clear node_modules (uncomment if persistent issues occur)
# echo "🟡 To deep clean node_modules: run 'rm -rf node_modules apps/*/node_modules packages/*/node_modules && npm install'"

echo "✅ Cleanup complete. Run 'npm run dev' for a fresh start."
