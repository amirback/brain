import type { Lesson, Question, Topic } from "../types";
import { n, t } from "./util";

export const satTopics: Topic[] = [
  {
    id: "sat-algebra",
    subject: "sat",
    title: t("SAT Math: алгебра", "SAT Math: алгебра", "SAT Math: algebra"),
    blurb: t(
      "Линейные уравнения, системы и текстовые задачи — самый большой раздел SAT Math.",
      "Сызықтық теңдеулер, жүйелер және мәтінді есептер — SAT Math-тың ең үлкен бөлімі.",
      "Linear equations, systems and word problems — the largest slice of SAT Math."
    ),
    weight: 0.35,
  },
  {
    id: "sat-data",
    subject: "sat",
    title: t("SAT Math: данные и проценты", "SAT Math: деректер мен пайыздар", "SAT Math: data and percentages"),
    blurb: t(
      "Проценты, отношения, чтение таблиц и графиков: считать быстро и не попадаться на ловушки.",
      "Пайыздар, қатынастар, кесте мен графикті оқу: жылдам санап, тұзаққа түспеу.",
      "Percentages, ratios and reading tables and charts — fast arithmetic without the traps."
    ),
    weight: 0.3,
  },
  {
    id: "sat-writing",
    subject: "sat",
    title: t("SAT Reading & Writing", "SAT Reading & Writing", "SAT Reading & Writing"),
    blurb: t(
      "Грамматика, пунктуация и логика связок в тексте — раздел, который проще всего подтянуть.",
      "Грамматика, тыныс белгілері және мәтіндегі байланыс логикасы — көтеруге ең оңай бөлім.",
      "Grammar, punctuation and transition logic — the section that improves fastest."
    ),
    weight: 0.35,
  },
];

