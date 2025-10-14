// Popup Gambar
function openPopup(imgSrc) {
  const popup = document.getElementById('popupOverlay');
  const popupImg = document.getElementById('popupImage');
  popupImg.src = imgSrc;
  popup.style.display = 'flex';
}

function closePopup() {
  const popup = document.getElementById('popupOverlay');
  popup.style.display = 'none';
}

// Slider Gambar
const images = ["CodeA.png", "CodeB.png", "CodeC.png", "CodeD.png"];
let currentIndex = 0;

function showSlide(index) {
  const slider = document.getElementById("slider-image");
  if (index < 0) currentIndex = images.length - 1;
  else if (index >= images.length) currentIndex = 0;
  else currentIndex = index;
  slider.src = images[currentIndex];
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

// Menu & Section
function toggleMenu() {
  document.getElementById("dropdownMenu").classList.toggle("show");
}

function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
  document.getElementById("dropdownMenu").classList.remove("show");
}

// Gambar Toggle
function toggleGambar(imgId) {
  const img = document.getElementById(imgId);
  img.style.display = img.style.display === "none" ? "block" : "none";
}
