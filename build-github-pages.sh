#!/bin/bash

# Build the GitHub Pages version of the app
echo "Building GitHub Pages version..."

# Create a dist directory if it doesn't exist
mkdir -p dist

# Run Vite with our custom config
npx vite build --config vite.config.pages.ts

# Create a .nojekyll file in the dist directory to disable Jekyll processing
touch dist/.nojekyll

echo "Build completed successfully! The files are in the dist directory."
echo "To test the build locally, you can run: npx serve dist"
echo "To deploy to GitHub Pages, push this repository to GitHub and set up GitHub Pages in the repository settings."