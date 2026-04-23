// =========================
// ❄️ SALJI
// =========================
function mulakanSalji() {
  const wrapper = document.getElementById("snow-wrapper");
  if (!wrapper) return;

  const warnaSalji = [{
    color: "rgba(255,255,255,0.5)",
    glow: "0 0 10px rgba(255,255,255,0.4)"
  }];

  for (let i = 0; i < 50; i++) ciptaSalji();

  setInterval(ciptaSalji, 300);

  function ciptaSalji() {
    const snow = document.createElement("div");
    snow.classList.add("snow");

    const c = warnaSalji[Math.floor(Math.random() * warnaSalji.length)];
    snow.style.background = c.color;
    snow.style.boxShadow = c.glow;

    snow.style.width = snow.style.height = (0.4 + Math.random()) + "rem";
    snow.style.left = Math.random() * 100 + "vw";
    snow.style.animationDuration = (8 + Math.random() * 6) + "s";

    wrapper.appendChild(snow);
    setTimeout(() => snow.remove(), 15000);
  }
}


// =========================
// 📌 STATE
// =========================
let ucapanInterval = null;


// =========================
// 📌 INIT
// =========================
document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("rsvp-form");
  const nama = document.getElementById("nama");
  const bilangan = document.getElementById("bilangan");
  const phone = document.getElementById("phone");
  const startBtn = document.getElementById("start-btn");

  loadUcapan();

  // 🔥 LIVE AUTO REFRESH
  ucapanInterval = setInterval(loadUcapan, 5000);

  // =========================
  // 📩 SUBMIT RSVP
  // =========================
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const kehadiran = document.querySelector('input[name="entry.314288959"]:checked');
      const btn = form.querySelector("button[type='submit']");

      if (!nama.value || !kehadiran || !phone.value) {
        alert("Sila lengkapkan maklumat");
        return;
      }

      // ✅ tambah ini
if (kehadiran.value === "Hadir" && !bilangan.value) {
  alert("Sila isi bilangan kehadiran");
  return;
}
      
      btn.disabled = true;
      btn.innerText = "Menghantar...";

try {

    // =========================
    // 🚫 CHECK DUPLICATE PHONE
    // =========================
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRw9YsHinVgUJnl88RkGPbdl6X4WfU2TYIkPCdsLP3WsrbFlrkGHDrS_dDhzqt5rXj_fgHYblwqsZQI/pub?gid=1339694217&single=true&output=csv";

    const res = await fetch(csvUrl);
    const text = await res.text();
    const data = Papa.parse(text, { header: true }).data;

  const normalize = num => num.replace(/\D/g, "");
  
const phoneExists = data.some(r => {
  const existingPhone = normalize(r["Nombor Telefon"] || "");
  const currentPhone = normalize(phone.value);
  return existingPhone === currentPhone;
});

    if (phoneExists) {
      alert("Nombor telefon ini sudah digunakan");
      btn.disabled = false;
      btn.innerText = "Hantar";
      return;
    }

    // =========================
    // 📩 SUBMIT DATA
    // =========================
    const ucapanInput = document.getElementById("ucapan");

    await fetch("https://script.google.com/macros/s/AKfycbzIcWWb5wyLKsbORj3jmxspZFRJi5iesNpx-IhnSJewVXjCnC8WtK9wAul1zfS0SODM/exec", {
      method: "POST",
      body: JSON.stringify({
        nama: nama.value.trim(),
        kehadiran: kehadiran.value,
        bilangan: bilangan.value,
        phone: phone.value.trim(),
        ucapan: ucapanInput.value.trim() // ✅ FIX guestbook
      })
    });

    // RESET
    form.reset();

    // ⏳ DELAY UPDATE (elak data belum masuk sheet)
    setTimeout(() => {
      loadUcapan();
    }, 3000);

    btn.disabled = false;
    btn.innerText = "Hantar";

    document.getElementById("rsvp-alert").style.display = "block";

  } catch (err) {
    console.error(err);

    btn.disabled = false;
    btn.innerText = "Hantar";

    alert("Error submit");
  }
});

      


  
  // PHONE ONLY NUMBER
  if (phone) {
    phone.addEventListener("input", () => {
      phone.value = phone.value.replace(/\D/g, "");
    });
  }

  // START PAGE
  if (startBtn) {
    startBtn.onclick = () => {
      document.querySelector(".front-page").style.display = "none";
      document.getElementById("main-content").style.display = "block";
    };
  }
});


// =========================
// 💌 LOAD UCAPAN + KEHADIRAN
// =========================
function loadUcapan() {

  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRw9YsHinVgUJnl88RkGPbdl6X4WfU2TYIkPCdsLP3WsrbFlrkGHDrS_dDhzqt5rXj_fgHYblwqsZQI/pub?gid=1339694217&single=true&output=csv")
    .then(r => r.text())
    .then(csv => {

      const parsed = Papa.parse(csv, { header: true });

      const list = document.getElementById("ucapanList");
      const hadirEl = document.getElementById("countHadir");
      const tidakEl = document.getElementById("countTidakHadir");

      let hadir = 0;
      let tidak = 0;
      let html = "";

      parsed.data.forEach(r => {
        if (!r) return;

        const nama = r.Nama?.trim();
        const ucapan = r.Ucapan?.trim();
        const status = r.Kehadiran?.trim();

        if (nama && ucapan) {
          html += `<p><b>${nama}</b>: ${ucapan}</p>`;
        }

        if (status === "Hadir") hadir++;
        if (status === "Tidak Hadir") tidak++;
      });

      if (list) list.innerHTML = html;
      if (hadirEl) hadirEl.innerText = hadir;
      if (tidakEl) tidakEl.innerText = tidak;
    })
    .catch(err => console.error("UCAPAN ERROR:", err));
}


// =========================
// ❌ CLOSE POPUP
// =========================
function closeRsvpAlert() {
  const box = document.getElementById("rsvp-alert");
  if (box) box.style.display = "none";
}

// =========================
// 📌 POPUP CONTROL
// =========================
// SENARAI ID popup & ikon yang berkaitan
const popupMap = {
  RSVP: "popup-RSVP",
  MoneyGift: "popup-MoneyGift",
  Wishlist: "popup-Wishlist",
  Contact: "popup-Contact",
  Location: "popup-Location"
};

let popupTerbuka = null;

function togglePopup(nama) {
  const idPopup = popupMap[nama];
  const popup = document.getElementById(idPopup);
  const mainContent = document.getElementById("main-content");

  if (!popup || !mainContent) return;

  // Kalau popup sekarang terbuka dan ditekan semula → tutup
  if (popupTerbuka === idPopup) {
    popup.style.display = "none";
    mainContent.style.display = "block";
    popupTerbuka = null;
  } else {
    // Tutup semua popup lain dulu
    Object.values(popupMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    // Buka popup yang diminta
    popup.style.display = "block";
    mainContent.style.display = "none";
    popupTerbuka = idPopup;
  }
}
