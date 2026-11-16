/* ==========================================================
   siswa/pengumpulan-tugas.js  -  [FITUR 4] DETAIL DAN PENGUMPULAN TUGAS (siswa)
   Alamat halaman: pengumpulan-tugas.html#ID_TUGAS
   Siswa bisa mengumpulkan lewat file, link, atau menulis kode,
   memberi pesan ke guru, dan membatalkan pengumpulan kalau belum dinilai.
   ========================================================== */

// Id tugas diambil dari bagian setelah tanda # pada alamat
const idTugas = location.hash.slice(1);

// Kalau alamat tidak membawa id tugas, kembali ke daftar tugas
if (!idTugas) location.replace("tugas.html");

// Kirim tugas (data disimpan di DB.subs supaya terbaca guru)
function kirimTugas(id) {
  const l = $("lk").value.trim();   // link
  const f = $("fi").files[0];       // file
  const c = $("cd").value.trim();   // kode
  if (!l && !f && !c) return toast("Isi salah satu: file, link, atau kode");

  DB.subs.push({
    tid: id,
    nis: U.id,
    isi: [f && "File: " + f.name, l, c && "(kode)"].filter(Boolean).join(", "),
    kode: c,
    nilai: null,
    cat: "",
    pesan: $("kom").value
  });
  save();
  toast("Tugas berhasil dikirim");
  render();
}

// Batalkan pengumpulan (hanya tersedia kalau belum dinilai)
function batalTugas(id) {
  DB.subs = DB.subs.filter(s => !(s.tid == id && s.nis == U.id));
  save();
  render();
}

function halamanPengumpulan(h) {
  const id = h;
  const t = DB.tugas.find(x => x.id == id);
  if (!t) return ph("Tugas", "Tugas tidak ditemukan.");
  const s = mySub(id);

  return `<button class="back" onclick="go('tugas.html')">&larr; Kembali</button><h1 class="pt">${esc(t.judul)}</h1><div class="meta"><span>${esc(t.mapel)}</span><span>Tenggat: ${t.due}</span>${tag(stat(t))}</div>
 <div class="grid cols"><section class="card"><h2>Instruksi</h2><p>${esc(t.desk)}</p>${s && s.nilai != null ? `<h2>Nilai</h2><p style="font:700 34px 'Cormorant Garamond';margin:0">${s.nilai} / 100</p><p>Catatan guru: ${esc(s.cat) || "-"}</p>` : ""}</section>
 <section class="card"><h2>Pengumpulan kamu</h2>${s ? `<p>Kamu sudah mengirim: ${esc(s.isi)}</p>${s.nilai == null ? `<button class="btn ghost" onclick="batalTugas('${id}')">Batalkan pengiriman</button>` : ""}` :
    `<label class="mut">Upload file</label><input type="file" id="fi"><label class="mut">Atau link (GitHub, Drive)</label><input id="lk" placeholder="https://github.com/username/repo"><label class="mut">Atau tulis kode</label><textarea id="cd" spellcheck="false" style="font-family:ui-monospace,monospace"></textarea><input id="kom" placeholder="Pesan untuk guru (boleh kosong)"><button class="btn" onclick="kirimTugas('${id}')">Kirim tugas</button>`}</section></div>`;
}

// Menu "Tugas" tetap disorot di halaman ini
mulaiSiswa("tugas.html", halamanPengumpulan);
