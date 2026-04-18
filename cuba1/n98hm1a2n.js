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

  // 📨 VALIDATION (WAJIB DALAM SUBMIT EVENT)
  if (form) {
    form.addEventListener("submit", function (e) {
      const kehadiran = document.querySelector('input[name="entry.727555102"]:checked');

      // ✅ basic required
      if (!nama.value.trim() || !kehadiran || !phone.value.trim()) {
        e.preventDefault();
        alert("Sila lengkapkan semua maklumat.");
        return;
      }

      // ✅ validate phone
      let phoneValue = phone.value.replace(/\D/g, "");

      if (phoneValue.length < 9 || phoneValue.length > 12) {
        e.preventDefault();
        alert("Sila masukkan nombor telefon yang sah.");
        return;
      }

      // ✅ kalau hadir wajib isi bilangan
      if (kehadiran.value === "Hadir" && !bilangan.value) {
        e.preventDefault();
        alert("Sila isi bilangan kehadiran jika anda akan hadir.");
        return;
      }

      submitted = true;

      // 🔥 disable button elak spam click
      const btn = form.querySelector("button[type='submit']");
      if (btn) {
        btn.disabled = true;
        btn.innerText = "Menghantar...";
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
  
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRj4vi5sshHiiuRvtBr7CgNRyk8BLqcP2bSKwSTjMl76FCVnwr05Eow0r8K5Cn1J1N1cI-KFVPpQGq4/pub?gid=241095374&single=true&output=csv")
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
