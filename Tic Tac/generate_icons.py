#!/usr/bin/env python3
"""Generate app icons from icon.png"""

from PIL import Image
import os
import json

# Source icon path
source_path = 'assets/icons/icon.png'

if not os.path.exists(source_path):
    print(f'❌ Icon not found at {source_path}')
    exit(1)

# Load image
img = Image.open(source_path)
if img.mode != 'RGBA':
    img = img.convert('RGBA')

print(f'✓ Loading icon: {img.size}')

# Android icons
print('\n📱 Generating Android icons...')
android_sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

for folder, size in android_sizes.items():
    folder_path = f'android/app/src/main/res/{folder}'
    os.makedirs(folder_path, exist_ok=True)
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(f'{folder_path}/ic_launcher.png', 'PNG')
    print(f'  ✓ {folder}/ic_launcher.png ({size}x{size})')

# iOS icons
print('\n🍎 Generating iOS icons...')
ios_sizes = {
    'Icon-1024.png': 1024,
    'Icon-180.png': 180,
    'Icon-120.png': 120,
    'Icon-114.png': 114,
    'Icon-87.png': 87,
    'Icon-60.png': 60,
    'Icon-58.png': 58,
    'Icon-29.png': 29,
    'Icon-40.png': 40,
    'Icon-80.png': 80,
    'Icon-120.png': 120,
}

ios_path = 'ios/Runner/Assets.xcassets/AppIcon.appiconset'
os.makedirs(ios_path, exist_ok=True)

for filename, size in ios_sizes.items():
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(f'{ios_path}/{filename}', 'PNG')
    print(f'  ✓ {filename} ({size}x{size})')

# iOS Contents.json
contents = {
    "images": [
        {"size": "1024x1024", "idiom": "ios-marketing", "filename": "Icon-1024.png", "scale": "1x"},
        {"size": "60x60", "idiom": "iphone", "filename": "Icon-60.png", "scale": "2x"},
        {"size": "60x60", "idiom": "iphone", "filename": "Icon-180.png", "scale": "3x"},
        {"size": "29x29", "idiom": "iphone", "filename": "Icon-29.png", "scale": "1x"},
        {"size": "29x29", "idiom": "iphone", "filename": "Icon-58.png", "scale": "2x"},
        {"size": "29x29", "idiom": "iphone", "filename": "Icon-87.png", "scale": "3x"},
        {"size": "40x40", "idiom": "iphone", "filename": "Icon-80.png", "scale": "2x"},
        {"size": "40x40", "idiom": "iphone", "filename": "Icon-120.png", "scale": "3x"},
    ],
    "info": {"version": 1, "author": "xcode"}
}

with open(f'{ios_path}/Contents.json', 'w') as f:
    json.dump(contents, f, indent=2)
print(f'  ✓ Contents.json')

print('\n✅ All icons generated successfully!')

