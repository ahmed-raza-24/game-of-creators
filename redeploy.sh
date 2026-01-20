#!/bin/bash
echo "Cleaning build cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "Installing dependencies..."
npm install

echo "Building locally..."
npm run build

echo "If build successful, deploying..."
if [ $? -eq 0 ]; then
    git add .
    git commit -m "Quick fix deploy"
    git push
    echo "Deploy initiated!"
else
    echo "Build failed. Fix errors first."
fi