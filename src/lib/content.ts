import type { L, Lesson, Question, Topic } from "./types";

const t = (ru: string, kk: string, en: string): L => ({ ru, kk, en });
const n = (s: string): L => ({ ru: s, kk: s, en: s });

export const TOPICS: Topic[] = [
  {
    id: "linear",
    title: t("Линейные уравнения", "Сызықтық теңдеулер", "Linear equations"),
    blurb: t(
      "База всей алгебры: перенос слагаемых, раскрытие скобок, уравнения с дробями.",
      "Бүкіл алгебраның негізі: қосылғыштарды көшіру, жақшаларды ашу, бөлшекті теңдеулер.",
      "The base of all algebra: moving terms, expanding brackets, equations with fractions."
    ),
    weight: 0.3,
    grades: [7, 9],
  },
  {
    id: "quadratic",
    title: t("Квадратные уравнения", "Квадрат теңдеулер", "Quadratic equations"),
    blurb: t(
      "Дискриминант, теорема Виета, разложение на множители — ядро ЕНТ по математике.",
      "Дискриминант, Виет теоремасы, көбейткіштерге жіктеу — ҰБТ математикасының өзегі.",
      "Discriminant, Vieta's theorem, factoring — the core of exam math."
    ),
    weight: 0.4,
    grades: [8, 11],
  },
  {
    id: "functions",
    title: t("Функции и графики", "Функциялар және графиктер", "Functions and graphs"),
    blurb: t(
      "Читать график как текст: наклон прямой, вершина параболы, нули функции.",
      "Графикті мәтіндей оқу: түзудің көлбеуі, параболаның төбесі, функция нөлдері.",
      "Read a graph like text: slope of a line, vertex of a parabola, zeros of a function."
    ),
    weight: 0.3,
    grades: [7, 11],
  },
];

