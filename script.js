/* LOMO Links interaction layer: accessible modal, ecosystem intro, and user-controlled natural soundscapes. */
const modal = document.querySelector("#lomo-house-modal");
const openButton = document.querySelector("[data-modal-open]");
const closeButton = document.querySelector("[data-modal-close]");
const modalPanel = modal?.querySelector(".house-modal");
let lastFocusedElement = null;
let modalHideTimer = null;

const intro = document.querySelector("#ecosystem-intro");
const introSkip = intro?.querySelector(".intro-skip");
const siteConfig = window.LOMO_SITE_CONFIG || {};
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
let soundEnabled = true;
let activeSoundTheme = "moss";
let soundFadeTimer = null;
let soundPreferencePrimed = false;
let introInterval = null;
const fieldNotes=[{category:"EARTH CITIZEN / LIVING",titleKo:"동남아에서 한 달 살아본다면 어디가 좋을까",titleEn:"Where should you live in Southeast Asia for a month?",descriptionKo:"도시의 속도와 동네의 리듬을 직접 살아본 기록.",descriptionEn:"A field note on city pace, neighborhood rhythm, and staying awhile.",location:"SOUTHEAST ASIA",date:"FIELD NOTE 01",source:"Tistory",url:"https://eatfear.tistory.com/",image:"images/desert-240.webp"},{category:"WATER / EXPERIENCE",titleKo:"물을 무서워하던 사람이 다이버가 되기까지",titleEn:"From being afraid of water to becoming a diver",descriptionKo:"두려움을 지나 바다에 들어가며 배운 것들.",descriptionEn:"What the water taught me after fear stopped being the whole story.",location:"THE WATER",date:"FIELD NOTE 02",source:"Instagram",url:"https://www.instagram.com/jikookim/",image:"images/sea-240.webp"},{category:"CITY / CONNECTION",titleKo:"혼자 다낭에 가서 사람을 만나는 방법",titleEn:"How to meet people when you travel alone",descriptionKo:"낯선 도시에서 관계를 시작하는 작고 구체적인 방법.",descriptionEn:"Small, practical ways to begin a connection in an unfamiliar city.",location:"DA NANG",date:"FIELD NOTE 03",source:"Brunch",url:"https://brunch.co.kr/@eatfear",image:"images/forest-240.webp"}];
const fadeHandles = new WeakMap();
const INTRO_SCENE_DURATION = 1050;
const introScenes = [
  { theme: "sea", number: "01 / 04", ko: "바다의 조류를<br>따라갑니다.", en: "Following<br>the sea tide." , english: "SEA / SALT / TIDE" },
  { theme: "forest", number: "02 / 04", ko: "숲의 그림자에<br>잠시 머뭅니다.", en: "Pausing<br>in forest shade.", english: "FOREST / ROOT / SHADE" },
  { theme: "desert", number: "03 / 04", ko: "사막의 빛을<br>천천히 건넙니다.", en: "Crossing<br>desert light.", english: "DESERT / DUST / LIGHT" },
  { theme: "moss", number: "04 / 04", ko: "이끼의 시간에<br>귀를 기울입니다.", en: "Listening<br>to moss time.", english: "MOSS / MIST / TIME" },
];

