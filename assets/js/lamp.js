/* Projects: pull the hanging cord to switch light; keyboard Enter/Space is equivalent.
   The bulb illuminates all seven project cards and its ambient light follows scrolling. */
(() => {
  const scene = document.getElementById("projects-light-scene");
  const stage = document.getElementById("projects-light-stage");
  const cord = document.getElementById("projects-lamp-switch");
  const grid = stage && stage.querySelector(".projects-grid");
  const label = document.getElementById("projects-lamp-switch-label");
  const status = document.getElementById("projects-light-status");
  const showAll = document.getElementById("projects-show-all");
  if (!scene || !stage || !cord || !grid || !label || !status) return;

  const cards = [...grid.querySelectorAll(".project-card")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pullThreshold = 20;
  let lit = false;
  let framePending = false;
  let dragging = false;
  let originY = 0;
  let pointerId = null;
  let flickerTimer = null;

  cards.forEach((card, index) => {
    card.style.setProperty("--light-delay", reducedMotion.matches ? "0ms" : (index * 65) + "ms");
  });

  function moveGlow() {
    framePending = false;
    if (!lit) return;
    const rect = stage.getBoundingClientRect();
    const y = Math.max(0, Math.min(rect.height, window.innerHeight * .43 - rect.top));
    stage.style.setProperty("--glow-y", y + "px");
  }
  function onViewportChange() {
    if (!lit || framePending) return;
    framePending = true;
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
    cord.setAttribute("aria-pressed", String(lit));
    cord.setAttribute("aria-label", lit
      ? "Pull down the cord to turn project lights off. Press Enter or Space with a keyboard."
      : "Pull down the cord to turn project lights on. Press Enter or Space with a keyboard.");
    label.textContent = "PULL ↓";
    status.textContent = lit
      ? "Projects are illuminated. Pull the cord to turn lights off."
      : "Projects are dark. Pull the cord to reveal all seven projects.";
    grid.inert = !lit;
    if (lit) onViewportChange();
  }

  function toggleLights() {
    lit = !lit;
    render();
    scene.classList.remove("is-switching-on");
    if (flickerTimer !== null) window.clearTimeout(flickerTimer);
    if (lit && !reducedMotion.matches) {
      // Restart the small bulb flicker after each successful pull.
      void scene.offsetWidth;
      scene.classList.add("is-switching-on");
      flickerTimer = window.setTimeout(() => {
        scene.classList.remove("is-switching-on");
        flickerTimer = null;
      }, 700);
    }
  }

  function resetPull() {
    dragging = false;
    pointerId = null;
    cord.classList.remove("is-dragging");
    cord.style.setProperty("--pull-distance", "0px");
  }

  cord.addEventListener("pointerdown", event => {
    if (event.button !== 0 || dragging) return;
    dragging = true;
    originY = event.clientY;
    pointerId = event.pointerId;
    cord.classList.add("is-dragging");
    if (cord.setPointerCapture) cord.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  cord.addEventListener("pointermove", event => {
    if (!dragging || event.pointerId !== pointerId) return;
    const distance = Math.max(0, Math.min(35, event.clientY - originY));
    cord.style.setProperty("--pull-distance", distance + "px");
  });
  cord.addEventListener("pointerup", event => {
    if (!dragging || event.pointerId !== pointerId) return;
    const pulled = event.clientY - originY >= pullThreshold;
    resetPull();
    if (pulled) toggleLights();
  });
  cord.addEventListener("pointercancel", resetPull);
  cord.addEventListener("lostpointercapture", () => { if (dragging) resetPull(); });

  // Browser-generated click from keyboard or assistive technology, not a mouse click.
  // Mouse and touch users must actually pull the cord.
  cord.addEventListener("click", event => {
    if (event.detail === 0) toggleLights();
  });

  // Alternative path is intentionally retained for accessibility and easy recruiter review.
  if (showAll) showAll.addEventListener("click", () => {
    if (!lit) {
      lit = true;
      render();
    }
    stage.scrollIntoView({behavior:reducedMotion.matches ? "auto" : "smooth",block:"start"});
  });
  window.addEventListener("scroll", onViewportChange, {passive:true});
  window.addEventListener("resize", onViewportChange, {passive:true});
  render();
})();
