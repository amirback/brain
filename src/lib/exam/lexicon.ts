/**
 * Word lists the writing and speaking graders measure against.
 *
 * These are small on purpose. A grader that leans on a 5,000-word frequency list
 * would be no more accurate here and would dominate the bundle; what actually
 * separates a band 5 answer from a band 7 one is whether the student reaches for
 * cohesion, hedging and topic-specific nouns at all.
 */

/** Linking devices, grouped so we can reward variety rather than raw count. */
export const LINKERS: Record<string, string[]> = {
  addition: ["moreover", "furthermore", "in addition", "additionally", "besides", "what is more", "not only"],
  contrast: ["however", "nevertheless", "on the other hand", "whereas", "while", "although", "despite", "in spite of", "conversely", "by contrast"],
  cause: ["because", "since", "as a result", "therefore", "consequently", "thus", "hence", "owing to", "due to", "for this reason"],
  example: ["for example", "for instance", "such as", "to illustrate", "namely", "in particular"],
  sequence: ["first", "firstly", "second", "secondly", "third", "finally", "then", "afterwards", "subsequently"],
  conclusion: ["in conclusion", "to conclude", "to sum up", "overall", "in summary", "on balance"],
};

export const ALL_LINKERS = Object.values(LINKERS).flat();

/** Markers of a subordinate clause — the cheapest reliable proxy for range. */
export const SUBORDINATORS = [
  "although", "though", "whereas", "while", "because", "since", "unless", "until",
  "whenever", "wherever", "if", "even if", "even though", "so that", "in order to",
  "which", "who", "whom", "whose", "that", "after", "before", "as soon as",
];

/** Hedging and stance language — a band 7 writer commits to a position carefully. */
export const HEDGES = [
  "arguably", "seemingly", "tend to", "tends to", "is likely to", "are likely to",
  "may", "might", "could", "appears to", "suggests that", "to some extent",
  "in most cases", "generally", "largely", "relatively",
];

/** Mid-frequency academic vocabulary. Presence lifts Lexical Resource. */
export const ACADEMIC = [
  "significant", "substantial", "considerable", "marginal", "negligible", "steady",
  "gradual", "sharp", "dramatic", "fluctuate", "plateau", "peak", "decline", "surge",
  "proportion", "majority", "minority", "trend", "figure", "rate", "ratio",
  "implement", "sustain", "allocate", "generate", "acquire", "constitute", "derive",
  "impose", "undermine", "facilitate", "mitigate", "exacerbate", "alleviate",
  "prioritise", "prioritize", "regulate", "subsidise", "subsidize", "incentive",
  "infrastructure", "legislation", "policy", "initiative", "resource", "revenue",
  "expenditure", "welfare", "curriculum", "literacy", "employment", "unemployment",
  "sustainable", "urbanisation", "urbanization", "consumption", "emission",
  "innovation", "productivity", "inequality", "disparity", "accessibility",
  "consequence", "implication", "phenomenon", "criterion", "perspective",
  "compelling", "detrimental", "beneficial", "crucial", "vital", "profound",
  "widespread", "prevalent", "inevitable", "feasible", "viable", "comprehensive",
];

/**
 * Common ESL errors, as patterns with a fix.
 * Each one is something an IELTS examiner would actually mark.
 */
export interface ErrorRule {
  id: string;
  re: RegExp;
  /** Which criterion the mistake belongs to. */
  criterion: "lr" | "gra" | "cc" | "ta";
  en: string;
  ru: string;
  /** Heavier mistakes weigh more when the band is computed. */
  weight?: number;
}

