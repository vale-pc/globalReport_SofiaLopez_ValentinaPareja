/* ═══════════════════════════════════════════════════
   HypothesisTool — main.js
   Global Economics · Grade 11 · Term 3 · 2025-2026
   ═══════════════════════════════════════════════════ */

// ── TAB SWITCHING ──────────────────────────────────
function switchTab(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
}

// ── SLIDER / INPUT SYNC ────────────────────────────
function syncSlider(id) {
  const s = document.getElementById(id + '-s');
  const i = document.getElementById(id);
  if (s && i) { i.value = s.value; c8Update(); }
}
function syncInput(id) {
  const s = document.getElementById(id + '-s');
  const i = document.getElementById(id);
  if (s && i) s.value = i.value;
}

function c8ToggleMode() {
  const m = document.getElementById('c8-mode').value;
  document.getElementById('c8-mean-mode').style.display = m === 'mean' ? '' : 'none';
  document.getElementById('c8-prop-mode').style.display = m === 'prop' ? '' : 'none';
  c8Update();
}

// ── STATISTICS ─────────────────────────────────────
function erfinv(x) {
  let w = -Math.log((1 - x) * (1 + x)), p;
  if (w < 5) {
    w -= 2.5;
    p = 2.81022636e-8; p = 3.43273939e-7 + p * w; p = -3.5233877e-6 + p * w;
    p = -4.39150654e-6 + p * w; p = 0.00021858087 + p * w; p = -0.00125372503 + p * w;
    p = -0.00417768164 + p * w; p = 0.246640727 + p * w; p = 1.50140941 + p * w;
  } else {
    w = Math.sqrt(w) - 3;
    p = -0.000200214257; p = 0.000100950558 + p * w; p = 0.00134934322 + p * w;
    p = -0.00367342844 + p * w; p = 0.00573950773 + p * w; p = -0.0076224613 + p * w;
    p = 0.00943887047 + p * w; p = 1.00167406 + p * w; p = 2.83297682 + p * w;
  }
  return p * x;
}

function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741,
        a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function normCDF(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }
function normICDF(p) { return Math.SQRT2 * erfinv(2 * p - 1); }

function pFromZ(z, tail) {
  if (tail === 'left')  return normCDF(z);
  if (tail === 'right') return 1 - normCDF(z);
  return 2 * (1 - normCDF(Math.abs(z)));
}

function criticalValue(alpha, tail) {
  if (tail === 'two')   return normICDF(1 - alpha / 2);
  if (tail === 'right') return normICDF(1 - alpha);
  return normICDF(alpha);
}

