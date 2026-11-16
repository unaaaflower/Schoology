/* ==========================================================
   siswa-shared.js
   Data dan fungsi bantu yang dipakai SEMUA halaman siswa.
   Urutan pemuatan: database.js, shared.js, siswa-shared.js, lalu js halaman.
   ========================================================== */

const U = me();                                   // siswa yang sedang login
const K = U && U.kelas;                           // kelas siswa
const today = new Date().toISOString().slice(0, 10); // tanggal hari ini (YYYY-MM-DD)

// Menu navigasi siswa: [file halaman, tulisan menu]
const MENU_SISWA = [
  ["dashboard.html", "Beranda"],
  ["tugas.html", "Tugas"],
  ["quiz.html", "Quiz"],
  ["praktek.html", "Praktek"],
  ["presensi.html", "Presensi"],
  ["tanya-jawab.html", "Tanya"],
  ["nilai.html", "Nilai"],
  ["profile.html", "Profil"]
];

// Data milik siswa / kelasnya
const mySub = t => DB.subs.find(s => s.tid == t && s.nis == U.id);           // pengumpulan siswa untuk tugas t
const myT = () => DB.tugas.filter(t => t.kelas == K);                        // tugas kelas
const myQ = () => DB.quiz.filter(t => t.kelas == K);                         // quiz kelas
const myP = () => DB.praktek.filter(t => t.kelas == K);                      // praktek kelas
const myS = () => DB.sesi.filter(t => t.kelas == K);                         // sesi presensi kelas

// Status tugas: belum / kumpul / nilai / telat
const stat = t => {
  const s = mySub(t.id);
  return s ? (s.nilai != null ? "nilai" : "kumpul") : (t.due < today ? "telat" : "belum");
};
const LB = { belum: "Belum dikerjakan", kumpul: "Sudah dikirim", nilai: "Sudah dinilai", telat: "Telat" };
const tag = s => `<span class="tag t-${s}">${LB[s]}</span>`;

// Satu baris tugas pada daftar (klik untuk membuka halaman pengumpulan tugas)
const rowT = t => `<button class="row" onclick="go('pengumpulan-tugas.html#${t.id}')"><div class="grow"><h3>${esc(t.judul)}</h3><small>${esc(t.mapel)}, tenggat ${t.due}</small></div>${tag(stat(t))}</button>`;

// Skor siswa dari tabel tbl (qs = quiz, ps = praktek). Null kalau belum ada.
const sc = (tbl, key, id) => {
  const r = DB[tbl].find(x => x[key] == id && x.nis == U.id);
  return r ? r.sc : null;
};

// Menjalankan halaman siswa. menuAktif = file menu yang disorot.
function mulaiSiswa(menuAktif, buatHalaman, setelah) {
  boot("siswa", MENU_SISWA, () => menuAktif, buatHalaman, setelah);
}
