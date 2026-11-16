/* ==========================================================
   shared.js
   Fungsi bantu yang dipakai oleh SEMUA halaman (login, guru, siswa).
   Harus dimuat SETELAH database.js.
   ========================================================== */

/* ---------- Fungsi bantu umum ---------- */

// Singkatan untuk document.getElementById
const $ = i => document.getElementById(i);

// Membuat id unik untuk data baru (tugas, quiz, dll)
const uid = () => "x" + Date.now().toString(36) + Math.floor(Math.random() * 999);

// Mengamankan teks agar tidak dianggap kode HTML
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Mengacak urutan array
const shuf = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);

// Inisial nama untuk avatar (contoh: "Aditya Rahman" jadi "AR")
const ini = n => n.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

// Pengguna yang sedang login
const me = () => DB.users.find(u => u.id == DB.session);

// Nama kelas dari id kelas
const kname = id => (DB.kelas.find(k => k.id == id) || { n: "-" }).n;

// Kelas aktif: guru memakai kelas yang dipilih, siswa memakai kelasnya sendiri
const cls = () => {
  const u = me();
  return u.role == "guru" ? (u.kelas.includes(DB.gk) ? DB.gk : u.kelas[0]) : u.kelas;
};

// Daftar siswa pada kelas aktif
const murid = () => DB.users.filter(u => u.role == "siswa" && u.kelas == cls());

// Pindah halaman. Contoh: go("tugas.html") atau go("quiz.html#q1")
const go = alamat => { location.href = alamat; };

// Judul halaman (h1) beserta kalimat di bawahnya
const ph = (t, s) => `<h1 class="pt">${t}</h1><p class="sub">${s}</p>`;

// Menampilkan pesan kecil di bawah layar
function toast(m) {
  const t = $("toast");
  t.textContent = m;
  t.className = "on";
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.className = "", 2200);
}

// Logout: hapus sesi lalu kembali ke halaman login.
// (index.html ada di folder induk dari guru/ dan siswa/)
function keluar() {
  DB.session = null;
  save();
  location.href = "../index.html";
}

// Menyimpan skor (quiz/praktek). Kalau best = true, hanya skor tertinggi yang disimpan
function setScore(tbl, key, id, nis, sc, best) {
  const r = DB[tbl].find(x => x[key] == id && x.nis == nis);
  if (r) { if (!best || sc > r.sc) r.sc = sc; }
  else DB[tbl].push({ [key]: id, nis, sc });
  save();
}

/* ---------- Pembaca teks dari form guru ---------- */

// Quiz: tiap baris berformat "Soal|A|B|C|D|0-3"
function parseQuiz(t) {
  return t.split("\n")
    .map(l => l.split("|").map(x => x.trim()))
    .filter(p => p.length >= 4 && !isNaN(p[p.length - 1]))
    .map(p => [p[0], p.slice(1, -1), +p[p.length - 1]]);
}

// Praktek: "match" = "istilah|definisi" per baris, "order" = satu baris kode per baris
function parsePraktek(type, t) {
  const L = t.split("\n").map(x => x.replace(/\s+$/, "")).filter(x => x.trim());
  return type == "match"
    ? L.map(l => l.split("|").map(x => x.trim())).filter(p => p.length == 2 && p[0] && p[1])
    : L;
}

/* ---------- Rekap nilai ----------
   Rumus nilai akhir: tugas 40%, quiz 25%, praktek 20%, presensi 15%.
   Dipakai oleh halaman nilai siswa dan penilaian guru. */
function rekap(nis, k) {
  // rata-rata dari kumpulan angka (null kalau kosong)
  const avg = a => a.length ? Math.round(a.reduce((s, x) => s + x, 0) / a.length) : null;
  // daftar id (tugas/quiz/praktek) milik kelas k
  const ids = t => DB[t].filter(x => x.kelas == k).map(x => x.id);

  const t = avg(DB.subs.filter(s => ids("tugas").includes(s.tid) && s.nis == nis && s.nilai != null).map(s => s.nilai));
  const q = avg(DB.qs.filter(s => ids("quiz").includes(s.qid) && s.nis == nis).map(s => s.sc));
  const p = avg(DB.ps.filter(s => ids("praktek").includes(s.pid) && s.nis == nis).map(s => s.sc));

  // presensi = persen kehadiran "H" dari seluruh sesi
  const ss = DB.sesi.filter(s => s.kelas == k);
  const pr = ss.length
    ? Math.round(DB.pres.filter(r => ss.some(s => s.id == r.sid) && r.nis == nis && r.s == "H").length / ss.length * 100)
    : null;

  // nilai akhir = rata-rata berbobot dari komponen yang sudah ada nilainya
  const pt = [[t, .4], [q, .25], [p, .2], [pr, .15]].filter(x => x[0] != null);
  return {
    t, q, p, pr,
    f: pt.length ? Math.round(pt.reduce((s, x) => s + x[0] * x[1], 0) / pt.reduce((s, x) => s + x[1], 0)) : null
  };
}

// Menampilkan "–" kalau nilai belum ada
const nv = v => v == null ? "–" : v;

// Nama jenis praktek untuk ditampilkan
const PTYPE = { match: "Cocokkan istilah (drag and drop)", order: "Susun urutan kode (puzzle)" };

/* ---------- Kerangka halaman guru/siswa ----------
   Dipanggil oleh guru-shared.js dan siswa-shared.js.
   - role      : "guru" atau "siswa" (halaman hanya boleh dibuka oleh role ini)
   - MENU      : daftar menu [[file, label], ...]
   - menuAktif : fungsi(id) yang mengembalikan nama file menu yang disorot
   - buatHalaman(id) : fungsi yang mengembalikan HTML isi halaman
   - setelah(id)     : (opsional) fungsi yang dijalankan setelah HTML tampil */
function boot(role, MENU, menuAktif, buatHalaman, setelah) {
  // Belum login atau role salah: kembali ke halaman login
  const u = me();
  if (!u || u.role != role) { location.href = "../index.html"; return; }

  const render = () => {
    const id = location.hash.slice(1); // bagian setelah # (contoh: id tugas)
    $("av").textContent = ini(me().nama);
    $("nav").innerHTML = MENU.map(m =>
      `<button onclick="go('${m[0]}')" ${m[0] == menuAktif(id) ? 'aria-current="page"' : ""}>${m[1]}</button>`
    ).join("");
    $("app").innerHTML = buatHalaman(id);
    if (setelah) setelah(id);
  };

  window.render = render;
  // Kalau hanya bagian # yang berubah (buka detail), tampilkan ulang halaman
  addEventListener("hashchange", () => { render(); scrollTo(0, 0); });
  render();
}
