let submitted = false;

// 🟢 TAMBAH (WAJIB FIX CONSISTENCY)
let lastKehadiran = null;
let lastBilangan = 0;
let isFetching = false; // ✅ LETAK SINI

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
document.addEventListener("DOMContentLoaded", function () {

  liveRSVPDashboard(); // first load
  
  setInterval(liveRSVPDashboard, 8000);
  
  const form = document.getElementById("rsvp-form");
  const nama = document.getElementById("nama");
  const bilangan = document.getElementById("bilangan");
  const phone = document.getElementById("phone");
  const startBtn = document.getElementById("start-btn");

 // 📨 Validasi sebelum submit
  if (form) {
form.addEventListener("submit", function (e) {
  const kehadiran = document.querySelector('input[name="entry.314288959"]:checked');

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

  // ✅ VALIDASI PHONE
  if (!phone.value.trim()) {
    e.preventDefault();
    alert("Sila isi nombor telefon.");
    return;
  }

  const phoneRegex = /^(\+?6?01)[0-9]{8,9}$/;
  if (!phoneRegex.test(phone.value.trim())) {
    e.preventDefault();
    alert("Sila masukkan nombor telefon yang sah.");
    return;
  }

  // ✅ SIMPAN DATA SEBELUM SUBMIT
  lastKehadiran = kehadiran.value;
  lastBilangan = parseInt(bilangan.value) || 1;
  
      submitted = true;
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

  // 🔥 TAMBAH SINI
  setTimeout(liveRSVPDashboard, 1500); 

    const form = document.getElementById("rsvp-form");
    if (form) form.reset();

    // ✅ POPUP ALERT
    const alertBox = document.getElementById("rsvp-alert");
    if (alertBox) {
      alertBox.style.display = "block";
    }
  } else {
    console.log("ℹ️ iframe reload tanpa submitted");
  }
}


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


function liveRSVPDashboard() {
  if (isFetching) return;
  isFetching = true;

  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRw9YsHinVgUJnl88RkGPbdl6X4WfU2TYIkPCdsLP3WsrbFlrkGHDrS_dDhzqt5rXj_fgHYblwqsZQI/pub?gid=1339694217&single=true&output=csv&cache=" + new Date().getTime())
    .then(res => res.text())
    .then(data => {
      isFetching = false;

      const parsed = Papa.parse(data, { header: true }).data;

      let hadir = 0;
      let tidakHadir = 0;

      parsed.forEach(row => {
        const status = row["Kehadiran"]?.trim();
        const bil = parseInt(row["Bilangan"]) || 1;

        if (status === "Hadir") {
          hadir += bil;
        } else if (status === "Tidak Hadir") {
          tidakHadir += 1;
        }
      });

      // 👉 UPDATE UI (WAJIB ADA)
      const hadirEl = document.getElementById("total-hadir");
      const tidakEl = document.getElementById("total-tidak");

      if (hadirEl) hadirEl.textContent = hadir;
      if (tidakEl) tidakEl.textContent = tidakHadir;

    })
    .catch(() => {
      isFetching = false;
    });
}
