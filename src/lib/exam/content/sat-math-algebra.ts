import type { ExamItem } from "../types";

/**
 * SAT Math — Algebra and Advanced Math.
 *
 * The difficulty mix and the question archetypes here follow the PrepPros
 * "Advanced Digital SAT Math" taxonomy, which is built around the item types that
 * separate a 650 from an 800: parameters chosen so a system has no solution or
 * infinitely many, discriminants set to zero, exponent equations solved for the
 * exponent, and systems where the answer is an expression rather than a variable.
 * Every problem below is written for this app; nothing is reproduced from the book.
 *
 * Roughly a quarter are student-produced responses (grid-ins), matching the real
 * section, which is why many items carry a `text` answer instead of options.
 */

export const SAT_MATH_ALGEBRA: ExamItem[] = [
  {
    id: "m-alg-01",
    skill: "Algebra",
    topic: "Linear models",
    difficulty: "easy",
    stem: "A translator charges 4,500 tenge for the first page of a document and 1,800 tenge for each page after the first. Which function gives the total charge C, in tenge, for a document of p pages, where p ≥ 1?",
    options: ["C(p) = 1,800p + 4,500", "C(p) = 1,800p + 2,700", "C(p) = 4,500p + 1,800", "C(p) = 6,300p"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Only p − 1 pages are billed at 1,800: C = 4,500 + 1,800(p − 1) = 1,800p + 2,700. Check p = 1: C = 4,500. ✓",
      ru: "По 1 800 оплачиваются только p − 1 страниц: C = 4 500 + 1 800(p − 1) = 1 800p + 2 700. Проверка при p = 1: C = 4 500. ✓",
    },
    trap: {
      en: "Option A charges 1,800 for the first page as well, giving 6,300 for a one-page document.",
      ru: "Вариант A берёт 1 800 и за первую страницу — за одностраничный документ выходит 6 300.",
    },
  },
  {
    id: "m-alg-02",
    skill: "Algebra",
    topic: "Systems with no solution",
    difficulty: "medium",
    stem: "3x + ky = 12\n9x + 15y = 7\n\nIn the given system of equations, k is a constant. If the system has no solution, what is the value of k?",
    answer: { kind: "text", accept: ["5"] },
    explain: {
      en: "No solution means the lines are parallel: the x and y coefficients are proportional while the constants are not. 3/9 = k/15 gives k = 5. The constants 12 and 7 are not in that ratio, so the system is genuinely inconsistent.",
      ru: "Нет решений — прямые параллельны: коэффициенты при x и y пропорциональны, а свободные члены нет. 3/9 = k/15 даёт k = 5. Свободные члены 12 и 7 в это отношение не попадают, значит, система действительно несовместна.",
    },
    trap: {
      en: "If the constants had also matched the ratio, the answer would have been \"infinitely many solutions\", not \"none\". Always check the third ratio.",
      ru: "Если бы и свободные члены попали в то же отношение, было бы «бесконечно много решений», а не «нет». Третье отношение проверяй всегда.",
    },
  },
  {
    id: "m-alg-03",
    skill: "Algebra",
    topic: "Systems with infinitely many solutions",
    difficulty: "hard",
    stem: "ax + 6y = 18\n4x + 12y = b\n\nIn the given system of equations, a and b are constants. If the system has infinitely many solutions, what is the value of a + b?",
    answer: { kind: "text", accept: ["38"] },
    explain: {
      en: "Infinitely many solutions means the two equations are the same line, so all three ratios match. From the y terms, 6/12 = 1/2, so a/4 = 1/2 gives a = 2 and 18/b = 1/2 gives b = 36. Therefore a + b = 38.",
      ru: "Бесконечно много решений — это одна и та же прямая, значит, совпадают все три отношения. По y: 6/12 = 1/2, отсюда a/4 = 1/2 → a = 2, и 18/b = 1/2 → b = 36. Итого a + b = 38.",
    },
  },
  {
    id: "m-alg-04",
    skill: "Advanced Math",
    topic: "Discriminant",
    difficulty: "medium",
    stem: "kx² − 12x + 9 = 0\n\nIn the given equation, k is a nonzero constant. If the equation has exactly one real solution, what is the value of k?",
    answer: { kind: "text", accept: ["4"] },
    explain: {
      en: "Exactly one real solution means the discriminant is zero: b² − 4ac = 144 − 36k = 0, so k = 4.",
      ru: "Ровно одно действительное решение — дискриминант равен нулю: b² − 4ac = 144 − 36k = 0, значит, k = 4.",
    },
  },
  {
    id: "m-alg-05",
    skill: "Advanced Math",
    topic: "Discriminant",
    difficulty: "hard",
    stem: "The quadratic equation ax² + 40x + c = 0 has exactly one real solution, where a and c are constants. What is the value of ac?",
    answer: { kind: "text", accept: ["400"] },
    explain: {
      en: "One real solution puts the discriminant at zero: 40² − 4ac = 0, so 4ac = 1,600 and ac = 400. Neither a nor c is determined alone — only their product is, which is exactly what the question asks for.",
      ru: "Одно решение — дискриминант ноль: 40² − 4ac = 0, отсюда 4ac = 1 600 и ac = 400. По отдельности ни a, ни c не находятся — определено только произведение, о нём и спрашивают.",
    },
    trap: {
      en: "Students often stall looking for a and c separately. When a question asks for a product or a sum, the individual values are usually not recoverable.",
      ru: "Многие застревают, пытаясь найти a и c по отдельности. Если спрашивают произведение или сумму, значения по отдельности обычно и не находятся.",
    },
  },
  {
    id: "m-alg-06",
    skill: "Advanced Math",
    topic: "Zeros and vertex",
    difficulty: "hard",
    stem: "(x + 5) is a factor of the quadratic function f, and x = r is the positive zero of f. The minimum of f occurs at the point (1, −18). What is the value of r?",
    answer: { kind: "text", accept: ["7"] },
    explain: {
      en: "A parabola is symmetric about its vertex, so the vertex x-value is the midpoint of the two zeros. The zeros are −5 and r, and the vertex is at x = 1: (−5 + r)/2 = 1, so r = 7.",
      ru: "Парабола симметрична относительно вершины, поэтому x вершины — середина между корнями. Корни −5 и r, вершина при x = 1: (−5 + r)/2 = 1, значит, r = 7.",
    },
    trap: {
      en: "The value −18 is not needed. Extra information is a standard hard-question device — identify what the symmetry alone gives you.",
      ru: "Число −18 не нужно. Лишние данные — типичный приём в сложных задачах: сначала пойми, что даёт одна только симметрия.",
    },
  },
  {
    id: "m-alg-07",
    skill: "Advanced Math",
    topic: "Zeros and coefficients",
    difficulty: "medium",
    stem: "The function f is defined by f(x) = x² + bx + c, where b and c are constants. If (x + 7) is a factor of f and 3 is the other zero of f, what is the value of b + c?",
    options: ["−17", "−4", "4", "25"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The zeros are −7 and 3, so f(x) = (x + 7)(x − 3) = x² + 4x − 21. Then b = 4 and c = −21, so b + c = −17.",
      ru: "Корни −7 и 3, значит, f(x) = (x + 7)(x − 3) = x² + 4x − 21. Тогда b = 4, c = −21 и b + c = −17.",
    },
    trap: {
      en: "The factor (x + 7) corresponds to the zero x = −7, not x = 7. Sign-flipping here is the most common single error on factor questions.",
      ru: "Множителю (x + 7) соответствует корень x = −7, а не x = 7. Путаница со знаком — самая частая ошибка в задачах на множители.",
    },
  },
  {
    id: "m-alg-08",
    skill: "Advanced Math",
    topic: "Line and parabola",
    difficulty: "hard",
    stem: "y = 2x² + 8x + c\ny = 3x + 1\n\nIn the given system, c is a constant. The graphs intersect at exactly one point in the xy-plane. What is the value of c?",
    answer: { kind: "text", accept: ["33/8", "4.125"] },
    explain: {
      en: "Set them equal: 2x² + 8x + c = 3x + 1, so 2x² + 5x + (c − 1) = 0. One intersection means the discriminant is zero: 25 − 8(c − 1) = 0, so 8c = 33 and c = 33/8.",
      ru: "Приравняем: 2x² + 8x + c = 3x + 1, отсюда 2x² + 5x + (c − 1) = 0. Одна точка пересечения — дискриминант ноль: 25 − 8(c − 1) = 0, значит, 8c = 33 и c = 33/8.",
    },
  },
  {
    id: "m-alg-09",
    skill: "Advanced Math",
    topic: "Exponential models",
    difficulty: "hard",
    stem: "A model estimates that a petri dish initially holds 24,000 bacteria. Fourteen days later the model estimates 96,000 bacteria. Assuming the growth is exponential and follows N = 24,000 · 2^(t/k), where t is the number of days and k is a constant, what is the value of k?",
    answer: { kind: "text", accept: ["7"] },
    explain: {
      en: "96,000 / 24,000 = 4, so 2^(14/k) = 4 = 2². The exponents must match: 14/k = 2, so k = 7. In words: the population doubles every 7 days.",
      ru: "96 000 / 24 000 = 4, значит, 2^(14/k) = 4 = 2². Показатели равны: 14/k = 2, отсюда k = 7. Словами: популяция удваивается каждые 7 дней.",
    },
    trap: {
      en: "k is the doubling time, not the number of doublings. Quadrupling in 14 days is two doublings, so each takes 7 days.",
      ru: "k — это время удвоения, а не число удвоений. Учетверение за 14 дней — это два удвоения, значит, на каждое приходится 7 дней.",
    },
  },
  {
    id: "m-alg-10",
    skill: "Advanced Math",
    topic: "Exponential models",
    difficulty: "medium",
    stem: "A machine purchased for 480,000 tenge loses 12% of its value each year. Which function gives the value V, in tenge, of the machine t years after purchase?",
    options: ["V(t) = 480,000(0.12)^t", "V(t) = 480,000(1.12)^t", "V(t) = 480,000(0.88)^t", "V(t) = 480,000 − 0.12t"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "Losing 12% leaves 88%, so each year the value is multiplied by 0.88: V(t) = 480,000(0.88)^t.",
      ru: "Потеря 12% оставляет 88%, поэтому каждый год стоимость умножается на 0,88: V(t) = 480 000(0,88)^t.",
    },
    trap: {
      en: "Option D describes a constant loss of 0.12 tenge per year — linear, not percentage, decay.",
      ru: "Вариант D описывает постоянную потерю в 0,12 тенге в год — линейное убывание, а не процентное.",
    },
  },
  {
    id: "m-alg-11",
    skill: "Advanced Math",
    topic: "Rational exponents",
    difficulty: "medium",
    stem: "If x^(3/4) = 27 and x > 0, what is the value of x?",
    answer: { kind: "text", accept: ["81"] },
    explain: {
      en: "Raise both sides to the 4/3 power: x = 27^(4/3) = (27^(1/3))⁴ = 3⁴ = 81.",
      ru: "Возведём обе части в степень 4/3: x = 27^(4/3) = (27^(1/3))⁴ = 3⁴ = 81.",
    },
  },
  {
    id: "m-alg-12",
    skill: "Advanced Math",
    topic: "Rational exponents",
    difficulty: "hard",
    stem: "The numbers a and b are both greater than zero, and the cube root of a is equal to the fourth root of b. For what value of n is aⁿ equal to b?",
    answer: { kind: "text", accept: ["4/3", "1.333", "1.3333"] },
    explain: {
      en: "a^(1/3) = b^(1/4). Raise both sides to the 3rd power: a = b^(3/4). Then aⁿ = b^(3n/4), and setting that equal to b¹ gives 3n/4 = 1, so n = 4/3.",
      ru: "a^(1/3) = b^(1/4). Возведём обе части в куб: a = b^(3/4). Тогда aⁿ = b^(3n/4), приравняв к b¹, получаем 3n/4 = 1, значит, n = 4/3.",
    },
    trap: {
      en: "Grid-ins accept 4/3; a rounded 1.33 is outside the accepted range on the real test. Enter the fraction.",
      ru: "В grid-in вводи 4/3: округлённое 1,33 на реальном экзамене не засчитается. Пиши дробь.",
    },
  },
  {
    id: "m-alg-13",
    skill: "Advanced Math",
    topic: "Equations in quadratic form",
    difficulty: "hard",
    stem: "x⁴ − 13x² + 36 = 0\n\nWhat is the greatest solution to the given equation?",
    answer: { kind: "text", accept: ["3"] },
    explain: {
      en: "Let u = x². Then u² − 13u + 36 = 0 factors as (u − 4)(u − 9) = 0, so x² = 4 or x² = 9. The solutions are ±2 and ±3, and the greatest is 3.",
      ru: "Пусть u = x². Тогда u² − 13u + 36 = 0 раскладывается как (u − 4)(u − 9) = 0, значит, x² = 4 или x² = 9. Решения ±2 и ±3, наибольшее — 3.",
    },
    trap: {
      en: "Stopping at u = 9 and answering 9 is the designed mistake — u is x², not x.",
      ru: "Остановиться на u = 9 и написать 9 — это и есть заложенная ошибка: u — это x², а не x.",
    },
  },
  {
    id: "m-alg-14",
    skill: "Algebra",
    topic: "Absolute value",
    difficulty: "medium",
    stem: "|2x − 7| = 11\n\nWhat is the sum of the solutions to the given equation?",
    answer: { kind: "text", accept: ["7"] },
    explain: {
      en: "Split into 2x − 7 = 11 giving x = 9, and 2x − 7 = −11 giving x = −2. The sum is 7.",
      ru: "Разбиваем: 2x − 7 = 11 даёт x = 9, и 2x − 7 = −11 даёт x = −2. Сумма равна 7.",
    },
    trap: {
      en: "Solving only the positive case and answering 9 loses the second root. An absolute-value equation almost always has two.",
      ru: "Решить только положительный случай и написать 9 — потерять второй корень. У уравнения с модулем почти всегда два решения.",
    },
  },
  {
    id: "m-alg-15",
    skill: "Advanced Math",
    topic: "Function notation",
    difficulty: "easy",
    stem: "The functions f and g are defined by f(x) = 3x − 5 and g(x) = x² + 2. What is the value of g(f(3))?",
    answer: { kind: "text", accept: ["18"] },
    explain: {
      en: "Work from the inside out: f(3) = 9 − 5 = 4, then g(4) = 16 + 2 = 18.",
      ru: "Считаем изнутри наружу: f(3) = 9 − 5 = 4, затем g(4) = 16 + 2 = 18.",
    },
    trap: {
      en: "Computing f(g(3)) instead gives 3(11) − 5 = 28. Composition is not commutative — read which function is on the outside.",
      ru: "Если посчитать f(g(3)), выйдет 3·11 − 5 = 28. Композиция не коммутативна — смотри, какая функция снаружи.",
    },
  },
  {
    id: "m-alg-16",
    skill: "Algebra",
    topic: "Linear functions",
    difficulty: "medium",
    stem: "The function h is linear, h(2) = 17, and h(6) = 5. What is the value of h(0)?",
    answer: { kind: "text", accept: ["23"] },
    explain: {
      en: "The slope is (5 − 17)/(6 − 2) = −3. Going back from x = 2 to x = 0 adds 2 × 3 = 6, so h(0) = 17 + 6 = 23.",
      ru: "Наклон равен (5 − 17)/(6 − 2) = −3. Идя от x = 2 к x = 0, прибавляем 2 · 3 = 6, значит, h(0) = 17 + 6 = 23.",
    },
  },
  {
    id: "m-alg-17",
    skill: "Algebra",
    topic: "Systems of inequalities",
    difficulty: "medium",
    stem: "y > 2x − 3\ny ≤ −x + 6\n\nWhich of the following ordered pairs (x, y) is a solution to the given system of inequalities?",
    options: ["(4, 1)", "(1, 4)", "(3, 4)", "(0, −4)"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Test (1, 4): 4 > 2(1) − 3 = −1 ✓ and 4 ≤ −1 + 6 = 5 ✓. Both hold, so (1, 4) works.",
      ru: "Проверим (1, 4): 4 > 2·1 − 3 = −1 ✓ и 4 ≤ −1 + 6 = 5 ✓. Оба условия выполнены, значит, (1, 4) подходит.",
    },
    trap: {
      en: "(3, 4) satisfies the first inequality but fails the second: 4 ≤ 3 is false. Always test both — a point that passes one is designed to look right.",
      ru: "(3, 4) проходит первое неравенство, но не второе: 4 ≤ 3 неверно. Проверяй оба — точка, проходящая одно, специально выглядит правдоподобно.",
    },
  },
  {
    id: "m-alg-18",
    skill: "Algebra",
    topic: "Systems word problems",
    difficulty: "medium",
    stem: "A workshop sells stools for 6,000 tenge each and tables for 22,000 tenge each. Last month it sold 47 items in total for 586,000 tenge. How many tables did it sell?",
    answer: { kind: "text", accept: ["19"] },
    explain: {
      en: "With s stools and t tables: s + t = 47 and 6,000s + 22,000t = 586,000. Substituting s = 47 − t gives 282,000 + 16,000t = 586,000, so 16,000t = 304,000 and t = 19.",
      ru: "Пусть s — табуреты, t — столы: s + t = 47 и 6 000s + 22 000t = 586 000. Подставив s = 47 − t, получаем 282 000 + 16 000t = 586 000, отсюда 16 000t = 304 000 и t = 19.",
    },
  },
  {
    id: "m-alg-19",
    skill: "Algebra",
    topic: "Rational equations",
    difficulty: "medium",
    stem: "5/(x − 2) = 15/(x + 4)\n\nWhat value of x satisfies the given equation?",
    answer: { kind: "text", accept: ["5"] },
    explain: {
      en: "Cross-multiply: 5(x + 4) = 15(x − 2), so 5x + 20 = 15x − 30, giving 10x = 50 and x = 5. Neither denominator is zero at x = 5, so the solution is valid.",
      ru: "Перемножим крест-накрест: 5(x + 4) = 15(x − 2), отсюда 5x + 20 = 15x − 30, значит, 10x = 50 и x = 5. При x = 5 ни один знаменатель не обнуляется, решение годится.",
    },
    trap: {
      en: "Always check the answer against the excluded values (here x ≠ 2 and x ≠ −4). A rational equation can produce a root that has to be thrown away.",
      ru: "Всегда сверяй ответ с запрещёнными значениями (здесь x ≠ 2 и x ≠ −4). Дробное уравнение может дать корень, который придётся отбросить.",
    },
  },
  {
    id: "m-alg-20",
    skill: "Algebra",
    topic: "Systems solved for an expression",
    difficulty: "hard",
    stem: "(a − b) − 16(c + d) = 300\n(a − b) + 12(c + d) = 720\n\nFor the given system of equations, what is the value of 7(a − b)?",
    answer: { kind: "text", accept: ["3780"] },
    explain: {
      en: "Treat u = a − b and v = c + d as single unknowns. Subtracting the first equation from the second gives 28v = 420, so v = 15. Then u = 720 − 12(15) = 540, and 7u = 3,780.",
      ru: "Считай u = a − b и v = c + d отдельными неизвестными. Вычитая первое уравнение из второго, получаем 28v = 420, значит, v = 15. Тогда u = 720 − 12·15 = 540, и 7u = 3 780.",
    },
    trap: {
      en: "There is no way to find a, b, c or d individually — four unknowns, two equations. Recognising that the grouped expressions *are* the unknowns is the whole problem.",
      ru: "Найти a, b, c, d по отдельности невозможно: четыре неизвестных, два уравнения. Вся задача — понять, что неизвестные и есть эти скобки.",
    },
  },
  {
    id: "m-alg-21",
    skill: "Algebra",
    topic: "Parallel and perpendicular lines",
    difficulty: "medium",
    stem: "Line ℓ passes through the point (−4, 9) and is perpendicular to the line with equation 3x + 6y = 18. What is the y-coordinate of the y-intercept of line ℓ?",
    answer: { kind: "text", accept: ["17"] },
    explain: {
      en: "Rewrite 3x + 6y = 18 as y = −½x + 3, so its slope is −½ and the perpendicular slope is 2. Using y = 2x + b through (−4, 9): 9 = −8 + b, so b = 17.",
      ru: "Перепишем 3x + 6y = 18 как y = −½x + 3, наклон равен −½, перпендикулярный — 2. Подставим (−4, 9) в y = 2x + b: 9 = −8 + b, значит, b = 17.",
    },
  },
  {
    id: "m-alg-22",
    skill: "Advanced Math",
    topic: "Polynomial factors",
    difficulty: "medium",
    stem: "The polynomial p is defined by p(x) = x³ − 4x² + x + 6. Which of the following must be a factor of p?",
    options: ["x − 1", "x + 2", "x − 3", "x + 6"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "By the factor theorem, (x − k) is a factor exactly when p(k) = 0. Here p(3) = 27 − 36 + 3 + 6 = 0, so (x − 3) is a factor.",
      ru: "По теореме Безу (x − k) — множитель тогда и только тогда, когда p(k) = 0. Здесь p(3) = 27 − 36 + 3 + 6 = 0, значит, (x − 3) — множитель.",
    },
    trap: {
      en: "For option B you must test p(−2), not p(2). The factor (x + 2) corresponds to the root −2.",
      ru: "Для варианта B нужно проверять p(−2), а не p(2): множителю (x + 2) отвечает корень −2.",
    },
  },
  {
    id: "m-alg-23",
    skill: "Advanced Math",
    topic: "Quadratic minimum",
    difficulty: "easy",
    stem: "What is the minimum value of the function f defined by f(x) = x² − 10x + 34?",
    answer: { kind: "text", accept: ["9"] },
    explain: {
      en: "The vertex sits at x = −b/(2a) = 10/2 = 5, and f(5) = 25 − 50 + 34 = 9. Completing the square shows the same thing: f(x) = (x − 5)² + 9.",
      ru: "Вершина при x = −b/(2a) = 10/2 = 5, и f(5) = 25 − 50 + 34 = 9. Выделение полного квадрата даёт то же: f(x) = (x − 5)² + 9.",
    },
    trap: {
      en: "The question asks for the minimum *value* (the y-coordinate), not the x that produces it. Answering 5 is the standard slip.",
      ru: "Спрашивают минимальное значение (координату y), а не x, при котором оно достигается. Ответ 5 — типичная ошибка.",
    },
  },
  {
    id: "m-alg-24",
    skill: "Algebra",
    topic: "Percent change",
    difficulty: "easy",
    stem: "684 is p% greater than 570. What is the value of p?",
    answer: { kind: "text", accept: ["20"] },
    explain: {
      en: "The increase is 684 − 570 = 114, and percent change compares it with the original: 114/570 = 0.2, so p = 20.",
      ru: "Прирост равен 684 − 570 = 114, а процент считается от исходного значения: 114/570 = 0,2, значит, p = 20.",
    },
    trap: {
      en: "Dividing by 684 instead of 570 gives about 16.7. The base of a percent change is always the value you started from.",
      ru: "Деление на 684 вместо 570 даёт около 16,7. База процентного изменения — всегда исходное значение.",
    },
  },
];
