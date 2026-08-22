// Сквозной прогон: онбординг -> диагностика -> кабинет -> план -> урок ->
// практика -> SAT-набор -> панель учителя.
//
// Playwright не входит в зависимости проекта — он нужен только для этих
// проверок и тянет за собой браузер. Перед запуском:
//   npm i -D playwright && npx playwright install chromium
//   npm run build && npm start
//   node scripts/e2e-smoke.mjs

import { chromium } from "playwright";
const base = "http://localhost:3000";
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 1280, height: 950 } });
const p = await c.newPage();

const errors = [];
p.on("pageerror", (e) => errors.push(["JS", p.url().replace(base,""), e.message.slice(0,80)]));
p.on("console", (m) => { if (m.type() === "error") errors.push(["КОНСОЛЬ", p.url().replace(base,""), m.text().slice(0,80)]); });
p.on("response", (r) => { if (r.status() >= 400) errors.push(["HTTP "+r.status(), p.url().replace(base,""), r.url().slice(-50)]); });

const step = [];
const ok = (name, cond, extra="") => { step.push(`${cond ? "ok  " : "ПРОВАЛ"} ${name}${extra?" — "+extra:""}`); return cond; };
const tap = async (re, wait=500) => {
  const e = p.locator("main button, main a").filter({ hasText: re }).first();
  if (!(await e.count())) return false;
  await e.click({ force: true }); await p.waitForTimeout(wait); return true;
};
// Вариант ответа помечен ЛАТИНСКОЙ буквой A–D. Кириллица здесь важна:
// кнопки «Математика», «Английский», «Ученик» начинаются с кириллических
// А/М/У, которые выглядят как латинские, но это другие символы, — поэтому
// латинский диапазон отсекает интерфейс и оставляет только ответы.
const options = async () => {
  const out = [];
  for (const x of await p.locator("main button").all()) {
    const t = ((await x.textContent()) || "").replace(/\s+/g, " ").trim();
    if (/^[A-D]/.test(t) && t.length > 2) out.push({ x, t });
  }
  return out;
};

// ---- 1. онбординг
// Свежий браузер открывает сайт на английском — язык надо выставить явно,
// иначе русские подписи не находятся и тест «падает» на пустом месте.
await p.goto(base + "/", { waitUntil: "domcontentloaded" });
await p.evaluate(() => localStorage.setItem("brain.lang", "ru"));
await p.goto(base + "/start/", { waitUntil: "networkidle" });
await p.waitForTimeout(1100);
await tap(/^Начать$/);
ok("экран выбора роли", await tap(/^Ученик/i, 800));
await p.getByPlaceholder(/имя|name|аты/i).first().fill("Аружан");
ok("поле имени", true);
await tap(/^11$/, 450);
await tap(/^ЕНТ\b|^UNT\b|^ҰБТ\b/, 650);
// Математика уже выбрана по умолчанию для цели «ЕНТ» — не трогаем,
// иначе предметов останется ноль и кнопка справедливо заблокируется.
ok("переход к диагностике", await tap(/диагностик|diagnostic/i, 1200));

// ---- 2. диагностика
// У диагностики есть вводный экран: до вопросов надо нажать «Поехали».
await p.waitForURL(/diagnostic/, { timeout: 8000 }).catch(() => {});
await p.waitForTimeout(900);
ok("диагностика открылась", /diagnostic/.test(p.url()), p.url().replace(base, ""));
await tap(/Поехали|Начать|Let's go|Бастау/i, 900);
// Порядок в карточке вопроса: выбрать вариант -> «Ответить» (до выбора она
// выключена) -> «Дальше». Раньше цикл жал сразу «Дальше», которой на этом
// шаге ещё нет, и диагностика не двигалась.
const answerOne = async (idx) => {
  const o = await options();
  if (!o.length) return false;
  await o[idx % o.length].x.click();
  await p.waitForTimeout(300);
  if (!(await tap(/^Ответить$|^Answer$|^Жауап/i, 700))) return false;
  await tap(/дальше|далее|next|следующ|результат|готово|завершить|finish/i, 650);
  return true;
};

let answered = 0;
for (let i = 0; i < 20; i++) { if (await answerOne(i)) answered++; else break; }
ok("диагностика пройдена", answered >= 5, `${answered} вопросов`);
await p.waitForTimeout(1200);

// ---- 3. кабинет
await p.goto(base + "/dashboard/", { waitUntil: "networkidle" }); await p.waitForTimeout(1200);
const dash = await p.locator("body").innerText();
ok("кабинет не пустой", dash.length > 400, `${dash.length} символов`);
ok("в кабинете есть рейтинг", /ELO|рейтинг/i.test(dash));

// ---- 4. план
await p.goto(base + "/plan/", { waitUntil: "networkidle" }); await p.waitForTimeout(900);
const plan = await p.locator("body").innerText();
ok("план построен", /День|Күн|Day/i.test(plan));

// ---- 5. урок
await p.goto(base + "/learn/", { waitUntil: "networkidle" }); await p.waitForTimeout(900);
let steps = 0;
for (let i = 0; i < 6; i++) { if (await tap(/^Дальше|^Next|^Әрі/i, 400)) steps++; else break; }
ok("урок листается", steps >= 3, `${steps} шагов`);

// ---- 6. практика: ответить неверно и увидеть разбор
await p.goto(base + "/practice/", { waitUntil: "networkidle" }); await p.waitForTimeout(1100);
const po = await options();
let explained = false;
if (po.length >= 2) {
  await po[po.length - 1].x.click(); await p.waitForTimeout(300);
  await tap(/^Ответить$|^Answer$/i, 900);
  const t = await p.locator("body").innerText();
  explained = /Объясн|Разбор|Explan|Түсінд|Почему|верн/i.test(t);
}
ok("практика даёт разбор после ответа", explained);

// ---- 7. SAT-набор
// У набора есть экран-брифинг (сколько вопросов, сколько минут) — модуль
// начинается по кнопке, как на настоящем экзамене.
await p.goto(base + "/sat/practice/?set=sat-rw-craft", { waitUntil: "networkidle" }); await p.waitForTimeout(1400);
await tap(/^Начать$|^Start$|^Бастау$/i, 1100);
const so = await options();
ok("SAT-набор отдаёт вопросы", so.length >= 2, `${so.length} вариантов`);
if (so.length) { await so[0].x.click(); await p.waitForTimeout(400); }

// ---- 8. панель учителя
await p.goto(base + "/start/", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
await tap(/Сменить роль|Switch role|Рөл/i, 700);
await tap(/^Учитель|^Teacher|^Мұғалім/i, 900);
await p.goto(base + "/teacher/", { waitUntil: "networkidle" }); await p.waitForTimeout(1200);
const teach = await p.locator("body").innerText();
ok("панель учителя открылась", teach.length > 300, `${teach.length} символов`);
ok("в панели есть класс или код", /CL-|класс|сынып|class/i.test(teach));

console.log(step.join("\n"));
console.log("\n--- ошибки в консоли:", errors.length);
for (const e of errors.slice(0, 10)) console.log("   ", e[0], "|", e[1], "|", e[2]);
await b.close();
