#!/bin/bash

# Chrome Web Store Package Builder
# Creates a clean zip package for Chrome Web Store submission

set -e  # Exit on any error

PACKAGE_NAME="screenshot-extension-v1.0.0"
BUILD_DIR="build"
PACKAGE_FILE="${PACKAGE_NAME}.zip"

echo "🏗️  Building Chrome Web Store package..."

# Clean previous build
if [ -d "$BUILD_DIR" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf "$BUILD_DIR"
fi

if [ -f "$PACKAGE_FILE" ]; then
    echo "🧹 Removing existing package..."
    rm "$PACKAGE_FILE"
fi

# Create build directory
mkdir -p "$BUILD_DIR"

echo "📦 Copying extension files..."

# Core extension files
cp manifest.json "$BUILD_DIR/"
cp background.js "$BUILD_DIR/"
cp content_script.js "$BUILD_DIR/"
cp popup.html "$BUILD_DIR/"
cp popup.js "$BUILD_DIR/"
cp popup.css "$BUILD_DIR/"
cp preview.html "$BUILD_DIR/"
cp preview.js "$BUILD_DIR/"
cp preview.css "$BUILD_DIR/"
cp offscreen.html "$BUILD_DIR/"
cp offscreen.js "$BUILD_DIR/"

# Copy icons
cp -r icons "$BUILD_DIR/"

# Copy license if exists
if [ -f "LICENSE" ]; then
    cp LICENSE "$BUILD_DIR/"
fi

echo "🔍 Validating package contents..."

# Check required files
required_files=(
    "manifest.json"
    "background.js"
    "content_script.js"
    "popup.html"
    "popup.js"
    "popup.css"
    "preview.html"
    "preview.js"
    "preview.css"
    "offscreen.html"
    "offscreen.js"
    "icons/icon16.png"
    "icons/icon32.png"
    "icons/icon48.png"
    "icons/icon128.png"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$BUILD_DIR/$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Missing required files:"
    printf '%s\n' "${missing_files[@]}"
    exit 1
fi

echo "✅ All required files present"

# Validate manifest.json
echo "🔍 Validating manifest.json..."
if ! python3 -c "import json; json.load(open('$BUILD_DIR/manifest.json'))" 2>/dev/null; then
    echo "❌ Invalid JSON in manifest.json"
    exit 1
fi

# Check manifest version
version=$(python3 -c "import json; print(json.load(open('$BUILD_DIR/manifest.json'))['version'])" 2>/dev/null)
if [ -z "$version" ]; then
    echo "❌ No version found in manifest.json"
    exit 1
fi

echo "✅ Manifest version: $version"

# Create zip package
echo "📦 Creating package: $PACKAGE_FILE"
cd "$BUILD_DIR"
zip -r "../$PACKAGE_FILE" . -x "*.DS_Store" "*.git*" "*~" "*.tmp"
cd ..

# Package info
package_size=$(du -h "$PACKAGE_FILE" | cut -f1)

echo ""
echo "🎉 Package created successfully!"
echo "📁 File: $PACKAGE_FILE"
echo "📏 Size: $package_size"
echo ""

# List package contents
echo "📋 Package contents:"
unzip -l "$PACKAGE_FILE"

echo ""
echo "✅ Ready for Chrome Web Store submission!"
echo ""
echo "Next steps:"
echo "1. Test the extension by loading $BUILD_DIR in Chrome"
echo "2. Take screenshots for the store listing"
echo "3. Upload $PACKAGE_FILE to Chrome Web Store Developer Dashboard"
echo "4. Fill out store listing details"
echo ""