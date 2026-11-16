/* ==========================================================
   siswa/quiz.js  -  [FITUR 5] QUIZ PILIHAN GANDA (siswa)
   quiz.html            : daftar quiz
   quiz.html#ID_QUIZ    : mengerjakan quiz, kirim jawaban, lihat skor, ulangi
   ========================================================== */

// Jawaban sementara siswa: ans[idQuiz][nomorSoal] = nomorPilihan
let ans = {};

// Hitung skor dan simpan (supaya terbaca guru)
function selesaiQuiz(id) {
  const q = DB.quiz.find(x => x.id == id);
  const a = ans[id] || {};
  if (Object.keys(a).length < q.q.length) return toast("Jawab semua soal dulu");
  const benar = q.q.filter((x, i) => a[i] == x[2]).length;
  setScore("qs", "qid", id, U.id, Math.round(benar / q.q.length * 100));
  render();
}

// Ulangi quiz: hapus skor lama dan kosongkan jawaban
function ulangQuiz(id) {
  DB.qs = DB.qs.filter(x => !(x.qid == id && x.nis == U.id));
  ans[id] = {};
  save();
  render();
}

function halamanQuiz(h) {
  const id = h;

  // ----- Daftar quiz -----
  if (!id) {
    return ph("Quiz", "Pilihan ganda, satu jawaban benar tiap soal.") + `<section class="card">${myQ().map(q => `<button class="row" onclick="go('quiz.html#${q.id}')"><div class="grow"><h3>${esc(q.judul)}</h3><small>${q.q.length} soal</small></div><span class="tag ${sc("qs", "qid", q.id) == null ? "t-belum" : "t-nilai"}">${sc("qs", "qid", q.id) == null ? "Belum dikerjakan" : "Skor " + sc("qs", "qid", q.id)}</span></button>`).join("") || "<p class='mut'>Belum ada quiz.</p>"}</section>`;
  }

  // ----- Mengerjakan satu quiz -----
  const x = DB.quiz.find(q => q.id == id);
  const a = ans[id] || {};
  const fin = sc("qs", "qid", id) != null; // true kalau sudah dikirim
  return `<button class="back" onclick="go('quiz.html')">&larr; Kembali</button><h1 class="pt">${esc(x.judul)}</h1><div class="meta">${fin ? `<b>Skor kamu: ${sc("qs", "qid", id)}</b>` : `${x.q.length} soal`}</div><section class="card narrow">${x.q.map((q, i) => `<h3 style="font:700 16px Nunito;color:var(--ink);margin:${i ? 18 : 0}px 0 8px">${i + 1}. ${esc(q[0])}</h3>${q[1].map((o, j) => `<label class="opt ${fin ? (j == q[2] ? "ok" : (a[i] == j ? "no" : "")) : ""}"><input type="radio" name="q${i}" ${a[i] == j ? "checked" : ""} ${fin ? "disabled" : ""} onchange="(ans['${id}']=ans['${id}']||{})[${i}]=${j}">${esc(o)}</label>`).join("")}`).join("")}
 ${fin ? `<button class="btn ghost" style="margin-top:14px" onclick="ulangQuiz('${id}')">Ulangi quiz</button>` : `<button class="btn" style="margin-top:14px" onclick="selesaiQuiz('${id}')">Selesai dan lihat skor</button>`}</section>`;
}

mulaiSiswa("quiz.html", halamanQuiz);
