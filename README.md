# 🍎 Apple-Inspired Portfolio

Modern portfolio website with fluid spring animations, glassmorphism UI, and auto-detected photo aspect ratios. Built with vanilla JavaScript—zero dependencies except NeatGradient for the animated background.

## ✨ Features

- **Spring Physics Engine**: Custom interruptible spring animations with damping ratio & response parameters (inspired by Apple's Human Interface Guidelines)
- **Glassmorphism UI**: Material translucent cards with backdrop blur, liquid glass buttons
- **Smart Photo Grid**: Auto-detected aspect ratios (3:2, 2:3, 16:9) for perfect photo layouts
- **Animated Gradient Background**: Full-page NeatGradient canvas with scroll-aware positioning
- **Direct Manipulation**: 1:1 pointer tracking with velocity handoff and rubber-band physics
- **Accessibility**: Reduced-motion support, semantic HTML, keyboard navigation
- **Dark Mode Ready**: Theme-aware color system

## 📸 Photo Gallery

- **33 photos** across 6 categories:
  - Blue Sky (3 photos)
  - Extracurricular Demonstration (3 photos)
  - Flag Ceremony (8 photos)
  - FLS3N Competition (7 photos)
  - Random Photos (4 photos)
  - Scout Photography (8 photos)
- **8 featured photos** displayed on "All" tab
- **Auto aspect-ratio detection**: Landscape (3:2), Portrait (2:3), Wide (16:9)

## 🛠️ Tech Stack

- **HTML5** + **CSS3** (1033 lines of custom styles)
- **Vanilla JavaScript** (no frameworks, no build tools)
- **NeatGradient** (CDN import for animated background)
- **Zero npm dependencies**—runs directly via `file://` or local server

## 📁 Project Structure

```
AppleProject/
├── index-apple.html          # Main HTML
├── css/
│   └── apple.css             # Glassmorphism styles, spring animations
├── js/
│   ├── apple.js              # Spring engine, interactions, UI logic
│   ├── apple-background.js   # NeatGradient animated canvas
│   └── data.js               # Profile, projects, tools, socials data
└── img/
    ├── Blue Sky/
    ├── Extracurricular Demonstration/
    ├── Flag Ceremony/
    ├── FLS3N Competition/
    ├── random photos/
    └── Scout Photography/
```

## 🚀 Quick Start

### Local Server (Recommended)

NeatGradient requires ES module support. Use a local server:

```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx http-server -p 8080

# VS Code Live Server extension
# Right-click index-apple.html → "Open with Live Server"
```

Open `http://localhost:8080/index-apple.html`

### File Protocol

Works with `file://` but NeatGradient may fail due to CORS. Background will fallback to solid color.

## ✏️ Customization

### 1. Edit Profile Data

Open `js/data.js`:

```javascript
const PROFILE = {
  name: "Your Name",
  kicker: "Your Tagline",
  tagline: "Your Role",
  bio: [
    "First paragraph...",
    "Second paragraph..."
  ],
  email: "your@email.com",
};
```

### 2. Add Photos

1. Place images in `img/CategoryName/`
2. Add entry to `PROJECTS` array in `js/data.js`:

```javascript
{
  id: "foto-unique-id",
  title: "Photo Title",
  category: "foto",
  year: "2026",
  desc: "",
  cover: "img/CategoryName/photo.jpg",
  video: null,
  instagram: null,
  ratio: "3 / 2",  // or "2 / 3" (portrait), "16 / 9" (wide)
  playable: false,
  featured: true,  // optional: show on "All" tab
},
```

### 3. Auto-Detect Photo Ratios

Use Python script to scan dimensions:

```bash
python3 << 'SCRIPT'
import os
from PIL import Image
import json

base = "img"
ratios = {}

for cat in os.listdir(base):
    cat_path = os.path.join(base, cat)
    if not os.path.isdir(cat_path): continue
    for f in os.listdir(cat_path):
        if f.lower().endswith((".jpg", ".jpeg", ".png")):
            try:
                with Image.open(os.path.join(cat_path, f)) as img:
                    w, h = img.size
                    r = w / h
                    if abs(r - 1.5) < 0.05: ratio = "3 / 2"
                    elif abs(r - 0.6667) < 0.05: ratio = "2 / 3"
                    elif abs(r - 1.7778) < 0.05: ratio = "16 / 9"
                    else: ratio = "3 / 2"
                    ratios[os.path.join(cat, f)] = {"w": w, "h": h, "ratio": ratio}
            except: pass

print(json.dumps(ratios, indent=2))
SCRIPT
```

### 4. Update Tools & Socials

```javascript
const TOOLS = [
  ["Tool 1", "Tool 2", "Tool 3"],
  ["Tool 4", "Tool 5", "Tool 6"],
];

const SOCIALS = [
  { label: "Instagram", handle: "@username", url: "https://instagram.com/username" },
  { label: "YouTube", handle: "Channel Name", url: "https://youtube.com/@channel" },
];
```

## 🎨 Design Principles

Inspired by [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/):

- **Fluid Motion**: Spring animations with damping ratio 0.86–1.0, response 0.4–0.55s
- **Direct Manipulation**: 1:1 pointer tracking, instant feedback on touch
- **Velocity Handoff**: Smooth transitions between gesture and animation
- **Rubber-Banding**: Natural resistance at scroll boundaries
- **Material Hierarchy**: Translucent layers, subtle shadows, clear depth
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

## 📄 License

MIT License—free to use and modify.

---

**Built with ❤️ for clean code and fluid interactions**
