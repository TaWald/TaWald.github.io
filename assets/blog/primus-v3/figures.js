(function () {
  "use strict";
  const EX = {"nnunet":{"ACDC":[92.4292,90.2372,91.9533,91.4384,91.7199],"AMOS22":[88.7547,88.7245,88.0421,89.2045,88.4733],"KiTS23":[86.2191,86.4082,85.7021,88.668,83.1678],"LiTS":[82.4819,77.4885,81.0708,83.1386,75.4599],"SST3":[90.2465,89.4566,92.0265,89.4762,90.1564],"MAMA":[78.4079,77.0491,79.1607,79.527,77.469],"SBM":[68.5152,66.568,65.4433,64.811,67.2612],"Atlas22":[62.3129,63.3399,64.0398,60.7327,65.1357],"WORD":[82.7524,81.2208,82.3634,86.2904,82.9285]},"resenc":{"ACDC":[93.0526,92.1076,92.6045,92.7554,92.6761],"AMOS22":[89.6512,89.6694,88.7349,90.2048,88.9411],"KiTS23":[89.1616,88.8212,87.9735,89.3893,86.0518],"LiTS":[82.8851,79.2992,83.038,83.7099,78.747],"SST3":[90.3191,89.0905,92.509,89.8569,89.6325],"MAMA":[79.68,76.7844,80.8451,78.8173,78.8782],"SBM":[70.9691,62.2443,63.0007,64.5548,59.2241],"Atlas22":[62.4554,64.1058,64.1687,60.692,64.1534],"WORD":[85.7306,83.1626,85.8372,87.594,86.6016]},"v2":{"ACDC":[92.8162,92.5962,92.4146,92.5495,91.9377],"AMOS22":[89.3265,89.0833,88.6018,89.7102,88.4219],"KiTS23":[89.3587,88.9636,86.7758,89.4481,85.5225],"LiTS":[83.6243,78.2633,81.5108,84.5303,78.1173],"SST3":[88.7526,87.5051,91.5964,87.5859,88.0184],"MAMA":[80.0061,77.1986,82.2003,79.1835,79.1733],"SBM":[71.426,64.5724,62.7639,67.6861,64.6298],"Atlas22":[63.4096,63.9324,63.0144,60.6701,63.8841],"WORD":[84.9596,81.1778,83.4057,86.2887,84.0809]},"v2c":{"ACDC":[93.1657,92.6472,92.4475,92.8742,91.7424],"AMOS22":[89.3363,89.3461,88.678,89.8879,89.1828],"KiTS23":[89.1241,89.0256,87.4422,89.0055,86.531],"LiTS":[83.8363,80.4334,82.511,83.901,78.7856],"SST3":[89.2894,88.2096,91.8382,88.4708,88.3843],"MAMA":[80.4931,77.1644,82.7238,79.1479,78.9497],"SBM":[67.7084,60.3023,59.5444,63.9424,63.0126],"Atlas22":[63.6343,65.7292,64.1511,61.1764,64.9543],"WORD":[85.2211,82.0683,83.5236,87.0314,84.8953]},"v3c":{"ACDC":[93.307,92.6994,92.6916,92.78,92.2538],"AMOS22":[89.4138,89.5554,88.8275,90.0723,88.9632],"KiTS23":[89.1985,89.8434,87.6298,89.7529,86.326],"LiTS":[83.9974,80.6039,82.6061,85.2233,77.713],"SST3":[89.3989,88.5141,92.1587,88.9387,88.7934],"MAMA":[81.3091,78.9173,84.1569,79.5255,79.8317],"SBM":[71.0416,60.2978,62.6426,64.8315,63.019],"Atlas22":[63.8073,65.5657,64.8664,60.3158,66.0042],"WORD":[85.5647,82.8188,84.7903,87.242,84.8534]}};
  const NS = "http://www.w3.org/2000/svg";
  const tip = document.getElementById("pv-tip");
  const STYLE_KEYS = new Set(["fill", "stroke", "opacity", "fill-opacity", "stroke-opacity", "font-size", "font-weight", "font-family", "letter-spacing"]);

  // ---------- helpers ----------
  function s(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v === undefined || v === null) continue;
      if (k === "text") e.textContent = v;
      else if (STYLE_KEYS.has(k)) e.style.setProperty(k, v);
      else e.setAttribute(k, v);
    }
    if (parent) parent.appendChild(e);
    return e;
  }
  function svgRoot(el, w, h, label) {
    const sv = s("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": label || "" });
    el.appendChild(sv);
    return sv;
  }
  const f2 = (v) => v.toFixed(2);
  const fint = (v) => Math.round(v).toLocaleString("en-US");
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  function moveTip(ev) {
    const pad = 14;
    const r = tip.getBoundingClientRect();
    let x = ev.clientX + pad, y = ev.clientY + pad;
    if (x + r.width > window.innerWidth - 8) x = ev.clientX - r.width - pad;
    if (y + r.height > window.innerHeight - 8) y = ev.clientY - r.height - pad;
    tip.style.left = Math.max(8, x) + "px";
    tip.style.top = Math.max(8, y) + "px";
  }
  function bindTip(el, html) {
    el.style.cursor = "default";
    el.addEventListener("pointerenter", (ev) => { tip.innerHTML = typeof html === "function" ? html() : html; tip.classList.add("on"); moveTip(ev); });
    el.addEventListener("pointermove", moveTip);
    el.addEventListener("pointerleave", () => tip.classList.remove("on"));
  }
  // Returns a harmless stand-in when an element was removed from the post, so one missing table or figure
  // does not stop everything after it from rendering.
  const elOrStub = (id) => document.getElementById(id) || { innerHTML: "", textContent: "" };
  function tipRows(title, pairs) {
    return `<b>${esc(title)}</b>` + pairs.map(([k, v]) => `<div class="pv-tip-row"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join("");
  }
  // redraw on width change only
  function mount(id, draw) {
    const el = document.getElementById(id);
    if (!el) return () => {};
    let lastW = -1;
    const render = (force) => {
      const w = Math.round(el.clientWidth);
      if (!force && w === lastW) return;
      lastW = w;
      el.innerHTML = "";
      draw(el, w);
    };
    if ("ResizeObserver" in window) new ResizeObserver(() => render(false)).observe(el);
    else window.addEventListener("resize", () => render(false));
    render(true);
    return () => render(true);
  }
  function segmented(id, options, value, onChange) {
    const g = document.getElementById(id);
    if (!g) return;
    g.innerHTML = "";
    options.forEach(([val, label]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.setAttribute("aria-pressed", String(val === value));
      b.addEventListener("click", () => {
        g.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        onChange(val);
      });
      g.appendChild(b);
    });
  }
  function xAxis(sv, x, ticks, y0, y1, fmt) {
    ticks.forEach((t) => {
      s("line", { x1: x(t), x2: x(t), y1: y0, y2: y1, stroke: "var(--pv-grid)", "stroke-width": 1 }, sv);
      s("text", { x: x(t), y: y1 + 15, "text-anchor": "middle", fill: "var(--pv-muted)", "font-size": "11px", text: fmt ? fmt(t) : t }, sv);
    });
  }

  // ---------- data ----------
  const DS9 = ["ACDC", "AMOS22", "KiTS23", "LiTS", "SST3", "MAMA", "SBM", "Atlas22", "WORD"];
  const DS9_LABEL = { MAMA: "MAMA-MIA", Atlas22: "ATLAS22" };
  const DEV = ["ACDC", "AMOS22", "KiTS23", "LiTS"];
  const PUB = [
    { n: "UNETR", g: "hyb", p: 93.4, v: [90.41, 62.93, 76.33, 70.91, 86.73, 74.27, 49.87, 54.15, 70.87], a: 70.72 },
    { n: "SwinUNETR", g: "hyb", p: 62.2, v: [91.11, 80.88, 75.07, 73.27, 88.6, 75.55, 61.96, 60.56, 78.99], a: 76.22 },
    { n: "nnFormer", g: "hyb", p: 37.4, v: [92.35, 81.35, 75.72, 77.02, 88.62, 68.71, 64.37, 60.61, 82.53], a: 76.81 },
    { n: "UNETR++", g: "hyb", p: 43.0, v: [92.58, 84.82, 82.42, 77.69, 89.5, 77.16, 64.33, 61.39, 77.72], a: 78.62 },
    { n: "SwinUNETR-v2", g: "hyb", p: 72.8, v: [91.94, 86.17, 83.99, 77.18, 88.72, 75.84, 60.8, 61.1, 82.2], a: 78.66 },
    { n: "CoTr", g: "hyb", p: 41.9, v: [90.5, 87.93, 84.63, 78.44, 89.6, 76.95, 59.96, 62.14, 83.11], a: 79.25 },
    { n: "nnU-Net", g: "cnn", p: 31.2, v: [91.34, 88.61, 85.99, 79.29, 90.27, 78.32, 66.52, 63.11, 83.11], a: 80.73 },
    { n: "nnU-Net ResEnc-L", g: "cnn", p: 102.4, v: [92.54, 89.39, 88.06, 81.2, 90.28, 79.0, 64.0, 63.12, 85.79], a: 81.48 },
    { n: "MedNeXt-L", g: "cnn", p: 61.8, v: [92.55, 89.58, 88.2, 81.57, 89.93, 79.42, 65.85, 63.03, 85.37], a: 81.72 },
    { n: "Primus-S", g: "v1", p: 23.9, v: [91.82, 87.47, 85.87, 78.97, 87.83, 77.14, 56.71, 60.21, 82.84], a: 78.76 },
    { n: "Primus-B", g: "v1", p: 93.2, v: [92.07, 88.08, 86.37, 79.26, 88.33, 76.17, 57.62, 60.8, 83.01], a: 79.08 },
    { n: "Primus-M", g: "v1", p: 146.6, v: [92.26, 88.18, 86.38, 79.52, 88.31, 76.39, 57.63, 60.1, 82.98], a: 79.08 },
    { n: "PrimusV2-S", g: "v2", p: 24.6, v: [92.37, 88.95, 87.68, 80.61, 88.69, 79.55, 66.22, 62.98, 83.98], a: 81.23 },
    { n: "PrimusV2-B", g: "v2", p: 93.8, v: [92.35, 89.31, 88.14, 80.97, 88.48, 79.2, 65.24, 63.14, 83.83], a: 81.18 },
    { n: "PrimusV2-M", g: "v2", p: 147.2, v: [92.27, 89.35, 88.09, 81.73, 88.26, 79.4, 66.36, 63.23, 84.15], a: 81.43 },
    { n: "PrimusV3-S", g: "v3", p: 70.6, v: [92.7, 89.29, 88.65, 81.29, 89.66, 80.68, 63.95, 64.1, 84.99], a: 81.7 },
  ];
  const GROUP = {
    cnn: { label: "CNN", color: "var(--pv-strong)" },
    hyb: { label: "Hybrid transformer", color: "var(--pv-base2)" },
    v1: { label: "Primus", color: "var(--pv-s1)" },
    v2: { label: "PrimusV2", color: "var(--pv-s3)" },
    v3: { label: "PrimusV3", color: "var(--pv-s2)" },
  };

  // ---------- Figure 1 / 7: leaderboard ----------
  function legend(id, groups) {
    const el = document.getElementById(id);
    el.innerHTML = groups.map((g) => `<span><i style="background:${GROUP[g].color}"></i>${GROUP[g].label}</span>`).join("");
  }
  function leaderboard(id, groups, emph) {
    const rows = PUB.filter((r) => groups.includes(r.g)).sort((a, b) => b.a - a.a);
    mount(id, (el, W) => {
      const narrow = W < 520;
      const L = narrow ? 118 : 150, R = 52, T = 6, rh = narrow ? 24 : 26;
      const H = T + rows.length * rh + 26;
      const sv = svgRoot(el, W, H, "Average Dice per method");
      const x0 = 70, x1 = 82.5;
      const x = (v) => L + ((v - x0) / (x1 - x0)) * (W - L - R);
      xAxis(sv, x, [70, 72, 74, 76, 78, 80, 82], T, T + rows.length * rh, (t) => t);
      rows.forEach((r, i) => {
        const y = T + i * rh + rh / 2;
        const strong = emph.includes(r.g);
        s("text", { x: L - 12, y: y + 4, "text-anchor": "end", fill: strong ? "var(--pv-strong)" : "var(--pv-text)", "font-size": "12.5px", "font-weight": strong ? 600 : 400, text: r.n }, sv);
        s("line", { x1: x(x0), x2: x(r.a), y1: y, y2: y, stroke: "var(--pv-grid)", "stroke-width": 1 }, sv);
        s("circle", { cx: x(r.a), cy: y, r: strong ? 6.5 : 5.5, fill: GROUP[r.g].color, stroke: "var(--pv-surface)", "stroke-width": 2 }, sv);
        s("text", { x: x(r.a) + 11, y: y + 4, fill: "var(--pv-muted)", "font-size": "11.5px", text: f2(r.a) }, sv);
        const hit = s("rect", { x: 0, y: y - rh / 2, width: W, height: rh, fill: "transparent" }, sv);
        bindTip(hit, () => tipRows(`${r.n} · ${GROUP[r.g].label}`, [["Average", f2(r.a)], ["Params", r.p + "M"]].concat(DS9.map((d, j) => [DS9_LABEL[d] || d, f2(r.v[j])]))));
      });
    });
  }
  legend("lb1-legend", ["cnn", "hyb", "v1"]);
  leaderboard("lb1", ["cnn", "hyb", "v1"], ["v1"]);
  legend("lb2-legend", ["cnn", "hyb", "v1", "v2", "v3"]);
  leaderboard("lb2", ["cnn", "hyb", "v1", "v2", "v3"], ["v2", "v3"]);

  // ---------- Figure 2: receptive field on a real CT ----------
  const RF = {
    6: { rf: [64, 192, 192], ch: 40, d: 88.94 },
    5: { rf: [62, 140, 140], ch: 44, d: 88.74 },
    4: { rf: [32, 68, 68], ch: 46, d: 87.13 },
    3: { rf: [14, 32, 32], ch: 48, d: 78.62 },
    2: { rf: [5, 14, 14], ch: 62, d: 50.15 },
  };
  const SPACING = [2.0, 0.71, 0.71];           // AMOS nnU-Net target spacing (z, y, x) in mm
  const PATCH_VX = [64, 160, 192];              // patch (z, y, x) in voxels
  const PATCH_MM = PATCH_VX.map((v, i) => v * SPACING[i]);
  const FMAP = [[64, 160, 192], [64, 80, 96], [32, 40, 48], [16, 20, 24], [8, 10, 12], [4, 5, 6]];
  // CT slices (LiTS liver_5), cropped to the body; both share the same left-right columns
  const CT = {
    mmPerPx: 0.96875,
    axial: { w: 433, h: 388 },                  // rows: anterior -> posterior, cols: patient right -> left
    coronal: { w: 433, h: 443 },                // rows: superior -> inferior
    axialZ: 86.4,                               // position of the axial slice in the coronal view (mm from top)
    center: { x: 148.2, y: 152.4, z: 110 },     // patch centre (mm): liver centroid
  };
  const capRF = (st) => RF[st].rf.map((v, i) => Math.min(v, PATCH_VX[i]));
  let nStages = 4;
  const P0 = { x: CT.center.x - PATCH_MM[2] / 2, y: CT.center.y - PATCH_MM[1] / 2, z: CT.center.z - PATCH_MM[0] / 2 };
  const focus = { x: CT.center.x, y: CT.center.y, z: CT.center.z };   // output voxel fixed at the centre of the crop
  const rfSlider = document.getElementById("rf-stages");
  const rfOut = document.getElementById("rf-out");

  const drawUnet = mount("rf-unet", (el, W) => {
    const H = 250, T = 14, lh = 38, bw = 30, bh = 20;
    const sv = svgRoot(el, W, H, `U-Net with ${nStages} of 6 stages`);
    const step = Math.min(24, (W / 2 - bw - 60) / 5);
    const xe = (i) => 8 + i * step;
    const xd = (i) => W - 8 - bw - i * step;
    for (let i = 0; i < 6; i++) {
      const on = i < nStages;
      const y = T + i * lh;
      const op = on ? 1 : 0.18;
      const bottom = i === nStages - 1;
      if (i < 5) {
        const on2 = i + 1 < nStages;
        s("line", { x1: xe(i) + bw / 2, y1: y + bh, x2: xe(i + 1) + bw / 2, y2: y + lh, stroke: "var(--pv-base)", "stroke-width": 1.5, opacity: on2 ? 1 : 0.18 }, sv);
        s("line", { x1: xd(i + 1) + bw / 2, y1: y + lh, x2: xd(i) + bw / 2, y2: y + bh, stroke: "var(--pv-base)", "stroke-width": 1.5, opacity: on2 ? 1 : 0.18 }, sv);
      }
      s("line", { x1: xe(i) + bw, x2: xd(i), y1: y + bh / 2, y2: y + bh / 2, stroke: bottom ? "var(--pv-s1)" : "var(--pv-base2)", "stroke-width": bottom ? 2 : 1, opacity: op }, sv);
      s("rect", { x: xe(i), y: y, width: bw, height: bh, rx: 4, fill: "var(--pv-s1)", opacity: op }, sv);
      s("rect", { x: xd(i), y: y, width: bw, height: bh, rx: 4, fill: "var(--pv-s1)", opacity: on ? 0.55 : 0.12 }, sv);
      const fm = FMAP[i];
      const lbl = s("text", { x: W / 2, y: y + bh / 2 - 4, "text-anchor": "middle", fill: on ? "var(--pv-text)" : "var(--pv-muted)", "font-size": "11px", "font-family": "var(--pv-mono)", text: `${fm[0]}×${fm[1]}×${fm[2]}`, opacity: on ? 1 : 0.5 }, sv);
      lbl.setAttribute("paint-order", "stroke");
      lbl.style.setProperty("stroke", "var(--pv-bg)");
      lbl.style.setProperty("stroke-width", "5px");
      if (!on) s("text", { x: W / 2, y: y + bh / 2 + 11, "text-anchor": "middle", fill: "var(--pv-muted)", "font-size": "10px", text: "removed", opacity: 0.8 }, sv);
    }
    s("text", { x: 8, y: H - 4, fill: "var(--pv-muted)", "font-size": "11px", text: "encoder" }, sv);
    s("text", { x: W - 8, y: H - 4, "text-anchor": "end", fill: "var(--pv-muted)", "font-size": "11px", text: "decoder" }, sv);
  });

  // one CT view; "view" is "axial" (horizontal = x, vertical = y) or "coronal" (horizontal = x, vertical = z)
  const ctViews = {};
  function ctView(id, view) {
    const el = document.getElementById(id);
    const src = el.getAttribute("data-src");
    const dims = CT[view];
    const Wmm = dims.w * CT.mmPerPx, Hmm = dims.h * CT.mmPerPx;
    const vKey = view === "axial" ? "y" : "z";
    const vPatch = view === "axial" ? PATCH_MM[1] : PATCH_MM[0];
    const vSp = view === "axial" ? 1 : 0;       // index into RF / spacing arrays for the vertical axis
    return mount(id, (el2, W) => {
      const k = W / Wmm, H = Hmm * k;
      const sv = svgRoot(el2, W, H, `${view} CT view`);
      const defs = s("defs", {}, sv);
      const clip = s("clipPath", { id: `clip-${view}` }, defs);
      s("rect", { x: 0, y: 0, width: W, height: H, rx: 8 }, clip);
      const g = s("g", { "clip-path": `url(#clip-${view})` }, sv);
      s("rect", { x: 0, y: 0, width: W, height: H, fill: "#000000" }, g);
      s("image", { href: src, x: 0, y: 0, width: W, height: H, preserveAspectRatio: "none" }, g);
      const px = P0.x * k, py = P0[vKey] * k, pw = PATCH_MM[2] * k, ph = vPatch * k;
      // dim everything outside the patch
      s("path", { d: `M0,0H${W}V${H}H0Z M${px},${py}V${py + ph}H${px + pw}V${py}Z`, fill: "#000000", "fill-opacity": 0.5, "fill-rule": "evenodd" }, g);
      s("rect", { x: px, y: py, width: pw, height: ph, fill: "none", stroke: "#ffffff", "stroke-width": 1.5 }, g);
      const lab = s("text", { x: px + 4, y: py - 5, fill: "#ffffff", "font-size": "10.5px", text: view === "axial" ? "crop · 13.6 × 11.4 cm" : "crop · 13.6 × 12.8 cm" }, g);
      lab.setAttribute("paint-order", "stroke"); lab.style.setProperty("stroke", "#000000"); lab.style.setProperty("stroke-width", "3px");
      const box = s("rect", { fill: "var(--pv-s2)", "fill-opacity": 0.28, stroke: "var(--pv-s2)", "stroke-width": 2 }, g);
      const dot = s("circle", { r: 3.5, fill: "var(--pv-s2)", stroke: "#ffffff", "stroke-width": 1.5 }, g);
      // 5 cm scale bar
      const sb = 50 * k;
      s("line", { x1: 10, x2: 10 + sb, y1: H - 12, y2: H - 12, stroke: "#ffffff", "stroke-width": 2 }, g);
      s("text", { x: 10 + sb / 2, y: H - 17, "text-anchor": "middle", fill: "#ffffff", "font-size": "10.5px", text: "5 cm" }, g);
      const place = () => {
        const rf = capRF(nStages);
        const rw = rf[2] * SPACING[2], rh = rf[vSp] * SPACING[vSp];
        const fv = focus[vKey];
        // an axis whose receptive field reaches the crop size sees the whole crop along that axis
        const fullX = RF[nStages].rf[2] >= PATCH_VX[2], fullV = RF[nStages].rf[vSp] >= PATCH_VX[vSp];
        let x0 = fullX ? P0.x : Math.max(P0.x, focus.x - rw / 2), x1 = fullX ? P0.x + PATCH_MM[2] : Math.min(P0.x + PATCH_MM[2], focus.x + rw / 2);
        let y0 = fullV ? P0[vKey] : Math.max(P0[vKey], fv - rh / 2), y1 = fullV ? P0[vKey] + vPatch : Math.min(P0[vKey] + vPatch, fv + rh / 2);
        box.setAttribute("x", x0 * k); box.setAttribute("y", y0 * k);
        box.setAttribute("width", Math.max(3, (x1 - x0) * k)); box.setAttribute("height", Math.max(3, (y1 - y0) * k));
        dot.setAttribute("cx", focus.x * k); dot.setAttribute("cy", fv * k);
      };
      place();
      ctViews[view] = place;
    });
  }
  const drawAxial = ctView("rf-axial", "axial");

  function rfStats() {
    const r = RF[nStages], rf = capRF(nStages);
    const vol = rf[0] * rf[1] * rf[2], patch = PATCH_VX[0] * PATCH_VX[1] * PATCH_VX[2];
    const frac = (100 * vol) / patch;
    const cm = rf.map((v, i) => (v * SPACING[i]) / 10);
    const whole = nStages === 6;
    elOrStub("rf-stats").innerHTML = [
      ["Receptive field (voxels)", `${rf[0]}×${rf[1]}×${rf[2]}${whole ? " <small>whole crop</small>" : ""}`],
      ["Physical size (z × y × x)", `${cm.map((c) => c.toFixed(c < 1 ? 1 : 1)).join(" × ")} <small>cm</small>`],
      ["Share of crop volume", `${frac < 1 ? frac.toFixed(2) : frac.toFixed(1)}<small>%</small>`],
      ["Dice on AMOS", `${f2(r.d)} <small>${((100 * r.d) / RF[6].d).toFixed(1)}% of full</small>`],
    ].map(([l, v]) => `<div class="pv-stat"><div class="pv-stat-l">${l}</div><div class="pv-stat-v">${v}</div></div>`).join("");
  }

  const drawCurve = mount("rf-curve", (el, W) => {
    const H = 156, L = 44, R = 40, T = 14, B = 34;
    const sv = svgRoot(el, W, H, "Dice versus number of stages");
    const xs = [2, 3, 4, 5, 6];
    const x = (st) => L + ((st - 2) / 4) * (W - L - R);
    const y = (d) => T + (1 - (d - 40) / 55) * (H - T - B);
    [40, 60, 80].forEach((t) => {
      s("line", { x1: L, x2: W - R, y1: y(t), y2: y(t), stroke: "var(--pv-grid)", "stroke-width": 1 }, sv);
      s("text", { x: L - 8, y: y(t) + 4, "text-anchor": "end", fill: "var(--pv-muted)", "font-size": "11px", text: t }, sv);
    });
    xs.forEach((st) => {
      const r = capRF(st);
      s("text", { x: x(st), y: H - 14, "text-anchor": "middle", fill: "var(--pv-muted)", "font-size": "11px", text: `${st} stages` }, sv);
      s("text", { x: x(st), y: H - 1, "text-anchor": "middle", fill: "var(--pv-muted)", "font-size": "10px", "font-family": "var(--pv-mono)", text: `${r[0]}×${r[1]}×${r[2]}` }, sv);
    });
    s("polyline", { points: xs.map((st) => `${x(st)},${y(RF[st].d)}`).join(" "), fill: "none", stroke: "var(--pv-s1)", "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, sv);
    xs.forEach((st) => {
      const cur = st === nStages;
      s("circle", { cx: x(st), cy: y(RF[st].d), r: cur ? 6.5 : 4.5, fill: cur ? "var(--pv-s2)" : "var(--pv-s1)", stroke: "var(--pv-surface)", "stroke-width": 2 }, sv);
      if (cur) s("text", { x: st === 2 ? x(st) + 10 : x(st), y: y(RF[st].d) - 12, "text-anchor": st === 2 ? "start" : "middle", fill: "var(--pv-strong)", "font-size": "12px", "font-weight": 600, text: f2(RF[st].d) }, sv);
      const hit = s("rect", { x: x(st) - 26, y: T, width: 52, height: H - T - B + 10, fill: "transparent" }, sv);
      hit.style.cursor = "pointer";
      hit.addEventListener("click", () => setStages(st));
      bindTip(hit, () => tipRows(`${st} stages`, [["Receptive field", capRF(st).join("×")], ["Initial channels", String(RF[st].ch)], ["Dice", f2(RF[st].d)]]));
    });
    s("text", { x: L, y: T - 2, fill: "var(--pv-muted)", "font-size": "11px", text: "Dice (%)" }, sv);
  });

  function setStages(n) {
    nStages = n;
    rfSlider.value = n;
    rfOut.textContent = n;
    drawUnet(); drawCurve(); rfStats();
    Object.values(ctViews).forEach((f) => f());
  }
  rfSlider.addEventListener("input", () => setStages(+rfSlider.value));
  setStages(4);

  // ---------- Table 1: crop size vs patch size (TMLR appendix Table 13, fold 0) ----------
  const FOV_DS = ["ACDC", "SBM", "ATLAS22", "AMOS22"];
  const FOV = [
    { grp: "nnU-Net" },
    { n: "nnU-Net (default)", ps: "—", crop: "full", v: [92.43, 68.52, 62.31, 88.75], id: "def" },
    { n: "nnU-Net (default)", ps: "—", crop: "half", v: [92.65, 71.63, 54.27, 82.99], ref: "def" },
    { n: "nnU-Net ResEnc-L", ps: "—", crop: "full", v: [93.05, 70.97, 62.46, 89.65], id: "res" },
    { n: "nnU-Net ResEnc-L", ps: "—", crop: "half", v: [93.55, 72.46, 63.56, 88.62], ref: "res" },
    { grp: "Primus-M" },
    { n: "Primus-M", ps: "8³", crop: "full", v: [92.86, 57.56, 61.44, 88.12], id: "pm" },
    { n: "Primus-M", ps: "8³", crop: "half", v: [92.80, 64.02, 54.30, 83.82], ref: "pm" },
    { n: "Primus-M", ps: "4³", crop: "half", v: [93.17, 69.72, 62.79, 87.26], ref: "pm", hl: true },
  ];
  function fovTable(mode) {
    const rows = FOV.filter((r) => !r.grp);
    const best = FOV_DS.map((_, j2) => Math.max(...rows.map((r) => r.v[j2])));
    const avg = (r) => mean(r.v);
    const bestA = Math.max(...rows.map(avg));
    const byId = {}; rows.forEach((r) => { if (r.id) byId[r.id] = r; });
    const cell = (v, rv, plain) => {
      if (mode === "dice" || plain) return f2(v);
      const d = v - rv, cls = d > 0.005 ? "pv-pos" : d < -0.005 ? "pv-neg" : "";
      return `<span class="${cls}">${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(2)}</span>`;
    };
    let h = `<table class="pv-table"><thead><tr><th>Model</th><th class="pv-txt">Patch size</th><th class="pv-txt">Crop size</th>${FOV_DS.map((d) => `<th>${d}</th>`).join("")}<th class="pv-avg">Avg</th></tr></thead><tbody>`;
    FOV.forEach((r) => {
      if (r.grp) { h += `<tr class="pv-grp"><td colspan="${FOV_DS.length + 4}">${r.grp}</td></tr>`; return; }
      const ref = r.ref ? byId[r.ref] : null;   // Δ is relative to the same model at full crop
      const plain = !ref;
      h += `<tr${r.hl ? ' class="pv-hl2"' : ""}><td>${r.n}</td><td class="pv-txt pv-mono">${r.ps}</td><td class="pv-txt">${r.crop}</td>`;
      r.v.forEach((v, j2) => { h += `<td class="${Math.abs(v - best[j2]) < 1e-9 ? "pv-best" : ""}">${cell(v, ref ? ref.v[j2] : 0, plain)}</td>`; });
      h += `<td class="pv-avg${Math.abs(avg(r) - bestA) < 1e-9 ? " pv-best" : ""}">${cell(avg(r), ref ? avg(ref) : 0, plain)}</td></tr>`;
    });
    elOrStub("tbl-fov").innerHTML = h + "</tbody></table>";
  }
  segmented("fov-mode", [["dice", "Dice"], ["delta", "Δ vs full crop"]], "dice", fovTable);
  fovTable("dice");

  // ---------- Figure 3: the blip animation (canvas, theme-aware) ----------
  const blip = (function () {
    const canvas = document.getElementById("blip-canvas");
    const btn = document.getElementById("blip-play");
    if (!canvas || !canvas.getContext) return null;
    const ctx = canvas.getContext("2d");
    const N = 8;
    let K = 3, P = N - K + 1, NPOS = P * P * P;
    let idx = 0, playing = true, visible = true, acc = 0, last = 0, raf = 0;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let C = {}, L = null;

    // ---- colours from the page's CSS tokens ----
    const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    function rgb(c) {
      if (c.startsWith("#")) {
        const h = c.length === 4 ? c.slice(1).split("").map((x) => x + x).join("") : c.slice(1, 7);
        return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
      }
      const m = c.match(/[\d.]+/g) || [0, 0, 0];
      return m.slice(0, 3).map(Number);
    }
    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const mix = (c, d, t) => c.map((v, i) => Math.round(v + (d[i] - v) * t));
    function colors() {
      const k = (n) => rgb(css(n));
      const bg = k("--pv-bg"), s1 = k("--pv-s1"), s2 = k("--pv-s2");
      const dark = (bg[0] + bg[1] + bg[2]) / 3 < 110;
      C = {
        bg, text: k("--pv-strong"), muted: k("--pv-muted"), accent: k("--pv-head"),
        wall: k("--pv-surface"), grid: k("--pv-rule"), edge: k("--pv-base"),
        s1, s2, slot: k("--pv-surface2"),
        shadow: mix(s1, bg, dark ? 0.62 : 0.72),
        kTop: mix(s1, [255, 255, 255], 0.35), kLeft: s1, kRight: mix(s1, [0, 0, 0], 0.25),
        bTop: mix(s2, [255, 255, 255], 0.45), bLeft: s2, bRight: mix(s2, [0, 0, 0], 0.22),
      };
    }

    // ---- layout in a fixed design space, scaled to the canvas ----
    function layout(width) {
      if (width >= 560) return { W: 820, H: 440, wide: true, U: 16, OX: 205, OY: 92, bank: [440, 112, 350, 250], fs: 1 };
      return { W: 600, H: 1000, wide: false, U: 21, OX: 300, OY: 96, bank: [38, 590, 524, 330], fs: 1.25 };
    }
    const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
    const iso = (x, y, z) => [L.OX + (x - y) * C30 * L.U, L.OY + ((x + y) * S30 - z) * L.U + N * L.U];
    function poly(pts, fill, stroke, lw) {
      ctx.beginPath();
      pts.forEach((p, i) => { const q = iso(...p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
    }
    function line(a, b, stroke, lw) {
      const p = iso(...a), q = iso(...b);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
      ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke();
    }
    function cube(x, y, z, a) {
      poly([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], rgba(C.bTop, a));
      poly([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], rgba(C.bRight, a));
      poly([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], rgba(C.bLeft, a));
    }
    function text(x, y, str, size, color, weight, align) {
      ctx.font = `${weight || 400} ${size * L.fs}px ${css("--pv-sans") || "sans-serif"}`;
      ctx.fillStyle = rgba(color, 1); ctx.textAlign = align || "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText(str, x, y);
    }
    const rr = (x, y, w, h, r, fill) => { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); ctx.fillStyle = fill; ctx.fill(); };

    function draw() {
      const cssW = canvas.clientWidth || canvas.parentElement.clientWidth;
      L = layout(cssW);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssH = cssW * L.H / L.W;
      if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
        canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
        canvas.style.height = cssH + "px";
      }
      ctx.setTransform(canvas.width / L.W, 0, 0, canvas.height / L.H, 0, 0);
      ctx.clearRect(0, 0, L.W, L.H);
      ctx.fillStyle = rgba(C.bg, 1); ctx.fillRect(0, 0, L.W, L.H);
      const final = idx >= NPOS;
      const pos = Math.min(idx, NPOS - 1);
      const pz = Math.floor(pos / (P * P)), rem = pos % (P * P), py = Math.floor(rem / P), px = rem % P;
      const c = Math.floor((K - 1) / 2);                 // blip voxel inside the pattern
      const shown = final ? NPOS : pos + 1;
      // titles
      if (L.wide) {
        text(28, 38, `One 8×8×8 token, one ${K}×${K}×${K} blip`, 18, C.text, 600);
        text(28, 62, `It can sit at ${P} × ${P} × ${P} = ${NPOS} offsets in the token`, 14, C.muted);
      } else {
        text(30, 40, `One 8×8×8 token, one ${K}×${K}×${K} blip`, 19, C.text, 600);
        text(30, 70, `${NPOS} possible offsets inside the token`, 14, C.muted);
      }
      // back walls and grid
      const wall = rgba(C.wall, 1), grid = rgba(C.grid, 1);
      poly([[0, 0, 0], [N, 0, 0], [N, N, 0], [0, N, 0]], wall);
      poly([[0, 0, 0], [0, N, 0], [0, N, N], [0, 0, N]], wall);
      poly([[0, 0, 0], [N, 0, 0], [N, 0, N], [0, 0, N]], wall);
      for (let i = 0; i <= N; i++) {
        line([i, 0, 0], [i, N, 0], grid); line([0, i, 0], [N, i, 0], grid);
        line([0, i, 0], [0, i, N], grid); line([0, 0, i], [0, N, i], grid);
        line([i, 0, 0], [i, 0, N], grid); line([0, 0, i], [N, 0, i], grid);
      }
      // shadows of the pattern and of the blip on the three walls
      const sh = rgba(C.shadow, 1), bs = rgba(C.s2, 1);
      poly([[px, py, 0], [px + K, py, 0], [px + K, py + K, 0], [px, py + K, 0]], sh);
      poly([[0, py, pz], [0, py + K, pz], [0, py + K, pz + K], [0, py, pz + K]], sh);
      poly([[px, 0, pz], [px + K, 0, pz], [px + K, 0, pz + K], [px, 0, pz + K]], sh);
      const bx = px + c, by = py + c, bz = pz + c;
      poly([[bx, by, 0], [bx + 1, by, 0], [bx + 1, by + 1, 0], [bx, by + 1, 0]], bs);
      poly([[0, by, bz], [0, by + 1, bz], [0, by + 1, bz + 1], [0, by, bz + 1]], bs);
      poly([[bx, 0, bz], [bx + 1, 0, bz], [bx + 1, 0, bz + 1], [bx, 0, bz + 1]], bs);
      // blip, translucent pattern box, blip again (so it reads as inside)
      cube(bx, by, bz, 1);
      const X = px + K, Y = py + K, Z = pz + K;
      poly([[px, py, Z], [X, py, Z], [X, Y, Z], [px, Y, Z]], rgba(C.kTop, 0.33));
      poly([[X, py, pz], [X, Y, pz], [X, Y, Z], [X, py, Z]], rgba(C.kRight, 0.33));
      poly([[px, Y, pz], [X, Y, pz], [X, Y, Z], [px, Y, Z]], rgba(C.kLeft, 0.33));
      const kl = rgba(C.kRight, 0.95);
      for (let i = 0; i <= K; i++) {
        line([px + i, py, Z], [px + i, Y, Z], kl); line([px, py + i, Z], [X, py + i, Z], kl);
        line([X, py + i, pz], [X, py + i, Z], kl); line([X, py, pz + i], [X, Y, pz + i], kl);
        line([px + i, Y, pz], [px + i, Y, Z], kl); line([px, Y, pz + i], [X, Y, pz + i], kl);
      }
      cube(bx, by, bz, 0.72);
      // front edges of the token
      const e = rgba(C.edge, 1);
      [[[N, 0, 0], [N, N, 0]], [[0, N, 0], [N, N, 0]], [[N, N, 0], [N, N, N]], [[N, 0, 0], [N, 0, N]], [[0, N, 0], [0, N, N]],
       [[0, 0, N], [N, 0, N]], [[0, 0, N], [0, N, N]], [[N, 0, N], [N, N, N]], [[0, N, N], [N, N, N]]].forEach(([a, b]) => line(a, b, e, 2));
      // counters under the token
      const cy = L.wide ? L.H - 30 : 452;
      text(L.wide ? 28 : 30, cy, `offset (${px}, ${py}, ${pz})`, 15, C.text);
      text(L.wide ? 300 : L.W - 30, cy, `${shown} / ${NPOS}`, 15, C.text, 600, L.wide ? "left" : "right");
      // template bank
      const [bx0, by0, bw, bh] = L.bank;
      if (L.wide) {
        text(bx0, 38, "A linear 8³ → D patch embedding", 18, C.text, 600);
        text(bx0, 62, "needs a weight template for every offset", 14, C.muted);
      } else {
        text(30, 510, "Linear 8³ → D patch embedding:", 17, C.text, 600);
        text(30, 540, "one weight template per offset", 14, C.muted);
      }
      const cols = Math.min(P, P > 4 ? 3 : P), rows = Math.ceil(P / cols);
      const gapS = L.wide ? 16 : 22, labH = 18;
      const slabW = (bw - (cols - 1) * gapS) / cols, slabH = (bh - (rows - 1) * gapS - rows * labH) / rows;
      const side = Math.min(slabW, slabH);
      const cell = side / (P + (P - 1) * 0.18), gap = cell * 0.18;
      const done = rgba(C.s1, 0.75), cur = rgba(C.s2, 1), empty = rgba(C.slot, 1);
      for (let z = 0; z < P; z++) {
        const cx0 = bx0 + (z % cols) * (side + gapS), cy0 = by0 + Math.floor(z / cols) * (side + gapS + labH) + labH;
        text(cx0, cy0 - 6, `z-offset ${z}`, 11, C.muted);
        for (let yy = 0; yy < P; yy++) for (let xx = 0; xx < P; xx++) {
          const n = z * P * P + yy * P + xx;
          rr(cx0 + xx * (cell + gap), cy0 + yy * (cell + gap), cell, cell, Math.min(3, cell / 4), final || n < pos ? done : n === pos ? cur : empty);
        }
      }
      const msg = final ? `${NPOS} templates vs. one shared conv kernel`
                        : `${shown} template${shown > 1 ? "s" : ""} so far`;
      text(L.wide ? bx0 : 30, L.wide ? L.H - 30 : L.H - 40, msg, 15, final ? C.accent : C.text, final ? 600 : 400);
    }

    // ---- timing: slow at first, then faster, hold on the finished bank ----
    const stepMs = (i) => (i >= NPOS ? 3200 : i < 6 ? 420 : i < 36 ? 110 : Math.max(16, 9000 / NPOS));
    function tick(t) {
      raf = 0;
      if (!playing || !visible) return;
      if (!last) last = t;
      acc += t - last; last = t;
      let changed = false;
      while (acc >= stepMs(idx)) { acc -= stepMs(idx); idx = idx >= NPOS ? 0 : idx + 1; changed = true; }
      if (changed) draw();
      raf = requestAnimationFrame(tick);
    }
    function start() { if (!raf && playing && visible) { last = 0; raf = requestAnimationFrame(tick); } }
    function setPlaying(p) {
      playing = p; btn.textContent = p ? "Pause" : "Play"; btn.setAttribute("aria-pressed", String(!p));
      if (p) start();
    }
    btn.addEventListener("click", () => setPlaying(!playing));
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; start(); }).observe(canvas);
    if ("ResizeObserver" in window) { let w = 0; new ResizeObserver(() => { const nw = canvas.clientWidth; if (nw !== w) { w = nw; draw(); } }).observe(canvas.parentElement); }
    const recolor = () => { colors(); draw(); };
    if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", recolor);
    new MutationObserver(recolor).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    colors();
    if (reduce) { idx = 40; setPlaying(false); } else start();
    draw();
    return {
      setK(k) { K = k; P = N - K + 1; NPOS = P * P * P; idx = 0; acc = 0; draw(); start(); },
    };
  })();

  const kIn = document.getElementById("k-size"), kOut = document.getElementById("k-out"), kText = document.getElementById("k-text");
  function kUpdate() {
    const k = +kIn.value, n = Math.pow(8 - k + 1, 3);
    kOut.textContent = k;
    kText.innerHTML = `A ${k}×${k}×${k} pattern fits at <span class="pv-kcount">(8 − ${k} + 1)³ = ${n}</span> offsets, so a linear 8³ embedding needs ${n} templates for it.` + (n > 396 ? ` That is more than the 396 dimensions of Primus-S.` : "");
    if (blip) blip.setK(k);
  }
  kIn.addEventListener("input", kUpdate);
  kUpdate();

  // ---------- Figure 4: tokenizer ablation ----------
  const TOKAB = [
    { n: "Linear 8³ projection", sub: "Primus-M", w: [92.73, 87.89, 88.11, 82.89], wa: 87.91, wo: [19.45, 3.02, 15.88, 40.76], woa: 19.78 },
    { n: "Iterative 2³ projections", sub: "2×2×2, stride 2", w: [92.62, 89.19, 88.68, 84.01], wa: 88.63, wo: [38.51, 25.05, 27.61, 54.05], woa: 36.3 },
    { n: "Conv downsampling", sub: "3×3×3, stride 2", w: [92.68, 89.24, 89.3, 83.28], wa: 88.62, wo: [76.79, 54.61, 55.79, 69.12], woa: 64.08 },
    { n: "Minimal residual", sub: "PrimusV2-M", w: [92.81, 89.34, 88.57, 84.91], wa: 88.91, wo: [91.89, 81.56, 82.69, 79.77], woa: 83.98, chosen: true },
    { n: "Large residual", sub: "1–2–3 blocks per stage", w: [93.1, 89.34, 89.26, 84.72], wa: 89.11, wo: [93.17, 87.0, 86.61, 83.14], woa: 87.48 },
  ];
  mount("tokab", (el, W) => {
    const narrow = W < 560;
    const L = narrow ? 138 : 190, R = narrow ? 86 : 150, T = 22, rh = 44;
    const H = T + TOKAB.length * rh + 22;
    const sv = svgRoot(el, W, H, "Tokenizer ablation dumbbell chart");
    const x = (v) => L + (v / 100) * (W - L - R);
    xAxis(sv, x, [0, 20, 40, 60, 80, 100], T - 6, T + TOKAB.length * rh - 8, (t) => t);
    s("text", { x: W - R + 12, y: T - 8, fill: "var(--pv-muted)", "font-size": "10.5px", "font-weight": 600, text: "WITH TR" }, sv);
    if (!narrow) s("text", { x: W - R + 76, y: T - 8, fill: "var(--pv-muted)", "font-size": "10.5px", "font-weight": 600, text: "TR ADDS" }, sv);
    TOKAB.forEach((r, i) => {
      const y = T + i * rh + rh / 2 - 6;
      s("text", { x: L - 14, y: narrow ? y + 4 : y - 1, "text-anchor": "end", fill: "var(--pv-strong)", "font-size": narrow ? "11.5px" : "12.5px", "font-weight": r.chosen ? 700 : 500, text: r.n }, sv);
      if (!narrow) s("text", { x: L - 14, y: y + 14, "text-anchor": "end", fill: r.chosen ? "var(--pv-s2)" : "var(--pv-muted)", "font-size": "11px", "font-weight": r.chosen ? 600 : 400, text: r.sub }, sv);
      s("line", { x1: x(r.woa), x2: x(r.wa), y1: y, y2: y, stroke: "var(--pv-base2)", "stroke-width": 3, "stroke-linecap": "round" }, sv);
      s("circle", { cx: x(r.woa), cy: y, r: 6, fill: "var(--pv-base)", stroke: "var(--pv-surface)", "stroke-width": 2 }, sv);
      s("circle", { cx: x(r.wa), cy: y, r: 6, fill: "var(--pv-s1)", stroke: "var(--pv-surface)", "stroke-width": 2 }, sv);
      const gap = r.wa - r.woa;
      if (gap > 12 && !narrow) s("text", { x: x(r.woa) - 10, y: y + 4, "text-anchor": "end", fill: "var(--pv-muted)", "font-size": "11.5px", text: f2(r.woa) }, sv);
      else s("text", { x: x(r.woa), y: y + 20, "text-anchor": "middle", fill: "var(--pv-muted)", "font-size": "11px", text: f2(r.woa) }, sv);
      s("text", { x: W - R + 12, y: y + 4, fill: "var(--pv-strong)", "font-size": "12.5px", "font-weight": 600, text: f2(r.wa) }, sv);
      if (!narrow) s("text", { x: W - R + 76, y: y + 4, fill: r.chosen ? "var(--pv-s2)" : "var(--pv-text)", "font-size": "12.5px", "font-weight": r.chosen ? 700 : 400, text: "+" + gap.toFixed(1) }, sv);
      const hit = s("rect", { x: 0, y: y - rh / 2 + 4, width: W, height: rh, fill: "transparent" }, sv);
      bindTip(hit, () => tipRows(`${r.n} (${r.sub})`, [["", "with TR · without"]].concat(DEV.map((d, j) => [d, `${f2(r.w[j])} · ${f2(r.wo[j])}`]), [["Average", `${f2(r.wa)} · ${f2(r.woa)}`]])));
    });
  });
  (function () {
    let h = `<table class="pv-table"><thead><tr><th>Tokenizer</th><th>Transformer</th>${DEV.map((d) => `<th>${d}</th>`).join("")}<th class="pv-avg">Avg</th></tr></thead><tbody>`;
    const bestW = DEV.map((_, j) => Math.max(...TOKAB.map((r) => r.w[j])));
    const bestWA = Math.max(...TOKAB.map((r) => r.wa));
    TOKAB.forEach((r) => {
      h += `<tr${r.chosen ? ' class="pv-hl"' : ""}><td>${r.n}<span class="pv-sub">${r.sub}</span></td><td>with</td>${r.w.map((v, j) => `<td${v === bestW[j] ? ' class="pv-best"' : ""}>${f2(v)}</td>`).join("")}<td class="pv-avg${r.wa === bestWA ? " pv-best" : ""}">${f2(r.wa)}</td></tr>`;
      h += `<tr${r.chosen ? ' class="pv-hl"' : ""}><td></td><td class="pv-na">without</td>${r.wo.map((v) => `<td class="pv-na">${f2(v)}</td>`).join("")}<td class="pv-avg pv-na">${f2(r.woa)}</td></tr>`;
    });
    elOrStub("tokab-table").innerHTML = h + "</tbody></table>";
  })();

  // ---------- Figure 5: tokenizer explorer ----------
  const DIM = { S: 396, B: 792, M: 864, L: 1056 };
  const TOK = {
    v1: { label: "Primus", ch: null, skips: false, params: { S: 0.2, B: 0.41, M: 0.44, L: 0.54 } },
    v2: { label: "PrimusV2", ch: [32, 32, 64, 128], skips: false, params: { S: 0.98, B: 1.03, M: 1.04, L: 1.06 } },
    deep: { label: "Deeper channels", ch: [32, 64, 256, 1024], skips: false, params: { S: 38.49, B: 38.9, M: 38.97, L: 39.17 } },
    v3: { label: "PrimusV3", ch: [32, 64, 256, 1024], skips: true, params: { S: 47.41, B: 56.74, M: 58.44, L: 62.96 } },
  };
  let tokVer = "v2", tokSize = "S";
  function tokLevels() {
    const t = TOK[tokVer], D = DIM[tokSize];
    if (!t.ch) return [
      { key: "in", name: "input", c: 1, sp: 64, per: 512 },
      { key: "tok", name: "tokens", c: D, sp: 8, per: D },
    ];
    const c = t.ch;
    return [
      { key: "in", name: "input", c: 1, sp: 64, per: 512 },
      { key: "stem", name: "stem", c: c[0], sp: 64, per: c[0] * 512 },
      { key: "d2", name: "↓2", c: c[1], sp: 32, per: c[1] * 64 },
      { key: "d4", name: "↓4", c: c[2], sp: 16, per: c[2] * 8 },
      { key: "d8", name: "↓8", c: c[3], sp: 8, per: c[3] },
      { key: "tok", name: "tokens", c: D, sp: 8, per: D },
    ];
  }
  const drawPipe = mount("tok-pipe", (el, W) => {
    const t = TOK[tokVer], D = DIM[tokSize];
    const lv = tokLevels();
    const skipH = t.skips ? 70 : 12;
    const maxH = W < 520 ? 84 : 112;
    const H = skipH + maxH + 48;
    const sv = svgRoot(el, W, H, `${t.label} tokenizer pipeline`);
    const defs = s("defs", {}, sv);
    const mk = (id, col) => {
      const m = s("marker", { id, viewBox: "0 0 8 8", refX: 7, refY: 4, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
      s("path", { d: "M0,0 L8,4 L0,8 z", fill: col }, m);
    };
    mk("pv-arr", "var(--pv-base)");
    mk("pv-arr2", "var(--pv-s2)");
    const cy = skipH + maxH / 2;
    const bwF = (c) => 6 + 2.2 * Math.sqrt(c) * (W < 520 ? 0.75 : 1);
    const bhF = (sp) => Math.max(12, maxH * (sp / 64));
    const n = lv.length;
    const colW = W / n;
    const geo = lv.map((l, i) => {
      const bw = bwF(l.c), bh = bhF(l.sp);
      const xc = colW * (i + 0.5);
      return { x: xc - bw / 2, y: cy - bh / 2, w: bw, h: bh, xc };
    });
    // narrowest level on the main path
    const inner = lv.filter((l) => l.key !== "in" && l.key !== "tok");
    const minPer = inner.length ? Math.min(...inner.map((l) => l.per)) : null;
    // arrows
    for (let i = 0; i < n - 1; i++) {
      const a = geo[i], b = geo[i + 1];
      s("line", { x1: a.x + a.w + 4, y1: cy, x2: b.x - 5, y2: cy, stroke: "var(--pv-base)", "stroke-width": 1.5, "marker-end": "url(#pv-arr)" }, sv);
    }
    if (!t.ch) {
      const a = geo[0], b = geo[1];
      s("text", { x: (a.x + a.w + b.x) / 2, y: cy - 10, "text-anchor": "middle", fill: "var(--pv-text)", "font-size": "12px", text: "linear 8³ → D" }, sv);
      s("text", { x: (a.x + a.w + b.x) / 2, y: cy + 20, "text-anchor": "middle", fill: "var(--pv-muted)", "font-size": "11px", text: "kernel 8, stride 8" }, sv);
    }
    // skip arcs
    if (t.skips) {
      const tokG = geo[n - 1];
      const lab = ["8³, s8", "4³, s4", "2³, s2"];
      [1, 2, 3].forEach((i, j) => {
        const a = geo[i];
        const top = 10 + j * 16;
        const x2 = tokG.x + tokG.w * (0.2 + 0.3 * j);
        const d = `M ${a.xc} ${a.y - 3} C ${a.xc} ${top}, ${x2} ${top}, ${x2} ${tokG.y - 5}`;
        s("path", { d, fill: "none", stroke: "var(--pv-s2)", "stroke-width": 1.6, "marker-end": "url(#pv-arr2)" }, sv);
        const lb = s("text", { x: a.xc + 7, y: a.y - 8, "text-anchor": "start", fill: "var(--pv-text)", "font-size": "11px", "font-family": "var(--pv-mono)", text: lab[j] }, sv);
        lb.setAttribute("paint-order", "stroke");
        lb.style.setProperty("stroke", "var(--pv-surface)");
        lb.style.setProperty("stroke-width", "5px");
      });
    }
    // blocks
    lv.forEach((l, i) => {
      const g = geo[i];
      let fill = "var(--pv-s1)", op = 0.9;
      if (l.key === "in") { fill = "var(--pv-base)"; op = 0.8; }
      if (l.key === "tok") { fill = "var(--pv-strong)"; op = 0.85; }
      const bottleneck = l.per < D && l.key !== "in" && l.key !== "tok";
      if (bottleneck) fill = "var(--pv-s2)";
      const rect = s("rect", { x: g.x, y: g.y, width: g.w, height: g.h, rx: 3, fill, opacity: op }, sv);
      bindTip(rect, () => tipRows(l.name, [["Shape", `${l.c} @ ${l.sp}³`], ["Numbers per token footprint", fint(l.per)]]));
      s("text", { x: g.xc, y: skipH + maxH + 16, "text-anchor": "middle", fill: "var(--pv-strong)", "font-size": "12px", "font-weight": 600, text: l.name }, sv);
      s("text", { x: g.xc, y: skipH + maxH + 32, "text-anchor": "middle", fill: "var(--pv-muted)", "font-size": W < 520 ? "9.5px" : "11px", "font-family": "var(--pv-mono)", text: `${l.c} @ ${l.sp}³` }, sv);
    });
  });
  const drawBars = mount("tok-bars", (el, W) => {
    const D = DIM[tokSize];
    const lv = tokLevels();
    const L = 70, R = 64, T = 10, rh = 24;
    const H = T + lv.length * rh + 30;
    const sv = svgRoot(el, W, H, "Numbers per token footprint");
    const lo = Math.log2(64), hi = Math.log2(32768);
    const x = (v) => L + ((Math.log2(Math.max(64, v)) - lo) / (hi - lo)) * (W - L - R);
    const ticks = W < 520 ? [64, 512, 4096, 32768] : [64, 256, 1024, 4096, 16384];
    xAxis(sv, x, ticks, T, T + lv.length * rh, (t) => (t >= 1024 ? t / 1024 + "k" : t));
    const inner = lv.filter((l) => l.key !== "in" && l.key !== "tok");
    const minPer = inner.length ? Math.min(...inner.map((l) => l.per)) : null;
    lv.forEach((l, i) => {
      const y = T + i * rh + 4, bh = rh - 8;
      let fill = "var(--pv-s1)";
      if (l.key === "in") fill = "var(--pv-base)";
      if (l.key === "tok") fill = "var(--pv-strong)";
      if (l.key !== "in" && l.key !== "tok" && l.per < D) fill = "var(--pv-s2)";
      s("text", { x: L - 10, y: y + bh / 2 + 4, "text-anchor": "end", fill: "var(--pv-text)", "font-size": "12px", text: l.name }, sv);
      const w = Math.max(2, x(l.per) - L);
      s("path", { d: `M${L},${y} h${w - 4} a4,4 0 0 1 4,4 v${bh - 8} a4,4 0 0 1 -4,4 h${-(w - 4)} z`, fill, opacity: l.key === "tok" ? 0.85 : 1 }, sv);
      s("text", { x: L + w + 6, y: y + bh / 2 + 4, fill: "var(--pv-strong)", "font-size": "11.5px", "font-weight": l.per === minPer && l.per < D ? 700 : 400, text: fint(l.per) }, sv);
    });
    // D reference
    const xd = x(D);
    s("line", { x1: xd, x2: xd, y1: T - 4, y2: T + lv.length * rh, stroke: "var(--pv-strong)", "stroke-width": 1.5 }, sv);
    s("text", { x: xd, y: H - 2, "text-anchor": "middle", fill: "var(--pv-strong)", "font-size": "11px", "font-weight": 600, text: `D = ${D}` }, sv);
  });
  function tokStats() {
    const t = TOK[tokVer], D = DIM[tokSize];
    const lv = tokLevels();
    const inner = lv.filter((l) => l.key !== "in" && l.key !== "tok");
    let narrow, rank, rankNote;
    if (!t.ch) { narrow = "—"; rank = Math.min(512, D); rankNote = "linear in 512 voxels"; }
    else {
      const m = Math.min(...inner.map((l) => l.per));
      narrow = fint(m);
      rank = t.skips ? D : Math.min(t.ch[3], D);
      rankNote = t.skips ? "skips bypass ↓8" : `set by ↓8`;
    }
    const limited = rank < D;
    elOrStub("tok-stats").innerHTML = [
      ["Narrowest level (numbers per token)", `${narrow}`, false],
      ["Token dimension D", `${fint(D)}`, false],
      ["Max. rank of token content", `${fint(rank)} <small>of ${fint(D)} · ${rankNote}</small>`, limited],
      ["Tokenizer parameters", `${t.params[tokSize] < 1 ? t.params[tokSize].toFixed(2) : t.params[tokSize].toFixed(1)}<small> M</small>`, false],
    ].map(([l, v, w]) => `<div class="pv-stat"><div class="pv-stat-l">${l}</div><div class="pv-stat-v${w ? " pv-warn" : ""}">${v}</div></div>`).join("");
  }
  function tokUpdate() { drawPipe(); drawBars(); tokStats(); }
  segmented("tok-ver", Object.keys(TOK).map((k) => [k, TOK[k].label]), tokVer, (v) => { tokVer = v; tokUpdate(); });
  segmented("tok-size", Object.keys(DIM).map((k) => [k, k]), tokSize, (v) => { tokSize = v; tokUpdate(); });
  tokStats();

  // PrimusV2-S vs PrimusV3-S tokenizer, following the diagram in the nnU-Net Primus documentation
  mount("v3tok", (el, W) => {
    const narrow = W < 600;
    const nodeW = narrow ? Math.min(124, Math.floor((W - 96) / 2)) : 172;
    const boxH = 34, pitch = narrow ? 44 : 46, plusH = narrow ? 100 : 44, T = 30;
    const colGap = narrow ? 14 : 44;
    const laneGap = narrow ? 10 : 14;
    // width of the whole drawing, used to centre it
    const span = narrow ? 2 * nodeW + colGap + 3 * laneGap + 8 + 34 : 2 * nodeW + colGap + 3 * laneGap + 8 + 168;
    const off = Math.max(1, (W - span) / 2);
    const xV2 = off + nodeW / 2;
    const xV3 = off + nodeW + colGap + nodeW / 2;
    const lane = (j) => xV3 + nodeW / 2 + laneGap * (j + 1); // j = 0: stage1 (inner) … 2: stem (outer)
    const labX = lane(2) + 8;
    const rows = [
      { k: "in", op: "input", v2: "1 @ 64³", v3: "1 @ 64³" },
      { k: "stem", op: "stem (k3,s1)", v2: "32 @ 64³", v3: "32 @ 64³" },
      { k: "s0", op: "stage0 (s2)", v2: "32 @ 32³", v3: "64 @ 32³", chg: true },
      { k: "s1", op: "stage1 (s2)", v2: "64 @ 16³", v3: "256 @ 16³", chg: true },
      { k: "s2", op: "stage2 (s2)", v2: "128 @ 8³", v3: "1024 @ 8³", chg: true },
      { k: "fin", op: "final 1×1", v2: "396 @ 8³", v3: "396 @ 8³" },
      { k: "plus" },
      { k: "tok", op: "tokens", v2: "396 @ 8³", v3: "396 @ 8³" },
      { k: "eva", op: narrow ? "EVA encoder" : "EVA encoder (no spatial change)", v2: "396 @ 8³", v3: "396 @ 8³" },
    ];
    let y = T;
    rows.forEach((r) => { const h = r.k === "plus" ? plusH : pitch; r.yc = y + h / 2; r.h = h; y += h; });
    const H = y + 4;
    const sv = svgRoot(el, W, H, "Side-by-side diagram of the PrimusV2-S and PrimusV3-S tokenizers");
    const defs = s("defs", {}, sv);
    const mk = (id, col) => {
      const m = s("marker", { id, viewBox: "0 0 8 8", refX: 7, refY: 4, markerWidth: 6.5, markerHeight: 6.5, orient: "auto-start-reverse" }, defs);
      s("path", { d: "M0,0 L8,4 L0,8 z", fill: col }, m);
    };
    mk("pv-tk-arr", "var(--pv-base)");
    mk("pv-tk-arr2", "var(--pv-s2)");
    // column titles
    [[xV2, "PrimusV2-S"], [xV3, "PrimusV3-S"]].forEach(([x, t]) => s("text", { x, y: 14, "text-anchor": "middle", fill: "var(--pv-strong)", "font-size": narrow ? "12.5px" : "13.5px", "font-weight": 700, text: t }, sv));
    const plus = rows.find((r) => r.k === "plus");
    const pr = 11;
    // main-path connectors
    [xV2, xV3].forEach((x, ci) => {
      for (let i = 0; i < rows.length - 1; i++) {
        const a = rows[i], b = rows[i + 1];
        const y1 = a.k === "plus" ? (ci ? a.yc + pr : a.yc) : a.yc + boxH / 2;
        const y2 = b.k === "plus" ? (ci ? b.yc - pr - 1 : b.yc) : b.yc - boxH / 2 - 1;
        const arrow = b.k !== "plus" || ci === 1;
        s("line", { x1: x, x2: x, y1, y2, stroke: "var(--pv-base)", "stroke-width": 1.5, "marker-end": arrow ? "url(#pv-tk-arr)" : null }, sv);
      }
    });
    // skip projections (V3): stem → k8,s8 (outer lane), stage0 → k4,s4, stage1 → k2,s2 (inner lane)
    const skips = [["stem", 2, narrow ? "k8,s8" : "skip (k8,s8)"], ["s0", 1, narrow ? "k4,s4" : "skip (k4,s4)"], ["s1", 0, narrow ? "k2,s2" : "skip (k2,s2)"]];
    skips.forEach(([k, j, lab]) => {
      const r = rows.find((q) => q.k === k);
      const lx = lane(j);
      s("path", { d: `M ${xV3 + nodeW / 2} ${r.yc} H ${lx} V ${plus.yc}`, fill: "none", stroke: "var(--pv-s2)", "stroke-width": 1.6, "stroke-linejoin": "round" }, sv);
      s("text", { x: labX, y: r.yc + 4, fill: "var(--pv-text)", "font-size": narrow ? "10.5px" : "11.5px", "font-family": "var(--pv-mono)", text: lab }, sv);
    });
    s("line", { x1: lane(2), x2: xV3 + pr + 2, y1: plus.yc, y2: plus.yc, stroke: "var(--pv-s2)", "stroke-width": 1.6, "marker-end": "url(#pv-tk-arr2)" }, sv);
    s("circle", { cx: xV3, cy: plus.yc, r: pr, fill: "var(--pv-bg)", stroke: "var(--pv-s2)", "stroke-width": 1.6 }, sv);
    s("path", { d: `M ${xV3 - 5} ${plus.yc} H ${xV3 + 5} M ${xV3} ${plus.yc - 5} V ${plus.yc + 5}`, stroke: "var(--pv-s2)", "stroke-width": 1.8, "stroke-linecap": "round" }, sv);
    // Σ annotation: beside the (+) on wide screens (as in the README), below it on narrow ones
    const ax = narrow ? xV3 + 10 : labX;
    const ay = narrow ? plus.yc + 26 : plus.yc + 4;
    const sig = s("text", { x: ax, y: ay, fill: "var(--pv-strong)", "font-size": narrow ? "11px" : "12px", "font-family": "var(--pv-mono)" }, sv);
    [["Σ scale", 0], ["i", 3], [" · proj", -3], ["i", 3]].forEach(([str, dy]) => {
      const sub = str === "i";
      s("tspan", { dy, "font-size": sub ? (narrow ? "8.5px" : "9px") : null, text: str }, sig);
    });
    (narrow ? ["learnable scales,", "init ≈ 1e-5"] : ["learnable scales, init ≈ 1e-5"]).forEach((line, i) =>
      s("text", { x: ax, y: ay + 15 + i * 13, fill: "var(--pv-muted)", "font-size": narrow ? "10.5px" : "11px", text: line }, sv));
    // nodes
    rows.forEach((r) => {
      if (r.k === "plus") return;
      [[xV2, r.v2, false], [xV3, r.v3, !!r.chg]].forEach(([x, shape, chg]) => {
        const g = s("g", {}, sv);
        s("rect", { x: x - nodeW / 2, y: r.yc - boxH / 2, width: nodeW, height: boxH, rx: 6, fill: chg ? "var(--pv-s2soft)" : "var(--pv-bg)", stroke: chg ? "var(--pv-s2)" : "var(--pv-rule)", "stroke-width": chg ? 1.5 : 1 }, g);
        s("text", { x, y: r.yc - 3, "text-anchor": "middle", fill: "var(--pv-text)", "font-size": narrow ? "10.5px" : "11.5px", text: r.op }, g);
        s("text", { x, y: r.yc + 12, "text-anchor": "middle", fill: "var(--pv-strong)", "font-size": narrow ? "11px" : "12px", "font-weight": 500, "font-family": "var(--pv-mono)", text: shape }, g);
      });
    });
  });

  // ---------- excel-derived results ----------
  function cellMean(key, ds) {
    const f = (EX[key] || {})[ds];
    if (!f) return null;
    const v = f.filter((x) => x !== null);
    return { m: mean(v), n: v.length, folds: f };
  }
  function avgOver(key, list) {
    const ms = list.map((d) => cellMean(key, d));
    if (ms.some((c) => !c)) return null;
    return { m: mean(ms.map((c) => c.m)), partial: ms.some((c) => c.n < 5) };
  }

  // Figure 6: what each change adds on the dev datasets (config c: 32 → 64 → 256 → 1024)
  const ABL = [
    ["v2c", "Deeper channels", "var(--pv-s1)"],
    ["v3c", "Deeper channels + skip tokens", "var(--pv-s2)"],
  ];
  const fd = (v) => (v > 0.005 ? "+" : v < -0.005 ? "−" : "±") + Math.abs(v).toFixed(2);
  mount("skip", (el, W) => {
    const rows = DEV.map((d) => ({ d, lab: DS9_LABEL[d] || d, m: (k) => cellMean(k, d).m }))
      .concat([{ d: "avg", lab: "Average", m: (k) => avgOver(k, DEV).m }]);
    rows.forEach((r) => {
      r.base = r.m("v2");
      r.vals = ABL.map(([k]) => r.m(k) - r.base);
      r.ref = r.m("resenc") - r.base;
    });
    const all = rows.flatMap((r) => r.vals.concat([r.ref, 0]));
    const lo = Math.min(...all), hi = Math.max(...all);
    const span = hi - lo;
    const step = [0.1, 0.2, 0.25, 0.5, 1, 2].find((st) => span / st <= 6) || 2;
    const x0 = Math.floor((lo - span * 0.04) / step) * step, x1 = Math.ceil((hi + span * 0.04) / step) * step;
    const narrow = W < 520;
    const L = narrow ? 70 : 92, R = 16, T = 26, rh = narrow ? 28 : 30, gap = 10, below = 20;
    const yBot = T + rows.length * rh + gap + below;
    const H = yBot + 22;
    const sv = svgRoot(el, W, H, "Change in Dice relative to PrimusV2-S per development dataset");
    const x = (v) => L + ((v - x0) / (x1 - x0)) * (W - L - R);
    const ticks = [];
    for (let t = x0; t <= x1 + 1e-9; t += step) ticks.push(Math.round(t * 100) / 100);
    xAxis(sv, x, ticks, T - 6, yBot, (t) => (Math.abs(t) < 1e-9 ? "0" : (t > 0 ? "+" : "−") + Math.abs(t)));
    // zero line = PrimusV2-S
    s("line", { x1: x(0), x2: x(0), y1: T - 10, y2: yBot, stroke: "var(--pv-base)", "stroke-width": 2 }, sv);
    s("text", { x: x(0), y: T - 14, "text-anchor": "middle", fill: "var(--pv-text)", "font-size": "11px", text: `PrimusV2-S (${f2(avgOver("v2", DEV).m)})` }, sv);
    rows.forEach((r, i) => {
      const isAvg = r.d === "avg";
      const y = T + i * rh + rh / 2 + (isAvg ? gap : 0);
      if (isAvg) s("line", { x1: 0, x2: W, y1: y - rh / 2 - gap / 2, y2: y - rh / 2 - gap / 2, stroke: "var(--pv-rule)", "stroke-width": 1 }, sv);
      s("text", { x: L - 12, y: y + 4, "text-anchor": "end", fill: "var(--pv-strong)", "font-size": narrow ? "11.5px" : "12.5px", "font-weight": isAvg ? 700 : 500, text: r.lab }, sv);
      // ResEnc-L reference tick
      s("line", { x1: x(r.ref), x2: x(r.ref), y1: y - 9, y2: y + 9, stroke: "var(--pv-strong)", "stroke-width": 2, "stroke-linecap": "round" }, sv);
      const rhit = s("rect", { x: x(r.ref) - 6, y: y - 11, width: 12, height: 22, fill: "transparent" }, sv);
      bindTip(rhit, () => tipRows(`ResEnc-L · ${r.lab}`, [["Dice", f2(r.m("resenc"))], ["vs PrimusV2-S", fd(r.ref)]]));
      // connector from deeper channels to deeper channels + skips
      s("line", { x1: x(r.vals[0]), x2: x(r.vals[1]), y1: y, y2: y, stroke: "var(--pv-base2)", "stroke-width": 3, "stroke-linecap": "round" }, sv);
      ABL.forEach(([k, lab, col], j) => {
        const v = r.vals[j];
        s("circle", { cx: x(v), cy: y, r: 6.5, fill: col, stroke: "var(--pv-surface)", "stroke-width": 2 }, sv);
        const hit = s("circle", { cx: x(v), cy: y, r: 13, fill: "transparent" }, sv);
        bindTip(hit, () => {
          const pairs = [["Dice", f2(r.m(k))], ["vs PrimusV2-S", fd(v)]];
          if (!isAvg) pairs.push(["Folds", cellMean(k, r.d).folds.map((f) => (f === null ? "–" : f.toFixed(1))).join(" · ")]);
          return tipRows(`${lab} · ${r.lab}`, pairs);
        });
      });
      if (isAvg) {
        // value labels under the two average dots, pushed apart when the dots are close
        const [a, b] = r.vals;
        const xa = x(Math.min(a, b)), xb = x(Math.max(a, b));
        const close = xb - xa < 46;
        const va = a <= b ? a : b, vb = a <= b ? b : a;
        s("text", { x: close ? xa + 4 : xa, y: y + 22, "text-anchor": close ? "end" : "middle", fill: "var(--pv-text)", "font-size": "11.5px", "font-weight": vb === r.vals[1] ? 400 : 700, text: fd(va) }, sv);
        s("text", { x: close ? xb - 4 : xb, y: y + 22, "text-anchor": close ? "start" : "middle", fill: "var(--pv-strong)", "font-size": "11.5px", "font-weight": vb === r.vals[1] ? 700 : 400, text: fd(vb) }, sv);
      }
    });
  });

  // Table 2: ablation on the dev datasets
  const DEV_ROWS = [
    { key: "v2", name: "PrimusV2-S", base: true },
    { key: "v2c", name: "Deeper channels" },
    { key: "v3c", name: "Deeper channels + skip tokens", hl: true },
  ];
  const PRIMUS_KEYS = ["v2", "v2c", "v3c"];
  function foldTitle(c) { return c ? "Folds: " + c.folds.map((v) => (v === null ? "–" : v.toFixed(2))).join(" · ") : ""; }
  function devTable(mode) {
    const best = {};
    DEV.forEach((d) => (best[d] = Math.max(...PRIMUS_KEYS.map((k) => cellMean(k, d).m))));
    const bestAvg = Math.max(...PRIMUS_KEYS.map((k) => avgOver(k, DEV).m));
    const base = {}; DEV.forEach((d) => (base[d] = cellMean("v2", d).m));
    const baseAvg = avgOver("v2", DEV).m;
    const fmt = (v, b, isBase) => {
      if (mode === "dice" || isBase) return f2(v);
      const dlt = v - b;
      const cls = dlt > 0.005 ? "pv-pos" : dlt < -0.005 ? "pv-neg" : "";
      return `<span class="${cls}">${dlt >= 0 ? "+" : "−"}${Math.abs(dlt).toFixed(2)}</span>`;
    };
    let h = `<table class="pv-table"><thead><tr><th>Model</th>${DEV.map((d) => `<th>${d}</th>`).join("")}<th class="pv-avg">Avg</th></tr></thead><tbody>`;
    DEV_ROWS.forEach((r) => {
      h += `<tr${r.hl ? ' class="pv-hl2"' : r.base ? ' class="pv-hl"' : ""}><td>${r.name}</td>`;
      DEV.forEach((d) => {
        const c = cellMean(r.key, d);
        const isBest = Math.abs(c.m - best[d]) < 1e-9;
        h += `<td class="${isBest ? "pv-best" : ""}" title="${foldTitle(c)}">${fmt(c.m, base[d], r.base)}</td>`;
      });
      const a = avgOver(r.key, DEV);
      const isBestA = Math.abs(a.m - bestAvg) < 1e-9;
      h += `<td class="pv-avg${isBestA ? " pv-best" : ""}">${fmt(a.m, baseAvg, r.base)}</td></tr>`;
    });
    elOrStub("tbl-dev").innerHTML = h + "</tbody></table>";
  }
  segmented("dev-mode", [["dice", "Dice"], ["delta", "Δ vs PrimusV2-S"]], "dice", devTable);
  devTable("dice");

  // Table 3: PrimusV2-S vs PrimusV3-S on all nine datasets (published test-set numbers)
  (function () {
    const rows = [
      { n: "nnU-Net", label: "nnU-Net (default)" },
      { n: "nnU-Net ResEnc-L", label: "nnU-Net ResEnc-L" },
      { n: "PrimusV2-S", label: "PrimusV2-S", cls: "pv-hl" },
      { n: "PrimusV3-S", label: "PrimusV3-S", cls: "pv-hl2" },
    ].map((r) => Object.assign(r, PUB.find((p) => p.n === r.n)));
    const best = DS9.map((_, j) => Math.max(...rows.map((r) => r.v[j])));
    const bestA = Math.max(...rows.map((r) => r.a));
    let h = `<table class="pv-table pv-dense"><thead><tr><th>Model</th>${DS9.map((d) => `<th>${DS9_LABEL[d] || d}</th>`).join("")}<th class="pv-avg">Avg</th></tr></thead><tbody>`;
    rows.forEach((r) => {
      h += `<tr${r.cls ? ` class="${r.cls}"` : ""}><td>${r.label}</td>${r.v.map((v, j) => `<td class="${v === best[j] ? "pv-best" : ""}">${f2(v)}</td>`).join("")}<td class="pv-avg${r.a === bestA ? " pv-best" : ""}">${f2(r.a)}</td></tr>`;
    });
    elOrStub("tbl-all").innerHTML = h + "</tbody></table>";
  })();

  // Table 4: published
  (function () {
    const order = ["nnU-Net", "nnU-Net ResEnc-L", "MedNeXt-L", "CoTr", "Primus-S", "Primus-M", "PrimusV2-S", "PrimusV2-M", "PrimusV3-S"];
    const rows = order.map((n) => PUB.find((r) => r.n === n));
    const best = DS9.map((_, j) => Math.max(...rows.map((r) => r.v[j])));
    const bestA = Math.max(...rows.map((r) => r.a));
    const sbm = DS9.indexOf("SBM");
    let h = `<table class="pv-table pv-dense"><thead><tr><th>Model</th><th>Params</th>${DS9.map((d, j) => `<th${j === sbm ? ' class="pv-colhl"' : ""}>${DS9_LABEL[d] || d}</th>`).join("")}<th class="pv-avg">Avg</th></tr></thead><tbody>`;
    let lastG = null;
    rows.forEach((r) => {
      if (r.g !== lastG) {
        const gl = { cnn: "CNN baselines", hyb: "Best hybrid transformer", v1: "Primus", v2: "PrimusV2 (TMLR)", v3: "PrimusV3" }[r.g];
        h += `<tr class="pv-grp"><td colspan="${DS9.length + 3}">${gl}</td></tr>`;
        lastG = r.g;
      }
      h += `<tr${r.g === "v3" ? ' class="pv-hl2"' : ""}><td>${r.n}</td><td>${r.p.toFixed(1)}M</td>${r.v.map((v, j) => `<td class="${v === best[j] ? "pv-best " : ""}${j === sbm ? "pv-colhl" : ""}">${f2(v)}</td>`).join("")}<td class="pv-avg${r.a === bestA ? " pv-best" : ""}">${f2(r.a)}</td></tr>`;
    });
    elOrStub("tbl-pub").innerHTML = h + "</tbody></table>";
  })();
  // Table 5: decoder size (fold 0, mean over nine datasets)
  (function () {
    const rows = [
      { n: "Default decoder", v: 79.77, ref: true },
      { n: "Custom decoder S", v: 79.98 },
      { n: "Custom decoder B", v: 79.66 },
      { n: "Custom decoder L", sub: "diverged on ATLAS (0 Dice)", v: 71.15 },
      { n: "Custom decoder L, 10× lower LR", v: 79.72 },
    ];
    const base = rows[0].v;
    let h = `<table class="pv-table"><thead><tr><th>Decoder</th><th>Mean Dice</th><th>Δ vs default</th></tr></thead><tbody>`;
    rows.forEach((r) => {
      const d = r.v - base, cls = d > 0.005 ? "pv-pos" : d < -0.005 ? "pv-neg" : "";
      h += `<tr${r.ref ? ' class="pv-hl"' : ""}><td>${r.n}${r.sub ? `<span class="pv-sub">${r.sub}</span>` : ""}</td><td>${f2(r.v)}</td><td>${r.ref ? "—" : `<span class="${cls}">${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(2)}</span>`}</td></tr>`;
    });
    elOrStub("tbl-dec").innerHTML = h + "</tbody></table>";
  })();

  // Table 6: GoldenGate RoPE sweep (fold 0), complete runs only
  (function () {
    const DS = ["ACDC", "AMOS22", "KiTS23", "LiTS"];
    const rows = [
      { grp: "References" },
      { n: "nnU-Net (default)", v: [92.43, 88.75, 86.22, 82.48] },
      { n: "nnU-Net ResEnc-L", v: [93.05, 89.65, 89.16, 82.89] },
      { n: "Early Primus-M, axial RoPE", v: [92.68, 87.98, 88.87, 82.89], hl: true },
      { grp: "Primus, GoldenGate RoPE (min / max frequency)" },
      { n: "0.2 / 2.0", v: [92.42, 88.03, 86.42, 80.86] },
      { n: "0.2 / 1.0", v: [92.53, 87.47, 85.85, 81.59] },
      { n: "0.2 / 5.0", v: [92.68, 88.00, 85.78, 79.92] },
      { n: "0.1 / 2.0", v: [92.72, 88.05, 84.28, 80.66] },
      { n: "0.2 / 0.5", v: [92.67, 87.25, 86.73, 78.66] },
      { n: "0.1 / 5.0", v: [92.74, 87.93, 79.67, 81.47] },
      { n: "0.1 / 0.5", v: [92.51, 87.33, 82.55, 76.30] },
    ];
    let h = `<table class="pv-table"><thead><tr><th>Model</th>${DS.map((d) => `<th>${d}</th>`).join("")}<th class="pv-avg">Avg</th></tr></thead><tbody>`;
    rows.forEach((r) => {
      if (r.grp) { h += `<tr class="pv-grp"><td colspan="${DS.length + 2}">${r.grp}</td></tr>`; return; }
      h += `<tr${r.hl ? ' class="pv-hl"' : ""}><td>${r.n}</td>${r.v.map((v) => `<td>${f2(v)}</td>`).join("")}<td class="pv-avg">${f2(mean(r.v))}</td></tr>`;
    });
    elOrStub("tbl-gg").innerHTML = h + `</tbody></table>`;
  })();
})();
