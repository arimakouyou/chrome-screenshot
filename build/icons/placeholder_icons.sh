#!/bin/bash
# Create placeholder icons using ImageMagick if available

if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Please install it or use the Python scripts."
    echo "Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "macOS: brew install imagemagick"
    echo "Or generate icons manually from icon.svg"
    exit 1
fi

echo "Creating placeholder icons with ImageMagick..."

# Create a simple blue square with camera icon using text
sizes=(16 32 48 128)

for size in "${sizes[@]}"; do
    # Create blue background with camera emoji or text
    convert -size ${size}x${size} xc:"#4285F4" \
            -gravity center \
            -pointsize $((size/4)) \
            -fill white \
            -font Arial-Bold \
            -annotate +0+0 "📷" \
            "icon${size}.png" 2>/dev/null || \
    convert -size ${size}x${size} xc:"#4285F4" \
            -gravity center \
            -pointsize $((size/8)) \
            -fill white \
            -font Arial-Bold \
            -annotate +0+0 "CAM" \
            "icon${size}.png"
    
    echo "Created icon${size}.png"
done

echo "Placeholder icons created! Replace with proper designs from SVG."