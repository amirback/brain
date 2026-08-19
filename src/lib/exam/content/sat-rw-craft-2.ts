import type { ExamItem } from "../types";

/**
 * SAT Reading & Writing — Craft and Structure, and Information and Ideas, batch 2.
 *
 * A full mock needs two 27-question modules that share no items, so the pool has to
 * carry well over fifty. These are drawn on for module 2 and for extra practice.
 */

export const SAT_RW_CRAFT_2: ExamItem[] = [
  {
    id: "rw2-wic-01",
    skill: "Craft and Structure",
    topic: "Words in Context",
    difficulty: "easy",
    context:
      "The first maps of the Caspian coastline were drawn by sailors who had never seen the shore from above. Their charts are _____ in places — a bay drawn too deep, a headland missed entirely — but the sequence of landmarks is reliable, because that is what a pilot actually needed.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["inaccurate", "decorative", "expensive", "recent"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The dashes give examples of errors — a bay too deep, a missing headland — so the blank must mean wrong in detail. \"Inaccurate\" fits, and the following clause contrasts it with what is reliable.",
      ru: "После тире идут примеры ошибок — слишком глубокий залив, пропущенный мыс, — значит, в пропуске слово со значением «неточный». «Inaccurate» подходит, а следующая часть противопоставляет ему то, что надёжно.",
    },
  },
  {
    id: "rw2-wic-02",
    skill: "Craft and Structure",
    topic: "Words in Context",
    difficulty: "hard",
    context:
      "Reviewers praised the novel's restraint, but the quality they identified is better described as _____: the narrator does not withhold judgement so much as postpone it, allowing each character a full hearing before the book finally rules against them.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["indifference", "deferral", "confusion", "sentimentality"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "The colon explains the word: judgement is \"postponed\" rather than withheld, and arrives at the end. \"Deferral\" names delay, which restraint does not.",
      ru: "Двоеточие расшифровывает слово: суждение «postponed», а не отсутствует, и в конце всё же выносится. «Deferral» — это отсрочка, чего слово restraint не передаёт.",
    },
    trap: {
      en: "\"Indifference\" would mean the book never rules at all, but the sentence says it finally does.",
      ru: "«Indifference» означало бы, что книга вовсе не выносит суждения, но в предложении сказано, что в конце выносит.",
    },
  },
  {
    id: "rw2-wic-03",
    skill: "Craft and Structure",
    topic: "Words in Context",
    difficulty: "medium",
    context:
      "Because the alloy expands and contracts far less than steel across the same temperature range, engineers describe it as dimensionally _____ — a property that makes it valuable in instruments that must hold their calibration outdoors.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["fragile", "stable", "porous", "transparent"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Little expansion or contraction means the dimensions hold steady, and holding calibration confirms it. \"Stable\" is the word.",
      ru: "Малое расширение и сжатие означают, что размеры держатся, а сохранение калибровки это подтверждает. Нужное слово — «stable».",
    },
  },
  {
    id: "rw2-wic-04",
    skill: "Craft and Structure",
    topic: "Words in Context",
    difficulty: "hard",
    context:
      "The committee's report is careful never to assign blame, and its authors present this as impartiality. A less charitable reading is available: an account that identifies no one as responsible is not neutral but _____, since the decisions it describes were made by people who can be named.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["evasive", "meticulous", "premature", "redundant"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The sentence rejects \"neutral\" and needs a word for avoiding something that could have been stated. \"Evasive\" carries exactly that.",
      ru: "Предложение отвергает «neutral» и требует слова со значением «уклоняющийся от того, что можно было назвать». «Evasive» именно это и значит.",
    },
  },
  {
    id: "rw2-tsp-01",
    skill: "Craft and Structure",
    topic: "Text Structure and Purpose",
    difficulty: "medium",
    context:
      "The following is adapted from an 1889 short story. A young clerk has just been promoted.\n\nHe walked home the long way, past the shops he had priced things in for two years. The coat in the third window had not moved. He stopped, as he always stopped, and did the arithmetic — and found, with a shock that was not quite pleasure, that the arithmetic was no longer necessary. He could simply go in. He did not go in. He stood a while longer, then walked on, and could not afterwards explain to himself why.",
    stem: "Which choice best describes the function of the last sentence in the text?",
    options: [
      "It shows the character unsettled by a change he had wanted, without resolving the feeling.",
      "It reveals that the character has been dishonest about his promotion.",
      "It establishes that the coat was never actually for sale.",
      "It suggests the character intends to return to the shop the following day.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The shock \"was not quite pleasure\", he does not buy the coat, and he cannot explain why. The sentence leaves the reaction unexplained on purpose.",
      ru: "Потрясение «was not quite pleasure», пальто он не покупает и не может объяснить почему. Последнее предложение намеренно оставляет реакцию без объяснения.",
    },
  },
  {
    id: "rw2-tsp-02",
    skill: "Craft and Structure",
    topic: "Text Structure and Purpose",
    difficulty: "hard",
    context:
      "Conventional accounts treat the printing press as the cause of the rise in literacy that followed it. The sequence is not in doubt, but the causal direction deserves scrutiny. Printing was capital-intensive, and a press could only be sustained where a paying readership already existed. In the German cities where presses multiplied fastest, school records show rising enrolment for two decades before the first press arrived. Printing did not create those readers; it found them, and then made it far cheaper to serve more of them.",
    stem: "Which choice best states the main purpose of the text?",
    options: [
      "To qualify a widely held causal claim without denying the events it describes",
      "To argue that the printing press had no effect on literacy rates",
      "To describe the technical process by which early presses were built",
      "To compare literacy in German cities with literacy elsewhere in Europe",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The text accepts the sequence (\"not in doubt\") but reverses part of the causation, and the final sentence still grants the press a real amplifying role.",
      ru: "Текст принимает последовательность событий («not in doubt»), но переворачивает часть причинности, а в последнем предложении всё же признаёт за печатью усиливающую роль.",
    },
    trap: {
      en: "Option B goes too far: \"made it far cheaper to serve more of them\" is an effect on literacy, just not the one usually claimed.",
      ru: "Вариант B заходит слишком далеко: «made it far cheaper to serve more of them» — это и есть влияние на грамотность, просто не то, о котором обычно говорят.",
    },
  },
  {
    id: "rw2-tsp-03",
    skill: "Craft and Structure",
    topic: "Cross-Text Connections",
    difficulty: "hard",
    context:
      "Text 1: Requiring university applicants to submit a standardised test score is often defended as a fairness measure. Where school grading standards vary widely between regions, a common test is the only instrument that compares candidates on the same scale, and removing it tends to advantage applicants from schools whose reputations already speak for them.\n\nText 2: The fairness argument for standardised testing assumes the test itself is equally accessible. In practice, preparation is a purchased good: applicants who can afford tutoring gain measurable points. The test does compare candidates on one scale, but the scale registers family income alongside ability, and no amount of standardisation separates the two.",
    stem: "Based on the texts, the author of Text 2 would most likely characterise the argument in Text 1 as",
    options: [
      "valid about grade variation but blind to an inequality inside the test itself.",
      "entirely mistaken about the existence of regional grading differences.",
      "correct, since standardisation removes every source of advantage.",
      "irrelevant, because university admission should not be competitive.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Text 2 concedes that the test \"does compare candidates on one scale\" — accepting Text 1's mechanism — then argues the scale also measures income, an inequality Text 1 never addresses.",
      ru: "Text 2 признаёт, что тест «does compare candidates on one scale», принимая механизм из Text 1, а затем утверждает, что шкала измеряет и доход — неравенство, о котором Text 1 не говорит.",
    },
  },
  {
    id: "rw2-cid-01",
    skill: "Information and Ideas",
    topic: "Central Ideas and Details",
    difficulty: "medium",
    context:
      "Saiga antelope populations have collapsed and recovered repeatedly. The 2015 die-off, which killed over 200,000 animals in three weeks, was traced to a bacterium the saiga normally carry harmlessly in their tonsils. What turned a commensal organism lethal appears to have been unusually high humidity combined with warm temperatures during the calving aggregation, when the animals are packed together at their most vulnerable. The bacterium was not new; the weather that made it dangerous was.",
    stem: "Which choice best states the main idea of the text?",
    options: [
      "An ordinarily harmless organism became lethal under specific environmental conditions.",
      "A previously unknown bacterium was introduced into the saiga population in 2015.",
      "Saiga antelope are more vulnerable to disease than other grazing species.",
      "Calving aggregations should be prevented to protect the species.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The last sentence states it outright: the bacterium was not new, the weather that made it dangerous was.",
      ru: "Последнее предложение говорит прямо: бактерия не была новой — новой была погода, сделавшая её опасной.",
    },
    trap: {
      en: "Option B contradicts \"The bacterium was not new\" and \"normally carry harmlessly.\"",
      ru: "Вариант B противоречит фразам «The bacterium was not new» и «normally carry harmlessly».",
    },
  },
  {
    id: "rw2-cid-02",
    skill: "Information and Ideas",
    topic: "Central Ideas and Details",
    difficulty: "hard",
    context:
      "Museums increasingly publish the provenance of contested objects — the chain of ownership from excavation to display. Advocates present this as a step towards restitution. Critics respond that documentation and return are different actions, and that publishing a chain which ends in an acquisition made under occupation can function as a substitute for acting on it: the institution demonstrates candour while the object stays exactly where it is.",
    stem: "According to the text, what concern do critics raise about publishing provenance?",
    options: [
      "Transparency can take the place of the return it appears to promise.",
      "The records published are usually falsified by museums.",
      "Visitors are not interested in the history of ownership.",
      "Provenance research is too expensive for most institutions.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The critics' point is that publishing \"can function as a substitute for acting on it\" — candour is demonstrated while the object does not move.",
      ru: "Критики говорят, что публикация «can function as a substitute for acting on it»: институция демонстрирует откровенность, а предмет остаётся на месте.",
    },
  },
  {
    id: "rw2-coe-01",
    skill: "Information and Ideas",
    topic: "Command of Evidence (Textual)",
    difficulty: "medium",
    context:
      "A linguist argues that the rapid spread of a new slang term through a school is driven not by how many students use it but by how many distinct social groups use it: a word confined to one large clique stalls, while a word adopted by three small ones spreads.",
    stem: "Which finding, if true, would most directly support the linguist's argument?",
    options: [
      "Terms used by four separate friendship groups spread school-wide more often than terms used by a single group twice that size.",
      "Slang terms are typically adopted by students in their second year of secondary school.",
      "Students report learning most new words from social media rather than from classmates.",
      "The average slang term remains in use for about eleven months.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The claim contrasts number of groups against number of users. Option A holds total users roughly constant and varies the number of groups, which is exactly the comparison being made.",
      ru: "Тезис противопоставляет число групп числу пользователей. Вариант A держит общее число примерно постоянным и меняет количество групп — это и есть нужное сравнение.",
    },
  },
  {
    id: "rw2-coe-02",
    skill: "Information and Ideas",
    topic: "Command of Evidence (Quantitative)",
    difficulty: "hard",
    context:
      "A school introduced a fifteen-minute silent reading period at the start of each day and measured reading comprehension at the end of the year.\n\nGroup A (kept the period all year): +11 percentile points\nGroup B (period dropped after October): +3 percentile points\nGroup C (no period, matched intake): +2 percentile points\nGroup D (period all year, but during the final lesson): +10 percentile points",
    stem: "Which choice most effectively uses data from the text to support the conclusion that the duration of the programme mattered more than the time of day at which it ran?",
    options: [
      "Groups A and D, which kept the period all year at different times of day, gained 11 and 10 points, while Group B, which dropped it in October, gained 3.",
      "Group A gained 11 percentile points, which is more than any other group in the study.",
      "Group C, which had no reading period, gained only 2 percentile points over the year.",
      "Groups B and C gained 3 and 2 points respectively, which are very similar figures.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The conclusion compares duration against timing, so the evidence must vary both. A and D differ in time of day but match on outcome; B differs in duration and collapses to near the control.",
      ru: "Вывод сравнивает длительность и время суток, значит, в доказательстве должны меняться оба. A и D различаются временем, но дают почти одинаковый результат; B отличается длительностью и падает почти до контрольной группы.",
    },
    trap: {
      en: "Option B cites the largest gain but says nothing about timing, so it cannot support a claim comparing the two factors.",
      ru: "Вариант B приводит наибольший прирост, но ничего не говорит о времени суток, поэтому не может подтверждать сравнение двух факторов.",
    },
  },
  {
    id: "rw2-coe-03",
    skill: "Information and Ideas",
    topic: "Inferences",
    difficulty: "medium",
    context:
      "Concrete gains most of its strength in the first month after pouring, but continues to harden for years as unreacted cement grains slowly hydrate. Cores taken from structures built in the 1930s often test stronger than the specifications those structures were designed to. Engineers assessing an old building's capacity therefore cannot rely on the design figure alone; the material may have _____",
    stem: "Which choice most logically completes the text?",
    options: [
      "exceeded the strength it was originally required to reach.",
      "lost all of the strength recorded at the time of construction.",
      "been replaced at some point without documentation.",
      "reacted with the surrounding soil in unpredictable ways.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Continued hardening plus cores testing above specification leads directly to the conclusion that the material may now be stronger than the design figure.",
      ru: "Продолжающееся твердение плюс керны, показывающие выше проектных значений, ведут прямо к выводу: материал может быть прочнее проектной цифры.",
    },
  },
  {
    id: "rw2-coe-04",
    skill: "Information and Ideas",
    topic: "Inferences",
    difficulty: "hard",
    context:
      "A common test of animal self-recognition places a mark on an animal where it can be seen only in a mirror. Species that touch the mark on their own body are counted as recognising themselves. The test assumes the animal is motivated to investigate an unexpected mark, and that vision is its primary means of doing so. For a species that navigates chiefly by scent and grooms by touch, a negative result therefore _____",
    stem: "Which choice most logically completes the text?",
    options: [
      "may reflect the design of the test rather than the absence of self-recognition.",
      "confirms that the species lacks any form of self-awareness.",
      "shows that the animal cannot perceive the mirror at all.",
      "indicates that the mark was placed in the wrong position.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The passage names two assumptions the test rests on, then describes a species that violates both. A failure under those conditions is uninformative about the underlying ability.",
      ru: "Текст называет два допущения, на которых держится тест, а затем описывает вид, который обоим не отвечает. Провал в таких условиях ничего не говорит о самой способности.",
    },
    trap: {
      en: "Option B is the conclusion the passage is warning against — it treats a failed test as a settled finding.",
      ru: "Вариант B — тот самый вывод, от которого текст предостерегает: провал теста принимается за установленный факт.",
    },
  },
  {
    id: "rw2-cid-03",
    skill: "Information and Ideas",
    topic: "Central Ideas and Details",
    difficulty: "easy",
    context:
      "The Turkic runic inscriptions of the Orkhon valley, carved in the eighth century, are the earliest known written records of a Turkic language. They are unusual among monumental inscriptions in that long passages are written in the first person and address the reader directly, including admissions of political miscalculation that a commemorative text would ordinarily omit.",
    stem: "Which choice best states the main idea of the text?",
    options: [
      "An early set of inscriptions is notable both for its date and for its unusually personal voice.",
      "The Orkhon inscriptions were carved by several different authors over many centuries.",
      "Monumental inscriptions from this period are rarely readable today.",
      "Turkic languages were not written down until the modern era.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The text gives two claims: earliest known Turkic records, and unusual first-person voice including admissions of error. Option A captures both.",
      ru: "В тексте два утверждения: древнейшие известные записи на тюркском и необычный голос от первого лица с признанием ошибок. Вариант A охватывает оба.",
    },
  },
  {
    id: "rw2-tsp-04",
    skill: "Craft and Structure",
    topic: "Text Structure and Purpose",
    difficulty: "medium",
    context:
      "Researchers wanting to know how far a bird travels have traditionally attached a tag and waited for it to be found again — a method that yields one data point per recovered bird and nothing at all for the rest. Lightweight geolocators changed the arithmetic. Weighing under a gram, they log ambient light, from which position can be reconstructed to within about 150 kilometres. The precision is poor by satellite standards. For a species whose route across a continent was previously unknown, it is transformative.",
    stem: "Which choice best describes the function of the last sentence?",
    options: [
      "It reframes a stated limitation as unimportant for the question being asked.",
      "It introduces a new technology that supersedes geolocators.",
      "It concedes that the method has failed for most species.",
      "It explains how satellite tracking systems calculate position.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The previous sentence admits the precision is poor; the final one says that for a previously unknown route it is transformative. The limitation is placed against the purpose.",
      ru: "Предыдущее предложение признаёт слабую точность, а последнее говорит, что для ранее неизвестного маршрута она меняет всё. Ограничение соотнесено с задачей.",
    },
  },
];