// ── NORMAL CURVE DRAWING ───────────────────────────
function drawCurve(canvasId, z, pval, alpha, tail) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#141624';
  ctx.fillRect(0, 0, W, H);

  const pad = { l: 50, r: 50, t: 35, b: 50 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;
  const xRange = 4.5;

  const toX = v => (v + xRange) / (2 * xRange) * cw + pad.l;
  const norm = x => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  const maxY = norm(0);
  const toY  = v => pad.t + ch - v / maxY * ch * 0.85;

  const cv = criticalValue(alpha, tail);

  // ── shade critical / rejection region (indigo) ──
  const drawCritShade = (from, to) => {
    ctx.beginPath();
    ctx.moveTo(toX(from), toY(0));
    for (let xi = from; xi <= to; xi += 0.02) ctx.lineTo(toX(xi), toY(norm(xi)));
    ctx.lineTo(toX(to), toY(0));
    ctx.closePath();
    ctx.fillStyle = 'rgba(108,99,255,0.20)';
    ctx.fill();
  };
  if (tail === 'left')  drawCritShade(-xRange, Math.min(-cv, xRange));
  else if (tail === 'right') drawCritShade(Math.max(cv, -xRange), xRange);
  else { drawCritShade(-xRange, -cv); drawCritShade(cv, xRange); }

  // ── shade p-value region (red) ──
  const shadeP = (from, to) => {
    ctx.beginPath();
    ctx.moveTo(toX(Math.max(from, -xRange)), toY(0));
    for (let xi = Math.max(from, -xRange); xi <= Math.min(to, xRange); xi += 0.02)
      ctx.lineTo(toX(xi), toY(norm(xi)));
    ctx.lineTo(toX(Math.min(to, xRange)), toY(0));
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,101,132,0.55)';
    ctx.fill();
  };
  const az = Math.abs(z);
  if (tail === 'left')  shadeP(-xRange, z);
  else if (tail === 'right') shadeP(z, xRange);
  else { shadeP(-xRange, -az); shadeP(az, xRange); }

  // ── normal curve ──
  ctx.beginPath();
  ctx.moveTo(toX(-xRange), toY(norm(-xRange)));
  for (let xi = -xRange; xi <= xRange; xi += 0.02) ctx.lineTo(toX(xi), toY(norm(xi)));
  ctx.strokeStyle = '#6c63ff'; ctx.lineWidth = 2.5; ctx.stroke();

  // ── x-axis ──
  ctx.beginPath();
  ctx.moveTo(pad.l, toY(0)); ctx.lineTo(W - pad.r, toY(0));
  ctx.strokeStyle = '#2a2d4a'; ctx.lineWidth = 1.5; ctx.stroke();

  // ── axis tick labels ──
  ctx.fillStyle = '#7b7fa8';
  ctx.font = '11px DM Mono, monospace';
  ctx.textAlign = 'center';
  [-4, -3, -2, -1, 0, 1, 2, 3, 4].forEach(v => {
    ctx.fillText(v, toX(v), H - 14);
    ctx.beginPath(); ctx.moveTo(toX(v), toY(0)); ctx.lineTo(toX(v), toY(0) + 4);
    ctx.strokeStyle = '#2a2d4a'; ctx.lineWidth = 1; ctx.stroke();
  });

  // ── critical value dashed lines ──
  const drawVLine = (xv, col, label) => {
    const px = toX(xv);
    ctx.beginPath(); ctx.setLineDash([5, 4]);
    ctx.moveTo(px, pad.t); ctx.lineTo(px, toY(0));
    ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = col; ctx.textAlign = 'center';
    ctx.font = 'bold 11px DM Mono, monospace';
    ctx.fillText(label, px, pad.t - 10);
  };
  if (tail === 'left')  drawVLine(-cv, '#6c63ff', `z* = ${(-cv).toFixed(2)}`);
  else if (tail === 'right') drawVLine(cv, '#6c63ff', `z* = ${cv.toFixed(2)}`);
  else { drawVLine(-cv, '#6c63ff', `−${cv.toFixed(2)}`); drawVLine(cv, '#6c63ff', `+${cv.toFixed(2)}`); }

  // ── observed z line (gold) ──
  const zClipped = Math.max(-xRange + 0.1, Math.min(z, xRange - 0.1));
  ctx.beginPath(); ctx.moveTo(toX(zClipped), pad.t); ctx.lineTo(toX(zClipped), toY(0));
  ctx.strokeStyle = '#f5c842'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = '#f5c842'; ctx.textAlign = 'center';
  ctx.font = 'bold 12px DM Mono, monospace';
  ctx.fillText(`z = ${z.toFixed(3)}`, toX(zClipped), pad.t + 16);

  // ── p-value label ──
  ctx.fillStyle = '#ff6584'; ctx.font = 'bold 12px DM Mono, monospace'; ctx.textAlign = 'left';
  ctx.fillText(`p = ${pval < 0.0001 ? pval.toExponential(3) : pval.toFixed(4)}`, pad.l + 8, pad.t + 16);
}

// ── C8 UPDATE ──────────────────────────────────────
function c8Update() {
  const mode  = document.getElementById('c8-mode').value;
  const tail  = document.getElementById('c8-tail').value;
  const alpha = parseFloat(document.getElementById('c8-alpha').value) || 0.05;
  let z;

  if (mode === 'mean') {
    const mu0   = parseFloat(document.getElementById('c8-mu0').value)   || 0;
    const xbar  = parseFloat(document.getElementById('c8-xbar').value)  || 0;
    const sigma = parseFloat(document.getElementById('c8-sigma').value) || 1;
    const n     = parseInt(document.getElementById('c8-n').value)       || 1;
    z = (xbar - mu0) / (sigma / Math.sqrt(n));
  } else {
    const p0   = parseFloat(document.getElementById('c8-p0').value)   || 0.5;
    const phat = parseFloat(document.getElementById('c8-phat').value) || 0.5;
    const n    = parseInt(document.getElementById('c8-np').value)     || 100;
    z = (phat - p0) / Math.sqrt(p0 * (1 - p0) / n);
  }

  const pval   = pFromZ(z, tail);
  const cv     = criticalValue(alpha, tail);
  const reject = pval < alpha;

  document.getElementById('r-z').textContent    = z.toFixed(4);
  document.getElementById('r-pval').textContent = pval < 0.0001 ? pval.toExponential(3) : pval.toFixed(4);
  document.getElementById('r-pval').className   = 'stat-value ' + (reject ? 'red' : 'green');
  document.getElementById('r-cv').textContent   = tail === 'two' ? `±${cv.toFixed(3)}` : cv.toFixed(3);
  document.getElementById('r-alpha').textContent = alpha.toFixed(2);

  const db = document.getElementById('c8-decision');
  db.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  document.getElementById('c8-decision-text').textContent = reject
    ? `Reject H₀ — z = ${z.toFixed(3)} falls in the rejection region.`
    : `Fail to Reject H₀ — z = ${z.toFixed(3)} does not fall in the rejection region.`;

  document.getElementById('c8-conclusion').textContent = reject
    ? `At α = ${alpha}, there is sufficient statistical evidence to reject the null hypothesis. The observed sample statistic is significantly different from the benchmark value, suggesting a real effect in the population.`
    : `At α = ${alpha}, there is insufficient statistical evidence to reject the null hypothesis. The observed sample statistic is not significantly different from the benchmark value; we cannot conclude a significant effect.`;

  drawCurve('c8-canvas', z, pval, alpha, tail);
}

