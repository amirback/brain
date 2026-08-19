import type { ExamItem } from "../types";

/**
 * SAT Math, batch 2.
 *
 * Two 22-question modules drawn without repetition need at least 44 items, and a
 * pool of exactly 44 would hand a student the identical test on every retake. This
 * batch exists so the mock varies between sittings.
 */

export const SAT_MATH_2: ExamItem[] = [
  {
    id: "m2-alg-01",
    skill: "Algebra",
    topic: "Systems of equations",
    difficulty: "easy",
    stem: "2x + 3y = 31\ny = x − 3\n\nWhat is the value of x in the solution to the given system of equations?",
    answer: { kind: "text", accept: ["8"] },
    explain: {
      en: "Substitute the second equation into the first: 2x + 3(x − 3) = 31, so 5x − 9 = 31, giving 5x = 40 and x = 8.",
      ru: "Подставим второе уравнение в первое: 2x + 3(x − 3) = 31, отсюда 5x − 9 = 31, значит, 5x = 40 и x = 8.",
    },
    trap: {
      en: "The question asks for x, not y. Having found x = 8 it is easy to compute y = 5 and grid that instead.",
      ru: "Спрашивают x, а не y. Найдя x = 8, легко по инерции посчитать y = 5 и вписать его.",
    },
  },
  {
    id: "m2-alg-02",
    skill: "Algebra",
    topic: "Systems with no solution",
    difficulty: "medium",
    stem: "y = (2/5)x + 7\ny = kx − 4\n\nIn the given system, k is a constant. If the system has no solution, what is the value of k?",
    answer: { kind: "text", accept: ["2/5", ".4", "0.4"] },
    explain: {
      en: "Two lines have no intersection exactly when they are parallel — equal slopes, different intercepts. So k = 2/5, and since 7 ≠ −4 the lines really are distinct.",
      ru: "Две прямые не пересекаются ровно тогда, когда они параллельны: равные наклоны, разные свободные члены. Значит, k = 2/5, а так как 7 ≠ −4, прямые действительно различны.",
    },
  },
  {
    id: "m2-alg-03",
    skill: "Advanced Math",
    topic: "Sum and product of roots",
    difficulty: "hard",
    stem: "3x² − 12x + 7 = 0\n\nThe solutions to the given equation are p and q. What is the value of p + q?",
    answer: { kind: "text", accept: ["4"] },
    explain: {
      en: "For ax² + bx + c = 0 the roots sum to −b/a. Here that is 12/3 = 4. The roots themselves are irrational, so solving for them wastes time.",
      ru: "Для ax² + bx + c = 0 сумма корней равна −b/a. Здесь это 12/3 = 4. Сами корни иррациональны, поэтому искать их — потеря времени.",
    },
    trap: {
      en: "Reaching for the quadratic formula gives (12 ± √60)/6 and a messy addition. When the question asks for a sum or a product, use the coefficients.",
      ru: "Формула корней даёт (12 ± √60)/6 и грязное сложение. Если спрашивают сумму или произведение — работай с коэффициентами.",
    },
  },
  {
    id: "m2-alg-04",
    skill: "Advanced Math",
    topic: "Function transformations",
    difficulty: "hard",
    stem: "The function g is defined by g(x) = f(x − 3) + 5. If the graph of f has its minimum at the point (2, −4), at which point does the graph of g have its minimum?",
    options: ["(5, 1)", "(−1, 1)", "(5, −9)", "(2, 1)"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "f(x − 3) shifts the graph 3 units right, and + 5 shifts it 5 units up. The minimum moves from (2, −4) to (2 + 3, −4 + 5) = (5, 1).",
      ru: "f(x − 3) сдвигает график на 3 вправо, а + 5 — на 5 вверх. Минимум переходит из (2, −4) в (2 + 3, −4 + 5) = (5, 1).",
    },
    trap: {
      en: "The sign inside the function is counter-intuitive: x − 3 moves the graph in the positive direction, not the negative one.",
      ru: "Знак внутри функции контринтуитивен: x − 3 сдвигает график в положительную сторону, а не в отрицательную.",
    },
  },
  {
    id: "m2-alg-05",
    skill: "Advanced Math",
    topic: "Exponent equations",
    difficulty: "easy",
    stem: "3^(2x) = 81\n\nWhat is the value of x in the given equation?",
    answer: { kind: "text", accept: ["2"] },
    explain: {
      en: "Write both sides with base 3: 81 = 3⁴, so 3^(2x) = 3⁴ and 2x = 4, giving x = 2.",
      ru: "Приведём обе части к основанию 3: 81 = 3⁴, значит, 3^(2x) = 3⁴ и 2x = 4, отсюда x = 2.",
    },
  },
  {
    id: "m2-alg-06",
    skill: "Advanced Math",
    topic: "Rational exponents",
    difficulty: "medium",
    stem: "For x > 0, the expression x^(1/2) · x^(2/3) is equal to x^k. What is the value of k?",
    answer: { kind: "text", accept: ["7/6"] },
    explain: {
      en: "Multiplying powers of the same base adds the exponents: 1/2 + 2/3 = 3/6 + 4/6 = 7/6.",
      ru: "При умножении степеней с одинаковым основанием показатели складываются: 1/2 + 2/3 = 3/6 + 4/6 = 7/6.",
    },
    trap: {
      en: "Multiplying the exponents gives 1/3, which is the rule for a power of a power, not a product.",
      ru: "Умножение показателей даёт 1/3 — это правило для степени в степени, а не для произведения.",
    },
  },
  {
    id: "m2-alg-07",
    skill: "Algebra",
    topic: "Systems solved for an expression",
    difficulty: "medium",
    stem: "5a + 2b = 26\n3a + 2b = 18\n\nWhat is the value of a + b?",
    answer: { kind: "text", accept: ["7"] },
    explain: {
      en: "Subtracting the second equation from the first eliminates b: 2a = 8, so a = 4. Then 2b = 26 − 20 = 6, giving b = 3 and a + b = 7.",
      ru: "Вычитая второе уравнение из первого, убираем b: 2a = 8, значит, a = 4. Тогда 2b = 26 − 20 = 6, отсюда b = 3 и a + b = 7.",
    },
  },
  {
    id: "m2-dat-01",
    skill: "Problem-Solving and Data Analysis",
    topic: "Percent change",
    difficulty: "hard",
    stem: "A shop's monthly revenue increased by 15 percent to 989,000 tenge. What was the revenue, in tenge, before the increase?",
    answer: { kind: "text", accept: ["860000", "860,000"] },
    explain: {
      en: "The new figure is 1.15 times the old one, so the old one is 989,000 / 1.15 = 860,000.",
      ru: "Новая величина — это 1,15 от старой, значит, старая равна 989 000 / 1,15 = 860 000.",
    },
    trap: {
      en: "Taking 15 percent off 989,000 gives 840,650, which is wrong: the percentage was applied to the smaller original, not to the result.",
      ru: "Вычесть 15% из 989 000 даёт 840 650 — неверно: процент считался от меньшего исходного значения, а не от результата.",
    },
  },
  {
    id: "m2-dat-02",
    skill: "Geometry and Trigonometry",
    topic: "Arc length",
    difficulty: "medium",
    stem: "A circle has a radius of 15. What is the length of an arc subtended by a central angle measuring 1.2 radians?",
    answer: { kind: "text", accept: ["18"] },
    explain: {
      en: "Arc length is s = rθ when the angle is in radians: s = 15 × 1.2 = 18.",
      ru: "Длина дуги равна s = rθ, если угол в радианах: s = 15 · 1,2 = 18.",
    },
    trap: {
      en: "The formula only works in radians. Converting 1.2 radians to degrees first and then using the degree formula is a longer road to the same place — and a common source of error.",
      ru: "Формула работает только с радианами. Перевести 1,2 радиана в градусы и считать по градусной формуле — более длинный путь и частый источник ошибок.",
    },
  },
  {
    id: "m2-dat-03",
    skill: "Geometry and Trigonometry",
    topic: "Similar triangles",
    difficulty: "medium",
    stem: "Triangle ABC is similar to triangle DEF, with vertex A corresponding to D and B to E. If AB = 9, BC = 12 and DE = 15, what is the length of EF?",
    answer: { kind: "text", accept: ["20"] },
    explain: {
      en: "The scale factor from ABC to DEF is DE/AB = 15/9 = 5/3. So EF = BC × 5/3 = 12 × 5/3 = 20.",
      ru: "Коэффициент подобия от ABC к DEF равен DE/AB = 15/9 = 5/3. Значит, EF = BC · 5/3 = 12 · 5/3 = 20.",
    },
  },
  {
    id: "m2-dat-04",
    skill: "Problem-Solving and Data Analysis",
    topic: "Probability",
    difficulty: "hard",
    stem: "A box contains 7 red marbles and 5 blue marbles. Two marbles are drawn at random without replacement. What is the probability that both are red?",
    options: ["7/22", "49/144", "7/12", "1/2"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The first draw is 7/12. After a red is removed, 6 reds remain out of 11, so the second is 6/11. Multiplying: 42/132 = 7/22.",
      ru: "Первое извлечение — 7/12. После изъятия красного остаётся 6 красных из 11, поэтому второе — 6/11. Перемножаем: 42/132 = 7/22.",
    },
    trap: {
      en: "49/144 treats the draws as independent, which they are not — \"without replacement\" changes the second denominator and numerator.",
      ru: "49/144 считает извлечения независимыми, а они не независимы: «без возвращения» меняет и числитель, и знаменатель второго.",
    },
  },
  {
    id: "m2-dat-05",
    skill: "Problem-Solving and Data Analysis",
    topic: "Mean",
    difficulty: "medium",
    stem: "The mean of six numbers is 25. Five of the numbers are 18, 22, 26, 30 and 34. What is the sixth number?",
    answer: { kind: "text", accept: ["20"] },
    explain: {
      en: "All six sum to 6 × 25 = 150. The five given sum to 130, so the sixth is 150 − 130 = 20.",
      ru: "Сумма всех шести равна 6 · 25 = 150. Пять данных дают 130, значит, шестое равно 150 − 130 = 20.",
    },
  },
  {
    id: "m2-dat-06",
    skill: "Algebra",
    topic: "Linear inequalities",
    difficulty: "medium",
    stem: "A delivery van can carry a maximum load of 900 kilograms and is already carrying 240 kilograms of equipment. Each box to be loaded weighs 22 kilograms. What is the greatest number of boxes that can be loaded?",
    answer: { kind: "text", accept: ["30"] },
    explain: {
      en: "The remaining capacity is 900 − 240 = 660 kilograms, so 22n ≤ 660 gives n ≤ 30. The greatest whole number of boxes is 30.",
      ru: "Остаточная грузоподъёмность — 900 − 240 = 660 кг, значит, 22n ≤ 660 даёт n ≤ 30. Наибольшее целое число коробок — 30.",
    },
    trap: {
      en: "Dividing 900 by 22 gives about 40 and ignores the equipment already on board.",
      ru: "Деление 900 на 22 даёт около 40 и игнорирует уже загруженное оборудование.",
    },
  },
  {
    id: "m2-dat-07",
    skill: "Algebra",
    topic: "Absolute value",
    difficulty: "medium",
    stem: "|x − 4| < 9\n\nWhich of the following describes all solutions to the given inequality?",
    options: ["−5 < x < 13", "x < 13", "x > −5", "x < −5 or x > 13"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "An absolute value less than a number becomes a double inequality: −9 < x − 4 < 9. Adding 4 throughout gives −5 < x < 13.",
      ru: "Модуль меньше числа превращается в двойное неравенство: −9 < x − 4 < 9. Прибавив 4 ко всем частям, получаем −5 < x < 13.",
    },
    trap: {
      en: "Option D is the answer to |x − 4| > 9. Less-than gives an interval between the bounds; greater-than gives the two rays outside them.",
      ru: "Вариант D — ответ для |x − 4| > 9. «Меньше» даёт промежуток между границами, «больше» — два луча за ними.",
    },
  },
  {
    id: "m2-dat-08",
    skill: "Problem-Solving and Data Analysis",
    topic: "Line of best fit",
    difficulty: "medium",
    context:
      "A line of best fit for a scatterplot relating x, the age of a used car in years, and y, its value in hundreds of thousands of tenge, is given by y = −0.8x + 46.",
    stem: "According to the model, what is the predicted value, in hundreds of thousands of tenge, of a car that is 10 years old?",
    answer: { kind: "text", accept: ["38"] },
    explain: {
      en: "Substitute x = 10: y = −0.8(10) + 46 = −8 + 46 = 38.",
      ru: "Подставим x = 10: y = −0,8 · 10 + 46 = −8 + 46 = 38.",
    },
  },
  {
    id: "m2-dat-09",
    skill: "Geometry and Trigonometry",
    topic: "Volume",
    difficulty: "medium",
    stem: "A cone has a radius of 6 and a height of 14. What is the volume of the cone?",
    options: ["168π", "504π", "84π", "56π"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The volume of a cone is (1/3)πr²h = (1/3)π(36)(14) = 168π.",
      ru: "Объём конуса равен (1/3)πr²h = (1/3)π · 36 · 14 = 168π.",
    },
    trap: {
      en: "504π is the cylinder with the same base and height. A cone is one third of it — the factor is easy to drop.",
      ru: "504π — это цилиндр с тем же основанием и высотой. Конус втрое меньше, и множитель легко потерять.",
    },
  },
  {
    id: "m2-dat-10",
    skill: "Geometry and Trigonometry",
    topic: "Special right triangles",
    difficulty: "easy",
    stem: "In a right triangle, one of the acute angles measures 30 degrees and the side opposite that angle has length 11. What is the length of the hypotenuse?",
    answer: { kind: "text", accept: ["22"] },
    explain: {
      en: "In a 30-60-90 triangle the side opposite the 30° angle is half the hypotenuse, so the hypotenuse is 2 × 11 = 22.",
      ru: "В треугольнике 30-60-90 катет против угла 30° вдвое меньше гипотенузы, значит, гипотенуза равна 2 · 11 = 22.",
    },
  },
  {
    id: "m2-alg-08",
    skill: "Advanced Math",
    topic: "Polynomial zeros",
    difficulty: "hard",
    stem: "The polynomial p is defined by p(x) = (x − 2)²(x + 5). How many distinct real zeros does p have?",
    answer: { kind: "text", accept: ["2"] },
    explain: {
      en: "Setting each factor to zero gives x = 2 (from the squared factor) and x = −5. That is two distinct values, even though the polynomial has degree 3.",
      ru: "Приравняв каждый множитель к нулю, получаем x = 2 (из квадрата) и x = −5. Это два различных значения, хотя степень многочлена равна 3.",
    },
    trap: {
      en: "The degree is 3, so there are three roots counted with multiplicity — but x = 2 is one distinct value repeated, and the question says \"distinct\".",
      ru: "Степень равна 3, то есть корней три с учётом кратности, но x = 2 — одно значение, повторённое дважды, а спрашивают «различных».",
    },
  },
];
