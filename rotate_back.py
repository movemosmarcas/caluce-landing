from PIL import Image

path = r'gallery-images\IMG_6405.webp'
img = Image.open(path)
img = img.rotate(180, expand=True)
img.save(path)
print("Rotated 180 degrees again.")
