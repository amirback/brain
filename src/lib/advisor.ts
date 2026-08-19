import { QUESTIONS, SUBJECTS, lessonByTopic, summaryOf, topicById, topicsOf, TOPICS } from "./content";
import { formatForecast, isStuck, readiness } from "./engine";
import { lastNDays, streakLength, totalSeconds, weekSeconds } from "./store-helpers";
import type { InboxMessage, L, Lang, MockTest, StudentState, SubjectId } from "./types";

/**
 * The advisor reads the same state the adaptive engine writes and turns it
 * into plain advice: what to do next, why, and what to watch. It is rule-based
 * on purpose — every sentence it produces can be traced to a number in the
 * student's profile, so nothing it says is invented.
 */

/* ---------------- video suggestions ---------------- */

/**
 * Search links rather than fixed video ids: a search never rots, and it lands
 * on the same explanation in whichever language the student is using.
 */
const VIDEO_QUERY: Record<string, { ru: string; kk: string; en: string }> = {
  linear: { ru: "линейные уравнения 7 класс объяснение", kk: "сызықтық теңдеулер түсіндірме", en: "solving linear equations explained" },
  quadratic: { ru: "квадратные уравнения дискриминант ЕНТ", kk: "квадрат теңдеулер дискриминант", en: "quadratic equations discriminant explained" },
  functions: { ru: "функции и графики парабола вершина", kk: "функциялар мен графиктер парабола", en: "graphing parabolas vertex explained" },
  "en-tenses": { ru: "английские времена Present Perfect Past Simple", kk: "ағылшын шақтары Present Perfect", en: "English tenses present perfect vs past simple" },
  "en-articles": { ru: "артикли a an the предлоги времени", kk: "ағылшын артикльдері a an the", en: "English articles a an the explained" },
  "en-vocab": { ru: "словообразование английский суффиксы приставки", kk: "ағылшын сөзжасам жұрнақтар", en: "English word formation suffixes prefixes" },
  "kz-septik": { ru: "септік жалғаулары казахский язык", kk: "септік жалғаулары түсіндірме", en: "Kazakh cases septik explained" },
  "kz-etistik": { ru: "етістік шақтары казахский язык", kk: "етістік шақтары түсіндірме", en: "Kazakh verb tenses explained" },
  "kz-soz": { ru: "сөз таптары казахский язык", kk: "сөз таптары түсіндірме", en: "Kazakh parts of speech" },
  "hs-ancient": { ru: "саки гунны тюркский каганат история Казахстана", kk: "сақтар ғұндар түркі қағанаты", en: "ancient Kazakhstan Saka Huns Turkic khaganate" },
  "hs-khanate": { ru: "Казахское ханство 1465 Керей Жанибек", kk: "Қазақ хандығы 1465 Керей Жәнібек", en: "Kazakh Khanate 1465 history" },
  "hs-modern": { ru: "независимость Казахстана 1991 даты ЕНТ", kk: "Қазақстан тәуелсіздігі 1991 даталар", en: "independent Kazakhstan 1991 key dates" },
  "sat-algebra": { ru: "SAT math algebra подготовка", kk: "SAT math algebra дайындық", en: "SAT math heart of algebra practice" },
  "sat-data": { ru: "SAT math проценты отношения задачи", kk: "SAT math пайыздар қатынастар", en: "SAT math percentages ratios problems" },
  "sat-writing": { ru: "SAT reading writing грамматика правила", kk: "SAT reading writing грамматика", en: "SAT reading and writing grammar rules" },
  "ie-reading": { ru: "IELTS reading true false not given стратегия", kk: "IELTS reading стратегия", en: "IELTS reading true false not given strategy" },
  "ie-writing": { ru: "IELTS writing task 2 структура эссе", kk: "IELTS writing task 2 құрылымы", en: "IELTS writing task 2 essay structure" },
  "ie-vocab": { ru: "IELTS академическая лексика синонимы", kk: "IELTS академиялық лексика", en: "IELTS academic vocabulary band 7" },
};

