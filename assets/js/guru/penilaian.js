/* ==========================================================
   guru/penilaian.js  -  [FITUR 4] PENGUMPULAN, [FITUR 9] PENILAIAN DAN REKAP NILAI (guru)

   penilaian.html            : rekap nilai seluruh siswa + tombol unduh CSV
   penilaian.html#ID_TUGAS   : pengumpulan siswa untuk satu tugas, beri nilai (0-100) dan catatan
   ========================================================== */

// Simpan nilai dan catatan guru untuk satu siswa (nilai langsung terlihat oleh siswa)
function nilaiTugas(tid, nis) {
  const s = DB.subs.find(x => x.tid == tid && x.nis == nis);
  const n = $("n" + nis).value;
  if (n === "" || n < 0 || n > 100) return toast("Nilai harus 0 sampai 100");
  s.nilai = +n;
  s.cat = $("c" + nis).value;
  save();
  toast("Nilai tersimpan");
  render();
}

// Ekspor rekap nilai ke file CSV (bisa dibuka di Excel)
function unduh() {
  const rows = [["Nama", "NIS", "Tugas", "Quiz", "Praktek", "Presensi %", "Nilai akhir"]].concat(
    murid().map(m => {
      const r = rekap(m.id, K());
      return [m.nama, m.id, r.t, r.q, r.p, r.pr, r.f].map(nv);
    })
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" }));
  a.download = "rekap-nilai-" + kname(K()).replace(/ /g, "-") + ".csv";
  a.click();
}

// Halaman rekap nilai seluruh siswa
function halamanRekap() {
  return ph("Rekap Nilai", "Kelas " + kname(K()) + ". Rumus: tugas 40%, quiz 25%, praktek 20%, presensi 15%.") + `<section class="card wrap"><table><tr><th>Siswa</th><th>Tugas</th><th>Quiz</th><th>Praktek</th><th>Presensi</th><th>Nilai akhir</th></tr>${murid().map(m => {
    const r = rekap(m.id, K());
    return `<tr><td>${esc(m.nama)}</td><td>${nv(r.t)}</td><td>${nv(r.q)}</td><td>${nv(r.p)}</td><td>${r.pr == null ? "–" : r.pr + "%"}</td><td><b>${nv(r.f)}</b></td></tr>`;
  }).join("")}</table></section><p class="pt"><button class="btn" onclick="unduh()">Unduh CSV (bisa dibuka di Excel)</button></p>`;
}

// Halaman pengumpulan dan penilaian satu tugas
function halamanDetailTugas(id) {
  const t = DB.tugas.find(x => x.id == id);
  return `<button class="back" onclick="go('tugas.html')">&larr; Kembali</button><h1 class="pt">${esc(t.judul)}</h1><div class="meta"><span>${kname(t.kelas)}</span><span>Tenggat ${t.due}</span>${del("tugas", id, "tugas.html")}</div><section class="card wrap"><table><tr><th>Siswa</th><th>Pengumpulan</th><th>Nilai</th><th>Catatan</th><th></th></tr>${murid().map(m => {
    const s = DB.subs.find(x => x.tid == id && x.nis == m.id); // pengumpulan siswa m
    return `<tr><td>${esc(m.nama)}</td><td>${s ? esc(s.isi) : '<span class="tag t-belum">Belum kumpul</span>'}</td>${s ? `<td style="width:80px"><input id="n${m.id}" type="number" min="0" max="100" value="${s.nilai == null ? "" : s.nilai}"></td><td><input id="c${m.id}" value="${esc(s.cat)}"></td><td><button class="btn sm" onclick="nilaiTugas('${id}','${m.id}')">Simpan</button></td>` : "<td></td><td></td><td></td>"}</tr>`;
  }).join("")}</table></section>`;
}

// Tanpa id = rekap nilai. Dengan id = detail tugas (menu "Tugas" tetap disorot).
mulaiGuru(
  id => id ? "tugas.html" : "penilaian.html",
  id => id ? halamanDetailTugas(id) : halamanRekap()
);
