import type { ExamItem, Passage } from "../types";

/**
 * IELTS Academic Reading, Test 1 — passage 3.
 *
 * The third passage is the hardest by design: the argument is the writer's own
 * rather than a summary of findings, which is why the question types shift to Yes /
 * No / Not Given (about claims, not facts) and matching information (about where an
 * idea sits, not what it says).
 */

export const READING_2_PASSAGES: Passage[] = [
  {
    id: "r2-ice",
    title: "Reading the ice",
    genre: "History of science",
    lettered: true,
    wordCount: 900,
    paragraphs: [
      "An ice core is often described as an archive, and the metaphor is useful up to a point. Snow falling on a polar plateau is buried by later snow, compressed, and eventually sealed into ice that traps small bubbles of the atmosphere present when the pores closed. Drill down, and the bubbles get older. In principle one is reading a continuous record of the air, layer by layer, back through hundreds of thousands of years.",
      "In practice the archive is not a set of documents but a set of proxies, and every proxy has to be argued for. The concentration of carbon dioxide in a bubble is a direct measurement and requires little interpretation. Temperature is different: there is no thermometer in the ice. What is measured is the ratio of oxygen and hydrogen isotopes in the water molecules, which varies with the temperature at which the original snow condensed. Converting that ratio to degrees requires a calibration, and the calibration relies on assumptions about how the atmosphere circulated at the time — the very thing one is trying to reconstruct.",
      "This circularity is well known within the field and has been handled with considerable care, mostly by validating isotope thermometry against independent evidence: borehole temperature profiles, the physics of gas diffusion in the layers that have not yet sealed, and comparisons with marine sediment records. The result is not a single number but a range, and the published ranges have generally widened rather than narrowed as the methods have improved. That is what a maturing measurement looks like, though it is rarely how it is reported outside the literature.",
      "A second complication concerns time itself. The bubbles are always younger than the ice enclosing them, because pores stay open to the atmosphere for decades or centuries after the surrounding snow has become firn. The size of this offset depends on how fast snow accumulated, which varies with climate. At high-accumulation sites the gap may be a few decades; at the driest East Antarctic sites it can exceed six thousand years. Any statement about whether a change in temperature preceded or followed a change in carbon dioxide depends entirely on getting this correction right.",
      "That dependency became publicly consequential in the 2000s, when the sequence of events at the end of the last glacial period was widely discussed. Early analyses appeared to show carbon dioxide rising several hundred years after Antarctic warming began. The finding was seized on as evidence that carbon dioxide could not be driving temperature. Within the field the interpretation was different: an internal feedback that lags its trigger is still a feedback, and the lag was in any case within the uncertainty of the gas-age correction at those sites. Subsequent work using improved corrections found the two effectively simultaneous within the error.",
      "It would be comfortable to conclude that the misreading was simply a matter of public misunderstanding. That is too easy. The early papers were not always explicit about how large the age uncertainty was, and figures were published in which the ice-age and gas-age scales were plotted together without the offset being visually apparent. A reader outside the specialism had little way of knowing which features of the graph were robust and which were artefacts of the alignment. Responsibility for a misreading is rarely wholly on the reader.",
      "The deeper issue is that a proxy record carries its own history of interpretation, and that history is not visible in the data file. A published temperature series has already had decisions applied to it — which calibration, which correction, which sites to composite — and each decision was reasonable when made. Later users, especially those in other disciplines, tend to receive the series as a measurement rather than as a conclusion. The distinction matters most precisely when the record is being used to test a hypothesis it was never assembled to address.",
      "None of this undermines the central findings. That carbon dioxide concentrations for the last eight hundred thousand years stayed within a band that industrial emissions have now left far behind is about as secure as any result in the earth sciences: it rests on direct measurement of trapped gas, replicated across cores on two continents. The uncertainty lives in the finer questions — the exact size of a lag, the amplitude of a regional temperature swing — and it is these that are most often quoted as though they were settled.",
      "The practical lesson for anyone using such data is to treat the error bars as the result rather than as decoration around it. A range is not a hedge. It is the actual output of the measurement, and a figure quoted without it has been rounded to a precision the method does not possess.",
    ],
  },
];

