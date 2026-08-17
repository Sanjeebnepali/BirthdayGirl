const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'videoplayback (2).mp4');
const dst = path.join(__dirname, 'public', 'message_intro.mp4');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dst);
  console.log(`Successfully copied ${src} to ${dst}, size: ${fs.statSync(dst).size} bytes`);
} else {
  console.log(`Source file ${src} not found`);
}
