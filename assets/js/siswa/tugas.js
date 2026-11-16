/* ==========================================================
   siswa/tugas.js  -  [FITUR 4] DAFTAR TUGAS (siswa)
   Menampilkan daftar tugas beserta mata pelajaran, tenggat, dan status.
   Klik satu tugas untuk membuka detail + pengumpulan (pengumpulan-tugas.html).
   ========================================================== */

function halamanTugas() {
  return ph("Tugas", "Tugas dari kelas " + kname(K) + ".") + `<section class="card">${myT().map(rowT).join("") || "<p class='mut'>Belum ada tugas.</p>"}</section>`;
}

mulaiSiswa("tugas.html", halamanTugas);
