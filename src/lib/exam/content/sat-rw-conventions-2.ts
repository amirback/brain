import type { ExamItem } from "../types";

/**
 * SAT Reading & Writing — Standard English Conventions and Expression of Ideas,
 * batch 2. Same rule coverage as batch 1 at a different difficulty spread, so a
 * module 2 drawn from the harder mix still tests the full set of conventions.
 */

export const SAT_RW_CONVENTIONS_2: ExamItem[] = [
  {
    id: "rw2-bnd-01",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "easy",
    context:
      "The mural was painted over in 1974 _____ a photograph taken the previous summer is the only record of it that survives.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["1974,", "1974;", "1974 and", "1974 which"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Two independent clauses need a semicolon, a period, or a comma plus a coordinating conjunction. Only the semicolon is offered in a correct form.",
      ru: "Два самостоятельных предложения соединяются точкой с запятой, точкой либо запятой с сочинительным союзом. В верной форме предложена только точка с запятой.",
    },
  },
  {
    id: "rw2-bnd-02",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "hard",
    context:
      "The excavation produced three artefacts of unusual interest _____ a bronze mirror, a set of bone dice, and a wooden comb still bearing traces of pigment.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["interest:", "interest;", "interest,", "interest, and"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The clause before the blank is complete and announces a list; a colon introduces the items that spell it out.",
      ru: "Часть перед пропуском — законченное предложение, анонсирующее перечисление; двоеточие вводит сами элементы.",
    },
    trap: {
      en: "A semicolon demands a full clause after it, and a bare list of noun phrases is not one.",
      ru: "После точки с запятой должно идти полное предложение, а перечисление именных групп таковым не является.",
    },
  },
  {
    id: "rw2-bnd-03",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "medium",
    context:
      "Sholpan Zhandarbekova, _____ was among the first women to direct at the Auezov Theatre, trained as an actor before moving behind the scenes.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["who", "whom", "which", "she"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The pronoun is the subject of \"was among the first\", so the subject form \"who\" is required. \"Which\" cannot refer to a person.",
      ru: "Местоимение — подлежащее при «was among the first», значит, нужна форма подлежащего «who». «Which» к человеку не относится.",
    },
    trap: {
      en: "Choosing \"she\" creates two subjects for one verb and turns the sentence into a run-on.",
      ru: "Вариант «she» даёт два подлежащих при одном сказуемом и превращает фразу в слитное предложение.",
    },
  },
  {
    id: "rw2-bnd-04",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "medium",
    context:
      "The lake freezes each December _____ by late March the ice has broken up completely.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["December, but", "December but", "December,", "December —"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Two independent clauses joined by the coordinating conjunction \"but\" take a comma before it.",
      ru: "Два самостоятельных предложения, соединённые сочинительным союзом «but», требуют запятой перед ним.",
    },
  },
  {
    id: "rw2-bnd-05",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "hard",
    context:
      "Two of the manuscripts _____ the ones catalogued in 1908 _____ have never been photographed.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: [", … ,", "— … ,", ", … —", "( … —"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "A parenthetical must open and close with the same mark. Commas on both sides is the only matched pair offered.",
      ru: "Вставная конструкция открывается и закрывается одним и тем же знаком. Запятые с обеих сторон — единственная согласованная пара из предложенных.",
    },
  },
  {
    id: "rw2-fss-01",
    skill: "Standard English Conventions",
    topic: "Subject-Verb Agreement",
    difficulty: "medium",
    context:
      "A series of measurements taken at stations along the river _____ that the peak flow now arrives nearly three weeks earlier than it did in 1980.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["show", "shows", "have shown", "were showing"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "The subject is \"a series\", which is singular. Everything from \"of measurements\" to \"river\" is modification.",
      ru: "Подлежащее — «a series», единственное число. Всё от «of measurements» до «river» — определения.",
    },
    trap: {
      en: "\"Stations\" and \"measurements\" are both plural and both sit closer to the verb than the actual subject does.",
      ru: "«Stations» и «measurements» стоят во множественном числе и ближе к сказуемому, чем настоящее подлежащее.",
    },
  },
  {
    id: "rw2-fss-02",
    skill: "Standard English Conventions",
    topic: "Verb Tense",
    difficulty: "hard",
    context:
      "Researchers have been monitoring the colony since 2011, and by the time the current survey concludes next spring they _____ data for a full fifteen breeding seasons.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["collected", "have collected", "will have collected", "had collected"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "\"By the time X concludes next spring\" sets a point in the future, and the collecting will be complete before it. That is the future perfect.",
      ru: "«By the time X concludes next spring» задаёт точку в будущем, а сбор данных завершится до неё. Это future perfect.",
    },
  },
  {
    id: "rw2-fss-03",
    skill: "Standard English Conventions",
    topic: "Pronoun Agreement",
    difficulty: "medium",
    context:
      "Neither of the two proposals submitted to the council addressed _____ effect on traffic in the surrounding streets.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["their", "its", "it's", "there"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "\"Neither\" is singular, so the possessive is \"its\".",
      ru: "«Neither» — единственное число, поэтому притяжательное местоимение — «its».",
    },
    trap: {
      en: "\"Proposals\" is plural and sits between the subject and the pronoun, which is exactly why the trap works.",
      ru: "«Proposals» стоит во множественном числе между подлежащим и местоимением — на этом ловушка и построена.",
    },
  },
  {
    id: "rw2-fss-04",
    skill: "Standard English Conventions",
    topic: "Modifier Placement",
    difficulty: "hard",
    context:
      "_____ the report was rewritten twice before the committee accepted it.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: [
      "Although the findings were never disputed,",
      "Disputing none of the findings,",
      "Having disputed none of the findings,",
      "To dispute none of the findings,",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The subject of the main clause is \"the report\", and a report cannot dispute anything. Only the full subordinate clause in option A avoids attaching the action to it.",
      ru: "Подлежащее главной части — «the report», а отчёт ничего оспаривать не может. Только полное придаточное в варианте A не привязывает действие к нему.",
    },
  },
  {
    id: "rw2-fss-05",
    skill: "Standard English Conventions",
    topic: "Parallel Structure",
    difficulty: "medium",
    context:
      "The training covers reading a topographic map, estimating distance by pacing, and _____",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: [
      "improvising a shelter from available materials.",
      "how a shelter can be improvised from available materials.",
      "to improvise a shelter from available materials.",
      "a shelter improvised from available materials.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The list runs \"reading… / estimating… / third item\". The first two are -ing phrases, so the third must be one too.",
      ru: "Перечисление идёт «reading… / estimating… / третий элемент». Первые два — обороты с -ing, значит, и третий должен быть таким же.",
    },
  },
  {
    id: "rw2-fss-06",
    skill: "Standard English Conventions",
    topic: "Boundaries",
    difficulty: "medium",
    context:
      "The instrument was calibrated at the factory _____ therefore, any drift observed in the field points to a fault in the mounting rather than in the sensor.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["factory,", "factory;", "factory", "factory and"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "\"Therefore\" is a conjunctive adverb and cannot join two independent clauses with a comma alone. Semicolon before, comma after.",
      ru: "«Therefore» — вводное наречие, соединить два самостоятельных предложения одной запятой оно не может. Перед ним точка с запятой, после — запятая.",
    },
  },
  {
    id: "rw2-fss-07",
    skill: "Standard English Conventions",
    topic: "Possessives",
    difficulty: "hard",
    context:
      "Both of the museums _____ collections were merged in 1996 had been founded by the same family.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["who's", "whose", "which", "that their"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "The collections belong to the museums, so a possessive relative pronoun is needed: \"whose\", which works for things as well as people.",
      ru: "Коллекции принадлежат музеям, значит, нужно притяжательное относительное местоимение «whose» — оно годится и для предметов, и для людей.",
    },
  },
  {
    id: "rw2-trn-01",
    skill: "Expression of Ideas",
    topic: "Transitions",
    difficulty: "medium",
    context:
      "Early prototypes of the device failed within a few hundred cycles because the seal hardened and cracked. _____ the current version uses a compound that stays flexible across the full operating temperature range.",
    stem: "Which choice completes the text with the most logical transition?",
    options: ["Similarly,", "In response,", "Nevertheless,", "For example,"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "The second sentence describes a fix for the problem named in the first. \"In response\" marks a deliberate answer to it.",
      ru: "Второе предложение описывает решение проблемы из первого. «In response» отмечает намеренный ответ на неё.",
    },
    trap: {
      en: "\"Nevertheless\" would mean the new version succeeded despite using a better compound, which reverses the logic.",
      ru: "«Nevertheless» означало бы, что новая версия удалась вопреки лучшему составу, — это переворачивает логику.",
    },
  },
  {
    id: "rw2-trn-02",
    skill: "Expression of Ideas",
    topic: "Transitions",
    difficulty: "hard",
    context:
      "The survey found that most respondents could name the policy and describe its main provision accurately. _____ fewer than one in five could say which body was responsible for enforcing it.",
    stem: "Which choice completes the text with the most logical transition?",
    options: ["Consequently,", "Likewise,", "However,", "In particular,"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "Widespread accurate knowledge is set against a sharp gap in a related area. That is contrast.",
      ru: "Широкой осведомлённости противопоставлен резкий провал в смежном вопросе. Это противопоставление.",
    },
  },
  {
    id: "rw2-trn-03",
    skill: "Expression of Ideas",
    topic: "Transitions",
    difficulty: "easy",
    context:
      "Snow cover reflects most of the sunlight that reaches it, while bare ground absorbs most of it. _____ an early thaw warms the surface faster than the air temperature alone would suggest.",
    stem: "Which choice completes the text with the most logical transition?",
    options: ["By contrast,", "As a result,", "Even so,", "Meanwhile,"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "The reflective difference is the cause; the faster warming is the effect. Cause to effect takes \"as a result\".",
      ru: "Разница в отражении — причина, более быстрый прогрев — следствие. От причины к следствию — «as a result».",
    },
  },
  {
    id: "rw2-syn-01",
    skill: "Expression of Ideas",
    topic: "Rhetorical Synthesis",
    difficulty: "medium",
    context:
      "While researching a topic, a student has taken the following notes:\n\n• The Kolsai Lakes lie in the Northern Tian Shan at 1,800 to 2,850 metres.\n• The upper lake is reachable only on foot or horseback.\n• Visitor numbers rose from 40,000 in 2015 to 210,000 in 2023.\n• A permit system was introduced in 2021, capping daily entries.\n• Water clarity readings declined between 2016 and 2020.",
    stem: "The student wants to emphasise the scale of the increase in visitors. Which choice most effectively uses the relevant information from the notes to accomplish this goal?",
    options: [
      "Visitor numbers at the Kolsai Lakes rose from 40,000 in 2015 to 210,000 in 2023, more than a fivefold increase.",
      "The Kolsai Lakes lie in the Northern Tian Shan, at elevations between 1,800 and 2,850 metres.",
      "A permit system capping daily entries was introduced at the Kolsai Lakes in 2021.",
      "Water clarity readings at the Kolsai Lakes declined between 2016 and 2020.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The goal is the scale of the increase, so the answer needs both endpoints and ideally the ratio. Only option A supplies them.",
      ru: "Цель — масштаб роста, значит, нужны обе крайние точки и, желательно, отношение. Их даёт только вариант A.",
    },
  },
  {
    id: "rw2-syn-02",
    skill: "Expression of Ideas",
    topic: "Rhetorical Synthesis",
    difficulty: "hard",
    context:
      "While researching a topic, a student has taken the following notes:\n\n• Felt is made by matting wool fibres together rather than weaving them.\n• Matting occurs because wool fibres have microscopic scales that interlock under pressure.\n• Felt has been produced across Central Asia for at least two thousand years.\n• Unlike woven cloth, felt does not unravel when cut.\n• Modern industrial felt is often made from synthetic fibres that lack scales, and requires adhesives.",
    stem: "The student wants to explain what makes traditional felt different from woven cloth and why the difference arises. Which choice most effectively uses the relevant information from the notes to accomplish this goal?",
    options: [
      "Felt is matted rather than woven — its fibres interlock through microscopic scales — which is why, unlike woven cloth, it does not unravel when cut.",
      "Felt has been produced across Central Asia for at least two thousand years, far longer than most woven textiles.",
      "Modern industrial felt is often made from synthetic fibres, which lack scales and therefore require adhesives.",
      "Wool fibres have microscopic scales that interlock with one another when pressure is applied to them.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Two goals: name the difference from woven cloth and explain its cause. Option A gives the mechanism (scales interlocking) and the consequence (does not unravel) in one sentence.",
      ru: "Целей две: назвать отличие от тканого полотна и объяснить причину. Вариант A даёт и механизм (сцепление чешуек), и следствие (не осыпается) в одном предложении.",
    },
    trap: {
      en: "Option D states the mechanism but never mentions woven cloth, so it answers only half the goal.",
      ru: "Вариант D называет механизм, но не упоминает тканое полотно, то есть отвечает лишь на половину задачи.",
    },
  },
];
