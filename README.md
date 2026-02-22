# DIY Album Page Template

A customizable album page and music player for DIY musicians and labels. Built with React + Vite, designed to be easily customized through a simple JSON configuration file.

**Live Example:** [Ligatures – Agency](https://geekpunk.github.io/ligatures-agency/)

## Features

- 🎵 HTML5 audio player with full playlist playback
- 🎨 4-state interactive album viewer: front cover → inner lyrics → inner lyrics back → back cover
- 👆 Click or swipe to navigate — motion-tracked with spring-back on partial drag
- 🔄 Boundary resistance: swiping past the first or last page tilts and snaps back
- ⏱️ Auto-advances through all 4 pages every 10 seconds when the page is at the top and idle
- ⬇️ Individual track downloads + full album ZIP download
- 🔗 Shareable URLs via `?song=` query string (e.g. `?song=white_rose` or `?song=B3`)
- 📱 Fully responsive design
- 🎤 Lyrics display (optional per track)
- ⚙️ **100% customizable via JSON config** - no code editing required!

## Quick Start: Make Your Own Album Page

### 1. Clone This Repository

```bash
# Clone the repo
git clone https://github.com/geekpunk/ligatures-agency.git my-album
cd my-album

# Remove the original git history and start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Your Content

#### Add Your Album Artwork
Place your album cover images in the `public/images/` directory. The viewer supports 4 images for the full gatefold experience:
```
public/images/
├── YourAlbum-Front.png      # Front cover
├── YourAlbum-Back.png       # Back cover
├── YourAlbum-Lyrics.png     # Inner left panel (lyrics)
└── YourAlbum-LyricsBack.png # Inner right panel
```
All images should be square (1:1 aspect ratio) for best results.

#### Add Your Songs
Place your MP3 files in the `public/songs/` directory:
```
public/songs/
├── track_01.mp3
├── track_02.mp3
├── track_03.mp3
└── ...
```

### 4. Edit the Configuration

Edit `public/album-config.json` to customize all content. This file controls everything!

```json
{
  "albumName": "Your Album Name",
  "artistName": "Your Band Name",
  "pageTitle": "Band Name – Album Name",
  "images": {
    "front": "images/YourAlbum-Front.png",
    "lyrics": "images/YourAlbum-Lyrics.png",
    "lyricsBack": "images/YourAlbum-LyricsBack.png",
    "back": "images/YourAlbum-Back.png"
  },
  "tracks": [
    {
      "side": "A",
      "number": "A1",
      "name": "Your Song Title",
      "duration": "3'30\"",
      "file": "track_01.mp3"
    }
  ],
  "lyrics": {
    "Your Song Title": "Your lyrics here\nWith line breaks"
  },
  "credits": {
    "paragraphs": [
      "Written and performed by Your Band.",
      "Recorded at Your Studio."
    ]
  },
  "links": {
    "github": "https://github.com/yourusername/your-repo",
    "instagram": "https://instagram.com/yourband",
    "bandcamp": "https://yourband.bandcamp.com"
  },
  "footer": "Your custom footer message here.",
  "downloadZip": "your-album-name.zip"
}
```

📖 **See [CONFIG.md](./CONFIG.md) for detailed configuration documentation.**

### 5. Test Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to preview your album page.

### 6. Test (Optional)

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# View test UI
npm run test:ui
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

### 7. Build for Production

```bash
npm run build
```

This will:
- Generate an optimized production build in `dist/`
- Automatically create a ZIP file of your album (images + songs)

## Deployment Options

### Option A: GitHub Pages (Free)

1. **Create a GitHub repository** for your album
2. **Update `package.json`** to set your repository URL:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name/"
   }
   ```
3. **Update `vite.config.js`** with your repo name:
   ```javascript
   base: command === 'build' ? '/your-repo-name/' : '/',
   ```
4. **Deploy:**
   ```bash
   npm run deploy
   ```
   This publishes to the `gh-pages` branch, which GitHub will serve automatically.

5. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from branch `gh-pages`

### Option B: Netlify (Free)

1. Push your code to GitHub
2. Connect your repository to [Netlify](https://netlify.com)
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

### Option C: Vercel (Free)

1. Push your code to GitHub
2. Import your repository at [Vercel](https://vercel.com)
3. Vercel auto-detects Vite settings
4. Deploy!

### Option D: Any Static Host

After running `npm run build`, upload the contents of the `dist/` folder to any static hosting service:
- AWS S3 + CloudFront
- DigitalOcean Spaces
- Your own web server
- Cloudflare Pages
- etc.

## Updating Your Album Page

To update content (add songs, change text, etc.):

1. Edit `public/album-config.json`
2. Update files in `public/songs/` or `images/` if needed
3. Run `npm run build`
4. Deploy: `npm run deploy` (or your hosting method)

**No code changes needed!** Everything is controlled by the JSON config.

## File Structure

```
your-album/
├── public/
│   ├── album-config.json      # ← Edit this to customize everything!
│   ├── images/                # ← Your album artwork (all square, same dimensions)
│   │   ├── Front.png          #   Front cover
│   │   ├── Lyrics.png         #   Inner left panel
│   │   ├── LyricsBack.png     #   Inner right panel
│   │   └── Back.png           #   Back cover
│   └── songs/                 # ← Your MP3 files
│       ├── track_01.mp3
│       └── ...
├── src/                       # React app (usually no need to edit)
├── scripts/
│   └── create-album-zip.js    # Auto-generates download ZIP
├── dist/                      # Generated build (don't edit)
├── package.json
├── vite.config.js
├── CONFIG.md                  # Detailed config documentation
└── README.md                  # This file
```

## Customization

### Colors
You can customize all colors directly in `public/album-config.json`:

```json
{
  "colors": {
    "primary": "#5B96C7",
    "heroBackground": "#5B96C7",
    "background": "#1a1a1a",
    "text": "#e0e0e0"
  }
}
```

- **primary**: Accent color for links, buttons, highlights
- **heroBackground**: Header section background
- **background**: Main page background
- **text**: Text color

No CSS editing required!

📖 **See [COLOR-EXAMPLES.md](./COLOR-EXAMPLES.md) for ready-to-use color schemes** (punk pink, neon green, classic red, and more!)

### Advanced Styling
For fonts, layout, or other styling changes, edit `src/App.css`.

### Advanced Customization
For more complex changes (adding new sections, features, etc.), you'll need to edit the React components in `src/App.jsx`.

## Why Use This?

**DIY or DIE.** Streaming services take most of the revenue and control how fans discover music. With this template, you:

- ✅ Own your content 100%
- ✅ Host anywhere you want
- ✅ No monthly fees (free tier hosting options)
- ✅ Let fans download your music directly
- ✅ Customize everything to match your aesthetic
- ✅ No platform algorithms or gatekeepers

## License

This template is open source. Feel free to use it for your band, label, or any DIY music project. Fork it, customize it, and make it your own!

**Make your own album page. DIY or DIE.**
