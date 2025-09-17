#!/usr/bin/env python3
"""
Create simple PNG icons using PIL only
"""

try:
    from PIL import Image, ImageDraw
    import os
except ImportError:
    print("PIL (Pillow) not found. Please install: pip install Pillow")
    exit(1)

def create_icon(size):
    """Create a simple camera icon"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Scale factors
    s = size / 128
    
    # Background circle
    circle_radius = int(60 * s)
    circle_center = size // 2
    draw.ellipse([
        circle_center - circle_radius,
        circle_center - circle_radius,
        circle_center + circle_radius,
        circle_center + circle_radius
    ], fill=(66, 133, 244, 255), outline=(37, 99, 235, 255), width=max(1, int(4 * s)))
    
    # Camera body
    body_width = int(64 * s)
    body_height = int(38 * s)
    body_x = (size - body_width) // 2
    body_y = int(45 * s)
    draw.rounded_rectangle([
        body_x, body_y,
        body_x + body_width, body_y + body_height
    ], radius=max(1, int(6 * s)), fill=(255, 255, 255, 255))
    
    # Inner camera area
    inner_width = int(58 * s)
    inner_height = int(32 * s)
    inner_x = (size - inner_width) // 2
    inner_y = int(48 * s)
    draw.rounded_rectangle([
        inner_x, inner_y,
        inner_x + inner_width, inner_y + inner_height
    ], radius=max(1, int(4 * s)), fill=(248, 249, 250, 255))
    
    # Lens outer
    lens_radius = int(12 * s)
    lens_center = size // 2
    draw.ellipse([
        lens_center - lens_radius,
        lens_center - lens_radius,
        lens_center + lens_radius,
        lens_center + lens_radius
    ], fill=(95, 99, 104, 255))
    
    # Lens inner
    inner_radius = int(8 * s)
    draw.ellipse([
        lens_center - inner_radius,
        lens_center - inner_radius,
        lens_center + inner_radius,
        lens_center + inner_radius
    ], fill=(32, 33, 36, 255))
    
    # Lens reflection
    refl_radius = int(2 * s)
    refl_x = lens_center + int(2 * s)
    refl_y = lens_center - int(2 * s)
    if refl_radius > 0:
        draw.ellipse([
            refl_x - refl_radius,
            refl_y - refl_radius,
            refl_x + refl_radius,
            refl_y + refl_radius
        ], fill=(154, 160, 166, 255))
    
    # Flash
    flash_width = int(8 * s)
    flash_height = int(6 * s)
    flash_x = int(78 * s)
    flash_y = int(38 * s)
    if flash_width > 2 and flash_height > 2:
        draw.rounded_rectangle([
            flash_x, flash_y,
            flash_x + flash_width, flash_y + flash_height
        ], radius=max(1, int(2 * s)), fill=(251, 188, 4, 255))
    
    # Viewfinder
    vf_width = int(6 * s)
    vf_height = int(4 * s)
    vf_x = int(88 * s)
    vf_y = int(38 * s)
    if vf_width > 1 and vf_height > 1:
        draw.rounded_rectangle([
            vf_x, vf_y,
            vf_x + vf_width, vf_y + vf_height
        ], radius=max(1, int(1 * s)), fill=(52, 168, 83, 255))
    
    return img

def main():
    sizes = [16, 32, 48, 128]
    
    print("Creating simple PNG icons...")
    
    for size in sizes:
        try:
            img = create_icon(size)
            filename = f"icon{size}.png"
            img.save(filename, 'PNG', optimize=True)
            print(f"✓ Created {filename}")
        except Exception as e:
            print(f"✗ Failed to create icon{size}.png: {e}")
    
    print("\nIcon creation complete!")

if __name__ == "__main__":
    main()