/* Scroll-following project lighting: entire gallery always lit when ON. */
(() => {
  const scene=document.getElementById("projects-light-scene");
  const stage=document.getElementById("projects-light-stage");
  const lamp=document.getElementById("projects-lamp-switch");
  const grid=stage&&stage.querySelector(".projects-grid");
  const label=document.getElementById("projects-lamp-switch-label");
  const status=document.getElementById("projects-light-status");
  const showAll=document.getElementById("projects-show-all");
  if(!scene||!stage||!lamp||!grid||!label||!status)return;

  const cards=[...grid.querySelectorAll(".project-card")];
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  let lit=false;
  let framePending=false;

  cards.forEach((card,index)=>{
    card.style.setProperty("--light-delay",reduced.matches?"0ms":(index*65)+"ms");
  });
  function moveGlow(){
    framePending=false;
    if(!lit)return;
    const rect=stage.getBoundingClientRect();
    const y=Math.max(0,Math.min(rect.height,window.innerHeight*.43-rect.top));
    stage.style.setProperty("--glow-y",y+"px");
  }
  function onViewportChange(){
    if(!lit||framePending)return;
    framePending=true;
    window.requestAnimationFrame(moveGlow);
  }
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>entry.target.classList.toggle("in-spotlight",entry.isIntersecting));
    },{rootMargin:"-75px 0px -8% 0px",threshold:.08});
    cards.forEach(card=>observer.observe(card));
  }

  function render(){
    scene.classList.toggle("is-on",lit);
    scene.classList.toggle("is-off",!lit);
    stage.classList.toggle("is-lit",lit);
    stage.classList.toggle("is-dark",!lit);
    lamp.setAttribute("aria-pressed",String(lit));
    lamp.setAttribute("aria-label",lit?"Turn off the lamp and blur all projects":"Turn on the lamp and reveal all projects");
    label.textContent=lit?"TURN LIGHTS OFF":"TURN LIGHTS ON";
    status.textContent=lit?"All projects stay illuminated as you scroll.":"Tap the lamp to illuminate all seven projects.";
    grid.inert=!lit;
    if(lit)onViewportChange();
  }
  lamp.addEventListener("click",()=>{lit=!lit;render();});
  if(showAll)showAll.addEventListener("click",()=>{
    lit=true;
    render();
    stage.scrollIntoView({behavior:reduced.matches?"auto":"smooth",block:"start"});
  });
  window.addEventListener("scroll",onViewportChange,{passive:true});
  window.addEventListener("resize",onViewportChange,{passive:true});
  render();
})();
