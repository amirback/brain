import type { WritingPrompt } from "../types";

/**
 * IELTS Academic Writing prompts.
 *
 * Task 1 needs data to describe, so each one carries a `chart` the app draws as an
 * SVG rather than shipping an image — which also means the figures are readable by
 * a screen reader and the grader can check whether the student quoted them.
 *
 * `keywords` is what the grader measures topic coverage against: it is the list of
 * ideas a complete answer has to touch, not a list of words to paste in.
 */

export const IELTS_WRITING: WritingPrompt[] = [
  /* ---------------- Task 1 ---------------- */
  {
    id: "w1-energy",
    task: 1,
    kind: "Line graph",
    minutes: 20,
    minWords: 150,
    prompt:
      "The graph below shows the share of electricity generated from three sources in Kazakhstan between 2010 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: {
      kind: "line",
      caption: "Share of electricity generation by source, 2010–2024 (%)",
      labels: ["2010", "2014", "2018", "2021", "2024"],
      unit: "%",
      series: [
        { name: "Coal", values: [78, 74, 70, 66, 59] },
        { name: "Gas", values: [15, 17, 19, 21, 24] },
        { name: "Renewables", values: [1, 2, 5, 9, 14] },
      ],
    },
    keywords: ["coal", "gas", "renewables", "decline", "increase", "overall trend", "2024"],
    guidance: {
      en: "Three lines over fifteen years. The examiner wants an overview naming the direction of each source, then one or two body paragraphs with selected figures — never a year-by-year list.",
      ru: "Три линии за пятнадцать лет. Экзаменатор ждёт overview с направлением каждого источника, а потом один-два абзаца с выбранными цифрами — но не перечисление по годам.",
    },
    modelOutline: [
      "Paraphrase the question: what is measured, where, over what period.",
      "Overview: coal fell steadily, gas rose slowly, renewables grew from almost nothing.",
      "Body 1: coal and gas — the two fossil sources, with start and end figures.",
      "Body 2: renewables — the fourteen-fold rise, and the point where growth accelerates.",
    ],
  },
  {
    id: "w1-transport",
    task: 1,
    kind: "Bar chart",
    minutes: 20,
    minWords: 150,
    prompt:
      "The chart below shows how people in four cities travelled to work in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: {
      kind: "bar",
      caption: "Main mode of travel to work by city, 2024 (%)",
      labels: ["Almaty", "Astana", "Shymkent", "Aktobe"],
      unit: "%",
      series: [
        { name: "Car", values: [46, 52, 38, 41] },
        { name: "Public transport", values: [39, 33, 44, 36] },
        { name: "Walking or cycling", values: [15, 15, 18, 23] },
      ],
    },
    keywords: ["car", "public transport", "walking", "highest", "lowest", "comparison"],
    guidance: {
      en: "With no time axis, comparison is the whole task. Group the cities that behave alike instead of describing all twelve bars in turn.",
      ru: "Оси времени нет, поэтому вся задача — сравнение. Группируй города, которые ведут себя похоже, вместо описания всех двенадцати столбцов подряд.",
    },
    modelOutline: [
      "Paraphrase: four cities, three modes, one year.",
      "Overview: car dominates in three cities; public transport leads only in Shymkent.",
      "Body 1: the car-led cities, with the highest and lowest figures.",
      "Body 2: walking and cycling — smallest everywhere, but notably higher in Aktobe.",
    ],
  },
  {
    id: "w1-water",
    task: 1,
    kind: "Pie charts",
    minutes: 20,
    minWords: 150,
    prompt:
      "The charts below show how water was used in a region in 1995 and in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: {
      kind: "pie",
      caption: "Water use by sector, 1995 and 2024 (%)",
      labels: ["Agriculture", "Industry", "Households", "Losses"],
      unit: "%",
      series: [
        { name: "1995", values: [72, 12, 8, 8] },
        { name: "2024", values: [58, 19, 15, 8] },
      ],
    },
    keywords: ["agriculture", "industry", "households", "losses", "proportion", "unchanged"],
    guidance: {
      en: "Two pies means change over time in proportions, not amounts. The unchanged category is worth a sentence — noticing what did not move is a band 7 move.",
      ru: "Две диаграммы — это изменение долей, а не объёмов. Категория, которая не изменилась, стоит отдельного предложения: заметить неизменное — приём уровня band 7.",
    },
    modelOutline: [
      "Paraphrase: proportions of water use, two years, one region.",
      "Overview: agriculture still dominates but its share fell; industry and households grew.",
      "Body 1: the fall in agriculture against the rise in the other two.",
      "Body 2: losses held at exactly 8% across both years.",
    ],
  },
  {
    id: "w1-process",
    task: 1,
    kind: "Process diagram",
    minutes: 20,
    minWords: 150,
    prompt:
      "The diagram below shows the stages in producing felt from raw wool.\n\nSummarise the information by selecting and reporting the main features.",
    chart: {
      kind: "process",
      caption: "Traditional felt production, six stages",
      labels: [],
      unit: "",
      series: [],
      stages: [
        "Shearing — wool is cut from the sheep in a single fleece",
        "Sorting — coarse and fine fibres are separated by hand",
        "Washing — fleece is soaked in warm water to remove grease",
        "Carding — fibres are combed until they lie in one direction",
        "Layering — thin sheets are laid at right angles to each other",
        "Rolling — the layers are wetted, rolled and pressed until they bond",
      ],
    },
    keywords: ["shearing", "sorting", "washing", "carding", "layering", "rolling", "stages"],
    guidance: {
      en: "A process needs the passive voice and sequencing language, and no data at all. Do not invent numbers; do state how many stages there are and where the process begins and ends.",
      ru: "Процесс требует пассивного залога и слов последовательности, а цифр здесь нет вовсе. Не выдумывай числа, но обязательно скажи, сколько стадий и где процесс начинается и заканчивается.",
    },
    modelOutline: [
      "Paraphrase: the diagram illustrates how felt is made from raw wool.",
      "Overview: six stages, beginning with shearing and ending with rolling; the process is manual throughout.",
      "Body 1: preparation stages — shearing, sorting, washing.",
      "Body 2: forming stages — carding, layering, rolling.",
    ],
  },
  {
    id: "w1-table",
    task: 1,
    kind: "Table",
    minutes: 20,
    minWords: 150,
    prompt:
      "The table below shows enrolment in three types of post-school education in one country, in thousands of students.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: {
      kind: "table",
      caption: "Enrolment by institution type (thousands of students)",
      labels: ["2012", "2016", "2020", "2024"],
      unit: "thousand",
      series: [
        { name: "Universities", values: [520, 545, 561, 574] },
        { name: "Technical colleges", values: [180, 214, 268, 341] },
        { name: "Online programmes", values: [12, 38, 145, 302] },
      ],
    },
    keywords: ["universities", "technical colleges", "online", "growth", "fastest", "2024"],
    guidance: {
      en: "A table rewards ratios. Universities grew by about 10% while online programmes grew twenty-five-fold — saying that is worth more than reciting twelve numbers.",
      ru: "Таблица вознаграждает за отношения. Университеты выросли примерно на 10%, а онлайн-программы — в двадцать пять раз; сказать это ценнее, чем перечислить двенадцать чисел.",
    },
    modelOutline: [
      "Paraphrase: enrolment in three sectors over twelve years.",
      "Overview: all three grew, but at very different rates; online overtook technical colleges' 2012 level within eight years.",
      "Body 1: universities — largest but slowest.",
      "Body 2: technical colleges and online programmes — the fast movers.",
    ],
  },

  /* ---------------- Task 2 ---------------- */
  {
    id: "w2-remote-school",
    task: 2,
    kind: "Opinion (agree/disagree)",
    minutes: 40,
    minWords: 250,
    prompt:
      "Some people believe that online lessons can fully replace traditional schools in rural areas, where qualified teachers are scarce.\n\nTo what extent do you agree or disagree?",
    keywords: ["online lessons", "rural", "qualified teachers", "replace", "disadvantages", "opinion"],
    guidance: {
      en: "An opinion question wants one position held consistently. \"To what extent\" allows a partial agreement, but the introduction must say which way you lean before the body starts.",
      ru: "Вопрос на мнение требует одной позиции, выдержанной до конца. «To what extent» разрешает частичное согласие, но во введении надо сказать, к чему ты склоняешься.",
    },
    modelOutline: [
      "Introduction: paraphrase, then state your position clearly.",
      "Body 1: the strongest reason for your side, developed with one concrete example.",
      "Body 2: a second reason, or the opposing view answered.",
      "Conclusion: restate the position — add nothing new.",
    ],
  },
  {
    id: "w2-exam-pressure",
    task: 2,
    kind: "Discussion (both views)",
    minutes: 40,
    minWords: 250,
    prompt:
      "Some people think that national examinations such as the UNT motivate students to work hard. Others believe such examinations narrow what schools teach.\n\nDiscuss both views and give your own opinion.",
    keywords: ["examinations", "motivate", "narrow", "curriculum", "both views", "own opinion"],
    guidance: {
      en: "This question type has three obligations: view one, view two, and your own. Answers that give two views and forget the third are the most common band 6 ceiling in this task.",
      ru: "У этого типа три обязательства: первая точка зрения, вторая и твоя собственная. Ответы с двумя мнениями и без третьего — самая частая причина потолка в band 6.",
    },
    modelOutline: [
      "Introduction: paraphrase both views, then state your own in one clause.",
      "Body 1: the motivation argument, fairly presented.",
      "Body 2: the narrowing argument, fairly presented.",
      "Conclusion: your position and why it follows from the two.",
    ],
  },
  {
    id: "w2-city-migration",
    task: 2,
    kind: "Problem and solution",
    minutes: 40,
    minWords: 250,
    prompt:
      "In many countries young people are leaving small towns for large cities, leaving those towns without a working-age population.\n\nWhat problems does this cause, and what measures could be taken to address them?",
    keywords: ["young people", "small towns", "cities", "problems", "measures", "solutions"],
    guidance: {
      en: "Two questions, so two body paragraphs — one for problems, one for measures. Each measure must answer a problem you actually named, or the essay loses coherence.",
      ru: "Два вопроса — два абзаца: один про проблемы, другой про меры. Каждая мера должна отвечать на названную тобой проблему, иначе теряется связность.",
    },
    modelOutline: [
      "Introduction: paraphrase, then signal that you will cover both problems and measures.",
      "Body 1: two problems, developed — not a list of five.",
      "Body 2: one measure per problem, with how it would work.",
      "Conclusion: the link between the two.",
    ],
  },
  {
    id: "w2-ai-jobs",
    task: 2,
    kind: "Advantages and disadvantages",
    minutes: 40,
    minWords: 250,
    prompt:
      "Artificial intelligence is increasingly used to perform tasks previously done by trained professionals, including translation, diagnosis and legal research.\n\nDo the advantages of this development outweigh the disadvantages?",
    keywords: ["artificial intelligence", "professionals", "advantages", "disadvantages", "outweigh", "employment"],
    guidance: {
      en: "\"Outweigh\" is a comparison, not a list. You must weigh one side against the other explicitly, and the conclusion has to say which won.",
      ru: "«Outweigh» — это сравнение, а не список. Нужно прямо взвесить одну сторону против другой, и в заключении сказать, какая перевесила.",
    },
    modelOutline: [
      "Introduction: paraphrase and state which side outweighs the other.",
      "Body 1: the weaker side, given fairly.",
      "Body 2: the stronger side, and why it outweighs the first.",
      "Conclusion: the verdict, unchanged from the introduction.",
    ],
  },
  {
    id: "w2-language-loss",
    task: 2,
    kind: "Two-part question",
    minutes: 40,
    minWords: 250,
    prompt:
      "Many minority languages are disappearing as their speakers move to dominant national languages.\n\nWhy is this happening, and should governments spend money to preserve these languages?",
    keywords: ["minority languages", "disappearing", "reasons", "governments", "spend", "preserve"],
    guidance: {
      en: "Two direct questions: causes, then a should-or-shouldn't judgement. Answer both — an essay that only explains causes cannot pass band 6 on Task Response.",
      ru: "Два прямых вопроса: причины и оценочное «should». Ответь на оба — эссе, объясняющее только причины, не пройдёт band 6 по Task Response.",
    },
    modelOutline: [
      "Introduction: paraphrase both questions, signal both will be answered.",
      "Body 1: two causes, developed.",
      "Body 2: your judgement on public spending, with a reason and a counter-consideration.",
      "Conclusion: both answers in one sentence each.",
    ],
  },
  {
    id: "w2-free-university",
    task: 2,
    kind: "Opinion (agree/disagree)",
    minutes: 40,
    minWords: 250,
    prompt:
      "Some people argue that university education should be free for all students, regardless of their family income.\n\nTo what extent do you agree or disagree?",
    keywords: ["university", "free", "income", "taxes", "access", "opinion"],
    guidance: {
      en: "Beware of drifting into \"education is important\". The question is about who pays, so every paragraph must stay on funding and access.",
      ru: "Не соскользни в «образование важно». Вопрос о том, кто платит, поэтому каждый абзац должен держаться темы финансирования и доступа.",
    },
    modelOutline: [
      "Introduction: paraphrase, state position.",
      "Body 1: main argument for your side, with a concrete mechanism.",
      "Body 2: the strongest objection, answered rather than ignored.",
      "Conclusion: restate.",
    ],
  },
  {
    id: "w2-tourism-heritage",
    task: 2,
    kind: "Discussion (both views)",
    minutes: 40,
    minWords: 250,
    prompt:
      "Some people believe that tourism is the best way to fund the preservation of historical sites. Others argue that visitors damage the very places they come to see.\n\nDiscuss both views and give your own opinion.",
    keywords: ["tourism", "funding", "preservation", "damage", "historical sites", "opinion"],
    guidance: {
      en: "A good answer resolves the tension rather than sitting on the fence: the two views can both be true under different conditions, and saying which conditions is what lifts the band.",
      ru: "Сильный ответ снимает противоречие, а не отсиживается посередине: обе точки зрения могут быть верны при разных условиях, и указание этих условий поднимает балл.",
    },
    modelOutline: [
      "Introduction: paraphrase both views, state your own.",
      "Body 1: the funding argument, with how the money actually reaches conservation.",
      "Body 2: the damage argument, with a specific mechanism of harm.",
      "Conclusion: the condition under which tourism helps rather than harms.",
    ],
  },
  {
    id: "w2-screen-time",
    task: 2,
    kind: "Problem and solution",
    minutes: 40,
    minWords: 250,
    prompt:
      "Children in many countries now spend several hours a day on smartphones and tablets.\n\nWhat are the causes of this, and what can families and schools do about it?",
    keywords: ["children", "smartphones", "causes", "families", "schools", "solutions"],
    guidance: {
      en: "Two actors are named — families and schools — so both need a measure. Ignoring one of them is a Task Response deduction even if the writing is otherwise strong.",
      ru: "Названы два действующих лица — семьи и школы, — значит, мера нужна для обоих. Проигнорировать одного — это минус по Task Response, даже если текст в остальном сильный.",
    },
    modelOutline: [
      "Introduction: paraphrase, signal causes and responses.",
      "Body 1: two causes, developed.",
      "Body 2: one measure for families, one for schools.",
      "Conclusion: tie the measures back to the causes.",
    ],
  },
];

export const ieltsWritingById = (id: string) => IELTS_WRITING.find((p) => p.id === id);
export const writingTask1 = IELTS_WRITING.filter((p) => p.task === 1);
export const writingTask2 = IELTS_WRITING.filter((p) => p.task === 2);
