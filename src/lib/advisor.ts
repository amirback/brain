import { QUESTIONS, topicById, topicsOf } from "./content";
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
    dueAt: Date.now() + MOCK_LEAD_DAYS * 864e5,
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
      msgs.push({ id, kind: "deadline", title, body, ts: Date.now(), read: false, action: { label, href: `/practice?mock=${m.id}` } });
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
