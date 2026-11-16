/* ==========================================================
   guru/tanya-jawab.js  -  [FITUR 8] TANYA JAWAB (guru)
   Guru melihat pertanyaan siswa, membalas, dan melihat riwayat percakapan.
   ========================================================== */

// Balas satu pertanyaan (g:1 menandai balasan dari guru)
function balas(id) {
  const v = $("r" + id).value.trim();
  if (!v) return;
  DB.tanya.find(x => x.id == id).reps.push({ by: "Guru " + U.nama.split(" ")[0], g: 1, tx: v });
  save();
  render();
}

function halamanTanyaJawab() {
  return ph("Tanya Jawab", "Jawab pertanyaan siswa kelas " + kname(K()) + ".") + `<div class="grid narrow">${inK("tanya").map(q => `<section class="card"><small>${esc(q.by)}</small><h3 style="font:700 16px Nunito;color:var(--ink)">${esc(q.q)}</h3>${q.reps.map(r => `<div class="rep"><b>${esc(r.by)}</b> ${r.g ? '<span class="tag t-nilai">Guru</span>' : ""}<br>${esc(r.tx)}</div>`).join("")}<div style="display:flex;gap:8px;margin-top:10px"><input id="r${q.id}" placeholder="Tulis jawaban" style="margin:0"><button class="btn" onclick="balas('${q.id}')">Jawab</button></div></section>`).join("") || "<p class='mut pt'>Belum ada pertanyaan.</p>"}</div>`;
}

mulaiGuru("tanya-jawab.html", halamanTanyaJawab);