export function videoFor(topicId: string, lang: Lang): string | null {
  const q = VIDEO_QUERY[topicId];
  if (!q) return null;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q[lang])}`;
}

/* ---------------- advice ---------------- */

export type AdviceTone = "praise" | "warn" | "plan" | "info";

export interface Advice {
  tone: AdviceTone;
  text: L;
  topic?: string;
}

const t = (ru: string, kk: string, en: string): L => ({ ru, kk, en });

/** Russian needs three forms for a counted noun; English needs two. */
function ruPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Reads the profile and returns the two or three things worth saying today. */
export function advise(st: StudentState): Advice[] {
  const out: Advice[] = [];
  const subject = st.activeSubject;
  const topics = topicsOf(subject);
  const streak = streakLength(st.streakDates);
  const week = Math.round(weekSeconds(st.secondsByDay) / 60);
  const days = lastNDays(st.secondsByDay, 3);
  const idleToday = (days[days.length - 1]?.seconds ?? 0) === 0;

  // 1. Anything the student is visibly grinding on comes first.
  const stuckTopic = topics.find((tp) => isStuck(st.answers, tp.id));
  if (stuckTopic) {
    out.push({
      tone: "warn",
      topic: stuckTopic.id,
      text: t(
        `В теме «${stuckTopic.title.ru}» подряд идут ошибки. Это не про способности — обычно значит, что пропущен один шаг в правиле. Посмотри разбор темы заново, потом видео, и только потом возвращайся к задачам.`,
        `«${stuckTopic.title.kk}» тақырыбында қателер қатарынан келіп жатыр. Бұл қабілет туралы емес — әдетте ережедегі бір қадам түсіп қалғанын білдіреді. Тақырып талдауын қайта қарап, содан кейін видеоны көр, сосын ғана есептерге орал.`,
        `You're missing several in a row on "${stuckTopic.title.en}". That usually means one step of the rule is missing, not that you can't do it. Re-read the theory, watch the video, then come back to the problems.`
      ),
    });
  }

  // 2. The weakest covered topic — the one that moves the forecast most.
  const weakest = topics
    .filter((tp) => (st.attempts[tp.id] ?? 0) > 0)
    .sort((a, b) => (st.mastery[a.id] ?? 0) - (st.mastery[b.id] ?? 0))[0];
  if (weakest && (st.mastery[weakest.id] ?? 0) < 0.65 && weakest.id !== stuckTopic?.id) {
    const gain = Math.round(weakest.weight * 50 * (0.85 - (st.mastery[weakest.id] ?? 0)));
    out.push({
      tone: "plan",
      topic: weakest.id,
      text: t(
        `Самый быстрый прирост сейчас даёт «${weakest.title.ru}»: тема весит ${Math.round(weakest.weight * 100)}% предмета, а освоена на ${Math.round((st.mastery[weakest.id] ?? 0) * 100)}%. Подтянешь её до уверенного уровня — прогноз вырастет примерно на ${Math.max(1, gain)} ${ruPlural(Math.max(1, gain), "балл", "балла", "баллов")}.`,
        `Қазір ең жылдам өсімді «${weakest.title.kk}» береді: тақырып пәннің ${Math.round(weakest.weight * 100)}%-ын құрайды, ал меңгерілуі ${Math.round((st.mastery[weakest.id] ?? 0) * 100)}%. Оны нық деңгейге жеткізсең, болжам шамамен ${Math.max(1, gain)} балға өседі.`,
        `The fastest gain right now is "${weakest.title.en}": it carries ${Math.round(weakest.weight * 100)}% of the subject and you're at ${Math.round((st.mastery[weakest.id] ?? 0) * 100)}%. Bring it up and the forecast rises by roughly ${Math.max(1, gain)} ${Math.max(1, gain) === 1 ? "point" : "points"}.`
      ),
    });
  }

  // 3. Untouched topics are worth naming — a blank cell scores zero.
  const untouched = topics.find((tp) => !st.attempts[tp.id]);
  if (untouched && out.length < 3) {
    out.push({
      tone: "info",
      topic: untouched.id,
      text: t(
        `Тема «${untouched.title.ru}» ещё не начата. Пока она пустая, она тянет прогноз вниз сильнее, чем слабая, но пройденная тема.`,
        `«${untouched.title.kk}» тақырыбы әлі басталмаған. Ол бос тұрғанда, әлсіз, бірақ өтілген тақырыпқа қарағанда болжамды көбірек төмендетеді.`,
        `You haven't started "${untouched.title.en}" yet. An empty topic drags the forecast down harder than a weak but studied one.`
      ),
    });
  }

  // 4. Habit feedback, based on the actual streak and minutes.
  if (streak >= 3 && !idleToday) {
    out.push({
      tone: "praise",
      text: t(
        `${streak} ${ruPlural(streak, "день", "дня", "дней")} подряд без пропусков и ${week} ${ruPlural(week, "минута", "минуты", "минут")} за неделю — это уже режим, а не рывок. Именно так растёт рейтинг.`,
        `${streak} күн қатарынан үзіліссіз және аптасына ${week} минут — бұл серпін емес, режим. Рейтинг дәл осылай өседі.`,
        `${streak} days in a row and ${week} minutes this week — that's a routine, not a sprint. This is exactly how the rating grows.`
      ),
    });
  } else if (idleToday && streak > 0) {
    out.push({
      tone: "warn",
      text: t(
        `Сегодня ещё ноль. Стрик ${streak} дней держится до полуночи — 10 минут хватит, чтобы его не потерять.`,
        `Бүгін әлі нөл. ${streak} күндік стрик түн ортасына дейін сақталады — жоғалтпау үшін 10 минут та жетеді.`,
        `Nothing today yet. Your ${streak}-day streak holds until midnight — ten minutes is enough to keep it.`
      ),
    });
  }

  return out.slice(0, 3);
}

/* ---------------- chat ---------------- */

export interface ChatTurn {
  q: L;
  a: (st: StudentState) => L;
  topicOf?: (st: StudentState) => string | undefined;
}

const weakestOf = (st: StudentState) =>
  topicsOf(st.activeSubject)
    .filter((tp) => (st.attempts[tp.id] ?? 0) > 0)
    .sort((a, b) => (st.mastery[a.id] ?? 0) - (st.mastery[b.id] ?? 0))[0];

