/* LOMO Links interaction layer: accessible modal, ecosystem intro, and user-controlled natural soundscapes. */
const modal = document.querySelector("#lomo-house-modal");
const openButton = document.querySelector("[data-modal-open]");
const closeButton = document.querySelector("[data-modal-close]");
const modalPanel = modal?.querySelector(".house-modal");
let lastFocusedElement = null;

const intro = document.querySelector("#ecosystem-intro");
const introSkip = intro?.querySelector(".intro-skip");
const introMain = document.querySelector("#site-content");
const introNumber = intro?.querySelector(".intro-number");
const introKorean = intro?.querySelector(".intro-korean");
const introEnglish = intro?.querySelector(".intro-english");
const introProgress = intro ? [...intro.querySelectorAll(".intro-progress i")] : [];
const soundToggle = document.querySelector("[data-sound-toggle]");
const soundLabel = document.querySelector("[data-sound-label]");
const soundThemes = document.querySelectorAll("[data-sound-theme]");
const ambientTracks = {
  sea: document.querySelector("#ambient-sea"),
  forest: document.querySelector("#ambient-forest"),
  desert: document.querySelector("#ambient-desert"),
  moss: document.querySelector("#ambient-moss"),
};
let soundEnabled = false;
let activeSoundTheme = "moss";
let soundFadeTimer = null;
let soundPreferencePrimed = false;

try {
  soundEnabled = localStorage.getItem("lomo-sound-muted") !== "true" && localStorage.getItem("lomo-sound-muted") !== null;
} catch (_) {}
const introScenes = [
  { theme: "sea", number: "01 / 04", korean: "바다의 조류를<br>따라갑니다.", english: "SEA / SALT / TIDE" },
  { theme: "forest", number: "02 / 04", korean: "숲의 그림자에<br>잠시 머뭅니다.", english: "FOREST / ROOT / SHADE" },
  { theme: "desert", number: "03 / 04", korean: "사막의 빛을<br>천천히 건넙니다.", english: "DESERT / DUST / LIGHT" },
  { theme: "moss", number: "04 / 04", korean: "이끼의 시간에<br>귀를 기울입니다.", english: "MOSS / MIST / TIME" },
];
let introTimer = null;

function getFocusableElements() {
  return modalPanel ? [...modalPanel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')] : [];
}

function openModal() {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => modal.dataset.state = "open");
  closeButton?.focus();
}

function closeModal() {
  if (!modal || modal.hidden) return;
  modal.dataset.state = "closing";
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  window.setTimeout(() => { modal.hidden = true; }, 260);
  lastFocusedElement?.focus();
}

function finishIntro() {
  if (!intro || intro.hidden) return;
  window.clearTimeout(introTimer);
  intro.dataset.state = "leaving";
  introMain?.removeAttribute("aria-hidden");
  if (introMain) introMain.inert = false;
  document.body.classList.remove("intro-active");
  document.documentElement.classList.remove("intro-pending");
  setAmbientTheme("moss");
  try { localStorage.setItem("lomo-intro-seen", "true"); } catch (_) {}
  window.setTimeout(() => { intro.hidden = true; }, 460);
}

function setIntroScene(index) {
  const scene = introScenes[index];
  if (!intro || !scene) return;
  intro.dataset.theme = scene.theme;
  if (introNumber) introNumber.textContent = scene.number;
  if (introKorean) introKorean.innerHTML = scene.korean;
  if (introEnglish) introEnglish.textContent = scene.english;
  introProgress.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex <= index));
  setAmbientTheme(scene.theme);
}

function updateSoundButton() {
  if (!soundToggle || !soundLabel) return;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "자연 배경음 끄기" : "자연 배경음 켜기");
  soundLabel.textContent = soundEnabled ? "SOUND ON" : "SOUND OFF";
}

function fadeAudio(audio, target, onComplete) {
  if (!audio) return;
  const start = audio.volume;
  const startedAt = performance.now();
  const duration = 320;
  const tick = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    audio.volume = start + (target - start) * progress;
    if (progress < 1) requestAnimationFrame(tick);
    else onComplete?.();
  };
  requestAnimationFrame(tick);
}

function setAmbientTheme(theme) {
  if (!ambientTracks[theme]) return;
  activeSoundTheme = theme;
  soundToggle?.setAttribute("data-theme", theme);
  if (!soundEnabled) return;
  window.clearTimeout(soundFadeTimer);
  const next = ambientTracks[theme];
  Object.entries(ambientTracks).forEach(([name, audio]) => {
    if (!audio || name === theme || audio.paused) return;
    fadeAudio(audio, 0, () => { audio.pause(); audio.currentTime = 0; });
  });
  if (next.paused) {
    next.volume = 0;
    next.play().then(() => fadeAudio(next, .24)).catch(() => { next.pause(); next.currentTime = 0; });
  } else {
    fadeAudio(next, .24);
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  soundPreferencePrimed = true;
  try { localStorage.setItem("lomo-sound-muted", String(!soundEnabled)); } catch (_) {}
  if (soundEnabled) {
    setAmbientTheme(intro && !intro.hidden ? intro.dataset.theme : activeSoundTheme);
  } else {
    Object.values(ambientTracks).forEach((audio) => {
      if (!audio || audio.paused) return;
      fadeAudio(audio, 0, () => { audio.pause(); audio.currentTime = 0; });
    });
  }
  updateSoundButton();
}

function resumePreferredSound() {
  if (!soundEnabled || soundPreferencePrimed) return;
  soundPreferencePrimed = true;
  setAmbientTheme(intro && !intro.hidden ? intro.dataset.theme : activeSoundTheme);
}

function handleAudioError() {
  soundEnabled = false;
  soundPreferencePrimed = true;
  try { localStorage.setItem("lomo-sound-muted", "true"); } catch (_) {}
  updateSoundButton();
}

function startIntro() {
  if (!intro || !document.documentElement.classList.contains("intro-pending")) return;
  intro.hidden = false;
  intro.setAttribute("aria-hidden", "false");
  introMain?.setAttribute("aria-hidden", "true");
  if (introMain) introMain.inert = true;
  document.body.classList.add("intro-active");
  let index = 0;
  setIntroScene(index);
  const interval = window.setInterval(() => {
    index += 1;
    if (index >= introScenes.length) {
      window.clearInterval(interval);
      introTimer = window.setTimeout(finishIntro, 730);
      return;
    }
    setIntroScene(index);
  }, 680);
}

openButton?.addEventListener("click", openModal);
closeButton?.addEventListener("click", closeModal);
introSkip?.addEventListener("click", finishIntro);
soundToggle?.addEventListener("click", toggleSound);
soundThemes.forEach((element) => {
  const changeTheme = () => setAmbientTheme(element.dataset.soundTheme);
  element.addEventListener("mouseenter", changeTheme);
  element.addEventListener("focusin", changeTheme);
});

Object.values(ambientTracks).forEach((audio) => audio?.addEventListener("error", handleAudioError));
document.addEventListener("pointerdown", resumePreferredSound, { capture: true });
document.addEventListener("keydown", (event) => {
  const targetIsSoundToggle = event.target instanceof Element && event.target.closest("[data-sound-toggle]");
  if (!targetIsSoundToggle && event.key !== "Tab" && event.key !== "Shift" && event.key !== "Escape") resumePreferredSound();
}, { capture: true });

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && intro && !intro.hidden) {
    finishIntro();
    return;
  }
  if (!modal || modal.hidden) return;
  if (event.key === "Escape") closeModal();
  if (event.key !== "Tab") return;
  const focusable = getFocusableElements();
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

startIntro();
updateSoundButton();