export const satLessons: Lesson[] = [
  {
    topic: "sat-algebra",
    intro: t(
      "SAT не проверяет сложную математику — он проверяет скорость и внимательность. Большая часть задач решается за 30–60 секунд, если сразу увидеть структуру.",
      "SAT күрделі математиканы емес, жылдамдық пен ұқыптылықты тексереді. Есептердің көбі құрылымын бірден көрсең, 30–60 секундта шешіледі.",
      "The SAT doesn't test hard math — it tests speed and care. Most items fall in 30–60 seconds once you see the structure."
    ),
    sections: [
      {
        heading: t("Системы уравнений", "Теңдеулер жүйесі", "Systems of equations"),
        body: t(
          "Если у системы бесконечно много решений, уравнения пропорциональны. Если решений нет — коэффициенты пропорциональны, а свободные члены нет.",
          "Жүйенің шексіз көп шешімі болса, теңдеулер пропорционал. Шешімі жоқ болса — коэффициенттер пропорционал, бос мүшелер емес.",
          "Infinitely many solutions means the equations are proportional. No solution means the coefficients are proportional but the constants are not."
        ),
        formula: "a₁/a₂ = b₁/b₂ = c₁/c₂ → ∞ solutions",
      },
      {
        heading: t("Наклон прямой", "Түзудің көлбеуі", "Slope"),
        body: t(
          "Наклон — это скорость изменения. В текстовой задаче «на сколько растёт за единицу» — это всегда наклон, а начальное значение — свободный член.",
          "Көлбеу — өзгеру жылдамдығы. Мәтінді есепте «бір бірлікке қанша өседі» — әрқашан көлбеу, ал бастапқы мән — бос мүше.",
          "Slope is a rate of change. In a word problem, \"how much per unit\" is always the slope, and the starting value is the intercept."
        ),
        formula: "slope = (y₂ − y₁) / (x₂ − x₁)",
      },
    ],
    example: {
      problem: n("A gym charges $30 to join plus $15 per month. Write the cost after m months."),
      steps: [
        t("Начальный платёж не зависит от месяцев — это свободный член: 30.", "Бастапқы төлем айларға тәуелсіз — бұл бос мүше: 30.", "The joining fee doesn't depend on months — it's the constant: 30."),
        t("15 долларов за каждый месяц — это наклон: 15m.", "Айына 15 доллар — бұл көлбеу: 15m.", "$15 for each month is the slope: 15m."),
        n("Answer: C = 15m + 30"),
      ],
    },
  },
  {
    topic: "sat-data",
    intro: t(
      "Половина ошибок в этом разделе — не в арифметике, а в чтении вопроса: спрашивают процент от чего именно и в каких единицах ответ.",
      "Бұл бөлімдегі қателердің жартысы арифметикада емес, сұрақты оқуда: нақты неден пайыз сұралады және жауап қандай өлшемде.",
      "Half the mistakes here aren't arithmetic — they're misreading which base the percentage is of, and in what units the answer goes."
    ),
    sections: [
      {
        heading: t("Проценты", "Пайыздар", "Percentages"),
        body: t(
          "Увеличение на 20% — умножение на 1,2. Уменьшение на 20% — умножение на 0,8. Два подряд не дают возврата к исходному: 1,2 × 0,8 = 0,96.",
          "20%-ға арту — 1,2-ге көбейту. 20%-ға кему — 0,8-ге көбейту. Екеуі қатар бастапқы мәнге қайтармайды: 1,2 × 0,8 = 0,96.",
          "A 20% increase means ×1.2; a 20% decrease means ×0.8. Doing both doesn't return you to the start: 1.2 × 0.8 = 0.96."
        ),
        formula: "new = old × (1 ± p/100)",
      },
      {
        heading: t("Отношения", "Қатынастар", "Ratios"),
        body: t(
          "Отношение 3 : 5 значит, что целое делится на 8 частей. Чтобы найти величину, дели общее на сумму частей, а потом умножай.",
          "3 : 5 қатынасы бүтін 8 бөлікке бөлінетінін білдіреді. Шаманы табу үшін жалпыны бөліктер қосындысына бөл, сосын көбейт.",
          "A 3 : 5 ratio means the whole splits into 8 parts. Divide the total by the sum of the parts, then multiply."
        ),
      },
    ],
    example: {
      problem: n("A price rises from $80 to $92. What is the percent increase?"),
      steps: [
        t("Разница: 92 − 80 = 12.", "Айырма: 92 − 80 = 12.", "Difference: 92 − 80 = 12."),
        t("Делим на исходное значение, а не на новое: 12 / 80 = 0,15.", "Жаңасына емес, бастапқыға бөлеміз: 12 / 80 = 0,15.", "Divide by the original, not the new value: 12 / 80 = 0.15."),
        n("Answer: 15%"),
      ],
    },
  },
  {
    topic: "sat-writing",
    intro: t(
      "В Reading & Writing почти нет вкусовщины: у каждого вопроса есть правило, по которому один вариант объективно верен. Ищи правило, а не «как звучит лучше».",
      "Reading & Writing бөлімінде талғам жоқ дерлік: әр сұрақтың ережесі бар, сол бойынша бір нұсқа объективті дұрыс. «Қалай жақсы естіледі» емес, ережені ізде.",
      "Reading & Writing is rarely a matter of taste: each question has a rule that makes exactly one option correct. Hunt for the rule, not for what sounds nice."
    ),
    sections: [
      {
        heading: t("Запятая и независимые предложения", "Үтір және дербес сөйлемдер", "Commas and independent clauses"),
        body: t(
          "Два независимых предложения нельзя соединять просто запятой. Нужна точка, точка с запятой, или запятая плюс союз (and, but, so).",
          "Екі дербес сөйлемді жай үтірмен қосуға болмайды. Нүкте, нүктелі үтір немесе үтір мен жалғаулық керек (and, but, so).",
          "Two independent clauses can't be joined by a comma alone. Use a period, a semicolon, or a comma plus a conjunction (and, but, so)."
        ),
        formula: "…clause; clause.   ·   …clause, and clause.",
      },
      {
        heading: t("Связки", "Байланыстырушы сөздер", "Transitions"),
        body: t(
          "However — противопоставление, therefore — следствие, moreover — добавление, for example — иллюстрация. Определи связь между предложениями до того, как смотреть варианты.",
          "However — қарсылық, therefore — салдар, moreover — қосу, for example — мысал. Нұсқаларға қарамас бұрын сөйлемдер арасындағы байланысты анықта.",
          "However contrasts, therefore concludes, moreover adds, for example illustrates. Decide the relationship before looking at the options."
        ),
      },
    ],
    example: {
      problem: n("The results were surprising ___ the team repeated the experiment."),
      steps: [
        t("Обе части — самостоятельные предложения.", "Екі бөлік те — дербес сөйлем.", "Both halves are independent clauses."),
        t("Второе — следствие первого, значит нужна связка следствия.", "Екіншісі — біріншінің салдары, демек салдар байланысы керек.", "The second follows from the first, so we need a consequence transition."),
        n("Answer: …surprising, so the team repeated the experiment."),
      ],
    },
  },
];

