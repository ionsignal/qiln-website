import fs from "fs";
import path from "path";
import sharp from "sharp";
import config from "../.astro/config.generated.json" with { type: "json" };

// Constants
const FAVICON_DIR = "./public/images/favicons/";
const DEFAULT_TITLE = "Website";
const DEFAULT_FAVICON_IMAGE = "/images/logo.svg";
const BG_COLOR = "#060913"; // Dark background to fix white-on-white bug on mobile

function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Created directory: ${directoryPath}`);
  }
}

async function generateFavicons() {
  try {
    const title = config?.site?.title || DEFAULT_TITLE;
    const faviconImage = config?.site?.favicon?.image || DEFAULT_FAVICON_IMAGE;
    const faviconImagePath = path.join(
      "./src/assets",
      faviconImage.replace(/^\//, ""),
    );

    // Ensure favicon directory exists
    ensureDirectoryExists(FAVICON_DIR);

    const originalSvgBuffer = fs.readFileSync(faviconImagePath);
    const originalSvgString = originalSvgBuffer.toString("utf-8");
    const dynamicSvgString = originalSvgString
      .replace(/fill=["'](?!none)[^"']+["']/gi, 'fill="currentColor"') // Handle fill="..." and fill='...'
      .replace(/fill:\s*(?!none)[^;"]+;?/gi, "fill: currentColor;") // Handle style="fill: ...;"
      .replace(
        "</svg>",
        `<style>:root { color: #ffffff; } @media (prefers-color-scheme: light) { :root { color: ${BG_COLOR}; } }</style></svg>`,
      );
    fs.writeFileSync(path.join(FAVICON_DIR, "favicon.svg"), dynamicSvgString);
    console.log(`Saved: ${path.join(FAVICON_DIR, "favicon.svg")}`);
    const icoSizes = [16, 32, 48];
    const icoImages = [];
    for (const size of icoSizes) {
      // .ensureAlpha() is critical to prevent 3-channel RGB output which breaks the ICO encoder
      const { data, info } = await sharp(originalSvgBuffer)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      icoImages.push({ width: info.width, height: info.height, data });
    }
    const icoBuffer = imagesToIco(icoImages);
    fs.writeFileSync(path.join(FAVICON_DIR, "favicon.ico"), icoBuffer);
    console.log(`Saved: ${path.join(FAVICON_DIR, "favicon.ico")}`);
    const pwaTargets = [
      { name: "apple-touch-icon.png", size: 180 },
      { name: "web-app-manifest-192x192.png", size: 192 },
      { name: "web-app-manifest-512x512.png", size: 512 },
    ];
    for (const target of pwaTargets) {
      const logoSize = Math.round(target.size * 0.8);
      const resizedLogo = await sharp(originalSvgBuffer)
        .resize(logoSize, logoSize, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toBuffer();
      await sharp({
        create: {
          width: target.size,
          height: target.size,
          channels: 4,
          background: BG_COLOR,
        },
      })
        .composite([{ input: resizedLogo, gravity: "centre" }])
        .png()
        .toFile(path.join(FAVICON_DIR, target.name));
      console.log(`Saved: ${path.join(FAVICON_DIR, target.name)}`);
    }
    const manifest = {
      name: title,
      short_name: title,
      icons: [
        {
          src: "/images/favicons/web-app-manifest-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "/images/favicons/web-app-manifest-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable any",
        },
      ],
      theme_color: BG_COLOR,
      background_color: BG_COLOR,
      display: "standalone",
    };
    fs.writeFileSync(
      path.join(FAVICON_DIR, "site.webmanifest"),
      JSON.stringify(manifest, null, 2),
    );
    console.log(`Saved: ${path.join(FAVICON_DIR, "site.webmanifest")}`);
    console.log("Favicons generated successfully.");
  } catch (error) {
    console.error("Error generating favicons:", error);
  }
}

function imagesToIco(images) {
  const header = getHeader(images.length);
  const headerAndIconDir = [header];
  const imageDataArr = [];
  let len = header.length;
  let offset = header.length + 16 * images.length;
  images.forEach((img) => {
    const dir = getDir(img, offset);
    const bmpInfoHeader = getBmpInfoHeader(img);
    const dib = getDib(img);
    const newSize = bmpInfoHeader.length + dib.length;
    dir.writeUInt32LE(newSize, 8); // Update size in directory
    headerAndIconDir.push(dir);
    imageDataArr.push(bmpInfoHeader, dib);
    len += dir.length + newSize;
    offset += newSize;
  });

  return Buffer.concat([...headerAndIconDir, ...imageDataArr], len);
}

function getHeader(numOfImages) {
  const buf = Buffer.alloc(6);
  buf.writeUInt16LE(0, 0); // Reserved
  buf.writeUInt16LE(1, 2); // Type: 1 = ICO
  buf.writeUInt16LE(numOfImages, 4);
  return buf;
}

function getDir(img, offset) {
  const buf = Buffer.alloc(16);
  const width = img.width >= 256 ? 0 : img.width;
  const height = width;
  buf.writeUInt8(width, 0);
  buf.writeUInt8(height, 1);
  buf.writeUInt8(0, 2); // Color palette
  buf.writeUInt8(0, 3); // Reserved
  buf.writeUInt16LE(1, 4); // Color planes
  buf.writeUInt16LE(32, 6); // Bits per pixel (RGBA)
  buf.writeUInt32LE(0, 8); // Size (placeholder, updated later)
  buf.writeUInt32LE(offset, 12); // Offset
  return buf;
}

function getBmpInfoHeader(img) {
  const buf = Buffer.alloc(40);
  buf.writeUInt32LE(40, 0); // Header size
  buf.writeInt32LE(img.width, 4);
  buf.writeInt32LE(img.width * 2, 8); // BMP requires doubled height for ICOs
  buf.writeUInt16LE(1, 12); // Planes
  buf.writeUInt16LE(32, 14); // BPP
  buf.writeUInt32LE(0, 16); // Compression
  buf.writeUInt32LE(0, 20); // Image size
  buf.writeInt32LE(0, 24); // X res
  buf.writeInt32LE(0, 28); // Y res
  buf.writeUInt32LE(0, 32); // Colors
  buf.writeUInt32LE(0, 36); // Important colors
  return buf;
}

function getDib(img) {
  const { width, height, data } = img;
  const size = data.length;
  const andMapRow =
    width % 32 === 0 ? width / 8 : 4 * (Math.floor(width / 32) + 1);
  const buf = Buffer.alloc(size + andMapRow * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (width * y + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const pos = ((height - y - 1) * width + x) * 4;
      buf.writeUInt8(b, pos);
      buf.writeUInt8(g, pos + 1);
      buf.writeUInt8(r, pos + 2);
      buf.writeUInt8(a, pos + 3);
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (width * y + x) * 4;
      const a = data[i + 3];
      const isTransparent = a === 0 ? 1 : 0;
      const bitNum = (height - y - 1) * width + x;
      const width32 =
        width % 32 === 0 ? Math.floor(width / 32) : Math.floor(width / 32) + 1;
      const line = Math.floor(bitNum / width);
      const offset = Math.floor(bitNum % width);
      const pos = size + line * width32 * 4 + Math.floor(offset / 8);
      const bitVal = isTransparent & 0x00000001;
      const newVal = buf.readUInt8(pos) | (bitVal << (7 - (offset % 8)));
      buf.writeUInt8(newVal, pos);
    }
  }
  return buf;
}

generateFavicons();
