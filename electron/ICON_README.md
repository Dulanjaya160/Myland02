# Application Icon

## Icon Requirements

The application requires an icon file named `icon.ico` in this directory.

### Specifications:
- **Format:** ICO (Windows Icon)
- **Recommended sizes:** 256x256, 128x128, 64x64, 48x48, 32x32, 16x16
- **Color depth:** 32-bit (with alpha channel for transparency)

### How to Create:

1. **Design your icon** in a graphics editor (e.g., Photoshop, GIMP, Figma)
   - Create a square image (256x256 or 512x512)
   - Use your company logo or a food-related icon
   - Ensure it looks good at small sizes (16x16, 32x32)

2. **Convert to ICO format:**
   - Use an online converter: https://convertio.co/png-ico/
   - Or use a tool like ImageMagick: `magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico`

3. **Place the file here:**
   - Save as `electron/icon.ico`

### Temporary Icon

For testing purposes, you can use any ICO file. The build will fail without an icon file.

To quickly create a basic icon:
1. Find any PNG image
2. Convert it to ICO using an online tool
3. Save it as `icon.ico` in this directory

### Icon Usage

The icon will be used for:
- Application window icon
- Taskbar icon
- Desktop shortcut icon
- Start menu shortcut icon
- Installer icon
- Uninstaller icon
