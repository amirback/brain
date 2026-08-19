import type { ExamItem, ListeningScript } from "../types";

/**
 * IELTS Listening, sections 3 and 4.
 *
 * Section 3 is an academic discussion between several speakers, which is where
 * candidates lose marks to speaker attribution rather than to vocabulary — so the
 * questions here deliberately turn on who said what. Section 4 is an uninterrupted
 * lecture with no second chance to hear a fact, tested by note completion.
 */

export const LISTENING_SCRIPTS_2: ListeningScript[] = [
  {
    id: "l3-project",
    title: "Section 3 — Planning a research project",
    setting: "Two students, Marat and Dana, discuss their geography project with their tutor.",
    turns: [
      { speaker: "Tutor", voice: "c", text: "So, you've both had a week to think about the water-use project. Where have you got to?" },
      { speaker: "Marat", voice: "a", text: "We've narrowed it down to irrigation in the Turkestan region. Originally we wanted to cover the whole country, but the data just isn't consistent enough." },
      { speaker: "Dana", voice: "b", text: "That was mainly my worry, actually. The national figures come from three different agencies and they define a hectare of irrigated land differently. Comparing them would have been meaningless." },
      { speaker: "Tutor", voice: "c", text: "That's a sound reason to narrow the scope. What's your source for the regional data?" },
      { speaker: "Marat", voice: "a", text: "There's a regional water board that publishes annual reports going back to 2009. We've got fifteen years of consistent figures." },
      { speaker: "Tutor", voice: "c", text: "And are those reports available in full, or only summaries?" },
      { speaker: "Dana", voice: "b", text: "Summaries online, but the full tables have to be requested. I've sent the request — they say it takes about two weeks." },
      { speaker: "Tutor", voice: "c", text: "Two weeks is tight. Do you have a plan if they don't arrive?" },
      { speaker: "Marat", voice: "a", text: "We could fall back on the summaries. They'd give us totals but not the breakdown by crop, which is really the interesting part." },
      { speaker: "Dana", voice: "b", text: "I'd rather change the question than the data quality. If the tables don't come, I think we should look at one district properly instead of the whole region badly." },
      { speaker: "Tutor", voice: "c", text: "I agree with Dana on that. A narrow study with good data beats a broad one with weak data every time. Now, what about your methodology section?" },
      { speaker: "Marat", voice: "a", text: "We were going to do interviews as well as the statistics — maybe fifteen farmers." },
      { speaker: "Tutor", voice: "c", text: "Fifteen is a lot for a project this size. Have you thought about how long each interview takes once you include travel and transcription?" },
      { speaker: "Dana", voice: "b", text: "We estimated an hour each." },
      { speaker: "Tutor", voice: "c", text: "In my experience it's closer to four, once you've travelled there and typed it up. I'd suggest six interviews, done properly, rather than fifteen rushed." },
      { speaker: "Marat", voice: "a", text: "Six it is, then. Should we record them?" },
      { speaker: "Tutor", voice: "c", text: "Yes, but you must get written consent first, and the form has to go past the ethics committee before you speak to anyone. That's the piece students always leave too late." },
      { speaker: "Dana", voice: "b", text: "When does the committee meet?" },
      { speaker: "Tutor", voice: "c", text: "The first Thursday of every month. So if you want approval before the winter break, your form needs to be submitted by the end of next week." },
      { speaker: "Marat", voice: "a", text: "We'll get it in. And the deadline for the whole project is the fourteenth of February, isn't it?" },
      { speaker: "Tutor", voice: "c", text: "The twenty-first. It moved back a week because of the conference. Don't rely on that, though — the extra week is for writing, not for collecting." },
    ],
  },
  {
    id: "l4-salt",
    title: "Section 4 — Lecture: soil salinity",
    setting: "A lecturer gives a talk on soil salinity in irrigated agriculture.",
    turns: [
      { speaker: "Lecturer", voice: "c", text: "Today I want to look at soil salinity, which is probably the least dramatic and most consequential problem in irrigated agriculture." },
      { speaker: "Lecturer", voice: "c", text: "The mechanism is simple enough. All irrigation water carries dissolved salts, even water that tastes perfectly fresh. When that water reaches a field, the plants take up the water and leave most of the salt behind. Evaporation removes more water and leaves still more salt. Over a season the quantity involved is small; over thirty years, it is not." },
      { speaker: "Lecturer", voice: "c", text: "A useful figure to hold on to: irrigating one hectare with water of average salinity deposits roughly four tonnes of salt on that hectare every year. Unless something removes it, it accumulates." },
      { speaker: "Lecturer", voice: "c", text: "What normally removes it is drainage. If enough water passes through the root zone and out the bottom, it carries the salt down with it. This is called leaching, and it is the only mechanism that actually exports salt from a field. Every other measure merely delays the problem." },
      { speaker: "Lecturer", voice: "c", text: "Leaching, however, requires somewhere for the water to go, and that is where systems fail. If the water table sits close to the surface, there is no downward escape, and the process reverses: groundwater rises by capillary action and evaporates at the surface, concentrating salt in exactly the layer where roots are." },
      { speaker: "Lecturer", voice: "c", text: "The threshold generally quoted is two metres. Where the water table is deeper than two metres below the surface, capillary rise is not a significant problem. Above that depth, it becomes the dominant process, and irrigation begins to make the situation worse rather than better." },
      { speaker: "Lecturer", voice: "c", text: "Now, the effects on crops. Salt does not poison plants in the way people often assume. What it does is raise the osmotic pressure of the soil solution, which makes it harder for roots to draw water in. The plant experiences drought in wet soil. This is why the first visible symptom is stunting rather than discoloration." },
      { speaker: "Lecturer", voice: "c", text: "Tolerance varies enormously between species. Barley tolerates roughly twice the salinity that maize does, and date palm considerably more than either. So one response is simply to change what is grown, which is cheap but obviously narrows a farmer's options." },
      { speaker: "Lecturer", voice: "c", text: "Reclamation of land that has already gone saline is technically straightforward and expensive. You install subsurface drains, then apply water well in excess of crop requirements to flush the salt out. Typical cost estimates run to about two thousand dollars per hectare, and the process takes between three and five years before yields recover." },
      { speaker: "Lecturer", voice: "c", text: "The economics of that are worth pausing on. Prevention — maintaining drainage from the start — costs a fraction of reclamation. Yet drainage is almost always the first item cut when an irrigation scheme is budgeted, because its benefit appears decades later and its cost appears immediately. That asymmetry, rather than any technical difficulty, is why salinity remains as widespread as it is." },
    ],
  },
];

