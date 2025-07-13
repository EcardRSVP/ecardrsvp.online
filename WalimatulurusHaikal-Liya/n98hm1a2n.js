// script.js
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTPi4cVVJVAYtYrDQRfhBMX0qCMllBMgjYqesb64WKf-5M4BvxIrabnse_Fq_Iu6EHsrnI8Rv1AEv7T/pub?output=csv')
  .then(response => response.text())
  .then(data => {
    const rows = data.split("\n").map(row => row.split(","));
    rows.forEach(row => {
      const barang = row[2].trim();
      if (barang === "Bakul Baju") {
        const btn = document.getElementById("btn-bakul");
        btn.innerText = "Telah Ditempah";
        btn.disabled = true;
      }
    });
  });

function mulakanSalji() {
  const wrapper = document.getElementById("snow-wrapper");
  if (!wrapper) return;

  const warnaSalji = [
   {
      color: "#ffffff",
      glow: "0 0 10px rgba(255, 255, 255, 0.7)" // Putih glowing
    }
  ];

  // 🎯 Salji permulaan yang banyak
  for (let i = 0; i < 50; i++) {
    ciptaSalji();
  }

  // ⏱️ Kemudian, cipta salji secara berkala
  setInterval(() => {
    ciptaSalji();
  }, 300); // 1 salji setiap 0.3s

  // 🔁 Fungsi cipta 1 salji
  function ciptaSalji() {
    let snow = document.createElement("div");
    snow.classList.add("snow");

    // Warna & glow rawak
    const pilihan = warnaSalji[Math.floor(Math.random() * warnaSalji.length)];
    snow.style.backgroundColor = pilihan.color;
    snow.style.boxShadow = pilihan.glow;

    // Saiz, posisi, animasi
    let size = 0.4 + Math.random() * 0.6;
    snow.style.width = size + "rem";
    snow.style.height = size + "rem";
    snow.style.left = Math.random() * 100 + "vw";
    snow.style.animationDuration = 8 + Math.random() * 6 + "s";
    snow.style.animationDelay = "0s";

    wrapper.appendChild(snow);

    // Buang selepas animasi
    setTimeout(() => {
      snow.remove();
    }, 15000);
  }
}

let submitted = false;

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("rsvp-form");
  const popup = document.getElementById("submit-popup"); // 🎯 ubah ke popup
  const nama = document.getElementById("nama");
  const bilangan = document.getElementById("bilangan");

  if (!form || !popup) {
    console.error("❌ Elemen penting (form/popup) tidak dijumpai.");
    return;
  }

  form.addEventListener("submit", function (e) {
    const kehadiran = document.querySelector('input[name="entry.727555102"]:checked');

    if (!nama.value.trim() || !kehadiran || !bilangan.value) {
      e.preventDefault(); // kekalkan supaya tak terus submit jika tak lengkap
      alert("Sila lengkapkan semua maklumat.");
      return;
    }

    // ✅ Biar Google yang submit form seperti biasa
    submitted = true;
    // ⚠️ Jangan buat `form.submit()` — Google akan tolak dalam sesetengah kes
    // Jadi biar form auto submit melalui button
  });
});

// ✅ Dipanggil bila iframe reload selepas submit
function rsvpSuccessHandler() {
  if (submitted) {
    submitted = false;

    const popup = document.getElementById("submit-popup");
    const form = document.getElementById("rsvp-form");

    if (form) form.reset();
    if (popup) {
      popup.style.display = "block";
      setTimeout(() => {
        popup.style.display = "none";
      }, 5000);
    }
  }
}

