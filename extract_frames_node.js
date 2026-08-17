const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const video = path.join(__dirname, 'WhatsApp Video 2026-08-07 at 3.50.44 AM.mp4');
const outDir = path.join(__dirname, 'ref_frames');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

try {
  execSync(`ffmpeg -i "${video}" -vf fps=1 -q:v 2 "${path.join(outDir, 'frame_%03d.jpg')}" -y`, { stdio: 'pipe' });
  const files = fs.readdirSync(outDir);
  files.forEach(f => console.log(f, fs.statSync(path.join(outDir, f)).size));
} catch(e) {
  console.error('ffmpeg failed, trying with npx...');
  console.error(e.message?.substring(0, 200));
}