export const READING_2_ITEMS: ExamItem[] = [
  /* ---------------- matching information ---------------- */
  {
    id: "ir2-28",
    skill: "Matching information",
    topic: "Locating an idea",
    difficulty: "hard",
    passage: "r2-ice",
    instruction: "Questions 28–32. The passage has nine paragraphs, A–I. Which paragraph contains the following information?",
    stem: "A reference to a finding that is described as highly reliable",
    options: ["Paragraph C", "Paragraph F", "Paragraph H", "Paragraph I"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "Paragraph H calls the eight-hundred-thousand-year carbon dioxide result \"about as secure as any result in the earth sciences\", noting it is replicated across two continents.",
      ru: "Абзац H называет результат по CO₂ за восемьсот тысяч лет «about as secure as any result in the earth sciences» и отмечает воспроизводимость на двух континентах.",
    },
  },
  {
    id: "ir2-29",
    skill: "Matching information",
    topic: "Locating an idea",
    difficulty: "hard",
    passage: "r2-ice",
    stem: "An acknowledgement that scientists contributed to a public misunderstanding",
    options: ["Paragraph D", "Paragraph E", "Paragraph F", "Paragraph G"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "Paragraph F rejects blaming the public: early papers \"were not always explicit\" about uncertainty, and \"Responsibility for a misreading is rarely wholly on the reader.\"",
      ru: "Абзац F отвергает обвинение публики: ранние статьи «were not always explicit» о неопределённости, и «Responsibility for a misreading is rarely wholly on the reader».",
    },
    trap: {
      en: "Paragraph E describes the misreading itself. The paragraph that assigns responsibility for it is the next one.",
      ru: "Абзац E описывает само неверное прочтение. Ответственность за него распределяет следующий абзац.",
    },
  },
  {
    id: "ir2-30",
    skill: "Matching information",
    topic: "Locating an idea",
    difficulty: "medium",
    passage: "r2-ice",
    stem: "An explanation of why gas trapped in ice is not the same age as the ice around it",
    options: ["Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "Paragraph D explains that pores stay open for decades or centuries after the surrounding snow becomes firn, and gives the range of the offset.",
      ru: "Абзац D объясняет, что поры остаются открытыми десятилетиями или веками после превращения снега в фирн, и приводит диапазон сдвига.",
    },
  },
  {
    id: "ir2-31",
    skill: "Matching information",
    topic: "Locating an idea",
    difficulty: "hard",
    passage: "r2-ice",
    stem: "A description of measurements becoming less precise as the field improved",
    options: ["Paragraph B", "Paragraph C", "Paragraph G", "Paragraph I"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Paragraph C: \"the published ranges have generally widened rather than narrowed as the methods have improved. That is what a maturing measurement looks like.\"",
      ru: "Абзац C: «the published ranges have generally widened rather than narrowed as the methods have improved. That is what a maturing measurement looks like».",
    },
  },
  {
    id: "ir2-32",
    skill: "Matching information",
    topic: "Locating an idea",
    difficulty: "medium",
    passage: "r2-ice",
    stem: "A warning about how data should be quoted by others",
    options: ["Paragraph F", "Paragraph G", "Paragraph H", "Paragraph I"],
    answer: { kind: "choice", correct: 3 },
    explain: {
      en: "The final paragraph: \"treat the error bars as the result rather than as decoration\", and a figure quoted without them \"has been rounded to a precision the method does not possess.\"",
      ru: "Последний абзац: «treat the error bars as the result rather than as decoration», а цифра без них «has been rounded to a precision the method does not possess».",
    },
  },

  /* ---------------- Yes / No / Not Given ---------------- */
  {
    id: "ir2-33",
    skill: "Yes / No / Not Given",
    topic: "Writer's claims",
    difficulty: "hard",
    passage: "r2-ice",
    instruction: "Questions 33–37. Do the following statements agree with the claims of the writer? Choose YES if the statement agrees with the writer's claims, NO if it contradicts them, or NOT GIVEN if it is impossible to say what the writer thinks.",
    stem: "Measuring carbon dioxide in an ice core requires more interpretation than measuring temperature does.",
    options: ["YES", "NO", "NOT GIVEN"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Paragraph B says the opposite: carbon dioxide \"is a direct measurement and requires little interpretation\", while temperature has no thermometer and needs calibration.",
      ru: "Абзац B говорит обратное: CO₂ — «a direct measurement and requires little interpretation», а для температуры термометра нет и нужна калибровка.",
    },
  },
  {
    id: "ir2-34",
    skill: "Yes / No / Not Given",
    topic: "Writer's claims",
    difficulty: "hard",
    passage: "r2-ice",
    stem: "The writer believes the apparent lag between warming and carbon dioxide disproved the link between them.",
    options: ["YES", "NO", "NOT GIVEN"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Paragraph E reports that the lag \"was seized on as evidence\" against the link, then gives the writer's own view: a feedback that lags its trigger is still a feedback, and later work found the two simultaneous within error.",
      ru: "Абзац E сообщает, что задержку «was seized on as evidence» против связи, а затем даёт позицию автора: обратная связь с запаздыванием — всё равно обратная связь, и поздние работы нашли их одновременными в пределах погрешности.",
    },
    trap: {
      en: "The passage states the claim in order to reject it. Yes/No/Not Given asks what the *writer* thinks, not what the passage mentions.",
      ru: "Текст приводит это утверждение, чтобы его опровергнуть. Yes/No/Not Given спрашивает, что думает автор, а не что упомянуто в тексте.",
    },
  },
  {
    id: "ir2-35",
    skill: "Yes / No / Not Given",
    topic: "Writer's claims",
    difficulty: "hard",
    passage: "r2-ice",
    stem: "Researchers in other disciplines often treat a published temperature series as if no decisions had shaped it.",
    options: ["YES", "NO", "NOT GIVEN"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph G: \"Later users, especially those in other disciplines, tend to receive the series as a measurement rather than as a conclusion.\"",
      ru: "Абзац G: «Later users, especially those in other disciplines, tend to receive the series as a measurement rather than as a conclusion».",
    },
  },
  {
    id: "ir2-36",
    skill: "Yes / No / Not Given",
    topic: "Writer's claims",
    difficulty: "hard",
    passage: "r2-ice",
    stem: "Ice cores from Greenland are more reliable than those from Antarctica.",
    options: ["YES", "NO", "NOT GIVEN"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "The passage mentions replication \"across cores on two continents\" and names East Antarctic sites, but never ranks the reliability of one region against another.",
      ru: "Текст упоминает воспроизведение «across cores on two continents» и называет участки Восточной Антарктиды, но нигде не сравнивает надёжность регионов.",
    },
    trap: {
      en: "\"Two continents\" is suggestive but says nothing about which is better. When the comparison itself is absent, the answer is NOT GIVEN.",
      ru: "«Two continents» наводит на мысль, но ничего не говорит о том, что лучше. Если самого сравнения нет — ответ NOT GIVEN.",
    },
  },
  {
    id: "ir2-37",
    skill: "Yes / No / Not Given",
    topic: "Writer's claims",
    difficulty: "medium",
    passage: "r2-ice",
    stem: "The writer thinks the uncertainties described undermine the main conclusions of ice-core science.",
    options: ["YES", "NO", "NOT GIVEN"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Paragraph H opens: \"None of this undermines the central findings.\" The uncertainty is located in finer questions instead.",
      ru: "Абзац H начинается: «None of this undermines the central findings». Неопределённость отнесена к более частным вопросам.",
    },
  },

  /* ---------------- multiple choice ---------------- */
  {
    id: "ir2-38",
    skill: "Multiple choice",
    topic: "Writer's argument",
    difficulty: "hard",
    passage: "r2-ice",
    stem: "Why does the writer say the metaphor of an archive is useful \"up to a point\"?",
    options: [
      "Because the record consists of proxies that each require interpretation",
      "Because ice cores can only be drilled in a few locations",
      "Because the deepest layers have all been destroyed by pressure",
      "Because archives are usually organised by subject rather than date",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph B opens with the limit: \"the archive is not a set of documents but a set of proxies, and every proxy has to be argued for.\"",
      ru: "Абзац B начинается с ограничения: «the archive is not a set of documents but a set of proxies, and every proxy has to be argued for».",
    },
  },
  {
    id: "ir2-39",
    skill: "Multiple choice",
    topic: "Writer's argument",
    difficulty: "hard",
    passage: "r2-ice",
    stem: "What does the writer identify as the main risk when a proxy record is reused?",
    options: [
      "It may be used to test a question it was not built to answer.",
      "It may be measured with obsolete equipment.",
      "It may be published in a language the reader cannot read.",
      "It may contain deliberate errors introduced by the original team.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Paragraph G closes: the distinction between measurement and conclusion \"matters most precisely when the record is being used to test a hypothesis it was never assembled to address.\"",
      ru: "Абзац G заканчивается: разница между измерением и выводом «matters most precisely when the record is being used to test a hypothesis it was never assembled to address».",
    },
  },
  {
    id: "ir2-40",
    skill: "Multiple choice",
    topic: "Writer's argument",
    difficulty: "medium",
    passage: "r2-ice",
    stem: "What is the writer's main purpose in the passage as a whole?",
    options: [
      "To show how a robust body of evidence can still be misread when its uncertainties are hidden",
      "To argue that ice-core research should be discontinued",
      "To describe the engineering involved in drilling deep ice cores",
      "To compare polar research funding across different countries",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The passage builds from how proxies work, through a specific public misreading, to a closing instruction about quoting error bars — while insisting the central findings hold.",
      ru: "Текст идёт от устройства прокси через конкретное публичное неверное прочтение к финальному указанию о погрешностях — настаивая при этом, что основные выводы верны.",
    },
    trap: {
      en: "Option B mistakes criticism of interpretation for criticism of the science. Paragraph H rules it out explicitly.",
      ru: "Вариант B путает критику интерпретации с критикой самой науки. Абзац H это прямо исключает.",
    },
  },
];
