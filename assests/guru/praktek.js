/* ==========================================================
   guru/praktek.js  -  [FITUR 7] PRAKTEK INTERAKTIF (guru)
   praktek.html            : daftar praktek + form membuat praktek
   praktek.html#ID_LATIHAN : pratinjau latihan + skor siswa
   Jenis praktek: "match" (cocokkan pasangan) dan "order" (susun kode).
   ========================================================== */

// Buat praktek baru dari teks di form (dipecah oleh parsePraktek di shared.js)
function buatPraktek() {
  const ty = $("pty").value; // jenis praktek
  const d = parsePraktek(ty, $("pdt").value);
  if (!$("pj").value.trim() || d.length < 2) return toast("Isi judul dan minimal 2 baris dengan format yang benar");
  DB.praktek.push({ id: uid(), kelas: K(), type: ty, judul: $("pj").value.trim(), data: d });
  save();
  toast("Praktek dibuat");
  render();
}

function halamanPraktek(h) {
  const id = h;

  // ----- Daftar praktek + form buat praktek -----
  if (!id) {
    return ph("Praktek Interaktif", "Buat puzzle drag and drop yang sesuai dengan materi.") + `<div class="grid cols"><section class="card"><h2>Praktek kelas</h2>${inK("praktek").map(p => `<button class="row" onclick="go('praktek.html#${p.id}')"><div class="grow"><h3>${esc(p.judul)}</h3><small>${PTYPE[p.type]}, rata-rata ${nv(hasil("ps", "pid", p.id))}</small></div></button>`).join("") || "<p class='mut'>Belum ada praktek.</p>"}</section>
 <section class="card"><h2>Buat praktek</h2><input id="pj" placeholder="Judul praktek"><select id="pty"><option value="match">${PTYPE.match}</option><option value="order">${PTYPE.order}</option></select><textarea id="pdt" style="min-height:150px" placeholder="Cocokkan: satu pasangan per baris&#10;int|Bilangan bulat&#10;str|Teks&#10;&#10;Susun kode: tulis baris kode dengan urutan yang BENAR, satu per baris"></textarea><button class="btn" onclick="buatPraktek()">Simpan praktek</button></section></div>`;
  }

  // ----- Pratinjau dan skor siswa -----
  const p = DB.praktek.find(x => x.id == id);
  return `<button class="back" onclick="go('praktek.html')">&larr; Kembali</button><h1 class="pt">${esc(p.judul)}</h1><div class="meta"><span>${PTYPE[p.type]}</span>${del("praktek", id, "praktek.html")}</div><div class="grid cols"><section class="card"><h2>Pratinjau</h2><div id="play"></div></section><section class="card wrap"><h2>Skor siswa</h2><table><tr><th>Siswa</th><th>Skor</th></tr>${murid().map(m => {
    const r = DB.ps.find(x => x.pid == id && x.nis == m.id);
    return `<tr><td>${esc(m.nama)}</td><td>${r ? r.sc : "–"}</td></tr>`;
  }).join("")}</table></section></div>`;
}

// Setelah halaman tampil: jalankan pratinjau (skor pratinjau tidak disimpan)
function jalankanPratinjau(id) {
  if (id) playPraktek(DB.praktek.find(x => x.id == id), $("play"));
}

mulaiGuru("praktek.html", halamanPraktek, jalankanPratinjau);