export const CHAT_TURNS: ChatTurn[] = [
  {
    q: t("Что мне делать сегодня?", "Бүгін не істеуім керек?", "What should I do today?"),
    topicOf: (st) => weakestOf(st)?.id ?? topicsOf(st.activeSubject)[0]?.id,
    a: (st) => {
      const w = weakestOf(st) ?? topicsOf(st.activeSubject)[0];
      const mins = Math.max(15, 40 - Math.round(weekSeconds(st.secondsByDay) / 600));
      if (!w) {
        return t("Сначала пройди диагностику — без неё я не знаю, где у тебя пробелы.", "Алдымен диагностикадан өт — онсыз олқылықтарыңды білмеймін.", "Take the diagnostic first — without it I can't see your gaps.");
      }
      return t(
        `Сегодня возьми «${w.title.ru}» — примерно ${mins} минут. Сначала конспект, потом 6 задач. Если две подряд не пойдут, останавливайся и смотри разбор, а не угадывай дальше.`,
        `Бүгін «${w.title.kk}» тақырыбын ал — шамамен ${mins} минут. Алдымен конспект, сосын 6 есеп. Екеуі қатарынан шықпаса, тоқтап, талдауды қара, әрі қарай болжама.`,
        `Take "${w.title.en}" today — about ${mins} minutes. Read the summary first, then six problems. If two in a row go wrong, stop and read the solution instead of guessing on.`
      );
    },
  },
  {
    q: t("Почему я застрял?", "Неге тұрып қалдым?", "Why am I stuck?"),
    topicOf: (st) => topicsOf(st.activeSubject).find((tp) => isStuck(st.answers, tp.id))?.id ?? weakestOf(st)?.id,
    a: (st) => {
      const stuck = topicsOf(st.activeSubject).find((tp) => isStuck(st.answers, tp.id));
      if (!stuck) {
        return t(
          "По цифрам ты не застрял: последние ответы идут ровно. Если ощущение обратное — обычно дело в скорости, а не в понимании. Попробуй решать те же задачи на время.",
          "Сандар бойынша сен тұрып қалмағансың: соңғы жауаптар біркелкі. Егер керісінше сезілсе — әдетте мәселе түсінуде емес, жылдамдықта. Сол есептерді уақытпен шығарып көр.",
          "By the numbers you're not stuck: your recent answers are steady. If it feels otherwise, it's usually speed rather than understanding — try the same problems against a clock."
        );
      }
      const wrong = st.answers.filter((a) => a.topic === stuck.id && !a.correct).slice(-3);
      const avg = Math.round(wrong.reduce((s, a) => s + a.difficulty, 0) / Math.max(1, wrong.length));
      return t(
        `В «${stuck.title.ru}» последние ошибки были на задачах уровня ${avg}, а твой рейтинг ${st.elo}. Разрыв небольшой — значит дело не в сложности, а в конкретном шаге. Перечитай раздел с формулой и реши три лёгкие задачи подряд, чтобы вернуть уверенность.`,
        `«${stuck.title.kk}» тақырыбында соңғы қателер ${avg} деңгейлі есептерде болды, ал рейтингің ${st.elo}. Айырма аз — демек мәселе күрделілікте емес, нақты қадамда. Формуласы бар бөлімді қайта оқып, сенімділікті қайтару үшін үш жеңіл есеп шығар.`,
        `In "${stuck.title.en}" your recent misses were on level-${avg} problems while your rating is ${st.elo}. That gap is small, so it's one specific step, not the difficulty. Re-read the formula section and clear three easy ones to reset your confidence.`
      );
    },
  },
  {
    q: t("Успею ли я к экзамену?", "Емтиханға үлгеремін бе?", "Will I be ready in time?"),
    a: (st) => {
      const view = formatForecast(readiness(st, st.activeSubject), st.goal);
      const days = st.examDate
        ? Math.max(0, Math.ceil((new Date(st.examDate).getTime() - Date.now()) / 864e5))
        : null;
      const perWeek = Math.round(weekSeconds(st.secondsByDay) / 60);
      if (days === null) {
        return t(
          `Дата экзамена не указана, поэтому считать темп не с чем. Поставь её в профиле — и я скажу, сколько минут в неделю нужно, чтобы дойти до цели. Сейчас прогноз ${view.value} из ${view.max}.`,
          `Емтихан күні көрсетілмеген, сондықтан қарқынды есептеуге негіз жоқ. Оны профильде қой — сонда мақсатқа жету үшін аптасына қанша минут керегін айтамын. Қазіргі болжам ${view.value} / ${view.max}.`,
          `No exam date is set, so there's nothing to pace against. Add it in your profile and I'll tell you the minutes per week you need. Right now the forecast is ${view.value} out of ${view.max}.`
        );
      }
      const weeks = Math.max(1, Math.round(days / 7));
      return t(
        `До экзамена ${days} ${ruPlural(days, "день", "дня", "дней")} — это примерно ${weeks} ${ruPlural(weeks, "неделя", "недели", "недель")}. Сейчас прогноз ${view.value} из ${view.max}, а занимаешься ты ${perWeek} минут в неделю. При таком темпе прогноз обычно растёт на 1–2 балла в неделю: считай сам, хватает ли этого до твоей цели, и добавь занятий, если нет.`,
        `Емтиханға ${days} күн — шамамен ${weeks} апта. Қазіргі болжам ${view.value} / ${view.max}, ал аптасына ${perWeek} минут оқисың. Мұндай қарқында болжам әдетте аптасына 1–2 балға өседі: мақсатыңа жету үшін жететінін өзің есепте, жетпесе — сабақ қос.`,
        `${days} days to the exam, about ${weeks} weeks. Your forecast is ${view.value} of ${view.max} and you study ${perWeek} minutes a week. At that pace the forecast typically climbs 1–2 points a week — do the arithmetic against your target and add sessions if it falls short.`
      );
    },
  },
  {
    q: t("Как готовиться к мок-тесту?", "Мок-тестке қалай дайындалу керек?", "How do I prepare for the mock test?"),
    a: (st) => {
      const next = st.mocks.find((m) => m.status === "scheduled");
      if (!next) {
        return t(
          "Мок-тест пока не назначен: он появится, когда ты пройдёшь хотя бы две темы. Это нормально — сначала материал, потом проверка.",
          "Мок-тест әзірге тағайындалмаған: кемінде екі тақырыпты өткенде пайда болады. Бұл қалыпты — алдымен материал, сосын тексеру.",
          "No mock test yet: it appears once you've worked through at least two topics. Material first, then the check."
        );
      }
      const daysLeft = Math.max(0, Math.ceil((next.dueAt - Date.now()) / 864e5));
      const names = next.topics.map((id) => topicById(id)).filter(Boolean);
      return t(
        `Мок-тест через ${daysLeft} ${ruPlural(daysLeft, "день", "дня", "дней")}, ${next.size} ${ruPlural(next.size, "вопрос", "вопроса", "вопросов")} по темам: ${names.map((n) => n!.title.ru).join(", ")}. За день до теста не бери новые темы — повтори конспекты и разбери старые ошибки, так результат обычно выше.`,
        `Мок-тест ${daysLeft} күннен кейін, ${next.size} сұрақ. Тақырыптар: ${names.map((n) => n!.title.kk).join(", ")}. Тесттен бір күн бұрын жаңа тақырып алма — конспектілерді қайталап, ескі қателерді талда, сонда нәтиже жоғары болады.`,
        `Mock test in ${daysLeft} days, ${next.size} questions on: ${names.map((n) => n!.title.en).join(", ")}. Don't start new topics the day before — review the summaries and your past mistakes instead; that usually scores higher.`
      );
    },
  },
];

/* ---------------- mock test planning ---------------- */

export const MOCK_LEAD_DAYS = 4;

/**
 * How far out to schedule: normally four days, but tighter when the exam is
 * close, so the last weeks get more checks rather than fewer.
 */
