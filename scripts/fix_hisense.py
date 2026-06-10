from PIL import Image

img = Image.open("public/sponsors/hisense-hd.png").convert("RGBA")
pixels = img.getdata()

new_data = []
for item in pixels:
    # Remove near-white / light grey background
    if item[0] > 225 and item[1] > 225 and item[2] > 225:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

img.putdata(new_data)
img.save("public/sponsors/hisense-hd.png", "PNG")
print(f"Done - {img.size[0]}x{img.size[1]}")
