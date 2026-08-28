const track = document.querySelector(".home-slide-track");
const slides = [...document.querySelectorAll(".home-slide")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const REAL_SLIDE_COUNT = 3;
const SLIDE_INTERVAL = 4000;
const TRANSITION_MS = 850;
let index = 0;
let timer = null;
let resetTimer = null;

function setTrackPosition(slideIndex, animate = true) {
  if (!track) return;
  track.classList.toggle("is-animating", animate);
  track.style.transform = `translate3d(-${slideIndex * 100}%, 0, 0)`;
}

function showNextSlide() {
  if (!track || slides.length < 4) return;

  index += 1;
  setTrackPosition(index, true);

  if (index === REAL_SLIDE_COUNT) {
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      track.classList.remove("is-animating");
      index = 0;
      setTrackPosition(index, false);
    }, TRANSITION_MS);
  }
}

function startTimer() {
  if (reducedMotion || slides.length < 4) return;
  window.clearInterval(timer);
  timer = window.setInterval(showNextSlide, SLIDE_INTERVAL);
}

function stopTimer() {
  window.clearInterval(timer);
  timer = null;
  window.clearTimeout(resetTimer);
  resetTimer = null;

  if (index >= REAL_SLIDE_COUNT) {
    track?.classList.remove("is-animating");
    index = 0;
    setTrackPosition(index, false);
  }
}

if (track && slides.length >= 4) {
  setTrackPosition(0, false);

  if (!reducedMotion) {
    startTimer();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopTimer();
      else startTimer();
    });
  }
}