export const satQuestions: Question[] = [
  {
    id: "sta1", subject: "sat", topic: "sat-algebra", difficulty: 820,
    stem: n("If 3x + 5 = 20, what is the value of x?"),
    options: [n("5"), n("15"), n("25/3"), n("3")], correct: 0,
    explain: t("3x = 15, значит x = 5.", "3x = 15, демек x = 5.", "3x = 15, so x = 5."),
    hint: t("Перенеси 5 вправо и раздели на 3.", "5-ті оңға көшіріп, 3-ке бөл.", "Move the 5 and divide by 3."),
  },
  {
    id: "sta2", subject: "sat", topic: "sat-algebra", difficulty: 920,
    stem: n("A taxi charges $4 plus $2 per mile. Which expression gives the cost of m miles?"),
    options: [n("2m + 4"), n("4m + 2"), n("6m"), n("2(m + 4)")], correct: 0,
    explain: t("Фиксированные 4 доллара — свободный член, 2 доллара за милю — наклон: 2m + 4.", "Тұрақты 4 доллар — бос мүше, миліне 2 доллар — көлбеу: 2m + 4.", "The flat $4 is the constant; $2 per mile is the slope: 2m + 4."),
    hint: t("Что зависит от количества миль, а что нет?", "Мил санына не тәуелді, не тәуелді емес?", "Which part depends on the miles and which doesn't?"),
  },
  {
    id: "sta3", subject: "sat", topic: "sat-algebra", difficulty: 1040,
    stem: n("If 2x + 3y = 12 and y = 2, what is x?"),
    options: [n("3"), n("6"), n("9"), n("2")], correct: 0,
    explain: t("Подставляем y = 2: 2x + 6 = 12 → 2x = 6 → x = 3.", "y = 2-ні қоямыз: 2x + 6 = 12 → 2x = 6 → x = 3.", "Substitute y = 2: 2x + 6 = 12 → 2x = 6 → x = 3."),
    hint: t("Подстановка — самый быстрый путь, когда одна переменная известна.", "Бір айнымалы белгілі болса, қою — ең жылдам жол.", "Substitution is fastest when one variable is given."),
  },
  {
    id: "sta4", subject: "sat", topic: "sat-algebra", difficulty: 1160,
    stem: n("Line passes through (1, 3) and (3, 11). What is its slope?"),
    options: [n("4"), n("2"), n("8"), n("1/4")], correct: 0,
    explain: t("(11 − 3) / (3 − 1) = 8 / 2 = 4.", "(11 − 3) / (3 − 1) = 8 / 2 = 4.", "(11 − 3) / (3 − 1) = 8 / 2 = 4."),
    hint: t("Разность y делить на разность x.", "y айырмасын x айырмасына бөл.", "Change in y over change in x."),
  },
  {
    id: "sta5", subject: "sat", topic: "sat-algebra", difficulty: 1300,
    stem: n("For what value of k does 2x + ky = 6 have no solution with 4x + 6y = 5?"),
    options: [n("3"), n("6"), n("2"), n("12")], correct: 0,
    explain: t("Нет решений, когда коэффициенты пропорциональны: 2/4 = k/6 → k = 3, а свободные члены — нет.", "Шешімі жоқ болу үшін коэффициенттер пропорционал: 2/4 = k/6 → k = 3, ал бос мүшелер емес.", "No solution requires proportional coefficients: 2/4 = k/6 → k = 3, while the constants aren't."),
    hint: t("Параллельные прямые — одинаковый наклон, разные свободные члены.", "Параллель түзулер — көлбеуі бірдей, бос мүшелері әртүрлі.", "Parallel lines: same slope, different intercepts."),
  },
  {
    id: "sta6", subject: "sat", topic: "sat-algebra", difficulty: 1420,
    stem: n("If f(x) = x² − 4x + 3, for which values of x is f(x) = 0?"),
    options: [n("1 and 3"), n("−1 and −3"), n("2 and 3"), n("0 and 4")], correct: 0,
    explain: t("x² − 4x + 3 = (x − 1)(x − 3) → корни 1 и 3.", "x² − 4x + 3 = (x − 1)(x − 3) → түбірлері 1 мен 3.", "x² − 4x + 3 = (x − 1)(x − 3) → roots 1 and 3."),
    hint: t("Разложи на множители: два числа с суммой 4 и произведением 3.", "Көбейткіштерге жікте: қосындысы 4, көбейтіндісі 3 екі сан.", "Factor: two numbers summing to 4 and multiplying to 3."),
  },
  {
    id: "std1", subject: "sat", topic: "sat-data", difficulty: 840,
    stem: n("What is 15% of 80?"),
    options: [n("12"), n("15"), n("8"), n("20")], correct: 0,
    explain: t("0,15 × 80 = 12.", "0,15 × 80 = 12.", "0.15 × 80 = 12."),
    hint: t("10% это 8, значит 5% это 4.", "10% — 8, демек 5% — 4.", "10% is 8, so 5% is 4."),
  },
  {
    id: "std2", subject: "sat", topic: "sat-data", difficulty: 960,
    stem: n("A price increases from $50 to $60. What is the percent increase?"),
    options: [n("20%"), n("10%"), n("16.7%"), n("120%")], correct: 0,
    explain: t("Разница 10, делим на исходное 50: 10/50 = 0,2 = 20%.", "Айырма 10, бастапқы 50-ге бөлеміз: 10/50 = 0,2 = 20%.", "The difference is 10; divide by the original 50: 10/50 = 0.2 = 20%."),
    hint: t("Делим на старое значение, а не на новое.", "Жаңасына емес, ескісіне бөлеміз.", "Divide by the old value, not the new one."),
  },
  {
    id: "std3", subject: "sat", topic: "sat-data", difficulty: 1080,
    stem: n("The ratio of boys to girls is 3 : 5. If there are 40 students, how many are girls?"),
    options: [n("25"), n("15"), n("24"), n("20")], correct: 0,
    explain: t("Всего 3 + 5 = 8 частей, одна часть = 40/8 = 5. Девочек 5 частей = 25.", "Барлығы 3 + 5 = 8 бөлік, бір бөлік = 40/8 = 5. Қыздар 5 бөлік = 25.", "Total parts 3 + 5 = 8; one part = 40/8 = 5. Girls are 5 parts = 25."),
    hint: t("Сначала найди величину одной части.", "Алдымен бір бөліктің шамасын тап.", "Find the value of one part first."),
  },
  {
    id: "std4", subject: "sat", topic: "sat-data", difficulty: 1200,
    stem: n("A shirt costs $40 after a 20% discount. What was the original price?"),
    options: [n("$50"), n("$48"), n("$60"), n("$45")], correct: 0,
    explain: t("40 — это 80% от исходной цены: 40 / 0,8 = 50.", "40 — бастапқы бағаның 80%-ы: 40 / 0,8 = 50.", "$40 is 80% of the original: 40 / 0.8 = 50."),
    hint: t("Не прибавляй 20% к 40 — это типичная ловушка.", "40-қа 20% қоспа — бұл әдеттегі тұзақ.", "Don't just add 20% to 40 — that's the trap."),
  },
  {
    id: "std5", subject: "sat", topic: "sat-data", difficulty: 1320,
    stem: n("A value grows 10% then falls 10%. Compared to the start, it is now:"),
    options: [n("1% lower"), n("the same"), n("1% higher"), n("2% lower")], correct: 0,
    explain: t("1,1 × 0,9 = 0,99 → на 1% меньше исходного.", "1,1 × 0,9 = 0,99 → бастапқыдан 1% кем.", "1.1 × 0.9 = 0.99 → 1% below the start."),
    hint: t("Проценты считаются от разных баз.", "Пайыздар әртүрлі базадан есептеледі.", "The two percentages are taken from different bases."),
  },
  {
    id: "std6", subject: "sat", topic: "sat-data", difficulty: 1400,
    stem: n("The average of 5 numbers is 12. If one number is removed, the average becomes 13. What was removed?"),
    options: [n("8"), n("12"), n("13"), n("10")], correct: 0,
    explain: t("Сумма пяти чисел 60, сумма четырёх 52. Убрали 60 − 52 = 8.", "Бес санның қосындысы 60, төртеуінікі 52. Алынған сан 60 − 52 = 8.", "Five numbers sum to 60; four sum to 52. The removed number is 60 − 52 = 8."),
    hint: t("Среднее × количество = сумма.", "Орташа × саны = қосынды.", "Average × count = sum."),
  },
  {
    id: "stw1", subject: "sat", topic: "sat-writing", difficulty: 860,
    stem: n("Choose the correct option: The results were clear, ___ the team published them."),
    options: [n("so"), n("so that"), n("however"), n("despite")], correct: 0,
    explain: t("Два независимых предложения соединяются запятой с союзом so — связь следствия.", "Екі дербес сөйлем үтір мен so жалғаулығы арқылы қосылады — салдар байланысы.", "Two independent clauses join with a comma plus so — a consequence link."),
    hint: t("Вторая часть — результат первой.", "Екінші бөлік — біріншінің нәтижесі.", "The second half is the result of the first."),
  },
  {
    id: "stw2", subject: "sat", topic: "sat-writing", difficulty: 980,
    stem: n("Choose the correct punctuation: The experiment failed ___ the hypothesis was wrong."),
    options: [n("; therefore,"), n(", therefore,"), n(" therefore"), n(", therefore")], correct: 0,
    explain: t("Перед вводным therefore между двумя предложениями ставится точка с запятой.", "Екі сөйлем арасындағы therefore алдында нүктелі үтір қойылады.", "Between two independent clauses, therefore takes a semicolon before it."),
    hint: t("Запятая не может соединять два самостоятельных предложения.", "Үтір екі дербес сөйлемді қоса алмайды.", "A comma can't join two independent clauses."),
  },
  {
    id: "stw3", subject: "sat", topic: "sat-writing", difficulty: 1080,
    stem: n("The data ___ that the theory is correct."),
    options: [n("suggest"), n("suggests"), n("suggesting"), n("to suggest")], correct: 0,
    explain: t("В академическом английском data — форма множественного числа, поэтому suggest без -s.", "Академиялық ағылшын тілінде data — көпше түр, сондықтан suggest -s-сіз.", "In academic English data is plural, so the verb takes no -s."),
    hint: t("Это слово латинского происхождения с необычным числом.", "Бұл латын тектес, саны ерекше сөз.", "It's a Latin-origin word with an unusual number."),
  },
  {
    id: "stw4", subject: "sat", topic: "sat-writing", difficulty: 1200,
    stem: n("Choose the transition: Sales fell sharply. ___, the company still made a profit."),
    options: [n("Nevertheless"), n("Therefore"), n("Similarly"), n("For instance")], correct: 0,
    explain: t("Между падением продаж и прибылью — противопоставление, значит Nevertheless.", "Сатылымның құлдырауы мен пайда арасында қарсылық бар, демек Nevertheless.", "Falling sales versus profit is a contrast, so Nevertheless."),
    hint: t("Второе предложение противоречит ожиданию от первого.", "Екінші сөйлем біріншіден күтілгенге қайшы.", "The second sentence defies what the first implies."),
  },
  {
    id: "stw5", subject: "sat", topic: "sat-writing", difficulty: 1300,
    stem: n("Choose the correct form: Each of the students ___ a laptop."),
    options: [n("has"), n("have"), n("having"), n("are having")], correct: 0,
    explain: t("Подлежащее each — единственного числа, несмотря на «of the students».", "Бастауыш each — жекеше, «of the students» тіркесіне қарамастан.", "The subject each is singular, despite \"of the students\"."),
    hint: t("Отбрось предложную группу и посмотри на настоящее подлежащее.", "Көмекші сөз тіркесін алып тастап, нақты бастауышқа қара.", "Strip the prepositional phrase and look at the real subject."),
  },
  {
    id: "stw6", subject: "sat", topic: "sat-writing", difficulty: 1420,
    stem: n("Choose the best option: Having finished the report, ___"),
    options: [n("she submitted it immediately."), n("it was submitted immediately."), n("the deadline had passed."), n("submission was immediate.")], correct: 0,
    explain: t("Причастный оборот должен относиться к подлежащему главного предложения — отчёт закончила она.", "Есімше орамы басты сөйлемнің бастауышына қатысты болуы керек — есепті ол аяқтады.", "The participial phrase must attach to the main subject — she finished the report."),
    hint: t("Кто именно закончил отчёт? Этот же человек должен быть подлежащим.", "Есепті кім аяқтады? Сол адам бастауыш болуы керек.", "Who finished the report? That person must be the subject."),
  },
];