export const LISTENING_ITEMS_2: ExamItem[] = [
  /* ---------------- Section 3: attribution and detail ---------------- */
  {
    id: "il-21",
    skill: "Multiple choice",
    topic: "Speaker attribution",
    difficulty: "hard",
    instruction: "Questions 21–26. Choose the correct letter, A, B or C.",
    stem: "Why did the students narrow the project to one region?",
    options: [
      "The national data came from agencies using different definitions.",
      "The tutor instructed them to reduce the scope.",
      "There was no national data available before 2009.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Dana explains that national figures come from three agencies that \"define a hectare of irrigated land differently\", making comparison meaningless.",
      ru: "Дана объясняет, что национальные данные идут от трёх агентств, которые «define a hectare of irrigated land differently», из-за чего сравнение бессмысленно.",
    },
    trap: {
      en: "The tutor approves the decision afterwards but does not make it. Approval and instruction sound similar and are tested apart.",
      ru: "Преподаватель одобряет решение после, но не принимает его. Одобрение и указание звучат похоже и проверяются раздельно.",
    },
  },
  {
    id: "il-22",
    skill: "Multiple choice",
    topic: "Speaker attribution",
    difficulty: "hard",
    stem: "What does Dana suggest doing if the full data tables do not arrive?",
    options: [
      "Studying a single district in depth instead",
      "Using the online summaries for the whole region",
      "Postponing the project until the next term",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Dana says she would \"rather change the question than the data quality\" and proposes looking at one district properly.",
      ru: "Дана говорит, что предпочла бы «change the question than the data quality», и предлагает как следует изучить один район.",
    },
    trap: {
      en: "Marat is the one who suggests falling back on the summaries. The question asks specifically what Dana suggests.",
      ru: "Про отступление к сводкам говорит Марат. В вопросе спрашивают именно предложение Даны.",
    },
  },
  {
    id: "il-23",
    skill: "Multiple choice",
    topic: "Listening for detail",
    difficulty: "medium",
    stem: "How many interviews does the tutor recommend?",
    options: ["Six", "Fifteen", "Four"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "\"I'd suggest six interviews, done properly, rather than fifteen rushed.\"",
      ru: "«I'd suggest six interviews, done properly, rather than fifteen rushed».",
    },
    trap: {
      en: "Fifteen is the students' original plan and four is the hours per interview. All three numbers appear within a few sentences.",
      ru: "Пятнадцать — исходный план студентов, четыре — часы на одно интервью. Все три числа звучат в пределах нескольких фраз.",
    },
  },
  {
    id: "il-24",
    skill: "Multiple choice",
    topic: "Listening for detail",
    difficulty: "hard",
    stem: "According to the tutor, how long does one interview really take?",
    options: ["About four hours in total", "About one hour in total", "About two weeks in total"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "\"In my experience it's closer to four, once you've travelled there and typed it up.\" The students had estimated an hour.",
      ru: "«In my experience it's closer to four, once you've travelled there and typed it up». Студенты оценивали в час.",
    },
  },
  {
    id: "il-25",
    skill: "Multiple choice",
    topic: "Listening for detail",
    difficulty: "medium",
    stem: "What must be done before the students speak to any farmer?",
    options: [
      "The consent form must be approved by the ethics committee.",
      "The full data tables must have been received.",
      "The recordings must be transcribed.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "\"The form has to go past the ethics committee before you speak to anyone.\"",
      ru: "«The form has to go past the ethics committee before you speak to anyone».",
    },
  },
  {
    id: "il-26",
    skill: "Multiple choice",
    topic: "Listening for dates",
    difficulty: "hard",
    stem: "When is the project deadline?",
    options: ["21 February", "14 February", "The first Thursday of the month"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Marat says the fourteenth and the tutor corrects him: \"The twenty-first. It moved back a week because of the conference.\"",
      ru: "Марат называет четырнадцатое, преподаватель поправляет: «The twenty-first. It moved back a week because of the conference».",
    },
    trap: {
      en: "A wrong date stated by one speaker and corrected by another is a standard section 3 device. The correction is always the answer.",
      ru: "Неверная дата от одного говорящего и поправка от другого — типичный приём раздела 3. Ответ всегда в поправке.",
    },
  },
  {
    id: "il-27",
    skill: "Note completion",
    topic: "Listening for detail",
    difficulty: "medium",
    instruction: "Questions 27–30. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
    stem: "Regional water board reports are available from _____ onwards.",
    answer: { kind: "text", accept: ["2009"], maxWords: 1 },
    explain: {
      en: "\"There's a regional water board that publishes annual reports going back to 2009.\"",
      ru: "«There's a regional water board that publishes annual reports going back to 2009».",
    },
  },
  {
    id: "il-28",
    skill: "Note completion",
    topic: "Listening for detail",
    difficulty: "medium",
    stem: "The full data tables take about _____ weeks to arrive after being requested.",
    answer: { kind: "text", accept: ["2", "two"], maxWords: 1 },
    explain: {
      en: "\"I've sent the request — they say it takes about two weeks.\"",
      ru: "«I've sent the request — they say it takes about two weeks».",
    },
  },
  {
    id: "il-29",
    skill: "Note completion",
    topic: "Listening for detail",
    difficulty: "hard",
    stem: "Summaries give totals but not the breakdown by _____.",
    answer: { kind: "text", accept: ["crop", "crops"], maxWords: 1 },
    explain: {
      en: "\"They'd give us totals but not the breakdown by crop, which is really the interesting part.\"",
      ru: "«They'd give us totals but not the breakdown by crop, which is really the interesting part».",
    },
  },
  {
    id: "il-30",
    skill: "Note completion",
    topic: "Listening for detail",
    difficulty: "medium",
    stem: "The ethics committee meets on the first _____ of each month.",
    answer: { kind: "text", accept: ["Thursday"], maxWords: 1 },
    explain: {
      en: "\"The first Thursday of every month.\"",
      ru: "«The first Thursday of every month».",
    },
  },

  /* ---------------- Section 4: lecture notes ---------------- */
  {
    id: "il-31",
    skill: "Note completion",
    topic: "Listening to a lecture",
    difficulty: "medium",
    instruction: "Questions 31–40. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
    stem: "SOIL SALINITY\nPlants absorb the water but leave most of the _____ behind in the soil.",
    answer: { kind: "text", accept: ["salt", "salts"], maxWords: 1 },
    explain: {
      en: "\"The plants take up the water and leave most of the salt behind.\"",
      ru: "«The plants take up the water and leave most of the salt behind».",
    },
  },
  {
    id: "il-32",
    skill: "Note completion",
    topic: "Listening for numbers",
    difficulty: "hard",
    stem: "Irrigating one hectare deposits roughly _____ tonnes of salt per year.",
    answer: { kind: "text", accept: ["4", "four"], maxWords: 1 },
    explain: {
      en: "\"Irrigating one hectare with water of average salinity deposits roughly four tonnes of salt on that hectare every year.\"",
      ru: "«Irrigating one hectare with water of average salinity deposits roughly four tonnes of salt on that hectare every year».",
    },
  },
  {
    id: "il-33",
    skill: "Note completion",
    topic: "Listening to a lecture",
    difficulty: "medium",
    stem: "The only process that actually removes salt from a field is called _____.",
    answer: { kind: "text", accept: ["leaching"], maxWords: 1 },
    explain: {
      en: "\"This is called leaching, and it is the only mechanism that actually exports salt from a field.\"",
      ru: "«This is called leaching, and it is the only mechanism that actually exports salt from a field».",
    },
  },
  {
    id: "il-34",
    skill: "Note completion",
    topic: "Listening to a lecture",
    difficulty: "hard",
    stem: "When the water table is shallow, groundwater rises by _____ action and evaporates at the surface.",
    answer: { kind: "text", accept: ["capillary"], maxWords: 1 },
    explain: {
      en: "\"Groundwater rises by capillary action and evaporates at the surface.\"",
      ru: "«Groundwater rises by capillary action and evaporates at the surface».",
    },
  },
  {
    id: "il-35",
    skill: "Note completion",
    topic: "Listening for numbers",
    difficulty: "medium",
    stem: "Capillary rise becomes the dominant process when the water table is less than _____ metres deep.",
    answer: { kind: "text", accept: ["2", "two"], maxWords: 1 },
    explain: {
      en: "\"The threshold generally quoted is two metres.\"",
      ru: "«The threshold generally quoted is two metres».",
    },
  },
  {
    id: "il-36",
    skill: "Note completion",
    topic: "Listening to a lecture",
    difficulty: "hard",
    stem: "Salt raises the _____ pressure of the soil solution, making water harder for roots to absorb.",
    answer: { kind: "text", accept: ["osmotic"], maxWords: 1 },
    explain: {
      en: "\"What it does is raise the osmotic pressure of the soil solution, which makes it harder for roots to draw water in.\"",
      ru: "«What it does is raise the osmotic pressure of the soil solution, which makes it harder for roots to draw water in».",
    },
  },
  {
    id: "il-37",
    skill: "Note completion",
    topic: "Listening to a lecture",
    difficulty: "hard",
    stem: "The first visible symptom in an affected crop is _____.",
    answer: { kind: "text", accept: ["stunting"], maxWords: 1 },
    explain: {
      en: "\"This is why the first visible symptom is stunting rather than discoloration.\"",
      ru: "«This is why the first visible symptom is stunting rather than discoloration».",
    },
    trap: {
      en: "\"Discoloration\" is said in the same sentence but is explicitly ruled out. Listen for \"rather than\".",
      ru: "«Discoloration» звучит в том же предложении, но прямо отвергается. Лови оборот «rather than».",
    },
  },
  {
    id: "il-38",
    skill: "Note completion",
    topic: "Listening to a lecture",
    difficulty: "medium",
    stem: "_____ tolerates about twice the salinity that maize does.",
    answer: { kind: "text", accept: ["barley"], maxWords: 1 },
    explain: {
      en: "\"Barley tolerates roughly twice the salinity that maize does.\"",
      ru: "«Barley tolerates roughly twice the salinity that maize does».",
    },
  },
  {
    id: "il-39",
    skill: "Note completion",
    topic: "Listening for numbers",
    difficulty: "hard",
    stem: "Reclaiming saline land costs about _____ dollars per hectare.",
    answer: { kind: "text", accept: ["2000", "2,000", "two thousand"], maxWords: 2 },
    explain: {
      en: "\"Typical cost estimates run to about two thousand dollars per hectare.\"",
      ru: "«Typical cost estimates run to about two thousand dollars per hectare».",
    },
  },
  {
    id: "il-40",
    skill: "Note completion",
    topic: "Listening to a lecture",
    difficulty: "hard",
    stem: "Drainage is usually the first item cut from a budget because its benefit appears only _____ later.",
    answer: { kind: "text", accept: ["decades"], maxWords: 1 },
    explain: {
      en: "\"Drainage is almost always the first item cut when an irrigation scheme is budgeted, because its benefit appears decades later and its cost appears immediately.\"",
      ru: "«Drainage is almost always the first item cut when an irrigation scheme is budgeted, because its benefit appears decades later and its cost appears immediately».",
    },
  },
];
