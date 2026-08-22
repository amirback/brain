// Аудит вёрстки: 23 страницы x 4 ширины x 3 языка. Ищет горизонтальную
// прокрутку, элемент шире родительской колонки и наложение заголовка на карточку.
//
// Playwright не входит в зависимости проекта — он нужен только для этих
// проверок и тянет за собой браузер. Перед запуском:
//   npm i -D playwright && npx playwright install chromium
//   npm run build && npm start
//   node scripts/layout-audit.mjs

import { chromium } from "playwright";
const base = "http://localhost:3000";
const ROUTES = ["/","/start/","/dashboard/","/plan/","/learn/","/practice/","/diagnostic/","/assistant/",
  "/inbox/","/league/","/profile/","/teacher/","/parent/","/demo/","/mock/",
  "/sat/","/sat/practice/","/sat/mock/","/ielts/","/ielts/practice/","/ielts/writing/","/ielts/speaking/","/ielts/mock/"];
const WIDTHS = [360, 390, 768, 1280];
const LANGS = ["kk", "ru", "en"];

const PROBE = (vw) => {
  const out = [];
  const desc = (el) => {
    const c = typeof el.className === "string" ? el.className.split(" ").filter(Boolean).slice(0,2).join(".") : "";
    return el.tagName.toLowerCase() + (c ? "." + c : "");
  };
  const txt = (el) => (el.textContent || "").trim().replace(/\s+/g," ").slice(0, 34);

  if (document.documentElement.scrollWidth > vw + 1)
    out.push({ k: "ПРОКРУТКА", d: `документ ${document.documentElement.scrollWidth} > ${vw}` });

  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const cs = getComputedStyle(el);
    if (cs.position === "fixed" || cs.visibility === "hidden") continue;

    // 1. шире родительской колонки — то, из-за чего заголовок лёг на карточку
    const par = el.parentElement;
    if (par && par !== document.body) {
      const pcs = getComputedStyle(par);
      const pr = par.getBoundingClientRect();
      const flows = cs.position === "static" || cs.position === "relative";
      const parentClips = pcs.overflowX !== "visible";
      if (flows && !parentClips && pr.width > 2 && (r.right > pr.right + 4 || r.left < pr.left - 4)) {
        out.push({ k: "ШИРЕ КОЛОНКИ", d: `${desc(el)} "${txt(el)}" вылезает на ${Math.round(Math.max(r.right-pr.right, pr.left-r.left))}px` });
      }
    }

    // 2. текст обрезан своей коробкой
    if (el.children.length === 0 && (el.textContent||"").trim().length > 2 &&
        el.scrollWidth > el.clientWidth + 2 && cs.overflowX === "hidden") {
      out.push({ k: "ТЕКСТ ОБРЕЗАН", d: `${desc(el)} "${txt(el)}" ${el.scrollWidth}>${el.clientWidth}` });
    }
  }

  // 3. крупный текст, накрытый карточкой
  const heads = [...document.querySelectorAll("h1,h2,h3")];
  const cards = [...document.querySelectorAll("body *")].filter((e) => {
    const cs = getComputedStyle(e);
    return cs.boxShadow !== "none" && e.getBoundingClientRect().width > 80;
  });
  for (const h of heads) {
    const a = h.getBoundingClientRect();
    if (a.width < 2) continue;
    for (const c of cards) {
      if (h.contains(c) || c.contains(h)) continue;
      const b = c.getBoundingClientRect();
      const ox = Math.min(a.right,b.right) - Math.max(a.left,b.left);
      const oy = Math.min(a.bottom,b.bottom) - Math.max(a.top,b.top);
      if (ox > 12 && oy > 12) {
        out.push({ k: "НАЛОЖЕНИЕ", d: `${desc(h)} "${txt(h)}" под ${desc(c)} (${Math.round(ox)}x${Math.round(oy)}px)` });
        break;
      }
    }
  }
  return out;
};

const b = await chromium.launch();
const found = [];
for (const lang of LANGS) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + "/", { waitUntil: "domcontentloaded" });
  await p.evaluate((l) => localStorage.setItem("brain.lang", l), lang);
  for (const w of WIDTHS) {
    await p.setViewportSize({ width: w, height: 900 });
    for (const route of ROUTES) {
      try { await p.goto(base + route, { waitUntil: "networkidle", timeout: 12000 }); } catch { continue; }
      await p.waitForTimeout(180);
      const res = await p.evaluate(PROBE, w);
      for (const r of res) found.push({ lang, w, route, ...r });
    }
  }
  await ctx.close();
}
await b.close();

if (!found.length) console.log("чисто");
else {
  const byKind = {};
  for (const f of found) (byKind[f.k] ||= []).push(f);
  console.log("НАЙДЕНО:", found.length);
  for (const [k, list] of Object.entries(byKind)) {
    console.log(`\n### ${k} (${list.length})`);
    const seen = new Set();
    for (const f of list) {
      const key = f.route + f.d.slice(0, 50);
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`  [${f.lang} ${f.w}] ${f.route} — ${f.d}`);
      if (seen.size > 30) { console.log("  ..."); break; }
    }
  }
}
