import type { ExamItem, Passage } from "../types";

/**
 * IELTS Academic Reading, Test 1 — passages 1 and 2.
 *
 * Unlike the SAT, IELTS really is the long-passage format: three texts of 700–950
 * words carrying forty questions between them, under a single 60-minute clock with
 * no extra transfer time. The question types below are the published set — True /
 * False / Not Given, sentence and summary completion, matching headings, matching
 * information and multiple choice — because a student who has only ever done
 * multiple choice will lose marks to the format itself, not to their English.
 */

export const READING_1_PASSAGES: Passage[] = [
  {
    id: "r1-aral",
    title: "The sea that came back",
    genre: "Environmental science",
    wordCount: 690,
    paragraphs: [
      "For most of the twentieth century the Aral Sea was one of the four largest lakes on Earth. By 2005 it had lost roughly nine-tenths of its volume. The cause was not drought but arithmetic: the two rivers that fed it, the Syr Darya and the Amu Darya, were diverted through unlined canals to irrigate cotton across Central Asia, and a great deal of that water evaporated or seeped away before reaching a field. What arrived at the sea was a fraction of what had once flowed there.",
      "The consequences were not confined to the shoreline. As the water withdrew it left behind a salt plain laced with the residues of decades of agricultural chemistry. Winds lifted this dust and carried it hundreds of kilometres, depositing it on pasture and settlement alike. Rates of respiratory illness in the surrounding districts rose sharply, and the fishing towns that had once employed thousands found themselves stranded dozens of kilometres from any water at all.",
      "In 2005 Kazakhstan completed the Kokaral Dam, a thirteen-kilometre earth embankment across the channel connecting the northern part of the sea to the larger southern basin. The engineering was unglamorous and the reasoning was blunt: the northern basin still received the Syr Darya, and if that inflow could be prevented from draining south into a basin that was beyond saving, the north might stabilise. Sealing off the south was, in effect, a decision about which half to rescue.",
      "The results arrived faster than the project's own forecasts. Water levels in the North Aral rose by around four metres within three years, well ahead of the ten years engineers had allowed. Salinity fell from roughly three times that of ocean water to a level at which freshwater species could survive. Commercial fishing resumed. The town of Aralsk, which had been some seventy kilometres from the water at the low point, found the shoreline advancing back towards it.",
      "It would be easy to read this as a straightforward restoration, and much reporting has done so. The picture is more particular than that. The recovery applies to the northern basin alone, which held only a small share of the original sea. The much larger southern basin, fed by the Amu Darya, has continued to shrink, and parts of it are now considered beyond any realistic intervention. A photograph of fishing boats returning to Aralsk is accurate; a caption describing the Aral Sea as recovering is not.",
      "The episode has become a reference point in discussions of environmental repair, though not always for the reason people expect. Its most transferable lesson is not about dams. It is that the recovery worked because the underlying flow was restored — the Syr Darya was still delivering water, and the dam simply stopped that water from being lost. Where the inflow itself has gone, as in the south, no structure can substitute for it.",
      "There is a second lesson, less often drawn. The Kokaral project cost in the region of eighty-six million dollars, a modest figure by the standards of large infrastructure, and it was completed by a single national government without an international agreement. Much of the delay in addressing the Aral before 2005 had been attributed to the difficulty of coordinating five states with competing claims on the same two rivers. That framing was not wrong, but it had obscured a narrower question: what could one state accomplish within its own borders? The answer turned out to be a good deal.",
      "Whether the northern recovery can be extended remains open. Proposals to raise the dam and push the shoreline closer to Aralsk have been discussed for over a decade, and each depends on the same variable that determined everything before it — how much water the Syr Darya is permitted to carry, and how much of it is taken upstream before it arrives.",
    ],
  },
  {
    id: "r1-noise",
    title: "How cities learned to listen",
    genre: "Urban studies",
    lettered: true,
    wordCount: 810,
    paragraphs: [
      "For most of the history of urban planning, noise was treated as a nuisance rather than a hazard — something to be complained about rather than measured. Regulations, where they existed at all, tended to specify hours rather than levels: construction could not begin before seven, music had to stop by eleven. What was actually reaching people's ears went unrecorded.",
      "That began to change in the 1970s, when epidemiologists studying populations near airports found a pattern that could not be explained by self-reported annoyance. Residents under flight paths showed elevated blood pressure whether or not they said the noise bothered them, and the effect persisted in people who insisted they had grown used to it. Habituation, it turned out, operated on the conscious complaint but not on the physiological response.",
      "The mechanism proposed was a stress pathway that does not require awareness. A sudden sound triggers a release of cortisol and adrenaline regardless of whether the sleeper wakes. Over years, the repeated activation contributes to cardiovascular strain. On this account the most damaging noise is not the loudest but the least predictable: a steady hum is partly filtered out, while intermittent noise keeps re-triggering the response.",
      "This finding had an awkward implication for policy. Almost every regulatory instrument in use measured average sound levels over a period, typically a day or a night. An average is precisely the wrong statistic for a hazard driven by variability: a night of near-silence broken by four freight trains can produce the same average as a night of continuous moderate traffic, while doing considerably more harm.",
      "Some jurisdictions have moved to event-based measures, counting the number of times a threshold is crossed rather than averaging across the night. The World Health Organization's 2018 guidelines pushed in this direction, recommending limits on both average and peak exposure. Implementation has been uneven. Averages are cheap to monitor and easy to defend in court; event counts require better instrumentation and generate figures that developers dispute.",
      "Meanwhile a separate line of research has complicated the assumption that quieter is simply better. Studies of urban parks have found that perceived restfulness correlates less with absolute sound level than with the composition of the sound. A park at 55 decibels dominated by birdsong and water is reported as more restorative than a park at 48 decibels dominated by distant traffic. What matters is not only how much sound arrives but what kind.",
      "This has produced a design vocabulary that would have been unintelligible to a mid-century planner. Rather than building higher barriers, some cities now introduce sound: water features positioned to mask road noise at the frequencies the ear finds most intrusive, planting chosen partly for how it behaves in wind. The aim is not silence, which in a city is neither achievable nor, on the evidence, particularly desirable.",
      "The remaining obstacle is institutional rather than technical. Noise sits between departments — transport builds the roads, planning approves the buildings, health records the consequences — and in most administrations no single office owns the outcome. Cities that have made measurable progress tend to be those that created a specific mandate for it, which is a mundane finding, and probably the most useful one available.",
    ],
  },
];

