import { answerQuestion, replyLang } from "@/lib/advisor";
import { demoSpace } from "@/lib/mock";
import type { Lang } from "@/lib/types";

/**
 * Checks on the mentor that the type system cannot make.
 *
 * The two bugs this was written for: replies came back in the interface
 * language rather than the language of the question, and keyword matching ran
 * on raw substrings, so "мать" fired inside "заниматься" and "игр" inside
 * "выиграл" — sending sport and trivia questions to the parenting and
 * distraction answers.
 */

const space = demoSpace();
const student = space.students[space.activeStudent!];

let fails = 0;
const ok = (label: string, pass: boolean, detail = "") => {
  if (!pass) {
    fails++;
    console.log(`FAIL ${label} ${detail}`);
  } else {
    console.log(`ok   ${label}`);
  }
};

console.log("--- language follows the question, not the interface ---");
const langCases: [string, Lang][] = [
  ["Блин у меня мотивация пропала", "ru"],
  ["I am completely burnt out", "en"],
  ["Мен шаршадым", "kk"],
  ["Бүгін не істеймін", "kk"],
  ["объясни present perfect", "ru"],
  ["12345", "en"],
];
for (const [text, want] of langCases) {
  const got = replyLang(text, "en");
  ok(`${JSON.stringify(text)} -> ${want}`, got === want, `got ${got}`);
}

// The interface is in English; the student writes Russian and must get Russian.
const crossLang = answerQuestion("Блин у меня мотивация пропала", student, "en");
ok("Russian question with English UI answers in Russian", /[а-яё]/i.test(crossLang.text));

const switched = answerQuestion("переведи на русский", student, "en");
ok("an explicit language request switches instead of refusing", /[а-яё]/i.test(switched.text) && !switched.text.includes("material"));

console.log("\n--- keywords anchor to word starts ---");
const routes: [string, string][] = [
  ["стоит ли заниматься спортом", "упирается в тело"],
  ["родители давят на меня", "Давление близких"],
  ["телефон отвлекает", "расстояние до соблазна"],
  ["я тупой наверное", "«Не дано»"],
  ["кто ты такой", "наставник внутри Brain"],
];
for (const [q, expect] of routes) {
  const got = answerQuestion(q, student, "ru").text;
  ok(q, got.includes(expect), `got "${got.slice(0, 60)}…"`);
}

console.log("\n--- off-topic is answered, never refused ---");
const offTopic = ["кто выиграл чемпионат мира в 1998", "какая погода завтра", "расскажи анекдот"];
for (const q of offTopic) {
  const reply = answerQuestion(q, student, "ru");
  // It may not know the answer, but it must not brush the student off with
  // "I only work from the course material", and it must offer something.
  ok(q, !/только по материал|only.*course material/i.test(reply.text) && (reply.bullets?.length ?? 0) > 0);
}

console.log(fails === 0 ? "\nALL PASS" : `\n${fails} FAILURES`);
process.exit(fails === 0 ? 0 : 1);
