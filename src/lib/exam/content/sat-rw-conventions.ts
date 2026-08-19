import type { ExamItem } from "../types";

/**
 * SAT Reading & Writing — Standard English Conventions and Expression of Ideas.
 *
 * The conventions half of the section is the fastest part of the whole SAT to
 * improve, because it tests a closed list of rules. Every explanation here names
 * the rule rather than saying "this one sounds better", so the same reasoning
 * transfers to the next question.
 */

export const SAT_RW_CONVENTIONS: ExamItem[] = [
  /* ---------------- Boundaries: sentence joins and punctuation ---------------- */
  {
    id: "rw-bnd-01",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "easy",
    context:
      "The Charyn Canyon formed over roughly twelve million years as the river cut through layers of sedimentary rock _____ the softer layers eroded faster, leaving the columns that draw visitors today.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["rock,", "rock;", "rock and", "rock, and"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Both halves are independent clauses. A semicolon joins two independent clauses; a comma alone would be a splice.",
      ru: "Обе части — самостоятельные предложения. Точка с запятой соединяет два независимых предложения; одна запятая дала бы comma splice.",
    },
    trap: {
      en: "\"rock, and\" would also be grammatical, but it is not offered — \"rock and\" without the comma is, and that version needs the comma because both sides are full clauses.",
      ru: "«rock, and» тоже было бы верно, но такого варианта нет: есть «rock and» без запятой, а он неверен — по обе стороны полные предложения.",
    },
  },
  {
    id: "rw-bnd-02",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "medium",
    context:
      "Dinara Sadykova, _____ research on cold-adapted enzymes has been cited in more than four hundred papers, began her career studying bacteria isolated from glacial meltwater.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["who's", "whose", "which", "whom"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "The clause needs a possessive: the research belongs to Sadykova. \"Whose\" is the possessive relative pronoun.",
      ru: "Нужно притяжательное местоимение: исследование принадлежит Садыковой. «Whose» — притяжательное относительное местоимение.",
    },
    trap: {
      en: "\"Who's\" is \"who is\" — putting it here gives \"who is research has been cited\", which is not a sentence.",
      ru: "«Who's» — это «who is»; получилось бы «who is research has been cited», а это не предложение.",
    },
  },
  {
    id: "rw-bnd-03",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "hard",
    context:
      "The team's conclusion rested on three assumptions _____ that the sediment layers were undisturbed, that the dating method was accurate within fifty years, and that the site had been occupied continuously.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["assumptions:", "assumptions,", "assumptions;", "assumptions"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "A colon introduces a list that spells out something already named in a complete independent clause. \"Three assumptions\" announces the list; the colon delivers it.",
      ru: "Двоеточие вводит перечисление, раскрывающее то, что уже названо в законченном предложении. «Three assumptions» анонсирует список, двоеточие его подаёт.",
    },
    trap: {
      en: "A semicolon needs an independent clause on both sides; the list of \"that\" phrases is not one.",
      ru: "Точке с запятой нужны полные предложения с обеих сторон, а перечисление с «that» таковым не является.",
    },
  },
  {
    id: "rw-bnd-04",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "medium",
    context:
      "Having spent four winters recording wolf vocalisations in the Altai _____ able to distinguish individual animals by ear alone.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: [", the biologist was", "the biologist was", ", and the biologist was", "; the biologist was"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "\"Having spent four winters…\" is an introductory participial phrase, so it takes a comma and must be followed by the subject it describes.",
      ru: "«Having spent four winters…» — вводный причастный оборот: после него ставится запятая, а дальше идёт подлежащее, к которому он относится.",
    },
  },
  {
    id: "rw-bnd-05",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "hard",
    context:
      "The manuscript is remarkable less for its illustrations _____ which are conventional for the period _____ than for its marginal notes, which record the prices paid for pigments.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["—  …  —", ", … ,", "( … ,", ", … —"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "A parenthetical insertion must be closed with the same mark it was opened with. Dashes on both sides is the only matched pair here.",
      ru: "Вставная конструкция закрывается тем же знаком, каким открыта. Тире с обеих сторон — единственная согласованная пара.",
    },
    trap: {
      en: "Mixing a comma with a dash is the classic trap: the SAT tests matching punctuation far more often than it tests which mark you prefer.",
      ru: "Смешать запятую и тире — классическая ловушка: SAT гораздо чаще проверяет парность знаков, чем выбор между ними.",
    },
  },

  /* ---------------- Form, Structure and Sense ---------------- */
  {
    id: "rw-fss-01",
    skill: "Standard English Conventions",
    topic: "Subject-Verb Agreement",
    difficulty: "medium",
    context:
      "The collection of letters written by soldiers stationed along the Irtysh _____ a picture of daily life that official dispatches omit entirely.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["offer", "offers", "have offered", "are offering"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "The subject is \"collection\", which is singular. \"Of letters written by soldiers stationed along the Irtysh\" is a prepositional pile-up that never changes the subject.",
      ru: "Подлежащее — «collection», единственное число. «Of letters written by soldiers stationed along the Irtysh» — нагромождение предлогов, которое подлежащее не меняет.",
    },
    trap: {
      en: "\"Soldiers\" sits right before the blank and pulls the ear toward a plural verb. Cross out everything between the subject and the verb before choosing.",
      ru: "«Soldiers» стоит прямо перед пропуском и тянет к множественному числу. Вычеркни всё между подлежащим и сказуемым, прежде чем выбирать.",
    },
  },
  {
    id: "rw-fss-02",
    skill: "Standard English Conventions",
    topic: "Verb Tense",
    difficulty: "hard",
    context:
      "By the time the excavation permit expired in 2019, the team _____ four of the six mounds identified in the initial survey.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["has opened", "had opened", "opens", "will have opened"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "\"By the time X happened\" fixes a past reference point, and the digging finished before it. Past-before-past is the past perfect: \"had opened\".",
      ru: "«By the time X happened» задаёт точку в прошлом, а раскопки завершились до неё. Прошедшее до прошедшего — это past perfect: «had opened».",
    },
  },
  {
    id: "rw-fss-03",
    skill: "Standard English Conventions",
    topic: "Pronoun Agreement",
    difficulty: "medium",
    context:
      "Each of the four regional archives has digitised _____ holdings at a different pace, which makes a unified catalogue difficult to assemble.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["their", "its", "it's", "whose"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "\"Each\" is singular, so the possessive pronoun referring back to it is \"its\".",
      ru: "«Each» — единственное число, поэтому притяжательное местоимение к нему — «its».",
    },
    trap: {
      en: "\"It's\" always means \"it is\". The possessive \"its\" has no apostrophe.",
      ru: "«It's» всегда значит «it is». У притяжательного «its» апострофа нет.",
    },
  },
  {
    id: "rw-fss-04",
    skill: "Standard English Conventions",
    topic: "Modifier Placement",
    difficulty: "hard",
    context:
      "_____ the felt panels turned out to absorb far more sound than the researchers had predicted.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: [
      "Testing the acoustics of the reconstructed yurt,",
      "After testing the acoustics of the reconstructed yurt,",
      "Having tested the acoustics of the reconstructed yurt,",
      "To test the acoustics of the reconstructed yurt,",
    ],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "The subject of the main clause is \"the felt panels\", and panels cannot test anything. Only option B avoids a dangling modifier, because \"After…\" does not require the subject to be the one testing.",
      ru: "Подлежащее главной части — «the felt panels», а панели ничего тестировать не могут. Только вариант B избегает висячего оборота: «After…» не требует, чтобы подлежащее было исполнителем.",
    },
    trap: {
      en: "Options A, C and D are all participial or infinitive phrases whose implied doer must be the subject — which would say the panels tested themselves.",
      ru: "Варианты A, C и D — обороты, чей подразумеваемый деятель обязан быть подлежащим; вышло бы, что панели тестировали сами себя.",
    },
  },
  {
    id: "rw-fss-05",
    skill: "Standard English Conventions",
    topic: "Parallel Structure",
    difficulty: "medium",
    context:
      "A good field notebook records what was observed, when the observation was made, and _____",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: [
      "the conditions under which it occurred.",
      "under what conditions did it occur.",
      "occurring under which conditions.",
      "what were the conditions of its occurrence?",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The list runs \"what was observed\" / \"when the observation was made\" / third item. The first two are noun clauses in statement order, and only option A continues that pattern.",
      ru: "Перечисление: «what was observed» / «when the observation was made» / третий элемент. Первые два — придаточные в порядке утверждения, и только вариант A продолжает эту схему.",
    },
    trap: {
      en: "Option B slips into question word order (\"did it occur\"), which breaks the parallel even though it sounds natural aloud.",
      ru: "Вариант B соскальзывает в вопросительный порядок слов («did it occur») и ломает параллелизм, хотя на слух звучит естественно.",
    },
  },
  {
    id: "rw-fss-06",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "easy",
    context:
      "The bridge was designed to carry freight _____ however, within a decade it was serving mainly passenger traffic.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["traffic,", "traffic;", "traffic", "traffic and"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "\"However\" is a conjunctive adverb, not a conjunction: it cannot join two independent clauses with only a comma. Semicolon before, comma after.",
      ru: "«However» — вводное наречие, а не союз: соединить два независимых предложения одной запятой оно не может. Перед ним точка с запятой, после — запятая.",
    },
  },

  /* ---------------- Expression of Ideas: transitions ---------------- */
  {
    id: "rw-trn-01",
    skill: "Expression of Ideas",
    topic: "Transitions",
    difficulty: "medium",
    context:
      "Solar capacity in the region grew by 340 percent between 2018 and 2024. _____ grid upgrades did not keep pace, and by 2024 operators were curtailing output on sunny afternoons because the network could not absorb it.",
    stem: "Which choice completes the text with the most logical transition?",
    options: ["For example,", "Similarly,", "However,", "Therefore,"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "Rapid growth is good news; failing grid upgrades that force curtailment is the opposite. The relationship is contrast.",
      ru: "Быстрый рост — хорошая новость; отставание сетей, из-за которого выработку приходится ограничивать, — обратное. Связь здесь противительная.",
    },
    trap: {
      en: "\"Therefore\" claims the second fact follows from the first, but growing solar capacity does not cause grids to stall — that is a separate failure.",
      ru: "«Therefore» утверждает, что второе следует из первого, но рост солнечной генерации не вызывает отставания сетей — это отдельная проблема.",
    },
  },
  {
    id: "rw-trn-02",
    skill: "Expression of Ideas",
    topic: "Transitions",
    difficulty: "hard",
    context:
      "The author never claims that the ritual was widespread. She describes a single community over two decades and is careful to mark the boundaries of her sample. _____ readers have repeatedly cited the book as evidence of a region-wide practice.",
    stem: "Which choice completes the text with the most logical transition?",
    options: ["Consequently,", "Nonetheless,", "In other words,", "For instance,"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "The author limited her claim; readers ignored the limit anyway. \"Nonetheless\" marks something happening in spite of what came before.",
      ru: "Автор ограничила свой тезис; читатели всё равно это проигнорировали. «Nonetheless» отмечает то, что происходит вопреки сказанному.",
    },
    trap: {
      en: "\"Consequently\" would mean her carefulness caused the misreading, which reverses the logic.",
      ru: "«Consequently» означало бы, что её аккуратность вызвала неверное прочтение, — это переворачивает логику.",
    },
  },
  {
    id: "rw-trn-03",
    skill: "Expression of Ideas",
    topic: "Transitions",
    difficulty: "easy",
    context:
      "Permafrost holds an estimated 1,500 billion tonnes of carbon, roughly twice the amount currently in the atmosphere. _____ even a partial thaw would represent a substantial addition to the global carbon budget.",
    stem: "Which choice completes the text with the most logical transition?",
    options: ["Nevertheless,", "By contrast,", "Consequently,", "Meanwhile,"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "The size of the store is the reason a partial thaw matters. Cause to conclusion takes \"consequently\".",
      ru: "Объём запаса — причина того, что даже частичное таяние важно. От причины к следствию — «consequently».",
    },
  },

  /* ---------------- Expression of Ideas: rhetorical synthesis ---------------- */
  {
    id: "rw-syn-01",
    skill: "Expression of Ideas",
    topic: "Rhetorical Synthesis",
    difficulty: "medium",
    context:
      "While researching a presentation, a student has taken the following notes:\n\n• Kazakhstan's Turkestan region receives under 250 mm of rainfall a year.\n• Cotton has been the region's dominant irrigated crop since the 1960s.\n• Cotton requires roughly 7,000 m³ of water per hectare per season.\n• Safflower yields less revenue per hectare but needs about 2,500 m³.\n• A 2023 pilot converted 400 hectares from cotton to safflower.",
    stem: "The student wants to emphasise the difference in water demand between the two crops. Which choice most effectively uses the relevant information from the notes to accomplish this goal?",
    options: [
      "Cotton, the region's dominant irrigated crop since the 1960s, requires roughly 7,000 m³ of water per hectare each season, while safflower needs about 2,500 m³.",
      "In 2023, a pilot project converted 400 hectares of land in the Turkestan region from cotton to safflower.",
      "The Turkestan region receives under 250 mm of rainfall a year, which is why irrigation is necessary there.",
      "Safflower yields less revenue per hectare than cotton, although it has been grown in the region for a shorter time.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The stated goal is the water-demand difference, so the answer must put both water figures side by side. Only option A does.",
      ru: "Заявленная цель — разница в потреблении воды, значит, в ответе должны стоять рядом обе цифры по воде. Это делает только вариант A.",
    },
    trap: {
      en: "Option D is true and relevant to the topic but compares revenue, not water — always answer the goal in the question, not the subject of the notes.",
      ru: "Вариант D верен и по теме, но сравнивает доход, а не воду. Отвечай всегда на цель из вопроса, а не на тему заметок.",
    },
  },
  {
    id: "rw-syn-02",
    skill: "Expression of Ideas",
    topic: "Rhetorical Synthesis",
    difficulty: "hard",
    context:
      "While researching a topic, a student has taken the following notes:\n\n• The dombyra is a two-stringed Kazakh lute.\n• Küy is an instrumental genre performed on the dombyra.\n• A küy is traditionally introduced by a spoken legend explaining its origin.\n• Kurmangazy Sagyrbaiuly (1823–1896) composed more than sixty küys.\n• Ethnomusicologists note that the spoken introductions are rarely recorded on modern albums.",
    stem: "The student wants to present the genre to an audience unfamiliar with it and highlight something modern recordings lose. Which choice most effectively uses the relevant information from the notes to accomplish this goal?",
    options: [
      "Küy, an instrumental genre played on the two-stringed dombyra, is traditionally introduced by a spoken legend about its origin — an element modern albums rarely preserve.",
      "Kurmangazy Sagyrbaiuly, who lived from 1823 to 1896, composed more than sixty küys for the dombyra.",
      "The dombyra is a two-stringed Kazakh lute, and küy is the instrumental genre performed on it.",
      "Ethnomusicologists have observed that spoken introductions are rarely recorded on modern albums of Kazakh music.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Two goals are set: introduce the genre to newcomers *and* name what recordings lose. Option A is the only one that does both in a single sentence.",
      ru: "Целей две: представить жанр незнакомой аудитории и назвать, что теряют записи. Только вариант A делает оба в одном предложении.",
    },
    trap: {
      en: "Options C and D each satisfy exactly one half of the goal. When a synthesis question names two aims, an answer that meets one of them is still wrong.",
      ru: "Варианты C и D закрывают ровно по половине цели. Если в вопросе две задачи, ответ, решающий одну, всё равно неверен.",
    },
  },
];