export const LESSONS: Lesson[] = [
  {
    topic: "linear",
    intro: t(
      "Линейное уравнение — это весы. Слева и справа — одинаковый вес. Всё, что делаешь с одной стороной, делаешь и с другой.",
      "Сызықтық теңдеу — таразы. Сол мен оң жақта — бірдей салмақ. Бір жағына не істесең, екінші жағына да соны істейсің.",
      "A linear equation is a scale. Both sides weigh the same. Whatever you do to one side, you do to the other."
    ),
    sections: [
      {
        heading: t("Перенос слагаемых", "Қосылғыштарды көшіру", "Moving terms"),
        body: t(
          "Слагаемое можно перенести через знак «=», поменяв его знак: из 3x + 7 = 22 получаем 3x = 22 − 7.",
          "Қосылғышты «=» белгісі арқылы таңбасын өзгертіп көшіруге болады: 3x + 7 = 22 теңдеуінен 3x = 22 − 7 шығады.",
          "A term can cross the «=» sign if it flips its sign: 3x + 7 = 22 becomes 3x = 22 − 7."
        ),
        formula: "ax + b = c  →  ax = c − b  →  x = (c − b) / a",
      },
      {
        heading: t("Скобки", "Жақшалар", "Brackets"),
        body: t(
          "Число перед скобкой умножается на каждое слагаемое внутри: 4(x − 2) = 4x − 8. Минус перед скобкой меняет все знаки внутри.",
          "Жақша алдындағы сан ішіндегі әр қосылғышқа көбейтіледі: 4(x − 2) = 4x − 8. Жақша алдындағы минус ішіндегі барлық таңбаны өзгертеді.",
          "The number before a bracket multiplies every term inside: 4(x − 2) = 4x − 8. A minus before a bracket flips every sign inside."
        ),
      },
      {
        heading: t("Дроби", "Бөлшектер", "Fractions"),
        body: t(
          "Если в уравнении есть дроби — умножь обе части на общий знаменатель, и дроби исчезнут.",
          "Теңдеуде бөлшек болса — екі жағын ортақ бөлімге көбейт, бөлшектер жойылады.",
          "If the equation has fractions, multiply both sides by the common denominator and they vanish."
        ),
      },
    ],
    example: {
      problem: t("Реши: 4(x − 2) = 3x + 1", "Шеш: 4(x − 2) = 3x + 1", "Solve: 4(x − 2) = 3x + 1"),
      steps: [
        t("Раскрываем скобки: 4x − 8 = 3x + 1", "Жақшаны ашамыз: 4x − 8 = 3x + 1", "Expand: 4x − 8 = 3x + 1"),
        t("Переносим 3x влево, −8 вправо: 4x − 3x = 1 + 8", "3x-ті солға, −8-ді оңға көшіреміз: 4x − 3x = 1 + 8", "Move 3x left, −8 right: 4x − 3x = 1 + 8"),
        t("Считаем: x = 9. Проверка: 4·7 = 28 = 27 + 1 ✓", "Есептейміз: x = 9. Тексеру: 4·7 = 28 = 27 + 1 ✓", "Compute: x = 9. Check: 4·7 = 28 = 27 + 1 ✓"),
      ],
    },
  },
  {
    topic: "quadratic",
    intro: t(
      "Квадратное уравнение ax² + bx + c = 0 решается за два хода: посчитай дискриминант, подставь в формулу корней.",
      "ax² + bx + c = 0 квадрат теңдеуі екі қадаммен шешіледі: дискриминантты есепте, түбір формуласына қой.",
      "A quadratic ax² + bx + c = 0 takes two moves: compute the discriminant, plug into the root formula."
    ),
    sections: [
      {
        heading: t("Дискриминант", "Дискриминант", "Discriminant"),
        body: t(
          "D = b² − 4ac. Если D > 0 — два корня, D = 0 — один, D < 0 — корней нет.",
          "D = b² − 4ac. Егер D > 0 — екі түбір, D = 0 — біреу, D < 0 — түбір жоқ.",
          "D = b² − 4ac. If D > 0 — two roots, D = 0 — one, D < 0 — none."
        ),
        formula: "D = b² − 4ac,   x = (−b ± √D) / 2a",
      },
      {
        heading: t("Теорема Виета", "Виет теоремасы", "Vieta's theorem"),
        body: t(
          "Для x² + px + q = 0: сумма корней равна −p, произведение равно q. Часто корни видно без дискриминанта.",
          "x² + px + q = 0 үшін: түбірлер қосындысы −p, көбейтіндісі q. Түбірлер көбіне дискриминантсыз-ақ көрінеді.",
          "For x² + px + q = 0: the roots sum to −p and multiply to q. Often you can just see them."
        ),
        formula: "x₁ + x₂ = −p,   x₁ · x₂ = q",
      },
      {
        heading: t("Неполные уравнения", "Толымсыз теңдеулер", "Incomplete quadratics"),
        body: t(
          "Нет c? Выноси x за скобку: 3x² − 12x = 0 → x(3x − 12) = 0. Нет b? Переноси и извлекай корень: x² = 9.",
          "c жоқ па? x-ті жақша сыртына шығар: 3x² − 12x = 0 → x(3x − 12) = 0. b жоқ па? Көшіріп, түбір тап: x² = 9.",
          "No c? Factor x out: 3x² − 12x = 0 → x(3x − 12) = 0. No b? Move and take the root: x² = 9."
        ),
      },
    ],
    example: {
      problem: t("Реши: x² − 5x + 6 = 0", "Шеш: x² − 5x + 6 = 0", "Solve: x² − 5x + 6 = 0"),
      steps: [
        t("По Виету: ищем два числа с суммой 5 и произведением 6", "Виет бойынша: қосындысы 5, көбейтіндісі 6 болатын екі сан іздейміз", "By Vieta: two numbers that sum to 5 and multiply to 6"),
        t("Это 2 и 3: 2 + 3 = 5, 2 · 3 = 6", "Бұл 2 мен 3: 2 + 3 = 5, 2 · 3 = 6", "They are 2 and 3: 2 + 3 = 5, 2 · 3 = 6"),
        t("Ответ: x₁ = 2, x₂ = 3. Проверь через дискриминант: D = 25 − 24 = 1 ✓", "Жауап: x₁ = 2, x₂ = 3. Дискриминантпен тексер: D = 25 − 24 = 1 ✓", "Answer: x₁ = 2, x₂ = 3. Check with D = 25 − 24 = 1 ✓"),
      ],
    },
  },
  {
    topic: "functions",
    intro: t(
      "Функция — это правило: взял x, получил y. График — все такие пары точек сразу. Уметь читать график быстрее, чем считать.",
      "Функция — ереже: x алдың, y алдың. График — осындай барлық нүкте жұбы бірден. Графикті оқи білу есептегеннен жылдам.",
      "A function is a rule: take x, get y. The graph is all such point pairs at once. Reading it beats computing."
    ),
    sections: [
      {
        heading: t("Прямая y = kx + b", "y = kx + b түзуі", "The line y = kx + b"),
        body: t(
          "k — наклон: k > 0 — растёт, k < 0 — убывает. b — где прямая пересекает ось Oy.",
          "k — көлбеу: k > 0 — өседі, k < 0 — кемиді. b — түзудің Oy осін қиатын жері.",
          "k is the slope: k > 0 rises, k < 0 falls. b is where the line crosses the y-axis."
        ),
        formula: "y = kx + b",
      },
      {
        heading: t("Парабола y = ax² + bx + c", "y = ax² + bx + c параболасы", "The parabola y = ax² + bx + c"),
        body: t(
          "Вершина — в точке x₀ = −b / 2a. Если a > 0, ветви вверх и вершина — минимум.",
          "Төбесі — x₀ = −b / 2a нүктесінде. Егер a > 0 болса, тармақтары жоғары, төбесі — минимум.",
          "The vertex sits at x₀ = −b / 2a. If a > 0 the branches go up and the vertex is a minimum."
        ),
        formula: "x₀ = −b / 2a,   y₀ = f(x₀)",
      },
      {
        heading: t("Нули функции", "Функция нөлдері", "Zeros of a function"),
        body: t(
          "Нули — это x, при которых y = 0: точки, где график пересекает ось Ox. Найди их — и график почти построен.",
          "Нөлдер — y = 0 болатын x мәндері: график Ox осін қиатын нүктелер. Оларды тап — график дерлік дайын.",
          "Zeros are the x values where y = 0: where the graph crosses the x-axis. Find them and the sketch is nearly done."
        ),
      },
    ],
    example: {
      problem: t("Найди вершину параболы y = x² − 4x + 3", "y = x² − 4x + 3 параболасының төбесін тап", "Find the vertex of y = x² − 4x + 3"),
      steps: [
        t("x₀ = −b / 2a = 4 / 2 = 2", "x₀ = −b / 2a = 4 / 2 = 2", "x₀ = −b / 2a = 4 / 2 = 2"),
        t("y₀ = f(2) = 4 − 8 + 3 = −1", "y₀ = f(2) = 4 − 8 + 3 = −1", "y₀ = f(2) = 4 − 8 + 3 = −1"),
        t("Вершина: (2; −1). Ветви вверх, значит это минимум", "Төбесі: (2; −1). Тармақтары жоғары, демек бұл — минимум", "Vertex: (2; −1). Branches go up, so it's a minimum"),
      ],
    },
  },
];

