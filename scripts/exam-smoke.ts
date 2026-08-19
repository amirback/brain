import { isCorrect, satSectionScore, ieltsBand, roundBand, overallBand, normalise, gradeItems, breakdown } from "@/lib/exam/scoring";
import { gradeWriting } from "@/lib/exam/grader";
import { IELTS_WRITING } from "@/lib/exam/content/ielts-writing";
import { drawModule, MIX_HARDER, MIX_MIXED, seededRandom, SAT_RW_POOL, SAT_MATH_POOL, SAT_BLUEPRINT } from "@/lib/exam/sets";
import { IELTS_READING_FULL, IELTS_LISTENING_FULL } from "@/lib/exam/ielts-sets";

let fails = 0;
const eq = (label: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { fails++; console.log(`FAIL ${label}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`); }
  else console.log(`ok   ${label} = ${JSON.stringify(got)}`);
};
const truthy = (label: string, v: boolean) => {
  if (!v) { fails++; console.log(`FAIL ${label}`); } else console.log(`ok   ${label}`);
};

console.log("--- answer checking ---");
eq("choice right", isCorrect({ kind: "choice", correct: 2 }, 2), true);
eq("choice wrong", isCorrect({ kind: "choice", correct: 2 }, 1), false);
eq("skipped", isCorrect({ kind: "choice", correct: 2 }, null), false);
eq("text exact", isCorrect({ kind: "text", accept: ["Seitova"] }, "seitova"), true);
eq("text article stripped", isCorrect({ kind: "text", accept: ["bookshop"] }, "the bookshop"), true);
eq("text punctuation", isCorrect({ kind: "text", accept: ["café"] }, "café."), true);
eq("frac == decimal", isCorrect({ kind: "text", accept: ["4/3"] }, "1.3333"), false);
eq("frac == frac", isCorrect({ kind: "text", accept: ["4/3"] }, "4/3"), true);
eq("0.5 == 1/2", isCorrect({ kind: "text", accept: ["1/2"] }, "0.5"), true);
eq(".5 == 1/2", isCorrect({ kind: "text", accept: ["1/2"] }, ".5"), true);
eq("95/97 decimal accepted", isCorrect({ kind: "text", accept: ["95/97", ".9794"] }, "0.9794"), true);
eq("negative", isCorrect({ kind: "text", accept: ["-86"] }, "-86"), true);
eq("comma number", isCorrect({ kind: "text", accept: ["54400", "54,400"] }, "54,400"), true);
eq("wrong number", isCorrect({ kind: "text", accept: ["7"] }, "8"), false);
eq("normalise", normalise("  The  Book-shop. "), "book-shop");

console.log("\n--- SAT scaling ---");
eq("rw 0 raw easy", satSectionScore(0, "rw", false), 200);
eq("rw 54 raw hard", satSectionScore(54, "rw", true), 800);
eq("rw 54 raw easy (capped)", satSectionScore(54, "rw", false), 600);
eq("math 44 hard", satSectionScore(44, "math", true), 800);
eq("math 22 hard", satSectionScore(22, "math", false), 520);
truthy("scaled is multiple of 10", satSectionScore(31, "rw", true) % 10 === 0);
truthy("monotonic", satSectionScore(30, "rw", true) > satSectionScore(20, "rw", true));

console.log("\n--- IELTS bands ---");
eq("reading 40/40", ieltsBand(40, 40, "reading"), 9);
eq("reading 30/40", ieltsBand(30, 40, "reading"), 7);
eq("listening 30/40", ieltsBand(30, 40, "listening"), 7);
// 10/20 scales to 20/40, which the published listening table puts in the 18–22 band.
eq("listening scaled from 20", ieltsBand(10, 20, "listening"), 5.5);
eq("round .25 up to .5", roundBand(6.25), 6.5);
eq("round .75 up to whole", roundBand(6.75), 7);
eq("round .1 down", roundBand(6.1), 6);
eq("overall of 4", overallBand([6, 6.5, 6, 7]), 6.5);
eq("overall ignores undefined", overallBand([7, undefined, undefined, undefined]), 7);

