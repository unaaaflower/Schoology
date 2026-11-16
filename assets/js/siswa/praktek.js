/* ==========================================================
   siswa/praktek.js  -  [FITUR 7] PRAKTEK INTERAKTIF (siswa)
   praktek.html           : daftar latihan
   praktek.html#ID_LATIHAN: mengerjakan latihan (mesinnya ada di praktek-engine.js)
   ========================================================== */

function halamanPraktek(h) {
  const id = h;

  // ----- Daftar latihan -----
  if (!id) {
    return ph("Praktek", "Latihan interaktif sesuai materi: seret, cocokkan, dan susun.") + `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">${myP().map(p => `<section class="card"><h2 style="margin:0">${esc(p.judul)}</h2><p class="mut">${PTYPE[p.type]}</p><button class="btn" onclick="go('praktek.html#${p.id}')">${sc("ps", "pid", p.id) == null ? "Mulai" : "Main lagi (terbaik " + sc("ps", "pid", p.id) + ")"}</button></section>`).join("") || "<p class='mut'>Belum ada praktek.</p>"}</div>`;
  }

  // ----- Kotak untuk mengerjakan satu latihan -----
  const p = DB.praktek.find(x => x.id == id);
  return `<button class="back" onclick="go('praktek.html')">&larr; Kembali</button><h1 class="pt">${esc(p.judul)}</h1><div class="meta"><span>${PTYPE[p.type]}</span></div><section class="card narrow" id="play"></section>`;
}

// Setelah halaman tampil: jalankan latihan, simpan skor terbaik siswa
function jalankanLatihan(id) {
  if (!id) return;
  const p = DB.praktek.find(x => x.id == id);
  playPraktek(p, $("play"), skor => {
    setScore("ps", "pid", id, U.id, skor, true);
    toast("Skor tersimpan");
  });
}

mulaiSiswa("praktek.html", halamanPraktek, jalankanLatihan);
