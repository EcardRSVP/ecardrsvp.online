// =========================
// ❄️ FUNGSI SALJI
// =========================
function mulakanSalji() {
  const wrapper = document.getElementById("snow-wrapper");
  if (!wrapper) return;

  const warnaSalji = [
    {
      color: "rgba(255, 255, 255, 0.5)",
      glow: "0 0 10px rgba(255, 255, 255, 0.4)"
    }
  ];

  for (let i = 0; i < 50; i++) {
    ciptaSalji();
  }

  setInterval(() => {
    ciptaSalji();
  }, 300);

  function ciptaSalji() {
    let snow = document.createElement("div");
    snow.classList.add("snow");

    const pilihan = warnaSalji[Math.floor(Math.random() * warnaSalji.length)];
    snow.style.backgroundColor = pilihan.color;
    snow.style.boxShadow = pilihan.glow;

    let size = 0.4 + Math.random() * 0.6;
    snow.style.width = size + "rem";
    snow.style.height = size + "rem";
    snow.style.left = Math.random() * 100 + "vw";
    snow.style.animationDuration = 8 + Math.random() * 6 + "s";

    wrapper.appendChild(snow);

    setTimeout(() => snow.remove(), 15000);
  }
}


// =========================
// 📌 RSVP + FORM
// =========================
let submitted = false;

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("rsvp-form");
  const nama = document.getElementById("nama");
  const bilangan = document.getElementById("bilangan");
  const phone = document.getElementById("phone");
  const startBtn = document.getElementById("start-btn");

  loadUcapan();

  // FORM SUBMIT
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const kehadiran = document.querySelector('input[name="entry.314288959"]:checked');

      if (!nama.value.trim() || !kehadiran || !phone.value.trim()) {
        alert("Sila lengkapkan semua maklumat.");
        return;
      }

      let phoneValue = phone.value.replace(/\D/g, "");

      if (phoneValue.length < 9 || phoneValue.length > 12) {
        alert("Nombor telefon tak sah.");
        return;
      }

      if (kehadiran.value === "Hadir" && !bilangan.value) {
        alert("Isi bilangan kehadiran.");
        return;
      }

      const btn = form.querySelector("button[type='submit']");
      if (btn) {
        btn.disabled = true;
        btn.innerText = "Menghantar...";
      }

      try {
        await fetch("https://script.google.com/macros/s/AKfycbzIcWWb5wyLKsbORj3jmxspZFRJi5iesNpx-IhnSJewVXjCnC8WtK9wAul1zfS0SODM/exec", {
          method: "POST",
          body: JSON.stringify({
            nama: nama.value.trim(),
            kehadiran: kehadiran.value,
            bilangan: bilangan.value,
            phone: phone.value.trim(),
            ucapan: ""
          })
        });

        submitted = true;

      } catch (err) {
        console.error(err);
        alert("Error submit.");
        if (btn) {
          btn.disabled = false;
          btn.innerText = "Hantar";
        }
      }
    });
  }

  // auto number only
  if (phone) {
    phone.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  }

  // start button
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      document.querySelector(".front-page").style.display = "none";
      document.getElementById("main-content").style.display = "block";
    });
  }
});


// =========================
// 📢 RSVP SUCCESS HANDLER
// =========================
function rsvpSuccessHandler() {
  if (submitted) {
    submitted = false;

    const form = document.getElementById("rsvp-form");
    if (form) form.reset();

    const btn = document.querySelector("#rsvp-form button[type='submit']");
    if (btn) {
      btn.disabled = false;
      btn.innerText = "Hantar";
    }

    const alertBox = document.getElementById("rsvp-alert");
    if (alertBox) alertBox.style.display = "block";
  }
}
window.rsvpSuccessHandler = rsvpSuccessHandler;


// =========================
// ❌ CLOSE POPUP ALERT
// =========================
function closeRsvpAlert() {
  const alertBox = document.getElementById("rsvp-alert");
  if (alertBox) alertBox.style.display = "none";

  const popupRSVP = document.getElementById("popup-RSVP");
  if (popupRSVP) popupRSVP.scrollIntoView({ behavior: "smooth" });
}


// =========================
// 🔄 SWITCH SECTION
// =========================
function toggleSection(id) {
  const allSections = document.querySelectorAll('.hidden-section');
  allSections.forEach(sec => sec.style.display = 'none');

  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
    target.scrollIntoView({ behavior: "smooth" });
  }
}


// =========================
// 💌 UCAPAN + COUNT
// =========================
let ucapanLoaded = false;

function loadUcapan() {
  if (ucapanLoaded) return;
  ucapanLoaded = true;

  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRw9YsHinVgUJnl88RkGPbdl6X4WfU2TYIkPCdsLP3WsrbFlrkGHDrS_dDhzqt5rXj_fgHYblwqsZQI/pub?gid=1339694217&single=true&output=csv")
    .then(res => res.text())
    .then(data => {

      const parsed = Papa.parse(data, { header: true });
      const ucapanList = document.getElementById("ucapanList");

      let hadir = 0;
      let tidak = 0;
      let html = "";

      parsed.data.forEach(row => {

        const nama = row["Nama"]?.trim();
        const ucapan = row["Ucapan"]?.trim();
        const status = row["Kehadiran"]?.trim();

        if (nama && ucapan) {
          html += `<p><b>${nama}</b>: ${ucapan}</p>`;
        }

        if (status === "Hadir") hadir++;
        else if (status === "Tidak Hadir") tidak++;
      });

      ucapanList.innerHTML = html;

      document.getElementById("countHadir").innerText = hadir;
      document.getElementById("countTidakHadir").innerText = tidak;
    });
}


// =========================
// 📌 POPUP SYSTEM
// =========================
const popupMap = {
  RSVP: "popup-RSVP",
  MoneyGift: "popup-MoneyGift",
  Wishlist: "popup-Wishlist",
  Contact: "popup-Contact",
  Location: "popup-Location"
};

let popupTerbuka = null;

function togglePopup(nama) {
  const id = popupMap[nama];
  const popup = document.getElementById(id);
  const main = document.getElementById("main-content");

  if (!popup || !main) return;

  if (popupTerbuka === id) {
    popup.style.display = "none";
    main.style.display = "block";
    popupTerbuka = null;
  } else {
    Object.values(popupMap).forEach(i => {
      const el = document.getElementById(i);
      if (el) el.style.display = "none";
    });

    popup.style.display = "block";
    main.style.display = "none";
    popupTerbuka = id;
  }
}
