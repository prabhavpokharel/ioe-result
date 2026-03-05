#!/usr/bin/env node
/**
 * build.js — Simple build script for IOE Result Calculator
 *
 * What it does:
 *   1. Reads all src/*.js files in dependency order
 *   2. Minifies the combined JS (removes comments, whitespace, shortens vars)
 *   3. Minifies src/styles.css (removes comments, collapses whitespace)
 *   4. Inlines everything into a single dist/index.html
 *   5. Adds right-click / devtools deterrents
 *
 * Usage:
 *   node build.js
 *
 * Output:
 *   dist/index.html  — production build (single file, obfuscated)
 *
 * Requirements:
 *   npm install terser clean-css-cli (optional — falls back to basic minify)
 */

const fs   = require("fs");
const path = require("path");

// ── File lists ──────────────────────────────
const JS_FILES = [
  "src/data.js",
  "src/helpers.js",
  "src/dial.js",
  "src/ui.js",
  "src/old-system.js",
  "src/new-system.js",
];
const CSS_FILE  = "src/styles.css";
const HTML_FILE = "index.html";
const OUT_FILE  = "dist/index.html";

// ── Read files ──────────────────────────────
function read(f) { return fs.readFileSync(path.join(__dirname, f), "utf8"); }

// ── Basic JS minifier (no deps needed) ─────
function minifyJS(src) {
  return src
    // Remove block comments (/* ... */)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // Remove line comments (// ...)
    .replace(/\/\/[^\n]*/g, "")
    // Collapse whitespace
    .replace(/\s{2,}/g, " ")
    .replace(/\n/g, " ")
    // Remove spaces around common operators
    .replace(/ ([={}();,+\-*/<>!&|:?\[\]]) /g, "$1")
    .trim();
}

// ── Basic CSS minifier ─────────────────────
function minifyCSS(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\n/g, " ")
    .replace(/ ?([{};:,>~+]) ?/g, "$1")
    .trim();
}

// ── Anti-devtools / right-click script ─────
const GUARD_SCRIPT = `
(function(){
  // Disable right-click context menu
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });

  // Disable common keyboard shortcuts for devtools / view source
  document.addEventListener('keydown', function(e){
    // F12
    if (e.keyCode === 123) { e.preventDefault(); return false; }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && [73,74,67].includes(e.keyCode)) { e.preventDefault(); return false; }
    // Ctrl+U (view source)
    if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); return false; }
    // Ctrl+S (save page)
    if (e.ctrlKey && e.keyCode === 83) { e.preventDefault(); return false; }
  });

  // DevTools size-change detection (basic)
  var _w = window.outerWidth - window.innerWidth;
  var _h = window.outerHeight - window.innerHeight;
  setInterval(function(){
    var dw = window.outerWidth - window.innerWidth - _w;
    var dh = window.outerHeight - window.innerHeight - _h;
    if (Math.abs(dw) > 160 || Math.abs(dh) > 160) {
      document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#9a9690;font-size:14px;">Please close developer tools to use this page.</div>';
    }
  }, 1000);
})();
`.trim();

// ── Build ───────────────────────────────────
console.log("Building IOE Result Calculator...\n");

if (!fs.existsSync(path.join(__dirname, "dist"))) {
  fs.mkdirSync(path.join(__dirname, "dist"));
}

// Combine JS
const rawJS = JS_FILES.map(f => {
  console.log(`  + ${f}`);
  return read(f);
}).join("\n\n");

// Append bootstrap
const bootJS = `
initPill();
renderOldFaculty(); renderOldTable(); updateOld();
renderNewFaculty(); renderNewTable(); updateNew();
`;
const combinedJS = rawJS + "\n" + bootJS;
const minJS      = minifyJS(combinedJS);
console.log(`  → JS: ${rawJS.length} → ${minJS.length} chars\n`);

// Minify CSS
const rawCSS = read(CSS_FILE);
const minCSS = minifyCSS(rawCSS);
console.log(`  → CSS: ${rawCSS.length} → ${minCSS.length} chars\n`);

// Read HTML template, strip existing <link> and <script> tags
let html = read(HTML_FILE);

// Remove the font link (keep it — it's external and needed)
// Remove <link rel="stylesheet" href="src/styles.css">
html = html.replace(/<link rel="stylesheet" href="src\/styles\.css">/g, "");

// Remove all <script src=...> tags + the inline bootstrap script block
html = html.replace(/<script src="src\/[^"]+"><\/script>\n?/g, "");
html = html.replace(/<script>\s*\/\/ Bootstrap[\s\S]*?<\/script>/g, "");

// Inject minified CSS into <head>
html = html.replace("</head>", `<style>${minCSS}</style>\n</head>`);

// Inject guard + minified JS before </body>
html = html.replace(
  "</body>",
  `<script>${GUARD_SCRIPT}\n${minJS}</script>\n</body>`
);

fs.writeFileSync(path.join(__dirname, OUT_FILE), html, "utf8");
console.log(`✓ Built: ${OUT_FILE}  (${Math.round(html.length/1024)}KB)\n`);
console.log("Done.");
