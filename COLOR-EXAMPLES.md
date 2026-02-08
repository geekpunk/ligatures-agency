# Color Scheme Examples

Here are some example color schemes you can use by updating the `colors` section in `public/album-config.json`:

## Default (Blue)
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

## Punk Pink
```json
{
  "colors": {
    "primary": "#FF1493",
    "heroBackground": "#FF1493",
    "background": "#0a0a0a",
    "text": "#f0f0f0"
  }
}
```

## Classic Black & Red
```json
{
  "colors": {
    "primary": "#FF4136",
    "heroBackground": "#1a1a1a",
    "background": "#000000",
    "text": "#ffffff"
  }
}
```

## Neon Green
```json
{
  "colors": {
    "primary": "#39FF14",
    "heroBackground": "#1a1a1a",
    "background": "#0d0d0d",
    "text": "#e8e8e8"
  }
}
```

## Deep Purple
```json
{
  "colors": {
    "primary": "#9b59b6",
    "heroBackground": "#9b59b6",
    "background": "#1a1520",
    "text": "#e0d8e8"
  }
}
```

## Orange Crush
```json
{
  "colors": {
    "primary": "#FF6B35",
    "heroBackground": "#FF6B35",
    "background": "#1a1410",
    "text": "#f0e8e0"
  }
}
```

## Minimal White
```json
{
  "colors": {
    "primary": "#333333",
    "heroBackground": "#f5f5f5",
    "background": "#ffffff",
    "text": "#1a1a1a"
  }
}
```

## Cyberpunk
```json
{
  "colors": {
    "primary": "#00FFFF",
    "heroBackground": "#FF00FF",
    "background": "#0a0014",
    "text": "#00FFFF"
  }
}
```

## Earthy Brown
```json
{
  "colors": {
    "primary": "#D4A373",
    "heroBackground": "#8B4513",
    "background": "#1a1410",
    "text": "#e8dcc8"
  }
}
```

## Monochrome
```json
{
  "colors": {
    "primary": "#888888",
    "heroBackground": "#2a2a2a",
    "background": "#1a1a1a",
    "text": "#cccccc"
  }
}
```

## Tips for Choosing Colors

1. **Contrast is Key**: Ensure text is readable on backgrounds
2. **Primary Color**: Should stand out from backgrounds - used for links and highlights
3. **Hero Background**: The top section with album artwork - can match primary or be different
4. **Background**: Main page color - usually dark for music sites
5. **Text**: Should have high contrast with background

## Testing Colors

1. Update `public/album-config.json` with your colors
2. Run `npm run dev` to preview
3. Check all sections: links, track numbers, buttons, hover states
4. Test on mobile devices for readability

## Color Tools

- [Coolors.co](https://coolors.co/) - Color palette generator
- [Adobe Color](https://color.adobe.com/) - Color wheel and harmony rules
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Ensure WCAG compliance
