# Laporan Teknis Proyek: Lephant - Tangkahan Tourism Website

## 1. Informasi Tim Pengembang
Proyek pengembangan website pariwisata Tangkahan ("Lephant") ini dikembangkan secara kolaboratif oleh **2 orang pengembang** (1 Laki-laki dan 1 Perempuan). Keduanya bekerja sama dalam merancang antarmuka (UI/UX), menulis struktur kode, hingga mengimplementasikan animasi interaktif kelas atas pada website ini.

## 2. Lingkungan Pengembangan (Development Environment)
Meskipun proyek ini memiliki tingkat kompleksitas antarmuka yang tinggi (kaya akan animasi dan efek visual), proses pengembangannya dilakukan dengan sangat optimal pada perangkat kelas harian (entry-level) berkat penggunaan sistem operasi yang ringan serta *stack* teknologi yang modern dan efisien.

Berikut adalah spesifikasi teknis perangkat yang digunakan dalam pembuatan proyek ini:
* **Perangkat / Model:** Acer Aspire 5
* **Prosesor:** Intel® Core™ i3 Generasi ke-10 (seri i3-1005G1)
* **Memori (RAM):** 8 GB (DDR4)
* **Penyimpanan Utama:** Solid State Drive (SSD)
* **Layar:** 14 Inci (Tata letak dan *scaling* website sangat optimal dan terlihat memukau pada ukuran layar ini)
* **Sistem Operasi (OS):** Linux Debian
* **Desktop Environment:** GNOME

Penggunaan OS Linux Debian sangat membantu kelancaran proses *coding* dan *rendering* pada mesin dengan RAM 8GB, memastikan tidak ada hambatan performa yang berarti saat menjalankan *local server* maupun memanipulasi *assets*.

## 3. Stack Teknologi & Bahasa Pemrograman
Website ini dibangun menggunakan prinsip **Single Page Application (SPA)** yang interaktif. Teknologi utama yang digunakan meliputi:

* **Bahasa Pemrograman Utama:** JavaScript (standar ES6+) dan HTML/JSX.
* **Framework / Library UI:** React.js
* **Build Tool / Bundler:** Vite (dipilih karena kecepatan *Hot Module Replacement* yang luar biasa dibanding Webpack tradisional).
* **Styling & Desain:** 
  * **Tailwind CSS:** Digunakan sebagai *utility-first framework* untuk mendesain tata letak dan bentuk secara instan.
  * **Vanilla CSS:** Digunakan untuk animasi kustom yang kompleks (seperti CSS Keyframes) dan penataan *font*.
* **Library Animasi Khusus:** GSAP (GreenSock Animation Platform). GSAP memegang peranan vital dalam menangani pergerakan komponen yang rumit (seperti *Dome Gallery*, transisi paralaks, dan pergantian *background* gambar yang mulus).
* **Version Control:** Git dan GitHub.

## 4. Alur Teknis dan Arsitektur Website (Technical Flow)
Website Lephant dirancang untuk memberikan pengalaman penjelajahan (*scrolling experience*) yang sinematik, interaktif, dan informatif bagi calon wisatawan Tangkahan. Berikut adalah alur teknis dan cara kerja aplikasinya:

### A. Inisialisasi dan Pemuatan (Bootstrapping & Loading)
1. Saat pengguna pertama kali membuka website, **Vite** memuat *bundle* utama JavaScript.
2. Selama *assets* gambar resolusi tinggi sedang diunduh di latar belakang, website menampilkan layar pemuatan (Loading Screen) dengan efek hitung persentase.
3. Setelah semuanya siap, layar pemuatan akan menghilang perlahan dan menampilkan **Hero Section**.

### B. Navigasi dan Manajemen State
* **State Management:** Website ini menggunakan fitur bawaan React (Hooks seperti `useState`, `useEffect`, dan `useRef`) untuk melacak status pengguna. Contoh: mencatat tombol apa yang sedang ditekan, gambar latar apa yang aktif, hingga nilai skor pada bagian permainan "Starter Pack".
* **Staggered Menu:** Navigasi dibuat menyamping (Sidebar) yang tersembunyi. Saat ditekan, item menu akan bermunculan secara bertahap menggunakan animasi transisi (`transition-delay` pada CSS dan pengaturan logika *boolean* di React).

### C. Alur Konten Interaktif (Berdasarkan Section)
Website dipecah ke dalam beberapa komponen (*components*) agar struktur kode bersih dan dapat di-*maintain* dengan mudah:
1. **Hero & Scroll Indicator:** Menggunakan teks yang diketik secara dinamis (efek *typewriter*) untuk menarik perhatian. Saat di-*scroll*, pengguna masuk ke lapisan narasi.
2. **Interactive Map & Timeline:** Pengguna dapat menelusuri alur waktu sejarah Tangkahan (dari tempat penebangan liar hingga menjadi ekowisata) serta melihat peta lokasi. Interaksi bergantung pada deteksi posisi *scroll* layar.
3. **Destinations (Crossfade Image):** Bagian yang menantang secara teknis. Saat *mouse* bergerak melintasi nama destinasi, React menangkap *event* `onMouseEnter`, lalu memicu GSAP untuk memudarkan (*crossfade*) latar belakang website secara *real-time* dengan waktu respons 0.5 detik, memberikan efek imersif tanpa mengganggu teks di depannya.
4. **Starter Pack Mini-Game:** Menggunakan *array state* di React untuk melacak barang bawaan yang dipilih pengguna. Ini adalah alur *gamification* sederhana yang menghitung skor secara otomatis setiap kali sebuah *item* diklik, menguji pemahaman pengunjung tentang apa yang boleh dan tidak boleh dibawa ke hutan.
5. **The Canopy Atlas (Dome Gallery):** Alur teknis terberat. Sebuah galeri 3D interaktif yang berisi 25 gambar beresolusi tinggi. Komponen ini membaca parameter sentuhan (*drag*) dan *mouse movement* untuk memutar gambar-gambar layaknya berada di dalam sebuah kubah.
6. **Footer & Kontak:** Mengarahkan pengguna langsung ke jalur komunikasi resmi (WhatsApp dan Instagram) menggunakan metode tautan statis.

## 5. Ringkasan
Proyek ini membuktikan bahwa dengan optimalisasi perangkat lunak yang tepat (React + Vite + Linux Debian), sebuah laptop harian spesifikasi Intel Core i3 generasi ke-10 dengan RAM 4GB sangat mampu digunakan secara produktif untuk membangun *web app* yang modern, rumit, dan sarat akan animasi grafis tanpa kendala berarti. Kerja sama tim yang solid antara 2 orang pengembang berhasil melahirkan antarmuka yang setara dengan standar web pariwisata profesional masa kini.

## 6. Cara Menjalankan Proyek
1. Pastikan Anda sudah menginstal Node.js.
2. Lakukan instalasi dependency dengan menjalankan perintah: `npm install`
3. Jalankan development server dengan perintah: `npm run dev`
4. Buka tautan localhost yang muncul di terminal pada browser Anda.