// ── C9 — CSV / XLSX MODE ───────────────────────────
let csvData = [];

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('upload-zone').classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (file) loadFile(file);
}

function loadCSV(e) {
  const f = e.target.files[0];
  if (f) loadFile(f);
}

/* Route to the right parser based on file extension */
function loadFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.ods')) {
    parseExcel(file);
  } else {
    parseCSVFile(file);
  }
}

/* ── Excel / XLSX parser (uses SheetJS) ── */
function parseExcel(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data  = new Uint8Array(ev.target.result);
      const wb    = XLSX.read(data, { type: 'array' });
      const ws    = wb.Sheets[wb.SheetNames[0]];          // first sheet
      const rows  = XLSX.utils.sheet_to_json(ws, { defval: '' });
      if (!rows.length) { alert('The Excel file appears to be empty.'); return; }
      applyData(rows, file.name);
    } catch (err) {
      alert('Could not read the Excel file: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

/* ── Plain CSV parser ── */
function parseCSVFile(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    const text    = ev.target.result;
    const lines   = text.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows    = lines.slice(1)
      .map(l => {
        const vals = l.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row  = {};
        headers.forEach((h, i) => row[h] = vals[i] ?? '');
        return row;
      })
      .filter(r => Object.values(r).some(v => v !== ''));
    applyData(rows, file.name);
  };
  reader.readAsText(file);
}

/* ── Shared: populate UI after either parser ── */
function applyData(rows, fileName) {
  csvData = rows;
  const headers = Object.keys(rows[0]);

  const gs = document.getElementById('col-group');
  const vs = document.getElementById('col-value');
  [gs, vs].forEach(s => { s.innerHTML = ''; });
  headers.forEach(h => {
    gs.innerHTML += `<option value="${h}">${h}</option>`;
    vs.innerHTML += `<option value="${h}">${h}</option>`;
  });
  if (headers.length > 1) vs.value = headers[1];

  c9Configure();
  document.getElementById('c9-config').style.display = 'block';
  document.getElementById('upload-zone').innerHTML =
    `<span class="icon">✅</span><strong>${fileName} loaded — ${csvData.length} rows</strong><p>Change file: click here again</p>`;
}

function c9Configure() {
  const gCol = document.getElementById('col-group').value;
  const groups = [...new Set(csvData.map(r => r[gCol]).filter(v => v !== undefined && v !== ''))];
  const bs = document.getElementById('col-bench');
  const ts = document.getElementById('col-test');
  bs.innerHTML = ''; ts.innerHTML = '';
  groups.forEach(g => {
    bs.innerHTML += `<option value="${g}">${g}</option>`;
    ts.innerHTML += `<option value="${g}">${g}</option>`;
  });
  if (groups.length > 1) ts.value = groups[1];
}

function c9RunTest() {
  const gCol  = document.getElementById('col-group').value;
  const vCol  = document.getElementById('col-value').value;
  const bench = document.getElementById('col-bench').value;
  const test  = document.getElementById('col-test').value;
  const tail  = document.getElementById('c9-tail').value;
  const alpha = parseFloat(document.getElementById('c9-alpha').value) || 0.05;

  const gA = csvData.filter(r => r[gCol] === bench).map(r => parseFloat(r[vCol])).filter(v => !isNaN(v));
  const gB = csvData.filter(r => r[gCol] === test ).map(r => parseFloat(r[vCol])).filter(v => !isNaN(v));

  if (gA.length < 2 || gB.length < 2) {
    alert('Not enough data in one or both groups. Check your column selection.');
    return;
  }

  const mean     = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr => { const m = mean(arr); return arr.reduce((a, b) => a + (b - m) ** 2, 0) / (arr.length - 1); };

  const mA = mean(gA), mB = mean(gB);
  const vA = variance(gA), vB = variance(gB);
  const nA = gA.length, nB = gB.length;
  const se = Math.sqrt(vA / nA + vB / nB);
  const z  = (mB - mA) / se;
  const pval   = pFromZ(z, tail);
  const cv     = criticalValue(alpha, tail);
  const reject = pval < alpha;

  // Summary table
  const st = document.getElementById('c9-summary-table');
  st.innerHTML = `
    <tr><th>Group</th><th>n</th><th>Mean</th><th>Std Dev</th><th>Variance</th></tr>
    <tr><td>${bench}</td><td>${nA}</td><td>${mA.toFixed(4)}</td><td>${Math.sqrt(vA).toFixed(4)}</td><td>${vA.toFixed(4)}</td></tr>
    <tr><td>${test}</td> <td>${nB}</td><td>${mB.toFixed(4)}</td><td>${Math.sqrt(vB).toFixed(4)}</td><td>${vB.toFixed(4)}</td></tr>`;
  document.getElementById('c9-summary-card').style.display = 'block';

  document.getElementById('c9-r-z').textContent    = z.toFixed(4);
  document.getElementById('c9-r-pval').textContent = pval < 0.0001 ? pval.toExponential(3) : pval.toFixed(4);
  document.getElementById('c9-r-pval').className   = 'stat-value ' + (reject ? 'red' : 'green');
  document.getElementById('c9-r-cv').textContent   = tail === 'two' ? `±${cv.toFixed(3)}` : cv.toFixed(3);
  document.getElementById('c9-r-dec').textContent  = reject ? 'Reject H₀' : 'Fail to Reject H₀';
  document.getElementById('c9-r-dec').className    = 'stat-value ' + (reject ? 'red' : 'green');

  const db = document.getElementById('c9-decision');
  db.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  document.getElementById('c9-decision-text').textContent = reject
    ? `Reject H₀ — Significant difference between "${bench}" and "${test}" (z = ${z.toFixed(3)}, p = ${pval.toFixed(4)}).`
    : `Fail to Reject H₀ — No significant difference between "${bench}" and "${test}" (z = ${z.toFixed(3)}, p = ${pval.toFixed(4)}).`;

  document.getElementById('c9-conclusion').textContent = reject
    ? `At α = ${alpha}, sufficient evidence exists to conclude that the mean of "${test}" is significantly different from the mean of "${bench}". The p-value (${pval.toFixed(4)}) is below the significance level.`
    : `At α = ${alpha}, there is insufficient evidence to conclude a significant difference between "${bench}" and "${test}". The p-value (${pval.toFixed(4)}) exceeds the significance level.`;

  document.getElementById('c9-result-card').style.display = 'block';
  drawCurve('c9-canvas', z, pval, alpha, tail);
}

// ── PDF DOWNLOAD ───────────────────────────────────
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const el  = document.getElementById('report-content');
  const btn = document.getElementById('pdf-btn');
  btn.textContent = '⏳ Generating PDF…';
  btn.disabled = true;

  try {
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW  = pageW - 20;
    const imgH  = imgW * (canvas.height / canvas.width);
    let offsetY = 0;

    while (offsetY < imgH) {
      const sliceH  = Math.min(pageH - 20, imgH - offsetY);
      const srcY    = (offsetY / imgH) * canvas.height;
      const srcH    = (sliceH / imgH) * canvas.height;
      const slice   = document.createElement('canvas');
      slice.width   = canvas.width;
      slice.height  = srcH;
      slice.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
      if (offsetY > 0) pdf.addPage();
      pdf.addImage(slice.toDataURL('image/png'), 'PNG', 10, 10, imgW, sliceH);
      offsetY += sliceH;
    }

    pdf.save('C10_Hypothesis_Testing_Report.pdf');
  } catch (e) {
    alert('PDF generation error: ' + e.message);
  }

  btn.textContent = '⬇ Download Report as PDF';
  btn.disabled = false;
}

// ── INIT ──────────────────────────────────────────
window.addEventListener('load', () => { c8Update(); });
