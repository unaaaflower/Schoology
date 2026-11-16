function halamanDashboard() {
  const T = inK("tugas"); // tugas kelas aktif
  // pengumpulan siswa yang belum diberi nilai
  const pend = DB.subs.filter(s => s.nilai == null && T.some(t => t.id == s.tid));

  return `<section class="hero"><div><h1>Halo, Bu ${esc(U.nama.split(" ")[0])}</h1><p>Kelas ${kname(K())} punya ${murid().length} siswa. Ada ${pend.length} pengumpulan yang perlu dinilai.</p><button class="btn y" onclick="go('tugas.html')">Buka tugas</button></div><div class="sun"></div></section>
 <div class="grid cols"><section class="card"><h2>Perlu dinilai</h2>${pend.map(s => {
    const t = DB.tugas.find(x => x.id == s.tid);
    const m = DB.users.find(u => u.id == s.nis);
    return `<button class="row" onclick="go('penilaian.html#${t.id}')"><div class="grow"><h3>${esc(m.nama)}</h3><small>${esc(t.judul)}</small></div><span class="tag t-kumpul">Menunggu</span></button>`;
  }).join("") || "<p class='mut'>Semua sudah dinilai.</p>"}</section>
 <section class="card"><h2>Ringkasan kelas</h2><p>Tugas aktif: <b>${T.length}</b><br>Quiz: <b>${inK("quiz").length}</b><br>Praktek interaktif: <b>${inK("praktek").length}</b><br>Pertanyaan baru: <b>${inK("tanya").filter(q => !q.reps.length).length}</b></p></section></div>`;
}

mulaiGuru("dashboard.html", halamanDashboard);
