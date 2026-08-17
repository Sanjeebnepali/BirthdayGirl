// Photos dataset ordered chronologically from childhood to present

import childImg from '../../bty/0ceb9684-0601-47ec-b006-3a5e75451944.png';
import schoolImg from '../../bty/8e35c4af-a80f-41f3-8409-df34ec98d7d9.png';
import mountainImg from '../../bty/f62128f1-698f-4456-b787-65145d9263eb.png';
import festiveImg from '../../bty/5ee03d1b-9cb5-445b-a5c8-ca3b403096a4.png';
import cutoutSunglasses from '../../bty/8e3500b7-9086-46cc-9508-a42799f23c50.png';
import cutoutRoyal from '../../bty/d860951b-f5d9-4679-8341-d5c622546f50.png';

export const TRANSPARENT_CUTOUTS = {
  sunglasses: cutoutSunglasses,
  royal: cutoutRoyal,
};

export const CHRONOLOGICAL_PHOTOS = [
  {
    id: 'childhood',
    url: childImg,
    ageTag: 'Childhood Memory 👶',
    title: 'Little Princess 🌸',
    subtitle: 'Where the beautiful journey began...',
    description: 'Pure innocence and sweet smiles from the early days.',
    badge: 'Childhood',
    color: 'from-pink-400 to-rose-400',
  },
  {
    id: 'school',
    url: schoolImg,
    ageTag: 'Graceful Moments ✨',
    title: 'Classic Elegance 💖',
    subtitle: 'Looking gorgeous in traditional saree...',
    description: 'A moment of charm, beauty, and quiet confidence.',
    badge: 'Memories',
    color: 'from-rose-400 to-red-500',
  },
  {
    id: 'mountain',
    url: mountainImg,
    ageTag: 'Nature & Dreams 🏔️',
    title: 'Mountain Breeze 🌿',
    subtitle: 'Soaking in scenic mountain views...',
    description: 'Adventurous spirit and peaceful natural beauty.',
    badge: 'Scenic Vibe',
    color: 'from-sky-400 to-indigo-500',
  },
  {
    id: 'festive',
    url: festiveImg,
    ageTag: 'Festive Radiance 🌸',
    title: 'Traditional Charm 💕',
    subtitle: 'Beautiful green suit & radiant smile...',
    description: 'Celebrating rich traditions with grace and warmth.',
    badge: 'Festival',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'sunglasses',
    url: cutoutSunglasses,
    ageTag: 'Celebration Swag 😎',
    title: 'Festive Shades 🎉',
    subtitle: 'Garland, tika & stylish sunglasses...',
    description: 'Pure joy, fun vibes, and birthday energy.',
    badge: 'Fun Vibe',
    color: 'from-amber-400 to-orange-500',
    isCutout: true,
  },
  {
    id: 'queen',
    url: cutoutRoyal,
    ageTag: 'Birthday Queen 👑',
    title: 'Royal Birthday Queen ✨',
    subtitle: 'Stunning red & gold traditional look 💕',
    description: 'The glowing centerpiece of today—mesmerizing and kind.',
    badge: 'Today’s Star',
    color: 'from-pink-500 via-rose-500 to-amber-500',
    isCutout: true,
  },
];
