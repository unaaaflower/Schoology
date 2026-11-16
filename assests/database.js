/* ==========================================================
   database.js
   Database lokal memakai localStorage (dipakai bersama oleh guru dan siswa).
   Karena guru dan siswa membaca/menulis ke database yang SAMA,
   data keduanya otomatis saling terhubung.
   ========================================================== */

// Nama kunci penyimpanan di localStorage
const KEY = "schoology_db_v1";

// Data contoh awal (dipakai kalau localStorage masih kosong)
const SEED = {
  session: null, // id (NIS/NIP) pengguna yang sedang login
  gk: null,      // kelas yang sedang dipilih guru

  // Daftar kelas
  kelas: [
    { id: "xirpl1", n: "XI RPL 1" },
    { id: "xitkj1", n: "XI TKJ 1" },
    { id: "xrpl1", n: "X RPL 1" }
  ],

  // Daftar pengguna (siswa dan guru)
  users: [
    { id: "1001", role: "siswa", nama: "Aditya Rahman", pw: "siswa123", kelas: "xirpl1", hp: "" },
    { id: "1002", role: "siswa", nama: "Dewi Lestari", pw: "siswa123", kelas: "xirpl1", hp: "" },
    { id: "1003", role: "siswa", nama: "Rafi Pratama", pw: "siswa123", kelas: "xirpl1", hp: "" },
    { id: "2001", role: "siswa", nama: "Salsa Nabila", pw: "siswa123", kelas: "xitkj1", hp: "" },
    { id: "9001", role: "guru", nama: "Sari Wulandari", pw: "guru123", kelas: ["xirpl1", "xitkj1"], hp: "" }
  ],

  // Tugas yang dibuat guru
  tugas: [
    { id: "t1", kelas: "xirpl1", mapel: "Pemrograman Dasar", judul: "Kalkulator Sederhana dengan Python",
      desk: "Buat kalkulator tambah, kurang, kali, bagi. Tangani pembagian dengan nol.", due: "2026-11-20" },
    { id: "t2", kelas: "xirpl1", mapel: "Pemrograman Dasar", judul: "Latihan Perulangan",
      desk: "Selesaikan 5 soal perulangan di modul 4.", due: "2026-11-10" }
  ],

  // Pengumpulan tugas oleh siswa (tid = id tugas, nis = NIS siswa)
  subs: [
    { tid: "t2", nis: "1001", isi: "github.com/aditya/perulangan", nilai: 90, cat: "Rapi, lanjutkan!" },
    { tid: "t2", nis: "1002", isi: "loop.py", nilai: null, cat: "" }
  ],

  // Quiz. Tiap soal: [pertanyaan, [pilihan A,B,C,D], nomor jawaban benar (mulai dari 0)]
  quiz: [
    { id: "q1", kelas: "xirpl1", judul: "Quiz Variabel dan Tipe Data", q: [
      ["Tipe data bilangan desimal di Python adalah...", ["int", "float", "str", "bool"], 1],
      ["Fungsi untuk menampilkan teks di Python adalah...", ["input()", "print()", "len()", "type()"], 1],
      ["Hasil dari 7 // 2 di Python adalah...", ["3.5", "4", "3", "2"], 2]
    ] }
  ],
  qs: [], // skor quiz siswa: { qid, nis, sc }

  // Praktek interaktif (type "match" = cocokkan pasangan, "order" = susun kode)
  praktek: [
    { id: "p1", kelas: "xirpl1", type: "match", judul: "Cocokkan tipe data Python",
      data: [["int", "Bilangan bulat"], ["float", "Bilangan desimal"], ["str", "Teks"], ["bool", "True atau False"]] },
    { id: "p2", kelas: "xirpl1", type: "order", judul: "Susun program penjumlahan",
      data: ["a = 5", "b = 3", "hasil = a + b", "print(hasil)"] }
  ],
  ps: [], // skor praktek siswa: { pid, nis, sc }

  // Sesi presensi yang dibuat guru (buka = true berarti sedang dibuka)
  sesi: [
    { id: "s0", kelas: "xirpl1", judul: "Pertemuan 11", tgl: "2026-11-09", buka: false },
    { id: "s1", kelas: "xirpl1", judul: "Pertemuan 12", tgl: "2026-11-16", buka: true }
  ],

  // Kehadiran siswa. s = status: H (Hadir), I (Izin), S (Sakit). Tidak ada data = Alfa
  pres: [
    { sid: "s0", nis: "1001", s: "H" },
    { sid: "s0", nis: "1002", s: "I" }
  ],

  // Tanya jawab. reps = daftar balasan
  tanya: [
    { id: "a1", kelas: "xirpl1", by: "Dewi Lestari", q: "Bedanya list dan tuple di Python apa ya?", reps: [] }
  ]
};

// Ambil data dari localStorage. Kalau kosong, pakai data contoh (SEED).
let DB;
try { DB = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
DB = DB || SEED;

// Simpan seluruh data ke localStorage. Panggil setiap kali data berubah.
const save = () => {
  try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) {}
};
