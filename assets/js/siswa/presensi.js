/* ==========================================================
   siswa/presensi.js  -  [FITUR 6] PRESENSI (siswa)
   Siswa mengisi kehadiran saat sesi dibuka guru dan melihat status presensi.
   ========================================================== */

// Catat kehadiran (H = Hadir, I = Izin, S = Sakit). Hanya bisa diisi sekali.
function hadir(sid, s) {
  if (DB.pres.some(r => r.sid == sid && r.nis == U.id)) return;
  DB.pres.push({ sid, nis: U.id, s });
  save();
  toast("Presensi tercatat");
  render();
}

function halamanPresensi() {
  return ph("Presensi", "Isi kehadiran saat sesi dibuka oleh guru.") + `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">${myS().slice().reverse().map(s => {
    const r = DB.pres.find(x => x.sid == s.id && x.nis == U.id); // presensi siswa untuk sesi ini
    return `<section class="card"><h2 style="margin:0">${esc(s.judul)}</h2><p class="mut" style="margin:0 0 12px">${s.tgl}, ${s.buka ? "Sesi dibuka" : "Sesi ditutup"}</p>${r ? `<span class="tag t-${r.s}">${{ H: "Hadir", I: "Izin", S: "Sakit" }[r.s]}</span>` : s.buka ? `<button class="btn" onclick="hadir('${s.id}','H')">Hadir</button> <button class="btn ghost" onclick="hadir('${s.id}','I')">Izin</button> <button class="btn ghost" onclick="hadir('${s.id}','S')">Sakit</button>` : `<span class="tag t-A">Alfa</span>`}</section>`;
  }).join("")}</div>`;
}

mulaiSiswa("presensi.html", halamanPresensi);
