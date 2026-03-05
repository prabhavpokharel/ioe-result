/**
 * new-system.js — All 12 BE/B.Arch GPA-based calculator (batch 2080+)
 */

let nFac = "BCT";
let nMK  = {};   // { semIndex: gpa }

/* ── State ─────────────────────────────── */
function calcNewStats() {
  const total = nSemCount();
  let sum = 0, cnt = 0, hi = null, hiI = -1;

  for (let i = 0; i < total; i++) {
    const v = nMK[i];
    if (v !== undefined && !isNaN(v)) {
      sum += v;
      cnt += 1;
      if (hi == null || v > hi) { hi = v; hiI = i; }
    }
  }

  return {
    cgpa:   cnt > 0 ? sum / cnt : null,
    filled: cnt,
    hi, hiI, total
  };
}

function nSemCount() {
  return nFac === "BAR" ? 10 : 8;
}

/* ── DOM renders ────────────────────────── */
function renderNewFaculty() {
  const grid = document.getElementById("nfGrid");
  grid.innerHTML = "";
  Object.entries(NP).forEach(([k, p]) => {
    grid.appendChild(makeFacBtn(k, p, k === nFac, () => {
      nFac = k;
      nMK  = {};
      renderNewFaculty();
      renderNewTable();
      updateNew();
    }));
  });
}

