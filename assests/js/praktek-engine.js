/* ==========================================================
   praktek-engine.js
   Mesin praktek interaktif (drag and drop).
   Dipakai oleh siswa (mengerjakan) dan guru (pratinjau).
   Harus dimuat setelah shared.js.

   playPraktek(p, box, done)
   - p    : data praktek { type, judul, data }
   - box  : elemen HTML tempat latihan ditampilkan
   - done : fungsi yang dipanggil dengan skor setelah "Periksa jawaban"
   ========================================================== */
function playPraktek(p, box, done) {
  const again = `<button class="btn ghost sm" id="ulang">Coba lagi</button>`;

  if (p.type == "match") {
    /* ----- LATIHAN 1: cocokkan istilah ke definisi -----
       Seret istilah ke kotak definisi. Di HP: ketuk istilah, lalu ketuk kotaknya. */
    const P = p.data;
    const terms = shuf(P.map((_, i) => i)); // urutan istilah (diacak)
    const defs = shuf(P.map((_, i) => i));  // urutan definisi (diacak)
    let pl = {};     // penempatan: pl[nomorDefinisi] = nomorIstilah
    let sel = null;  // istilah yang sedang dipilih (untuk ketuk)
    let res = null;  // skor setelah diperiksa (null = belum diperiksa)

    // Menggambar ulang tampilan latihan
    const draw = () => {
      const used = Object.values(pl); // istilah yang sudah ditempatkan
      box.innerHTML = `<p class="mut">Seret istilah ke definisi yang cocok. Di HP: ketuk istilah, lalu ketuk kotaknya.</p><div class="pz"><div class="pool">${terms.filter(i => !used.includes(i)).map(i => `<span class="chip${sel === i ? " sel" : ""}" draggable="true" data-i="${i}">${esc(P[i][0])}</span>`).join("") || "<small>Semua istilah sudah ditempatkan</small>"}</div>${defs.map(d => `<div class="slot${res != null ? (pl[d] == d ? " ok" : " no") : ""}" data-d="${d}"><small>${esc(P[d][1])}</small><br>${pl[d] != null ? `<span class="chip" data-r="${d}">${esc(P[pl[d]][0])}</span>` : ""}</div>`).join("")}</div><button class="btn" id="cek">Periksa jawaban</button> <span id="hasil"></span>`;

      // Tombol "Periksa jawaban"
      $("cek").onclick = () => {
        if (res != null) return;
        if (Object.keys(pl).length < P.length) return toast("Tempatkan semua istilah dulu");
        const n = P.filter((_, d) => pl[d] == d).length;  // jumlah jawaban benar
        const sc = Math.round(n / P.length * 100);        // skor 0-100
        res = sc;
        draw();
        $("hasil").innerHTML = `<b>Skor: ${sc}</b> (${n} dari ${P.length} benar) ${again}`;
        $("ulang").onclick = () => playPraktek(p, box, done);
        done && done(sc);
      };
    };

    // Menempatkan istilah i ke kotak definisi d
    const put = (i, d) => {
      if (res != null) return;
      for (const k in pl) if (pl[k] == i) delete pl[k]; // lepas dari kotak lama
      pl[d] = i;
      sel = null;
      draw();
    };

    // Drag and drop
    box.ondragstart = e => {
      const c = e.target.closest("[data-i]");
      if (c) e.dataTransfer.setData("text", c.dataset.i);
    };
    box.ondragover = e => { if (e.target.closest(".slot")) e.preventDefault(); };
    box.ondrop = e => {
      const s = e.target.closest(".slot");
      if (s) { e.preventDefault(); put(+e.dataTransfer.getData("text"), +s.dataset.d); }
    };

    // Ketuk (untuk HP)
    box.onclick = e => {
      if (res != null) return;
      const c = e.target.closest("[data-i]");  // istilah di kumpulan
      const r = e.target.closest("[data-r]");  // istilah yang sudah di kotak
      const s = e.target.closest(".slot");     // kotak definisi
      if (c) { sel = +c.dataset.i; draw(); }
      else if (r) { delete pl[r.dataset.r]; draw(); }
      else if (s && sel != null) put(sel, +s.dataset.d);
    };

    draw();

  } else {
    /* ----- LATIHAN 2: susun baris kode sesuai urutan benar -----
       Seret baris, atau pakai tombol panah naik/turun. */
    const L = p.data;
    let o = shuf(L.map((_, i) => i)); // urutan baris yang tampil (diacak)
    let res = null;                   // skor setelah diperiksa

    const draw = () => {
      box.innerHTML = `<p class="mut">Susun baris kode agar urutannya benar. Seret baris, atau pakai tombol panah.</p><div class="pz">${o.map((v, pos) => `<div class="prow${res != null ? (v == pos ? " ok" : " no") : ""}" draggable="${res == null}" data-p="${pos}"><code>${esc(L[v])}</code><span><button class="mv" data-u="${pos}" aria-label="Naik">▲</button><button class="mv" data-w="${pos}" aria-label="Turun">▼</button></span></div>`).join("")}</div><button class="btn" id="cek">Periksa jawaban</button> <span id="hasil"></span>`;

      // Tombol "Periksa jawaban"
      $("cek").onclick = () => {
        if (res != null) return;
        const n = o.filter((v, i) => v == i).length; // jumlah baris di posisi benar
        const sc = Math.round(n / L.length * 100);
        res = sc;
        draw();
        $("hasil").innerHTML = `<b>Skor: ${sc}</b> (${n} dari ${L.length} baris benar) ${again}`;
        $("ulang").onclick = () => playPraktek(p, box, done);
        done && done(sc);
      };
    };

    // Memindahkan baris dari posisi a ke posisi b
    const mv = (a, b) => {
      if (res != null || b < 0 || b >= o.length) return;
      o.splice(b, 0, o.splice(a, 1)[0]);
      draw();
    };

    // Drag and drop
    box.ondragstart = e => {
      const r = e.target.closest("[data-p]");
      if (r) e.dataTransfer.setData("text", r.dataset.p);
    };
    box.ondragover = e => { if (e.target.closest("[data-p]")) e.preventDefault(); };
    box.ondrop = e => {
      const r = e.target.closest("[data-p]");
      if (r) { e.preventDefault(); mv(+e.dataTransfer.getData("text"), +r.dataset.p); }
    };

    // Tombol panah naik/turun
    box.onclick = e => {
      const u = e.target.closest("[data-u]");
      const w = e.target.closest("[data-w]");
      if (u) mv(+u.dataset.u, +u.dataset.u - 1);
      if (w) mv(+w.dataset.w, +w.dataset.w + 1);
    };

    draw();
  }
}
