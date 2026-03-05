/**
 * old-system.js — BCE/BCT/BEI percentage-based calculator (batch 2079 & before)
 */

let oFac = "BCT";
let oMK  = {};   // { semIndex: marksObtained }

/* ── State ─────────────────────────────── */
function calcOldStats() {
  const p = OP[oFac];
  const s = p.s;
  let yS  = [0,0,0,0];   // marks sum per year
  let yFM = [0,0,0,0];   // full marks per year
  let yC  = [0,0,0,0];   // count of entered sems per year
  let filled = 0, tS = 0, tFM = 0;

  s.forEach((fm, i) => {
    const yr = SEM_YEAR[i] - 1;
    yFM[yr] += fm;
    const v = oMK[i];
    if (v !== undefined && !isNaN(v)) {
      yS[yr]  += v;
      yC[yr]  += 1;
      filled  += 1;
      tS      += v;
      tFM     += fm;
    }
  });

  const yP = yFM.map((fm, i) => yC[i] > 0 ? (yS[i] / fm) * 100 : null);
  let aggSum = 0, aggW = 0;
  yP.forEach((p, i) => { if (p != null) { aggSum += p * YEAR_WEIGHTS[i]; aggW += YEAR_WEIGHTS[i]; } });

  return {
    agg: aggW > 0 ? aggSum / aggW : null,
    filled,
    yP, yS, yFM, yC, tS, tFM
  };
}

/* ── DOM renders ────────────────────────── */
function renderOldFaculty() {
  const grid = document.getElementById("ofGrid");
  grid.innerHTML = "";
  Object.entries(OP).forEach(([k, p]) => {
    grid.appendChild(makeFacBtn(k, p, k === oFac, () => {
      oFac = k;
      oMK  = {};
      renderOldFaculty();
      renderOldTable();
      updateOld();
    }));
  });
}

