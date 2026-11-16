/* ==========================================================
   guru/tugas.js  -  [FITUR 4] MANAJEMEN TUGAS (guru)
   Melihat daftar tugas kelas dan membuat tugas baru.
   Klik satu tugas untuk melihat siapa yang sudah/belum mengumpulkan
   dan memberi nilai (penilaian.html#ID_TUGAS).
   ========================================================== */

// Buat tugas baru (disimpan di DB.tugas supaya terbaca siswa kelas ini)
function buatTugas() {
  const j = $("tj").value.trim(); // judul
  if (!j || !$("td").value) return toast("Isi judul dan tenggat");

  DB.tugas.push({
    id: uid(),
    kelas: K(),
    mapel: $("tm").value.trim() || "Informatika",
    judul: j,
    desk: $("tx").value.trim(),
    due: $("td").value
  });
  save();
  toast("Tugas dibuat");
  render();
}

function halamanTugas() {
  return ph("Tugas", "Buat tugas dan nilai pengumpulan siswa kelas " + kname(K()) + ".") + `<div class="grid cols"><section class="card"><h2>Tugas kelas</h2>${inK("tugas").map(t => `<button class="row" onclick="go('penilaian.html#${t.id}')"><div class="grow"><h3>${esc(t.judul)}</h3><small>${esc(t.mapel)}, tenggat ${t.due}</small></div><span class="tag t-kumpul">${DB.subs.filter(s => s.tid == t.id && murid().some(m => m.id == s.nis)).length}/${murid().length} kirim</span></button>`).join("") || "<p class='mut'>Belum ada tugas.</p>"}</section>
 <section class="card"><h2>Buat tugas baru</h2><input id="tj" placeholder="Judul tugas"><input id="tm" placeholder="Mata pelajaran"><textarea id="tx" placeholder="Instruksi"></textarea><label class="mut">Tenggat</label><input id="td" type="date"><button class="btn" onclick="buatTugas()">Terbitkan tugas</button></section></div>`;
}

mulaiGuru("tugas.html", halamanTugas);
