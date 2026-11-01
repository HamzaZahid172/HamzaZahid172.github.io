/* A side-mounted lamp lights the existing Projects gallery progressively. */
(() => {
  const scene = document.getElementById("projects-light-scene");
  const toggle = document.getElementById("projects-lamp-switch");
  const stage = document.getElementById("projects-light-stage");
  const grid = stage && stage.querySelector(".projects-grid");
  const label = document.getElementById("projects-lamp-switch-label");
  const status = document.getElementById("projects-light-status");
  if (!scene || !toggle || !stage || !grid || !label || !status) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lit = false;

  [...grid.querySelectorAll(".project-card")].forEach((card,index) => {
    // Ripple the light from the lamp toward the cards.
    card.style.setProperty("--light-delay",
      reduceMotion.matches ? "0ms" : (Math.min(index,6)*95)+"ms");
  });

  function render() {
    scene.classList.toggle("is-on",lit);
    scene.classList.toggle("is-off",!lit);
    stage.classList.toggle("is-lit",lit);
    stage.classList.toggle("is-dark",!lit);
    toggle.setAttribute("aria-pressed",String(lit));
    toggle.setAttribute("aria-label",lit
      ? "Switch the lamp off and dim the projects"
      : "Switch the lamp on and illuminate the projects");
    label.textContent = lit ? "TURN LIGHTS OFF" : "TURN LIGHTS ON";
    status.textContent = lit
      ? "Lights on. Explore my work."
      : "Lights off. Click the lamp to reveal my work.";
    // Prevent clicking or tabbing into project links while they are unreadable.
    grid.inert = !lit;
  }

  toggle.addEventListener("click", () => {
    lit = !lit;
    render();
  });
  render();
})();
