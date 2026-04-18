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

      btn.disabled = true;
      btn.innerText = "Menghantar...";

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

        // RESET FORM
        form.reset();

        // 🔥 FORCE UPDATE DATA
        loadUcapan();

        // BUTTON RESET
        btn.disabled = false;
        btn.innerText = "Hantar";

        // POPUP
        document.getElementById("rsvp-alert").style.display = "block";

      } catch (err) {
        console.error(err);

        btn.disabled = false;
        btn.innerText = "Hantar";

        alert("Error submit");
      }
    });
  }

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