function leadDays(st: StudentState): number {
  if (!st.examDate) return MOCK_LEAD_DAYS;
  const daysToExam = Math.ceil((new Date(st.examDate).getTime() - Date.now()) / 864e5);
  if (daysToExam <= 14) return 2;
  if (daysToExam <= 45) return 3;
  return MOCK_LEAD_DAYS;
}

/**
 * Schedules a mock test once the student has covered enough ground, and gives
 * it a deadline a few days out so there is time to prepare.
 */
export function planMock(st: StudentState): MockTest | null {
  const open = st.mocks.find((m) => m.status === "scheduled");
  if (open) return null;
  const covered = topicsOf(st.activeSubject).filter((tp) => (st.attempts[tp.id] ?? 0) >= 3);
  if (covered.length < 2) return null;
  const lastDone = [...st.mocks].filter((m) => m.status === "done").sort((a, b) => (b.takenAt ?? 0) - (a.takenAt ?? 0))[0];
  if (lastDone && Date.now() - (lastDone.takenAt ?? 0) < 3 * 864e5) return null;

  return {
    id: `mk${Date.now()}`,
    subject: st.activeSubject,
    topics: covered.map((c) => c.id),
    createdAt: Date.now(),
    dueAt: Date.now() + leadDays(st) * 864e5,
    size: Math.min(10, covered.length * 4),
    status: "scheduled",
  };
}

/** The questions a mock test serves: spread across its topics, mid-difficulty. */
export function mockQuestions(mock: MockTest, elo: number) {
  const perTopic = Math.max(1, Math.round(mock.size / mock.topics.length));
  const picked: typeof QUESTIONS = [];
  for (const topic of mock.topics) {
    const pool = QUESTIONS.filter((q) => q.topic === topic).sort(
      (a, b) => Math.abs(a.difficulty - elo) - Math.abs(b.difficulty - elo)
    );
    picked.push(...pool.slice(0, perTopic));
  }
  return picked.slice(0, mock.size);
}

/* ---------------- inbox ---------------- */

const todayKey = () => new Date().toISOString().slice(0, 10);

/**
 * Generates the messages the student should see now: deadline warnings first,
 * then one motivational nudge a day at most.
 */
export function buildMessages(st: StudentState, lang: Lang): InboxMessage[] {
  const msgs: InboxMessage[] = [];
  const already = new Set(st.inbox.map((m) => m.id));

  for (const m of st.mocks.filter((x) => x.status === "scheduled")) {
    const daysLeft = Math.ceil((m.dueAt - Date.now()) / 864e5);
    if (daysLeft <= MOCK_LEAD_DAYS && daysLeft >= 0) {
      // one message per remaining day, so the reminder repeats as it nears
      const id = `mock-${m.id}-${daysLeft}`;
      if (already.has(id)) continue;
      const title = {
        ru: daysLeft === 0 ? "Мок-тест сегодня" : `Мок-тест через ${daysLeft} ${ruPlural(daysLeft, "день", "дня", "дней")}`,
        kk: daysLeft === 0 ? "Мок-тест бүгін" : `Мок-тест ${daysLeft} күннен кейін`,
        en: daysLeft === 0 ? "Mock test today" : `Mock test in ${daysLeft} days`,
      }[lang];
      const names = m.topics.map((id2) => topicById(id2)).filter(Boolean).map((tp) => tp!.title[lang]);
      const body = {
        ru: `${m.size} вопросов по темам: ${names.join(", ")}. Повтори конспекты — на тесте не будет подсказок.`,
        kk: `${m.size} сұрақ. Тақырыптар: ${names.join(", ")}. Конспектілерді қайтала — тесте кеңес болмайды.`,
        en: `${m.size} questions on: ${names.join(", ")}. Review the summaries — no hints during the test.`,
      }[lang];
      const label = { ru: "Пройти сейчас", kk: "Қазір өту", en: "Take it now" }[lang];
      msgs.push({ id, kind: "deadline", title, body, ts: Date.now(), read: false, action: { label, href: `/mock?id=${m.id}` } });
    }
  }

  // One nudge per day, and only when the student hasn't studied yet today.
  const today = todayKey();
  const studiedToday = (st.secondsByDay[today] ?? 0) > 0;
  if (!studiedToday && st.lastNudge !== today && st.diagnosticDone) {
    const streak = streakLength(st.streakDates);
    const id = `nudge-${today}`;
    if (!already.has(id)) {
      const title = { ru: "Не пропускай сегодня", kk: "Бүгінді жіберіп алма", en: "Don't skip today" }[lang];
      const body = streak > 0
        ? {
            ru: `Стрик ${streak} ${ruPlural(streak, "день", "дня", "дней")} держится до полуночи. Один короткий подход — и он остаётся.`,
            kk: `${streak} күндік стрик түн ортасына дейін. Бір қысқа әрекет — ол сақталады.`,
            en: `Your ${streak}-day streak holds until midnight. One short session keeps it alive.`,
          }[lang]
        : {
            ru: "Вернуться в ритм проще всего с 10 минут практики по слабой теме.",
            kk: "Ырғаққа қайту үшін әлсіз тақырып бойынша 10 минут практика жеткілікті.",
            en: "The easiest way back into rhythm is ten minutes on a weak topic.",
          }[lang];
      const label = { ru: "Заниматься", kk: "Оқу", en: "Study" }[lang];
      msgs.push({ id, kind: "motivation", title, body, ts: Date.now(), read: false, action: { label, href: "/dashboard" } });
    }
  }

  return msgs;
}

