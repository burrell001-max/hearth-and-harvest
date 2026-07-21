#!/usr/bin/env bash
# Resize + recompress hearth-and-harvest recipe card thumbnails.
# Run this from the ROOT of your repo checkout (where index.html lives).
#
# Requires ImageMagick 7+ (the `magick` command). Install with:
#   macOS:   brew install imagemagick
#   Ubuntu:  sudo apt install imagemagick
#
# Target: 700x460 (2x the ~350x230 card display size), cropped to match
# object-fit: cover so there's no distortion or letterboxing.

set -euo pipefail

TARGET_W=700
TARGET_H=460
QUALITY=78

resize_one() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    echo "  SKIP (not found): $file"
    return
  fi
  local before_size
  before_size=$(du -h "$file" | cut -f1)

  # Resize to cover 700x460, then crop from center to exactly 700x460.
  magick "$file" -resize "${TARGET_W}x${TARGET_H}^" \
                 -gravity center -extent "${TARGET_W}x${TARGET_H}" \
                 -quality "$QUALITY" \
                 "$file"

  local after_size
  after_size=$(du -h "$file" | cut -f1)
  echo "  $file: $before_size -> $after_size"
}

echo "Resizing WebP images in assets/images/recipes/ ..."
resize_one "assets/images/recipes/garlic-oil-pasta.webp"
resize_one "assets/images/recipes/creamy-tomato-pasta.webp"
resize_one "assets/images/recipes/one-pan-pasta.webp"

echo ""
echo "Resizing root-level PNGs ..."
resize_one "alfredo.png"
resize_one "pancakes.png"
resize_one "tacos.png"
resize_one "smoothie.png"
resize_one "cake.png"
resize_one "salmon.png"
resize_one "avocado-toast.png"

echo ""
echo "Resizing recipes/ PNGs (note: filenames have spaces) ..."
resize_one "recipes/Creamy Pesto Cavatappi.png"
resize_one "recipes/Classic Homemade Lasagna.png"
resize_one "recipes/beef-broccoli.png"
resize_one "recipes/Margherita Pizza.png"
resize_one "recipes/Banana Bread.png"
resize_one "recipes/Greek Salad.png"
resize_one "recipes/Chicken Caesar Wrap.png"
resize_one "recipes/Vegetable Curry.png"
resize_one "recipes/Blueberry Muffins.png"
resize_one "recipes/Shrimp Scampi.png"

echo ""
echo "Done. Also update the width/height attributes on these <img> tags in"
echo "index.html from 1200x800 to 700x460 so the browser's layout-shift math"
echo "matches the new real dimensions."
