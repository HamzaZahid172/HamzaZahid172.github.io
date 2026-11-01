/* The lamp controls the Projects gallery only. Other site sections never dim. */
(() => {
  const section = document.getElementById("projects");
  const consolePanel = document.getElementById("projects-lamp-console");
  const toggle = document.getElementById("projects-lamp-switch");
  const stage = document.getElementById("projects-light-stage");
  const grid = stage && stage.querySelector(".projects-grid");
  const label = document.getElementById("projects-lamp-switch-label");
  const status = document.getElementById("projects-light-status");
  if (!section || !consolePanel || !toggle || !stage || !grid || !label || !status) return;

  let lightsOn = false;
  function render() {
    stage.classList.toggle("is-dark", !lightsOn);
    stage.classList.toggle("is-lit", lightsOn);
    consolePanel.classList.toggle("is-off", !lightsOn);
    consolePanel.classList.toggle("is-on", lightsOn);
    toggle.setAttribute("aria-pressed", String(lightsOn));
    toggle.setAttribute("aria-label", lightsOn
      ? "Switch off the lamp and blur the Projects section"
      : "Switch on the lamp and reveal all engineering projects");
    label.textContent = lightsOn ? "☾ Turn lights off" : "☀ Turn lights on";
    status.textContent = lightsOn
      ? "Lights on. Explore the engineering projects below."
      : "The projects are in the dark. Click the lamp to reveal them.";
    // Prevent keyboard navigation into blurred links while lights are off.
    grid.inert = !lightsOn;
  }

  toggle.addEventListener("click", () => {
    lightsOn = !lightsOn;
    render();
  });
  render();
})();