export const READING_1_ITEMS: ExamItem[] = [
  /* ---------------- Passage 1: True / False / Not Given ---------------- */
  {
    id: "ir1-01",
    skill: "True / False / Not Given",
    topic: "Reading for factual detail",
    difficulty: "medium",
    passage: "r1-aral",
    instruction: "Questions 1–7. Do the following statements agree with the information given in the passage? Choose TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information on this.",
    stem: "The shrinking of the Aral Sea was primarily caused by a reduction in rainfall.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Paragraph 1 states directly: \"The cause was not drought but arithmetic\", and goes on to describe river diversion for irrigation. The statement contradicts the passage, so it is FALSE.",
      ru: "В первом абзаце прямо сказано: «The cause was not drought but arithmetic», далее — про отвод рек на орошение. Утверждение противоречит тексту, значит, FALSE.",
    },
    trap: {
      en: "NOT GIVEN is only for information absent from the text. Here the text addresses the point explicitly and denies it — that is FALSE.",
      ru: "NOT GIVEN — только для того, чего в тексте нет. Здесь текст прямо касается вопроса и отрицает его, значит, FALSE.",
    },
  },
  {
    id: "ir1-02",
    skill: "True / False / Not Given",
    topic: "Reading for factual detail",
    difficulty: "medium",
    passage: "r1-aral",
    stem: "Dust from the exposed seabed travelled well beyond the immediate area.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph 2: winds \"carried it hundreds of kilometres, depositing it on pasture and settlement alike.\" That matches the statement.",
      ru: "Второй абзац: ветра «carried it hundreds of kilometres, depositing it on pasture and settlement alike». Совпадает с утверждением.",
    },
  },
  {
    id: "ir1-03",
    skill: "True / False / Not Given",
    topic: "Reading for factual detail",
    difficulty: "hard",
    passage: "r1-aral",
    stem: "The Kokaral Dam was completed ahead of its original construction schedule.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "The passage says the water levels rose faster than forecast, not that the dam was built faster than planned. Nothing is said about the construction schedule, so NOT GIVEN.",
      ru: "В тексте сказано, что уровень воды поднялся быстрее прогноза, а не что дамбу построили быстрее плана. О сроках строительства нет ни слова — NOT GIVEN.",
    },
    trap: {
      en: "Paragraph 4 does contain \"faster than the project's own forecasts\", but that refers to the water recovery. Matching a phrase is not the same as matching a claim.",
      ru: "В четвёртом абзаце действительно есть «faster than the project's own forecasts», но это про восстановление воды. Совпадение фразы — не совпадение смысла.",
    },
  },
  {
    id: "ir1-04",
    skill: "True / False / Not Given",
    topic: "Reading for factual detail",
    difficulty: "medium",
    passage: "r1-aral",
    stem: "Salinity in the North Aral fell to a level that allowed freshwater fish to live there.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph 4: salinity fell \"to a level at which freshwater species could survive.\" Direct match.",
      ru: "Четвёртый абзац: солёность упала «to a level at which freshwater species could survive». Прямое совпадение.",
    },
  },
  {
    id: "ir1-05",
    skill: "True / False / Not Given",
    topic: "Reading for factual detail",
    difficulty: "hard",
    passage: "r1-aral",
    stem: "The southern basin of the Aral Sea has also begun to recover since 2005.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Paragraph 5 says the southern basin \"has continued to shrink, and parts of it are now considered beyond any realistic intervention.\" That contradicts recovery.",
      ru: "Пятый абзац: южная часть «has continued to shrink, and parts of it are now considered beyond any realistic intervention». Это противоречит восстановлению.",
    },
  },
  {
    id: "ir1-06",
    skill: "True / False / Not Given",
    topic: "Reading for factual detail",
    difficulty: "hard",
    passage: "r1-aral",
    stem: "The Kokaral project required a formal agreement between the five states of the region.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Paragraph 7 states it \"was completed by a single national government without an international agreement.\" The statement contradicts this.",
      ru: "Седьмой абзац: проект «was completed by a single national government without an international agreement». Утверждение этому противоречит.",
    },
  },
  {
    id: "ir1-07",
    skill: "True / False / Not Given",
    topic: "Reading for factual detail",
    difficulty: "medium",
    passage: "r1-aral",
    stem: "Plans to raise the height of the dam have been under discussion for more than ten years.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The final paragraph: proposals to raise the dam \"have been discussed for over a decade.\" A decade is ten years, so this is TRUE.",
      ru: "Последний абзац: предложения поднять дамбу «have been discussed for over a decade». Decade — это десять лет, значит, TRUE.",
    },
  },

  /* ---------------- Passage 1: sentence completion ---------------- */
  {
    id: "ir1-08",
    skill: "Sentence completion",
    topic: "Locating precise wording",
    difficulty: "medium",
    passage: "r1-aral",
    instruction: "Questions 8–13. Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
    stem: "Water was carried away from the rivers through canals that were not lined, so much of it was lost to seepage and _____ before reaching any crops.",
    answer: { kind: "text", accept: ["evaporation", "evaporated"], maxWords: 2 },
    explain: {
      en: "Paragraph 1: \"a great deal of that water evaporated or seeped away.\" The sentence already uses \"seepage\", so the missing partner is evaporation.",
      ru: "Первый абзац: «a great deal of that water evaporated or seeped away». В предложении уже есть «seepage», значит, недостающая пара — evaporation.",
    },
  },
  {
    id: "ir1-09",
    skill: "Sentence completion",
    topic: "Locating precise wording",
    difficulty: "medium",
    passage: "r1-aral",
    stem: "The dam built in 2005 stretches for _____ kilometres across the channel between the two basins.",
    answer: { kind: "text", accept: ["thirteen", "13"], maxWords: 1 },
    explain: {
      en: "Paragraph 3 describes \"a thirteen-kilometre earth embankment.\"",
      ru: "Третий абзац описывает «a thirteen-kilometre earth embankment».",
    },
  },
  {
    id: "ir1-10",
    skill: "Sentence completion",
    topic: "Locating precise wording",
    difficulty: "hard",
    passage: "r1-aral",
    stem: "Within three years of the dam's completion, the level of the North Aral had risen by approximately _____ metres.",
    answer: { kind: "text", accept: ["four", "4"], maxWords: 1 },
    explain: {
      en: "Paragraph 4: \"Water levels in the North Aral rose by around four metres within three years.\"",
      ru: "Четвёртый абзац: «Water levels in the North Aral rose by around four metres within three years».",
    },
  },
  {
    id: "ir1-11",
    skill: "Sentence completion",
    topic: "Locating precise wording",
    difficulty: "medium",
    passage: "r1-aral",
    stem: "At its lowest point, the water had retreated about seventy kilometres from the town of _____.",
    answer: { kind: "text", accept: ["Aralsk"], maxWords: 1 },
    explain: {
      en: "Paragraph 4: \"The town of Aralsk, which had been some seventy kilometres from the water at the low point.\"",
      ru: "Четвёртый абзац: «The town of Aralsk, which had been some seventy kilometres from the water at the low point».",
    },
  },
  {
    id: "ir1-12",
    skill: "Sentence completion",
    topic: "Locating precise wording",
    difficulty: "hard",
    passage: "r1-aral",
    stem: "According to the writer, the recovery succeeded because the original _____ had been maintained by the Syr Darya.",
    answer: { kind: "text", accept: ["flow", "inflow", "underlying flow"], maxWords: 2 },
    explain: {
      en: "Paragraph 6: \"the recovery worked because the underlying flow was restored — the Syr Darya was still delivering water.\"",
      ru: "Шестой абзац: «the recovery worked because the underlying flow was restored — the Syr Darya was still delivering water».",
    },
  },
  {
    id: "ir1-13",
    skill: "Sentence completion",
    topic: "Locating precise wording",
    difficulty: "medium",
    passage: "r1-aral",
    stem: "The writer describes the cost of the project, around eighty-six million dollars, as _____ for infrastructure of this scale.",
    answer: { kind: "text", accept: ["modest", "a modest figure"], maxWords: 2 },
    explain: {
      en: "Paragraph 7: \"a modest figure by the standards of large infrastructure.\"",
      ru: "Седьмой абзац: «a modest figure by the standards of large infrastructure».",
    },
  },

  /* ---------------- Passage 2: matching headings ---------------- */
  {
    id: "ir1-14",
    skill: "Matching headings",
    topic: "Paragraph main idea",
    difficulty: "hard",
    passage: "r1-noise",
    instruction: "Questions 14–19. The passage has eight paragraphs, A–H. Choose the correct heading for each of the following paragraphs.",
    stem: "Paragraph B",
    options: [
      "Evidence that harm occurs without the person noticing",
      "The financial cost of monitoring equipment",
      "Why silence became the goal of urban design",
      "A history of noise complaints in law",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph B reports raised blood pressure in residents \"whether or not they said the noise bothered them\", and that the effect persisted in those who had grown used to it — harm without awareness.",
      ru: "Абзац B сообщает о повышенном давлении у жителей «whether or not they said the noise bothered them» и о сохранении эффекта у привыкших — вред без осознания.",
    },
  },
  {
    id: "ir1-15",
    skill: "Matching headings",
    topic: "Paragraph main idea",
    difficulty: "medium",
    passage: "r1-noise",
    stem: "Paragraph C",
    options: [
      "How the body responds to unpredictable sound",
      "The invention of the decibel scale",
      "Why airports were built away from cities",
      "The role of sleep in memory formation",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph C sets out the cortisol and adrenaline pathway and concludes that intermittent, unpredictable noise is the most damaging.",
      ru: "Абзац C излагает механизм с кортизолом и адреналином и заключает, что самый вредный шум — прерывистый и непредсказуемый.",
    },
  },
  {
    id: "ir1-16",
    skill: "Matching headings",
    topic: "Paragraph main idea",
    difficulty: "hard",
    passage: "r1-noise",
    stem: "Paragraph D",
    options: [
      "A mismatch between the hazard and the way it is measured",
      "New instruments that measure sound more cheaply",
      "Why residents rarely report noise problems",
      "The success of night-time construction limits",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph D argues that averaging is \"precisely the wrong statistic for a hazard driven by variability\", and illustrates it with the freight-train example.",
      ru: "Абзац D утверждает, что усреднение — «precisely the wrong statistic for a hazard driven by variability», и иллюстрирует это примером с товарными поездами.",
    },
  },
  {
    id: "ir1-17",
    skill: "Matching headings",
    topic: "Paragraph main idea",
    difficulty: "medium",
    passage: "r1-noise",
    stem: "Paragraph E",
    options: [
      "Slow and uneven adoption of a better standard",
      "The complete replacement of average-based rules",
      "Legal victories won by residents' groups",
      "Why the WHO withdrew its recommendations",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph E notes that some places moved to event-based measures and the WHO recommended it, but \"Implementation has been uneven\" because averages are cheaper and easier to defend.",
      ru: "Абзац E отмечает, что кое-где перешли к подсчёту событий и ВОЗ это рекомендовала, но «Implementation has been uneven» — усреднения дешевле и проще защищать.",
    },
    trap: {
      en: "Option B overstates. The paragraph explicitly says averages are still in use because they are cheap to monitor.",
      ru: "Вариант B преувеличивает: абзац прямо говорит, что усреднения по-прежнему в ходу, потому что дёшевы в измерении.",
    },
  },
  {
    id: "ir1-18",
    skill: "Matching headings",
    topic: "Paragraph main idea",
    difficulty: "hard",
    passage: "r1-noise",
    stem: "Paragraph F",
    options: [
      "Sound quality matters more than sound quantity",
      "Parks are quieter than surrounding streets",
      "Birdsong has been shown to lower blood pressure",
      "Why cities have reduced their green space",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph F contrasts a 55-decibel park with birdsong against a quieter 48-decibel park with traffic, concluding that composition matters, not only level.",
      ru: "Абзац F противопоставляет парк в 55 дБ с птичьим пением более тихому парку в 48 дБ с трафиком и заключает, что важен состав звука, а не только уровень.",
    },
  },
  {
    id: "ir1-19",
    skill: "Matching headings",
    topic: "Paragraph main idea",
    difficulty: "medium",
    passage: "r1-noise",
    stem: "Paragraph H",
    options: [
      "The problem is one of divided responsibility",
      "New technology has solved the measurement problem",
      "Health departments now build roads",
      "Cities have abandoned noise policy entirely",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The final paragraph says the obstacle is \"institutional rather than technical\" and that no single office owns the outcome.",
      ru: "Последний абзац говорит, что препятствие «institutional rather than technical» и что ни одно ведомство не отвечает за результат.",
    },
  },

  /* ---------------- Passage 2: summary completion ---------------- */
  {
    id: "ir1-20",
    skill: "Summary completion",
    topic: "Synthesising across paragraphs",
    difficulty: "hard",
    passage: "r1-noise",
    instruction: "Questions 20–23. Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
    stem: "Early noise regulations controlled the _____ at which certain activities could take place, rather than measuring how loud they were.",
    answer: { kind: "text", accept: ["hours", "time", "times"], maxWords: 2 },
    explain: {
      en: "Paragraph A: regulations \"tended to specify hours rather than levels.\"",
      ru: "Абзац A: правила «tended to specify hours rather than levels».",
    },
  },
  {
    id: "ir1-21",
    skill: "Summary completion",
    topic: "Synthesising across paragraphs",
    difficulty: "medium",
    passage: "r1-noise",
    stem: "Research suggested that the body reacts to noise through a stress response that does not depend on _____.",
    answer: { kind: "text", accept: ["awareness", "consciousness"], maxWords: 2 },
    explain: {
      en: "Paragraph C: \"a stress pathway that does not require awareness.\"",
      ru: "Абзац C: «a stress pathway that does not require awareness».",
    },
  },
  {
    id: "ir1-22",
    skill: "Summary completion",
    topic: "Synthesising across paragraphs",
    difficulty: "hard",
    passage: "r1-noise",
    stem: "Because harm is driven by variation, some authorities now count how often a _____ is exceeded instead of averaging levels.",
    answer: { kind: "text", accept: ["threshold", "limit"], maxWords: 2 },
    explain: {
      en: "Paragraph E: \"counting the number of times a threshold is crossed rather than averaging across the night.\"",
      ru: "Абзац E: «counting the number of times a threshold is crossed rather than averaging across the night».",
    },
  },
  {
    id: "ir1-23",
    skill: "Summary completion",
    topic: "Synthesising across paragraphs",
    difficulty: "medium",
    passage: "r1-noise",
    stem: "Rather than building barriers, designers may now add water features to _____ traffic noise at the most intrusive frequencies.",
    answer: { kind: "text", accept: ["mask", "masking"], maxWords: 1 },
    explain: {
      en: "Paragraph G: \"water features positioned to mask road noise at the frequencies the ear finds most intrusive.\"",
      ru: "Абзац G: «water features positioned to mask road noise at the frequencies the ear finds most intrusive».",
    },
  },

  /* ---------------- Passage 2: multiple choice ---------------- */
  {
    id: "ir1-24",
    skill: "Multiple choice",
    topic: "Writer's argument",
    difficulty: "hard",
    passage: "r1-noise",
    stem: "What point does the writer make about habituation to noise?",
    options: [
      "It reduces the complaint but not the physical effect.",
      "It occurs only in people living near airports.",
      "It eliminates the health risk within a few years.",
      "It has never been demonstrated experimentally.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph B ends: \"Habituation... operated on the conscious complaint but not on the physiological response.\"",
      ru: "Абзац B заканчивается: «Habituation… operated on the conscious complaint but not on the physiological response».",
    },
  },
  {
    id: "ir1-25",
    skill: "Multiple choice",
    topic: "Writer's argument",
    difficulty: "medium",
    passage: "r1-noise",
    stem: "Why does the writer mention a night broken by four freight trains?",
    options: [
      "To show that an average can conceal a more harmful pattern",
      "To argue that rail transport should be moved underground",
      "To illustrate how quiet most cities are at night",
      "To explain why freight is restricted to night hours",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The example appears in paragraph D to demonstrate that two nights with identical averages can differ greatly in harm.",
      ru: "Пример стоит в абзаце D, чтобы показать: две ночи с одинаковым средним могут сильно различаться по вреду.",
    },
  },
  {
    id: "ir1-26",
    skill: "Multiple choice",
    topic: "Writer's argument",
    difficulty: "hard",
    passage: "r1-noise",
    stem: "What is the writer's attitude to the finding about institutional responsibility in the final paragraph?",
    options: [
      "They consider it unremarkable but highly practical.",
      "They regard it as the least important of their conclusions.",
      "They think it applies only to very large cities.",
      "They believe it contradicts the earlier medical evidence.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The passage closes by calling it \"a mundane finding, and probably the most useful one available\" — unremarkable, yet the most practical.",
      ru: "Текст заканчивается словами «a mundane finding, and probably the most useful one available» — обыденный вывод, но самый полезный.",
    },
    trap: {
      en: "\"Mundane\" tempts you toward option B, but the same sentence calls it the most useful. Read the whole clause before choosing.",
      ru: "«Mundane» подталкивает к варианту B, но то же предложение называет его самым полезным. Дочитай всю фразу до конца.",
    },
  },
  {
    id: "ir1-27",
    skill: "Multiple choice",
    topic: "Writer's argument",
    difficulty: "medium",
    passage: "r1-noise",
    stem: "According to the passage, what is the aim of the newer approaches to urban sound design?",
    options: [
      "To shape what people hear rather than to remove sound",
      "To achieve complete silence in residential districts",
      "To replace all parks with enclosed indoor spaces",
      "To lower average decibel readings below 48",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph G: designers \"introduce sound\" to mask noise, and \"The aim is not silence, which in a city is neither achievable nor... particularly desirable.\"",
      ru: "Абзац G: проектировщики «introduce sound», чтобы маскировать шум, и «The aim is not silence, which in a city is neither achievable nor… particularly desirable».",
    },
  },
];
