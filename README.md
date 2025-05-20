# Albion Online Item Snapshot

This project scrapes weekly item data from the Albion Online API by equipment slot and publishes it as JSON files on GitHub Pages.

## 🔧 What it does

- Fetches item data for each slot (`mainhand`, `armor`, `mount`, etc.)
- Saves data to both:
  - `docs/data/latest/`
  - `docs/data/YYYY/MM/DD/`
- Generates `index.html` in each folder for easy browsing
- Automatically runs every Sunday via GitHub Actions

## 🌐 Access via GitHub Pages

Published data is available at:
https://muutmoku.github.io/ao-item-snapshot/

## 🛠 Manual usage

```bash
npm install
npm run fetch
npm run build
```

## 📁 Output structure

```
docs/
└── data/
    ├── latest/
    └── 2025/
        └── 05/
            └── 20/
```

## ⚠ Notes
Thi
s project is not affiliated with Sandbox Interactive.

Data may be incomplete depending on the official API.