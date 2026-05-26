#!/usr/bin/env python3
"""Process official sponsor logos into transparent PNGs (skips leta-kazi)."""
from PIL import Image
import os

ASSETS = os.environ.get(
    "SPONSOR_ASSETS",
    os.path.join(
        os.path.dirname(__file__),
        "../../.cursor/projects/Users-naiyl-Desktop-last-last-almiistedx/assets",
    ),
)
OUT = os.path.join(os.path.dirname(__file__), "../public/sponsors")

LOGO_SOURCES = {
    "etg.png": ("image-d136ec14-19e8-45dd-8e59-02304e5c4490.png", "white", 320),
    "asas.png": ("image-089a25b5-c254-4158-9dc4-a4dcc2370fea.png", "white", 160),
    "jd-pharmacy.png": ("image-78becd8f-ce7b-4ba2-91b8-a78a5d823ae5.png", "white", 280),
    "smiles-cars.png": ("image-491c90a3-8c0d-4bf2-9f30-7e1e05d9dbc4.png", "white", 220),
    "dar-glass-works.png": ("image-7d32a088-5411-4083-976b-d6668d85c8a3.png", "black", 220),
    "amjad-motors.png": ("image-7c84d029-b944-48d4-be34-c77cb53fe28d.png", "black", 220),
}


def trim_alpha(img):
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def remove_white(img, t=235):
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r >= t and g >= t and b >= t:
                px[x, y] = (0, 0, 0, 0)
            else:
                lum = (r + g + b) / 3
                if lum > 248:
                    px[x, y] = (r, g, b, max(0, int((255 - lum) * 14)))
    return trim_alpha(img)


def remove_black(img, t=42):
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r <= t and g <= t and b <= t:
                px[x, y] = (0, 0, 0, 0)
    return trim_alpha(img)


def save_scaled(img, path, max_dim):
    img = trim_alpha(img)
    w, h = img.size
    m = max(w, h)
    if m > max_dim:
        s = max_dim / m
        img = img.resize((max(1, int(w * s)), max(1, int(h * s))), Image.Resampling.LANCZOS)
    img.save(path, optimize=True)
    print(path, img.size)


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (src, mode, max_dim) in LOGO_SOURCES.items():
        path = os.path.join(ASSETS, src)
        img = Image.open(path)
        out = remove_white(img) if mode == "white" else remove_black(img)
        save_scaled(out, os.path.join(OUT, name), max_dim)

if __name__ == "__main__":
    main()
