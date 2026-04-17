export function initPartnersReel() {
  const track = document.getElementById('partnersReel');
  if (!track) return;

  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });

  track.addEventListener('mouseleave', () => { isDragging = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup',    () => { isDragging = false; track.style.cursor = 'grab'; });

  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    track.scrollLeft = scrollLeft - walk;
  });
}
