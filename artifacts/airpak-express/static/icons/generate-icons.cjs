const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let crc = 0xffffffff;
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeB = Buffer.from(type);
  const lenB = Buffer.allocUnsafe(4);
  lenB.writeUInt32BE(data.length, 0);
  const combined = Buffer.concat([typeB, data]);
  const crcB = Buffer.allocUnsafe(4);
  crcB.writeUInt32BE(crc32(combined), 0);
  return Buffer.concat([lenB, combined, crcB]);
}

function createPNG(size, drawFn) {
  const pixels = drawFn(size);
  const scanlines = [];
  for (let y = 0; y < size; y++) {
    scanlines.push(Buffer.from([0]));
    scanlines.push(pixels.slice(y * size * 4, (y + 1) * size * 4));
  }
  const raw = Buffer.concat(scanlines);
  const compressed = zlib.deflateSync(raw, { level: 9 });

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

function roundedRect(size, radius) {
  const pixels = Buffer.alloc(size * size * 4);
  const cx = size / 2, cy = size / 2;
  const arm = size * 0.3, thick = size * 0.08;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let inBg = false;
      const bx = x, by = y;
      if (bx >= radius && bx < size - radius) inBg = true;
      else if (by >= radius && by < size - radius) inBg = true;
      else {
        const dx = bx < radius ? bx - radius : bx - (size - radius);
        const dy = by < radius ? by - radius : by - (size - radius);
        if (dx * dx + dy * dy <= radius * radius) inBg = true;
      }

      let isLogo = false;
      const lx = x - cx, ly = y - cy;
      const dist = Math.sqrt(lx * lx + ly * ly);

      if (Math.abs(ly) < thick && lx >= -arm && lx <= arm) isLogo = true;
      if (Math.abs(lx) < thick && ly >= -arm && ly <= arm) isLogo = true;
      if (dist <= arm * 0.35 + thick * 0.6 && dist >= arm * 0.35 - thick * 0.6) isLogo = true;

      let idx = (y * size + x) * 4;
      if (inBg) {
        pixels[idx] = 205;
        pixels[idx + 1] = 39;
        pixels[idx + 2] = 39;
        pixels[idx + 3] = 255;
      } else {
        pixels[idx] = 0; pixels[idx + 1] = 0; pixels[idx + 2] = 0; pixels[idx + 3] = 0;
      }
      if (isLogo) {
        if (dist <= arm * 0.35 + thick * 0.6 && dist >= arm * 0.35 - thick * 0.6) {
          pixels[idx] = Math.round(205 + (255 - 205) * 0.7);
          pixels[idx + 1] = Math.round(39 + (255 - 39) * 0.7);
          pixels[idx + 2] = Math.round(39 + (255 - 39) * 0.7);
        } else {
          pixels[idx] = 255; pixels[idx + 1] = 255; pixels[idx + 2] = 255;
        }
        pixels[idx + 3] = 255;
      }
    }
  }
  return pixels;
}

function logoWithLabel(size, label) {
  const pixels = Buffer.alloc(size * size * 4);
  const cx = size / 2, cy = size / 2;
  const arm = size * 0.3, thick = size * 0.08;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let inBg = false;
      const bx = x, by = y;
      const r = Math.round(size * 0.12);
      if (bx >= r && bx < size - r) inBg = true;
      else if (by >= r && by < size - r) inBg = true;
      else {
        const dx = bx < r ? bx - r : bx - (size - r);
        const dy = by < r ? by - r : by - (size - r);
        if (dx * dx + dy * dy <= r * r) inBg = true;
      }

      let isLogo = false;
      const lx = x - cx, ly = y - cy;
      const dist = Math.sqrt(lx * lx + ly * ly);
      if (Math.abs(ly) < thick && lx >= -arm && lx <= arm) isLogo = true;
      if (Math.abs(lx) < thick && ly >= -arm && ly <= arm) isLogo = true;
      if (dist <= arm * 0.35 + thick * 0.6 && dist >= arm * 0.35 - thick * 0.6) isLogo = true;

      let idx = (y * size + x) * 4;
      if (inBg) {
        pixels[idx] = 205; pixels[idx + 1] = 39; pixels[idx + 2] = 39; pixels[idx + 3] = 255;
      } else {
        pixels[idx] = 0; pixels[idx + 1] = 0; pixels[idx + 2] = 0; pixels[idx + 3] = 0;
      }
      if (isLogo) {
        if (dist <= arm * 0.35 + thick * 0.6 && dist >= arm * 0.35 - thick * 0.6) {
          pixels[idx] = Math.round(205 + (255 - 205) * 0.7);
          pixels[idx + 1] = Math.round(39 + (255 - 39) * 0.7);
          pixels[idx + 2] = Math.round(39 + (255 - 39) * 0.7);
        } else {
          pixels[idx] = 255; pixels[idx + 1] = 255; pixels[idx + 2] = 255;
        }
        pixels[idx + 3] = 255;
      }

      if (label) {
        const fontSize = Math.round(size * 0.12);
        const labelY = size - fontSize * 0.6;
        if (y >= labelY - fontSize && y <= labelY + fontSize * 0.4) {
          const lx2 = x - size / 2;
          const lw = label.length * fontSize * 0.5;
          if (lx2 >= -lw / 2 && lx2 <= lw / 2) {
            const charW = fontSize * 0.6;
            const charIdx = Math.floor((lx2 + lw / 2) / charW);
            if (charIdx >= 0 && charIdx < label.length) {
              const localX = (lx2 + lw / 2) - charIdx * charW;
              if (localX > charW * 0.15 && localX < charW * 0.85) {
                pixels[idx] = 0; pixels[idx + 1] = 122; pixels[idx + 2] = 255;
                pixels[idx + 3] = 230;
              }
            }
          }
        }
      }
    }
  }
  return pixels;
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const png = createPNG(size, s => roundedRect(s, Math.round(s * 0.12)));
  fs.writeFileSync(path.join(__dirname, `icon-${size}.png`), png);
  console.log(`Generated icon-${size}.png`);
});

{
  const png = createPNG(512, s => roundedRect(s, Math.round(s * 0.12)));
  fs.writeFileSync(path.join(__dirname, 'icon-maskable.png'), png);
  console.log('Generated icon-maskable.png');
}

['track', 'new', 'portal'].forEach(name => {
  const png = createPNG(96, s => logoWithLabel(s, name.toUpperCase()));
  fs.writeFileSync(path.join(__dirname, `${name}-96.png`), png);
  console.log(`Generated ${name}-96.png`);
});

console.log('All icons generated!');