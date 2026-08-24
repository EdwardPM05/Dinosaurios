const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const progress = document.querySelector(".progress i");
const parallax = [...document.querySelectorAll(".parallax")];
const reveal = [...document.querySelectorAll(".reveal")];
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.16 },
);
reveal.forEach((element) => observer.observe(element));

const manifesto = document.querySelector(".manifesto");
if (manifesto) {
  const lines = [...manifesto.querySelectorAll("[data-stagger-line]")];
  let charIndex = 0;
  lines.forEach((line) => {
    const text = line.dataset.staggerLine;
    const italicWord = line.dataset.italicWord || "";
    line.textContent = "";
    [...text].forEach((character, index) => {
      const char = document.createElement("span");
      const inItalicWord =
        italicWord && index >= text.length - italicWord.length;
      char.className = `manifesto-char${character === " " ? " space" : ""}${inItalicWord ? " italic-char" : ""}`;
      char.style.setProperty("--char-index", charIndex++);
      char.textContent = character === " " ? " " : character;
      line.appendChild(char);
    });
  });
  const animateManifesto = () => {
    manifesto.classList.remove("is-animated");
    void manifesto.offsetWidth;
    manifesto.classList.add("is-animated");
  };
  const manifestoObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        animateManifesto();
        manifestoObserver.unobserve(manifesto);
      }
    },
    { threshold: 0.45 },
  );
  manifestoObserver.observe(manifesto);
  manifesto
    .querySelector(".manifesto-replay")
    .addEventListener("click", animateManifesto);
}
let ticking = false;
function updateMotion() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${Math.min(100, (y / max) * 100)}%`;
  if (!reduced)
    parallax.forEach((element) => {
      const speed = Number(element.dataset.speed || 0);
      const rect = element.parentElement.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      element.style.transform = `translate3d(0, ${center * speed}px, 0) scale(1.04)`;
    });
  ticking = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateMotion);
    }
  },
  { passive: true },
);
window.addEventListener("resize", updateMotion, { passive: true });
updateMotion();

const excavation = document.querySelector(".excavation");
const bones = [...document.querySelectorAll(".bone")];
const boneName = document.getElementById("boneName");
const boneText = document.getElementById("boneText");
const bonePercent = document.getElementById("bonePercent");
const fossils = [...document.querySelectorAll(".fossil-specimen")];
const skeletonTrack = document.querySelector(".skeleton-track");
function updateExcavation() {
  if (!excavation) return;
  const rect = excavation.getBoundingClientRect();
  const range = excavation.offsetHeight - window.innerHeight;
  const amount = Math.max(0, Math.min(1, -rect.top / range));
  excavation.style.setProperty("--bone-build", amount);
  bonePercent.textContent = `${Math.round(amount * 100)}%`;
  bones.forEach((bone, index) =>
    bone.classList.toggle("is-dug", amount >= (index + 1) / (bones.length + 1)),
  );
  fossils.forEach((fossil, index) =>
    fossil.classList.toggle(
      "is-dug",
      amount >= (index + 1) / (fossils.length + 1),
    ),
  );
  if (skeletonTrack) {
    const maxTravel =
      skeletonTrack.scrollWidth - skeletonTrack.parentElement.clientWidth;
    skeletonTrack.style.transform = `translateX(${-amount * Math.max(0, maxTravel)}px)`;
  }
}
function inspectBone(bone) {
  bones.forEach((item) => item.classList.toggle("active", item === bone));
  boneName.textContent = bone.dataset.name;
  boneText.textContent = bone.dataset.text;
}
bones.forEach((bone) => {
  bone.addEventListener("click", () => inspectBone(bone));
  bone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inspectBone(bone);
    }
  });
});
window.addEventListener("scroll", updateExcavation, { passive: true });
window.addEventListener("resize", updateExcavation, { passive: true });
skeletonTrack
  ?.querySelectorAll("img")
  .forEach((image) =>
    image.addEventListener("load", updateExcavation, { once: true }),
  );
updateExcavation();

document.querySelectorAll(".species-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("is-flipped"));
});

const surface = document.querySelector(".huella");
const surfaceTitle = document.querySelector(".surface-title");
if (surface && surfaceTitle) {
  const title = surfaceTitle.dataset.surfaceTitle;
  surfaceTitle.textContent = "";
  [...title].forEach((character, index) => {
    if (index === 7) surfaceTitle.append(document.createElement("br"));
    const char = document.createElement("span");
    char.className = `surface-char${character === " " ? " space" : ""}${index >= 7 ? " accent" : ""}`;
    char.style.setProperty("--surface-index", index);
    char.textContent = character === " " ? " " : character;
    surfaceTitle.append(char);
  });
  const surfaceObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        surface.classList.add("is-surface-animated");
        surfaceObserver.unobserve(surface);
      }
    },
    { threshold: 0.4 },
  );
  surfaceObserver.observe(surface);
}
