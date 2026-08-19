import type { ExamItem } from "../types";

/**
 * SAT Math — Problem-Solving and Data Analysis, Geometry and Trigonometry.
 *
 * These are the two domains where a strong algebra student still loses points,
 * because the traps are not algebraic: squared units in conversions, a percent
 * taken from the wrong base, an inscribed angle confused with a central one.
 * Each explanation names the trap rather than only walking through the arithmetic.
 */

export const SAT_MATH_DATA: ExamItem[] = [
  {
    id: "m-dat-01",
    skill: "Problem-Solving and Data Analysis",
    topic: "Unit conversion",
    difficulty: "hard",
    stem: "A certain town has an area of 5.48 square miles. Which of the following is closest to the area of this town, in square yards? (1 mile = 1,760 yards)",
    options: ["9,645", "16,974,848", "552", "964"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "Converting an area squares the conversion factor: 1 square mile = 1,760² = 3,097,600 square yards. So 5.48 × 3,097,600 = 16,974,848.",
      ru: "При переводе площади множитель возводится в квадрат: 1 квадратная миля = 1 760² = 3 097 600 квадратных ярдов. Значит, 5,48 × 3 097 600 = 16 974 848.",
    },
    trap: {
      en: "Multiplying by 1,760 once gives about 9,645 — the answer that is deliberately offered. Length converts once, area twice, volume three times.",
      ru: "Умножение на 1 760 один раз даёт примерно 9 645 — этот вариант подсунут специально. Длина переводится один раз, площадь — два, объём — три.",
    },
  },
  {
    id: "m-dat-02",
    skill: "Geometry and Trigonometry",
    topic: "Polygon angles",
    difficulty: "hard",
    stem: "A polygon has exactly 97 sides. If the measure of each of the 97 interior angles of this regular polygon is (180a)°, what is the value of a?",
    answer: { kind: "text", accept: ["95/97", ".9793", "0.9794", ".9794"] },
    explain: {
      en: "The interior angles of an n-sided polygon sum to (n − 2) × 180°, so each angle of a regular 97-gon is 95 × 180/97 degrees. Setting that equal to 180a gives a = 95/97.",
      ru: "Сумма внутренних углов n-угольника равна (n − 2) · 180°, поэтому каждый угол правильного 97-угольника равен 95 · 180/97 градусов. Приравняв к 180a, получаем a = 95/97.",
    },
    trap: {
      en: "The 180 cancels — you never have to compute the angle itself. Grinding out 176.29° first is where the time goes.",
      ru: "180 сокращается — сам угол считать не нужно. Время теряется именно на вычислении 176,29°.",
    },
  },
  {
    id: "m-dat-03",
    skill: "Geometry and Trigonometry",
    topic: "Circles in the xy-plane",
    difficulty: "hard",
    stem: "A circle in the xy-plane has its centre at (3, −7) and a radius of 12. An equation of this circle is x² + y² + ax + by + c = 0, where a, b and c are constants. What is the value of c?",
    answer: { kind: "text", accept: ["-86"] },
    explain: {
      en: "Start from (x − 3)² + (y + 7)² = 144. Expanding: x² − 6x + 9 + y² + 14y + 49 = 144, so x² + y² − 6x + 14y + 58 − 144 = 0. Therefore c = −86.",
      ru: "Начнём с (x − 3)² + (y + 7)² = 144. Раскрываем: x² − 6x + 9 + y² + 14y + 49 = 144, значит, x² + y² − 6x + 14y + 58 − 144 = 0. Отсюда c = −86.",
    },
    trap: {
      en: "Forgetting to subtract the 144 leaves c = 58. The radius term has to cross to the left side with the rest.",
      ru: "Если забыть вычесть 144, получится c = 58. Член с радиусом обязан перейти влево вместе с остальными.",
    },
  },
  {
    id: "m-dat-04",
    skill: "Geometry and Trigonometry",
    topic: "Volume scaling",
    difficulty: "medium",
    stem: "Sphere A has a radius of 7r and sphere B has a radius of 91r, where r > 0. The volume of sphere B is how many times the volume of sphere A?",
    answer: { kind: "text", accept: ["2197"] },
    explain: {
      en: "The radii are in the ratio 91/7 = 13. Volume scales with the cube of the linear ratio, so the factor is 13³ = 2,197.",
      ru: "Радиусы относятся как 91/7 = 13. Объём растёт как куб линейного отношения, поэтому множитель равен 13³ = 2 197.",
    },
    trap: {
      en: "Answering 13 uses the linear ratio; answering 169 uses the area ratio. Volume needs the third power.",
      ru: "Ответ 13 — это линейное отношение, 169 — отношение площадей. Для объёма нужна третья степень.",
    },
  },
  {
    id: "m-dat-05",
    skill: "Geometry and Trigonometry",
    topic: "Complementary angles",
    difficulty: "medium",
    stem: "For two acute angles P and Q, cos P = sin Q. The measures, in degrees, of ∠P and ∠Q are (3x + 10) and (2x + 5), respectively. What is the value of x?",
    answer: { kind: "text", accept: ["15"] },
    explain: {
      en: "For acute angles, cos P = sin Q exactly when P and Q are complementary. So (3x + 10) + (2x + 5) = 90, giving 5x + 15 = 90 and x = 15.",
      ru: "Для острых углов cos P = sin Q выполняется тогда, когда P и Q дополняют друг друга до 90°. Значит, (3x + 10) + (2x + 5) = 90, отсюда 5x + 15 = 90 и x = 15.",
    },
    trap: {
      en: "Setting the two expressions equal to each other gives x = −5 and a negative angle. The identity relates the angles' sum, not the angles themselves.",
      ru: "Если приравнять выражения друг к другу, получится x = −5 и отрицательный угол. Тождество связывает сумму углов, а не сами углы.",
    },
  },
  {
    id: "m-dat-06",
    skill: "Geometry and Trigonometry",
    topic: "Right triangle trigonometry",
    difficulty: "medium",
    stem: "In triangle ABC, the sum of the measures of angle A and angle B is 90 degrees. If sin A = 5/13, what is the value of cos B?",
    answer: { kind: "text", accept: ["5/13", ".3846", "0.3846"] },
    explain: {
      en: "Since A + B = 90°, angle B = 90° − A, and cos(90° − A) = sin A. So cos B = 5/13 directly.",
      ru: "Так как A + B = 90°, угол B = 90° − A, а cos(90° − A) = sin A. Значит, cos B = 5/13 сразу.",
    },
    trap: {
      en: "There is no need to find the third side or use 12/13 anywhere. The co-function identity answers it in one step.",
      ru: "Третью сторону искать не нужно, и 12/13 здесь ни при чём. Тождество кофункций решает задачу за один шаг.",
    },
  },
  {
    id: "m-dat-07",
    skill: "Geometry and Trigonometry",
    topic: "Triangle area",
    difficulty: "hard",
    stem: "The area of a triangle is x² square inches. The base of the triangle is (5 + 2x) inches and the height is (x − 2) inches. What is the value of x?",
    answer: { kind: "text", accept: ["10"] },
    explain: {
      en: "Area = ½ × base × height, so ½(5 + 2x)(x − 2) = x². Multiply by 2: (5 + 2x)(x − 2) = 2x², which expands to 2x² + x − 10 = 2x². The quadratic terms cancel, leaving x = 10.",
      ru: "Площадь = ½ · основание · высота, значит, ½(5 + 2x)(x − 2) = x². Умножим на 2: (5 + 2x)(x − 2) = 2x², раскрываем: 2x² + x − 10 = 2x². Квадратичные члены сокращаются, остаётся x = 10.",
    },
    trap: {
      en: "The problem looks quadratic and turns out to be linear. When both sides carry the same x² term, cancel before reaching for the quadratic formula.",
      ru: "Задача выглядит квадратной, а оказывается линейной. Если с обеих сторон одинаковый x², сокращай его, не хватаясь за формулу корней.",
    },
  },
  {
    id: "m-dat-08",
    skill: "Geometry and Trigonometry",
    topic: "Right triangle trigonometry",
    difficulty: "medium",
    stem: "A right triangle has a hypotenuse of length 25 and one leg of length 7. What is the tangent of the angle opposite the leg of length 7?",
    answer: { kind: "text", accept: ["7/24", ".2917", "0.2917"] },
    explain: {
      en: "The other leg is √(625 − 49) = √576 = 24. Tangent is opposite over adjacent, so tan = 7/24.",
      ru: "Второй катет равен √(625 − 49) = √576 = 24. Тангенс — противолежащий к прилежащему, значит, tan = 7/24.",
    },
    trap: {
      en: "7/25 is the sine, not the tangent. Tangent never uses the hypotenuse.",
      ru: "7/25 — это синус, а не тангенс. В тангенсе гипотенуза не участвует вообще.",
    },
  },
  {
    id: "m-dat-09",
    skill: "Geometry and Trigonometry",
    topic: "Circles",
    difficulty: "easy",
    stem: "A sector of a circle has a radius of 9 and a central angle measuring 80°. What is the area of this sector?",
    options: ["18π", "20π", "9π", "72π"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The sector is 80/360 = 2/9 of the circle, and the whole circle has area π(9²) = 81π. So the sector is (2/9)(81π) = 18π.",
      ru: "Сектор составляет 80/360 = 2/9 круга, а площадь всего круга равна π · 9² = 81π. Значит, сектор равен (2/9) · 81π = 18π.",
    },
  },
  {
    id: "m-dat-10",
    skill: "Geometry and Trigonometry",
    topic: "Inscribed angles",
    difficulty: "medium",
    stem: "In a circle, a central angle measures 74°. What is the measure, in degrees, of an inscribed angle that subtends the same arc?",
    answer: { kind: "text", accept: ["37"] },
    explain: {
      en: "An inscribed angle is half the central angle subtending the same arc, so it measures 74/2 = 37°.",
      ru: "Вписанный угол вдвое меньше центрального, опирающегося на ту же дугу, значит, он равен 74/2 = 37°.",
    },
    trap: {
      en: "The relationship runs one way only: the inscribed angle is the half. Doubling to 148° reverses it.",
      ru: "Соотношение работает только в одну сторону: половина — это вписанный угол. Удвоение до 148° переворачивает его.",
    },
  },
  {
    id: "m-dat-11",
    skill: "Geometry and Trigonometry",
    topic: "Similar solids",
    difficulty: "hard",
    stem: "Two similar rectangular prisms have surface areas in the ratio 9 : 25. What is the ratio of their volumes?",
    options: ["3 : 5", "9 : 25", "27 : 125", "81 : 625"],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "Surface area scales with the square of the linear ratio, so the linear ratio is √9 : √25 = 3 : 5. Volume scales with the cube, giving 27 : 125.",
      ru: "Площадь поверхности растёт как квадрат линейного отношения, поэтому линейное отношение равно √9 : √25 = 3 : 5. Объём растёт как куб, отсюда 27 : 125.",
    },
    trap: {
      en: "You must step down to the linear ratio first and only then cube it. Cubing 9 : 25 directly gives the wrong answer.",
      ru: "Сначала нужно спуститься к линейному отношению и лишь затем возводить в куб. Возведение 9 : 25 в куб напрямую даёт неверный ответ.",
    },
  },
  {
    id: "m-dat-12",
    skill: "Geometry and Trigonometry",
    topic: "Radians",
    difficulty: "easy",
    stem: "An angle measures 5π/6 radians. What is the measure of this angle, in degrees?",
    answer: { kind: "text", accept: ["150"] },
    explain: {
      en: "Multiply by 180/π: (5π/6)(180/π) = 5 × 30 = 150 degrees.",
      ru: "Умножаем на 180/π: (5π/6) · (180/π) = 5 · 30 = 150 градусов.",
    },
  },
  {
    id: "m-dat-13",
    skill: "Geometry and Trigonometry",
    topic: "Volume and rate",
    difficulty: "medium",
    stem: "Water flows into an empty cylindrical tank with a base area of 2.5 square metres at a constant rate of 0.75 cubic metres per minute. How many minutes does it take for the water to reach a depth of 3 metres?",
    answer: { kind: "text", accept: ["10"] },
    explain: {
      en: "The volume needed is base area × depth = 2.5 × 3 = 7.5 cubic metres. At 0.75 per minute that takes 7.5/0.75 = 10 minutes.",
      ru: "Нужный объём равен площадь основания × глубина = 2,5 · 3 = 7,5 кубометра. При 0,75 в минуту это займёт 7,5/0,75 = 10 минут.",
    },
  },
  {
    id: "m-dat-14",
    skill: "Problem-Solving and Data Analysis",
    topic: "Mean",
    difficulty: "easy",
    stem: "The mean of five numbers is 18. When a sixth number is added to the set, the mean becomes 20. What is the sixth number?",
    answer: { kind: "text", accept: ["30"] },
    explain: {
      en: "The first five sum to 5 × 18 = 90; all six sum to 6 × 20 = 120. The sixth number is 120 − 90 = 30.",
      ru: "Сумма первых пяти равна 5 · 18 = 90; сумма всех шести равна 6 · 20 = 120. Шестое число равно 120 − 90 = 30.",
    },
    trap: {
      en: "The answer is not 20 + 2. Convert every mean into a total before comparing — averages do not add.",
      ru: "Ответ не 20 + 2. Переводи каждое среднее в сумму, прежде чем сравнивать: средние не складываются.",
    },
  },
  {
    id: "m-dat-15",
    skill: "Problem-Solving and Data Analysis",
    topic: "Spread",
    difficulty: "medium",
    context: "Set X: 20, 30, 40, 50, 60\nSet Y: 35, 38, 40, 42, 45",
    stem: "Which statement about the two data sets is true?",
    options: [
      "The sets have the same mean, and Set X has the greater standard deviation.",
      "The sets have the same mean, and Set Y has the greater standard deviation.",
      "Set X has the greater mean and the greater standard deviation.",
      "The sets have the same mean and the same standard deviation.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Both sets average 40. Set X spreads from 20 to 60 while Set Y stays between 35 and 45, so X's values sit further from the mean and its standard deviation is larger.",
      ru: "Среднее обоих наборов — 40. Set X разбросан от 20 до 60, а Set Y держится между 35 и 45, значит, значения X дальше от среднего и стандартное отклонение больше именно у X.",
    },
    trap: {
      en: "Standard deviation is never about the size of the numbers, only their distance from the mean. Both sets are centred identically here.",
      ru: "Стандартное отклонение — не про величину чисел, а про их удалённость от среднего. Здесь центры наборов совпадают.",
    },
  },
  {
    id: "m-dat-16",
    skill: "Problem-Solving and Data Analysis",
    topic: "Two-way tables",
    difficulty: "medium",
    context:
      "Students choosing a language elective:\n\n                Kazakh   Russian   Total\nGrade 10          54        66      120\nGrade 11          72        48      120\nTotal            126       114      240",
    stem: "If one of the students who chose Kazakh is selected at random, what is the probability that the student is in Grade 11?",
    answer: { kind: "text", accept: ["4/7", "72/126", ".5714", "0.5714"] },
    explain: {
      en: "The condition \"who chose Kazakh\" restricts the pool to the 126 students in that column. Of those, 72 are in Grade 11, so the probability is 72/126 = 4/7.",
      ru: "Условие «из выбравших казахский» сужает выборку до 126 человек в этом столбце. Из них 72 — в 11 классе, значит, вероятность равна 72/126 = 4/7.",
    },
    trap: {
      en: "Dividing by 240 (the whole table) gives 72/240 = 0.3. A conditional probability uses the row or column named in the condition as its denominator.",
      ru: "Деление на 240 (всю таблицу) даёт 72/240 = 0,3. У условной вероятности в знаменателе — та строка или столбец, что названы в условии.",
    },
  },
  {
    id: "m-dat-17",
    skill: "Problem-Solving and Data Analysis",
    topic: "Percent change",
    difficulty: "hard",
    stem: "The price of an item is increased by 25 percent and the new price is then decreased by 20 percent. Compared with the original price, the final price is",
    options: ["5 percent greater.", "5 percent less.", "unchanged.", "1 percent greater."],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "Multiply the factors: 1.25 × 0.80 = 1.00. The 20 percent decrease is taken from the larger price, so it removes exactly what the increase added.",
      ru: "Перемножаем коэффициенты: 1,25 · 0,80 = 1,00. Снижение на 20% считается от уже увеличенной цены и убирает ровно то, что добавил рост.",
    },
    trap: {
      en: "Adding and subtracting the percentages (+25 − 20 = +5) treats both as shares of the same base, which they are not.",
      ru: "Сложение и вычитание процентов (+25 − 20 = +5) считает их долями одной базы, а база разная.",
    },
  },
  {
    id: "m-dat-18",
    skill: "Problem-Solving and Data Analysis",
    topic: "Rates and proportions",
    difficulty: "hard",
    stem: "One litre of sealant costs 2,400 tenge and covers 6 square metres of flooring. A workshop floor has a total area of A square metres. Which equation gives the cost C, in tenge, of the sealant needed to coat the floor twice?",
    options: ["C = 800A", "C = 400A", "C = 1,200A", "C = 4,800A"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "Two coats cover 2A square metres, needing 2A/6 = A/3 litres. The cost is 2,400 × A/3 = 800A.",
      ru: "Два слоя покрывают 2A квадратных метров, на это нужно 2A/6 = A/3 литра. Стоимость равна 2 400 · A/3 = 800A.",
    },
    trap: {
      en: "C = 400A is the single-coat answer. Read whether the doubling applies to the area or to the price.",
      ru: "C = 400A — это ответ для одного слоя. Смотри, к чему относится удвоение: к площади или к цене.",
    },
  },
  {
    id: "m-dat-19",
    skill: "Problem-Solving and Data Analysis",
    topic: "Unit rates",
    difficulty: "easy",
    stem: "A train travels 348 kilometres in 4 hours. At this same rate, how many kilometres will it travel in 7 hours?",
    answer: { kind: "text", accept: ["609"] },
    explain: {
      en: "The rate is 348/4 = 87 kilometres per hour, so in 7 hours it covers 87 × 7 = 609 kilometres.",
      ru: "Скорость равна 348/4 = 87 километров в час, значит, за 7 часов будет 87 · 7 = 609 километров.",
    },
  },
  {
    id: "m-dat-20",
    skill: "Problem-Solving and Data Analysis",
    topic: "Linear models in context",
    difficulty: "medium",
    context:
      "A line of best fit for a scatterplot relating x, the number of years since 2010, and y, the average monthly wage in a region in thousands of tenge, is given by y = 14.6x + 92.",
    stem: "Which of the following is the best interpretation of the number 14.6 in this context?",
    options: [
      "The average monthly wage increased by about 14,600 tenge per year.",
      "The average monthly wage in 2010 was about 14,600 tenge.",
      "The average monthly wage increased by about 14.6 percent per year.",
      "It took about 14.6 years for the average monthly wage to double.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "In y = mx + b, the slope m is the change in y per one-unit change in x. Here that is 14.6 thousand tenge for each additional year.",
      ru: "В y = mx + b наклон m — это изменение y при росте x на единицу. Здесь — 14,6 тысячи тенге за каждый следующий год.",
    },
    trap: {
      en: "Option B describes the intercept 92, not the slope. Option C turns a constant amount into a percentage — a linear model adds, it does not multiply.",
      ru: "Вариант B описывает свободный член 92, а не наклон. Вариант C превращает постоянную сумму в процент, а линейная модель прибавляет, а не умножает.",
    },
  },
  {
    id: "m-dat-21",
    skill: "Problem-Solving and Data Analysis",
    topic: "Sampling and inference",
    difficulty: "hard",
    context:
      "A researcher surveyed 400 randomly selected residents of a city with a population of 900,000. In the sample, 62 percent supported a proposed transport measure, with an associated margin of error of 4 percent at a 95 percent confidence level.",
    stem: "Which conclusion is best supported by these results?",
    options: [
      "It is plausible that between 58 and 66 percent of all residents of the city support the measure.",
      "Exactly 62 percent of all residents of the city support the measure.",
      "Between 58 and 66 percent of the 400 surveyed residents support the measure.",
      "If 400 more residents were surveyed, exactly 248 of them would support the measure.",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "A margin of error gives a plausible interval for the whole population, not the sample. Because the sample was random, 62% ± 4% generalises to all residents.",
      ru: "Погрешность задаёт правдоподобный интервал для всей популяции, а не для выборки. Так как выборка случайна, 62% ± 4% переносится на всех жителей.",
    },
    trap: {
      en: "Option C applies the interval to the sample, where the figure is known exactly. The interval exists precisely because the population figure is not known.",
      ru: "Вариант C применяет интервал к выборке, где значение известно точно. Интервал и нужен как раз потому, что значение по популяции неизвестно.",
    },
  },
  {
    id: "m-dat-22",
    skill: "Problem-Solving and Data Analysis",
    topic: "Percent of a percent",
    difficulty: "medium",
    stem: "In a class of 32 students, 62.5 percent study French. Of the students who study French, 40 percent also study German. How many students in the class study both languages?",
    answer: { kind: "text", accept: ["8"] },
    explain: {
      en: "French students: 0.625 × 32 = 20. Of those, 40 percent study German too: 0.40 × 20 = 8.",
      ru: "Французский изучают 0,625 · 32 = 20 человек. Из них немецкий изучают 40%: 0,40 · 20 = 8.",
    },
    trap: {
      en: "Taking 40 percent of 32 gives 12.8. The second percentage is a share of the French group, not of the whole class.",
      ru: "40% от 32 дают 12,8. Второй процент берётся от группы «французский», а не от всего класса.",
    },
  },
  {
    id: "m-dat-23",
    skill: "Problem-Solving and Data Analysis",
    topic: "Exponential versus linear growth",
    difficulty: "medium",
    context: "t (years):        0     1     2     3\nP (population):  1,200 1,440 1,728 2,074",
    stem: "Which type of model best fits the data in the table, and what is the associated constant?",
    options: [
      "Exponential, with a growth factor of about 1.2 per year",
      "Linear, with a slope of about 240 per year",
      "Exponential, with a growth factor of about 1.44 per year",
      "Linear, with a slope of about 291 per year",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The successive ratios are constant — 1,440/1,200 = 1.2, 1,728/1,440 = 1.2, 2,074/1,728 ≈ 1.2 — while the differences (240, 288, 346) grow. Constant ratio means exponential.",
      ru: "Отношения соседних значений постоянны: 1 440/1 200 = 1,2, 1 728/1 440 = 1,2, 2 074/1 728 ≈ 1,2, — а разности (240, 288, 346) растут. Постоянное отношение означает экспоненту.",
    },
    trap: {
      en: "The first difference really is 240, which makes the linear option look right until you check the next one. Test at least two gaps before deciding.",
      ru: "Первая разность действительно 240, и линейный вариант выглядит верным, пока не проверишь следующую. Проверяй хотя бы два интервала.",
    },
  },
  {
    id: "m-dat-24",
    skill: "Geometry and Trigonometry",
    topic: "Volume",
    difficulty: "easy",
    stem: "A cylindrical water tank has a radius of 3 metres and a height of 5 metres. What is the volume of the tank, in cubic metres?",
    options: ["45π", "30π", "75π", "15π"],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "The volume of a cylinder is πr²h = π(3²)(5) = 45π cubic metres.",
      ru: "Объём цилиндра равен πr²h = π · 3² · 5 = 45π кубометров.",
    },
    trap: {
      en: "30π comes from using 2r instead of r². The radius is squared, not doubled.",
      ru: "30π получается, если взять 2r вместо r². Радиус возводится в квадрат, а не удваивается.",
    },
  },
];
