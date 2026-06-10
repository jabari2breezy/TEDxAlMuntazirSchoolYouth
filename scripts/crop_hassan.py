from PIL import Image

img = Image.open("public/speakers/hassan.png")
w, h = img.size

# Find the actual content area by scanning for non-black rows
pixels = img.load()

# Scan from top to find first non-black row
top = 0
for y in range(h):
    row_sum = sum(pixels[x, y][0] + pixels[x, y][1] + pixels[x, y][2] for x in range(0, w, 4))
    if row_sum > w // 4 * 30:  # threshold - not all black
        top = y
        break

# Scan from bottom
bottom = h
for y in range(h - 1, 0, -1):
    row_sum = sum(pixels[x, y][0] + pixels[x, y][1] + pixels[x, y][2] for x in range(0, w, 4))
    if row_sum > w // 4 * 30:
        bottom = y + 1
        break

print(f"Original: {w}x{h}, cropping top={top}, bottom={bottom}")
cropped = img.crop((0, top, w, bottom))
cropped.save("public/speakers/hassan.png")
print(f"Saved cropped: {cropped.size[0]}x{cropped.size[1]}")
