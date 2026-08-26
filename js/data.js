/* ============================================================
   SEMUA DATA DI SINI. Edit file ini saja untuk update isi situs.
   Placeholder ditandai kurung siku [ ], ganti dengan datamu.
   ============================================================ */

const PROFILE = {
  name: "Hauzan Naufal",
  shortName: "Hauzan",
  /* teks kecil di atas judul hero (dirender main.js ke [data-kicker]) */
  kicker: "STUDENT · MEDIA CENTER · LIGHT, MOTION & VISUALS",
  tagline:
    "Capturing moments, creating visuals. Telling stories through photos and videos.",
  about: [
    "Hi, I'm Hauzan Naufal. A high schooler, Chairperson of Media Center (2025/2026), and part of OSIS Section 9 (IT & Pubdok). I spend most of my time leading the visual team, shooting school events, designing for OSIS, and creating photos & videos.",
    "It all started from just messing around editing class event videos, which surprisingly turned into a real passion. Now, whenever an event pops up, I'm usually the first one asking, 'who's on camera duty today?'",
    "Right now, my main goal is to expand my knowledge, level up my skills, and connect with more people along the way. Step by step, one frame at a time."
  ],
  email: "emailkamu@email.com",
};

const CATEGORIES = {
  semua: { label: "All", color: null },
  motion: { label: "Motion Graphic", color: "#B8E33C" },
  foto: { label: "Photography", color: "#FF8A1E" },
  video: { label: "Videography", color: "#0FC2A5" },
  film: { label: "Short Film", color: "#FF4D7E" },
};

/* category: "motion" | "foto" | "video" | "film"
   cover: path gambar thumbnail (boleh null -> dipakai cover polos warna kategori)
   video: URL .mp4 untuk preview/modal (boleh null)
   instagram: URL Instagram post untuk embed (boleh null)
   playable: true kalau kartunya boleh dibuka di modal player */
