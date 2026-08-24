/* --- Typing animation --- */
const phrases = [
  "Senior Software Engineer",
  "Python & Backend Engineering",
  "Cloud-Native Development",
  "Data Engineering & Data Science",
  "Machine Learning Projects",
  "LLM Applications & Agentic AI",
  "AI-Assisted Development & Vibe Coding",
  "Automation for Engineering Workflows",
];
let pi = 0,
  ci = 0,
  deleting = false;
const el = document.getElementById("typed-text");
function type() {
  if (!el) return;
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
const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
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
revealEls.forEach((item) => io.observe(item));

/* --- Navbar shadow on scroll --- */
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  nav.style.boxShadow = window.scrollY > 50 ? "0 4px 40px rgba(0,0,0,.5)" : "none";
});

/* --- Floating portfolio voice assistant --- */
(function setupVoiceAssistant() {
  if (!("speechSynthesis" in window)) return;

  const style = document.createElement("style");
  style.textContent = `
    .voice-assistant{position:fixed;right:22px;bottom:22px;z-index:999;font-family:var(--font-body,monospace)}
    .voice-trigger{width:54px;height:54px;border:1px solid rgba(0,212,255,.55);border-radius:50%;background:rgba(8,12,18,.94);color:#00d4ff;box-shadow:0 10px 35px rgba(0,0,0,.35),0 0 24px rgba(0,212,255,.14);cursor:pointer;display:grid;place-items:center;font-size:21px;backdrop-filter:blur(14px);transition:.2s ease}
    .voice-trigger:hover{transform:translateY(-2px);background:rgba(0,212,255,.1)}
    .voice-panel{position:absolute;right:0;bottom:66px;width:min(340px,calc(100vw - 36px));padding:16px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(13,19,32,.97);color:#e8edf5;box-shadow:0 18px 60px rgba(0,0,0,.45);backdrop-filter:blur(18px);opacity:0;visibility:hidden;transform:translateY(8px);transition:.2s ease}
    .voice-assistant.open .voice-panel{opacity:1;visibility:visible;transform:translateY(0)}
    .voice-panel strong{display:block;font-family:var(--font-head,sans-serif);font-size:15px;margin-bottom:6px}
    .voice-panel p{color:#8b98ad;font-size:11px;line-height:1.65;margin:0 0 12px}
    .voice-buttons{display:flex;gap:8px}.voice-buttons button{flex:1;border-radius:7px;padding:9px 10px;font:inherit;font-size:10px;letter-spacing:.06em;cursor:pointer;border:1px solid rgba(255,255,255,.12);background:transparent;color:#e8edf5}
    .voice-buttons button:first-child{background:#00d4ff;border-color:#00d4ff;color:#031017;font-weight:600}.voice-status{margin-top:10px!important;margin-bottom:0!important;color:#00d4ff!important;min-height:16px}
    @media(max-width:600px){.voice-assistant{right:16px;bottom:18px}.voice-trigger{width:50px;height:50px}.voice-panel{bottom:60px}}
  `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.className = "voice-assistant";
  root.innerHTML = `
    <div class="voice-panel" role="dialog" aria-label="Portfolio AI voice assistant">
      <strong>AI Portfolio Assistant</strong>
      <p>Hear a concise overview of Hamza's software engineering, cloud, data and applied AI profile.</p>
      <div class="voice-buttons"><button type="button" data-action="play">▶ Listen</button><button type="button" data-action="stop">■ Stop</button></div>
      <p class="voice-status" aria-live="polite"></p>
    </div>
    <button class="voice-trigger" type="button" aria-label="Open AI portfolio assistant" aria-expanded="false">🤖</button>`;
  document.body.appendChild(root);

  const trigger = root.querySelector(".voice-trigger");
  const play = root.querySelector('[data-action="play"]');
  const stop = root.querySelector('[data-action="stop"]');
  const status = root.querySelector(".voice-status");

  trigger.addEventListener("click", () => {
    const open = root.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(open));
  });

  const intro = "Hello. I'm Hamza Zahid Butt's AI portfolio assistant. Hamza is a Senior Software Engineer with more than seven years of professional software engineering experience. He has built production systems using Python, TypeScript, JavaScript and Node.js, including backend-oriented services, REST API integrations, large-scale data extraction and processing pipelines, and cloud-based engineering workflows. He has hands-on experience with AWS, Docker, Kubernetes, CI CD and modern developer tooling. Alongside his professional engineering background, Hamza is actively building his applied AI profile through Python, data science and machine learning projects, including predictive modeling and data analysis. He understands modern LLM application development, prompt engineering, AI-assisted coding, retrieval and agentic AI concepts, and is exploring how intelligent agents can be integrated into practical software products and engineering workflows. His automation background remains a supporting engineering strength, rather than his primary career direction. Hamza's current focus is backend software engineering, cloud-native development, data engineering, machine learning, LLM applications and agentic AI. He is based in Germany and is open to software engineering, backend, cloud, data and applied AI opportunities.";

  play.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(intro);
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    utterance.onstart = () => { status.textContent = "Speaking…"; };
    utterance.onend = () => { status.textContent = "Finished."; };
    utterance.onerror = () => { status.textContent = "Speech is unavailable in this browser."; };
    window.speechSynthesis.speak(utterance);
  });

  stop.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    status.textContent = "Stopped.";
  });
})();
