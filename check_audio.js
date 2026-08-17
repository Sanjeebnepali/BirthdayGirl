const { execSync } = require('child_process');
const path = require('path');

const video = path.join(__dirname, 'videoplayback (2).mp4');

try {
  const output = execSync(`ffprobe -v error -show_entries stream=codec_type -of default=noprint_wrappers=1 "${video}"`, { encoding: 'utf8' });
  console.log('Streams in video:', output);
} catch (e) {
  console.log('ffprobe error:', e.message);
}
