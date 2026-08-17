import type { L } from "../types";
import { n, t } from "./util";

/**
 * The конспект: what a student would write on one page before a test.
 * Kept separate from the lessons so it can be read on its own — most
 * revision happens by re-reading these, not by re-reading whole chapters.
 */
export const SUMMARIES: Record<string, L[]> = {
  linear: [
    t("Уравнение — это весы: что делаешь слева, делай справа.", "Теңдеу — таразы: сол жаққа не істесең, оң жаққа да соны істе.", "An equation is a scale: do the same to both sides."),
    n("ax + b = c  →  x = (c − b) / a"),
    t("Слагаемое переходит через «=» с обратным знаком.", "Қосылғыш «=» арқылы қарама-қарсы таңбамен өтеді.", "A term crossing «=» flips its sign."),
    t("Минус перед скобкой меняет знаки всех слагаемых внутри.", "Жақша алдындағы минус ішіндегі барлық таңбаны өзгертеді.", "A minus before a bracket flips every sign inside."),
    t("Есть дроби — умножь обе части на общий знаменатель.", "Бөлшек болса — екі жағын ортақ бөлімге көбейт.", "Fractions? Multiply both sides by the common denominator."),
    t("Проверка: подставь найденный корень обратно в исходное уравнение.", "Тексеру: тапқан түбірді бастапқы теңдеуге қайта қой.", "Check: substitute the root back into the original equation."),
  ],
  quadratic: [
    n("D = b² − 4ac,   x = (−b ± √D) / 2a"),
    t("D > 0 — два корня, D = 0 — один, D < 0 — корней нет.", "D > 0 — екі түбір, D = 0 — біреу, D < 0 — түбір жоқ.", "D > 0 two roots, D = 0 one, D < 0 none."),
    n("Виета: x₁ + x₂ = −p,   x₁ · x₂ = q"),
    t("Нет свободного члена — выноси x за скобку: ax² + bx = 0.", "Бос мүше жоқ — x-ті жақша сыртына шығар: ax² + bx = 0.", "No constant term — factor out x: ax² + bx = 0."),
    t("Нет среднего члена — переноси и извлекай корень: x² = k.", "Ортаңғы мүше жоқ — көшіріп, түбір тап: x² = k.", "No middle term — move and take the root: x² = k."),
    t("Произведение корней отрицательное — корни разных знаков.", "Түбірлердің көбейтіндісі теріс — таңбалары әртүрлі.", "A negative product means the roots have opposite signs."),
  ],
  functions: [
    n("y = kx + b:  k — наклон, b — точка пересечения с Oy"),
    t("k > 0 — функция растёт, k < 0 — убывает.", "k > 0 — функция өседі, k < 0 — кемиді.", "k > 0 rises, k < 0 falls."),
    n("Парабола: x₀ = −b / 2a,  y₀ = f(x₀)"),
    t("a > 0 — ветви вверх, вершина минимум; a < 0 — наоборот.", "a > 0 — тармақтары жоғары, төбесі минимум; a < 0 — керісінше.", "a > 0 opens up, vertex is a minimum; a < 0 the reverse."),
    t("Нули функции — это x, при которых y = 0: пересечение с Ox.", "Функция нөлдері — y = 0 болатын x: Ox осімен қиылысу.", "Zeros are the x where y = 0 — the x-axis crossings."),
    t("Область значений y = x² — все неотрицательные числа.", "y = x² мәндер жиыны — барлық теріс емес сандар.", "The range of y = x² is all non-negative numbers."),
  ],
  "en-tenses": [
    t("Past Simple — законченное время: yesterday, in 2020, last week.", "Past Simple — аяқталған уақыт: yesterday, in 2020, last week.", "Past Simple — a finished time: yesterday, in 2020, last week."),
    t("Present Perfect — результат важен сейчас: already, just, yet, ever, never.", "Present Perfect — нәтиже қазір маңызды: already, just, yet, ever, never.", "Present Perfect — the result matters now: already, just, yet, ever, never."),
    n("have / has + V3   ·   be + V-ing   ·   was/were + V-ing"),
    t("Глаголы состояния (know, like, want) в Continuous не ставятся.", "Күй етістіктері (know, like, want) Continuous-та қолданылмайды.", "State verbs (know, like, want) don't take Continuous."),
    t("will — решение сейчас и прогноз; be going to — намерение и видимое доказательство.", "will — қазіргі шешім мен болжам; be going to — ниет пен көзге көрінетін дәлел.", "will — a decision now or a prediction; be going to — intention or visible evidence."),
  ],
  "en-articles": [
    t("a / an — предмет впервые или один из многих; the — собеседник знает, какой именно.", "a / an — зат алғаш рет не көптің бірі; the — тыңдаушы қайсы екенін біледі.", "a / an — first mention or one of many; the — the listener knows which."),
    t("an ставится перед гласным звуком, а не буквой: an hour, a university.", "an дауысты дыбыс алдында тұрады, әріп алдында емес: an hour, a university.", "an goes before a vowel sound, not letter: an hour, a university."),
    n("at 7 pm  ·  on Friday  ·  in September"),
    t("Единственные в своём роде объекты — с the: the sun, the moon.", "Бірегей нысандар the-мен: the sun, the moon.", "Unique things take the: the sun, the moon."),
    t("Страны с States / Kingdom / множественным числом — с the.", "States / Kingdom бар және көпше елдер the-мен.", "Countries with States / Kingdom or plurals take the."),
  ],
  "en-vocab": [
    n("-tion, -ment, -ness, -ity → существительное"),
    n("-ful, -less, -ous, -y → прилагательное"),
    t("un-, in-, im-, il-, ir-, dis- дают противоположное значение.", "un-, in-, im-, il-, ir-, dis- қарама-қарсы мағына береді.", "un-, in-, im-, il-, ir-, dis- reverse the meaning."),
    t("Перед p — im-, перед l — il-, перед r — ir-: impossible, illogical, irregular.", "p алдында im-, l алдында il-, r алдында ir-: impossible, illogical, irregular.", "Before p use im-, before l il-, before r ir-."),
    n("make a decision · do homework · take a photo · pay attention"),
  ],
  "kz-septik": [
    t("Семь падежей: атау, ілік, барыс, табыс, жатыс, шығыс, көмектес.", "Жеті септік: атау, ілік, барыс, табыс, жатыс, шығыс, көмектес.", "Seven cases: nominative, genitive, dative, accusative, locative, ablative, instrumental."),
    n("кітап → кітаптың · кітапқа · кітапты · кітапта · кітаптан · кітаппен"),
    t("Твёрдый последний слог (а, о, ұ, ы) — твёрдое окончание: -ға, -да, -дан.", "Соңғы буын жуан (а, о, ұ, ы) — жалғау да жуан: -ға, -да, -дан.", "A back-vowel last syllable takes back endings: -ға, -да, -дан."),
    t("Мягкий последний слог (е, ө, ү, і) — мягкое окончание: -ге, -де, -ден.", "Соңғы буын жіңішке (е, ө, ү, і) — жалғау жіңішке: -ге, -де, -ден.", "A front-vowel last syllable takes front endings: -ге, -де, -ден."),
    t("После глухих (қ, к, п, т, с, ш) окончание начинается с глухой: -қа, -ке, -та, -те.", "Қатаңнан кейін (қ, к, п, т, с, ш) жалғау қатаңнан басталады: -қа, -ке, -та, -те.", "After voiceless consonants the ending starts voiceless."),
  ],
  "kz-etistik": [
    t("Прошедшее время: -ды / -ді / -ты / -ті — барды, келді.", "Өткен шақ: -ды / -ді / -ты / -ті — барды, келді.", "Past tense: -ды / -ді / -ты / -ті — барды, келді."),
    t("Настоящее время — отыр, тұр, жүр, жатыр: оқып жатыр.", "Осы шақ — отыр, тұр, жүр, жатыр: оқып жатыр.", "Present tense uses отыр, тұр, жүр, жатыр."),
    t("Будущее: -а / -е + жіктік жалғауы — барамын, келеміз.", "Келер шақ: -а / -е + жіктік жалғауы — барамын, келеміз.", "Future: -а / -е plus a personal ending."),
    t("Отрицание -ма / -ме / -ба / -бе ставится ПЕРЕД суффиксом времени.", "Болымсыздық -ма / -ме / -ба / -бе шақ жұрнағының АЛДЫНА қойылады.", "The negative -ма / -ме / -ба / -бе comes BEFORE the tense suffix."),
  ],
  "kz-soz": [
    t("Зат есім отвечает на кім? не?; сын есім — на қандай?", "Зат есім кім? не? сұрағына; сын есім — қандай? сұрағына жауап береді.", "Nouns answer кім? не?; adjectives answer қандай?"),
    t("Прилагательное из существительного: -лы / -лі / -ды / -ді / -ты / -ті.", "Зат есімнен сын есім: -лы / -лі / -ды / -ді / -ты / -ті.", "Noun to adjective: -лы / -лі / -ды / -ді / -ты / -ті."),
    n("Шырайлар: әдемі → әдемірек (салыстырмалы) → аппақ (күшейтпелі)"),
    t("Порядковое числительное: -ыншы / -інші — бесінші, оныншы.", "Реттік сан есім: -ыншы / -інші — бесінші, оныншы.", "Ordinals take -ыншы / -інші."),
  ],
  "hs-ancient": [
    n("VIII–III вв. до н. э. — саки, «звериный стиль»"),
    n("1969 — Алтын адам, Есік қорғаны"),
    n("552 — Түркі қағанаты"),
    t("Гунны при Аттиле дошли до Западной Европы в V веке.", "Ғұндар Аттила тұсында V ғасырда Батыс Еуропаға жетті.", "The Huns under Attila reached Western Europe in the 5th century."),
    t("Через юг Казахстана шёл Великий Шёлковый путь: Тараз, Отрар, Испиджаб.", "Қазақстанның оңтүстігі арқылы Ұлы Жібек жолы өтті: Тараз, Отырар, Испиджаб.", "The Great Silk Road crossed southern Kazakhstan: Taraz, Otrar, Ispijab."),
  ],
  "hs-khanate": [
    n("1465 — Қазақ хандығы, Керей мен Жәнібек, Жетісу"),
    t("Расцвет при хане Касыме — начало XVI века, население более миллиона.", "Гүлдену Қасым хан тұсында — XVI ғасыр басы, халық саны миллионнан асты.", "Peak under Khan Kasym, early 16th century, over a million people."),
    n("Үш жүз: Ұлы · Орта · Кіші"),
    n("1723 — Ақтабан шұбырынды · 1728 Бұланты · 1730 Аңырақай"),
    t("Свод законов Тәуке хана — «Жеті жарғы».", "Тәуке ханның заңдар жинағы — «Жеті жарғы».", "Tauke Khan's law code — Zheti Zhargy."),
  ],
  "hs-modern": [
    n("16.12.1991 — Тәуелсіздік"),
    n("1992 — мемлекеттік рәміздер · 1995 — Конституция"),
    n("1997 — елорда Ақмолаға · 1998 — Астана атауы"),
    t("Декабрь 1986 — выступления молодёжи в Алма-Ате.", "1986 жылғы желтоқсан — Алматыдағы жастар шеруі.", "December 1986 — the youth protests in Alma-Ata."),
    n("29.08.1991 — Семей полигоны жабылды"),
  ],
  "sat-algebra": [
    n("slope = (y₂ − y₁) / (x₂ − x₁)"),
    t("В текстовой задаче «за единицу» — это наклон, начальное значение — свободный член.", "Мәтінді есепте «бір бірлікке» — көлбеу, бастапқы мән — бос мүше.", "In a word problem, \"per unit\" is the slope and the starting value is the constant."),
    t("Бесконечно много решений — уравнения пропорциональны целиком.", "Шексіз көп шешім — теңдеулер толық пропорционал.", "Infinitely many solutions means the equations are fully proportional."),
    t("Нет решений — коэффициенты пропорциональны, свободные члены нет.", "Шешім жоқ — коэффициенттер пропорционал, бос мүшелер емес.", "No solution: coefficients proportional, constants not."),
    t("Если одна переменная известна — подставляй, не решай систему целиком.", "Бір айнымалы белгілі болса — қой, жүйені толық шешпе.", "If one variable is given, substitute — don't solve the whole system."),
  ],
  "sat-data": [
    n("+p%: ×(1 + p/100)   ·   −p%: ×(1 − p/100)"),
    t("Процент изменения считается от СТАРОГО значения.", "Өзгеру пайызы ЕСКІ мәннен есептеледі.", "Percent change is measured against the OLD value."),
    t("Рост на 10% и падение на 10% дают 0,99 — не исходное значение.", "10%-ға өсу мен 10%-ға кему 0,99 береді — бастапқы мән емес.", "Up 10% then down 10% gives 0.99, not the original."),
    t("Отношение a : b — целое делится на (a + b) частей.", "a : b қатынасы — бүтін (a + b) бөлікке бөлінеді.", "A ratio a : b splits the whole into (a + b) parts."),
    n("Среднее × количество = сумма"),
  ],
  "sat-writing": [
    t("Два самостоятельных предложения нельзя соединить одной запятой.", "Екі дербес сөйлемді жалғыз үтірмен қосуға болмайды.", "Two independent clauses can't be joined by a comma alone."),
    n(". · ; · , + and / but / so"),
    t("Перед however, therefore, moreover между предложениями — точка с запятой.", "Сөйлемдер арасындағы however, therefore, moreover алдында нүктелі үтір.", "Before however, therefore, moreover between clauses use a semicolon."),
    t("Each, every, either — единственное число, что бы ни стояло после «of».", "Each, every, either — жекеше, «of»-тан кейін не тұрса да.", "Each, every, either are singular, whatever follows \"of\"."),
    t("Причастный оборот относится к подлежащему главного предложения.", "Есімше орамы басты сөйлемнің бастауышына қатысты.", "A participial phrase attaches to the main clause's subject."),
  ],
  "ie-reading": [
    t("True — текст подтверждает; False — текст противоречит; Not Given — текст молчит.", "True — мәтін растайды; False — қайшы келеді; Not Given — үндемейді.", "True — confirmed; False — contradicted; Not Given — not mentioned."),
    t("Отсутствие информации — это Not Given, а не False. Самая частая ошибка.", "Ақпараттың болмауы — False емес, Not Given. Ең жиі қате.", "Missing information is Not Given, not False. The classic error."),
    t("Skimming — первое предложение каждого абзаца ради общей идеи.", "Skimming — жалпы идея үшін әр абзацтың бірінші сөйлемі.", "Skimming — the first sentence of each paragraph for the gist."),
    t("Scanning — поиск конкретного слова: даты, имени, числа.", "Scanning — нақты сөзді іздеу: дата, есім, сан.", "Scanning — hunting a specific date, name or number."),
    t("Заголовок абзаца ищи в topic sentence, а не в примерах.", "Абзац тақырыбын мысалдардан емес, topic sentence-тен ізде.", "A paragraph heading lives in the topic sentence, not the examples."),
  ],
  "ie-writing": [
    n("Task 1: 150+ слов, 20 мин · Task 2: 250+ слов, 40 мин, вес ×2"),
    t("В Task 1 нет личного мнения — только описание данных.", "Task 1-де жеке пікір жоқ — тек деректерді сипаттау.", "Task 1 has no personal opinion — describe the data only."),
    t("Обязателен overview: главная тенденция без конкретных цифр.", "Overview міндетті: нақты сандарсыз басты үрдіс.", "An overview is required: the main trend without specific figures."),
    n("Абзац = тезис → объяснение → пример"),
    t("Перефразируй задание во введении, не копируй его дословно.", "Кіріспеде тапсырманы өз сөзіңмен жаз, көшірме.", "Paraphrase the prompt in the introduction; never copy it."),
  ],
  "ie-vocab": [
    n("big → significant · good → beneficial · bad → detrimental"),
    n("a lot of → a considerable number of"),
    t("Парафраз — это смена структуры, а не подмена одного слова.", "Парафраз — құрылымды өзгерту, бір сөзді ауыстыру емес.", "Paraphrase changes the structure, not just one word."),
    n("conduct research · draw a conclusion · play a role"),
    t("Разговорные слова (lots of, folks, a lot) снижают балл за лексику.", "Ауызекі сөздер (lots of, folks, a lot) лексика балын түсіреді.", "Colloquial words (lots of, folks, a lot) cost lexical marks."),
  ],
};

export const summaryOf = (topicId: string): L[] => SUMMARIES[topicId] ?? [];
