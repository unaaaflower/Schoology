SCHOOLOGY - Classroom Tugas Informatika SMK (versi front-end, sudah dipisah per role dan fitur)

CARA MENJALANKAN
1. Ekstrak ZIP, lalu buka index.html di browser (Chrome disarankan).
2. Supaya data guru dan siswa saling terhubung dengan aman, lebih baik pakai server lokal:
   buka terminal di folder SCHOOLOGY ini, jalankan:   python -m http.server 8000
   lalu buka http://localhost:8000
3. Akun contoh: siswa 1001 / siswa123, guru 9001 / guru123. Kode daftar guru: GURU2026
   (ubah KODE_GURU di assets/js/login.js).
4. Data disimpan di localStorage browser (prototype). Untuk mengembalikan data contoh,
   hapus localStorage lewat DevTools (Application > Local Storage > hapus "schoology_db_v1").

STRUKTUR FOLDER
SCHOOLOGY/
  index.html                      login dan register
  assets/
    css/style.css                 seluruh tampilan (satu file, dipakai semua halaman)
    js/
      database.js                 data contoh (SEED), DB, dan fungsi save() ke localStorage
      shared.js                   fungsi bantu, rekap nilai, kerangka halaman (boot)
      praktek-engine.js           mesin praktek drag and drop (dipakai guru dan siswa)
      login.js                    login dan register
      guru/   guru-shared.js + satu file JS untuk tiap halaman guru
      siswa/  siswa-shared.js + satu file JS untuk tiap halaman siswa
  guru/    dashboard, profile, tugas, penilaian, quiz, praktek, presensi, tanya-jawab (.html)
  siswa/   dashboard, profile, tugas, pengumpulan-tugas, quiz, praktek, presensi, tanya-jawab, nilai (.html)

Setiap halaman HTML memuat: database.js, shared.js, (praktek-engine.js bila perlu),
file *-shared.js sesuai role, lalu satu file JS milik halaman itu. Urutan ini penting.

ALUR KERJA SATU HALAMAN (contoh siswa/quiz.html)
  quiz.html memuat quiz.js. Di quiz.js ada fungsi halamanQuiz() yang mengembalikan HTML,
  lalu baris terakhir memanggil mulaiSiswa("quiz.html", halamanQuiz). Fungsi itu (di shared.js: boot)
  mengecek login/role, menggambar menu, dan menampilkan HTML ke <main id="app">.
  Setiap data berubah: save() menulis ke localStorage, lalu render() menggambar ulang halaman.

DETAIL LEWAT TANDA # DI ALAMAT
  siswa/pengumpulan-tugas.html#t1   detail + pengumpulan tugas dengan id t1
  siswa/quiz.html#q1                mengerjakan quiz q1
  siswa/praktek.html#p1             mengerjakan praktek p1
  guru/penilaian.html#t2            pengumpulan siswa + beri nilai untuk tugas t2
  guru/praktek.html#p1              pratinjau praktek + skor siswa
  guru/presensi.html#s0             daftar kehadiran pertemuan s0

PETA FITUR KE FILE
  Fitur                          Guru                          Siswa
  [FITUR 1,2] login, register    index.html + login.js         (sama)
  [FITUR 3]   dashboard          guru/dashboard.js             siswa/dashboard.js
  [FITUR 4]   tugas              guru/tugas.js (buat tugas)    siswa/tugas.js (daftar)
                                 guru/penilaian.js (nilai)     siswa/pengumpulan-tugas.js (kirim/batal)
  [FITUR 5]   quiz               guru/quiz.js                  siswa/quiz.js
  [FITUR 6]   presensi           guru/presensi.js              siswa/presensi.js
  [FITUR 7]   praktek            guru/praktek.js               siswa/praktek.js  (mesin: praktek-engine.js)
  [FITUR 8]   tanya jawab        guru/tanya-jawab.js           siswa/tanya-jawab.js
  [FITUR 9]   rekap nilai        guru/penilaian.js (+CSV)      siswa/nilai.js   (rumus: rekap() di shared.js)
  [FITUR 10]  pilih kelas        guru/guru-shared.js
  profil                         guru/profile.js               siswa/profile.js

BELUM ADA (sama seperti versi awal): login aman dan database server, upload file sungguhan,
notifikasi, tenggat otomatis telat untuk guru.
