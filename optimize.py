import os
from PIL import Image

def optimize_image(img_path):
    # Only process specific extensions
    if not img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        return
    
    # Exclude certain folders
    if 'FOTOS CALUCÉ' in img_path or '.git' in img_path:
        return

    try:
        img = Image.open(img_path)
        # Convert RGBA to RGB for JPEG compatibility (WEBP handles RGBA but better safe)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
            
        # Resize if width or height > 1920
        max_size = 1920
        if img.width > max_size or img.height > max_size:
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
        # Save as webp
        new_path = os.path.splitext(img_path)[0] + '.webp'
        img.save(new_path, 'WEBP', quality=75, optimize=True)
        print(f"Optimized {img_path} -> {new_path}")
        
    except Exception as e:
        print(f"Failed {img_path}: {e}")

for root, dirs, files in os.walk('.'):
    for f in files:
        optimize_image(os.path.join(root, f))
