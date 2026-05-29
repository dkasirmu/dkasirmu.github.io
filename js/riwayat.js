// js/riwayat.js
import { bukaDB } from "./db.js";
import { formatRupiah, formatWaktu } from "./format.js";

let db;

bukaDB().then(function(database) {
    db = database;
    tampilRekapSesi();
});

// TAMPIL REKAP SESI
function tampilRekapSesi() {
    const tx = db.transaction("sesiKasir", "readonly");
    const store = tx.objectStore("sesiKasir");
    const semua = store.getAll();

    semua.onsuccess = function() {
        const list = semua.result;
        const tbody = document.getElementById("isi-sesi");
        tbody.innerHTML = "";

        if (list.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4'>Belum ada sesi tersimpan.</td></tr>";
            return;
        }

        list.forEach(function(sesi) {
            tbody.innerHTML += `
                <tr>
                    <td>${formatWaktu(sesi.waktuBuka)}</td>
                    <td>${formatWaktu(sesi.waktuTutup)}</td>
                    <td>${sesi.jumlahTransaksi}</td>
                    <td>Rp ${formatRupiah(sesi.totalPendapatan)}</td>
                </tr>
            `;
        });
    };
}

// FILTER TRANSAKSI PER TANGGAL
function filterTransaksi() {
    const tanggal = document.getElementById("filter-tanggal").value;

    if (!tanggal) {
        alert("Pilih tanggal dulu!");
        return;
    }

    const tx = db.transaction("transaksi", "readonly");
    const store = tx.objectStore("transaksi");
    const semua = store.getAll();

    semua.onsuccess = function() {
        const list = semua.result;

        const hasil = list.filter(function(t) {
            return t.waktu.startsWith(tanggal);
        });

        const tbody = document.getElementById("isi-transaksi");
        tbody.innerHTML = "";

        if (hasil.length === 0) {
            tbody.innerHTML = "<tr><td colspan='5'>Tidak ada transaksi pada tanggal ini.</td></tr>";
            return;
        }

        hasil.forEach(function(t) {
            const itemTeks = t.items.map(function(i) {
                return i.nama + " x" + i.qty;
            }).join(", ");

            tbody.innerHTML += `
                <tr>
                    <td>${formatWaktu(t.waktu)}</td>
                    <td>${itemTeks}</td>
                    <td>Rp ${formatRupiah(t.total)}</td>
                    <td>Rp ${formatRupiah(t.bayar)}</td>
                    <td>Rp ${formatRupiah(t.kembalian)}</td>
                </tr>
            `;
        });
    };
}

window.filterTransaksi = filterTransaksi;