export function mockResultMessage(mock: MockTest, lang: Lang): InboxMessage {
  const pct = Math.round(((mock.score ?? 0) / mock.size) * 100);
  const title = { ru: "Результат мок-теста", kk: "Мок-тест нәтижесі", en: "Mock test result" }[lang];
  const wrong = mock.wrongQids?.length ?? 0;
  const body = {
    ru: wrong === 0
      ? `${mock.score} из ${mock.size} — чисто. Тема закреплена, можно двигаться дальше.`
      : `${mock.score} из ${mock.size} (${pct}%). Ошибок: ${wrong}. Работа над ошибками даёт больше, чем новые задачи — разбери их, пока помнишь ход мысли.`,
    kk: wrong === 0
      ? `${mock.size}-ден ${mock.score} — таза. Тақырып бекітілді, әрі қарай жүруге болады.`
      : `${mock.size}-ден ${mock.score} (${pct}%). Қате саны: ${wrong}. Қателермен жұмыс жаңа есептерден көбірек береді — ойың есіңде тұрғанда талда.`,
    en: wrong === 0
      ? `${mock.score} of ${mock.size} — clean. The topic is locked in.`
      : `${mock.score} of ${mock.size} (${pct}%). ${wrong} mistakes. Reviewing them pays more than new problems — do it while you still remember your reasoning.`,
  }[lang];
  const label = { ru: "Работа над ошибками", kk: "Қателермен жұмыс", en: "Review mistakes" }[lang];
  return {
    id: `res-${mock.id}`,
    kind: "result",
    title,
    body,
    ts: Date.now(),
    read: false,
    action: wrong > 0 ? { label, href: `/practice?fix=${mock.id}` } : undefined,
  };
}

export function subjectLabel(id: SubjectId): string {
  return id;
}

export function totalStudyHours(st: StudentState): number {
  return totalSeconds(st.secondsByDay) / 3600;
}


/* ---------------- life questions ---------------- */

/**
 * Studying fails for human reasons far more often than for academic ones.
 * These answers are grounded in the student's own numbers where possible and
 * in ordinary, non-preachy advice where not.
 */
