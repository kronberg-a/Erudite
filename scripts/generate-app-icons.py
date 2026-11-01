"""Render Erudite's typographic app icons from the Segoe UI font.

Requires Pillow; pass --font when the font lives outside Windows/Fonts.
"""
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser()
parser.add_argument("--font", default="C:/Windows/Fonts/segoeui.ttf")
args = parser.parse_args()
output = Path(__file__).resolve().parent.parent / "public" / "icons"

for name, size, glyph_scale in [
    ("icon-192.png", 192, .62),
    ("icon-512.png", 512, .62),
    ("icon-maskable-512.png", 512, .52),
]:
    # Supersample the font outlines and geometric dot for crisp small icons.
    resolution = size * 4
    image = Image.new("RGB", (resolution, resolution), "#0F172A")
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(args.font, round(resolution * glyph_scale))
    mask, offset = font.getmask2("e", anchor="ls")
    ink = mask.getbbox()
    left, top, right, bottom = ink[0] + offset[0], ink[1] + offset[1], ink[2] + offset[0], ink[3] + offset[1]
    radius, gap = resolution * .033, resolution * .018
    width = right - left + gap + radius * 2
    x = (resolution - width) / 2 - left
    baseline = (resolution - (bottom - top)) / 2 - top
    draw.text((x, baseline), "e", font=font, fill="#F8FAFC", anchor="ls")
    cx, cy = x + right + gap + radius, baseline + bottom - radius
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill="#60A5FA")
    image.resize((size, size), Image.Resampling.LANCZOS).save(output / name)
