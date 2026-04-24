/* --- Typing animation --- */
const phrases = [
  "TypeScript & Python Engineer",
  "QA Automation Architect",
  "Web Scraping & Data Pipelines",
  "Cloud & CI/CD Enthusiast",
  "Team Lead & Mentor",
  "7+ Years Building at Scale",
];
let pi = 0,
  ci = 0,
  deleting = false;
const el = document.getElementById("typed-text");
function type() {
  const word = phrases[pi];
  if (!deleting) {
    el.textContent = word.substring(0, ci + 1);
    ci++;
    if (ci === word.length) {
      deleting = true;
      setTimeout(type, 1600);
      return;
    }
  } else {
    el.textContent = word.substring(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 45 : 80);
}
type();

/* --- Scroll reveal --- */
const revealEls = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right",
);
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
);
revealEls.forEach((el) => io.observe(el));

/* --- Navbar shadow on scroll --- */
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  nav.style.boxShadow =
    window.scrollY > 50 ? "0 4px 40px rgba(0,0,0,.5)" : "none";
});