function lifeAnswer(q: string, st: StudentState, lang: Lang): Reply | null {
  const streak = streakLength(st.streakDates);
  const week = Math.round(weekSeconds(st.secondsByDay) / 60);
  const weak = weakestOf(st);

  // motivation, burnout, "I don't want to"
  if (has(q, ["мотивац", "не хочу", "лень", "надоел", "устал", "выгор", "смысл", "заброс", "руки опуст",
              "мотивация жоқ", "жалық", "шаршад", "motivation", "lazy", "tired", "burn", "give up", "pointless"])) {
    return {
      topic: weak?.id,
      text: L3(lang,
        `Мотивация не приходит до действия — она приходит после. Поэтому правило простое: не «сесть за учёбу», а «сделать 3 задачи». Три задачи — это 6 минут, на них решимость не нужна.${streak > 0 ? ` У тебя уже ${streak} ${ruPlural(streak, "день", "дня", "дней")} подряд, ломать эту серию из-за одного плохого дня — обиднее всего.` : ""}`,
        `Мотивация әрекеттен бұрын келмейді — кейін келеді. Сондықтан ереже қарапайым: «оқуға отыру» емес, «3 есеп шығару». Үш есеп — 6 минут, оған батылдық керек емес.${streak > 0 ? ` Сенде қазірдің өзінде ${streak} күн қатарынан, бір жаман күн үшін бұл сериялықты бұзу — ең өкініштісі.` : ""}`,
        `Motivation doesn't arrive before action — it follows it. So the rule is simple: don't "sit down to study", do three problems. Three problems is six minutes; that needs no resolve.${streak > 0 ? ` You're on a ${streak}-day streak — breaking it over one bad day is the worst trade.` : ""}`),
      bullets: [
        L3(lang, "Начни с самой лёгкой задачи, а не с самой важной", "Ең маңыздысынан емес, ең жеңілінен баста", "Start with the easiest problem, not the most important one"),
        L3(lang, "Ставь таймер на 10 минут — после звонка можно честно встать", "10 минутқа таймер қой — қоңыраудан кейін тұруға болады", "Set a 10-minute timer — when it rings you may honestly stop"),
        L3(lang, "Считай не «сколько осталось», а «сколько уже сделано»", "«Қанша қалды» емес, «қанша істелді» деп сана", "Count what's done, not what's left"),
      ],
    };
  }

  // distractions: phone, games, people, relationships
  if (has(q, ["отвлека", "мешают", "мешает", "телефон", "тикток", "инстаграм", "игр", "девочк", "девушк", "парн", "друзь", "шум",
              "алаңдат", "телефон", "ойын", "distract", "phone", "tiktok", "instagram", "games", "girls", "friends", "noise"])) {
    return {
      text: L3(lang,
        "Внимание не про силу воли, а про расстояние до соблазна. Телефон в другой комнате работает лучше любого обещания себе. То же и с людьми: договорись заранее, что два часа ты не на связи — это честнее, чем отвечать между задачами и не сделать ни то, ни другое.",
        "Зейін ерік күшінде емес, азғырудан қашықтықта. Басқа бөлмедегі телефон кез келген уәдеден жақсы жұмыс істейді. Адамдармен де солай: екі сағат байланыста болмайтыныңды алдын ала келіс — есеп арасында жауап беріп, екеуін де істемегеннен адал.",
        "Focus isn't willpower, it's distance from the temptation. A phone in another room beats any promise to yourself. Same with people: agree in advance that you're offline for two hours — that's more honest than half-answering between problems and doing neither well."),
      bullets: [
        L3(lang, "Телефон — в другую комнату, не «экраном вниз»", "Телефонды басқа бөлмеге, «экранын төмен» емес", "Phone in another room, not just face-down"),
        L3(lang, "Занимайся блоками по 25 минут с перерывом в 5", "25 минуттық блокпен, 5 минут үзіліспен оқы", "Work in 25-minute blocks with 5-minute breaks"),
        L3(lang, "Договорись с близкими о времени, когда ты недоступен", "Жақындарыңмен қолжетімсіз уақытты келіс", "Tell the people around you when you're unavailable"),
      ],
    };
  }

  // stress and exam anxiety
  if (has(q, ["волну", "боюсь", "страх", "паник", "тревог", "стресс", "не сдам", "провал",
              "қорқ", "уайым", "стресс", "afraid", "scared", "anxiety", "panic", "stress", "fail"])) {
    const view = formatForecast(readiness(st, st.activeSubject), st.goal);
    return {
      text: L3(lang,
        `Страх экзамена обычно живёт на неопределённости. У тебя её меньше, чем кажется: прогноз ${view.value} из ${view.max} посчитан по твоим реальным ответам, а не по ощущениям. Смотри на него как на факт, а не на приговор — он двигается каждую неделю.`,
        `Емтихан қорқынышы белгісіздіктен туады. Сенде ол ойлағаннан аз: ${view.max}-ден ${view.value} болжам сезім бойынша емес, нақты жауаптарың бойынша есептелген. Оны үкім емес, факт ретінде қара — ол апта сайын өзгереді.`,
        `Exam fear lives on uncertainty. You have less of it than it feels: the ${view.value} of ${view.max} forecast comes from your real answers, not your mood. Treat it as a fact, not a verdict — it moves every week.`),
      bullets: [
        L3(lang, "Перед сном не разбирай новые темы — только повторение", "Ұйқы алдында жаңа тақырып алма — тек қайталау", "No new topics before bed — review only"),
        L3(lang, "Пройди мок-тест: знакомый формат снимает половину страха", "Мок-тесттен өт: таныс формат қорқыныштың жартысын алады", "Take a mock test: a familiar format removes half the fear"),
        L3(lang, "Разбор ошибок успокаивает сильнее, чем новые задачи", "Қателерді талдау жаңа есептерден күштірек тыныштандырады", "Reviewing mistakes calms you more than new problems"),
      ],
    };
  }

  // time management and sleep
  if (has(q, ["не успева", "мало времени", "как совмещ", "расписан", "режим", "сон", "спать", "высып",
              "үлгермей", "уақыт жоқ", "ұйқы", "no time", "schedule", "sleep", "manage time", "balance"])) {
    return {
      text: L3(lang,
        `Времени почти всегда хватает — не хватает порядка. За эту неделю у тебя ${week} ${ruPlural(week, "минута", "минуты", "минут")} занятий; чтобы прогноз рос стабильно, обычно достаточно 30–40 минут в день, но каждый день. Недосып съедает больше, чем даёт лишний час ночью: на невыспавшуюся голову задачи решаются вдвое медленнее.`,
        `Уақыт әрдайым дерлік жетеді — тәртіп жетпейді. Осы аптада ${week} минут оқыдың; болжам тұрақты өсуі үшін әдетте күніне 30–40 минут жеткілікті, бірақ күн сайын. Ұйқысыздық түнгі қосымша сағаттан көбірек алады: ұйқысы қанбаған бас есепті екі есе баяу шығарады.`,
        `There's almost always enough time — what's missing is order. You logged ${week} minutes this week; 30–40 minutes a day, every day, is usually enough to keep the forecast climbing. Skipping sleep costs more than the extra hour gives: tired heads solve at half speed.`),
      bullets: [
        L3(lang, "Одно и то же время каждый день работает лучше длинных марафонов", "Күн сайын бір уақыт ұзақ марафоннан жақсы жұмыс істейді", "The same slot every day beats long marathons"),
        L3(lang, "Планируй по задачам, а не по часам: «6 задач» вместо «час»", "Сағатпен емес, есеппен жоспарла: «сағат» емес «6 есеп»", "Plan in problems, not hours: \"six problems\", not \"an hour\""),
      ],
    };
  }

  // memory / how to study
  if (has(q, ["как запомин", "забыва", "память", "как учить", "как готовит", "не помню",
              "есте сақт", "ұмыт", "how to remember", "forget", "memor", "how to study"])) {
    return {
      topic: weak?.id,
      text: L3(lang,
        "Материал держится не от перечитывания, а от вспоминания. Прочитал конспект — закрой его и перескажи по памяти, потом сверься. Это неприятно и именно поэтому работает: мозг запоминает то, что пришлось доставать с усилием.",
        "Материал қайта оқудан емес, еске түсіруден сақталады. Конспектіні оқыдың — жауып, жатқа айт, сосын салыстыр. Бұл жағымсыз, дәл сондықтан жұмыс істейді: ми күш салып алынған нәрсені есте сақтайды.",
        "Material sticks from recall, not rereading. Read the summary, close it, say it back from memory, then check. It feels worse, which is exactly why it works — the brain keeps what it had to dig for."),
      bullets: [
        L3(lang, "Повторяй через день, а не пять раз подряд в один вечер", "Бір кеште бес рет емес, күн ара қайтала", "Space it a day apart instead of five times one evening"),
        L3(lang, "Объясни тему вслух, будто учишь друга", "Тақырыпты досыңа үйретіп тұрғандай дауыстап түсіндір", "Explain the topic out loud as if teaching a friend"),
        L3(lang, "Ошибки разбирай сразу, пока помнишь ход мысли", "Қателерді ойың есіңде тұрғанда бірден талда", "Review mistakes while your reasoning is fresh"),
      ],
    };
  }

  // what to choose / future
  if (has(q, ["куда поступ", "какую професс", "кем стать", "выбрать специальн", "университет",
              "қай маман", "университет", "which university", "career", "what should i study"])) {
    return {
      text: L3(lang,
        "Я не знаю твоих обстоятельств настолько, чтобы советовать профессию, и любой, кто берётся, тоже. Но с цифрами помочь могу: посмотри, какие предметы у тебя идут легче по карте знаний — это не приговор, но полезный сигнал. Дальше решай с теми, кто знает тебя лично.",
        "Мамандық таңдауға кеңес беретіндей жағдайыңды білмеймін, оған бел буғандар да білмейді. Бірақ сандармен көмектесе аламын: білім картасында қай пән жеңіл жүріп жатқанын қара — бұл үкім емес, пайдалы сигнал. Әрі қарай сені жақсы білетіндермен шеш.",
        "I don't know your situation well enough to pick a career for you, and neither does anyone who offers to. I can help with the numbers though: look at which subjects run easier on your knowledge map. That's a signal, not a verdict — decide the rest with people who know you."),
    };
  }

  return null;
}

/* ---------------- free-text answering ---------------- */

export interface Reply {
  text: string;
  topic?: string;
  /** Extra lines rendered as a list, e.g. the key points of a summary. */
  bullets?: string[];
}

const norm = (s: string) =>
  s.toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

const has = (q: string, words: string[]) => words.some((w) => q.includes(w));

/** Finds a topic the student named, in any of the three languages. */
function findTopic(q: string): string | undefined {
  let best: { id: string; score: number } | undefined;
  for (const tp of TOPICS) {
    for (const title of [tp.title.ru, tp.title.kk, tp.title.en]) {
      const words = norm(title).split(" ").filter((w) => w.length > 3);
      const hits = words.filter((w) => q.includes(w.slice(0, Math.max(4, w.length - 2)))).length;
      if (hits > 0 && (!best || hits > best.score)) best = { id: tp.id, score: hits };
    }
  }
  // A few colloquial handles the titles don't cover.
  const aliases: Record<string, string[]> = {
    quadratic: ["дискриминант", "виет", "квадратн", "parabola"],
    linear: ["линейн", "уравнени", "скобк"],
    functions: ["график", "парабол", "функци", "наклон"],
    "en-tenses": ["present perfect", "past simple", "времен", "tense"],
    "en-articles": ["артикл", "предлог", "article"],
    "en-vocab": ["суффикс", "приставк", "лексик", "vocab"],
    "kz-septik": ["септик", "септік", "жалгау", "жалғау"],
    "kz-etistik": ["етистик", "етістік", "шак", "шақ"],
    "kz-soz": ["соз тап", "сөз тап", "сын есим", "зат есим"],
    "hs-ancient": ["сак", "гунн", "каганат", "золотой человек", "алтын адам"],
    "hs-khanate": ["ханств", "керей", "жанибек", "жүз", "жуз", "жонгар", "жоңғар"],
    "hs-modern": ["независим", "тауелсиз", "тәуелсіз", "конституц", "астана"],
    "sat-algebra": ["sat math", "sat алгебра"],
    "sat-data": ["процент", "отношени", "percent"],
    "sat-writing": ["reading writing", "запят", "пунктуац"],
    "ie-reading": ["not given", "reading"],
    "ie-writing": ["writing", "task 2", "эссе"],
    "ie-vocab": ["парафраз", "синоним", "collocation"],
  };
  for (const [id, keys] of Object.entries(aliases)) {
    if (keys.some((k) => q.includes(k)) && !best) best = { id, score: 1 };
  }
  return best?.id;
}

const L3 = (lang: Lang, ru: string, kk: string, en: string) => ({ ru, kk, en })[lang];

/**
 * Answers a typed question from the student's own data and the content
 * library. Rule-based by design: everything it says is traceable to a number
 * in the profile or to a line of the course material.
 */
export function answerQuestion(raw: string, st: StudentState, lang: Lang): Reply {
  const q = norm(raw);
  const topics = topicsOf(st.activeSubject);
  const weak = weakestOf(st);

  if (!q) return { text: L3(lang, "Напиши вопрос — отвечу по твоим данным.", "Сұрағыңды жаз — деректеріңе қарап жауап беремін.", "Type a question and I'll answer from your data.") };

  // --- greetings ---
  if (has(q, ["привет", "салам", "сәлем", "салем", "hi", "hello", "hey"]) && q.length < 20) {
    return {
      text: L3(lang,
        `Привет, ${st.name}. Могу разобрать любую тему, сказать что делать сегодня, объяснить прогноз балла или подготовить к мок-тесту. Спрашивай своими словами.`,
        `Сәлем, ${st.name}. Кез келген тақырыпты талдай аламын, бүгін не істеу керегін айтамын, балл болжамын түсіндіремін немесе мок-тестке дайындаймын. Өз сөзіңмен сұра.`,
        `Hi, ${st.name}. I can break down any topic, tell you what to do today, explain your score forecast or prep you for the mock test. Ask in your own words.`),
    };
  }

  if (has(q, ["спасиб", "рахмет", "рақмет", "thanks", "thank you"])) {
    return { text: L3(lang, "Не за что. Возвращайся, когда застрянешь.", "Оқасы жоқ. Қиналсаң, қайта кел.", "Any time. Come back when you get stuck.") };
  }

  // Human reasons come before academic ones — they're why people stop.
  const life = lifeAnswer(q, st, lang);
  if (life) return life;

  // --- explain a named topic ---
  const named = findTopic(q);
  if (named && has(q, ["объясн", "расскаж", "что такое", "как реш", "не понима", "тусиндир", "түсіндір", "explain", "how do i", "what is", "помоги"])) {
    const tp = topicById(named);
    const lesson = lessonByTopic(named);
    const points = summaryOf(named).slice(0, 4).map((x) => x[lang]);
    return {
      topic: named,
      text: lesson
        ? `${tp ? tp.title[lang] + ". " : ""}${lesson.intro[lang]}`
        : L3(lang, "По этой теме пока нет разбора.", "Бұл тақырып бойынша әзірге талдау жоқ.", "No breakdown for this topic yet."),
      bullets: points,
    };
  }

  // --- a topic was named without a verb: still show the essentials ---
  if (named && q.split(" ").length <= 5) {
    const tp = topicById(named);
    const m = Math.round((st.mastery[named] ?? 0) * 100);
    const a = st.attempts[named] ?? 0;
    return {
      topic: named,
      text: a === 0
        ? L3(lang,
            `«${tp?.title.ru}» ты ещё не начинал. Начни с конспекта — это 5 минут, дальше сразу задачи.`,
            `«${tp?.title.kk}» әлі басталмаған. Конспектіден баста — 5 минут, сосын бірден есептер.`,
            `You haven't started "${tp?.title.en}" yet. Start with the summary — five minutes, then straight to problems.`)
        : L3(lang,
            `«${tp?.title.ru}»: освоено на ${m}%, решено ${a}. ${m < 50 ? "Пока слабое место — стоит перечитать конспект." : m < 75 ? "Идёт нормально, но до уверенного уровня ещё есть куда расти." : "Тема закреплена, можно только повторять."}`,
            `«${tp?.title.kk}»: меңгерілуі ${m}%, шешілгені ${a}. ${m < 50 ? "Әзірге әлсіз тұс — конспектіні қайта оқы." : m < 75 ? "Қалыпты жүріп жатыр, бірақ өсуге орын бар." : "Тақырып бекітілді, тек қайталау қалды."}`,
            `"${tp?.title.en}": ${m}% mastered, ${a} solved. ${m < 50 ? "Still a weak spot — re-read the summary." : m < 75 ? "Going fine, but not solid yet." : "Locked in; only review left."}`),
      bullets: summaryOf(named).slice(0, 3).map((x) => x[lang]),
    };
  }

  // --- formulas / cheat sheet ---
  if (has(q, ["формул", "шпаргалк", "конспект", "кратко", "formula", "summary", "cheat"])) {
    const id = named ?? weak?.id ?? topics[0]?.id;
    if (!id) return { text: L3(lang, "Сначала выбери предмет.", "Алдымен пәнді таңда.", "Pick a subject first.") };
    const tp = topicById(id);
    return {
      topic: id,
      text: L3(lang, `Конспект по теме «${tp?.title.ru}»:`, `«${tp?.title.kk}» тақырыбының конспектісі:`, `Summary for "${tp?.title.en}":`),
      bullets: summaryOf(id).map((x) => x[lang]),
    };
  }

  // --- what to do today / plan ---
  if (has(q, ["что делать", "сегодня", "план", "с чего начать", "не знаю что", "бугин", "бүгін", "жоспар", "what should i", "today", "plan"])) {
    return { text: CHAT_TURNS[0].a(st)[lang], topic: CHAT_TURNS[0].topicOf?.(st) };
  }

  // --- stuck / hard ---
  if (has(q, ["застря", "не получ", "тяжел", "сложн", "туплю", "қиын", "киын", "stuck", "hard", "difficult"])) {
    return { text: CHAT_TURNS[1].a(st)[lang], topic: CHAT_TURNS[1].topicOf?.(st) };
  }

  // --- exam pacing ---
  if (has(q, ["успе", "экзамен", "ент", "ұбт", "убт", "хватит времени", "емтихан", "in time", "exam", "ready"])) {
    return { text: CHAT_TURNS[2].a(st)[lang] };
  }

  // --- mock tests ---
  if (has(q, ["мок", "mock", "пробн", "тест когда", "тесте"])) {
    return { text: CHAT_TURNS[3].a(st)[lang] };
  }

  // --- forecast ---
  if (has(q, ["прогноз", "балл", "сколько получ", "score", "болжам", "forecast"])) {
    const view = formatForecast(readiness(st, st.activeSubject), st.goal);
    const covered = topics.filter((tp) => (st.attempts[tp.id] ?? 0) > 0);
    const list = covered.map((tp) => `${tp.title[lang]} — ${Math.round((st.mastery[tp.id] ?? 0) * 100)}%`);
    return {
      text: L3(lang,
        `Сейчас прогноз ${view.value} из ${view.max}. Он складывается из освоенности тем с учётом их веса в экзамене и поправки на твой рейтинг (${st.elo}), поэтому лёгкими задачами его не накрутить.`,
        `Қазіргі болжам ${view.max}-ден ${view.value}. Ол тақырыптардың меңгерілуі мен емтихандағы салмағынан және рейтингіңе (${st.elo}) түзетуден құралады, сондықтан жеңіл есептермен көтеру мүмкін емес.`,
        `Your forecast is ${view.value} of ${view.max}. It combines topic mastery weighted by exam share with a correction for your rating (${st.elo}), so easy problems can't inflate it.`),
      bullets: list,
    };
  }

  // --- stats: hours, streak, rating ---
  if (has(q, ["сколько я", "часов", "стрик", "рейтинг", "статист", "сағат", "сагат", "hours", "streak", "rating", "elo"])) {
    const hours = (totalSeconds(st.secondsByDay) / 3600).toFixed(1);
    const week = Math.round(weekSeconds(st.secondsByDay) / 60);
    const streak = streakLength(st.streakDates);
    return {
      text: L3(lang,
        `Всего за задачами ${hours} ч, за эту неделю ${week} мин, стрик ${streak} ${ruPlural(streak, "день", "дня", "дней")}, рейтинг ${st.elo}.`,
        `Барлығы ${hours} сағат, осы аптада ${week} мин, стрик ${streak} күн, рейтинг ${st.elo}.`,
        `${hours} h total, ${week} min this week, a ${streak}-day streak, rating ${st.elo}.`),
    };
  }

  // --- video ---
  if (has(q, ["видео", "ютуб", "youtube", "видос", "video", "посмотреть"])) {
    const id = named ?? weak?.id ?? topics[0]?.id;
    const tp = id ? topicById(id) : null;
    return {
      topic: id,
      text: tp
        ? L3(lang, `Держи видео по теме «${tp.title.ru}» — кнопка ниже.`, `«${tp.title.kk}» тақырыбы бойынша видео — төмендегі түйме.`, `Here's a video on "${tp.title.en}" — button below.`)
        : L3(lang, "Скажи, по какой теме нужно видео.", "Қай тақырып бойынша видео керегін айт.", "Tell me which topic you want a video on."),
    };
  }

  // --- what subjects exist ---
  if (has(q, ["предмет", "чему учить", "пән", "пан", "subject"])) {
    return {
      text: L3(lang, "Сейчас на платформе шесть направлений:", "Қазір платформада алты бағыт бар:", "Six tracks are available right now:"),
      bullets: SUBJECTS.map((x) => `${x.title[lang]} — ${x.blurb[lang]}`),
    };
  }

  // --- fallback: say what it can do, and give the most useful thing anyway ---
  const fallbackTopic = weak?.id ?? topics[0]?.id;
  return {
    topic: fallbackTopic,
    text: L3(lang,
      "Я отвечаю по твоим данным и материалам курса, поэтому вопрос лучше задать конкретнее. Например: «объясни квадратные уравнения», «что делать сегодня», «почему я застрял», «какой у меня прогноз», «дай конспект», «нужно видео».",
      "Мен сенің деректерің мен курс материалдары бойынша жауап беремін, сондықтан сұрақты нақтырақ қой. Мысалы: «квадрат теңдеулерді түсіндір», «бүгін не істеу керек», «неге тұрып қалдым», «болжамым қандай», «конспект бер», «видео керек».",
      "I answer from your data and the course material, so a more specific question works best. For example: \"explain quadratic equations\", \"what should I do today\", \"why am I stuck\", \"what's my forecast\", \"give me the summary\", \"I need a video\"."),
  };
}
