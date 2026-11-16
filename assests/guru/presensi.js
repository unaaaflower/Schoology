/* ==========================================================
   guru/presensi.js  -  [FITUR 6] PRESENSI (guru)
   presensi.html            : daftar pertemuan, buka/tutup sesi, buat sesi baru
   presensi.html#ID_SESI    : daftar kehadiran siswa, ubah status (Hadir/Izin/Sakit/Alfa)
   ========================================================== */

// Buat sesi presensi baru (langsung dibuka)
function bukaSesi() {
  const j = $("sj").value.trim();
  if (!j) return toast("Isi nama pertemuan");
  DB.sesi.push({ id: uid(), kelas: K(), judul: j, tgl: today, buka: true });
  save();
  render();
}

// Buka atau tutup sesi
function toggleSesi(id) {
  const s = DB.sesi.find(x => x.id == id);
  s.buka = !s.buka;
  save();
  render();
}

// Ubah status kehadiran siswa. "A" (Alfa) = tidak ada data presensi.
function setHadir(sid, nis, v) {
  DB.pres = DB.pres.filter(r => !(r.sid == sid && r.nis == nis));
  if (v != "A") DB.pres.push({ sid, nis, s: v });
  save();
}

function halamanPresensi(h) {
  const id = h;

  // ----- Daftar pertemuan + form sesi baru -----
  if (!id) {
    return ph("Presensi", "Buka sesi supaya siswa bisa mengisi kehadiran.") + `<div class="grid cols"><section class="card"><h2>Pertemuan</h2>${inK("sesi").slice().reverse().map(s => `<div class="row" style="cursor:default"><button class="back" style="margin:0;flex:1;text-align:left" onclick="go('presensi.html#${s.id}')"><b>${esc(s.judul)}</b><br><small>${s.tgl}, ${DB.pres.filter(r => r.sid == s.id && r.s == "H").length} hadir</small></button><button class="btn sm ${s.buka ? "y" : "ghost"}" onclick="toggleSesi('${s.id}')">${s.buka ? "Tutup sesi" : "Buka sesi"}</button></div>`).join("") || "<p class='mut'>Belum ada pertemuan.</p>"}</section>
 <section class="card"><h2>Buka sesi baru</h2><input id="sj" placeholder="Contoh: Pertemuan 13"><button class="btn" onclick="bukaSesi()">Buka sesi hari ini</button></section></div>`;
  }

  // ----- Daftar kehadiran satu pertemuan -----
  const s = DB.sesi.find(x => x.id == id);
  const pilihan = [["H", "Hadir"], ["I", "Izin"], ["S", "Sakit"], ["A", "Alfa"]];
  return `<button class="back" onclick="go('presensi.html')">&larr; Kembali</button><h1 class="pt">${esc(s.judul)}</h1><div class="meta"><span>${s.tgl}</span><span>${s.buka ? "Sesi dibuka" : "Sesi ditutup"}</span></div><section class="card wrap"><table><tr><th>Siswa</th><th>Status</th></tr>${murid().map(m => {
    const r = DB.pres.find(x => x.sid == id && x.nis == m.id);
    const v = r ? r.s : "A"; // tidak ada data = Alfa
    return `<tr><td>${esc(m.nama)}</td><td style="width:160px"><select onchange="setHadir('${id}','${m.id}',this.value)">${pilihan.map(o => `<option value="${o[0]}" ${o[0] == v ? "selected" : ""}>${o[1]}</option>`).join("")}</select></td></tr>`;
  }).join("")}</table></section>`;
}

mulaiGuru("presensi.html", halamanPresensi);
