/* Interactive portfolio spotlight, decorative only: no login or account data. */
(() => {
  const showcase = document.getElementById("lamp-showcase");
  const toggle = document.getElementById("lamp-toggle");
  const state = document.getElementById("lamp-state");
  if (!showcase || !toggle || !state) return;
  const label = toggle.querySelector(".lamp-toggle-text");
  let lit = true;

  const render = () => {
    showcase.classList.toggle("lamp-off", !lit);
    toggle.setAttribute("aria-pressed", String(lit));
    toggle.setAttribute("aria-label", lit ? "Turn off spotlight" : "Turn on spotlight");
    if (label) label.textContent = lit ? "Lights off" : "Lights on";
    state.textContent = lit ? "Spotlight on" : "Spotlight off";
  };

  toggle.addEventListener("click", () => {
    lit = !lit;
    render();
  });
  render();
})();
