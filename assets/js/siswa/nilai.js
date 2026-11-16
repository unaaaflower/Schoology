/* ==========================================================
   siswa/nilai.js  -  [FITUR 9] NILAI (siswa)
   Menampilkan nilai tugas, quiz, praktek, presensi, dan nilai akhir sementara.
   Rumus ada di fungsi rekap() pada shared.js.
   ========================================================== */

function halamanNilai() {
  const r = rekap(U.id, K);
  return ph("Rekap Nilai", "Nilai akhir: tugas 40%, quiz 25%, praktek 20%, presensi 15%.") + `<section class="card wrap"><table><tr><th>Tugas</th><th>Quiz</th><th>Praktek</th><th>Presensi</th><th>Nilai akhir</th></tr><tr><td>${nv(r.t)}</td><td>${nv(r.q)}</td><td>${nv(r.p)}</td><td>${r.pr == null ? "–" : r.pr + "%"}</td><td><b>${nv(r.f)}</b></td></tr></table></section>`;
}

mulaiSiswa("nilai.html", halamanNilai);
