import type { ExamItem } from "../types";

/**
 * SAT Reading & Writing — Craft and Structure, and Information and Ideas.
 *
 * Format note: on the digital SAT every Reading & Writing question carries its own
 * short passage of 25–150 words, rather than one long text with ten questions
 * hanging off it. These items reproduce that shape, because practising the real
 * thing is the point. (IELTS Reading, elsewhere in this app, is the long-passage
 * format — the two exams genuinely differ.)
 *
 * All passages are written for this app. Question types, difficulty mix and skill
 * proportions follow the published College Board specification.
 */

export const SAT_RW_CRAFT: ExamItem[] = [
  /* ---------------- Words in Context ---------------- */
  {
    id: "rw-wic-01",
    skill: "Craft and Structure",
    topic: "Words in Context",
    difficulty: "easy",
    context:
      "When the archaeologist Kemal Akishev opened the Issyk kurgan in 1969, he found a burial so richly appointed that it reframed what scholars assumed about Saka metalwork. The gold plaques covering the warrior's costume were not crude ornaments but _____ objects, each animal figure cut with a precision that implied generations of accumulated technique.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["accidental", "sophisticated", "enormous", "inexpensive"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "The blank contrasts with \"crude ornaments\" and is supported by \"precision\" and \"generations of accumulated technique.\" Only \"sophisticated\" captures refined skill.",
      ru: "Пропуск противопоставлен «crude ornaments» и поддержан словами «precision» и «generations of accumulated technique». Только «sophisticated» передаёт отточенное мастерство.",
    },
    trap: {
      en: "\"Enormous\" describes size, not skill — the passage never discusses how big the plaques were.",
      ru: "«Enormous» — про размер, а не про мастерство: о величине пластин в тексте нет ни слова.",
    },
  },
  {
    id: "rw-wic-02",
    skill: "Craft and Structure",
    topic: "Words in Context",
    difficulty: "medium",
    context:
      "Critics initially dismissed Abai Kunanbaiuly's Book of Words as a miscellany, a collection too varied in subject to hold together. Later readers found that judgment _____: the apparent scattering of topics turns out to follow a single argument about moral self-examination, pursued from one angle after another.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["premature", "conventional", "generous", "ambiguous"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Later readers discovered an underlying unity the early critics missed, so the early judgment was made too soon — \"premature.\"",
      ru: "Поздние читатели нашли единство, которого ранние критики не увидели, — значит, суждение было вынесено слишком рано: «premature».",
    },
    trap: {
      en: "\"Generous\" reverses the logic: the early judgment was too harsh, not too kind.",
      ru: "«Generous» переворачивает логику: раннее суждение было слишком суровым, а не слишком мягким.",
    },
  },
  {
    id: "rw-wic-03",
    skill: "Craft and Structure",
    topic: "Words in Context",
    difficulty: "hard",
    context:
      "In her study of steppe pastoralism, the historian argues that mobility was not a failure to settle but a deliberate economic strategy. Her account is nonetheless _____ about its limits: she concedes that the archaeological record for the eighth century is too thin to establish whether the pattern she describes held across the whole region.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["evasive", "candid", "dismissive", "indifferent"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "\"She concedes\" signals open acknowledgement of a weakness. \"Candid\" means frank about limitations; \"nonetheless\" marks the contrast with her confident main claim.",
      ru: "«She concedes» — это открытое признание слабого места. «Candid» значит «откровенный о своих ограничениях»; «nonetheless» отмечает контраст с уверенным основным тезисом.",
    },
    trap: {
      en: "\"Evasive\" is the opposite: someone evasive would hide the gap in the record, not concede it.",
      ru: "«Evasive» — противоположность: уклончивый автор скрыл бы пробел в данных, а не признал его.",
    },
  },
  {
    id: "rw-wic-04",
    skill: "Craft and Structure",
    topic: "Words in Context",
    difficulty: "medium",
    context:
      "Ecologists studying the Aral basin have had to work with data that is _____ at best: Soviet-era hydrological records were collected inconsistently, and satellite coverage of the region only becomes reliable after 1985.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["abundant", "fragmentary", "controversial", "theoretical"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Inconsistent collection plus a late start for reliable satellite data means the record has holes in it — \"fragmentary.\"",
      ru: "Непоследовательный сбор плюс поздняя надёжная спутниковая съёмка означают, что в данных есть дыры, — «fragmentary».",
    },
  },
  {
    id: "rw-wic-05",
    skill: "Craft and Structure",
    topic: "Words in Context",
    difficulty: "hard",
    context:
      "The composer's late quartets resist the label of experiment. An experiment implies a hypothesis one may abandon; these works instead show a technique being _____, each piece refining a solution the previous one had only sketched.",
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["consolidated", "questioned", "abandoned", "concealed"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Each piece refines what the last one sketched, so the technique is being firmed up and built on — \"consolidated.\"",
      ru: "Каждая пьеса дорабатывает намеченное в предыдущей — значит, техника закрепляется и наращивается: «consolidated».",
    },
    trap: {
      en: "\"Questioned\" belongs to the idea of experiment the passage explicitly rejects.",
      ru: "«Questioned» относится к идее эксперимента, которую текст прямо отвергает.",
    },
  },

  /* ---------------- Text Structure and Purpose ---------------- */
  {
    id: "rw-tsp-01",
    skill: "Craft and Structure",
    topic: "Text Structure and Purpose",
    difficulty: "medium",
    context:
      "Most accounts of the domestication of the horse place it on the Eurasian steppe around 3500 BCE, based on wear patterns on excavated teeth. A 2021 genomic study complicates this timeline. Analysing DNA from 273 ancient horses, the authors found that the lineage underlying all modern domestic horses spread only after 2200 BCE — more than a millennium later than the dental evidence suggests. The discrepancy does not overturn the earlier work so much as narrow what it can claim.",
    stem: "Which choice best describes the overall structure of the text?",
    options: [
      "It presents a long-standing claim, introduces evidence that qualifies it, and characterises the relationship between the two.",
      "It describes a scientific method in detail and then lists the fields that have adopted it.",
      "It contrasts two researchers' personalities and explains why one prevailed.",
      "It poses a question, rejects three answers, and offers a fourth.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The text moves from the established dental-evidence timeline, to a genomic study that pushes the date later, to a final sentence defining how the two relate (\"narrow what it can claim\").",
      ru: "Текст идёт от устоявшейся датировки по зубам к геномному исследованию, сдвигающему дату, и заканчивается предложением о том, как они соотносятся («narrow what it can claim»).",
    },
    trap: {
      en: "The last sentence explicitly says the new work does *not* overturn the old, which rules out any \"one prevailed\" reading.",
      ru: "Последнее предложение прямо говорит, что новая работа не опровергает старую, — это исключает вариант «одна победила».",
    },
  },
  {
    id: "rw-tsp-02",
    skill: "Craft and Structure",
    topic: "Text Structure and Purpose",
    difficulty: "hard",
    context:
      "The following is adapted from a 1908 novel. The narrator is describing her employer's library.\n\nIt was not a room for reading. The volumes stood in ranks behind glass, spines outward, uniformly bound in a calf that had never been softened by a hand. Once I saw him unlock a case, and my heart rose; he removed a book, checked something on its title page, and returned it. The lock turned again. I understood then that the collection was an argument he was making to visitors, and that the argument did not require any of us to open it.",
    stem: "Which choice best states the function of the underlined phrase \"my heart rose\" in the text as a whole?",
    options: [
      "It signals the narrator's brief expectation that the books served their ordinary purpose, which the following sentences disappoint.",
      "It establishes that the narrator has a romantic attachment to her employer.",
      "It emphasises the physical effort required to unlock the heavy cases.",
      "It suggests the narrator had been forbidden from entering the room before.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The narrator hopes a book is about to be read; instead it is checked and reshelved, and the lock turns. The phrase sets up the deflation that delivers the paragraph's point about display over use.",
      ru: "Рассказчица надеется, что книгу сейчас будут читать; вместо этого её проверяют и ставят обратно, замок щёлкает. Фраза готовит разочарование, которое и доносит мысль абзаца: показное вместо использования.",
    },
  },
  {
    id: "rw-tsp-03",
    skill: "Craft and Structure",
    topic: "Text Structure and Purpose",
    difficulty: "easy",
    context:
      "Lithium-ion batteries lose capacity partly because lithium metal builds up in needle-like structures called dendrites on the anode. A team at Almaty's Satbayev University tested whether a thin ceramic interlayer could suppress this growth. After 400 charge cycles, cells with the interlayer retained 91 percent of their original capacity; control cells retained 74 percent.",
    stem: "Which choice best states the main purpose of the text?",
    options: [
      "To report a test of one proposed solution to a known battery-degradation mechanism",
      "To argue that lithium-ion batteries should be replaced by another chemistry",
      "To explain how a ceramic interlayer is manufactured at industrial scale",
      "To compare battery research in Kazakhstan with research conducted elsewhere",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The text names a known failure mechanism (dendrites), describes a specific intervention tested against it, and reports the numbers. That is a report of a test.",
      ru: "Текст называет известный механизм деградации (дендриты), описывает конкретное решение, которое проверяли, и приводит цифры. Это отчёт об испытании.",
    },
  },
  {
    id: "rw-tsp-04",
    skill: "Craft and Structure",
    topic: "Cross-Text Connections",
    difficulty: "hard",
    context:
      "Text 1: Urban planners have long treated street trees as amenity rather than infrastructure. Recent work reverses that ordering. In cities with continuous canopy, summer surface temperatures fall by up to 12°C, storm runoff drops measurably, and the resulting savings on drainage and cooling exceed planting costs within fifteen years.\n\nText 2: The cooling figures cited for urban canopy are real but highly local. A tree lowers temperature within roughly its own shadow. Aggregated across a district, the effect on ambient air temperature is closer to 1–2°C. Planning decisions justified by the larger number will disappoint the residents who were promised them.",
    stem: "Based on the texts, how would the author of Text 2 most likely respond to the claim about temperature in Text 1?",
    options: [
      "By agreeing that the measurement is accurate but arguing that it describes a narrower effect than the claim implies",
      "By denying that street trees produce any measurable cooling",
      "By insisting that drainage savings are more important than temperature",
      "By recommending that cities plant a different species of tree",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Text 2 opens by calling the figures \"real\" — so it accepts the measurement — then restricts its scope to a tree's own shadow and gives a much smaller district-wide number.",
      ru: "Text 2 начинается со слова «real» — то есть измерение принимается, — а затем ограничивает его тенью самого дерева и даёт куда меньшую цифру по району.",
    },
    trap: {
      en: "\"Denying any measurable cooling\" contradicts the first sentence of Text 2.",
      ru: "«Отрицает любое охлаждение» противоречит первому предложению Text 2.",
    },
  },

  /* ---------------- Central Ideas and Details ---------------- */
  {
    id: "rw-cid-01",
    skill: "Information and Ideas",
    topic: "Central Ideas and Details",
    difficulty: "easy",
    context:
      "The snow leopard's tail is nearly as long as its body. Field biologists once assumed this was principally a balance aid on steep terrain, and it is: the animal uses it as a counterweight when turning at speed on scree. But thermal imaging has shown a second function. At rest, a snow leopard wraps the tail across its muzzle, and the dense fur traps warmed exhaled air, reducing the energy the animal spends heating each breath.",
    stem: "Which choice best states the main idea of the text?",
    options: [
      "A feature long explained by one function turns out to serve a second one as well.",
      "Thermal imaging has replaced field observation in the study of large cats.",
      "The snow leopard's tail is longer than that of any comparable predator.",
      "Snow leopards spend most of their energy budget on maintaining body temperature.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The text confirms the balance explanation (\"and it is\") and then adds a thermal one (\"a second function\"). The main idea is the addition, not a replacement.",
      ru: "Текст подтверждает объяснение про баланс («and it is») и добавляет тепловое («a second function»). Главная мысль — именно дополнение, а не замена.",
    },
    trap: {
      en: "Option B overstates: imaging revealed something new, but the text never says it replaced field observation.",
      ru: "Вариант B преувеличивает: съёмка показала новое, но о замене полевых наблюдений в тексте нет ни слова.",
    },
  },
  {
    id: "rw-cid-02",
    skill: "Information and Ideas",
    topic: "Central Ideas and Details",
    difficulty: "medium",
    context:
      "Between 1997 and 2019, the number of languages with a documented written orthography rose sharply, largely because missionary and NGO literacy projects produced alphabets for previously unwritten languages. Linguists disagree about the consequence. Some regard any orthography as a preservation tool. Others note that an externally designed script, once adopted in schooling, tends to standardise one dialect at the expense of the others, and that the languages showing the steepest recent decline in speaker numbers are disproportionately those that acquired a script in this period.",
    stem: "According to the text, what do the second group of linguists observe about languages that gained a script in this period?",
    options: [
      "They are over-represented among languages losing speakers most rapidly.",
      "They are typically spoken by fewer than one thousand people.",
      "They have all abandoned the script within a generation.",
      "They receive more NGO funding than languages with older scripts.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The final clause states exactly this: the steepest decline in speaker numbers is \"disproportionately\" among languages that acquired a script in this period.",
      ru: "Последняя часть предложения говорит ровно это: сильнее всего теряют носителей «непропорционально» те языки, что получили письменность в этот период.",
    },
  },
  {
    id: "rw-cid-03",
    skill: "Information and Ideas",
    topic: "Central Ideas and Details",
    difficulty: "hard",
    context:
      "The received view of the Silk Road as a continuous highway carrying goods from Chang'an to the Mediterranean has been hard to dislodge, partly because it is a satisfying image. The evidence supports something less tidy. Very few objects travelled the whole distance; most moved in short relays between adjacent markets, changing hands and often changing form. What travelled far were not usually goods but techniques and, more consequentially, credit arrangements — the instruments that let a merchant in Samarkand accept a claim written in Kashgar.",
    stem: "Which choice best states the main idea of the text?",
    options: [
      "The network's long-distance significance lay less in the movement of objects than in the movement of practices and financial instruments.",
      "Goods produced in Chang'an rarely reached markets west of Samarkand.",
      "Historians have deliberately simplified the Silk Road to make it easier to teach.",
      "Credit arrangements were invented by merchants working between Kashgar and Samarkand.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The last sentence carries the point: not goods but techniques and credit arrangements travelled far, and credit is called the more consequential of the two.",
      ru: "Смысл в последнем предложении: далеко шли не товары, а техники и кредитные инструменты, причём кредит назван более значимым.",
    },
    trap: {
      en: "Option B is a detail the text implies, not the main idea, and it drops the entire second half about techniques and credit.",
      ru: "Вариант B — деталь, которую текст подразумевает, а не главная мысль: он теряет всю вторую половину про техники и кредит.",
    },
  },

  /* ---------------- Command of Evidence ---------------- */
  {
    id: "rw-coe-01",
    skill: "Information and Ideas",
    topic: "Command of Evidence (Textual)",
    difficulty: "medium",
    context:
      "A researcher proposes that the felt-covered walls of a traditional yurt do more than insulate: because felt absorbs sound unevenly across frequencies, she argues, the interior was acoustically suited to unamplified speech and song, favouring the human voice over ambient noise.",
    stem: "Which finding, if true, would most directly support the researcher's hypothesis?",
    options: [
      "Measurements inside reconstructed yurts show that felt absorbs low-frequency noise strongly while reflecting the mid-range frequencies of the human voice.",
      "Felt used in yurt construction is typically between three and five centimetres thick.",
      "Historical accounts describe evening gatherings in yurts at which songs were performed.",
      "Modern concert halls sometimes use wool panels to control reverberation.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The hypothesis is specifically about uneven absorption across frequencies favouring the voice. Only option A measures that exact asymmetry.",
      ru: "Гипотеза именно о неравномерном поглощении по частотам в пользу голоса. Только вариант A измеряет эту асимметрию.",
    },
    trap: {
      en: "Option C shows singing happened, but not that the felt caused the acoustic advantage — people sing in all sorts of rooms.",
      ru: "Вариант C показывает, что пели, но не то, что акустическое преимущество создавал войлок, — поют в любых помещениях.",
    },
  },
  {
    id: "rw-coe-02",
    skill: "Information and Ideas",
    topic: "Command of Evidence (Quantitative)",
    difficulty: "hard",
    context:
      "A team surveyed four districts to see whether households that received a subsidised insulation retrofit reduced winter heating fuel use. Reported reductions in fuel purchased, one year after the retrofit:\n\nDistrict A: 31% (baseline homes: 210)\nDistrict B: 29% (baseline homes: 195)\nDistrict C: 6% (baseline homes: 188)\nDistrict D: 28% (baseline homes: 203)\n\nThe team noted that District C was the only district in which the retrofit had been installed during the heating season rather than in summer.",
    stem: "Which choice most effectively uses data from the text to support the conclusion that installation timing affected the retrofit's benefit?",
    options: [
      "District C, the only district retrofitted mid-season, showed a reduction of 6%, while the three districts retrofitted in summer each reduced fuel use by at least 28%.",
      "District A showed the largest reduction at 31%, which is 2 percentage points more than District B.",
      "All four districts had a baseline sample of roughly 200 homes, making the comparison fair.",
      "District C's 6% reduction shows that insulation retrofits do not reduce heating fuel use.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The conclusion is about timing, so the evidence must pair the timing difference with the outcome difference. Option A does exactly that: the one mid-season district is also the one weak result.",
      ru: "Вывод — про сроки установки, значит, доказательство должно связать разницу в сроках с разницей в результате. Вариант A это и делает: единственный «зимний» район — единственный слабый результат.",
    },
    trap: {
      en: "Option D overgeneralises from one district and ignores the three that reduced use by nearly a third.",
      ru: "Вариант D делает вывод по одному району и игнорирует три остальных, где расход упал почти на треть.",
    },
  },
  {
    id: "rw-coe-03",
    skill: "Information and Ideas",
    topic: "Inferences",
    difficulty: "medium",
    context:
      "Apples brought to Kazakhstan's Tien Shan foothills from commercial orchards abroad are genetically narrow: nearly all descend from a handful of cultivars selected for shelf life. The wild Malus sieversii forests on the same slopes contain far more genetic variation, including resistance traits absent from commercial stock. Those forests have shrunk by an estimated seventy percent since 1950. Breeders who need resistance genes in the coming decades will therefore _____",
    stem: "Which choice most logically completes the text?",
    options: [
      "depend on a wild reservoir that is disappearing faster than it is being catalogued.",
      "find that commercial cultivars already contain every trait they require.",
      "be able to recreate the lost variation from existing orchard stock.",
      "no longer need to consider disease resistance in their selection programmes.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The text sets up three facts: commercial stock lacks the resistance traits, the wild forests hold them, and those forests are collapsing. The inference joins them.",
      ru: "Текст даёт три факта: у коммерческих сортов нет генов устойчивости, у диких лесов они есть, и эти леса исчезают. Вывод их соединяет.",
    },
  },
  {
    id: "rw-coe-04",
    skill: "Information and Ideas",
    topic: "Inferences",
    difficulty: "hard",
    context:
      "In double-blind trials of a treatment, neither patients nor the clinicians assessing them know who received the active compound. The design exists because expectation measurably alters both what a patient reports and what an observer records. A recent review found that trials of surgical procedures are far less likely than drug trials to be blinded, for practical reasons: a surgeon cannot be unaware of which operation they performed. It follows that when a surgical trial and a drug trial report similar effect sizes, _____",
    stem: "Which choice most logically completes the text?",
    options: [
      "the surgical result carries a greater risk of being inflated by expectation than the drug result does.",
      "the two results should be treated as equally reliable evidence.",
      "the drug trial must have been conducted with a smaller sample.",
      "the surgical procedure is more likely to have a genuine physiological effect.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Blinding exists to control expectation effects; surgical trials are less often blinded; therefore an unblinded surgical result has more room for that inflation. The comparison is about vulnerability to bias, not about which treatment works.",
      ru: "Ослепление нужно, чтобы контролировать эффект ожидания; в хирургии его применяют реже; значит, у хирургического результата больше пространства для такого завышения. Сравнение — об уязвимости к смещению, а не о том, что лучше работает.",
    },
    trap: {
      en: "Option D flips the inference: less blinding is a reason for more caution, not more confidence.",
      ru: "Вариант D переворачивает вывод: меньше ослепления — повод для большей осторожности, а не для большей уверенности.",
    },
  },
];
