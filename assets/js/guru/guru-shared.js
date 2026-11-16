const U = me();                                      // guru yang sedang login
const today = new Date().toISOString().slice(0, 10); // tanggal hari ini (YYYY-MM-DD)

// Menu navigasi guru: [file halaman, tulisan menu]
const MENU_GURU = [
  ["dashboard.html", "Beranda"],
  ["tugas.html", "Tugas"],
  ["quiz.html", "Quiz"],
  ["praktek.html", "Praktek"],
  ["presensi.html", "Presensi"],
  ["tanya-jawab.html", "Tanya"],
  ["penilaian.html", "Nilai"],
  ["profile.html", "Profil"]
];

/* ---------- [FITUR 10] PILIHAN KELAS (guru) ----------
   Semua data di halaman guru difilter berdasarkan kelas yang sedang dipilih. */

// Kelas yang sedang aktif
const K = () => cls();

// Ambil data dari tabel t (tugas, quiz, praktek, sesi, tanya) milik kelas aktif
const inK = t => DB[t].filter(x => x.kelas == K());

// Dipanggil saat guru mengganti kelas di pilihan atas, lalu kembali ke dashboard
function setKelas(v) {
  DB.gk = v;
  save();
  location.href = "dashboard.html";
}

// Isi pilihan kelas di bagian atas halaman (nama kelas yang diajar guru)
function isiPilihanKelas() {
  $("kls").innerHTML = U.kelas.map(k => `<option value="${k}" ${k == K() ? "selected" : ""}>${kname(k)}</option>`).join("");
}

/* ---------- Fungsi bantu lain ---------- */

// Hapus satu data (tbl = nama tabel, id = id data), lalu pindah ke halaman "back"
function hapus(tbl, id, back) {
  if (!confirm("Hapus item ini?")) return;
  DB[tbl] = DB[tbl].filter(x => x.id != id);
  save();
  go(back);
}

// Tombol "Hapus" kecil
const del = (tbl, id, back) => `<button class="btn ghost sm" onclick="hapus('${tbl}','${id}','${back}')">Hapus</button>`;

// Rata-rata skor siswa kelas ini pada satu quiz/praktek (null kalau belum ada)
const hasil = (tbl, key, id) => {
  const a = DB[tbl].filter(x => x[key] == id && murid().some(m => m.id == x.nis));
  return a.length ? Math.round(a.reduce((s, x) => s + x.sc, 0) / a.length) : null;
};

// Menjalankan halaman guru.
// menuAktif = nama file menu yang disorot, atau fungsi(id) yang mengembalikannya.
function mulaiGuru(menuAktif, buatHalaman, setelah) {
  const pilihMenu = typeof menuAktif == "function" ? menuAktif : () => menuAktif;
  boot("guru", MENU_GURU, pilihMenu, buatHalaman, id => {
    isiPilihanKelas();
    if (setelah) setelah(id);
  });
}
