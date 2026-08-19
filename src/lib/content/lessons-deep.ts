import type { Lesson } from "../types";
import { n, t } from "./util";

/**
 * Deep lessons.
 *
 * The original lessons were 400–700 characters of theory and a single three-step
 * example — enough to remind you of a topic, not enough to learn one from. These
 * layers add what a student actually needs to close a gap: what they should be
 * able to do afterwards, several worked problems of rising difficulty with the
 * reasoning named at each step, and the mistakes that cost marks.
 *
 * Merged over the base lessons in `index.ts`, so a topic that has no deep layer
 * yet still renders exactly as before.
 */
export const DEEP_LESSONS: Record<string, Partial<Lesson>> = {
  /* ================= quadratic equations ================= */
  quadratic: {
    objectives: [
      t(
        "Решать любое квадратное уравнение тремя способами и выбирать самый быстрый для конкретного случая",
        "Кез келген квадрат теңдеуді үш тәсілмен шешу және нақты жағдайға ең жылдамын таңдау",
        "Solve any quadratic three ways and pick the fastest one for the case in front of you"
      ),
      t(
        "Отвечать на вопрос «сколько корней» по дискриминанту, не вычисляя сами корни",
        "«Неше түбір бар» деген сұраққа түбірлерді есептемей, дискриминант арқылы жауап беру",
        "Answer \"how many roots\" from the discriminant without computing the roots"
      ),
      t(
        "Находить вершину параболы и понимать, что она означает в текстовой задаче",
        "Параболаның төбесін тауып, оның мәтінді есепте нені білдіретінін түсіну",
        "Find the vertex of a parabola and read what it means inside a word problem"
      ),
      t(
        "Составлять квадратное уравнение по условию задачи на площадь, скорость или прибыль",
        "Аудан, жылдамдық немесе пайда туралы есеп шарты бойынша квадрат теңдеу құру",
        "Build a quadratic from a word problem about area, speed or profit"
      ),
    ],
    sections: [
      {
        heading: t("Три способа решения", "Шешудің үш тәсілі", "Three ways to solve"),
        body: t(
          "Формула корней работает всегда, но она самая медленная. Разложение на множители — самое быстрое, когда корни целые. Выделение полного квадрата нужно реже, зато сразу даёт вершину. Опытный ученик тратит три секунды на выбор способа и экономит минуту на решении.",
          "Түбір формуласы әрқашан жұмыс істейді, бірақ ең баяу. Көбейткіштерге жіктеу — түбірлер бүтін болғанда ең жылдам. Толық квадратты бөліп алу сирек керек, бірақ төбені бірден береді. Тәжірибелі оқушы тәсіл таңдауға үш секунд жұмсап, шешуде бір минут үнемдейді.",
          "The root formula always works and is always the slowest. Factoring is fastest when the roots are whole numbers. Completing the square comes up less often but hands you the vertex immediately. A practised student spends three seconds choosing and saves a minute solving."
        ),
        example: n("x² − 7x + 12 = 0  →  (x − 3)(x − 4) = 0  →  x = 3, x = 4"),
        note: t(
          "Проверь разложение за две секунды: сумма корней должна дать −b, произведение — c.",
          "Жіктеуді екі секундта тексер: түбірлердің қосындысы −b, көбейтіндісі c болуы керек.",
          "Check a factorisation in two seconds: the roots must sum to −b and multiply to c."
        ),
      },
      {
        heading: t("Дискриминант — это признак, а не шаг", "Дискриминант — қадам емес, белгі", "The discriminant is a test, not a step"),
        body: t(
          "D = b² − 4ac отвечает на вопрос «сколько корней», ещё до того как ты их нашёл. D > 0 — два корня, D = 0 — один, D < 0 — ни одного действительного. Половина задач на экзамене спрашивает именно количество корней или значение параметра, при котором корень один. В таких задачах вычислять корни не нужно вообще — нужно приравнять D к нулю.",
          "D = b² − 4ac түбірлерді таппай тұрып «неше түбір бар» деген сұраққа жауап береді. D > 0 — екі түбір, D = 0 — бір, D < 0 — нақты түбір жоқ. Емтихандағы есептердің жартысы дәл түбір санын немесе бір түбір болатын параметр мәнін сұрайды. Мұндай есептерде түбірлерді санаудың қажеті жоқ — D-ны нөлге теңестіру керек.",
          "D = b² − 4ac answers \"how many roots\" before you have found any. D > 0 gives two, D = 0 gives one, D < 0 gives none in the reals. Half of exam questions ask exactly that, or ask for the parameter that makes the root unique. In those you never compute a root — you set D to zero."
        ),
        formula: "D = b² − 4ac",
        example: n("kx² − 12x + 9 = 0 has exactly one root  →  144 − 36k = 0  →  k = 4"),
      },
      {
        heading: t("Теорема Виета", "Виет теоремасы", "Vieta's formulas"),
        body: t(
          "Сумма корней равна −b/a, произведение равно c/a. Это выручает, когда спрашивают сумму или произведение корней, а сами корни иррациональны: считать их бессмысленно, ответ получается из коэффициентов за секунду. Тот же приём помогает подобрать разложение в уме.",
          "Түбірлердің қосындысы −b/a, көбейтіндісі c/a. Бұл түбірлердің қосындысын немесе көбейтіндісін сұрағанда, ал түбірлердің өзі иррационал болғанда көмектеседі: оларды санаудың мәні жоқ, жауап коэффициенттерден бір секундта шығады. Дәл сол әдіс жіктеуді ойша табуға көмектеседі.",
          "The roots sum to −b/a and multiply to c/a. This saves you when a question asks for the sum or product while the roots themselves are irrational: computing them is pointless, the answer falls out of the coefficients. The same trick is how you guess a factorisation in your head."
        ),
        formula: "x₁ + x₂ = −b/a     x₁ · x₂ = c/a",
        example: n("3x² − 12x + 7 = 0  →  x₁ + x₂ = 12/3 = 4"),
      },
      {
        heading: t("Вершина параболы", "Параболаның төбесі", "The vertex"),
        body: t(
          "Вершина находится посередине между корнями: x = −b/(2a). Подставив это x в функцию, получишь минимум (если a > 0) или максимум (если a < 0). В текстовой задаче вершина — это ответ на «при каком значении прибыль наибольшая» или «когда мяч на максимальной высоте». Парабола симметрична, поэтому вершину можно найти и без корней.",
          "Төбе түбірлердің дәл ортасында: x = −b/(2a). Осы x-ті функцияға қойсаң, минимум (a > 0 болса) немесе максимум (a < 0 болса) шығады. Мәтінді есепте төбе — «пайда қай мәнде ең үлкен» немесе «доп қашан ең биікте» деген сұрақтың жауабы. Парабола симметриялы, сондықтан төбені түбірсіз де табуға болады.",
          "The vertex sits halfway between the roots: x = −b/(2a). Substituting that x back gives the minimum (if a > 0) or the maximum (if a < 0). In a word problem the vertex is the answer to \"at what value is profit highest\" or \"when is the ball at its peak\". A parabola is symmetric, so you can find the vertex without knowing the roots at all."
        ),
        formula: "x_вершины = −b/(2a)",
        note: t(
          "Спрашивают «минимальное значение» — это y вершины. Спрашивают «при каком x» — это сама x. Их путают чаще всего.",
          "«Ең кіші мән» сұраса — бұл төбенің y-і. «Қандай x-те» сұраса — бұл x-тің өзі. Оларды жиі шатастырады.",
          "\"Minimum value\" means the y of the vertex. \"At what x\" means the x itself. This is the single most common mix-up."
        ),
      },
      {
        heading: t("Квадратные в текстовых задачах", "Мәтінді есептердегі квадрат теңдеулер", "Quadratics inside word problems"),
        body: t(
          "Квадратное уравнение появляется всюду, где две величины перемножаются: площадь (длина × ширина), путь при равноускоренном движении, выручка (цена × количество, если они связаны). Схема одна: обозначь неизвестное за x, выпиши произведение, приравняй к данному, реши — и обязательно отбрось корень, который не имеет смысла по условию.",
          "Квадрат теңдеу екі шама көбейтілетін жерде пайда болады: аудан (ұзындық × ені), бірқалыпты үдемелі қозғалыстағы жол, түсім (баға × саны, егер олар байланысты болса). Схема біреу: белгісізді x деп ал, көбейтіндіні жаз, берілгенге теңестір, шеш — және шарт бойынша мағынасыз түбірді міндетті түрде алып таста.",
          "A quadratic turns up wherever two quantities multiply: area (length × width), distance under constant acceleration, revenue (price × quantity when the two are linked). The routine never changes: name the unknown x, write the product, set it equal to what you were given, solve — and then throw away the root that makes no sense in context."
        ),
        note: t(
          "Отрицательная длина, отрицательный возраст, отрицательное количество людей — всегда лишний корень. Забыть его отбросить стоит балла.",
          "Теріс ұзындық, теріс жас, адамның теріс саны — әрқашан артық түбір. Оны алып тастауды ұмыту баллға түседі.",
          "A negative length, a negative age, a negative number of people — always the extra root. Forgetting to discard it costs the mark."
        ),
      },
    ],
    worked: [
      {
        title: t("Разложение, когда корни целые", "Түбірлер бүтін болғандағы жіктеу", "Factoring when the roots are whole"),
        problem: n("x² − 7x + 12 = 0"),
        steps: [
          {
            text: t(
              "Ищем два числа, которые в сумме дают 7, а в произведении 12. Перебор короткий: 3 и 4.",
              "Қосындысы 7, көбейтіндісі 12 болатын екі санды іздейміз. Іріктеу қысқа: 3 және 4.",
              "Look for two numbers adding to 7 and multiplying to 12. The search is short: 3 and 4."
            ),
          },
          {
            text: t(
              "Значит, трёхчлен раскладывается в произведение двух скобок.",
              "Демек, үшмүше екі жақшаның көбейтіндісіне жіктеледі.",
              "So the trinomial splits into two brackets."
            ),
            formula: "x² − 7x + 12 = (x − 3)(x − 4)",
          },
          {
            text: t(
              "Произведение равно нулю, когда ноль хотя бы один множитель.",
              "Көбейтінді нөлге тең болады, егер кемінде бір көбейткіш нөл болса.",
              "A product is zero when at least one factor is zero."
            ),
          },
        ],
        answer: n("x = 3, x = 4"),
        takeaway: t(
          "Если a = 1 и коэффициенты небольшие — всегда пробуй разложение первым. Оно занимает секунды там, где формула займёт минуту.",
          "Егер a = 1 болып, коэффициенттер шағын болса — алдымен әрқашан жіктеуді байқа. Формула минут алатын жерде ол секунд алады.",
          "When a = 1 and the coefficients are small, always try factoring first. It takes seconds where the formula takes a minute."
        ),
      },
      {
        title: t("Формула, когда разложение не видно", "Жіктеу көрінбегенде формула", "The formula when nothing factors"),
        problem: n("2x² + 5x − 3 = 0"),
        steps: [
          {
            text: t(
              "Выписываем коэффициенты: a = 2, b = 5, c = −3. Знак c обязательно берём вместе с ним.",
              "Коэффициенттерді жазамыз: a = 2, b = 5, c = −3. c-ның таңбасын міндетті түрде онымен бірге аламыз.",
              "Write the coefficients: a = 2, b = 5, c = −3. The sign of c travels with it."
            ),
          },
          {
            text: t("Считаем дискриминант.", "Дискриминантты санаймыз.", "Compute the discriminant."),
            formula: "D = 5² − 4·2·(−3) = 25 + 24 = 49",
          },
          {
            text: t(
              "D = 49 — полный квадрат, значит корни рациональные, и √49 = 7.",
              "D = 49 — толық квадрат, демек түбірлер рационал, ал √49 = 7.",
              "D = 49 is a perfect square, so the roots are rational and √49 = 7."
            ),
            formula: "x = (−5 ± 7) / 4",
          },
          {
            text: t(
              "Разбираем на два случая: (−5 + 7)/4 и (−5 − 7)/4.",
              "Екі жағдайға бөлеміз: (−5 + 7)/4 және (−5 − 7)/4.",
              "Split into the two cases: (−5 + 7)/4 and (−5 − 7)/4."
            ),
          },
        ],
        answer: n("x = 1/2, x = −3"),
        takeaway: t(
          "Дискриминант — полный квадрат значит, что разложение всё-таки существовало: (2x − 1)(x + 3). Это подсказка на будущее.",
          "Дискриминант толық квадрат болса, жіктеу бәрібір бар еді дегені: (2x − 1)(x + 3). Бұл — болашаққа нұсқау.",
          "A perfect-square discriminant means a factorisation did exist: (2x − 1)(x + 3). Worth remembering next time."
        ),
      },
      {
        title: t("Параметр: ровно один корень", "Параметр: дәл бір түбір", "A parameter: exactly one root"),
        problem: n("kx² − 12x + 9 = 0 has exactly one real solution. Find k."),
        steps: [
          {
            text: t(
              "«Ровно один корень» — это условие на дискриминант, а не на сами корни. Корни считать не нужно.",
              "«Дәл бір түбір» — бұл дискриминантқа қойылған шарт, түбірлерге емес. Түбірлерді санаудың қажеті жоқ.",
              "\"Exactly one root\" is a condition on the discriminant, not on the roots. You never compute a root here."
            ),
          },
          {
            text: t("Приравниваем дискриминант к нулю.", "Дискриминантты нөлге теңестіреміз.", "Set the discriminant to zero."),
            formula: "(−12)² − 4·k·9 = 0  →  144 − 36k = 0",
          },
          {
            text: t(
              "Решаем линейное уравнение относительно k.",
              "k-ға қатысты сызықтық теңдеуді шешеміз.",
              "Solve the resulting linear equation for k."
            ),
          },
        ],
        answer: n("k = 4"),
        takeaway: t(
          "Как только в уравнении появляется буква-параметр и слова «ровно один» / «нет решений» / «два решения» — задача про дискриминант.",
          "Теңдеуде параметр-әріп пайда болып, «дәл бір» / «шешімі жоқ» / «екі шешім» сөздері кездессе — есеп дискриминант туралы.",
          "The moment a lettered parameter appears alongside \"exactly one\" / \"no solutions\" / \"two solutions\", it is a discriminant question."
        ),
      },
      {
        title: t("Текстовая задача на площадь", "Ауданға арналған мәтінді есеп", "An area word problem"),
        problem: n("A rectangular plot is 3 m longer than it is wide. Its area is 130 m². Find its width."),
        steps: [
          {
            text: t(
              "Обозначаем ширину за x. Тогда длина — это x + 3, потому что она на 3 больше.",
              "Енін x деп белгілейміз. Онда ұзындығы x + 3, өйткені ол 3-ке артық.",
              "Call the width x. The length is then x + 3, because it is 3 greater."
            ),
          },
          {
            text: t("Площадь — произведение сторон.", "Аудан — қабырғалардың көбейтіндісі.", "Area is the product of the sides."),
            formula: "x(x + 3) = 130  →  x² + 3x − 130 = 0",
          },
          {
            text: t(
              "Ищем два числа с суммой −3 и произведением −130: это 10 и −13.",
              "Қосындысы −3, көбейтіндісі −130 болатын екі санды іздейміз: бұл 10 және −13.",
              "Two numbers summing to −3 and multiplying to −130: 10 and −13."
            ),
            formula: "(x − 10)(x + 13) = 0  →  x = 10 или x = −13",
          },
          {
            text: t(
              "Ширина не может быть отрицательной, поэтому −13 отбрасываем.",
              "Ені теріс бола алмайды, сондықтан −13-ті алып тастаймыз.",
              "A width cannot be negative, so −13 is discarded."
            ),
          },
        ],
        answer: n("width = 10 m (length 13 m, area 130 m²)"),
        takeaway: t(
          "В текстовой задаче последний шаг — не вычисление, а проверка смысла. Именно на нём чаще всего теряют балл.",
          "Мәтінді есепте соңғы қадам — есептеу емес, мағынаны тексеру. Балл дәл сонда жиі жоғалады.",
          "In a word problem the last step is not arithmetic, it is a sanity check. That is where the mark is usually lost."
        ),
      },
    ],
    pitfalls: [
      {
        wrong: n("3x² + 5x = 2  →  D = 5² − 4·3·2 = 1"),
        right: n("3x² + 5x − 2 = 0  →  D = 5² − 4·3·(−2) = 49"),
        why: t(
          "Формула работает только когда справа ноль. Пока всё не перенесено в одну часть, c — это не то число, которое стоит в уравнении.",
          "Формула оң жағы нөл болғанда ғана жұмыс істейді. Барлығы бір жаққа көшірілмейінше, c — теңдеудегі сан емес.",
          "The formula only applies once the right-hand side is zero. Until everything is moved across, c is not the number you can see."
        ),
      },
      {
        wrong: n("x² − 5x + 6 = 0  →  x = (−5 ± 1)/2"),
        right: n("x² − 5x + 6 = 0  →  x = (5 ± 1)/2"),
        why: t(
          "В формуле стоит −b. Если b уже отрицательное, минус на минус даёт плюс. Знак теряют почти все.",
          "Формулада −b тұр. Егер b теріс болса, минусқа минус плюс береді. Таңбаны бәрі дерлік жоғалтады.",
          "The formula has −b in it. When b is already negative, minus times minus is plus. Almost everyone drops this sign at least once."
        ),
      },
      {
        wrong: n("x² = 7x  →  x = 7"),
        right: n("x² − 7x = 0  →  x(x − 7) = 0  →  x = 0, x = 7"),
        why: t(
          "Делить обе части на x нельзя: если x = 0, ты делишь на ноль и теряешь этот корень. Всегда переноси и раскладывай.",
          "Екі жағын x-ке бөлуге болмайды: егер x = 0 болса, нөлге бөлесің де, сол түбірді жоғалтасың. Әрқашан көшіріп, жіктеп шеш.",
          "You cannot divide both sides by x: if x = 0 you have divided by zero and lost that root. Always move everything across and factor."
        ),
      },
      {
        wrong: n("f(x) = x² − 10x + 34, minimum value = 5"),
        right: n("f(x) = x² − 10x + 34, minimum value = f(5) = 9"),
        why: t(
          "−b/(2a) даёт x вершины, а не значение функции. Спросили «минимальное значение» — надо подставить найденный x обратно.",
          "−b/(2a) төбенің x-ін береді, функцияның мәнін емес. «Ең кіші мән» сұраса — табылған x-ті кері қою керек.",
          "−b/(2a) gives the vertex's x, not the function's value. If the question says \"minimum value\", substitute that x back in."
        ),
      },
    ],
  },

  /* ================= linear equations ================= */
  linear: {
    objectives: [
      t(
        "Решать линейные уравнения и системы, не теряя знаков при переносе",
        "Сызықтық теңдеулер мен жүйелерді таңба жоғалтпай шешу",
        "Solve linear equations and systems without losing a sign in the transfer"
      ),
      t(
        "Определять по коэффициентам, сколько решений у системы, не решая её",
        "Жүйені шешпей-ақ, коэффициенттер бойынша шешім санын анықтау",
        "Read the number of solutions off the coefficients without solving"
      ),
      t(
        "Переводить условие текстовой задачи в уравнение за один проход",
        "Мәтінді есеп шартын бір өтуде теңдеуге айналдыру",
        "Turn a word problem into an equation in a single pass"
      ),
    ],
    sections: [
      {
        heading: t("Что можно делать с уравнением", "Теңдеумен не істеуге болады", "What you may do to an equation"),
        body: t(
          "Разрешено ровно четыре действия: прибавить одно и то же к обеим частям, вычесть, умножить обе части на ненулевое число, разделить на ненулевое. Всё остальное меняет множество решений. Именно поэтому нельзя делить на выражение с переменной — оно может оказаться нулём.",
          "Дәл төрт әрекетке рұқсат: екі жаққа бірдей санды қосу, азайту, екі жақты нөлге тең емес санға көбейту, бөлу. Қалғанының бәрі шешімдер жиынын өзгертеді. Сондықтан айнымалысы бар өрнекке бөлуге болмайды — ол нөл болып шығуы мүмкін.",
          "Exactly four moves are allowed: add the same thing to both sides, subtract it, multiply both sides by a non-zero number, divide by one. Everything else changes the solution set. That is precisely why you may not divide by an expression containing the variable — it might be zero."
        ),
      },
      {
        heading: t("Сколько решений у системы", "Жүйенің неше шешімі бар", "How many solutions a system has"),
        body: t(
          "Сравни коэффициенты. Если отношения при x и при y равны, а отношение свободных членов другое — прямые параллельны, решений нет. Если равны все три отношения — это одна и та же прямая, решений бесконечно много. Если отношения при x и y различаются — ровно одно решение. На это уходит пять секунд и не нужно ничего решать.",
          "Коэффициенттерді салыстыр. Егер x пен y-тегі қатынастар тең, ал бос мүшелердің қатынасы басқа болса — түзулер параллель, шешім жоқ. Үш қатынас та тең болса — бұл бір түзу, шешім шексіз көп. x пен y-тегі қатынастар әртүрлі болса — дәл бір шешім. Бұған бес секунд кетеді және ештеңе шешудің қажеті жоқ.",
          "Compare the coefficients. If the x-ratio equals the y-ratio but the constant ratio differs, the lines are parallel and there is no solution. If all three ratios match, it is the same line and there are infinitely many. If the x- and y-ratios differ, there is exactly one. This takes five seconds and no algebra."
        ),
        formula: "a₁/a₂ = b₁/b₂ ≠ c₁/c₂  →  нет решений",
        example: n("3x + ky = 12 and 9x + 15y = 7 have no solution  →  3/9 = k/15  →  k = 5"),
      },
      {
        heading: t("Наклон — это скорость изменения", "Көлбеу — өзгеру жылдамдығы", "Slope is a rate of change"),
        body: t(
          "В любой текстовой задаче формулировка «на столько-то за единицу» — это наклон, а «изначально, до начала» — свободный член. Как только ты научился слышать эти два слова, половина задач на составление уравнения решается на слух.",
          "Кез келген мәтінді есепте «бір бірлікке сонша» деген тұжырым — көлбеу, ал «бастапқыда, басталғанға дейін» — бос мүше. Осы екі сөзді естуді үйренсең, теңдеу құруға берілген есептердің жартысы құлақпен шешіледі.",
          "In any word problem, \"so much per unit\" is the slope and \"to begin with, before anything happened\" is the intercept. Once you can hear those two phrases, half of all equation-building questions solve themselves."
        ),
        example: n("Joining fee $30 plus $15 a month  →  C = 15m + 30"),
        note: t(
          "Если величина убывает — наклон отрицательный. «Теряет 12% в год» — это не наклон, а множитель: там показательная модель, а не линейная.",
          "Егер шама кемісе — көлбеу теріс. «Жылына 12% жоғалтады» — бұл көлбеу емес, көбейткіш: онда сызықтық емес, көрсеткіштік модель.",
          "If the quantity falls, the slope is negative. But \"loses 12% a year\" is not a slope, it is a multiplier — that is an exponential model, not a linear one."
        ),
      },
    ],
    worked: [
      {
        title: t("Уравнение со скобками и дробями", "Жақшалы және бөлшекті теңдеу", "Brackets and fractions"),
        problem: n("(2x − 1)/3 + 4 = (x + 7)/2"),
        steps: [
          {
            text: t(
              "Умножаем обе части на 6 — наименьшее общее кратное знаменателей. Дроби исчезают.",
              "Екі жақты 6-ға көбейтеміз — бөлімдердің ең кіші ортақ еселігі. Бөлшектер жоғалады.",
              "Multiply both sides by 6, the lowest common multiple of the denominators. The fractions vanish."
            ),
            formula: "2(2x − 1) + 24 = 3(x + 7)",
          },
          {
            text: t(
              "Раскрываем скобки, следя за знаками.",
              "Таңбаларды бақылай отырып, жақшаларды ашамыз.",
              "Expand, watching the signs."
            ),
            formula: "4x − 2 + 24 = 3x + 21",
          },
          {
            text: t(
              "Переносим x влево, числа вправо.",
              "x-ті солға, сандарды оңға көшіреміз.",
              "Move the x terms left and the numbers right."
            ),
            formula: "4x − 3x = 21 − 22",
          },
        ],
        answer: n("x = −1"),
        takeaway: t(
          "Первым делом всегда убирай дроби умножением на общий знаменатель. Дальше уравнение становится обычным.",
          "Ең алдымен ортақ бөлімге көбейтіп, бөлшектерден құтыл. Одан әрі теңдеу қарапайымға айналады.",
          "Always clear the fractions first by multiplying through. After that it is an ordinary equation."
        ),
      },
      {
        title: t("Система методом сложения", "Қосу тәсілімен жүйе", "A system by elimination"),
        problem: n("5a + 2b = 26 ;  3a + 2b = 18"),
        steps: [
          {
            text: t(
              "Коэффициенты при b уже одинаковы, поэтому вычитаем второе уравнение из первого — b уходит.",
              "b-дағы коэффициенттер бірдей, сондықтан екінші теңдеуді біріншіден азайтамыз — b кетеді.",
              "The b coefficients already match, so subtract the second equation from the first and b disappears."
            ),
            formula: "2a = 8  →  a = 4",
          },
          {
            text: t(
              "Подставляем найденное a в любое из уравнений.",
              "Табылған a-ны кез келген теңдеуге қоямыз.",
              "Substitute a back into either equation."
            ),
            formula: "3·4 + 2b = 18  →  2b = 6",
          },
        ],
        answer: n("a = 4, b = 3"),
        takeaway: t(
          "Если коэффициент при одной переменной совпадает — вычитание убирает её мгновенно. Подбирать множители не всегда нужно.",
          "Егер бір айнымалының коэффициенті сәйкес келсе — азайту оны бірден жояды. Көбейткіш таңдау әрқашан қажет емес.",
          "When one variable's coefficient already matches, subtraction removes it instantly. You do not always need to scale first."
        ),
      },
    ],
    pitfalls: [
      {
        wrong: n("−(x − 4) = −x − 4"),
        right: n("−(x − 4) = −x + 4"),
        why: t(
          "Минус перед скобкой меняет знак каждого слагаемого внутри, а не только первого.",
          "Жақша алдындағы минус ішіндегі әр қосылғыштың таңбасын өзгертеді, тек біріншісін емес.",
          "A minus in front of a bracket flips the sign of every term inside, not only the first one."
        ),
      },
      {
        wrong: n("2(x + 3) = 2x + 3"),
        right: n("2(x + 3) = 2x + 6"),
        why: t(
          "Множитель распределяется на всё, что в скобке. Это та ошибка, которую делают на автомате и не замечают при проверке.",
          "Көбейткіш жақшадағының бәріне таралады. Бұл — автоматпен жіберіліп, тексергенде байқалмайтын қате.",
          "The multiplier distributes over everything in the bracket. This one gets made on autopilot and survives a re-read."
        ),
      },
    ],
  },

  /* ================= functions ================= */
  functions: {
    objectives: [
      t(
        "Читать график: находить нули, знак, промежутки возрастания",
        "Графикті оқу: нөлдерін, таңбасын, өсу аралықтарын табу",
        "Read a graph: find its zeros, its sign, and where it increases"
      ),
      t(
        "Понимать, что делает с графиком каждое преобразование f(x ± a), f(x) ± b, −f(x)",
        "f(x ± a), f(x) ± b, −f(x) түрлендірулерінің графикке не істейтінін түсіну",
        "Know what each transformation f(x ± a), f(x) ± b, −f(x) does to a graph"
      ),
      t(
        "Вычислять композицию функций, не путая порядок",
        "Функциялар композициясын ретін шатастырмай есептеу",
        "Compute a composition without reversing the order"
      ),
    ],
    sections: [
      {
        heading: t("Сдвиги: знак внутри обманывает", "Ығысулар: іштегі таңба алдайды", "Shifts: the inner sign lies"),
        body: t(
          "f(x − 3) сдвигает график на 3 вправо, а не влево. Причина простая: чтобы получить прежнее значение, теперь нужно взять x на 3 больше. А вот f(x) + 5 сдвигает вверх, и здесь знак работает как ожидается. Внутри скобки — наоборот, снаружи — как написано.",
          "f(x − 3) графикті 3-ке оңға ығыстырады, солға емес. Себебі қарапайым: бұрынғы мәнді алу үшін енді x-ті 3-ке үлкен алу керек. Ал f(x) + 5 жоғары ығыстырады, мұнда таңба күткендей жұмыс істейді. Жақша ішінде — керісінше, сыртында — жазылғандай.",
          "f(x − 3) shifts the graph 3 to the right, not the left. The reason is simple: to get the old output you now need an x that is 3 larger. But f(x) + 5 shifts upward, where the sign behaves as written. Inside the bracket it is reversed; outside it is literal."
        ),
        formula: "f(x − a) → вправо на a     f(x) + b → вверх на b",
        example: n("g(x) = f(x − 3) + 5, min of f at (2, −4)  →  min of g at (5, 1)"),
      },
      {
        heading: t("Композиция: считаем изнутри", "Композиция: іштен санаймыз", "Composition works inside out"),
        body: t(
          "g(f(3)) означает: сначала найди f(3), потом подставь результат в g. Порядок нельзя менять местами — f(g(3)) почти всегда даёт другое число. Если запутался, посчитай внутреннюю скобку отдельно и запиши промежуточный результат.",
          "g(f(3)) дегеніміз: алдымен f(3)-ті тап, содан кейін нәтижені g-ға қой. Ретін ауыстыруға болмайды — f(g(3)) әрдайым дерлік басқа сан береді. Шатассаң, ішкі жақшаны бөлек санап, аралық нәтижені жазып қой.",
          "g(f(3)) means: find f(3) first, then feed the result into g. The order is not interchangeable — f(g(3)) almost always gives something else. If you lose track, evaluate the inner bracket separately and write the intermediate value down."
        ),
        example: n("f(x) = 3x − 5, g(x) = x² + 2  →  f(3) = 4, g(4) = 18"),
      },
      {
        heading: t("Область определения", "Анықталу облысы", "Domain"),
        body: t(
          "Три запрета: нельзя делить на ноль, нельзя брать корень чётной степени из отрицательного, нельзя логарифмировать неположительное. Область определения — это всё, кроме того, что нарушает эти три правила. Больше ничего проверять не нужно.",
          "Үш тыйым: нөлге бөлуге болмайды, теріс саннан жұп дәрежелі түбір алуға болмайды, оң емес саннан логарифм алуға болмайды. Анықталу облысы — осы үш ережені бұзатыннан басқасының бәрі. Одан артық тексерудің қажеті жоқ.",
          "Three prohibitions: no dividing by zero, no even root of a negative, no logarithm of a non-positive number. The domain is everything that does not break one of those three. There is nothing else to check."
        ),
      },
    ],
    worked: [
      {
        title: t("Линейная функция по двум точкам", "Екі нүкте бойынша сызықтық функция", "A linear function from two points"),
        problem: n("h is linear, h(2) = 17 and h(6) = 5. Find h(0)."),
        steps: [
          {
            text: t("Наклон — это изменение y, делённое на изменение x.", "Көлбеу — y өзгерісінің x өзгерісіне қатынасы.", "The slope is the change in y over the change in x."),
            formula: "(5 − 17) / (6 − 2) = −12/4 = −3",
          },
          {
            text: t(
              "От x = 2 к x = 0 мы идём назад на 2 шага, значит прибавляем 2 · 3 = 6.",
              "x = 2-ден x = 0-ге 2 қадам артқа жүреміз, демек 2 · 3 = 6 қосамыз.",
              "Going back from x = 2 to x = 0 is two steps, so we add 2 × 3 = 6."
            ),
          },
        ],
        answer: n("h(0) = 23"),
        takeaway: t(
          "Не обязательно выписывать y = kx + b. Двигаться по наклону от известной точки часто быстрее.",
          "y = kx + b деп жазу міндетті емес. Белгілі нүктеден көлбеу бойынша жылжу жиі жылдамырақ.",
          "You do not have to write y = kx + b. Stepping along the slope from a known point is often quicker."
        ),
      },
      {
        title: t("Преобразование графика", "Графикті түрлендіру", "Transforming a graph"),
        problem: n("g(x) = f(x − 3) + 5. The minimum of f is at (2, −4). Where is the minimum of g?"),
        steps: [
          {
            text: t(
              "Внутри скобки стоит −3, значит график сдвигается вправо на 3: x переходит из 2 в 5.",
              "Жақша ішінде −3 тұр, демек график оңға 3-ке ығысады: x 2-ден 5-ке ауысады.",
              "The −3 inside the bracket shifts the graph 3 to the right: x moves from 2 to 5."
            ),
          },
          {
            text: t(
              "Снаружи +5 — сдвиг вверх на 5: y переходит из −4 в 1.",
              "Сыртында +5 — жоғары 5-ке ығысу: y −4-тен 1-ге ауысады.",
              "The +5 outside shifts it up by 5: y moves from −4 to 1."
            ),
          },
          {
            text: t(
              "Форма графика не меняется, поэтому минимум остаётся минимумом.",
              "График пішіні өзгермейді, сондықтан минимум минимум күйінде қалады.",
              "The shape is unchanged, so a minimum stays a minimum."
            ),
          },
        ],
        answer: n("(5, 1)"),
        takeaway: t(
          "Сдвиг не меняет тип точки. Минимум остаётся минимумом, пересечение — пересечением. Меняются только координаты.",
          "Ығысу нүкте түрін өзгертпейді. Минимум минимум, қиылысу қиылысу күйінде қалады. Тек координаталар өзгереді.",
          "A shift never changes what a point is. A minimum stays a minimum, an intercept stays an intercept. Only the coordinates move."
        ),
      },
    ],
    pitfalls: [
      {
        wrong: n("f(x + 2) shifts the graph 2 to the right"),
        right: n("f(x + 2) shifts the graph 2 to the left"),
        why: t(
          "Внутри аргумента знак работает наоборот. Проверь на точке: если раньше значение было при x = 0, теперь оно при x = −2.",
          "Аргумент ішінде таңба керісінше жұмыс істейді. Нүктемен тексер: бұрын мән x = 0-де болса, енді ол x = −2-де.",
          "Inside the argument the sign is inverted. Test it on a point: what used to happen at x = 0 now happens at x = −2."
        ),
      },
      {
        wrong: n("g(f(3)) = f(g(3))"),
        right: n("g(f(3)) is computed inside first: f(3), then g of that"),
        why: t(
          "Композиция не коммутативна. Внешняя функция та, что стоит слева.",
          "Композиция коммутативті емес. Сыртқы функция — сол жақта тұрғаны.",
          "Composition is not commutative. The outer function is the one on the left."
        ),
      },
    ],
  },
};
