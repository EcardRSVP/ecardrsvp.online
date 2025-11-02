// Popup fullscreen
function openPopup(imgSrc) {
  const popup = document.getElementById('popupOverlay');
  const popupImg = document.getElementById('popupImage');
  popupImg.src = imgSrc;
  popup.style.display = 'flex';
}

// Tutup popup
function closePopup() {
  const popup = document.getElementById('popupOverlay');
  popup.style.display = 'none';
}

// Klik luar gambar pun boleh tutup
document.getElementById('popupOverlay').addEventListener('click', function(e) {
  if (e.target === this) closePopup();
});

 // Tunggu DOM siap dulu supaya popupOverlay dah wujud
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById('popupOverlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closePopup();
    });
  }
});



// Slider Gambar (Warna Pilihan)
const images = ["CodeA.png", "CodeB.png", "CodeC.png", "CodeD.png"];
const labels = ["Code A", "Code B", "Code C", "Code D"];
let currentIndex = 0;

function showSlide(index) {
  const slider = document.getElementById("slider-image");
  const label = document.getElementById("slider-label");
  if (!slider || !label) return;

  if (index < 0) currentIndex = images.length - 1;
  else if (index >= images.length) currentIndex = 0;
  else currentIndex = index;

  slider.src = images[currentIndex];
  label.innerText = labels[currentIndex]
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

// Papar slide pertama bila halaman load
document.addEventListener("DOMContentLoaded", () => {
  showSlide(currentIndex);
});

// Slider Gambar (Step Penggunaan RSVP)
const stepImages = [
  "1.png", "2.png", "3.png", "4.png", "5.png", 
  "6.png", "7.png", "8.png", "9.png", "10.png", "11.png"
];
let currentStepIndex = 0;

function showStepSlide(index) {
  const img = document.getElementById("step-slider-image");
  if (!img) return;

  if (index < 0) currentStepIndex = stepImages.length - 1;
  else if (index >= stepImages.length) currentStepIndex = 0;
  else currentStepIndex = index;

  img.src = stepImages[currentStepIndex];
}

function prevStepSlider() {
  showStepSlide(currentStepIndex - 1);
}

function nextStepSlider() {
  showStepSlide(currentStepIndex + 1);
}

// Papar slide pertama bila halaman siap
document.addEventListener("DOMContentLoaded", () => {
  showStepSlide(currentStepIndex);
});


// Menu & Section
function toggleMenu() {
  document.getElementById("dropdownMenu").classList.toggle("show");
}

function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  const selected = document.getElementById(id);
  if (selected) selected.style.display = "block";
  document.getElementById("dropdownMenu").classList.remove("show");
}


// Gambar Toggle
function toggleGambar(imgId) {
  const img = document.getElementById(imgId);
  if (!img) return;
  img.style.display = img.style.display === "none" ? "block" : "none";
}


// Untuk teks ucapan / semua kotak
function copyTeks(button, msgId) {
  const teks = button.closest('.teks-kotak').querySelector('.teks-isi').innerText.trim();
  navigator.clipboard.writeText(teks).then(() => {
    const msg = document.getElementById(msgId);
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 2500);
  });
}
