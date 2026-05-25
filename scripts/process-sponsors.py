#!/usr/bin/env python3
"""Re-crop sponsor logos from the tier poster with transparent backgrounds."""
from PIL import Image
import os

REF = os.environ.get(
    "SPONSOR_REF",
    os.path.join(
        os.path.dirname(__file__),
        "../../.cursor/projects/Users-naiyl-Desktop-last-last-almiistedx/assets/625902c9-3605-498a-adbd-34c1116fbffb-ded38633-4f69-436b-8188-4c24409bdee9.png",
    ),
)
OUT = os.path.join(os.path.dirname(__file__), "../public/sponsors")

CROPS = {
    "etg.png": (0.10, 0.16, 0.48, 0.31),
    "asas.png": (0.50, 0.16, 0.90, 0.31),
    "leta-kazi.png": (0.28, 0.33, 0.72, 0.48),
    "jd-pharmacy.png": (0.30, 0.50, 0.70, 0.64),
    "smiles-cars.png": (0.02, 0.66, 0.32, 0.88),
    "dar-glass-works.png": (0.30, 0.66, 0.58, 0.88),
    "amjad-motors.png": (0.58, 0.66, 0.98, 0.88),
}


def trim_alpha(img):
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def remove_bg(img, white=200, black=30):
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r >= white and g >= white and b >= white:
                px[x, y] = (0, 0, 0, 0)
            elif r <= black and g <= black and b <= black:
                px[x, y] = (0, 0, 0, 0)
            else:
                lum = (r + g + b) / 3
                if lum > 245:
                    px[x, y] = (r, g, b, max(0, int((255 - lum) * 8)))
    return trim_alpha(img)


def main():
    ref = Image.open(REF)
    w, h = ref.size
    os.makedirs(OUT, exist_ok=True)
    for name, box in CROPS.items():
        l, t, r, b = box
        out = remove_bg(ref.crop((int(w * l), int(h * t), int(w * r), int(h * b))))
        out.save(os.path.join(OUT, name), optimize=True)
        print(name, out.size)


if __name__ == "__main__":
    main()