const translations = window.LOMO_TRANSLATIONS || {
  ko: {
    "language.group": "언어 선택", "language.ko": "한국어", "language.en": "영어",
    "header.climates": "○ 바다 · 숲 · 사막 · 이끼숲", "brand.home": "Jikoo On 홈으로 이동",
    "intro.skip": "건너뛰기 <span>↗</span>", "hero.title": "서로 먼 풍경을<br />한 기록 안에<br /><i>천천히 기릅니다.</i>",
    "hero.english": "A citizen of Earth, holding distant climates together.", "hero.origin": "물이 무서웠습니다.<br /><strong>지금은 다이버예요.</strong>",
    "hero.body": "2022년 12월부터 서로 다른 환경에서 만난 감각을 사진과 글로 남기고 있습니다. 바다와 숲, 사막과 이끼숲처럼 쉽게 함께 놓이지 않는 풍경은 LOMO Route Studio와 언젠가 지을 테라리움 하우스의 상상이 되었습니다.",
    "hero.factLabel": "LOMO 기록의 핵심 환경", "ecosystem.title": "기록의 생태계", "ecosystem.lead": "서로 다른 기후의 감각이 사진, 문장, 도시, 도구, 하우스로 이어집니다.<br />지구 위에서 이동하고, 살아가고, 만들고, 기록하는 방식까지.",
    "route.title": "LOMO Route<br />Studio", "route.body": "사진 한 장에서, 빛나는 지구본 위로<br />내 여정이 하나의 영상이 됩니다.", "route.cta": "앱스토어에서 경로 열기 ↘",
    "waypoint.instagram.note": "서로 다른 빛을 모은 사진 기록", "waypoint.brunch.title": "풍경이 지나간 뒤 남는 문장", "waypoint.brunch.note": "느린 여행을 오래 바라본 에세이", "waypoint.tistory.title": "도시 · 체류 · 실용 여행 노트", "waypoint.tistory.note": "몸으로 배우는 낯선 도시 기록",
    "house.teaser": "바다의 수분, 사막의 빛, 숲과 이끼의 시간을<br />함께 품을 집의 스케치.", "footer.back": "BACK TO SURFACE ↗",
    "modal.close": "LOMO House 상세 창 닫기", "modal.closeText": "닫기", "biome.sea": "수분과 조류", "biome.forest": "그림자와 뿌리", "biome.desert": "빛과 온기", "biome.moss": "안개와 시간", "modal.title": "서로 먼 기후가<br /><i>함께 머무는 집</i>", "modal.lead": "LOMO House는 여행에서 만난 상반된 환경을 한 지붕 아래에서 상상하는, 아직은 미래형 테라리움 하우스입니다.", "modal.body": "바다의 습도와 사막의 빛, 숲의 그림자와 이끼의 느린 시간을 분리하지 않고 한 공간의 감각으로 엮습니다. 국경을 넘어 지구 위에 살아가는 태도처럼, LOMO House는 서로 다른 조건이 관계를 맺는 방식에 대한 스케치입니다.", "modal.biomesLabel": "LOMO House의 네 가지 환경", "modal.cta": "LOMO.earth에서 스케치 보기 ↗",
    "image.route": "자연 속 여행 노트", "image.house": "깊은 숲과 이끼의 풍경", "image.sea": "해안의 조수와 모래를 담은 사진", "image.forest": "안개 낀 숲을 담은 사진", "image.desert": "붉은 사막의 능선을 담은 사진", "image.modal": "안개와 숲이 공존하는 자연 풍경",
    "sound.on": "자연 배경음 끄기", "sound.off": "자연 배경음 켜기"
  },
  en: {
    "language.group": "Language selection", "language.ko": "Korean", "language.en": "English",
    "header.climates": "○ SEA · FOREST · DESERT · MOSS", "brand.home": "Go to Jikoo On home",
    "intro.skip": "SKIP <span>↗</span>", "hero.title": "I grow distant<br />landscapes slowly<br /><i>in one record.</i>",
    "hero.english": "A citizen of Earth, holding distant climates together.", "hero.origin": "I was afraid of water.<br /><strong>Now I’m a diver.</strong>",
    "hero.body": "Since December 2022, I have been gathering the sensations of different environments through photographs and writing. Landscapes that are not easily placed together—sea, forest, desert, and moss—have become the imagination behind LOMO Route Studio and a terrarium house I hope to build one day.",
    "hero.factLabel": "LOMO’s core climates", "ecosystem.title": "The ecology of records", "ecosystem.lead": "Sensations from distant climates flow into photographs, sentences, cities, tools, and a house.<br />And into the ways we move, live, make, and record on Earth.",
    "route.title": "LOMO Route<br />Studio", "route.body": "From one photograph, a journey becomes a moving image<br />across a luminous globe.", "route.cta": "OPEN THE ROUTE IN APP STORE ↘",
    "waypoint.instagram.note": "A record of light gathered across distance", "waypoint.brunch.title": "Sentences left after the landscape passes", "waypoint.brunch.note": "Essays that stay with a slow journey", "waypoint.tistory.title": "City · stay · practical travel notes", "waypoint.tistory.note": "Field notes from learning unfamiliar cities by body",
    "house.teaser": "A sketch of a house holding the moisture of the sea,<br />the light of the desert, and the time of forests and moss.", "footer.back": "BACK TO SURFACE ↗",
    "modal.close": "Close the LOMO House detail window", "modal.closeText": "CLOSE", "biome.sea": "moisture & tide", "biome.forest": "shadow & root", "biome.desert": "light & warmth", "biome.moss": "mist & time", "modal.title": "A house where<br /><i>distant climates stay together</i>", "modal.lead": "LOMO House imagines contrasting environments met while traveling under one roof—a terrarium house still in the future.", "modal.body": "The humidity of the sea, the light of the desert, the shadow of the forest, and the slow time of moss are woven into one spatial experience. Like a way of living on Earth beyond borders, LOMO House is a sketch of how different conditions can form a relationship.", "modal.biomesLabel": "LOMO House’s four climates", "modal.cta": "SEE THE SKETCHES ON LOMO.EARTH ↗",
    "image.route": "A travel field note in nature", "image.house": "A deep forest and moss landscape", "image.sea": "A photograph of tide and sand on the coast", "image.forest": "A photograph of a misty forest", "image.desert": "A photograph of red desert ridges", "image.modal": "A natural landscape where mist and forest meet",
    "sound.on": "Turn ambient sound off", "sound.off": "Turn ambient sound on"
  }
};
let currentLanguage = document.documentElement.dataset.lang === "en" ? "en" : "ko";
let introTimer = null;

