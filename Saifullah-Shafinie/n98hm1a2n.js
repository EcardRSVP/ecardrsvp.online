// ✅ Fungsi Salji Jatuh
function mulakanSalji() {
  const wrapper = document.getElementById("snow-wrapper");
  if (!wrapper) return;

  const warnaSalji = [
    {
      color: "#ffffff",
      glow: "0 0 10px rgba(255, 255, 255, 0.7)"
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
  const startBtn = document.getElementById("start-btn");

 // 📨 Validasi sebelum submit
  if (form) {
    form.addEventListener("submit", function (e) {
      const kehadiran = document.querySelector('input[name="entry.426684865"]:checked');

      if (!nama.value.trim() || !kehadiran) {
        e.preventDefault();
        alert("Sila lengkapkan semua maklumat.");
        return;
      }

      if (kehadiran.value === "Hadir" && !bilangan.value) {
        e.preventDefault();
        alert("Sila isi bilangan kehadiran jika anda akan hadir.");
        return;
      }

      submitted = true;
    });
  } else {
    console.error("❌ Elemen borang RSVP tidak dijumpai.");
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



// ✅ Fetch Ucapan (PapaParse)
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTEOFHynsliLMb730vm2rMn_Q-r0_9VxL1s25tPLD266FszkPNTiMK37jrFz0W-dg2wjD7laB2ncU8H/pub?gid=883114066&single=true&output=csv")
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
