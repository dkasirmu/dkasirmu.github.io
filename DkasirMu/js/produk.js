// js/produk.js
import { bukaDB } from "./db.js";
import { formatRupiah } from "./format.js";

let db;

bukaDB().then(function(database) {
    db = database;
    tampilSemuaProduk();
});

// TAMPIL SEMUA PRODUK
function tampilSemuaProduk() {
    const tx = db.transaction("produk", "readonly");
    const store = tx.objectStore("produk");
    const semua = store.getAll();

    semua.onsuccess = function(e) {
        const produkList = e.target.result;
        const tbody = document.getElementById("isi-tabel");
        tbody.innerHTML = "";

        produkList.forEach(function(p) {
            tbody.innerHTML += `
                <tr>
                    <td>${p.nama}</td>
                    <td>Rp ${formatRupiah(p.harga)}</td>
                    <td>
                        <button onclick="hapusProduk('${p.nama}')">Hapus</button>
                    </td>
                </tr>
            `;
        });
    };
}

// TAMBAH / EDIT PRODUK
function tambahProduk() {
    const nama = document.getElementById("input-nama").value.trim().toLowerCase();
    const harga = Number(document.getElementById("input-harga").value);

    if (!nama || !harga) {
        alert("Nama dan harga wajib diisi!");
        return;
    }

    const tx = db.transaction("produk", "readwrite");
    const store = tx.objectStore("produk");
    store.put({ nama: nama, harga: harga });

    tx.oncomplete = function() {
        tampilSemuaProduk();
        document.getElementById("input-nama").value = "";
        document.getElementById("input-harga").value = "";
    };
}

// HAPUS PRODUK
function hapusProduk(nama) {
    const yakin = confirm("Hapus produk: " + nama + "?");
    if (!yakin) return;

    const tx = db.transaction("produk", "readwrite");
    const store = tx.objectStore("produk");
    store.delete(nama);

    tx.oncomplete = function() {
        tampilSemuaProduk();
    };
}

// IMPORT CSV
function importCSV(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const isiFile = e.target.result;
        prosesCSV(isiFile);
    };

    reader.readAsText(file);
}

// PROSES BACA CSV
function prosesCSV(teks) {
    const baris = teks.split("\n");

    baris.forEach(function(b, index) {
        if (index === 0) return;

        const kolom = b.split(",");
        const nama = kolom[0].trim().toLowerCase();
        const harga = Number(kolom[1].trim());

        if (!nama || !harga) return;

        const tx = db.transaction("produk", "readwrite");
        const store = tx.objectStore("produk");
        store.put({ nama: nama, harga: harga });
    });

    setTimeout(function() {
        tampilSemuaProduk();
    }, 500);
}

// CARI PRODUK
function cariProduk() {
    const keyword = document.getElementById("input-cari").value.toLowerCase();
    const semuaBaris = document.querySelectorAll("#isi-tabel tr");

    semuaBaris.forEach(function(baris) {
        const nama = baris.cells[0].textContent.toLowerCase();
        if (nama.includes(keyword)) {
            baris.style.display = "";
        } else {
            baris.style.display = "none";
        }
    });
}

// WAJIB — fungsi yang dipanggil dari HTML harus didaftarkan ke window
window.tambahProduk = tambahProduk;
window.hapusProduk = hapusProduk;
window.importCSV = importCSV;
window.cariProduk = cariProduk;