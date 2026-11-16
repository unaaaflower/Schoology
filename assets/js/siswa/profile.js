/* ==========================================================
   siswa/profile.js  -  PROFILE SISWA
   Menampilkan nama, NIS, kelas. Ubah nama dan nomor HP, simpan, dan logout.
   ========================================================== */

// Simpan perubahan profil
function simpanProfil() {
  U.nama = $("pn").value.trim() || U.nama;
  U.hp = $("ph").value;
  save();
  toast("Profil disimpan");
  render();
}

function halamanProfile() {
  return ph("Profil", "Data akun kamu.") + `<section class="card narrow"><h2>${esc(U.nama)}</h2><p class="mut">${kname(K)}, NIS ${U.id}</p><label>Nama lengkap<input id="pn" value="${esc(U.nama)}"></label><label>No. HP<input id="ph" value="${esc(U.hp)}" placeholder="08xxxxxxxxxx"></label><button class="btn" onclick="simpanProfil()">Simpan profil</button> <button class="btn ghost" onclick="keluar()">Keluar</button></section>`;
}

// Profil tidak ada di menu, jadi tidak ada menu yang disorot
mulaiSiswa("profile.html", halamanProfile);
