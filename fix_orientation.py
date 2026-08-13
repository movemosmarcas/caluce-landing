import os
from PIL import Image, ImageOps

def optimize_image(img_path):
    if not img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        return
    try:
        img = Image.open(img_path)
        img = ImageOps.exif_transpose(img)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
        max_size = 1920
        if img.width > max_size or img.height > max_size:
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        new_path = os.path.splitext(img_path)[0] + '.webp'
        img.save(new_path, 'WEBP', quality=75, optimize=True)
        print(f"Optimized {img_path} -> {new_path}")
    except Exception as e:
        print(f"Failed {img_path}: {e}")

for root, dirs, files in os.walk('gallery-images'):
    for f in files:
        optimize_image(os.path.join(root, f))