const PROJECTS = [
  // Blue Sky
  { id: "foto-bluesky-01", title: "Blue Sky", category: "foto", year: "2026", desc: "", cover: "img/Blue Sky/20250719-IMG_3740.jpg.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false, featured: true },
  { id: "foto-bluesky-02", title: "Blue Sky", category: "foto", year: "2026", desc: "", cover: "img/Blue Sky/20250719-IMG_3744.jpg.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-bluesky-03", title: "Blue Sky", category: "foto", year: "2026", desc: "", cover: "img/Blue Sky/20250719-IMG_3764.jpg.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  
  // Extracurricular Demonstration
  { id: "foto-extra-01", title: "Extracurricular Demonstration", category: "foto", year: "2026", desc: "", cover: "img/Extracurricular Demonstration/IMG_1790.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-extra-02", title: "Extracurricular Demonstration", category: "foto", year: "2026", desc: "", cover: "img/Extracurricular Demonstration/IMG_1835.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false, featured: true },
  { id: "foto-extra-03", title: "Extracurricular Demonstration", category: "foto", year: "2026", desc: "", cover: "img/Extracurricular Demonstration/IMG_1858.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false },
  
  // Flag Ceremony
  { id: "foto-flag-01", title: "Flag Ceremony", category: "foto", year: "2026", desc: "", cover: "img/Flag Ceremony/DSC_9684.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-flag-02", title: "Flag Ceremony", category: "foto", year: "2026", desc: "", cover: "img/Flag Ceremony/DSC_9705.jpg", video: null, instagram: null, ratio: "2 / 3", playable: false, featured: true },
  { id: "foto-flag-03", title: "Flag Ceremony", category: "foto", year: "2026", desc: "", cover: "img/Flag Ceremony/DSC_9707.jpg", video: null, instagram: null, ratio: "2 / 3", playable: false },
  { id: "foto-flag-04", title: "Flag Ceremony", category: "foto", year: "2026", desc: "", cover: "img/Flag Ceremony/DSC_9712.jpg", video: null, instagram: null, ratio: "2 / 3", playable: false },
  { id: "foto-flag-05", title: "Flag Ceremony", category: "foto", year: "2026", desc: "", cover: "img/Flag Ceremony/IMG_9222.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-flag-06", title: "Flag Ceremony", category: "foto", year: "2026", desc: "", cover: "img/Flag Ceremony/IMG_9236 (1).jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-flag-07", title: "Flag Ceremony", category: "foto", year: "2026", desc: "", cover: "img/Flag Ceremony/IMG_9237.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-flag-08", title: "Flag Ceremony", category: "foto", year: "2026", desc: "", cover: "img/Flag Ceremony/IMG_9243.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  
  // FLS3N Competition
  { id: "foto-fls3n-01", title: "FLS3N Competition", category: "foto", year: "2026", desc: "", cover: "img/FLS3N Competition/DSC_4737.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-fls3n-02", title: "FLS3N Competition", category: "foto", year: "2026", desc: "", cover: "img/FLS3N Competition/DSC_4743.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false, featured: true },
  { id: "foto-fls3n-03", title: "FLS3N Competition", category: "foto", year: "2026", desc: "", cover: "img/FLS3N Competition/IMG_5360.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false, featured: true },
  { id: "foto-fls3n-04", title: "FLS3N Competition", category: "foto", year: "2026", desc: "", cover: "img/FLS3N Competition/IMG_5384.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-fls3n-05", title: "FLS3N Competition", category: "foto", year: "2026", desc: "", cover: "img/FLS3N Competition/IMG_5457.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-fls3n-06", title: "FLS3N Competition", category: "foto", year: "2026", desc: "", cover: "img/FLS3N Competition/IMG_5465.JPG", video: null, instagram: null, ratio: "2 / 3", playable: false },
  { id: "foto-fls3n-07", title: "FLS3N Competition", category: "foto", year: "2026", desc: "", cover: "img/FLS3N Competition/IMG_5474.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false },
  
  // Random Photos
  { id: "foto-random-01", title: "Random Photos", category: "foto", year: "2026", desc: "", cover: "img/random photos/DSC07125.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-random-02", title: "Random Photos", category: "foto", year: "2026", desc: "", cover: "img/random photos/IMG_4603.JPG", video: null, instagram: null, ratio: "3 / 2", playable: false, featured: true },
  { id: "foto-random-03", title: "Random Photos", category: "foto", year: "2026", desc: "", cover: "img/random photos/SaveClip.App_605108104_18077495090216989_6877313326173852304_n.jpg", video: null, instagram: null, ratio: "16 / 9", playable: false },
  { id: "foto-random-04", title: "Random Photos", category: "foto", year: "2026", desc: "", cover: "img/random photos/SaveClip.App_694759838_18090999560216989_5594554727511106823_n.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  
  // Scout Photography
  { id: "foto-scout-01", title: "Scout Photography", category: "foto", year: "2026", desc: "", cover: "img/Scout Photography/SaveClip.App_709844012_18093590339216989_5446433037324043236_n.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-scout-02", title: "Scout Photography", category: "foto", year: "2026", desc: "", cover: "img/Scout Photography/SaveClip.App_710537683_18093590375216989_6014045530212653485_n.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false, featured: true },
  { id: "foto-scout-03", title: "Scout Photography", category: "foto", year: "2026", desc: "", cover: "img/Scout Photography/SaveClip.App_710813139_18093590330216989_8358950628414731826_n.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false, featured: true },
  { id: "foto-scout-04", title: "Scout Photography", category: "foto", year: "2026", desc: "", cover: "img/Scout Photography/SaveClip.App_711655190_18093590384216989_3028473450619564000_n.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-scout-05", title: "Scout Photography", category: "foto", year: "2026", desc: "", cover: "img/Scout Photography/SaveClip.App_711885898_18093590348216989_8455554264600540701_n.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-scout-06", title: "Scout Photography", category: "foto", year: "2026", desc: "", cover: "img/Scout Photography/SaveClip.App_712644145_18093590357216989_5786633702126607787_n.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-scout-07", title: "Scout Photography", category: "foto", year: "2026", desc: "", cover: "img/Scout Photography/SaveClip.App_713063772_18093590366216989_1397488651958794261_n.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
  { id: "foto-scout-08", title: "Scout Photography", category: "foto", year: "2026", desc: "", cover: "img/Scout Photography/WhatsApp Image 2026-08-14 at 08.42.13.jpg", video: null, instagram: null, ratio: "3 / 2", playable: false },
];

const TOOLS = [
  ["After Effects", "Premiere Pro", "Lightroom", "Photoshop", "CapCut", "Figma"],
  ["DaVinci Resolve", "Illustrator", "Canva Pro", "Blender", "Audition", "Notion"],
];

const SOCIALS = [
  { label: "Instagram", handle: "@[username]", url: "https://instagram.com/[username]" },
  { label: "TikTok", handle: "@[username]", url: "https://tiktok.com/@[username]" },
  { label: "YouTube", handle: "[Nama Channel]", url: "https://youtube.com/@[channel]" },
];
