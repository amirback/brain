import type { Lesson } from "../types";
import { n, t } from "./util";

/**
 * Deep lessons for the SAT and IELTS tracks.
 *
 * These teach the exam rather than the subject: a student preparing for SAT
 * Reading & Writing does not need more grammar, they need to know that the section
 * tests a closed list of rules and which one each question is asking about. Every
 * worked problem below is shaped like an item from the trainer, so reading the
 * lesson and then opening the practice set feel like the same activity.
 */
export const EXAM_LESSONS: Record<string, Partial<Lesson>> = {
  /* ================= SAT Math: algebra ================= */
  "sat-algebra": {
    objectives: [
      t(
        "Узнавать три архетипа: «нет решений», «бесконечно много», «ровно одно» — и решать их за секунды",
        "Үш архетипті тану: «шешім жоқ», «шексіз көп», «дәл біреу» — және оларды секундтарда шешу",
        "Recognise the three archetypes — no solution, infinitely many, exactly one — and solve each in seconds"
      ),
      t(
        "Решать показательные уравнения относительно показателя, а не подбором",
        "Көрсеткіштік теңдеулерді іріктеумен емес, көрсеткішке қатысты шешу",
        "Solve exponential equations for the exponent rather than by trial"
      ),
      t(
        "Видеть, когда вопрос спрашивает выражение, а отдельные переменные найти нельзя",
        "Сұрақ өрнекті сұрап тұрғанын, ал айнымалыларды жеке табу мүмкін еместігін көру",
        "Spot when a question asks for an expression and the individual variables are not recoverable"
      ),
    ],
    sections: [
      {
        heading: t("Три отношения решают всё", "Үш қатынас бәрін шешеді", "Three ratios settle everything"),
        body: t(
          "Для системы двух линейных уравнений сравни три отношения: коэффициентов при x, при y и свободных членов. Совпали первые два, а третье нет — решений нет. Совпали все три — бесконечно много. Первые два различаются — ровно одно решение. Это самый частый тип на SAT, и он не требует ни подстановки, ни сложения.",
          "Екі сызықтық теңдеу жүйесі үшін үш қатынасты салыстыр: x-тегі, y-тегі коэффициенттер және бос мүшелер. Алғашқы екеуі сәйкес келіп, үшіншісі келмесе — шешім жоқ. Үшеуі де сәйкес келсе — шексіз көп. Алғашқы екеуі әртүрлі болса — дәл бір шешім. Бұл SAT-тағы ең жиі тип, әрі оған не қою, не қосу тәсілі керек емес.",
          "For a system of two linear equations, compare three ratios: the x coefficients, the y coefficients, and the constants. First two match but the third does not — no solution. All three match — infinitely many. First two differ — exactly one. This is the most common SAT archetype and it needs neither substitution nor elimination."
        ),
        formula: "a₁/a₂ = b₁/b₂ ≠ c₁/c₂  →  no solution",
        example: n("3x + ky = 12 ; 9x + 15y = 7 — no solution  →  3/9 = k/15  →  k = 5"),
      },
      {
        heading: t("Показатель — это неизвестное", "Көрсеткіш — бұл белгісіз", "The exponent is the unknown"),
        body: t(
          "Когда обе части можно привести к одному основанию, приравнивай показатели — и уравнение становится линейным. Подбор здесь не нужен и на экзамене слишком медленный. Если основания разные, ищи, как выразить одно через другое: 81 = 3⁴, 4 = 2², 27 = 3³.",
          "Екі жақты бір негізге келтіруге болатын болса, көрсеткіштерді теңестір — сонда теңдеу сызықтыққа айналады. Мұнда іріктеудің қажеті жоқ, ол емтиханда тым баяу. Негіздер әртүрлі болса, бірін екіншісі арқылы өрнектеу жолын ізде: 81 = 3⁴, 4 = 2², 27 = 3³.",
          "When both sides can be written over the same base, set the exponents equal and the equation becomes linear. Guessing is unnecessary and far too slow under time. If the bases differ, look for how to express one through the other: 81 = 3⁴, 4 = 2², 27 = 3³."
        ),
        example: n("24,000 · 2^(t/k) = 96,000 after 14 days  →  2^(14/k) = 4 = 2²  →  k = 7"),
        note: t(
          "k здесь — время удвоения, а не число удвоений. Учетверение за 14 дней — это два удвоения по 7 дней.",
          "Мұндағы k — еселену уақыты, еселену саны емес. 14 күнде төрт есе өсу — 7 күндік екі еселену.",
          "Here k is the doubling time, not the number of doublings. Quadrupling in 14 days is two doublings of 7 days each."
        ),
      },
      {
        heading: t("Когда переменные найти нельзя", "Айнымалыларды табу мүмкін болмағанда", "When the variables cannot be found"),
        body: t(
          "Четыре неизвестных и два уравнения — по отдельности не находится ничего. Но если вопрос спрашивает не переменную, а выражение вроде 7(a − b), то именно скобка и есть неизвестное. Обозначь её одной буквой, и система становится обычной системой двух уравнений с двумя неизвестными.",
          "Төрт белгісіз және екі теңдеу — жеке-жеке ештеңе табылмайды. Бірақ сұрақ айнымалыны емес, 7(a − b) сияқты өрнекті сұраса, сол жақшаның өзі — белгісіз. Оны бір әріппен белгіле, сонда жүйе екі белгісізі бар қарапайым жүйеге айналады.",
          "Four unknowns and two equations means nothing is individually recoverable. But if the question asks for an expression like 7(a − b) rather than a variable, that bracket *is* the unknown. Name it with a single letter and the system becomes an ordinary two-by-two."
        ),
        note: t(
          "Признак: в вопросе стоит скобка или произведение, а не одна буква. Это подсказка, а не совпадение.",
          "Белгісі: сұрақта бір әріп емес, жақша немесе көбейтінді тұр. Бұл — кездейсоқтық емес, нұсқау.",
          "The tell: the question contains a bracket or a product rather than a single letter. That is a hint, not a coincidence."
        ),
      },
    ],
    worked: [
      {
        title: t("Бесконечно много решений", "Шексіз көп шешім", "Infinitely many solutions"),
        problem: n("ax + 6y = 18 ;  4x + 12y = b.  Infinitely many solutions. Find a + b."),
        steps: [
          {
            text: t(
              "Бесконечно много решений означает, что это одно и то же уравнение, записанное дважды. Значит все три отношения равны.",
              "Шексіз көп шешім — бұл екі рет жазылған бір теңдеу. Демек үш қатынас та тең.",
              "Infinitely many solutions means the two equations are the same line, so all three ratios match."
            ),
          },
          {
            text: t("Берём отношение при y — там оба числа известны.", "y-тегі қатынасты аламыз — онда екі сан да белгілі.", "Take the y ratio, where both numbers are known."),
            formula: "6/12 = 1/2",
          },
          {
            text: t("Приравниваем к нему остальные два.", "Қалған екеуін соған теңестіреміз.", "Set the other two equal to it."),
            formula: "a/4 = 1/2 → a = 2      18/b = 1/2 → b = 36",
          },
        ],
        answer: n("a + b = 38"),
        takeaway: t(
          "Всегда начинай с того отношения, где обе величины известны. Оно даёт коэффициент пропорциональности, а дальше всё подставляется.",
          "Әрқашан екі шамасы да белгілі қатынастан баста. Ол пропорционалдық коэффициентін береді, әрі қарай бәрі қойылады.",
          "Always start from the ratio where both values are known. It gives you the scale factor and everything else follows."
        ),
      },
      {
        title: t("Спрашивают выражение", "Өрнек сұралады", "The question asks for an expression"),
        problem: n("(a − b) − 16(c + d) = 300 ;  (a − b) + 12(c + d) = 720.  Find 7(a − b)."),
        steps: [
          {
            text: t(
              "Обозначаем u = a − b и v = c + d. Теперь это обычная система с двумя неизвестными.",
              "u = a − b және v = c + d деп белгілейміз. Енді бұл екі белгісізі бар қарапайым жүйе.",
              "Let u = a − b and v = c + d. It is now an ordinary two-unknown system."
            ),
            formula: "u − 16v = 300 ;  u + 12v = 720",
          },
          {
            text: t("Вычитаем первое из второго — u уходит.", "Біріншіні екіншіден азайтамыз — u кетеді.", "Subtract the first from the second and u drops out."),
            formula: "28v = 420  →  v = 15",
          },
          {
            text: t("Подставляем обратно.", "Кері қоямыз.", "Substitute back."),
            formula: "u = 720 − 12·15 = 540  →  7u = 3780",
          },
        ],
        answer: n("3780"),
        takeaway: t(
          "Если попытка найти a, b, c, d по отдельности заходит в тупик — это не ошибка, это условие задачи. Ищи, что именно спрашивают.",
          "Егер a, b, c, d-ны жеке табу тығырыққа тірелсе — бұл қате емес, есептің шарты. Не сұралып тұрғанын ізде.",
          "If trying to find a, b, c and d individually goes nowhere, that is not your mistake — it is the design of the problem. Look at what is actually being asked."
        ),
      },
    ],
    pitfalls: [
      {
        wrong: n("(x + 7) is a factor  →  root is x = 7"),
        right: n("(x + 7) is a factor  →  root is x = −7"),
        why: t(
          "Множителю (x + k) отвечает корень −k. Это самая частая единичная ошибка во всём разделе.",
          "(x + k) көбейткішіне −k түбірі сәйкес келеді. Бұл — бүкіл бөлімдегі ең жиі жалғыз қате.",
          "The factor (x + k) corresponds to the root −k. This is the single most common error in the whole section."
        ),
      },
      {
        wrong: n("x⁴ − 13x² + 36 = 0  →  greatest solution 9"),
        right: n("u = x² = 9  →  x = 3"),
        why: t(
          "После замены u = x² нужно вернуться к x. Ответ 9 — это значение u, а спрашивают x.",
          "u = x² ауыстыруынан кейін x-ке оралу керек. 9 жауабы — u-дың мәні, ал x сұралады.",
          "After the substitution u = x² you must come back to x. The answer 9 is a value of u, and the question asks for x."
        ),
      },
    ],
  },

  /* ================= SAT Math: data ================= */
  "sat-data": {
    objectives: [
      t(
        "Не терять степень при переводе единиц площади и объёма",
        "Аудан мен көлем бірліктерін аударғанда дәрежені жоғалтпау",
        "Never drop the power when converting units of area or volume"
      ),
      t(
        "Всегда брать процент от правильной базы",
        "Пайызды әрқашан дұрыс базадан алу",
        "Always take a percentage from the correct base"
      ),
      t(
        "Читать условную вероятность из таблицы, а не делить на общий итог",
        "Шартты ықтималдықты кестеден оқу, жалпы қорытындыға бөлмеу",
        "Read a conditional probability off the table instead of dividing by the grand total"
      ),
    ],
    sections: [
      {
        heading: t("Площадь переводится дважды", "Аудан екі рет аударылады", "Area converts twice"),
        body: t(
          "Длина умножается на коэффициент один раз, площадь — два раза, объём — три. 1 миля = 1760 ярдов, но 1 кв. миля = 1760² = 3 097 600 кв. ярдов. SAT кладёт в варианты и правильный ответ, и результат однократного умножения — чтобы поймать тех, кто забыл возвести коэффициент в квадрат.",
          "Ұзындық коэффициентке бір рет, аудан екі рет, көлем үш рет көбейтіледі. 1 миля = 1760 ярд, бірақ 1 шаршы миля = 1760² = 3 097 600 шаршы ярд. SAT нұсқаларға дұрыс жауапты да, бір рет көбейтудің нәтижесін де қояды — коэффициентті квадраттауды ұмытқандарды ұстау үшін.",
          "Length multiplies by the factor once, area twice, volume three times. One mile is 1,760 yards, but one square mile is 1,760² = 3,097,600 square yards. The SAT puts both the right answer and the single-multiplication result among the options, precisely to catch anyone who forgot to square."
        ),
        formula: "1 mile = 1,760 yd  →  1 mile² = 1,760² yd²",
      },
      {
        heading: t("База процента", "Пайыздың базасы", "The base of a percentage"),
        body: t(
          "Процентное изменение всегда считается от исходного значения, а не от результата. И проценты нельзя складывать: рост на 25% с последующим падением на 20% даёт не +5%, а ноль, потому что 20% берутся уже от увеличенной цены. Перемножай коэффициенты: 1,25 × 0,8 = 1,00.",
          "Пайыздық өзгеріс әрқашан бастапқы мәннен есептеледі, нәтижеден емес. Әрі пайыздарды қосуға болмайды: 25%-ға өсіп, содан кейін 20%-ға түсу +5% емес, нөл береді, өйткені 20% ұлғайған бағадан алынады. Коэффициенттерді көбейт: 1,25 × 0,8 = 1,00.",
          "Percent change is always measured against the original, never against the result. And percentages do not add: a 25% rise followed by a 20% fall is not +5% but zero, because the 20% comes off the larger price. Multiply the factors instead: 1.25 × 0.8 = 1.00."
        ),
        example: n("989,000 is 15% more than what?  →  989,000 / 1.15 = 860,000"),
      },
      {
        heading: t("Условная вероятность", "Шартты ықтималдық", "Conditional probability"),
        body: t(
          "Формулировка «из тех, кто выбрал X» сужает выборку до одного столбца или строки таблицы. Знаменатель — итог этого столбца, а не итог всей таблицы. Найди в вопросе слова «из тех», «среди», «при условии» — они и указывают на знаменатель.",
          "«X таңдағандардың ішінен» деген тұжырым таңдауды кестенің бір бағанына немесе жолына тарылтады. Бөлім — сол бағанның қорытындысы, бүкіл кестенің қорытындысы емес. Сұрақтан «ішінен», «арасында», «шартымен» сөздерін тап — олар бөлімді көрсетеді.",
          "The phrase \"among those who chose X\" narrows the pool to one column or row of the table. The denominator is that column's total, not the grand total. Find the words \"among\", \"of those\", \"given that\" — they point at the denominator."
        ),
        note: t(
          "Если делишь на общий итог таблицы, ты отвечаешь на другой вопрос — на безусловную вероятность.",
          "Егер кестенің жалпы қорытындысына бөлсең, басқа сұраққа — шартсыз ықтималдыққа жауап бересің.",
          "If you divide by the grand total you have answered a different question — the unconditional probability."
        ),
      },
    ],
    worked: [
      {
        title: t("Перевод площади", "Ауданды аудару", "Converting an area"),
        problem: n("A town has an area of 5.48 square miles. In square yards? (1 mile = 1,760 yards)"),
        steps: [
          {
            text: t("Возводим коэффициент в квадрат, потому что речь о площади.", "Аудан туралы болғандықтан коэффициентті квадраттаймыз.", "Square the factor, because this is an area."),
            formula: "1,760² = 3,097,600",
          },
          {
            text: t("Умножаем на количество квадратных миль.", "Шаршы мильдер санына көбейтеміз.", "Multiply by the number of square miles."),
            formula: "5.48 × 3,097,600 = 16,974,848",
          },
        ],
        answer: n("16,974,848 square yards"),
        takeaway: t(
          "Вариант около 9 645 — это 5,48 × 1760. Он в списке специально. Прежде чем считать, спроси себя: длина, площадь или объём?",
          "9 645-ке жуық нұсқа — бұл 5,48 × 1760. Ол тізімде әдейі тұр. Санамас бұрын өзіңнен сұра: ұзындық па, аудан ба, көлем бе?",
          "The option near 9,645 is 5.48 × 1,760, and it is there on purpose. Before computing, ask yourself: length, area or volume?"
        ),
      },
      {
        title: t("Вероятность по таблице", "Кесте бойынша ықтималдық", "Probability from a table"),
        problem: n("Kazakh: grade 10 — 54, grade 11 — 72, total 126. Grand total 240.\nA student who chose Kazakh is picked at random. P(grade 11)?"),
        steps: [
          {
            text: t(
              "«Из тех, кто выбрал казахский» — значит работаем только со столбцом «казахский».",
              "«Қазақ тілін таңдағандардың ішінен» — демек тек «қазақ тілі» бағанымен жұмыс істейміз.",
              "\"Of the students who chose Kazakh\" means we work inside that column only."
            ),
          },
          {
            text: t("Знаменатель — итог столбца, 126.", "Бөлім — бағанның қорытындысы, 126.", "The denominator is the column total, 126."),
            formula: "72 / 126 = 4/7",
          },
        ],
        answer: n("4/7"),
        takeaway: t(
          "72/240 = 0,3 — это вероятность «случайный ученик из всех». Другой вопрос, другой знаменатель.",
          "72/240 = 0,3 — бұл «бәрінің ішінен кездейсоқ оқушы» ықтималдығы. Басқа сұрақ — басқа бөлім.",
          "72/240 = 0.3 answers \"a random student out of everyone\". Different question, different denominator."
        ),
      },
    ],
    pitfalls: [
      {
        wrong: n("Price +25% then −20%  →  net +5%"),
        right: n("1.25 × 0.80 = 1.00  →  unchanged"),
        why: t(
          "Проценты берутся от разных баз, поэтому складывать их нельзя. Перемножай коэффициенты.",
          "Пайыздар әртүрлі базадан алынады, сондықтан оларды қосуға болмайды. Коэффициенттерді көбейт.",
          "The two percentages come off different bases, so they cannot be added. Multiply the factors."
        ),
      },
    ],
  },

  /* ================= SAT Reading & Writing ================= */
  "sat-writing": {
    objectives: [
      t(
        "Ставить знак между предложениями по одному правилу вместо «на слух»",
        "Сөйлемдер арасына таңбаны «құлақпен» емес, бір ереже бойынша қою",
        "Punctuate between clauses by one rule instead of by ear"
      ),
      t(
        "Находить настоящее подлежащее, вычёркивая всё между ним и глаголом",
        "Бастауыш пен баяндауыш арасындағының бәрін сызып тастап, шын бастауышты табу",
        "Find the real subject by crossing out everything between it and the verb"
      ),
      t(
        "Выбирать связку по логике отношения, а не по частоте слова",
        "Байланыстырғышты сөздің жиілігі бойынша емес, қатынас логикасы бойынша таңдау",
        "Choose a transition from the logical relationship, not from how common the word is"
      ),
    ],
    sections: [
      {
        heading: t("Тест на самостоятельность", "Дербестікке тест", "The independence test"),
        body: t(
          "Прочитай, что стоит слева от пропуска, и что справа. Если обе части — законченные предложения, между ними нужна точка, точка с запятой или запятая с союзом. Одна запятая — ошибка. Если справа не предложение, а перечисление или пояснение, ставится двоеточие. Всё остальное — вариации этих двух правил.",
          "Пропуcктың сол жағында және оң жағында не тұрғанын оқы. Екеуі де аяқталған сөйлем болса, олардың арасына нүкте, нүктелі үтір немесе жалғаулықпен үтір керек. Жалғыз үтір — қате. Оң жақта сөйлем емес, тізім немесе түсіндірме тұрса — қос нүкте қойылады. Қалғанының бәрі — осы екі ереженің нұсқалары.",
          "Read what stands to the left of the blank and what stands to the right. If both are complete sentences, you need a full stop, a semicolon, or a comma plus a conjunction. A bare comma is wrong. If the right-hand side is a list or an explanation rather than a sentence, use a colon. Everything else is a variation on those two rules."
        ),
        formula: "clause ; clause      clause : list",
        note: t(
          "«However», «therefore», «moreover» — это наречия, а не союзы. Соединить два предложения одной запятой они не могут.",
          "«However», «therefore», «moreover» — үстеулер, жалғаулықтар емес. Екі сөйлемді жалғыз үтірмен қоса алмайды.",
          "\"However\", \"therefore\" and \"moreover\" are adverbs, not conjunctions. They cannot join two sentences with only a comma."
        ),
      },
      {
        heading: t("Парность знаков", "Таңбалардың жұптылығы", "Punctuation comes in pairs"),
        body: t(
          "Вставная конструкция закрывается тем же знаком, каким открыта: две запятые, или два тире, или две скобки. Смешать запятую с тире нельзя. SAT проверяет парность гораздо чаще, чем выбор между запятой и тире, — и именно на этом ловит.",
          "Қыстырма конструкция қандай таңбамен ашылса, сол таңбамен жабылады: екі үтір, немесе екі сызықша, немесе екі жақша. Үтір мен сызықшаны араластыруға болмайды. SAT жұптылықты үтір мен сызықшаның арасындағы таңдауға қарағанда әлдеқайда жиі тексереді — және дәл сонымен ұстайды.",
          "A parenthetical insertion closes with the same mark it opened with: two commas, or two dashes, or two brackets. Mixing a comma with a dash is not allowed. The SAT tests matching far more often than it tests which mark you prefer, and that is exactly where it catches people."
        ),
      },
      {
        heading: t("Связки: пять отношений", "Байланыстырғыштар: бес қатынас", "Transitions: five relationships"),
        body: t(
          "Каждая связка выражает одно из пяти отношений: добавление, контраст, причина-следствие, пример, вывод. Прочитай два предложения без связки и назови отношение словами — «второе противоречит первому» или «второе следует из первого». Только потом смотри в варианты. Так ты не выберешь «therefore» там, где нужен контраст.",
          "Әр байланыстырғыш бес қатынастың бірін білдіреді: қосу, қарама-қарсылық, себеп-салдар, мысал, қорытынды. Екі сөйлемді байланыстырғышсыз оқы да, қатынасты сөзбен ата — «екіншісі біріншіге қайшы» немесе «екіншісі біріншіден шығады». Тек содан кейін нұсқаларға қара. Сонда қарама-қарсылық керек жерде «therefore» таңдамайсың.",
          "Every connector expresses one of five relationships: addition, contrast, cause and effect, example, conclusion. Read the two sentences without the connector and name the relationship out loud — \"the second contradicts the first\" or \"the second follows from the first\". Only then look at the options. That way you will not pick \"therefore\" where contrast is required."
        ),
      },
      {
        heading: t("Синтез: отвечай на цель", "Синтез: мақсатқа жауап бер", "Synthesis: answer the stated goal"),
        body: t(
          "В заданиях с заметками вопрос всегда называет цель: «подчеркнуть разницу», «представить жанр незнакомой аудитории». Верный вариант — тот, который выполняет именно эту цель, даже если другие варианты тоже правдивы и по теме. Если целей две, ответ должен закрыть обе.",
          "Жазбалармен берілген тапсырмаларда сұрақ әрқашан мақсатты атайды: «айырмашылықты көрсету», «жанрды таныс емес аудиторияға таныстыру». Дұрыс нұсқа — дәл сол мақсатты орындайтыны, басқа нұсқалар да шын әрі тақырыпқа сай болса да. Мақсат екеу болса, жауап екеуін де жабуы керек.",
          "In the notes questions, the prompt always names a goal: \"emphasise the difference\", \"introduce the genre to an unfamiliar audience\". The right option is the one that meets that goal, even when the others are equally true and on topic. If two goals are named, the answer must satisfy both."
        ),
      },
    ],
    worked: [
      {
        title: t("Границы предложений", "Сөйлем шекаралары", "Sentence boundaries"),
        problem: n("The bridge was designed to carry freight traffic _____ however, within a decade it was serving mainly passengers.\nA) traffic,   B) traffic;   C) traffic   D) traffic and"),
        steps: [
          {
            text: t(
              "Слева: «The bridge was designed to carry freight traffic» — законченное предложение.",
              "Сол жақта: «The bridge was designed to carry freight traffic» — аяқталған сөйлем.",
              "Left side: \"The bridge was designed to carry freight traffic\" — a complete sentence."
            ),
          },
          {
            text: t(
              "Справа: «within a decade it was serving mainly passengers» — тоже законченное.",
              "Оң жақта: «within a decade it was serving mainly passengers» — ол да аяқталған.",
              "Right side: \"within a decade it was serving mainly passengers\" — also complete."
            ),
          },
          {
            text: t(
              "«However» — наречие, а не союз, поэтому одной запятой не хватит. Нужна точка с запятой.",
              "«However» — үстеу, жалғаулық емес, сондықтан жалғыз үтір жеткіліксіз. Нүктелі үтір керек.",
              "\"However\" is an adverb, not a conjunction, so a comma alone will not do. A semicolon is required."
            ),
          },
        ],
        answer: n("B"),
        takeaway: t(
          "Схема запоминается одна: «; however,» — точка с запятой перед, запятая после.",
          "Бір ғана схема есте қалады: «; however,» — алдында нүктелі үтір, соңында үтір.",
          "One pattern to memorise: \"; however,\" — semicolon before, comma after."
        ),
      },
      {
        title: t("Согласование через нагромождение", "Үйінді арқылы келісім", "Agreement across a pile-up"),
        problem: n("The collection of letters written by soldiers stationed along the Irtysh _____ a picture of daily life.\nA) offer   B) offers   C) have offered   D) are offering"),
        steps: [
          {
            text: t(
              "Вычёркиваем всё между подлежащим и глаголом: «of letters written by soldiers stationed along the Irtysh».",
              "Бастауыш пен баяндауыш арасындағының бәрін сызып тастаймыз: «of letters written by soldiers stationed along the Irtysh».",
              "Cross out everything between the subject and the verb: \"of letters written by soldiers stationed along the Irtysh\"."
            ),
          },
          {
            text: t(
              "Остаётся «The collection ... a picture» — подлежащее в единственном числе.",
              "«The collection … a picture» қалады — бастауыш жекеше түрде.",
              "What remains is \"The collection ... a picture\" — a singular subject."
            ),
          },
        ],
        answer: n("B"),
        takeaway: t(
          "Существительное прямо перед глаголом почти никогда не подлежащее. Оно стоит там как приманка.",
          "Баяндауыштың дәл алдындағы зат есім бастауыш болуы екіталай. Ол сонда жем ретінде тұр.",
          "The noun sitting immediately before the verb is almost never the subject. It is there as bait."
        ),
      },
    ],
    pitfalls: [
      {
        wrong: n("Sadykova, who's research has been cited widely, ..."),
        right: n("Sadykova, whose research has been cited widely, ..."),
        why: t(
          "«Who's» = «who is». Нужно притяжательное «whose». Подставь «who is» и услышишь ошибку.",
          "«Who's» = «who is». Иелік «whose» керек. «Who is» деп қойып көр — қатені естисің.",
          "\"Who's\" means \"who is\". The possessive is \"whose\". Substitute \"who is\" and you will hear the error."
        ),
      },
      {
        wrong: n("Testing the acoustics of the yurt, the felt panels absorbed more sound than expected."),
        right: n("After testing the acoustics of the yurt, the researchers found that the panels absorbed more sound than expected."),
        why: t(
          "Причастный оборот относится к подлежащему. Панели ничего не тестировали — это висячий модификатор.",
          "Есімше орамы бастауышқа қатысты. Панельдер ештеңе тексерген жоқ — бұл ілінбелі анықтауыш.",
          "A participial phrase attaches to the subject. The panels did not test anything — this is a dangling modifier."
        ),
      },
    ],
  },

  /* ================= IELTS Reading ================= */
  "ie-reading": {
    objectives: [
      t(
        "Отличать NOT GIVEN от FALSE — самое дорогое различие в разделе",
        "NOT GIVEN мен FALSE-ты ажырату — бөлімдегі ең қымбат айырмашылық",
        "Tell NOT GIVEN from FALSE — the most expensive distinction in the section"
      ),
      t(
        "Подбирать заголовки по назначению абзаца, а не по совпадению слов",
        "Тақырыптарды сөз сәйкестігі бойынша емес, абзац мақсаты бойынша таңдау",
        "Match headings by what a paragraph is doing, not by which words it repeats"
      ),
      t(
        "Укладываться в 60 минут на три текста без времени на перенос ответов",
        "Үш мәтінге 60 минутқа сыю, жауапты көшіруге уақыт бөлінбейді",
        "Finish three passages in 60 minutes, with no extra time to transfer answers"
      ),
    ],
    sections: [
      {
        heading: t("FALSE против NOT GIVEN", "FALSE пен NOT GIVEN", "FALSE versus NOT GIVEN"),
        body: t(
          "FALSE ставится, когда текст прямо противоречит утверждению. NOT GIVEN — когда текст об этом просто молчит. Проверка простая: можешь ли ты показать пальцем предложение, которое опровергает? Если да — FALSE. Если приходится рассуждать «ну наверное это значит, что...» — это NOT GIVEN.",
          "FALSE мәтін тұжырымға тікелей қайшы келгенде қойылады. NOT GIVEN — мәтін бұл туралы үндемегенде. Тексеру қарапайым: теріске шығаратын сөйлемді саусақпен көрсете аласың ба? Иә болса — FALSE. «Бәлкім бұл мынаны білдіретін шығар…» деп ойлауға тура келсе — бұл NOT GIVEN.",
          "FALSE is for when the text directly contradicts the statement. NOT GIVEN is for when the text simply says nothing about it. The test is simple: can you point at the sentence that refutes it? If yes, FALSE. If you find yourself reasoning \"well, presumably that means…\", it is NOT GIVEN."
        ),
        note: t(
          "Совпадение фразы — не совпадение смысла. «Faster than forecast» про уровень воды не подтверждает утверждение про сроки строительства.",
          "Сөйлемнің сәйкес келуі — мағынаның сәйкес келуі емес. Су деңгейі туралы «faster than forecast» құрылыс мерзімі туралы тұжырымды растамайды.",
          "A matching phrase is not a matching claim. \"Faster than forecast\" about water levels does not confirm a statement about the construction schedule."
        ),
      },
      {
        heading: t("Yes/No/Not Given — про автора", "Yes/No/Not Given — автор туралы", "Yes/No/Not Given is about the writer"),
        body: t(
          "True/False относится к фактам, Yes/No — к взглядам автора. Разница важна: текст может привести чужое мнение именно для того, чтобы его опровергнуть. Если утверждение звучит в тексте, но автор с ним спорит — ответ NO, а не YES.",
          "True/False фактілерге, Yes/No автордың көзқарасына қатысты. Айырмашылық маңызды: мәтін бөтен пікірді оны теріске шығару үшін келтіруі мүмкін. Тұжырым мәтінде естілсе, бірақ автор онымен таласса — жауап NO, YES емес.",
          "True/False is about facts; Yes/No is about the writer's views. The difference matters: a passage may state someone else's opinion precisely in order to reject it. If the claim appears but the writer argues against it, the answer is NO, not YES."
        ),
      },
      {
        heading: t("Заголовки — это назначение абзаца", "Тақырыптар — абзацтың мақсаты", "Headings are a paragraph's function"),
        body: t(
          "Заголовок описывает, что абзац делает: вводит проблему, приводит возражение, признаёт ограничение, подводит итог. Слова из абзаца в заголовке могут вообще не встречаться. Читай первое и последнее предложение абзаца — назначение почти всегда там.",
          "Тақырып абзацтың не істеп тұрғанын сипаттайды: мәселені енгізеді, қарсылық келтіреді, шектеуді мойындайды, қорытынды жасайды. Абзацтағы сөздер тақырыпта мүлдем кездеспеуі мүмкін. Абзацтың бірінші және соңғы сөйлемін оқы — мақсат әрдайым дерлік сонда.",
          "A heading describes what a paragraph does: introduces a problem, raises an objection, concedes a limitation, draws a conclusion. The paragraph's own words may not appear in the heading at all. Read the first and last sentence — the function is nearly always there."
        ),
      },
      {
        heading: t("Бюджет времени", "Уақыт бюджеті", "The time budget"),
        body: t(
          "60 минут на 40 вопросов, и дополнительного времени на перенос ответов в IELTS нет — в отличие от Listening. Практический план: 17 минут на первый текст, 20 на второй, 23 на третий, потому что сложность растёт. Не оставляй ни одного пропуска: за неверный ответ не снимают.",
          "40 сұраққа 60 минут, әрі IELTS-те жауапты көшіруге қосымша уақыт жоқ — Listening-тен айырмашылығы осы. Практикалық жоспар: бірінші мәтінге 17 минут, екіншіге 20, үшіншіге 23, өйткені күрделілік өседі. Бірде-бір бос орын қалдырма: қате жауап үшін балл алынбайды.",
          "60 minutes for 40 questions, and unlike Listening there is no extra transfer time. A workable split is 17 minutes on passage 1, 20 on passage 2 and 23 on passage 3, because difficulty rises. Never leave a blank: nothing is deducted for a wrong answer."
        ),
      },
    ],
    worked: [
      {
        title: t("Почему это NOT GIVEN", "Неге бұл NOT GIVEN", "Why this one is NOT GIVEN"),
        problem: n("Text: \"Water levels rose faster than the project's own forecasts.\"\nStatement: \"The dam was completed ahead of its construction schedule.\""),
        steps: [
          {
            text: t(
              "В тексте есть слова «faster than forecast» — соблазн ответить TRUE.",
              "Мәтінде «faster than forecast» сөздері бар — TRUE деп жауап беруге азғырады.",
              "The words \"faster than forecast\" appear, which tempts a TRUE."
            ),
          },
          {
            text: t(
              "Но текст говорит о скорости подъёма воды, а утверждение — о сроках строительства. Это разные вещи.",
              "Бірақ мәтін су көтерілу жылдамдығы туралы, ал тұжырым құрылыс мерзімі туралы. Бұл әртүрлі нәрсе.",
              "But the passage is about how fast the water rose; the statement is about the construction timetable. Different things."
            ),
          },
          {
            text: t(
              "О сроках строительства текст не говорит ни за, ни против. Значит, информации нет.",
              "Құрылыс мерзімі туралы мәтін не жақтап, не қарсы айтпайды. Демек, ақпарат жоқ.",
              "The passage neither confirms nor denies anything about the schedule. So the information is absent."
            ),
          },
        ],
        answer: n("NOT GIVEN"),
        takeaway: t(
          "Прежде чем поставить TRUE, проверь, что совпадает не фраза, а именно предмет утверждения.",
          "TRUE қоймас бұрын, сөйлем емес, тұжырымның нысаны сәйкес келетінін тексер.",
          "Before writing TRUE, check that what matches is the subject of the claim, not merely a phrase."
        ),
      },
    ],
    pitfalls: [
      {
        wrong: n("The passage mentions the claim  →  YES"),
        right: n("The writer states the claim in order to reject it  →  NO"),
        why: t(
          "Yes/No спрашивает мнение автора. Приведённое чужое мнение — не позиция автора.",
          "Yes/No автордың пікірін сұрайды. Келтірілген бөтен пікір — автордың ұстанымы емес.",
          "Yes/No asks for the writer's view. A quoted opinion is not the writer's position."
        ),
      },
      {
        wrong: n("Answer written as \"the bookshop\" when the limit is ONE WORD"),
        right: n("bookshop"),
        why: t(
          "Превышение лимита слов обнуляет ответ, даже если он по смыслу верный. Артикль тоже считается словом.",
          "Сөз лимитінен асу жауапты нөлдейді, мағынасы дұрыс болса да. Артикль де сөз болып саналады.",
          "Exceeding the word limit voids the answer even when the meaning is right. An article counts as a word."
        ),
      },
    ],
  },

  /* ================= IELTS Writing ================= */
  "ie-writing": {
    objectives: [
      t(
        "Писать overview в Task 1 — без него балл за раскрытие не поднимется выше 5",
        "Task 1-де overview жазу — онсыз ашу критерийі 5-тен жоғары көтерілмейді",
        "Write an overview in Task 1 — without one, Task Achievement cannot pass 5"
      ),
      t(
        "Заявлять позицию в Task 2 во введении и держать её до конца",
        "Task 2-де ұстанымды кіріспеде жариялап, соңына дейін ұстау",
        "State a position in Task 2's introduction and hold it to the end"
      ),
      t(
        "Понимать, за что снимают по каждому из четырёх критериев",
        "Төрт критерийдің әрқайсысы бойынша не үшін балл алынатынын түсіну",
        "Know what loses marks under each of the four criteria"
      ),
    ],
    sections: [
      {
        heading: t("Overview — обязателен", "Overview — міндетті", "The overview is mandatory"),
        body: t(
          "В Task 1 экзаменатор ищет абзац из одного-двух предложений, где названы главные тенденции без цифр: что выросло, что упало, что осталось неизменным. Это не введение и не заключение — это отдельный элемент, и без него Task Achievement выше band 5 не поднимается, каким бы хорошим ни был остальной текст.",
          "Task 1-де емтихан алушы бір-екі сөйлемнен тұратын, негізгі тенденциялар цифрсыз аталған абзацты іздейді: не өсті, не түсті, не өзгеріссіз қалды. Бұл кіріспе де, қорытынды да емес — жеке элемент, әрі онсыз Task Achievement band 5-тен жоғары көтерілмейді, қалған мәтін қандай жақсы болса да.",
          "In Task 1 the examiner looks for a paragraph of one or two sentences naming the main trends without figures: what rose, what fell, what stayed flat. It is neither the introduction nor the conclusion but a separate element, and without it Task Achievement cannot rise above band 5 however good the rest is."
        ),
        example: n("Overall, coal fell steadily across the period while renewables grew from almost nothing, and gas rose only slightly."),
      },
      {
        heading: t("Позиция в Task 2", "Task 2-дегі ұстаным", "Your position in Task 2"),
        body: t(
          "«To what extent do you agree» разрешает частичное согласие, но не разрешает его прятать. Позиция должна прозвучать во введении одной фразой и повториться в заключении. Эссе, где мнение появляется только в последнем предложении, теряет балл за Task Response — экзаменатор считает, что позиции нет.",
          "«To what extent do you agree» ішінара келісуге рұқсат етеді, бірақ оны жасыруға рұқсат етпейді. Ұстаным кіріспеде бір сөйлеммен айтылып, қорытындыда қайталануы керек. Пікір тек соңғы сөйлемде пайда болатын эссе Task Response бойынша балл жоғалтады — емтихан алушы ұстаным жоқ деп есептейді.",
          "\"To what extent do you agree\" permits partial agreement but does not permit hiding it. Your position must appear in the introduction in one clause and return in the conclusion. An essay where the opinion surfaces only in the final sentence loses Task Response marks — the examiner reads it as having no position."
        ),
      },
      {
        heading: t("Четыре критерия", "Төрт критерий", "The four criteria"),
        body: t(
          "Task Achievement — раскрыл ли ты все пункты вопроса. Coherence — есть ли абзацы и логичны ли переходы. Lexical Resource — точность и разнообразие слов, а не длина. Grammatical Range — есть ли сложные конструкции и много ли в них ошибок. Каждый весит одинаково, поэтому вытягивать один критерий за счёт другого бессмысленно.",
          "Task Achievement — сұрақтың барлық тармағын аштың ба. Coherence — абзац бар ма және ауысулар қисынды ма. Lexical Resource — сөздердің дәлдігі мен әртүрлілігі, ұзындығы емес. Grammatical Range — күрделі құрылымдар бар ма және оларда қате көп пе. Әрқайсысының салмағы бірдей, сондықтан бірін екіншісінің есебінен тарту мағынасыз.",
          "Task Achievement asks whether you covered every part of the question. Coherence asks whether there are paragraphs and whether the transitions hold. Lexical Resource is about precision and variety, not length. Grammatical Range asks whether complex structures appear and how many errors they carry. All four weigh the same, so trading one off against another is pointless."
        ),
        note: t(
          "Недобор объёма режет балл до оценки содержания. 150 слов в Task 1 и 250 в Task 2 — это минимум, а не цель.",
          "Көлемнен қалу баллды мазмұнды бағалауға дейін кеседі. Task 1-де 150, Task 2-де 250 сөз — бұл мақсат емес, ең төменгі шек.",
          "Under-length is penalised before content is even judged. 150 words in Task 1 and 250 in Task 2 are the floor, not the target."
        ),
      },
    ],
    worked: [
      {
        title: t("Структура Task 2 по шагам", "Task 2 құрылымы қадаммен", "Task 2 structure, step by step"),
        problem: n("Some people believe online lessons can fully replace traditional schools in rural areas.\nTo what extent do you agree or disagree?"),
        steps: [
          {
            text: t(
              "Введение: перефразируй вопрос и одной фразой заяви позицию. Не пересказывай задание слово в слово.",
              "Кіріспе: сұрақты өзгертіп жаз және бір сөйлеммен ұстанымды жарияла. Тапсырманы сөзбе-сөз қайталама.",
              "Introduction: paraphrase the question and state your position in one clause. Do not copy the prompt."
            ),
            formula: "Paraphrase + position",
          },
          {
            text: t(
              "Первый абзац: сильнейший аргумент твоей стороны и один конкретный пример. Один абзац — одна мысль.",
              "Бірінші абзац: өз жағыңның ең күшті дәлелі және бір нақты мысал. Бір абзац — бір ой.",
              "Body 1: your strongest argument with one concrete example. One paragraph, one idea."
            ),
          },
          {
            text: t(
              "Второй абзац: сильнейшее возражение — и ответ на него. Игнорировать возражение хуже, чем признать.",
              "Екінші абзац: ең күшті қарсылық — және оған жауап. Қарсылықты елемеу — мойындағаннан нашар.",
              "Body 2: the strongest objection, answered. Ignoring it is worse than conceding it."
            ),
          },
          {
            text: t(
              "Заключение: та же позиция, что и во введении. Никаких новых аргументов.",
              "Қорытынды: кіріспедегі ұстаным. Жаңа дәлел жоқ.",
              "Conclusion: the same position as the introduction. No new arguments."
            ),
          },
        ],
        answer: n("4 paragraphs, 260–280 words, position stated twice"),
        takeaway: t(
          "Потрать минуту на план до письма. Эссе, где абзацы придуманы по ходу, всегда теряет по Coherence.",
          "Жазар алдында жоспарға бір минут жұмса. Абзацтары жүріп отырып ойлап табылған эссе әрқашан Coherence бойынша жоғалтады.",
          "Spend one minute planning before you write. An essay whose paragraphs were invented as it went always loses on Coherence."
        ),
      },
    ],
    pitfalls: [
      {
        wrong: n("Task 1: In 2010 coal was 78%. In 2014 it was 74%. In 2018 it was 70%..."),
        right: n("Coal fell steadily from 78% to 59% over the period, with the sharpest drop after 2021."),
        why: t(
          "Перечисление по годам — не описание. Нужно выбрать и обобщить: направление, размер изменения, крайние точки.",
          "Жылдар бойынша тізу — сипаттау емес. Таңдап, жалпылау керек: бағыты, өзгеріс көлемі, шеткі нүктелер.",
          "A year-by-year list is not a description. You must select and generalise: direction, size of change, endpoints."
        ),
      },
      {
        wrong: n("I think that... I think that... I think that..."),
        right: n("It can be argued that... / In my view... / The more compelling case is..."),
        why: t(
          "Повтор одной конструкции бьёт и по Lexical Resource, и по Grammatical Range сразу.",
          "Бір құрылымды қайталау Lexical Resource-ке де, Grammatical Range-ке де бірден соққы.",
          "Repeating one construction damages both Lexical Resource and Grammatical Range at once."
        ),
      },
    ],
  },
};
