<script>
function openPopup(imgSrc) {
  const popup = document.getElementById('popupOverlay');
  const popupImg = document.getElementById('popupImage');
  popupImg.src = imgSrc;
  popup.style.display = 'flex';   // pastikan popup nampak
}

function closePopup() {
  const popup = document.getElementById('popupOverlay');
  popup.style.display = 'none';
}
</script>
