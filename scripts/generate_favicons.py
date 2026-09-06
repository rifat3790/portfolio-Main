import os
from PIL import Image

def generate_favicons():
    source_path = os.path.join("public", "refayet-profile.png")
    if not os.path.exists(source_path):
        print(f"Error: {source_path} does not exist!")
        return

    img = Image.open(source_path).convert("RGBA")
    width, height = img.size
    print(f"Original image size: {width}x{height}")

    # For tiny icons (favicon, 48x48, 192x192), a close-up crop of head & shoulders
    # Face is located roughly between x: 500-1450, y: 150-1350
    head_size = int(width * 0.72) # ~1380px square
    left = (width - head_size) // 2
    top = int(height * 0.05) # start slightly below top
    right = left + head_size
    bottom = top + head_size

    face_crop = img.crop((left, top, right, bottom))
    print(f"Face crop size: {face_crop.size}")

    # 1. 48x48 PNG (Google Search Favicon standard)
    icon_48 = face_crop.resize((48, 48), Image.Resampling.LANCZOS)
    icon_48.save(os.path.join("public", "icon-48.png"), "PNG")
    print("Generated public/icon-48.png")

    # 2. 192x192 PNG (PWA & Android)
    icon_192 = face_crop.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(os.path.join("public", "icon.png"), "PNG")
    icon_192.save(os.path.join("src", "app", "icon.png"), "PNG")
    print("Generated public/icon.png and src/app/icon.png (192x192)")

    # 3. 180x180 PNG (Apple Touch Icon)
    icon_180 = face_crop.resize((180, 180), Image.Resampling.LANCZOS)
    icon_180.save(os.path.join("public", "apple-icon.png"), "PNG")
    icon_180.save(os.path.join("src", "app", "apple-icon.png"), "PNG")
    print("Generated public/apple-icon.png and src/app/apple-icon.png (180x180)")

    # 4. 512x512 PNG (High-DPI display & PWA splash)
    icon_512 = face_crop.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save(os.path.join("public", "icon-512.png"), "PNG")
    print("Generated public/icon-512.png (512x512)")

    # 5. Multi-Resolution favicon.ico (16x16, 32x32, 48x48)
    face_crop.save(
        os.path.join("public", "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    face_crop.save(
        os.path.join("src", "app", "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print("Generated public/favicon.ico and src/app/favicon.ico")

if __name__ == "__main__":
    generate_favicons()
