import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultImagesDir = path.join(__dirname, '../public/images');
const args = process.argv.slice(2);

const processFile = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return;
    }
    
    console.log(`Processing: ${filePath}`);
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Box dimensions to cover the old watermark and place the new one
    // Adjusted to bottom-right corner. 
    const boxWidth = 260;
    const boxHeight = 50;

    // Use a dark slate/indigo background to blend with dark mode visuals
    // and a minimalist text for the mark.
    const svgOverlay = `
      <svg width="${boxWidth}" height="${boxHeight}">
        <rect x="0" y="0" width="${boxWidth}" height="${boxHeight}" fill="#0f172a" />
        <rect x="0" y="0" width="${boxWidth}" height="2" fill="#1e293b" />
        <rect x="0" y="0" width="2" height="${boxHeight}" fill="#1e293b" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="14" fill="#64748b" font-weight="500" letter-spacing="1">
          ceroaproduccion
        </text>
      </svg>
    `;

    const buffer = Buffer.from(svgOverlay);

    const tmpFile = filePath + '.tmp.png';
    await image
      .composite([
        {
          input: buffer,
          gravity: 'southeast',
        }
      ])
      .toFile(tmpFile);

    // Replace original file
    fs.renameSync(tmpFile, filePath);
    console.log(`Successfully watermarked: ${filePath}`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
};

const run = async () => {
  if (args.length > 0) {
    for (const file of args) {
      const fullPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        await processFile(fullPath);
      } else {
        console.error(`File not found: ${fullPath}`);
      }
    }
  } else {
    // Default: process all lab-*.png files in public/images
    if (fs.existsSync(defaultImagesDir)) {
      const files = fs.readdirSync(defaultImagesDir);
      for (const file of files) {
         if (file.endsWith('.png') && file !== 'tux-minimal.png') {
           await processFile(path.join(defaultImagesDir, file));
         }
      }
    } else {
      console.error(`Directory not found: ${defaultImagesDir}`);
    }
  }
};

run();
