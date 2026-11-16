/* ==========================================================
   siswa/dashboard.js  -  [FITUR 3] DASHBOARD SISWA
   Menampilkan: sapaan, kelas, tugas yang belum dikumpulkan,
   presensi yang belum diisi, daftar praktek, dan nilai akhir sementara.
   ========================================================== */

function halamanDashboard() {
  // tugas yang belum dikumpulkan (belum atau telat)
  const up = myT().filter(t => ["belum", "telat"].includes(stat(t)));
  // sesi presensi yang dibuka tetapi belum diisi siswa ini
  const open = myS().filter(s => s.buka && !DB.pres.some(r => r.sid == s.id && r.nis == U.id));

  return `<section class="hero"><div><h1>Halo, ${esc(U.nama.split(" ")[0])}</h1><p>Kelas ${kname(K)}. Ada ${up.length} tugas yang menunggu dan ${open.length} presensi yang belum diisi.</p><button class="btn y" onclick="go('${open.length ? "presensi.html" : "praktek.html"}')">${open.length ? "Isi presensi" : "Mulai praktek"}</button></div><div class="sun"></div></section>
 <div class="grid cols"><section class="card"><h2>Tugas mendatang</h2>${up.map(rowT).join("") || "<p class='mut'>Semua tugas sudah beres.</p>"}</section><div class="grid"><section class="card"><h2>Praktek interaktif</h2>${myP().map(p => `<button class="row" onclick="go('praktek.html#${p.id}')"><div class="grow"><h3>${esc(p.judul)}</h3><small>${PTYPE[p.type]}</small></div><span class="tag ${sc("ps", "pid", p.id) == null ? "t-belum" : "t-nilai"}">${sc("ps", "pid", p.id) == null ? "Baru" : "Skor " + sc("ps", "pid", p.id)}</span></button>`).join("")}</section>
 <section class="card"><h2>Nilai akhir sementara</h2><p style="font:700 40px 'Cormorant Garamond';margin:0;color:var(--h)">${nv(rekap(U.id, K).f)}</p></section></div></div>`;
}

mulaiSiswa("dashboard.html", halamanDashboard);