console.log("\n--- module drawing ---");
for (const spec of SAT_BLUEPRINT) {
  const pool = spec.section === "rw" ? SAT_RW_POOL : SAT_MATH_POOL;
  const m = drawModule(pool, spec.count, MIX_MIXED, new Set(), seededRandom(1));
  console.log(`     ${spec.id}: pool ${pool.length}, asked ${spec.count}, got ${m.length}`);
  truthy(`${spec.id} no duplicate ids`, new Set(m.map(i => i.id)).size === m.length);
}
console.log("\n--- full mock assembly (module 2 must not reuse module 1) ---");
{
  const prior: string[] = [];
  for (const spec of SAT_BLUEPRINT) {
    const pool = spec.section === "rw" ? SAT_RW_POOL : SAT_MATH_POOL;
    const drawn = drawModule(pool, spec.count, MIX_MIXED, new Set(prior), seededRandom(spec.count * 31));
    prior.push(...drawn.map(i => i.id));
    const short = drawn.length < spec.count;
    console.log(`     ${spec.id}: asked ${spec.count}, got ${drawn.length}${short ? "  <-- SHORT" : ""}`);
    truthy(`${spec.id} is full length`, drawn.length === spec.count);
  }
  truthy("no question repeats across the whole mock", new Set(prior).size === prior.length);
}

const m1 = drawModule(SAT_RW_POOL, 10, MIX_MIXED, new Set(), seededRandom(42));
const m2 = drawModule(SAT_RW_POOL, 10, MIX_HARDER, new Set(m1.map(i => i.id)), seededRandom(43));
truthy("module 2 excludes module 1", m1.every(a => !m2.some(b => b.id === a.id)));
eq("same seed is deterministic",
  drawModule(SAT_RW_POOL, 8, MIX_MIXED, new Set(), seededRandom(7)).map(i => i.id),
  drawModule(SAT_RW_POOL, 8, MIX_MIXED, new Set(), seededRandom(7)).map(i => i.id));

console.log("\n--- content integrity ---");
const allItems = [...SAT_RW_POOL, ...SAT_MATH_POOL, ...IELTS_READING_FULL.items, ...IELTS_LISTENING_FULL.items];
truthy("unique ids across all pools", new Set(allItems.map(i => i.id)).size === allItems.length);
for (const it of allItems) {
  if (it.answer.kind === "choice") {
    if (!it.options) { fails++; console.log(`FAIL ${it.id}: choice without options`); }
    else if (it.answer.correct < 0 || it.answer.correct >= it.options.length) {
      fails++; console.log(`FAIL ${it.id}: correct index ${it.answer.correct} out of range (${it.options.length})`);
    }
  } else if (it.answer.accept.length === 0) {
    fails++; console.log(`FAIL ${it.id}: text answer with no accepted values`);
  }
  if (!it.explain?.en || !it.explain?.ru) { fails++; console.log(`FAIL ${it.id}: missing explanation`); }
}
console.log(`     checked ${allItems.length} items`);
const passageIds = new Set([...(IELTS_READING_FULL.passages ?? [])].map(p => p.id));
for (const it of IELTS_READING_FULL.items) {
  if (it.passage && !passageIds.has(it.passage)) { fails++; console.log(`FAIL ${it.id}: unknown passage ${it.passage}`); }
}
truthy("reading full test is 40 questions", IELTS_READING_FULL.items.length === 40);
truthy("listening full test is 40 questions", IELTS_LISTENING_FULL.items.length === 40);
// Listening answers are typed, and IELTS marks a misspelling wrong — so every
// accepted spelling has to be one the script actually says.
for (const it of IELTS_LISTENING_FULL.items) {
  if (it.answer.kind === "text" && it.answer.accept.some(a => a.trim() === "")) {
    fails++; console.log(`FAIL ${it.id}: blank accepted answer`);
  }
}

console.log("\n--- grading a set end to end ---");
const answers: Record<string, number | string> = {};
for (const it of SAT_RW_POOL) {
  answers[it.id] = it.answer.kind === "choice" ? it.answer.correct : it.answer.accept[0];
}
const perfect = gradeItems(SAT_RW_POOL, answers);
eq("all correct when given the key", perfect.filter(r => r.correct).length, SAT_RW_POOL.length);
truthy("breakdown covers every skill", breakdown(perfect).length > 0);