function assetPath(path){return /\/(ko|en)\/$/.test(window.location.pathname)?`../${path}`:path}
function renderFieldNotes(){const target=document.querySelector("[data-field-notes]");if(!target)return;const lang=currentLanguage==="en"?"en":"ko";target.innerHTML=fieldNotes.map(n=>`<a class="field-note" data-track="field-note" href="${n.url}" rel="noreferrer noopener" target="_blank"><img class="field-note-image" loading="lazy" width="640" height="360" src="${assetPath(n.image)}" alt="${n[lang==="en"?"titleEn":"titleKo"]}"><div class="field-note-copy"><div class="field-note-meta"><span>${n.category}</span><span>${n.date}</span></div><h3>${n[lang==="en"?"titleEn":"titleKo"]}</h3><p>${n[lang==="en"?"descriptionEn":"descriptionKo"]}</p><div class="field-note-footer"><span>${n.location} / ${n.source}</span><span>READ ↗</span></div></div></a>`).join("")}
function applySiteConfig(){document.querySelectorAll("[data-config-key]").forEach(e=>{const v=siteConfig[e.dataset.configKey]||"";if(!v){e.hidden=true;return}if(e.tagName==="A"){e.href=v;e.rel="noreferrer noopener";e.target="_blank"}})}
function trackEvent(name,metadata={}){if(typeof window.LOMO_ANALYTICS==="function")window.LOMO_ANALYTICS(name,metadata)}

function getFocusableElements() {
  return modalPanel ? [...modalPanel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')] : [];
}

function openModal() {
  if (!modal) return;
  window.clearTimeout(modalHideTimer);
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  introMain?.setAttribute("aria-hidden", "true");
  if (introMain) introMain.inert = true;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => modal.dataset.state = "open");
  closeButton?.focus();
}

function closeModal() {
  if (!modal || modal.hidden) return;
  modal.dataset.state = "closing";
  modal.setAttribute("aria-hidden", "true");
  introMain?.removeAttribute("aria-hidden");
  if (introMain) introMain.inert = false;
  document.body.classList.remove("modal-open");
  window.clearTimeout(modalHideTimer);
  modalHideTimer = window.setTimeout(() => {
    modal.hidden = true;
    modalHideTimer = null;
  }, 260);
  lastFocusedElement?.focus();
}

function finishIntro() {
  if (!intro || intro.hidden) return;
  window.clearInterval(introInterval);
  introInterval = null;
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
  if (introKorean) introKorean.innerHTML = scene[currentLanguage];
  if (introEnglish) introEnglish.textContent = scene.english;
  introProgress.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex <= index));
  setAmbientTheme(scene.theme);
}

function updateSoundButton() {
  if (!soundToggle || !soundLabel) return;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", t(soundEnabled ? "sound.on" : "sound.off"));
  soundLabel.textContent = soundEnabled ? "SOUND ON" : "SOUND OFF";
}

function t(key) {
  return translations[currentLanguage]?.[key] ?? translations.ko[key] ?? key;
}