export const QUESTIONS: Question[] = [
  // ---------- linear ----------
  {
    id: "lin1", topic: "linear", difficulty: 750,
    stem: t("Реши уравнение: 3x + 7 = 22", "Теңдеуді шеш: 3x + 7 = 22", "Solve: 3x + 7 = 22"),
    options: [n("x = 5"), n("x = 7"), n("x = 3"), n("x = 15")], correct: 0,
    explain: t("Переносим 7 вправо: 3x = 15, значит x = 5.", "7-ні оңға көшіреміз: 3x = 15, демек x = 5.", "Move 7 right: 3x = 15, so x = 5."),
    hint: t("Сначала убери +7 с левой стороны.", "Алдымен сол жақтан +7-ні кетір.", "First remove the +7 from the left."),
  },
  {
    id: "lin2", topic: "linear", difficulty: 720,
    stem: t("Реши уравнение: −2x = 18", "Теңдеуді шеш: −2x = 18", "Solve: −2x = 18"),
    options: [n("x = 9"), n("x = −9"), n("x = 36"), n("x = −36")], correct: 1,
    explain: t("Делим обе части на −2: x = 18 / (−2) = −9.", "Екі жағын −2-ге бөлеміз: x = 18 / (−2) = −9.", "Divide both sides by −2: x = 18 / (−2) = −9."),
    hint: t("Раздели обе части на коэффициент при x — вместе со знаком.", "Екі жағын x-тің коэффициентіне бөл — таңбасымен бірге.", "Divide both sides by x's coefficient — sign included."),
  },
  {
    id: "lin3", topic: "linear", difficulty: 800,
    stem: t("Реши уравнение: x/3 + 2 = 7", "Теңдеуді шеш: x/3 + 2 = 7", "Solve: x/3 + 2 = 7"),
    options: [n("x = 15"), n("x = 3"), n("x = 27"), n("x = 5")], correct: 0,
    explain: t("x/3 = 5, умножаем на 3: x = 15.", "x/3 = 5, 3-ке көбейтеміз: x = 15.", "x/3 = 5, multiply by 3: x = 15."),
    hint: t("Сначала перенеси 2, потом умножь на 3.", "Алдымен 2-ні көшір, сосын 3-ке көбейт.", "Move the 2 first, then multiply by 3."),
  },
  {
    id: "lin4", topic: "linear", difficulty: 850,
    stem: t("Реши уравнение: 5x − 4 = 2x + 11", "Теңдеуді шеш: 5x − 4 = 2x + 11", "Solve: 5x − 4 = 2x + 11"),
    options: [n("x = 5"), n("x = 3"), n("x = 7"), n("x = 15/7")], correct: 0,
    explain: t("5x − 2x = 11 + 4 → 3x = 15 → x = 5.", "5x − 2x = 11 + 4 → 3x = 15 → x = 5.", "5x − 2x = 11 + 4 → 3x = 15 → x = 5."),
    hint: t("Собери x слева, числа справа.", "x-терді солға, сандарды оңға жина.", "Gather x's on the left, numbers on the right."),
  },
  {
    id: "lin5", topic: "linear", difficulty: 900,
    stem: t("Реши уравнение: 4(x − 2) = 3x + 1", "Теңдеуді шеш: 4(x − 2) = 3x + 1", "Solve: 4(x − 2) = 3x + 1"),
    options: [n("x = 9"), n("x = 7"), n("x = −7"), n("x = 1")], correct: 0,
    explain: t("4x − 8 = 3x + 1 → x = 9.", "4x − 8 = 3x + 1 → x = 9.", "4x − 8 = 3x + 1 → x = 9."),
    hint: t("Раскрой скобки: 4 умножается на оба слагаемых.", "Жақшаны аш: 4 екі қосылғышқа да көбейтіледі.", "Expand: the 4 multiplies both terms."),
  },
  {
    id: "lin6", topic: "linear", difficulty: 950,
    stem: t("Реши уравнение: 2(3x − 1) − 5x = 4", "Теңдеуді шеш: 2(3x − 1) − 5x = 4", "Solve: 2(3x − 1) − 5x = 4"),
    options: [n("x = 6"), n("x = 2"), n("x = −6"), n("x = 4")], correct: 0,
    explain: t("6x − 2 − 5x = 4 → x − 2 = 4 → x = 6.", "6x − 2 − 5x = 4 → x − 2 = 4 → x = 6.", "6x − 2 − 5x = 4 → x − 2 = 4 → x = 6."),
    hint: t("Сначала раскрой скобки, потом приведи подобные.", "Алдымен жақшаны аш, сосын ұқсастарын біріктір.", "Expand first, then combine like terms."),
  },
  {
    id: "lin7", topic: "linear", difficulty: 1000,
    stem: t("При каком a уравнение ax = 12 имеет корень x = 4?", "Қандай a мәнінде ax = 12 теңдеуінің түбірі x = 4 болады?", "For which a does ax = 12 have the root x = 4?"),
    options: [n("a = 3"), n("a = 4"), n("a = 48"), n("a = 1/3")], correct: 0,
    explain: t("Подставь x = 4: 4a = 12, значит a = 3.", "x = 4-ті қой: 4a = 12, демек a = 3.", "Substitute x = 4: 4a = 12, so a = 3."),
    hint: t("Корень — это значение x, которое превращает уравнение в верное равенство.", "Түбір — теңдеуді тура теңдікке айналдыратын x мәні.", "A root makes the equation a true equality — plug it in."),
  },
  {
    id: "lin8", topic: "linear", difficulty: 1050,
    stem: t("Реши уравнение: 0,5x + 1,5 = 3x − 6", "Теңдеуді шеш: 0,5x + 1,5 = 3x − 6", "Solve: 0.5x + 1.5 = 3x − 6"),
    options: [n("x = 3"), n("x = −3"), n("x = 2,5"), n("x = 7,5")], correct: 0,
    explain: t("1,5 + 6 = 3x − 0,5x → 7,5 = 2,5x → x = 3.", "1,5 + 6 = 3x − 0,5x → 7,5 = 2,5x → x = 3.", "1.5 + 6 = 3x − 0.5x → 7.5 = 2.5x → x = 3."),
    hint: t("Десятичные дроби работают как обычные числа. Собери x справа.", "Ондық бөлшектер кәдімгі сандай жұмыс істейді. x-терді оңға жина.", "Decimals behave like normal numbers. Gather x on the right."),
  },
  {
    id: "lin9", topic: "linear", difficulty: 1100,
    stem: t("Реши уравнение: (x + 3)/2 = (2x − 1)/3", "Теңдеуді шеш: (x + 3)/2 = (2x − 1)/3", "Solve: (x + 3)/2 = (2x − 1)/3"),
    options: [n("x = 11"), n("x = 5"), n("x = 7"), n("x = −11")], correct: 0,
    explain: t("Крест-накрест: 3(x + 3) = 2(2x − 1) → 3x + 9 = 4x − 2 → x = 11.", "Айқастыра көбейтеміз: 3(x + 3) = 2(2x − 1) → 3x + 9 = 4x − 2 → x = 11.", "Cross-multiply: 3(x + 3) = 2(2x − 1) → 3x + 9 = 4x − 2 → x = 11."),
    hint: t("Умножь обе части на 6 — общий знаменатель.", "Екі жағын 6-ға көбейт — ортақ бөлім.", "Multiply both sides by 6 — the common denominator."),
  },
  {
    id: "lin10", topic: "linear", difficulty: 1200,
    stem: t("Сумма двух последовательных натуральных чисел равна 37. Найди меньшее.", "Екі тізбектес натурал санның қосындысы 37. Кішісін тап.", "Two consecutive natural numbers sum to 37. Find the smaller one."),
    options: [n("18"), n("17"), n("19"), n("16")], correct: 0,
    explain: t("x + (x + 1) = 37 → 2x = 36 → x = 18. Числа: 18 и 19.", "x + (x + 1) = 37 → 2x = 36 → x = 18. Сандар: 18 бен 19.", "x + (x + 1) = 37 → 2x = 36 → x = 18. The numbers: 18 and 19."),
    hint: t("Обозначь меньшее число за x, тогда следующее — x + 1.", "Кіші санды x деп белгіле, келесісі — x + 1.", "Call the smaller number x; the next one is x + 1."),
  },
  // ---------- quadratic ----------
  {
    id: "quad1", topic: "quadratic", difficulty: 900,
    stem: t("Реши уравнение: x² − 9 = 0", "Теңдеуді шеш: x² − 9 = 0", "Solve: x² − 9 = 0"),
    options: [n("x = ±3"), n("x = 3"), n("x = ±9"), n("x = 81")], correct: 0,
    explain: t("x² = 9, корень из 9 — это 3 и −3.", "x² = 9, 9-дың түбірі — 3 пен −3.", "x² = 9; the square roots of 9 are 3 and −3."),
    hint: t("Не забудь: у x² = 9 два решения.", "Ұмытпа: x² = 9 теңдеуінің екі шешімі бар.", "Remember: x² = 9 has two solutions."),
  },
  {
    id: "quad2", topic: "quadratic", difficulty: 1000,
    stem: t("Найди корни: x² − 5x + 6 = 0", "Түбірлерін тап: x² − 5x + 6 = 0", "Find the roots: x² − 5x + 6 = 0"),
    options: [n("2; 3"), n("−2; −3"), n("1; 6"), n("−1; 6")], correct: 0,
    explain: t("По Виету: сумма 5, произведение 6 → корни 2 и 3.", "Виет бойынша: қосындысы 5, көбейтіндісі 6 → түбірлері 2 мен 3.", "By Vieta: sum 5, product 6 → roots 2 and 3."),
    hint: t("Какие два числа дают в сумме 5, а в произведении 6?", "Қандай екі санның қосындысы 5, көбейтіндісі 6?", "Which two numbers sum to 5 and multiply to 6?"),
  },
  {
    id: "quad3", topic: "quadratic", difficulty: 1050,
    stem: t("Вычисли дискриминант: 2x² − 3x + 1 = 0", "Дискриминантты есепте: 2x² − 3x + 1 = 0", "Compute the discriminant: 2x² − 3x + 1 = 0"),
    options: [n("D = 1"), n("D = 17"), n("D = −1"), n("D = 9")], correct: 0,
    explain: t("D = b² − 4ac = 9 − 4·2·1 = 1.", "D = b² − 4ac = 9 − 4·2·1 = 1.", "D = b² − 4ac = 9 − 4·2·1 = 1."),
    hint: t("D = b² − 4ac. Здесь a = 2, b = −3, c = 1.", "D = b² − 4ac. Мұнда a = 2, b = −3, c = 1.", "D = b² − 4ac with a = 2, b = −3, c = 1."),
  },
  {
    id: "quad4", topic: "quadratic", difficulty: 1100,
    stem: t("Сколько корней у уравнения x² + 4x + 4 = 0?", "x² + 4x + 4 = 0 теңдеуінің неше түбірі бар?", "How many roots does x² + 4x + 4 = 0 have?"),
    options: [t("Один", "Біреу", "One"), t("Два", "Екеу", "Two"), t("Ни одного", "Жоқ", "None"), t("Бесконечно много", "Шексіз көп", "Infinitely many")], correct: 0,
    explain: t("D = 16 − 16 = 0 → ровно один корень: x = −2.", "D = 16 − 16 = 0 → дәл бір түбір: x = −2.", "D = 16 − 16 = 0 → exactly one root: x = −2."),
    hint: t("Посчитай дискриминант и посмотри на его знак.", "Дискриминантты есептеп, таңбасына қара.", "Compute D and look at its sign."),
  },
  {
    id: "quad5", topic: "quadratic", difficulty: 1050,
    stem: t("Реши уравнение: 3x² − 12x = 0", "Теңдеуді шеш: 3x² − 12x = 0", "Solve: 3x² − 12x = 0"),
    options: [n("x = 0; x = 4"), n("x = 4"), n("x = 0; x = −4"), n("x = ±2")], correct: 0,
    explain: t("Выносим: 3x(x − 4) = 0 → x = 0 или x = 4.", "Шығарамыз: 3x(x − 4) = 0 → x = 0 немесе x = 4.", "Factor: 3x(x − 4) = 0 → x = 0 or x = 4."),
    hint: t("Вынеси общий множитель 3x за скобку.", "Ортақ көбейткіш 3x-ті жақша сыртына шығар.", "Factor out the common 3x."),
  },
  {
    id: "quad6", topic: "quadratic", difficulty: 1000,
    stem: t("Чему равна сумма корней уравнения x² − 7x + 10 = 0?", "x² − 7x + 10 = 0 теңдеуі түбірлерінің қосындысы неге тең?", "What is the sum of the roots of x² − 7x + 10 = 0?"),
    options: [n("7"), n("−7"), n("10"), n("3")], correct: 0,
    explain: t("По Виету сумма корней равна −p = 7 (корни 2 и 5).", "Виет бойынша түбірлер қосындысы −p = 7 (түбірлері 2 мен 5).", "By Vieta the sum is −p = 7 (the roots are 2 and 5)."),
    hint: t("Виета: x₁ + x₂ = −p. Считать сами корни не обязательно.", "Виет: x₁ + x₂ = −p. Түбірлердің өзін табу міндетті емес.", "Vieta: x₁ + x₂ = −p. No need to find the roots."),
  },
  {
    id: "quad7", topic: "quadratic", difficulty: 1150,
    stem: t("Найди корни: x² − 2x − 15 = 0", "Түбірлерін тап: x² − 2x − 15 = 0", "Find the roots: x² − 2x − 15 = 0"),
    options: [n("5; −3"), n("−5; 3"), n("15; −1"), n("5; 3")], correct: 0,
    explain: t("Сумма 2, произведение −15 → корни 5 и −3.", "Қосындысы 2, көбейтіндісі −15 → түбірлері 5 пен −3.", "Sum 2, product −15 → roots 5 and −3."),
    hint: t("Произведение отрицательное — корни разных знаков.", "Көбейтінді теріс — түбірлер таңбасы әртүрлі.", "Negative product — the roots have opposite signs."),
  },
  {
    id: "quad8", topic: "quadratic", difficulty: 1200,
    stem: t("Найди корни: x² + x − 12 = 0", "Түбірлерін тап: x² + x − 12 = 0", "Find the roots: x² + x − 12 = 0"),
    options: [n("3; −4"), n("−3; 4"), n("2; −6"), n("12; −1")], correct: 0,
    explain: t("D = 1 + 48 = 49 → x = (−1 ± 7)/2 → 3 и −4.", "D = 1 + 48 = 49 → x = (−1 ± 7)/2 → 3 пен −4.", "D = 1 + 48 = 49 → x = (−1 ± 7)/2 → 3 and −4."),
    hint: t("√49 = 7. Дальше формула корней.", "√49 = 7. Әрі қарай түбір формуласы.", "√49 = 7. Then the root formula."),
  },
  {
    id: "quad9", topic: "quadratic", difficulty: 1350,
    stem: t("При каком c уравнение x² − 6x + c = 0 имеет ровно один корень?", "Қандай c мәнінде x² − 6x + c = 0 теңдеуінің дәл бір түбірі болады?", "For which c does x² − 6x + c = 0 have exactly one root?"),
    options: [n("c = 9"), n("c = 36"), n("c = 6"), n("c = −9")], correct: 0,
    explain: t("Один корень при D = 0: 36 − 4c = 0 → c = 9.", "Бір түбір D = 0 болғанда: 36 − 4c = 0 → c = 9.", "One root when D = 0: 36 − 4c = 0 → c = 9."),
    hint: t("Ровно один корень — это условие на дискриминант.", "Дәл бір түбір — дискриминантқа қойылатын шарт.", "Exactly one root is a condition on the discriminant."),
  },
  {
    id: "quad10", topic: "quadratic", difficulty: 1400,
    stem: t("Найди корни: 2x² + 5x − 3 = 0", "Түбірлерін тап: 2x² + 5x − 3 = 0", "Find the roots: 2x² + 5x − 3 = 0"),
    options: [n("1/2; −3"), n("−1/2; 3"), n("3/2; −1"), n("1; −3/2")], correct: 0,
    explain: t("D = 25 + 24 = 49 → x = (−5 ± 7)/4 → x₁ = 1/2, x₂ = −3.", "D = 25 + 24 = 49 → x = (−5 ± 7)/4 → x₁ = 1/2, x₂ = −3.", "D = 25 + 24 = 49 → x = (−5 ± 7)/4 → x₁ = 1/2, x₂ = −3."),
    hint: t("Не забудь про 2a в знаменателе: здесь 2a = 4.", "Бөлімдегі 2a-ны ұмытпа: мұнда 2a = 4.", "Don't forget 2a in the denominator: here 2a = 4."),
  },
  // ---------- functions ----------
  {
    id: "fn1", topic: "functions", difficulty: 900,
    stem: t("Дана функция y = 2x − 3. Найди y при x = 4.", "y = 2x − 3 функциясы берілген. x = 4 болғанда y-ті тап.", "Given y = 2x − 3, find y at x = 4."),
    options: [n("5"), n("11"), n("−5"), n("8")], correct: 0,
    explain: t("y = 2·4 − 3 = 8 − 3 = 5.", "y = 2·4 − 3 = 8 − 3 = 5.", "y = 2·4 − 3 = 8 − 3 = 5."),
    hint: t("Просто подставь 4 вместо x.", "x орнына 4-ті қой.", "Just substitute 4 for x."),
  },
  {
    id: "fn2", topic: "functions", difficulty: 950,
    stem: t("Каков угловой коэффициент прямой y = −3x + 2?", "y = −3x + 2 түзуінің көлбеу коэффициенті қандай?", "What is the slope of y = −3x + 2?"),
    options: [n("−3"), n("2"), n("3"), n("−2")], correct: 0,
    explain: t("В y = kx + b угловой коэффициент — это k, здесь −3.", "y = kx + b теңдеуінде көлбеу коэффициенті — k, мұнда −3.", "In y = kx + b the slope is k; here it's −3."),
    hint: t("Коэффициент при x.", "x-тің алдындағы коэффициент.", "The coefficient of x."),
  },
  {
    id: "fn3", topic: "functions", difficulty: 950,
    stem: t("f(x) = x² + 1. Найди f(−2).", "f(x) = x² + 1. f(−2)-ні тап.", "f(x) = x² + 1. Find f(−2)."),
    options: [n("5"), n("−3"), n("3"), n("−5")], correct: 0,
    explain: t("f(−2) = (−2)² + 1 = 4 + 1 = 5.", "f(−2) = (−2)² + 1 = 4 + 1 = 5.", "f(−2) = (−2)² + 1 = 4 + 1 = 5."),
    hint: t("Квадрат отрицательного числа положителен.", "Теріс санның квадраты — оң сан.", "The square of a negative number is positive."),
  },
  {
    id: "fn4", topic: "functions", difficulty: 1050,
    stem: t("График y = kx проходит через точку (2; 8). Найди k.", "y = kx графигі (2; 8) нүктесі арқылы өтеді. k-ні тап.", "The graph of y = kx passes through (2; 8). Find k."),
    options: [n("k = 4"), n("k = 16"), n("k = 2"), n("k = 6")], correct: 0,
    explain: t("8 = k·2 → k = 4.", "8 = k·2 → k = 4.", "8 = k·2 → k = 4."),
    hint: t("Подставь координаты точки в уравнение.", "Нүктенің координаттарын теңдеуге қой.", "Substitute the point's coordinates into the equation."),
  },
  {
    id: "fn5", topic: "functions", difficulty: 1100,
    stem: t("В какой точке график y = 2x − 4 пересекает ось Ox?", "y = 2x − 4 графигі Ox осін қай нүктеде қияды?", "Where does y = 2x − 4 cross the x-axis?"),
    options: [n("(2; 0)"), n("(0; −4)"), n("(−2; 0)"), n("(0; 2)")], correct: 0,
    explain: t("На оси Ox y = 0: 2x − 4 = 0 → x = 2. Точка (2; 0).", "Ox осінде y = 0: 2x − 4 = 0 → x = 2. Нүкте: (2; 0).", "On the x-axis y = 0: 2x − 4 = 0 → x = 2. The point is (2; 0)."),
    hint: t("На оси Ox значение y всегда ноль.", "Ox осінде y мәні әрқашан нөл.", "On the x-axis, y is always zero."),
  },
  {
    id: "fn6", topic: "functions", difficulty: 1000,
    stem: t("Функция y = 5 − x. Она возрастает или убывает?", "y = 5 − x функциясы. Ол өседі ме, кемиді ме?", "The function y = 5 − x: increasing or decreasing?"),
    options: [t("Убывает", "Кемиді", "Decreasing"), t("Возрастает", "Өседі", "Increasing"), t("Постоянна", "Тұрақты", "Constant"), t("Зависит от x", "x-ке байланысты", "Depends on x")], correct: 0,
    explain: t("y = −x + 5, коэффициент k = −1 < 0 → функция убывает.", "y = −x + 5, коэффициент k = −1 < 0 → функция кемиді.", "y = −x + 5 has k = −1 < 0 → decreasing."),
    hint: t("Перепиши как y = −x + 5 и посмотри на знак k.", "y = −x + 5 түрінде жазып, k таңбасына қара.", "Rewrite as y = −x + 5 and check k's sign."),
  },
  {
    id: "fn7", topic: "functions", difficulty: 1100,
    stem: t("Какова область значений функции y = x²?", "y = x² функциясының мәндер жиыны қандай?", "What is the range of y = x²?"),
    options: [n("y ≥ 0"), n("y > 0"), t("Все числа", "Барлық сандар", "All numbers"), n("y ≤ 0")], correct: 0,
    explain: t("Квадрат не бывает отрицательным, а ноль достигается при x = 0: y ≥ 0.", "Квадрат теріс болмайды, ал нөл x = 0 кезінде қабылданады: y ≥ 0.", "A square is never negative, and zero is reached at x = 0: y ≥ 0."),
    hint: t("Может ли x² быть отрицательным? А нулём?", "x² теріс бола ала ма? Ал нөл ше?", "Can x² be negative? Can it be zero?"),
  },
  {
    id: "fn8", topic: "functions", difficulty: 1150,
    stem: t("Найди нули функции y = x² − 1.", "y = x² − 1 функциясының нөлдерін тап.", "Find the zeros of y = x² − 1."),
    options: [n("x = ±1"), n("x = 1"), n("x = 0"), n("x = ±2")], correct: 0,
    explain: t("x² − 1 = 0 → x² = 1 → x = 1 или x = −1.", "x² − 1 = 0 → x² = 1 → x = 1 немесе x = −1.", "x² − 1 = 0 → x² = 1 → x = 1 or x = −1."),
    hint: t("Нули — это где y = 0.", "Нөлдер — y = 0 болатын жерлер.", "Zeros are where y = 0."),
  },
  {
    id: "fn9", topic: "functions", difficulty: 1300,
    stem: t("Найди вершину параболы y = x² − 4x + 3.", "y = x² − 4x + 3 параболасының төбесін тап.", "Find the vertex of y = x² − 4x + 3."),
    options: [n("(2; −1)"), n("(−2; 15)"), n("(2; 1)"), n("(4; 3)")], correct: 0,
    explain: t("x₀ = −b/2a = 4/2 = 2; y₀ = 4 − 8 + 3 = −1.", "x₀ = −b/2a = 4/2 = 2; y₀ = 4 − 8 + 3 = −1.", "x₀ = −b/2a = 4/2 = 2; y₀ = 4 − 8 + 3 = −1."),
    hint: t("x вершины: −b / 2a.", "Төбенің x-і: −b / 2a.", "Vertex x: −b / 2a."),
  },
  {
    id: "fn10", topic: "functions", difficulty: 1250,
    stem: t("Прямая y = kx + b проходит через (0; 3) и (1; 5). Найди k и b.", "y = kx + b түзуі (0; 3) және (1; 5) арқылы өтеді. k мен b-ні тап.", "The line y = kx + b passes through (0; 3) and (1; 5). Find k and b."),
    options: [n("k = 2, b = 3"), n("k = 3, b = 2"), n("k = 5, b = 3"), n("k = 2, b = −3")], correct: 0,
    explain: t("Из (0; 3): b = 3. Из (1; 5): k + 3 = 5 → k = 2.", "(0; 3)-тен: b = 3. (1; 5)-тен: k + 3 = 5 → k = 2.", "From (0; 3): b = 3. From (1; 5): k + 3 = 5 → k = 2."),
    hint: t("Точка (0; b) — пересечение с осью Oy.", "(0; b) нүктесі — Oy осімен қиылысу.", "The point (0; b) is the y-intercept."),
  },
];

export const questionsByTopic = (topicId: string) => QUESTIONS.filter((q) => q.topic === topicId);
export const topicById = (id: string) => TOPICS.find((tp) => tp.id === id);
export const lessonByTopic = (id: string) => LESSONS.find((l) => l.topic === id);
