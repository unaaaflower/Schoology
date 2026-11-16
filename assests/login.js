/* ==========================================================
   login.js
   Halaman index.html: LOGIN dan REGISTER (pilihan role siswa atau guru).
   ========================================================== */

let mode = "masuk";   // "masuk" (login) atau "daftar" (register)
let rrole = "siswa";  // role yang dipilih saat daftar

// Kode rahasia agar siswa tidak bisa mendaftar sebagai guru
const KODE_GURU = "GURU2026";

// Alamat dashboard sesuai role
function alamatDashboard(role) {
  return role == "guru" ? "guru/dashboard.html" : "siswa/dashboard.html";
}

// Menggambar form login atau register
function view() {
  // pilihan kelas untuk pendaftaran siswa
  const kopt = DB.kelas.map(k => `<option value="${k.id}">${k.n}</option>`).join("");

  $("app").innerHTML = `<div class="logo">Schoology</div><p class="sub" style="border:0">Kelas dan tugas informatika SMK dalam satu tempat.</p><section class="card">` + (mode == "masuk" ?
    // ----- Form LOGIN -----
    `<h2>Masuk</h2><input id="u" placeholder="NIS (siswa) atau NIP (guru)" autocomplete="username"><input id="p" type="password" placeholder="Password" autocomplete="current-password"><button class="btn" style="width:100%" onclick="masuk()">Masuk</button>
  <p class="mut" style="margin:14px 0 0">Akun contoh: siswa <b>1001</b> / siswa123, guru <b>9001</b> / guru123</p><p class="mut" style="text-align:center;margin:8px 0 0">Belum punya akun? <a href="#" onclick="mode='daftar';view();return false" style="color:var(--h);font-weight:700">Daftar</a></p>` :
    // ----- Form REGISTER -----
    `<h2>Daftar</h2><div style="display:flex;gap:16px;margin-bottom:10px"><label><input type="radio" name="r" ${rrole == "siswa" ? "checked" : ""} onchange="rrole='siswa';view()"> Siswa</label><label><input type="radio" name="r" ${rrole == "guru" ? "checked" : ""} onchange="rrole='guru';view()"> Guru</label></div>
  <input id="rn" placeholder="Nama lengkap"><input id="ri" placeholder="${rrole == "siswa" ? "NIS" : "NIP"}"><input id="rp" type="password" placeholder="Password, minimal 6 karakter">
  ${rrole == "siswa" ? `<select id="rk">${kopt}</select>` : `<input id="rg" placeholder="Kode guru (tanya admin sekolah)"><p class="mut" style="margin:0 0 6px">Kelas yang kamu ajar:</p>${DB.kelas.map(k => `<label style="display:block"><input type="checkbox" class="kk" value="${k.id}"> ${k.n}</label>`).join("")}<div style="height:10px"></div>`}
  <button class="btn" style="width:100%" onclick="daftar()">Buat akun</button><p class="mut" style="text-align:center;margin:14px 0 0">Sudah punya akun? <a href="#" onclick="mode='masuk';view();return false" style="color:var(--h);font-weight:700">Masuk</a></p>`) + `</section>`;
}

// [LOGIN] Cocokkan NIS/NIP dan password, lalu arahkan ke dashboard sesuai role
function masuk() {
  const u = DB.users.find(x => x.id == $("u").value.trim() && x.pw == $("p").value);
  if (!u) return toast("NIS/NIP atau password salah");
  DB.session = u.id;
  save();
  location.href = alamatDashboard(u.role);
}

// [REGISTER] Buat akun baru (siswa atau guru), lalu langsung login
function daftar() {
  const n = $("rn").value.trim();  // nama
  const i = $("ri").value.trim();  // NIS / NIP
  const p = $("rp").value;         // password

  if (!n || !i || !p) return toast("Lengkapi semua kolom");
  if (p.length < 6) return toast("Password minimal 6 karakter");
  if (DB.users.some(x => x.id == i)) return toast("NIS/NIP sudah terdaftar");

  let k; // kelas (siswa: satu kelas, guru: daftar kelas)
  if (rrole == "siswa") {
    k = $("rk").value;
  } else {
    if ($("rg").value != KODE_GURU) return toast("Kode guru salah");
    k = [...document.querySelectorAll(".kk:checked")].map(x => x.value);
    if (!k.length) return toast("Pilih minimal satu kelas");
  }

  DB.users.push({ id: i, role: rrole, nama: n, pw: p, kelas: k, hp: "" });
  DB.session = i;
  save();
  location.href = alamatDashboard(rrole);
}

// Kalau sudah login, langsung ke dashboard. Kalau belum, tampilkan form.
if (me()) location.href = alamatDashboard(me().role);
else view();
