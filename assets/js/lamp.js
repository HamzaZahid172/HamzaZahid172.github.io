/* Reversible full-page lamp: dark/blur everything, switch on to reveal. */
(() => {
  const reveal = document.getElementById("portfolio-reveal");
  const lamp = document.getElementById("reveal-lamp");
  const skip = document.getElementById("reveal-skip");
  const heroSwitch = document.getElementById("replay-reveal");
  const floatingSwitch = document.getElementById("ambient-light-switch");
  const mode = document.getElementById("reveal-mode");
  if (!reveal || !lamp || !skip || !heroSwitch || !floatingSwitch || !mode) return;

  const key = "hzb-intro-revealed-v1";
  const root = document.documentElement;
  const background = [...document.body.children].filter((node) =>
    node !== reveal && !["SCRIPT", "NOSCRIPT"].includes(node.tagName)
  );
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = false;
  let switching = false;
  let timer = null;
  let returnFocus = null;

  function saveSeen() {
    try { sessionStorage.setItem(key, "yes"); } catch (_) {}
  }
  function setButtonState(lightsOn) {
    floatingSwitch.setAttribute("aria-pressed", String(lightsOn));
    floatingSwitch.setAttribute("aria-label", lightsOn ? "Turn lights off and blur the entire portfolio" : "Turn lights on and reveal the entire portfolio");
    const label = floatingSwitch.querySelector(".ambient-switch-copy");
    if (label) label.textContent = lightsOn ? "Lights off" : "Lights on";
    heroSwitch.textContent = lightsOn ? "✦ Lights off" : "✦ Lights on";
  }
  function clearAnimation() {
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
  }
  function finishReveal() {
    if (!active) return;
    clearAnimation();
    active = false;
    switching = false;
    root.classList.add("portfolio-reveal-seen");
    reveal.hidden = true;
    reveal.classList.remove("is-switching-on", "is-revealing", "is-turning-off");
    document.body.classList.remove("reveal-scroll-locked");
    background.forEach((node) => { node.inert = false; });
    lamp.disabled = false;
    setButtonState(true);
    const target = returnFocus && returnFocus.isConnected
      ? returnFocus
      : document.querySelector("#hero .btn-primary");
    if (target) target.focus({ preventScroll: true });
    returnFocus = null;
  }
  function switchOff(trigger = null, animated = true) {
    if (active) return;
    clearAnimation();
    returnFocus = trigger;
    active = true;
    switching = false;
    lamp.disabled = false;
    mode.textContent = "LIGHTS OFF · DISCOVER WHAT'S BEHIND";
    reveal.classList.remove("is-switching-on", "is-revealing", "is-turning-off");
    if (animated && !reducedMotion.matches) reveal.classList.add("is-turning-off");
    reveal.hidden = false;
    root.classList.remove("portfolio-reveal-seen");
    document.body.classList.add("reveal-scroll-locked");
    background.forEach((node) => { node.inert = true; });
    setButtonState(false);
    lamp.focus({ preventScroll: true });
    if (animated && !reducedMotion.matches) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (active && !switching) reveal.classList.remove("is-turning-off");
      }));
    }
  }
  function switchOn() {
    if (!active || switching) return;
    switching = true;
    reveal.classList.remove("is-turning-off");
    lamp.disabled = true;
    mode.textContent = "LIGHTS ON · THE FULL PORTFOLIO IS READY";
    reveal.classList.add("is-switching-on");
    saveSeen();
    timer = window.setTimeout(() => {
      reveal.classList.add("is-revealing");
      timer = window.setTimeout(finishReveal, reducedMotion.matches ? 0 : 1050);
    }, reducedMotion.matches ? 0 : 410);
  }
  function skipReveal() {
    if (!active) return;
    saveSeen();
    finishReveal();
  }

  lamp.addEventListener("click", switchOn);
  skip.addEventListener("click", skipReveal);
  heroSwitch.addEventListener("click", () => switchOff(heroSwitch));
  floatingSwitch.addEventListener("click", () => switchOff(floatingSwitch));
  reveal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); skipReveal(); }
    if (event.key === "Tab" && active) {
      const items = [lamp, skip].filter((item) => !item.disabled);
      const current = items.indexOf(document.activeElement);
      if (event.shiftKey && current <= 0) { event.preventDefault(); items[items.length - 1].focus(); }
      else if (!event.shiftKey && current === items.length - 1) { event.preventDefault(); items[0].focus(); }
    }
  });

  if (root.classList.contains("portfolio-reveal-seen")) {
    reveal.hidden = true;
    setButtonState(true);
  } else {
    switchOff(null, false);
  }
})();
