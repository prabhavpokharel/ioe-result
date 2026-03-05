/**
 * helpers.js — Pure utility functions (no DOM access)
 */

/** Return CSS colour for a percentage value */
function pctColor(p) {
  if (p == null) return "var(--ink-3)";
  if (p >= 80) return "#3e5c4a";
  if (p >= 65) return "#2a5278";
  if (p >= 50) return "#7a5c1a";
  if (p >= 40) return "#b85440";
  return "#8a2c20";
}

/** Return CSS colour for a GPA value */
function gpaColor(g) {
  if (g >= 3.7) return "#3e5c4a";
  if (g >= 3.3) return "#2a5278";
  if (g >= 3.0) return "#7a5c1a";
  if (g >= 2.0) return "#b85440";
  return "#8a2c20";
}

/** GPA → letter grade */
function gpaLetter(g) {
  if (g >= 3.85) return "A";
  if (g >= 3.55) return "A−";
  if (g >= 3.15) return "B+";
  if (g >= 2.85) return "B";
  if (g >= 2.55) return "B−";
  if (g >= 2.15) return "C+";
  if (g >= 1.85) return "C";
  if (g >= 1.55) return "D+";
  if (g >= 1.15) return "D";
  return "F";
}

/** GPA → standing label */
function gpaLabel(g) {
  if (g >= 3.7) return "Excellent";
  if (g >= 3.3) return "Very Good";
  if (g >= 3.0) return "Good";
  if (g >= 2.0) return "Satisfactory";
  return "Needs Improvement";
}

/** Percentage value → division object */
function getDiv(pct) {
  for (const d of DIVISIONS) if (pct >= d.t) return d;
  return DIVISIONS[DIVISIONS.length - 1];
}

/** GPA value → standing object */
function getGpaSt(g) {
  for (const s of GPA_STANDINGS) if (g >= s.t) return s;
  return GPA_STANDINGS[GPA_STANDINGS.length - 1];
}

/** Build the HTML for an inline percentage cell (value + mini bar) */
function pctCell(pct) {
  if (pct == null)
    return `<span class="pn" style="color:var(--ink-3)">—</span>`;
  const c = pctColor(pct);
  return `<span class="pn" style="color:${c}">${pct.toFixed(1)}%</span>
<div class="pb"><div class="pbf" style="width:${Math.min(pct,100)}%;background:${c}"></div></div>`;
}

/** Build the HTML for an inline GPA cell (value + mini bar) */
function gpaCell(g) {
  if (g == null)
    return `<span class="pn" style="color:var(--ink-3)">—</span>`;
  const c = gpaColor(g);
  return `<span class="pn" style="color:${c}">${g.toFixed(2)}</span>
<div class="pb"><div class="pbf" style="width:${(g/4)*100}%;background:${c}"></div></div>`;
}

/** Difficulty label + colours for a needed percentage */
function projDifficultyOld(needed) {
  if (needed >= 80) return { label:"Very Hard", c:"#8a2c20", bg:"#fde8e4" };
  if (needed >= 65) return { label:"Hard",      c:"#b85440", bg:"#f5e0da" };
  if (needed >= 50) return { label:"Moderate",  c:"#7a5c1a", bg:"#f0e6d2" };
  return               { label:"Achievable", c:"#3e5c4a", bg:"#dce8e1" };
}

/** Difficulty label + colours for a needed GPA */
function projDifficultyGpa(needed) {
  if (needed >= 3.7) return { label:"Very Hard", c:"#8a2c20", bg:"#fde8e4" };
  if (needed >= 3.3) return { label:"Hard",      c:"#b85440", bg:"#f5e0da" };
  if (needed >= 3.0) return { label:"Moderate",  c:"#7a5c1a", bg:"#f0e6d2" };
  return                { label:"Achievable", c:"#3e5c4a", bg:"#dce8e1" };
}