function applyLanguage(language, persist = true) {
  if (!translations[language]) return;
  currentLanguage = language;
  document.documentElement.lang = language;
  document.documentElement.dataset.lang = language;
  document.body.classList.remove("i18n-ready");
  document.querySelectorAll("[data-i18n], [data-i18n-html]").forEach((element) => {
    const key = element.dataset.i18n || element.dataset.i18nHtml;
    if (element.dataset.i18nHtml) element.innerHTML = t(key);
    else element.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel)); });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => { element.setAttribute("alt", t(element.dataset.i18nAlt)); });
  document.querySelectorAll("[data-language]").forEach((button) => {
    const selected = button.dataset.language === language;
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
    button.setAttribute("aria-label", t(`language.${button.dataset.language}`));
  });
  if (intro && !intro.hidden) setIntroScene([...introScenes].findIndex((scene) => scene.theme === intro.dataset.theme));
  updateSoundButton();
  document.title = language === "en" ? "Jikoo On · LOMO Links" : "Jikoo On · LOMO Links";
  renderFieldNotes();
  requestAnimationFrame(() => document.body.classList.add("i18n-ready"));
  if (persist) { try { localStorage.setItem("lomo-language", language); } catch (_) {} }
}

function fadeAudio(audio, target, onComplete) {
  if (!audio) return;
  cancelAnimationFrame(fadeHandles.get(audio) ?? 0);
  const start = audio.volume;
  const startedAt = performance.now();
  const duration = 320;
  const tick = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    audio.volume = start + (target - start) * progress;
    if (progress < 1) {
      fadeHandles.set(audio, requestAnimationFrame(tick));
    } else {
      fadeHandles.delete(audio);
      onComplete?.();
    }
  };
  fadeHandles.set(audio, requestAnimationFrame(tick));
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
  if (soundEnabled) {
    setAmbientTheme(intro && !intro.hidden ? intro.dataset.theme : activeSoundTheme);
  } else {
    pauseAmbientTracks();
  }
  updateSoundButton();
}

function resumePreferredSound() {
  if (!soundEnabled || soundPreferencePrimed || document.hidden) return;
  soundPreferencePrimed = true;
  setAmbientTheme(intro && !intro.hidden ? intro.dataset.theme : activeSoundTheme);
}

function pauseAmbientTracks(reset = true) {
  Object.values(ambientTracks).forEach((audio) => {
    if (!audio) return;
    cancelAnimationFrame(fadeHandles.get(audio) ?? 0);
    fadeHandles.delete(audio);
    audio.pause();
    audio.volume = 0;
    if (reset) audio.currentTime = 0;
  });
}

function handleVisibilityChange() {
  if (document.hidden) {
    pauseAmbientTracks();
    soundPreferencePrimed = false;
  }
}

function handleAudioError(event) {
  const failedAudio = event.currentTarget;
  const availableEntry = Object.entries(ambientTracks).find(([, audio]) => audio && audio !== failedAudio && !audio.error);
  if (!availableEntry) {
    soundEnabled = false;
    soundPreferencePrimed = true;
    updateSoundButton();
    return;
  }
  if (soundEnabled && ambientTracks[activeSoundTheme] === failedAudio) {
    setAmbientTheme(availableEntry[0]);
  }
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
  introInterval = window.setInterval(() => {
    index += 1;
    if (index >= introScenes.length) {
      window.clearInterval(introInterval);
      introInterval = null;
      introTimer = window.setTimeout(finishIntro, 730);
      return;
    }
    setIntroScene(index);
  }, INTRO_SCENE_DURATION);
}

openButton?.addEventListener("click", openModal);
closeButton?.addEventListener("click", closeModal);
introSkip?.addEventListener("click", finishIntro);
soundToggle?.addEventListener("click", toggleSound);
document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => applyLanguage(button.dataset.language)));
document.querySelectorAll("[data-track]").forEach((element) => element.addEventListener("click", () => trackEvent(element.dataset.track, { href: element.href || "" })));
soundThemes.forEach((element) => {
  const changeTheme = () => setAmbientTheme(element.dataset.soundTheme);
  element.addEventListener("mouseenter", changeTheme);
  element.addEventListener("focusin", changeTheme);
});

Object.values(ambientTracks).forEach((audio) => audio?.addEventListener("error", handleAudioError));
document.addEventListener("visibilitychange", handleVisibilityChange);
window.addEventListener("pagehide", () => pauseAmbientTracks());
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

applySiteConfig();
applyLanguage(currentLanguage, false);
startIntro();
updateSoundButton();
if (!intro || intro.hidden) setAmbientTheme(activeSoundTheme);