function renderNewTable() {
  const p     = NP[nFac];
  const total = nSemCount();
  document.getElementById("nTtl").textContent   = p.l + " — " + p.f;
  document.getElementById("nSDS").textContent   = "of " + total + " semesters";

  const tb = document.getElementById("nTbody");
  tb.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const yr  = nFac === "BAR" ? Math.ceil((i+1)/2) : SEM_YEAR[Math.min(i,7)];
    const v   = nMK[i];
    const gpa = (v !== undefined && !isNaN(v)) ? v : null;
    const tr  = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <div class="sc">
          <div class="sc-n">${i+1}</div>
          <div class="sc-name">${SEM_NAMES[i] || ("Sem " + (i+1))} Semester</div>
        </div>
      </td>
      <td>
        <span class="yr-tag"
          style="background:${YEAR_BG[Math.min(yr-1,3)]};color:${YEAR_COLORS[Math.min(yr-1,3)]}">
          Year ${yr}
        </span>
      </td>
      <td>
        <div class="iw">
          <input type="number" class="mi" id="NI${i}"
            value="${gpa != null ? gpa : ''}"
            placeholder="—" min="0" max="4.0" step="0.01"
            aria-label="Semester ${i+1} GPA out of 4.0"
            oninput="onNewInput(${i})">
          <span class="iof">/ 4.0</span>
        </div>
      </td>
      <td>
        <span style="font-family:var(--ff-mono);font-size:.76rem;color:${gpa != null ? gpaColor(gpa) : "var(--ink-3)"}" id="NGr${i}">
          ${gpa != null ? gpaLetter(gpa) : "—"}
        </span>
      </td>
      <td id="nPC${i}">
        <div class="pv">${gpaCell(gpa)}</div>
      </td>`;

    tb.appendChild(tr);
  }
}

function onNewInput(i) {
  const inp = document.getElementById("NI" + i);
  const raw = inp.value.trim();

  if (raw === "") {
    delete nMK[i];
    inp.classList.remove("bad");
  } else {
    const v = parseFloat(raw);
    if (isNaN(v) || v < 0 || v > 4.0) {
      inp.classList.add("bad");
      nMK[i] = NaN;
    } else {
      inp.classList.remove("bad");
      nMK[i] = v;
    }
  }

  const gpa  = (nMK[i] !== undefined && !isNaN(nMK[i])) ? nMK[i] : null;
  const gr   = document.getElementById("NGr" + i);
  if (gr) {
    gr.textContent = gpa != null ? gpaLetter(gpa) : "—";
    gr.style.color = gpa != null ? gpaColor(gpa)  : "var(--ink-3)";
  }
  const cell = document.getElementById("nPC" + i);
  if (cell) cell.innerHTML = `<div class="pv">${gpaCell(gpa)}</div>`;

  updateNew();
}

function updateNew() {
  const { cgpa, filled, hi, hiI, total } = calcNewStats();

  const ce  = document.getElementById("nCG");
  const cs  = document.getElementById("nCGS");
  if (cgpa != null) {
    ce.textContent  = cgpa.toFixed(2);
    ce.style.color  = "var(--paper)";
    cs.textContent  = gpaLabel(cgpa) + " · out of 4.0";
  } else {
    ce.textContent  = "—";
    ce.style.color  = "";
    cs.textContent  = "enter GPAs to calculate";
  }

  document.getElementById("nSD").textContent = filled;

  const be = document.getElementById("nBest");
  const bs = document.getElementById("nBestS");
  if (hi != null) {
    be.textContent = hi.toFixed(2);
    bs.textContent = "Semester " + (hiI + 1);
  } else {
    be.textContent = "—";
    bs.textContent = "highest GPA";
  }

  renderNewChart(total);
  renderNewStanding(cgpa, filled, total);
  renderNewProjection(cgpa, filled, total);

  if (window._appMode === "new") {
    refreshDial("new", {}, { cgpa });
  }
}

function renderNewChart(total) {
  const ca = document.getElementById("nCA");
  const ex = ca.querySelector(".tgt-line");
  if (ex) ex.remove();

  // 3.7 target line (Excellent threshold)
  const tl  = document.createElement("div"); tl.className = "tgt-line";
  tl.style.cssText = `top:${100 - (3.7/4)*100}%;border-color:rgba(106,94,140,.3)`;
  const tll = document.createElement("div"); tll.className = "tgt-lbl";
  tll.style.cssText = "color:var(--mist);background:var(--mist-ll);font-family:var(--ff-mono);font-size:.56rem";
  tll.textContent = "3.7";
  tl.appendChild(tll);
  ca.appendChild(tl);

  const bars = document.getElementById("nBars");
  bars.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const v   = nMK[i];
    const gpa = (v !== undefined && !isNaN(v)) ? v : null;
    const yr  = nFac === "BAR" ? Math.ceil((i+1)/2) : SEM_YEAR[Math.min(i,7)];
    const col = YEAR_COLORS[Math.min(yr-1, 3)];

    const grp = document.createElement("div"); grp.className = "bg";
    const h   = gpa != null ? (gpa / 4) * 100 : 0;

    const bar = document.createElement("div"); bar.className = "bar";
    bar.style.cssText = `height:${Math.max(h,.5)}%;background:${gpa != null ? col : "var(--paper-3)"};opacity:${gpa != null ? 1 : .35}`;

    if (gpa != null) {
      const tt = document.createElement("div"); tt.className = "bar-tt";
      tt.textContent = `S${i+1}: ${gpa.toFixed(2)} GPA`;
      bar.appendChild(tt);
    }

    const lbl = document.createElement("div"); lbl.className = "blbl";
    lbl.textContent = "S" + (i+1);

    const bc = document.createElement("div"); bc.className = "bc";
    bc.appendChild(bar);

    grp.appendChild(bc);
    grp.appendChild(lbl);
    bars.appendChild(grp);
  }
}

function renderNewStanding(cgpa, filled, total) {
  const card  = document.getElementById("nSC");
  const nm    = document.getElementById("nSN");
  const bar   = document.getElementById("nSB");
  const badge = document.getElementById("nSBg");
  const desc  = document.getElementById("nSD2");

  if (cgpa == null || filled === 0) {
    card.style.borderColor  = "";
    nm.textContent          = "— Awaiting your GPAs";
    nm.style.color          = "var(--ink-3)";
    desc.textContent        = "Enter semester GPAs above to see your standing.";
    bar.style.width         = "0%";
    bar.style.background    = "var(--paper-3)";
    badge.textContent       = "—";
    badge.style.background  = "var(--paper-2)";
    badge.style.color       = "var(--ink-3)";
    badge.style.borderColor = "var(--paper-4)";
    return;
  }

  const st  = getGpaSt(cgpa);
  const rem = total - filled;
  const nxt = GPA_STANDINGS.find(x => x.t > st.t);

  let txt = `Your CGPA is ${cgpa.toFixed(2)}.`;
  if (st.k === "exc") {
    txt += " Exceptional performance.";
  } else if (nxt) {
    txt += ` You need ${(nxt.t - cgpa).toFixed(2)} more to reach ${nxt.l}.`;
  }
  if (rem > 0) txt += ` ${rem} semester${rem !== 1 ? "s" : ""} remaining.`;

  card.style.borderColor  = st.bc;
  nm.textContent          = st.l;
  nm.style.color          = st.c;
  desc.textContent        = txt;
  bar.style.width         = (cgpa / 4) * 100 + "%";
  bar.style.background    = st.bar;
  badge.textContent       = cgpa.toFixed(2) + " GPA";
  badge.style.background  = st.bg;
  badge.style.color       = st.c;
  badge.style.borderColor = st.bc;
}

function renderNewProjection(cgpa, filled, total) {
  const body = document.getElementById("nPB");

  if (filled === 0) {
    body.innerHTML = `<div class="proj-empty">
      <div class="proj-empty-icon">📋</div>
      <p class="proj-empty-txt">Enter at least one semester GPA to see projections.</p>
    </div>`;
    return;
  }

  const rem = total - filled;

  if (rem === 0) {
    body.innerHTML = `<div class="proj-ctx">
      All ${total} semesters entered. Final CGPA: <strong>${cgpa != null ? cgpa.toFixed(2) : "—"}</strong>
      ${cgpa != null ? ". " + gpaLabel(cgpa) + "." : ""}
    </div>`;
    return;
  }

  let sumDone = 0;
  for (let i = 0; i < total; i++) {
    const v = nMK[i];
    if (v !== undefined && !isNaN(v)) sumDone += v;
  }

  let html = `<div class="proj-ctx">
    ${filled} of ${total} semesters entered. CGPA: <strong>${cgpa != null ? cgpa.toFixed(2) : "—"}</strong>.
    ${rem} semester${rem !== 1 ? "s" : ""} remaining.
  </div><div class="proj-grid">`;

  GPA_STANDINGS.slice(0,4).forEach(st => {
    if (cgpa != null && cgpa >= st.t) {
      html += `<div class="pjc" style="background:${st.bg};border-color:${st.bc}">
        <div class="pjc-top" style="background:${st.bar}"></div>
        <div class="pjc-label" style="color:${st.c}">${st.l}</div>
        <div class="pjc-num"  style="color:${st.c}">Secured ✓</div>
        <div class="pjc-desc">Already at this level.</div>
        <span class="pjc-diff" style="background:rgba(62,92,74,.12);color:#3e5c4a">Achieved</span>
      </div>`;
      return;
    }

    const needed = rem > 0 ? (st.t * total - sumDone) / rem : null;

    if (needed == null || needed > 4.0) {
      html += `<div class="pjc" style="opacity:.5">
        <div class="pjc-top" style="background:var(--paper-4)"></div>
        <div class="pjc-label" style="color:var(--ink-3)">${st.l}</div>
        <div class="pjc-num"  style="color:var(--ink-3)">&gt;4.0</div>
        <div class="pjc-desc">Not achievable given current scores.</div>
        <span class="pjc-diff" style="background:var(--paper-3);color:var(--ink-3)">Not possible</span>
      </div>`;
      return;
    }

    const { label, c, bg } = projDifficultyGpa(needed);
    html += `<div class="pjc" style="border-color:${st.bc}">
      <div class="pjc-top"   style="background:${st.bar}"></div>
      <div class="pjc-label" style="color:${st.c}">${st.l} (≥${st.t})</div>
      <div class="pjc-num"   style="color:${c}">${needed.toFixed(2)}</div>
      <div class="pjc-desc">Average GPA per remaining semester.</div>
      <span class="pjc-diff" style="background:${bg};color:${c}">${label}</span>
    </div>`;
  });

  html += "</div>";
  body.innerHTML = html;
}

function clearNew() {
  nMK = {};
  renderNewTable();
  updateNew();
}
