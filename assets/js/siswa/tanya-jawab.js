/* ==========================================================
   siswa/tanya-jawab.js  -  [FITUR 8] TANYA JAWAB (siswa)
   Siswa mengirim pertanyaan, membaca balasan guru, dan membalas percakapan.
   ========================================================== */

// Kirim pertanyaan baru ke guru
function tanyaBaru() {
  const q = $("qt").value.trim();
  if (!q) return toast("Tulis pertanyaannya dulu");
  DB.tanya.unshift({ id: uid(), kelas: K, by: U.nama, q, reps: [] });
  save();
  render();
}

// Balas satu percakapan
function balas(id) {
  const v = $("r" + id).value.trim();
  if (!v) return;
  DB.tanya.find(x => x.id == id).reps.push({ by: U.nama, tx: v });
  save();
  render();
}

function halamanTanyaJawab() {
  return ph("Tanya Jawab", "Tanyakan materi yang belum paham.") + `<section class="card narrow" style="margin-bottom:18px"><h2>Tulis pertanyaan</h2><textarea id="qt" placeholder="Tulis pertanyaanmu di sini"></textarea><button class="btn" onclick="tanyaBaru()">Kirim pertanyaan</button></section><div class="grid narrow">${DB.tanya.filter(q => q.kelas == K).map(q => `<section class="card"><small>${esc(q.by)}</small><h3 style="font:700 16px Nunito;color:var(--ink)">${esc(q.q)}</h3>${q.reps.map(r => `<div class="rep"><b>${esc(r.by)}</b> ${r.g ? '<span class="tag t-nilai">Guru</span>' : ""}<br>${esc(r.tx)}</div>`).join("")}<div style="display:flex;gap:8px;margin-top:10px"><input id="r${q.id}" placeholder="Tulis balasan" style="margin:0"><button class="btn" onclick="balas('${q.id}')">Balas</button></div></section>`).join("")}</div>`;
}

mulaiSiswa("tanya-jawab.html", halamanTanyaJawab);