function renderOldTable() {
  const p  = OP[oFac];
  document.getElementById("oTtl").textContent = p.l + " — " + p.f;
  const tb = document.getElementById("oTbody");
  tb.innerHTML = "";

  p.s.forEach((fm, i) => {
    const yr  = SEM_YEAR[i];
    const v   = oMK[i];
    const pct = (v !== undefined && !isNaN(v)) ? (v / fm) * 100 : null;
    const tr  = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="sc">
          <div class="sc-n">${i+1}</div>
          <div class="sc-name">${SEM_NAMES[i]} Semester</div>
        </div>
      </td>
      <td>
        <span class="yr-tag"
          style="background:${YEAR_BG[yr-1]};color:${YEAR_COLORS[yr-1]}">
          Year ${yr}
        </span>
      </td>
      <td>
        <div class="iw">
          <input type="number" class="mi" id="OI${i}"
            value="${v !== undefined && !isNaN(v) ? v : ''}"
            placeholder="—" min="0" max="${fm}" step="1"
            aria-label="Semester ${i+1} marks out of ${fm}"
            oninput="onOldInput(${i})">
          <span class="iof">/ ${fm}</span>
        </div>
      </td>
      <td>
        <span style="font-family:var(--ff-mono);font-size:.74rem;color:var(--ink-3)">${fm}</span>
      </td>
      <td id="oPC${i}">
        <div class="pv">${pctCell(pct)}</div>
      </td>`;
    tb.appendChild(tr);
  });
}

function onOldInput(i) {
  const inp = document.getElementById("OI" + i);
  const raw = inp.value.trim();
  const fm  = OP[oFac].s[i];

  if (raw === "") {
    delete oMK[i];
    inp.classList.remove("bad");
  } else {
    const v = parseFloat(raw);
    if (isNaN(v) || v < 0 || v > fm) {
      inp.classList.add("bad");
      oMK[i] = NaN;
    } else {
      inp.classList.remove("bad");
      oMK[i] = v;
    }
  }

  const pct = (oMK[i] !== undefined && !isNaN(oMK[i]))
    ? (oMK[i] / fm) * 100
    : null;
  const cell = document.getElementById("oPC" + i);
  if (cell) cell.innerHTML = `<div class="pv">${pctCell(pct)}</div>`;

  updateOld();
}

function updateOld() {
  const { agg, filled, yP, yS, yFM, yC, tS, tFM } = calcOldStats();

  // Dashboard numbers
  const ae  = document.getElementById("oAgg");
  const as2 = document.getElementById("oAggS");
  if (agg != null) {
    ae.textContent  = agg.toFixed(2) + "%";
    ae.style.color  = "var(--paper)";
    as2.textContent = getDiv(agg).l + " · weighted aggregate";
  } else {
    ae.textContent  = "—";
    ae.style.color  = "";
    as2.textContent = "enter marks to calculate";
  }

  document.getElementById("oSD").textContent = filled;

  const se = document.getElementById("oTS");
  const ss = document.getElementById("oTSS");
  if (filled > 0) {
    se.textContent = tS;
    ss.textContent = "out of " + tFM + " marks entered";
  } else {
    se.textContent = "—";
    ss.textContent = "marks entered";
  }

  renderOldYearCards(yP, yS, yFM);
  renderOldChart();
  renderOldStanding(agg, filled);
  renderOldProjection(agg, filled, yP, yS, yFM);

  if (window._appMode === "old") {
    refreshDial("old", { agg }, {});
  }
}

function renderOldYearCards(yP, yS, yFM) {
  const grid = document.getElementById("oYrG");
  grid.innerHTML = "";

  [0,1,2,3].forEach(i => {
    const p   = yP[i];
    const c   = YEAR_COLORS[i];
    const bg  = YEAR_BG[i];
    const w   = YEAR_WEIGHTS[i];
    const sem = ["Sem 1–2","Sem 3–4","Sem 5–6","Sem 7–8"][i];

    const card = document.createElement("div");
    card.className = "yrc";
    if (p != null) card.style.borderColor = c + "99";

    card.innerHTML = `
      <div class="yrl">Year ${i+1} · ${Math.round(w*100)}%</div>
      <div class="yrv" style="color:${p != null ? c : "var(--ink-3)"}">
        ${p != null ? p.toFixed(1)+"%" : "—"}
      </div>
      <div class="yrw">${sem}</div>
      ${p != null
        ? `<div class="yrc-contrib">Adds <strong style="color:${c}">${(p*w).toFixed(1)}%</strong> to final</div>`
        : `<div class="yrc-contrib" style="color:var(--ink-3)">not entered yet</div>`
      }
      <div class="yrc-bar">
        <div class="yrc-fill" style="width:${p != null ? Math.min(p,100) : 0}%;background:${c}"></div>
      </div>`;

    grid.appendChild(card);
  });
}

function renderOldChart() {
  const p  = OP[oFac];
  const ca = document.getElementById("oCA");

  // Remove old target line
  const ex = ca.querySelector(".tgt-line");
  if (ex) ex.remove();

  // 80% target line
  const tl  = document.createElement("div"); tl.className = "tgt-line";
  tl.style.cssText = "top:20%;border-color:rgba(92,125,106,.3)";
  const tll = document.createElement("div"); tll.className = "tgt-lbl";
  tll.style.cssText = "color:var(--sage-d);background:var(--sage-ll);font-family:var(--ff-mono);font-size:.56rem";
  tll.textContent   = "80%";
  tl.appendChild(tll);
  ca.appendChild(tl);

  const bars = document.getElementById("oBars");
  bars.innerHTML = "";

  p.s.forEach((fm, i) => {
    const v   = oMK[i];
    const pct = (v !== undefined && !isNaN(v)) ? v / fm * 100 : null;
    const yr  = SEM_YEAR[i] - 1;
    const col = YEAR_COLORS[yr];

    const grp = document.createElement("div"); grp.className = "bg";
    const h   = pct != null ? Math.max(Math.min(pct, 100), 1.5) : 0;

    const bar = document.createElement("div"); bar.className = "bar";
    bar.style.cssText = `height:${h}%;background:${pct != null ? col : "var(--paper-3)"};opacity:${pct != null ? 1 : .45}`;

    if (pct != null) {
      const tt = document.createElement("div"); tt.className = "bar-tt";
      tt.textContent = `Sem ${i+1}: ${pct.toFixed(1)}%`;
      bar.appendChild(tt);
    }

    const lbl = document.createElement("div"); lbl.className = "blbl";
    lbl.textContent = "S" + (i+1);

    const bc = document.createElement("div"); bc.className = "bc";
    bc.appendChild(bar);

    grp.appendChild(bc);
    grp.appendChild(lbl);
    bars.appendChild(grp);
  });
}

function renderOldStanding(agg, filled) {
  const card  = document.getElementById("oSC");
  const nm    = document.getElementById("oSN");
  const bar   = document.getElementById("oSB");
  const badge = document.getElementById("oSBg");
  const desc  = document.getElementById("oSD2");

  if (agg == null || filled === 0) {
    card.style.borderColor = "";
    nm.textContent   = "— Awaiting your marks";
    nm.style.color   = "var(--ink-3)";
    desc.textContent = "Enter semester marks above to see your division and standing.";
    bar.style.width  = "0%";
    bar.style.background = "var(--paper-3)";
    badge.textContent    = "—";
    badge.style.background  = "var(--paper-2)";
    badge.style.color       = "var(--ink-3)";
    badge.style.borderColor = "var(--paper-4)";
    return;
  }

  const d   = getDiv(agg);
  const rem = 8 - filled;
  const nxt = DIVISIONS.find(x => x.t > d.t && x.k !== "fail");

  let txt = `Your aggregate is ${agg.toFixed(2)}%.`;
  if (d.k === "dist" || d.k === "1st") {
    txt += " Keep going strong.";
  } else if (nxt) {
    txt += ` You need ${(nxt.t - agg).toFixed(2)}% more to reach ${nxt.l}.`;
  }
  if (rem > 0) txt += ` ${rem} semester${rem !== 1 ? "s" : ""} remaining.`;

  card.style.borderColor  = d.bc;
  nm.textContent          = d.l;
  nm.style.color          = d.c;
  desc.textContent        = txt;
  bar.style.width         = Math.min(agg, 100) + "%";
  bar.style.background    = d.bar;
  badge.textContent       = agg.toFixed(1) + "%";
  badge.style.background  = d.bg;
  badge.style.color       = d.c;
  badge.style.borderColor = d.bc;
}

function renderOldProjection(agg, filled, yP, yS, yFM) {
  const body = document.getElementById("oPB");

  if (filled === 0) {
    body.innerHTML = `<div class="proj-empty">
      <div class="proj-empty-icon">📋</div>
      <p class="proj-empty-txt">Enter at least one semester's marks to see your projections.</p>
    </div>`;
    return;
  }

  if (filled === 8) {
    body.innerHTML = `<div class="proj-ctx">
      All 8 semesters entered. Final aggregate: <strong>${agg != null ? agg.toFixed(2)+"%" : "—"}</strong>
      ${agg != null ? ". " + getDiv(agg).l + "." : ""}
    </div>`;
    return;
  }

  const p   = OP[oFac];
  const rem = 8 - filled;

  // Remaining full marks per year
  let rFM = [0,0,0,0];
  p.s.forEach((fm, i) => {
    if (oMK[i] === undefined || isNaN(oMK[i])) rFM[SEM_YEAR[i]-1] += fm;
  });

  // Contribution already locked in
  let doneCont = 0;
  yP.forEach((pp, i) => { if (pp != null) doneCont += pp * YEAR_WEIGHTS[i]; });

  // Remaining weight (proportional to remaining full marks)
  let remW = 0;
  [0,1,2,3].forEach(i => {
    const tFM = p.s.filter((_, j) => SEM_YEAR[j]-1 === i).reduce((a,b) => a+b, 0);
    if (tFM > 0) remW += (rFM[i] / tFM) * YEAR_WEIGHTS[i];
  });

  let html = `<div class="proj-ctx">
    ${filled} of 8 semesters entered. Current aggregate: <strong>${agg != null ? agg.toFixed(2)+"%" : "—"}</strong>.
    ${rem} semester${rem !== 1 ? "s" : ""} remaining.
    <em style="font-size:.68rem;color:var(--ink-3)"> Numbers below are the average needed across all remaining semesters.</em>
  </div><div class="proj-grid">`;

  DIVISIONS.slice(0,4).forEach(d => {
    if (agg != null && agg >= d.t) {
      html += `<div class="pjc" style="background:${d.bg};border-color:${d.bc}">
        <div class="pjc-top" style="background:${d.bar}"></div>
        <div class="pjc-label" style="color:${d.c}">${d.l}</div>
        <div class="pjc-num"  style="color:${d.c}">Secured ✓</div>
        <div class="pjc-desc">Already at this level with current marks.</div>
        <span class="pjc-diff" style="background:rgba(62,92,74,.12);color:#3e5c4a">Achieved</span>
      </div>`;
      return;
    }

    const needed = remW > 0 ? (d.t - doneCont) / remW : null;

    if (needed == null || needed > 100) {
      html += `<div class="pjc" style="opacity:.5">
        <div class="pjc-top" style="background:var(--paper-4)"></div>
        <div class="pjc-label" style="color:var(--ink-3)">${d.l}</div>
        <div class="pjc-num"  style="color:var(--ink-3)">&gt;100%</div>
        <div class="pjc-desc">Not achievable given current scores.</div>
        <span class="pjc-diff" style="background:var(--paper-3);color:var(--ink-3)">Not possible</span>
      </div>`;
      return;
    }

    const { label, c, bg } = projDifficultyOld(needed);
    html += `<div class="pjc" style="border-color:${d.bc}">
      <div class="pjc-top"   style="background:${d.bar}"></div>
      <div class="pjc-label" style="color:${d.c}">${d.l} (≥${d.t}%)</div>
      <div class="pjc-num"   style="color:${c}">${needed.toFixed(1)}%</div>
      <div class="pjc-desc">Average needed per remaining semester.</div>
      <span class="pjc-diff" style="background:${bg};color:${c}">${label}</span>
    </div>`;
  });

  html += "</div>";
  body.innerHTML = html;
}

function clearOld() {
  oMK = {};
  renderOldTable();
  updateOld();
}
