// js/format.js

export function formatRupiah(angka) {
    return angka.toLocaleString("id-ID");
}

export function formatWaktu(iso) {
    const d = new Date(iso);
    const tgl = d.toLocaleDateString("id-ID");
    const jam = d.toLocaleTimeString("id-ID");
    return tgl + " " + jam;
}