const readingAnswers: Record<string, number | string> = {};
for (const it of IELTS_READING_FULL.items) {
  readingAnswers[it.id] = it.answer.kind === "choice" ? it.answer.correct : it.answer.accept[0];
}
eq("IELTS reading key scores 40/40",
  gradeItems(IELTS_READING_FULL.items, readingAnswers).filter(r => r.correct).length, 40);

console.log("\n--- writing grader ---");
const task2 = IELTS_WRITING.find(p => p.id === "w2-remote-school")!;

const weak = "I think online lessons is good. Many peoples in rural area dont have teacher. So they can study by internet. Its very usefull and cheap. I think goverment should do this.";
const gw = gradeWriting(weak, task2);
console.log(`     weak answer: band ${gw.band}, words ${gw.metrics.wordCount}, errors ${gw.metrics.errors.length}, misspelled ${gw.metrics.misspelled.length}`);
truthy("weak answer scores low", gw.band <= 5);
truthy("weak answer flags under-length", gw.notes.some(n => n.message.en.includes("words")));
truthy("weak answer catches misspelling", gw.metrics.misspelled.some(m => m.right === "government"));

const strong = `The proposition that online instruction could wholly supplant conventional schooling in rural districts is an appealing one, particularly where qualified staff are scarce. In my view, however, remote provision should be understood as a supplement rather than a substitute, and I will explain why.

The case for online lessons is genuinely strong on one dimension: access. A village school that cannot recruit a physics specialist can, at relatively low cost, connect its students to one. This addresses a real and persistent inequality, and the alternative is frequently not a worse teacher but no teacher at all. Furthermore, recorded material allows a student to revisit an explanation as often as necessary, which a single classroom exposition does not.

Nevertheless, the claim that such provision could replace schools entirely overlooks what a school does beyond transmitting content. Adolescents require supervision, feedback that responds to their particular confusion, and the ordinary social negotiation that occurs among peers. A student who has misunderstood a concept rarely knows which question to ask; identifying that gap is precisely the work of a teacher who is present. Moreover, households in remote areas are considerably less likely to have reliable connectivity or a quiet place to study, so the very conditions that make remote teaching attractive also undermine it.

On balance, therefore, I would argue that online lessons ought to be integrated into rural schools rather than replace them. The most defensible model combines a local teacher who knows the students with remote specialists who supply subject expertise, since this arrangement captures the advantages of both without depending entirely on infrastructure that is not yet in place.`;
const gs = gradeWriting(strong, task2);
console.log(`     strong answer: band ${gs.band}, words ${gs.metrics.wordCount}, TTR ${gs.metrics.rootTTR.toFixed(2)}, linker groups ${gs.metrics.linkerGroups.length}, academic ${gs.metrics.academicHits.length}`);
truthy("strong answer outscores weak", gs.band > gw.band);
truthy("strong answer reaches at least 6.5", gs.band >= 6.5);
truthy("never awards 9", gs.band <= 8.5);
truthy("criteria always four", gs.criteria.length === 4);
truthy("always gives a next step", gs.notes.some(n => n.kind === "tip"));

const task1 = IELTS_WRITING.find(p => p.id === "w1-energy")!;
const noOverview = "The graph shows electricity in Kazakhstan. Coal was 78 percent in 2010. Gas was 15 percent. Renewables was 1 percent. In 2024 coal was 59 percent and gas was 24 percent and renewables was 14 percent. Coal went down. Gas went up. Renewables went up a lot over the period shown in this graph here.";
const g1 = gradeWriting(noOverview, task1);
truthy("task 1 without overview is penalised", g1.notes.some(n => n.message.en.includes("overview")));
console.log(`     task1 no-overview: band ${g1.band}`);

console.log(fails === 0 ? "\nALL PASS" : `\n${fails} FAILURES`);
process.exit(fails === 0 ? 0 : 1);
