import type { LessonSection, SubjectId } from "../types";
import { t } from "./util";

/**
 * Extra lecture sections appended to each lesson. Kept apart from the core
 * lessons so the reading material can grow without touching the question bank.
 */
export const EXTRA_SECTIONS: Record<string, LessonSection[]> = {
  linear: [
    {
      heading: t("Особые случаи", "Ерекше жағдайлар", "Special cases"),
      body: t(
        "Если после упрощения x исчезает и остаётся верное равенство (0 = 0) — корней бесконечно много. Если остаётся неверное (0 = 5) — корней нет вообще. На экзамене такие уравнения дают специально, чтобы поймать на автоматизме.",
        "Ықшамдаудан кейін x жоғалып, дұрыс теңдік қалса (0 = 0) — түбір шексіз көп. Қате теңдік қалса (0 = 5) — түбір мүлдем жоқ. Емтиханда мұндай теңдеулерді автоматизмге сүйенгендерді ұстау үшін әдейі береді.",
        "If x cancels out and a true statement remains (0 = 0), there are infinitely many roots. If a false one remains (0 = 5), there are none. Exams include these deliberately to catch autopilot."
      ),
      formula: "2(x + 1) = 2x + 2  →  0 = 0  →  ∞ решений",
    },
    {
      heading: t("Текстовые задачи", "Мәтінді есептер", "Word problems"),
      body: t(
        "Порядок всегда один: обозначь искомое за x, выпиши все условия на языке формул, составь уравнение, реши, проверь по смыслу. Последний шаг пропускают чаще всего — а именно он ловит ответ «возраст = −4».",
        "Тәртіп әрқашан бірдей: ізделіндіні x деп белгіле, барлық шартты формула тілінде жаз, теңдеу құр, шеш, мағынасы бойынша тексер. Соңғы қадамды жиі өткізіп жібереді — ал дәл сол «жасы = −4» деген жауапты ұстайды.",
        "The order never changes: call the unknown x, write every condition as a formula, build the equation, solve, then sanity-check. People skip that last step — and it's what catches an answer like \"age = −4\"."
      ),
    },
  ],
  quadratic: [
    {
      heading: t("Выделение полного квадрата", "Толық квадратты бөліп алу", "Completing the square"),
      body: t(
        "Любой квадратный трёхчлен можно свернуть: x² + 6x + 5 = (x + 3)² − 4. Это тот же приём, из которого выводится формула корней, и он же мгновенно даёт вершину параболы.",
        "Кез келген квадрат үшмүшені жинауға болады: x² + 6x + 5 = (x + 3)² − 4. Бұл — түбір формуласы шығатын әдіс, әрі параболаның төбесін бірден береді.",
        "Any quadratic folds up: x² + 6x + 5 = (x + 3)² − 4. It's the same move the root formula comes from, and it hands you the vertex instantly."
      ),
      formula: "x² + px + q = (x + p/2)² − p²/4 + q",
    },
    {
      heading: t("Знаки корней без вычислений", "Есептеусіз түбір таңбалары", "Root signs without computing"),
      body: t(
        "По теореме Виета знак произведения q говорит, одинаковые ли знаки у корней, а знак суммы −p — какой из них перевешивает. Часто этого достаточно, чтобы выбрать ответ, не решая уравнение.",
        "Виет теоремасы бойынша q көбейтіндісінің таңбасы түбірлердің таңбасы бірдей ме екенін, ал −p қосындысының таңбасы қайсысы басым екенін көрсетеді. Көбіне теңдеуді шешпей-ақ жауап таңдауға осы жеткілікті.",
        "By Vieta, the sign of the product q tells you whether the roots share a sign, and the sign of the sum −p tells you which side wins. Often that alone picks the answer."
      ),
    },
  ],
  functions: [
    {
      heading: t("Сдвиги графика", "График ығысулары", "Shifting a graph"),
      body: t(
        "f(x) + a поднимает график на a вверх, f(x + a) сдвигает его на a ВЛЕВО. Второе контринтуитивно и потому спрашивается чаще: знак внутри скобки работает наоборот.",
        "f(x) + a графикті a-ға жоғары көтереді, f(x + a) оны a-ға СОЛҒА жылжытады. Екіншісі түйсікке қайшы, сондықтан жиі сұралады: жақша ішіндегі таңба керісінше жұмыс істейді.",
        "f(x) + a lifts the graph by a; f(x + a) shifts it a units LEFT. The second is counter-intuitive, which is exactly why it gets asked."
      ),
      formula: "y = f(x − h) + k  →  сдвиг на h вправо и k вверх",
    },
    {
      heading: t("Чтение графика на экзамене", "Емтиханда графикті оқу", "Reading a graph in an exam"),
      body: t(
        "Смотри в таком порядке: пересечения с осями, направление ветвей или наклон, вершина или точки перелома. Три этих факта почти всегда однозначно определяют нужный вариант ответа.",
        "Мына ретпен қара: осьтермен қиылысу, тармақтардың бағыты не көлбеуі, төбесі не сыну нүктелері. Осы үш факт әрдайым дерлік дұрыс нұсқаны бірмәнді анықтайды.",
        "Read in this order: axis crossings, direction or slope, vertex or turning points. Those three facts nearly always pin down the right option."
      ),
    },
  ],
  "en-tenses": [
    {
      heading: t("Согласование времён", "Шақтардың сәйкестігі", "Sequence of tenses"),
      body: t(
        "В косвенной речи время сдвигается на шаг назад: says «I am busy» → said he was busy. Present Perfect и Past Simple при этом оба уходят в Past Perfect.",
        "Төлеу сөзде шақ бір қадам артқа жылжиды: says «I am busy» → said he was busy. Present Perfect пен Past Simple екеуі де Past Perfect-ке ауысады.",
        "In reported speech the tense steps back: says \"I am busy\" → said he was busy. Both Present Perfect and Past Simple become Past Perfect."
      ),
      formula: "am/is → was · do → did · have done → had done",
    },
  ],
  "en-articles": [
    {
      heading: t("Когда артикль не нужен", "Артикль қажет емес кезде", "When no article is needed"),
      body: t(
        "Нулевой артикль ставится перед неисчисляемыми и множественными в общем смысле (water is wet, cats sleep), перед языками, большинством стран, приёмами пищи и видами транспорта в устойчивых оборотах (by bus, at home).",
        "Нөлдік артикль жалпы мағынадағы саналмайтын және көпше сөздердің (water is wet, cats sleep), тілдердің, көптеген елдердің, тамақ түрлерінің және тұрақты тіркестердегі көлік түрлерінің алдында қойылады (by bus, at home).",
        "Zero article goes before uncountables and generic plurals (water is wet, cats sleep), languages, most countries, meals, and transport in fixed phrases (by bus, at home)."
      ),
    },
  ],
  "en-vocab": [
    {
      heading: t("Фразовые глаголы", "Фразалық етістіктер", "Phrasal verbs"),
      body: t(
        "Значение меняется от предлога целиком: give up — сдаться, give in — уступить, give away — отдать. Заучивать их надо парами «глагол + предлог», а не по отдельности.",
        "Мағына көмекші сөзге қарай толық өзгереді: give up — бас тарту, give in — көну, give away — беріп жіберу. Оларды жеке емес, «етістік + көмекші сөз» жұбымен жаттау керек.",
        "The particle changes everything: give up, give in, give away all mean different things. Learn them as verb-plus-particle pairs, never separately."
      ),
    },
  ],
  "kz-septik": [
    {
      heading: t("Тәуелдік жалғауы", "Тәуелдік жалғауы", "Possessive endings"),
      body: t(
        "Тәуелдік показывает принадлежность и ставится ПЕРЕД падежным окончанием: кітап + ым + да = кітабымда. Порядок жалғау в казахском строгий: көптік → тәуелдік → септік → жіктік.",
        "Тәуелдік меншіктілікті білдіреді және септік жалғауының АЛДЫНА қойылады: кітап + ым + да = кітабымда. Қазақ тілінде жалғау реті қатаң: көптік → тәуелдік → септік → жіктік.",
        "Possessive endings mark ownership and come BEFORE the case ending: кітап + ым + да = кітабымда. Kazakh keeps a strict order: plural → possessive → case → personal."
      ),
      formula: "көптік → тәуелдік → септік → жіктік",
    },
  ],
  "kz-etistik": [
    {
      heading: t("Есімше и көсемше", "Есімше және көсемше", "Participles and converbs"),
      body: t(
        "Есімше — причастие: оқыған бала (читавший ребёнок). Көсемше — деепричастие: оқып отыр (сидит, читая). Именно көсемше образует составные времена вместе со вспомогательными глаголами.",
        "Есімше — есімдік тұлғалы етістік: оқыған бала. Көсемше — оқып отыр. Дәл көсемше көмекші етістіктермен бірге күрделі шақтарды жасайды.",
        "Esimshe works like a participle (оқыған бала), koseмshe like a converb (оқып отыр). The converb is what builds compound tenses with auxiliaries."
      ),
    },
  ],
  "kz-soz": [
    {
      heading: t("Сан есім түрлері", "Сан есім түрлері", "Kinds of numerals"),
      body: t(
        "Есептік (бес), реттік (бесінші), жинақтық (бесеу), болжалдық (бестей), топтық (бес-бестен). На экзамене чаще всего путают реттік и жинақтық — они отвечают на разные вопросы: нешінші? и нешеу?",
        "Есептік (бес), реттік (бесінші), жинақтық (бесеу), болжалдық (бестей), топтық (бес-бестен). Емтиханда көбіне реттік пен жинақтықты шатастырады — олар әртүрлі сұраққа жауап береді: нешінші? және нешеу?",
        "Kazakh numerals come in five kinds. The two most often confused are ordinal (нешінші?) and collective (нешеу?)."
      ),
    },
  ],
  "hs-ancient": [
    {
      heading: t("Как запоминать даты", "Даталарды қалай есте сақтау керек", "How to hold the dates"),
      body: t(
        "Даты держатся не списком, а цепочкой причин: саки → гунны → тюркский каганат → Шёлковый путь → города юга. Если помнишь порядок событий, конкретный год почти всегда вспоминается по соседям.",
        "Даталар тізіммен емес, себеп тізбегімен есте қалады: сақтар → ғұндар → түркі қағанаты → Жібек жолы → оңтүстік қалалары. Оқиға ретін білсең, нақты жыл көршілері арқылы еске түседі.",
        "Dates stick as a chain, not a list: Saka → Huns → Turkic Khaganate → Silk Road → southern cities. Know the order and the year usually comes back from its neighbours."
      ),
    },
  ],
  "hs-khanate": [
    {
      heading: t("Жеті жарғы", "Жеті жарғы", "Zheti Zhargy"),
      body: t(
        "Свод законов хана Тауке начала XVIII века: закрепил нормы о собственности, суде биев и куне. Вместе с «Қасым ханның қасқа жолы» и «Есім ханның ескі жолы» образует три главных правовых памятника ханства.",
        "Тәуке ханның XVIII ғасыр басындағы заңдар жинағы: меншік, билер соты және құн нормаларын бекітті. «Қасым ханның қасқа жолы» және «Есім ханның ескі жолымен» бірге хандықтың үш басты құқықтық ескерткішін құрайды.",
        "Tauke Khan's early-18th-century code fixed rules on property, the biys' court and blood money. With Kasym's and Esim's codes it forms the khanate's three legal monuments."
      ),
      formula: "Қасым ханның қасқа жолы → Есім ханның ескі жолы → Жеті жарғы",
    },
  ],
  "hs-modern": [
    {
      heading: t("Государственные символы", "Мемлекеттік рәміздер", "State symbols"),
      body: t(
        "Флаг, герб и гимн приняты 4 июня 1992 года. Автор флага и герба — Шакен Ниязбеков и Жандарбек Малибеков соответственно. Гимн в нынешней редакции утверждён в 2006 году на основе песни «Менің Қазақстаным».",
        "Ту, елтаңба және әнұран 1992 жылғы 4 маусымда қабылданды. Ту авторы — Шәкен Ниязбеков, елтаңба авторы — Жандарбек Мәлібеков. Қазіргі әнұран 2006 жылы «Менің Қазақстаным» әні негізінде бекітілді.",
        "The flag, emblem and anthem were adopted on 4 June 1992. The current anthem, based on the song Menin Qazaqstanym, was approved in 2006."
      ),
    },
  ],
  "sat-algebra": [
    {
      heading: t("Как экономить время", "Уақытты қалай үнемдеу керек", "Saving time"),
      body: t(
        "Если в ответах числа — подставляй их в условие вместо решения уравнения. Начинай со среднего варианта: часто сразу видно, в какую сторону двигаться. Это быстрее алгебры почти всегда.",
        "Жауаптарда сандар болса — теңдеуді шешудің орнына оларды шартқа қой. Ортаңғы нұсқадан баста: қай бағытқа жылжу керегі бірден көрінеді. Бұл алгебрадан әрдайым дерлік жылдам.",
        "When the options are numbers, plug them into the condition instead of solving. Start from the middle one — you usually see which way to move. It beats algebra almost every time."
      ),
    },
  ],
  "sat-data": [
    {
      heading: t("Чтение таблиц", "Кестелерді оқу", "Reading tables"),
      body: t(
        "Сначала прочитай заголовок и единицы, только потом цифры. Больше половины ошибок в этом разделе — это верно посчитанное число не в тех единицах или не из той строки.",
        "Алдымен тақырып пен өлшем бірлігін оқы, содан кейін ғана сандарды. Бұл бөлімдегі қателердің жартысынан көбі — дұрыс есептелген сан, бірақ басқа өлшемде не басқа жолдан.",
        "Read the title and the units before the numbers. More than half the errors here are a correctly computed value in the wrong units or from the wrong row."
      ),
    },
  ],
  "sat-writing": [
    {
      heading: t("Тире и двоеточие", "Сызықша және қос нүкте", "Dashes and colons"),
      body: t(
        "Двоеточие ставится только после законченного предложения и вводит объяснение или перечисление. Тире работает как «мягкие скобки»: их всегда два, если вставка внутри предложения.",
        "Қос нүкте тек аяқталған сөйлемнен кейін қойылады және түсіндірме не тізбе енгізеді. Сызықша «жұмсақ жақша» ретінде жұмыс істейді: сөйлем ішінде болса, әрқашан екеу.",
        "A colon follows a complete sentence and introduces an explanation or list. Dashes act as soft parentheses — use two when the insert sits inside the sentence."
      ),
    },
  ],
  "ie-reading": [
    {
      heading: t("Управление временем", "Уақытты басқару", "Timing"),
      body: t(
        "60 минут на три текста — это 20 минут на каждый, включая перенос ответов. Если вопрос не поддался за минуту, ставь любую букву, помечай и иди дальше: непройденные вопросы стоят дороже неточных.",
        "Үш мәтінге 60 минут — әрқайсысына 20 минут, жауаптарды көшіруді қоса. Сұрақ бір минутта шықпаса, кез келген әріпті қойып, белгілеп, әрі қарай жүр: жауапсыз сұрақ дәл емес жауаптан қымбат.",
        "60 minutes for three passages means 20 each, transfer included. If a question resists for a minute, put any letter, flag it and move on — blanks cost more than guesses."
      ),
    },
  ],
  "ie-writing": [
    {
      heading: t("Частые потери баллов", "Балл жоғалтудың жиі себептері", "Where bands are lost"),
      body: t(
        "Недобор слов, отсутствие overview в Task 1, один абзац вместо структуры, повторение слов из задания без парафраза и вывод, который повторяет введение слово в слово.",
        "Сөз санының жетпеуі, Task 1-де overview болмауы, құрылым орнына бір абзац, тапсырма сөздерін парафразсыз қайталау және кіріспені сөзбе-сөз қайталайтын қорытынды.",
        "Under the word count, no overview in Task 1, one block instead of paragraphs, copying the prompt without paraphrase, and a conclusion that repeats the introduction verbatim."
      ),
    },
  ],
  "ie-vocab": [
    {
      heading: t("Точность важнее редкости", "Дәлдік сиректіктен маңызды", "Precision beats rarity"),
      body: t(
        "Редкое слово не в том значении снижает балл сильнее, чем простое и точное. Экзаменатор оценивает уместность, а не длину: лучше уверенно использовать двадцать точных слов, чем неуверенно — сто редких.",
        "Сирек сөзді дұрыс емес мағынада қолдану балды қарапайым әрі дәл сөзден көбірек түсіреді. Емтихан алушы ұзындықты емес, орындылықты бағалайды.",
        "A rare word in the wrong sense costs more than a plain, accurate one. Examiners grade appropriacy, not length."
      ),
    },
  ],
};