export const ERROR_RULES: ErrorRule[] = [
  {
    id: "uncountable-plural",
    re: /\b(informations|advices|researches|knowledges|equipments|furnitures|advices|homeworks|softwares|traffics)\b/gi,
    criterion: "gra",
    en: "This noun is uncountable in English, so it has no plural -s.",
    ru: "Это неисчисляемое существительное — множественного числа с -s у него нет.",
    weight: 1.2,
  },
  {
    id: "peoples",
    re: /\bpeoples\b/gi,
    criterion: "gra",
    en: "\"People\" is already plural. \"Peoples\" only means separate ethnic groups.",
    ru: "«People» уже множественное число. «Peoples» — это только «народы» как этносы.",
    weight: 1.2,
  },
  {
    id: "childrens",
    re: /\b(childrens|mens|womens|feets|teeths)\b/gi,
    criterion: "gra",
    en: "This is already an irregular plural — adding -s makes it a double plural.",
    ru: "Это уже неправильное множественное число, второе -s лишнее.",
    weight: 1.2,
  },
  {
    id: "people-singular",
    re: /\bpeople\s+(is|was|has)\b/gi,
    criterion: "gra",
    en: "\"People\" takes a plural verb: people are, people were, people have.",
    ru: "«People» требует множественного числа: people are / were / have.",
    weight: 1.3,
  },
  {
    id: "there-is-many",
    re: /\bthere\s+is\s+(many|several|a lot of|lots of|numerous)\b/gi,
    criterion: "gra",
    en: "Plural subject needs \"there are\".",
    ru: "С множественным числом нужно «there are».",
    weight: 1.2,
  },
  {
    id: "much-countable",
    re: /\bmuch\s+(people|students|jobs|cars|countries|children|problems|things)\b/gi,
    criterion: "gra",
    en: "Countable nouns take \"many\", not \"much\".",
    ru: "С исчисляемыми существительными — «many», а не «much».",
    weight: 1.1,
  },
  {
    id: "every-plural",
    re: /\b(every|each)\s+(students|people|countries|children|problems|cities|companies)\b/gi,
    criterion: "gra",
    en: "\"Every\" and \"each\" are followed by a singular noun.",
    ru: "После «every» и «each» существительное в единственном числе.",
    weight: 1.1,
  },
  {
    id: "discuss-about",
    re: /\b(discuss|discussed|discussing)\s+about\b/gi,
    criterion: "lr",
    en: "\"Discuss\" is already transitive — drop \"about\".",
    ru: "«Discuss» уже переходный — «about» лишнее.",
    weight: 1,
  },
  {
    id: "wrong-preposition",
    re: /\b(emphasi[sz]e|comprise|approach|contact|lack|enter|marry)\s+(on|of|to|with|about)\b/gi,
    criterion: "lr",
    en: "This verb does not take that preposition in English.",
    ru: "Этот глагол не требует такого предлога в английском.",
    weight: 1,
  },
  {
    id: "double-comparative",
    re: /\bmore\s+(better|worse|easier|higher|larger|greater|faster|bigger|smaller)\b/gi,
    criterion: "gra",
    en: "Use either \"more\" or the -er ending, never both.",
    ru: "Либо «more», либо окончание -er — но не оба сразу.",
    weight: 1.2,
  },
  {
    id: "different-than",
    re: /\bdifferent\s+than\b/gi,
    criterion: "lr",
    en: "Academic English prefers \"different from\".",
    ru: "В академическом английском — «different from».",
  },
  {
    id: "according-to-me",
    re: /\b(according to me|in my point of view|as per me|by my opinion)\b/gi,
    criterion: "lr",
    en: "Not idiomatic. Write \"in my view\" or \"in my opinion\".",
    ru: "Так не говорят. Правильно: «in my view» или «in my opinion».",
    weight: 1.2,
  },
  {
    id: "in-nowadays",
    re: /\b(in|at)\s+nowadays\b/gi,
    criterion: "lr",
    en: "\"Nowadays\" is already an adverb — no preposition before it.",
    ru: "«Nowadays» — уже наречие, предлог перед ним не нужен.",
  },
  {
    id: "contractions",
    re: /\b(don't|doesn't|didn't|can't|won't|isn't|aren't|wasn't|it's|they're|we're|i'm|there's)\b/gi,
    criterion: "lr",
    en: "Contractions are too informal for IELTS writing — write the full form.",
    ru: "Сокращения слишком разговорные для IELTS Writing — пиши полную форму.",
    weight: 0.7,
  },
  {
    id: "informal",
    re: /\b(a lot of|lots of|kids|stuff|things like that|and so on|etc\.?|big problem|good thing|bad thing)\b/gi,
    criterion: "lr",
    en: "Informal or vague wording. An examiner wants a precise academic equivalent.",
    ru: "Разговорно или расплывчато. Нужен точный академический эквивалент.",
    weight: 0.6,
  },
  {
    id: "start-and-but",
    re: /(^|[.!?]\s+)(But|And|Because|So)\s/g,
    criterion: "cc",
    en: "Starting a sentence this way reads as speech. Use a formal connector.",
    ru: "Так начинают предложение в устной речи. Нужен формальный коннектор.",
    weight: 0.6,
  },
  {
    id: "i-think-overuse",
    re: /\bi\s+(think|guess|feel)\b/gi,
    criterion: "lr",
    en: "\"I think\" is weak. \"I would argue\" or \"it can be argued\" is stronger.",
    ru: "«I think» звучит слабо. Сильнее: «I would argue» или «it can be argued».",
    weight: 0.6,
  },
  {
    id: "the-people-general",
    re: /\bthe\s+(people|society|nature|children|students)\s+(in general|nowadays|today)\b/gi,
    criterion: "gra",
    en: "General statements about a whole group take no article.",
    ru: "В обобщениях о группе в целом артикль не нужен.",
  },
  {
    id: "no-capital-i",
    re: /(^|\s)i(\s|')/g,
    criterion: "gra",
    en: "The pronoun \"I\" is always capitalised.",
    ru: "Местоимение «I» всегда пишется с большой буквы.",
    weight: 0.8,
  },
];

/** Very common misspellings, checked separately so we can quote the fix. */
export const MISSPELLINGS: Record<string, string> = {
  goverment: "government",
  enviroment: "environment",
  environmet: "environment",
  becouse: "because",
  becuase: "because",
  wich: "which",
  benifit: "benefit",
  benifits: "benefits",
  oppurtunity: "opportunity",
  oportunity: "opportunity",
  recieve: "receive",
  seperate: "separate",
  definately: "definitely",
  occured: "occurred",
  neccessary: "necessary",
  necesary: "necessary",
  succesful: "successful",
  sucessful: "successful",
  begining: "beginning",
  developement: "development",
  knowlege: "knowledge",
  responsability: "responsibility",
  independant: "independent",
  argu: "argue",
  arguement: "argument",
  reccomend: "recommend",
  acheive: "achieve",
  beleive: "believe",
  socity: "society",
  studing: "studying",
  writting: "writing",
  thier: "their",
  teh: "the",
  alot: "a lot",
  ofcourse: "of course",
  everyday: "every day",
};
