# ILMORA Education Website

Premium 3D education consultancy website for ILMORA Education — UAE & India.

## 📁 Project Structure

```
ilmora/
├── index.html                  ← Main website file
├── css/
│   └── style.css               ← All styles
├── js/
│   └── main.js                 ← All JavaScript (3D, animations, FAQ, form)
├── images/
│   ├── logo/
│   │   ├── ilmora-white.png    ← White logo (for dark backgrounds)
│   │   └── ilmora-dark.png     ← Dark logo (for light backgrounds)
│   └── universities/
│       ├── arni.png
│       ├── rgu.png
│       ├── rntu.png
│       ├── osgu.png
│       ├── lingayas.png
│       └── jamia-urdu.png
└── README.md
```

## 🚀 Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `ilmora-website`)
2. Upload ALL files and folders — keeping the folder structure exactly as shown above
3. Go to **Settings → Pages**
4. Under **Source**, select `main` branch and `/ (root)` folder
5. Click **Save**
6. Your site will be live at: `https://yourusername.github.io/ilmora-website`

## 🚀 Deploying to Vercel (Recommended)

1. Push to GitHub first (steps above)
2. Go to [vercel.com](https://vercel.com) and import your GitHub repo
3. No configuration needed — Vercel auto-detects a static site
4. Live in 30 seconds at a custom Vercel URL

## ✏️ How to Update Content

### Change phone number:
Search for `971529682123` in `index.html` and replace.

### Change email:
Search for `Ilmoraeducationgroup@gmail.com` in `index.html` and replace.

### Change Instagram link:
Search for `ilmora_education` in `index.html` and replace with your handle.

### Add a new university:
Copy one of the `<a href="..." class="uni-card">` blocks in `index.html`
inside the `uni-grid` div and update the name, link, and logo image path.

### Add a real logo image for a university that has emoji:
Replace `<span class="uni-emoji">...</span>` with:
`<img src="images/universities/yourfile.png" alt="University Name" />`

## 📞 Contact Details Currently Set
- UAE WhatsApp: +971 52 968 2123
- India: +91 74830 08412
- Email: Ilmoraeducationgroup@gmail.com
- Instagram: @ilmora_education

## 🎨 Brand Colors
- Background: #0D0D0D
- Gold: #C9A84C
- Charcoal: #1E1E1E
- White: #FFFFFF