export interface Resource {
  title: string;
  url: string;
  note: { ru: string; kk: string; en: string };
}

/**
 * External material per subject. These are stable, well-known entry points
 * rather than deep links, so they don't rot between now and the exam.
 */
export const RESOURCES: Record<SubjectId, Resource[]> = {
  math: [
    { title: "Khan Academy — Algebra", url: "https://www.khanacademy.org/math/algebra", note: t("Полный бесплатный курс алгебры с видео и практикой", "Видео мен практикасы бар толық тегін алгебра курсы", "A full free algebra course with video and practice") },
    { title: "Khan Academy қазақша", url: "https://kk.khanacademy.org/", note: t("Тот же курс на казахском языке", "Сол курстың қазақша нұсқасы", "The same course in Kazakh") },
    { title: "Bilimland", url: "https://bilimland.kz/", note: t("Казахстанская платформа с уроками по школьной программе", "Мектеп бағдарламасы бойынша сабақтары бар қазақстандық платформа", "A Kazakhstani platform following the school curriculum") },
  ],
  english: [
    { title: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish", note: t("Грамматика и аудирование от носителей, бесплатно", "Ана тілі иелерінен грамматика мен тыңдалым, тегін", "Grammar and listening from native speakers, free") },
    { title: "Cambridge Grammar in Use", url: "https://www.cambridgeenglish.org/learning-english/", note: t("Справочник и упражнения по всем временам", "Барлық шақтар бойынша анықтамалық және жаттығулар", "Reference and drills for every tense") },
  ],
  kazakh: [
    { title: "Til-Qazyna", url: "https://tilqazyna.kz/", note: t("Национальный центр развития языка: правила и словари", "Тіл дамыту ұлттық орталығы: ережелер мен сөздіктер", "The national language centre: rules and dictionaries") },
    { title: "Sozdik.kz", url: "https://sozdik.kz/", note: t("Словарь с примерами употребления", "Қолданылу мысалдары бар сөздік", "A dictionary with usage examples") },
  ],
  history: [
    { title: "E-history.kz", url: "https://e-history.kz/", note: t("Портал по истории Казахстана с документами", "Құжаттары бар Қазақстан тарихы порталы", "A Kazakhstan history portal with source documents") },
    { title: "Bilimland — Тарих", url: "https://bilimland.kz/", note: t("Уроки по школьному курсу истории", "Мектеп тарих курсы бойынша сабақтар", "Lessons following the school history course") },
  ],
  sat: [
    { title: "College Board — SAT Practice", url: "https://satsuite.collegeboard.org/practice", note: t("Официальные тесты и приложение Bluebook", "Ресми тесттер және Bluebook қосымшасы", "Official practice tests and the Bluebook app") },
    { title: "Khan Academy — Official SAT Prep", url: "https://www.khanacademy.org/sat", note: t("Официальная бесплатная подготовка вместе с College Board", "College Board-пен бірге жасалған ресми тегін дайындық", "The official free prep built with College Board") },
  ],
  ielts: [
    { title: "IELTS — Preparation", url: "https://ielts.org/take-a-test/preparation-resources", note: t("Официальные материалы и пробные тесты", "Ресми материалдар мен сынақ тесттері", "Official materials and practice tests") },
    { title: "British Council — Take IELTS", url: "https://takeielts.britishcouncil.org/take-ielts/prepare", note: t("Разборы всех четырёх секций с примерами", "Барлық төрт секцияның мысалдармен талдауы", "Walkthroughs of all four sections with samples") },
  ],
};
