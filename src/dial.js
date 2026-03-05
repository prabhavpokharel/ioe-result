/**
 * dial.js — Arc gauge / dial in the hero section
 *
 * SVG arc: r=50, stroke-dasharray="235 314"
 * At 0%  → dashoffset = 235 (arc invisible)
 * At 100% → dashoffset = 235 - (235 * 0.88) ≈ 28 (arc nearly full)
 * 0.88 factor leaves a small gap so the ends never touch.
 */

const DIAL_ARC = 235; // px, matches SVG stroke-dasharray

function setDial(val, max, colorHex, caption, currentMode) {
  const arc = document.getElementById("dialArc");
  const num = document.getElementById("dialNum");
  const lbl = document.getElementById("dialLbl");
  const cap = document.getElementById("dialCaption");

  lbl.textContent = currentMode === "old" ? "aggregate" : "cgpa";

  if (val == null) {
    arc.style.strokeDashoffset = DIAL_ARC;
    arc.style.stroke = "#c8c4bc";
    num.textContent  = "—";
    cap.textContent  = "Enter marks to see your result";
    return;
  }

  const pct = Math.min(Math.max(val / max, 0), 1);
  arc.style.strokeDashoffset = DIAL_ARC - pct * DIAL_ARC * 0.88;
  arc.style.stroke  = colorHex || "#5c7d6a";
  num.textContent   = currentMode === "old"
    ? val.toFixed(1) + "%"
    : val.toFixed(2);
  cap.textContent   = caption || "";
}

function refreshDial(mode, oldState, newState) {
  if (mode === "old") {
    const { agg } = oldState;
    if (agg != null) {
      const d = getDiv(agg);
      setDial(agg, 100, d.bar, d.l, mode);
    } else {
      setDial(null, 100, null, null, mode);
    }
  } else {
    const { cgpa } = newState;
    if (cgpa != null) {
      const s = getGpaSt(cgpa);
      setDial(cgpa, 4, s.bar, s.l, mode);
    } else {
      setDial(null, 4, null, null, mode);
    }
  }
}
