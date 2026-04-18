// ✅ Fungsi Salji Jatuh
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
    snow.style.animationDelay = "0s";

    wrapper.appendChild(snow);

    setTimeout(() => {
      snow.remove();
    }, 15000);
  }
}


// ✅ RSVP Popup & Validasi
let submitted = false;

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("rsvp-form");
  const nama = document.getElementById("nama");
  const bilangan = document.getElementById("bilangan");
  const phone = document.getElementById("phone");
  const startBtn = document.getElementById("start-btn");

  loadUcapan(); // ✅ OK

// 📨 VALIDATION + SUBMIT
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const kehadiran = document.querySelector('input[name="entry.314288959"]:checked');

    // ✅ VALIDATION BASIC
    if (!nama.value.trim() || !kehadiran || !phone.value.trim()) {
      alert("Sila lengkapkan semua maklumat.");
      return;
    }

    let phoneValue = phone.value.replace(/\D/g, "");

    if (phoneValue.length < 9 || phoneValue.length > 12) {
      alert("Sila masukkan nombor telefon yang sah.");
      return;
    }

    if (kehadiran.value === "Hadir" && !bilangan.value) {
      alert("Sila isi bilangan kehadiran jika anda akan hadir.");
      return;
    }

    // 🔥 disable button AWAL
    const btn = form.querySelector("button[type='submit']");
    if (btn) {
      btn.disabled = true;
      btn.innerText = "Menghantar...";
    }

    try {
      // 🔥 SEND TO APPS SCRIPT (AUTO UPDATE / ADD ROW)
      const res = await fetch("https://script.google.com/macros/s/AKfycbzIcWWb5wyLKsbORj3jmxspZFRJi5iesNpx-IhnSJewVXjCnC8WtK9wAul1zfS0SODM/exec", {
        method: "POST",
        body: JSON.stringify({
          nama: nama.value.trim(),
          kehadiran: kehadiran.value,
          bilangan: bilangan.value,
          phone: phone.value.trim(),
          ucapan: ""
        })
      });

      const result = await res.text();
      console.log("Apps Script:", result);

      submitted = true;

    } catch (err) {
      console.error(err);
      alert("Error submit. Cuba lagi.");

      // re-enable button kalau error
      if (btn) {
        btn.disabled = false;
        btn.innerText = "Hantar";
      }
    }
  });
}
  
  // ✅ Auto clean phone input
  if (phone) {
    phone.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  }


  // 🎬 Butang BUKA - Tunjuk kandungan utama
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      document.querySelector(".front-page").style.display = "none";
      document.getElementById("main-content").style.display = "block";
    });
  }
});

/// ✅ Bila iframe RSVP reload lepas submit
function rsvpSuccessHandler() {
  console.log("📢 rsvpSuccessHandler triggered");

  if (submitted) {
    submitted = false;

    const form = document.getElementById("rsvp-form");
    if (form) form.reset();

    // ✅ ENABLE BALIK BUTTON
    const btn = document.querySelector("#rsvp-form button[type='submit']");
    if (btn) {
      btn.disabled = false;
      btn.innerText = "Hantar";
    }

    // ✅ Tunjuk popup alert tengah skrin
    const alertBox = document.getElementById("rsvp-alert");
    if (alertBox) {
      alertBox.style.display = "block";
      console.log("✅ Popup alert tengah skrin muncul");
    } else {
      console.warn("⚠️ Elemen #rsvp-alert tidak dijumpai.");
    }

  } else {
    console.log("ℹ️ iframe reload tanpa submitted");
  }
}
window.rsvpSuccessHandler = rsvpSuccessHandler;

// ✅ Tutup popup bila tekan OK
function closeRsvpAlert() {
  const alertBox = document.getElementById("rsvp-alert");
  if (alertBox) alertBox.style.display = "none";

  const popupRSVP = document.getElementById("popup-RSVP");
  if (popupRSVP) popupRSVP.scrollIntoView({ behavior: "smooth" });
}

// ✅ Fungsi untuk tukar seksyen berdasarkan ID
function toggleSection(id) {
  const allSections = document.querySelectorAll('.hidden-section');
  allSections.forEach(section => section.style.display = 'none');

  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
    target.scrollIntoView({ behavior: "smooth" });
  }
}



// ✅ Fetch Ucapan (PapaParse) - OPTIMIZED
let ucapanLoaded = false;

function loadUcapan() {
  if (ucapanLoaded) return;   // 🔥 ELak double load
  ucapanLoaded = true;
  
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRw9YsHinVgUJnl88RkGPbdl6X4WfU2TYIkPCdsLP3WsrbFlrkGHDrS_dDhzqt5rXj_fgHYblwqsZQI/pub?gid=1339694217&single=true&output=csv")
  .then(response => response.text())
  .then(data => {
    const parsed = Papa.parse(data, { header: true });
    const ucapanList = document.getElementById("ucapanList");

    if (ucapanList) {
      ucapanList.innerHTML = "";
      parsed.data.forEach(row => {
        const nama = row["Nama"]?.trim();
        const ucapan = row["Ucapan"]?.trim();
        if (nama && ucapan) {
          const item = document.createElement("p");
          item.innerHTML = `<strong>${nama}</strong>: ${ucapan}`;
          ucapanList.appendChild(item);
        }
      });
    }
  });
} // ✅ IMPORTANT: TUTUP FUNCTION DI SINI



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
