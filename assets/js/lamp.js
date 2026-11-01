/* Full-screen lamp welcome: one appearance per browser tab session, replay on demand. */
(() => {
  const reveal = document.getElementById("portfolio-reveal");
  const lamp = document.getElementById("reveal-lamp");
  const skip = document.getElementById("reveal-skip");
  const replay = document.getElementById("replay-reveal");
  const mode = document.getElementById("reveal-mode");
  if (!reveal || !lamp || !skip || !replay) return;

  const key = "hzb-intro-revealed-v1";
  const root = document.documentElement;
  const background = [...document.body.children].filter((node) =>
    node !== reveal && node !== replay && !["SCRIPT", "NOSCRIPT"].includes(node.tagName)
  );
  let active = false;
  let switching = false;
  let timer = null;
  let returnFocus = null;

  function saveSeen() {
    try { sessionStorage.setItem(key, "yes"); } catch (_) {}
  }
  function finish() {
    if (!active) return;
    active = false;
    switching = false;
    if (timer) window.clearTimeout(timer);
    timer = null;
    root.classList.add("portfolio-reveal-seen");
    reveal.hidden = true;
    reveal.classList.remove("is-switching-on", "is-revealing");
    document.body.classList.remove("reveal-scroll-locked");
    background.forEach((node) => { node.inert = false; });
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  }
  function openReveal(isReplay = false) {
    if (active) return;
    returnFocus = isReplay ? replay : null;
    root.classList.remove("portfolio-reveal-seen");
    reveal.hidden = false;
    reveal.classList.remove("is-switching-on", "is-revealing");
    document.body.classList.add("reveal-scroll-locked");
    background.forEach((node) => { node.inert = true; });
    active = true;
    switching = false;
    lamp.focus({ preventScroll: true });
  }
  function turnOn() {
    if (!active || switching) return;
    switching = true;
    lamp.disabled = true;
    mode.textContent = "LIGHTS ON · WELCOME TO MY PORTFOLIO";
    reveal.classList.add("is-switching-on");
    saveSeen();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer = window.setTimeout(() => {
      reveal.classList.add("is-revealing");
      timer = window.setTimeout(() => {
        finish();
        lamp.disabled = false;
      }, reducedMotion ? 0 : 1050);
    }, reducedMotion ? 0 : 410);
  }
  function skipReveal() {
    if (!active) return;
    saveSeen();
    finish();
    lamp.disabled = false;
  }

  lamp.addEventListener("click", turnOn);
  skip.addEventListener("click", skipReveal);
  replay.addEventListener("click", () => {
    if (timer) window.clearTimeout(timer);
    lamp.disabled = false;
    mode.textContent = "LIGHTS OFF · DISCOVER WHAT'S BEHIND";
    openReveal(true);
  });
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
  } else {
    openReveal();
  }
})();
