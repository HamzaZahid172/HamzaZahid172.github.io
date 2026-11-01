/* Accessible comparison: spotlight in projects vs whole-page night mode. */
(() => {
  const showcase = document.getElementById("lamp-showcase");
  const heroToggle = document.getElementById("lamp-toggle");
  const lampState = document.getElementById("lamp-state");
  const sceneToggle = document.getElementById("projects-light-toggle");
  const scopeButtons = [...document.querySelectorAll("[data-light-scope]")];
  const description = document.getElementById("lighting-description");
  const exitButton = document.getElementById("lighting-exit");
  if (!showcase || !heroToggle || !lampState || !sceneToggle || !description || !exitButton || scopeButtons.length !== 2) return;
  const heroText = heroToggle.querySelector(".lamp-toggle-text");
  let scope = "projects";
  let lit = true;

  function render() {
    const isProjects = scope === "projects";
    const wholePageDark = !isProjects && !lit;
    showcase.classList.toggle("lamp-off", !lit);
    document.body.classList.toggle("lighting-projects-on", isProjects && lit);
    document.body.classList.toggle("lighting-projects-off", isProjects && !lit);
    document.body.classList.toggle("lighting-page-night", wholePageDark);
    heroToggle.setAttribute("aria-pressed", String(lit));
    heroToggle.setAttribute("aria-label", lit ? "Turn off spotlight" : "Turn on spotlight");
    if (heroText) heroText.textContent = lit ? "Lights off" : "Lights on";
    lampState.textContent = (isProjects ? "Projects" : "Whole page") + (lit ? " · light on" : " · light off");
    sceneToggle.setAttribute("aria-pressed", String(lit));
    sceneToggle.textContent = lit ? "Turn lights off" : "Turn lights on";
    scopeButtons.forEach((button) => {
      const selected = button.dataset.lightScope === scope;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("is-active", selected);
    });
    description.textContent = isProjects
      ? (lit ? "Projects illuminated. Switch off to compare a darker project gallery." : "Project gallery dimmed. Turn on to highlight your engineering work.")
      : (lit ? "Whole-page lighting restored. Turn off to explore the night spotlight." : "Night mode: the page darkens around a movable spotlight. Move your cursor or restore daylight.");
    exitButton.hidden = !wholePageDark;
  }

  function toggle() { lit = !lit; render(); }
  heroToggle.addEventListener("click", toggle);
  sceneToggle.addEventListener("click", toggle);

  scopeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      scope = button.dataset.lightScope;
      // Selecting a mode immediately previews its defining visual effect.
      lit = scope === "projects";
      render();
    });
  });

  exitButton.addEventListener("click", () => { lit = true; render(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("lighting-page-night")) {
      lit = true;
      render();
    }
  });
  document.addEventListener("pointermove", (event) => {
    if (!document.body.classList.contains("lighting-page-night") || event.pointerType === "touch") return;
    document.body.style.setProperty("--light-x", event.clientX + "px");
    document.body.style.setProperty("--light-y", event.clientY + "px");
  }, { passive: true });
  render();
})();
