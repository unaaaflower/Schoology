/* ==========================================================
   guru/quiz.js  -  [FITUR 5] QUIZ (guru)
   Membuat quiz pilihan ganda, melihat jumlah siswa yang mengerjakan,
   rata-rata nilai, dan menghapus quiz.
   Format soal (satu soal per baris): Soal|Pilihan A|Pilihan B|Pilihan C|Pilihan D|nomor jawaban benar
   ========================================================== */

// Buat quiz baru dari teks di form (dipecah oleh parseQuiz di shared.js)
function buatQuiz() {
  const q = parseQuiz($("qx").value);
  if (!$("qj").value.trim() || !q.length) return toast("Isi judul dan minimal satu soal dengan format yang benar");
  DB.quiz.push({ id: uid(), kelas: K(), judul: $("qj").value.trim(), q });
  save();
  toast("Quiz dibuat");
  render();
}

function halamanQuiz() {
  return ph("Quiz", "Buat quiz pilihan ganda dan lihat rata-rata nilai kelas.") + `<div class="grid cols"><section class="card"><h2>Quiz kelas</h2>${inK("quiz").map(q => `<div class="row" style="cursor:default"><div class="grow"><h3>${esc(q.judul)}</h3><small>${q.q.length} soal, ${DB.qs.filter(s => s.qid == q.id && murid().some(m => m.id == s.nis)).length}/${murid().length} mengerjakan, rata-rata ${nv(hasil("qs", "qid", q.id))}</small></div>${del("quiz", q.id, "quiz.html")}</div>`).join("") || "<p class='mut'>Belum ada quiz.</p>"}</section>
 <section class="card"><h2>Buat quiz</h2><input id="qj" placeholder="Judul quiz"><textarea id="qx" style="min-height:160px" placeholder="Satu soal per baris:&#10;Soal|Pilihan A|Pilihan B|Pilihan C|Pilihan D|0&#10;(angka terakhir = nomor jawaban benar, mulai dari 0)"></textarea><button class="btn" onclick="buatQuiz()">Simpan quiz</button></section></div>`;
}

mulaiGuru("quiz.html", halamanQuiz);
