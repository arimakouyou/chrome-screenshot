#!/usr/bin/env python3
"""
Generate icon files from SVG for Chrome Web Store submission
Requires: pip install Pillow cairosvg
"""

import os
from pathlib import Path

try:
    import cairosvg
    from PIL import Image
    import io
except ImportError:
    print("Required packages not found. Please install:")
    print("pip install Pillow cairosvg")
    exit(1)

def svg_to_png(svg_path, png_path, size):
    """Convert SVG to PNG at specified size"""
    try:
        # Convert SVG to PNG using cairosvg
        png_data = cairosvg.svg2png(
            url=str(svg_path),
            output_width=size,
            output_height=size
        )
        
        # Open with PIL for any additional processing
        img = Image.open(io.BytesIO(png_data))
        
        # Ensure RGBA mode for proper transparency
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Save as PNG
        img.save(png_path, 'PNG', optimize=True)
        print(f"Generated: {png_path} ({size}x{size})")
        
    except Exception as e:
        print(f"Error generating {png_path}: {e}")
        return False
    
    return True

def main():
    # Set up paths
    script_dir = Path(__file__).parent
    svg_file = script_dir / "icon.svg"
    
    if not svg_file.exists():
        print(f"SVG file not found: {svg_file}")
        return
    
    # Chrome extension icon sizes
    sizes = [16, 32, 48, 128]
    
    print("Generating Chrome extension icons...")
    
    for size in sizes:
        png_file = script_dir / f"icon{size}.png"
        if svg_to_png(svg_file, png_file, size):
            print(f"✓ icon{size}.png")
        else:
            print(f"✗ Failed to generate icon{size}.png")
    
    print("\nIcon generation complete!")
    print("Files created:")
    for size in sizes:
        png_file = script_dir / f"icon{size}.png"
        if png_file.exists():
            print(f"  - icon{size}.png")

if __name__ == "__main__":
    main()