/* Projects lighting: simple accessible ON/OFF button beside the hanging lamp.
   Every card stays illuminated while scrolling, including the final row. */
(() => {
  const scene = document.getElementById("projects-light-scene");
  const stage = document.getElementById("projects-light-stage");
  const toggle = document.getElementById("projects-lamp-switch");
  const grid = stage && stage.querySelector(".projects-grid");
  const label = document.getElementById("projects-lamp-switch-label");
  const status = document.getElementById("projects-light-status");
  if (!scene || !stage || !toggle || !grid || !label || !status) return;

  const cards = [...grid.querySelectorAll(".project-card")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lit = false;
  let pending = false;
  let flickerTimer = null;

  cards.forEach((card, index) => {
    card.style.setProperty("--light-delay", reducedMotion.matches ? "0ms" : (index * 65) + "ms");
  });

  function moveGlow() {
    pending = false;
    if (!lit) return;
    const rect = stage.getBoundingClientRect();
    const y = Math.max(0, Math.min(rect.height, window.innerHeight * .43 - rect.top));
    stage.style.setProperty("--glow-y", y + "px");
  }
  function requestGlow() {
    if (!lit || pending) return;
    pending = true;
    window.requestAnimationFrame(moveGlow);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("in-spotlight", entry.isIntersecting));
    }, {rootMargin:"-75px 0px -8% 0px", threshold:.08});
    cards.forEach(card => observer.observe(card));
  }

  function render() {
    scene.classList.toggle("is-on", lit);
    scene.classList.toggle("is-off", !lit);
    stage.classList.toggle("is-lit", lit);
    stage.classList.toggle("is-dark", !lit);
    toggle.setAttribute("aria-pressed", String(lit));
    toggle.setAttribute("aria-label", lit ? "Turn project lights off" : "Turn project lights on");
    label.textContent = lit ? "LIGHTS ON" : "LIGHTS OFF";
    status.textContent = lit
      ? "Project lights on. All seven projects are visible."
      : "Project lights off. The seven project cards are dark and blurred.";
    grid.inert = !lit;
    if (lit) requestGlow();
  }

  toggle.addEventListener("click", () => {
    lit = !lit;
    render();
    scene.classList.remove("is-switching-on");
    if (flickerTimer !== null) window.clearTimeout(flickerTimer);
    if (lit && !reducedMotion.matches) {
      void scene.offsetWidth;
      scene.classList.add("is-switching-on");
      flickerTimer = window.setTimeout(() => {
        scene.classList.remove("is-switching-on");
        flickerTimer = null;
      }, 650);
    }
  });

  window.addEventListener("scroll", requestGlow, {passive:true});
  window.addEventListener("resize", requestGlow, {passive:true});
  render();
})();
