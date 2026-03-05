/**
 * ui.js — Shared UI components and mode switching
 */

window._appMode = "old";

/* ── Pill mode-switcher ─────────────────── */
function initPill() {
  posSlider(document.getElementById("btnOld"));
  window.addEventListener("resize", () => {
    posSlider(
      window._appMode === "old"
        ? document.getElementById("btnOld")
        : document.getElementById("btnNew")
    );
  });
}

function posSlider(btn) {
  const pill   = document.getElementById("pill");
  const slider = document.getElementById("pillSlider");
  const pr     = pill.getBoundingClientRect();
  const br     = btn.getBoundingClientRect();
  slider.style.transform = `translateX(${br.left - pr.left - 3}px)`;
  slider.style.width     = br.width + "px";
}

function switchMode(m) {
  window._appMode = m;
  const bO = document.getElementById("btnOld");
  const bN = document.getElementById("btnNew");
  bO.classList.toggle("on", m === "old");
  bN.classList.toggle("on", m === "new");
  posSlider(m === "old" ? bO : bN);

  document.getElementById("panOld").classList.toggle("on", m === "old");
  document.getElementById("panNew").classList.toggle("on", m === "new");

  document.getElementById("sceneLabel").textContent = m === "old"
    ? "Batch 2079 & Before · Percentage System"
    : "Batch 2080+ · Credit-based GPA System";

  // Refresh dial for whichever panel is now visible
  if (m === "old") {
    const { agg } = calcOldStats();
    refreshDial("old", { agg }, {});
  } else {
    const { cgpa } = calcNewStats();
    refreshDial("new", {}, { cgpa });
  }
}

/* ── Faculty button factory ─────────────── */
function makeFacBtn(k, p, isCurrent, onClick) {
  const btn = document.createElement("button");
  btn.className = "fac-btn" + (isCurrent ? " on" : "");
  btn.setAttribute("aria-pressed", isCurrent ? "true" : "false");
  btn.innerHTML = `
    <div class="fac-code">${p.l}</div>
    <div class="fac-label">${p.f}</div>
    <div class="fac-tick" aria-hidden="true">
      <svg viewBox="0 0 10 10">
        <polyline points="1.5,5 4,8 8.5,2"/>
      </svg>
    </div>`;
  btn.onclick = onClick;
  return btn;
}
