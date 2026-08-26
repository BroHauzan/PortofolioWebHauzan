# Personal Web Portfolio - Hauzan Naufal Abqari

Website portofolio personal yang dirancang dengan pendekatan visual ala Apple (Apple-Inspired Design), berfokus pada estetika glassmorphism, animasi interaktif berbasis fisika pegas (spring physics), dan galeri fotografi dinamis.

Website ini dibuat untuk menampilkan karya fotografi, proyek kreatif, latar belakang, serta aktivitas profesional saya dalam satu wadah yang modern dan responsif.

## Fitur Utama Website

- Design System ala Apple: Mengaplikasikan antarmuka glassmorphism dengan efek backdrop blur, komponen kartu semi-transparan, dan tombol bernuansa liquid glass.
- Animasi Pegas Interaktif: Sistem animasi responsif berbasis fisika pegas (Spring Physics Engine) tanpa library eksternal untuk memberikan respons sentuhan dan gesture yang halus.
- Galeri Foto Pintar: Penataan tata letak foto otomatis berdasarkan aspek rasio asli gambar (3:2, 2:3, 16:9).
- Background Gradasi Bergerak: Latar belakang animasi menggunakan canvas NeatGradient yang menyesuaikan dengan posisi gulir (scroll) pengguna.
- Mode Aksesibilitas: Mendukung opsi navigasi keyboard dan preferensi reduced-motion bagi pengguna.

## Isi Galeri Fotografi

Portofolio ini menampilkan koleksi fotografi terpilih dari berbagai kegiatan dan kategori:
- Blue Sky
- Extracurricular Demonstration
- Flag Ceremony
- FLS3N Competition
- Random Photos
- Scout Photography

## Teknologi yang Digunakan

- HTML5 & CSS3: Lebih dari 1.000 baris style kustom tanpa framework CSS tambahan.
- Vanilla JavaScript: Murni dibuat tanpa framework JS atau modul npm eksternal.
- NeatGradient CDN: Library untuk merender kanvas animasi gradasi latar belakang secara efisien.

## Struktur Project

```
AppleProject/
├── index.html                # Halaman utama portofolio
├── css/
│   └── apple.css             # Style glassmorphism dan animasi
├── js/
│   ├── apple.js              # Logika UI dan animasi pegas
│   ├── apple-background.js   # Kontrol latar belakang NeatGradient
│   └── data.js               # Data profil, karya foto, dan media sosial
└── img/                      # Folder penyimpan aset galeri foto
```

## Cara Menjalankan Secara Lokal

Untuk menjalankan website ini di lingkungan lokal (karena NeatGradient memerlukan protokol HTTP/HTTPS atau ES Module support), gunakan local server:

Menggunakan Python 3:
```bash
python3 -m http.server 8080
```

Menggunakan VS Code:
- Buka file `index.html`
- Klik kanan dan pilih "Open with Live Server"

Akses melalui browser di alamat: `http://localhost:8080`

---

Dikembangkan oleh Hauzan Naufal Abqari. Hak Cipta dilindungi.
