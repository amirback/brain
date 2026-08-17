import type { Lesson, Question, Topic } from "../types";
import { n, t } from "./util";

export const historyTopics: Topic[] = [
  {
    id: "hs-ancient",
    subject: "history",
    title: t("Древний Казахстан", "Ежелгі Қазақстан", "Ancient Kazakhstan"),
    blurb: t(
      "Саки, гунны, тюркские каганаты: кто жил на этой земле до казахского народа.",
      "Сақтар, ғұндар, түркі қағанаттары: қазақ халқына дейін бұл жерде кім өмір сүрді.",
      "Saka, Huns and the Turkic khaganates — who lived on this land before the Kazakh people."
    ),
    weight: 0.3,
  },
  {
    id: "hs-khanate",
    subject: "history",
    title: t("Казахское ханство", "Қазақ хандығы", "The Kazakh Khanate"),
    blurb: t(
      "1465 год, ханы, жузы и борьба с джунгарами — ядро вопросов ЕНТ по истории.",
      "1465 жыл, хандар, жүздер және жоңғарлармен күрес — ҰБТ тарих сұрақтарының өзегі.",
      "1465, the khans, the zhuzes and the Dzungar wars — the core of exam history."
    ),
    weight: 0.4,
  },
  {
    id: "hs-modern",
    subject: "history",
    title: t("Независимый Казахстан", "Тәуелсіз Қазақстан", "Independent Kazakhstan"),
    blurb: t(
      "1991 год и далее: государственные символы, реформы, ключевые даты новейшей истории.",
      "1991 жыл және одан кейін: мемлекеттік рәміздер, реформалар, жаңа тарихтың негізгі даталары.",
      "1991 onwards: state symbols, reforms and the key dates of modern history."
    ),
    weight: 0.3,
  },
];

export const historyLessons: Lesson[] = [
  {
    topic: "hs-ancient",
    intro: t(
      "История Казахстана начинается задолго до казахов. Саки, гунны и тюрки создали здесь государственность, кочевую культуру и торговые пути, которыми потом пользовалось ханство.",
      "Қазақстан тарихы қазақтардан әлдеқайда бұрын басталады. Сақтар, ғұндар мен түркілер мұнда мемлекеттілікті, көшпелі мәдениетті және кейін хандық пайдаланған сауда жолдарын қалыптастырды.",
      "Kazakhstan's history starts long before the Kazakhs. The Saka, the Huns and the Turks built statehood, nomadic culture and the trade routes the khanate later used."
    ),
    sections: [
      {
        heading: t("Саки (VIII–III вв. до н. э.)", "Сақтар (б.з.д. VIII–III ғғ.)", "The Saka (8th–3rd c. BC)"),
        body: t(
          "Кочевые племена, знаменитые «звериным стилем» в искусстве. Самая известная находка — Золотой человек из кургана Иссык, найден в 1969 году.",
          "Өнердегі «аң стилімен» әйгілі көшпелі тайпалар. Ең белгілі олжа — 1969 жылы табылған Есік қорғанындағы Алтын адам.",
          "Nomadic tribes famous for the animal style in art. The best-known find is the Golden Man from the Issyk kurgan, discovered in 1969."
        ),
      },
      {
        heading: t("Гунны и тюрки", "Ғұндар мен түркілер", "Huns and Turks"),
        body: t(
          "Гунны под предводительством Аттилы дошли до Европы. В 552 году возник Тюркский каганат — первое крупное тюркское государство на этой территории.",
          "Аттиланың басшылығымен ғұндар Еуропаға дейін жетті. 552 жылы Түркі қағанаты құрылды — осы аумақтағы алғашқы ірі түркі мемлекеті.",
          "The Huns under Attila reached Europe. In 552 the Turkic Khaganate emerged — the first major Turkic state in this territory."
        ),
        formula: "552 — Түркі қағанаты · 1969 — Алтын адам табылды",
      },
    ],
    example: {
      problem: t("Почему Золотой человек так важен для истории Казахстана?", "Алтын адам Қазақстан тарихы үшін неге маңызды?", "Why does the Golden Man matter so much?"),
      steps: [
        t("Найден в 1969 году в кургане Иссык под Алматы.", "1969 жылы Алматы маңындағы Есік қорғанынан табылды.", "Found in 1969 in the Issyk kurgan near Almaty."),
        t("Костюм из более чем 4000 золотых пластин показывает высокий уровень ремесла саков.", "4000-нан астам алтын тілімнен жасалған киім сақтардың қолөнер деңгейін көрсетеді.", "A costume of over 4,000 gold plates shows the Saka's craft level."),
        t("Стал государственным символом: его изображение — на монументе Астана-Байтерек.", "Мемлекеттік символға айналды: бейнесі Астана-Бәйтерек ескерткішінде.", "It became a state symbol, depicted on the Astana-Baiterek monument."),
      ],
    },
  },
  {
    topic: "hs-khanate",
    intro: t(
      "Казахское ханство — точка отсчёта казахской государственности. Даты, имена ханов и логика жузов — то, что чаще всего спрашивают на экзамене.",
      "Қазақ хандығы — қазақ мемлекеттілігінің бастауы. Даталар, хан есімдері және жүздер логикасы — емтиханда ең жиі сұралатын дүние.",
      "The Kazakh Khanate is the starting point of Kazakh statehood. Dates, khans' names and the logic of the zhuzes come up most often."
    ),
    sections: [
      {
        heading: t("Основание", "Құрылуы", "Foundation"),
        body: t(
          "В 1465 году султаны Керей и Жанибек откочевали от хана Абулхаира в Семиречье и основали Казахское ханство.",
          "1465 жылы Керей мен Жәнібек сұлтандар Әбілқайыр ханнан Жетісуға көшіп, Қазақ хандығын құрды.",
          "In 1465 the sultans Kerey and Zhanibek broke away from Khan Abulkhair into Zhetysu and founded the Kazakh Khanate."
        ),
        formula: "1465 — Қазақ хандығының құрылуы (Керей мен Жәнібек)",
      },
      {
        heading: t("Расцвет и жузы", "Гүлдену және жүздер", "Peak and the zhuzes"),
        body: t(
          "При хане Касыме (начало XVI в.) ханство достигло расцвета, а население превысило миллион человек. Позже казахи разделились на три жуза: Старший, Средний и Младший.",
          "Қасым хан тұсында (XVI ғ. басы) хандық гүлденіп, халық саны миллионнан асты. Кейін қазақтар үш жүзге бөлінді: Ұлы, Орта және Кіші жүз.",
          "Under Khan Kasym (early 16th c.) the khanate peaked, its population passing a million. Later the Kazakhs split into three zhuzes: Senior, Middle and Junior."
        ),
      },
      {
        heading: t("Борьба с джунгарами", "Жоңғарлармен күрес", "The Dzungar wars"),
        body: t(
          "1723 год — «Ақтабан шұбырынды», годы великого бедствия. Победы при Буланты (1728) и Аныракае (1730) переломили ход войны.",
          "1723 жыл — «Ақтабан шұбырынды», ұлы апат жылдары. Бұланты (1728) мен Аңырақай (1730) жеңістері соғыс барысын өзгертті.",
          "1723 brought the Aqtaban shubyryndy, the years of great disaster. The victories at Bulanty (1728) and Anyrakai (1730) turned the war."
        ),
      },
    ],
    example: {
      problem: t("Как отвечать на вопрос о дате основания ханства?", "Хандықтың құрылу датасы туралы сұраққа қалай жауап беру керек?", "How to handle a question about the khanate's founding date."),
      steps: [
        t("В вопросе ищи ключевые имена: Керей и Жанибек.", "Сұрақтан негізгі есімдерді тап: Керей мен Жәнібек.", "Look for the key names: Kerey and Zhanibek."),
        t("Место — Семиречье (Жетісу), долина реки Шу.", "Орны — Жетісу, Шу өзені аңғары.", "The place is Zhetysu, the Chu river valley."),
        t("Ответ: 1465 год — год основания Казахского ханства.", "Жауабы: 1465 жыл — Қазақ хандығының құрылған жылы.", "Answer: 1465, the founding of the Kazakh Khanate."),
      ],
    },
  },
  {
    topic: "hs-modern",
    intro: t(
      "16 декабря 1991 года Казахстан стал независимым. Дальше — символы, столица, реформы: даты новейшей истории тоже входят в экзамен.",
      "1991 жылғы 16 желтоқсанда Қазақстан тәуелсіздік алды. Әрі қарай — рәміздер, елорда, реформалар: жаңа тарих даталары да емтиханға кіреді.",
      "On 16 December 1991 Kazakhstan became independent. Symbols, the capital and reforms follow — modern dates are on the exam too."
    ),
    sections: [
      {
        heading: t("Ключевые даты", "Негізгі даталар", "Key dates"),
        body: t(
          "16 декабря 1991 — независимость. 1992 — государственные символы (флаг, герб, гимн). 1995 — принятие действующей Конституции. 1997 — перенос столицы в Акмолу.",
          "1991 жылғы 16 желтоқсан — тәуелсіздік. 1992 — мемлекеттік рәміздер (ту, елтаңба, әнұран). 1995 — қолданыстағы Конституция. 1997 — елорданың Ақмолаға көшуі.",
          "16 Dec 1991 — independence. 1992 — state symbols. 1995 — the current Constitution. 1997 — the capital moves to Akmola."
        ),
        formula: "1991 · 1992 · 1995 · 1997",
      },
      {
        heading: t("Декабрьские события 1986", "1986 жылғы Желтоқсан оқиғасы", "December 1986"),
        body: t(
          "Выступления молодёжи в Алма-Ате в декабре 1986 года стали первым массовым протестом в СССР на национальной почве и предвестником независимости.",
          "1986 жылғы желтоқсанда Алматыдағы жастар шеруі КСРО-дағы ұлттық негіздегі алғашқы жаппай наразылық және тәуелсіздіктің хабаршысы болды.",
          "The youth protests in Alma-Ata in December 1986 were the first mass national protest in the USSR and a herald of independence."
        ),
      },
    ],
    example: {
      problem: t("В каком году столицей стала Астана?", "Астана қай жылы елорда болды?", "In which year did Astana become the capital?"),
      steps: [
        t("Решение о переносе принято в 1994 году.", "Көшіру туралы шешім 1994 жылы қабылданды.", "The decision to move was taken in 1994."),
        t("Фактический перенос — 1997 год, город тогда назывался Акмола.", "Нақты көшу — 1997 жыл, қала сол кезде Ақмола аталды.", "The actual move happened in 1997, when the city was called Akmola."),
        t("Переименование в Астану — 1998 год.", "Астана деп қайта аталуы — 1998 жыл.", "It was renamed Astana in 1998."),
      ],
    },
  },
];

export const historyQuestions: Question[] = [
  {
    id: "hsa1", subject: "history", topic: "hs-ancient", difficulty: 780,
    stem: t("В каком году был найден Золотой человек?", "Алтын адам қай жылы табылды?", "In which year was the Golden Man found?"),
    options: [n("1969"), n("1959"), n("1979"), n("1991")], correct: 0,
    explain: t("Золотой человек найден в 1969 году в кургане Иссык недалеко от Алматы.", "Алтын адам 1969 жылы Алматы маңындағы Есік қорғанынан табылды.", "The Golden Man was found in 1969 in the Issyk kurgan near Almaty."),
    hint: t("Это конец 1960-х годов.", "Бұл 1960 жылдардың соңы.", "It was the late 1960s."),
  },
  {
    id: "hsa2", subject: "history", topic: "hs-ancient", difficulty: 880,
    stem: t("Какой стиль искусства характерен для саков?", "Сақтарға тән өнер стилі қандай?", "Which art style is characteristic of the Saka?"),
    options: [t("Звериный стиль", "Аң стилі", "Animal style"), t("Готика", "Готика", "Gothic"), t("Барокко", "Барокко", "Baroque"), t("Орнаментализм", "Орнаментализм", "Ornamentalism")], correct: 0,
    explain: t("Саки украшали изделия изображениями зверей — это и называют «звериным стилем».", "Сақтар бұйымдарын аң бейнелерімен әшекейледі — оны «аң стилі» дейді.", "The Saka decorated objects with animal figures — hence the animal style."),
    hint: t("Подумай, что чаще всего изображено на сакских золотых изделиях.", "Сақ алтын бұйымдарында көбіне не бейнеленген?", "What is most often depicted on Saka gold?"),
  },
  {
    id: "hsa3", subject: "history", topic: "hs-ancient", difficulty: 980,
    stem: t("В каком году образовался Тюркский каганат?", "Түркі қағанаты қай жылы құрылды?", "In which year was the Turkic Khaganate founded?"),
    options: [n("552"), n("452"), n("652"), n("752")], correct: 0,
    explain: t("Тюркский каганат возник в 552 году — первое крупное тюркское государство региона.", "Түркі қағанаты 552 жылы құрылды — өңірдегі алғашқы ірі түркі мемлекеті.", "The Turkic Khaganate arose in 552 — the region's first major Turkic state."),
    hint: t("Это середина VI века.", "Бұл VI ғасырдың ортасы.", "This is the middle of the 6th century."),
  },
  {
    id: "hsa4", subject: "history", topic: "hs-ancient", difficulty: 1080,
    stem: t("Кто был вождём гуннов, дошедшим до Европы?", "Еуропаға дейін жеткен ғұндардың көсемі кім?", "Which Hun leader reached Europe?"),
    options: [n("Аттила"), n("Модэ"), n("Тумен"), n("Бумын")], correct: 0,
    explain: t("Аттила возглавлял гуннов в V веке и дошёл до Западной Европы.", "Аттила V ғасырда ғұндарды басқарып, Батыс Еуропаға дейін жетті.", "Attila led the Huns in the 5th century and reached Western Europe."),
    hint: t("Его называли «бичом Божьим».", "Оны «Құдайдың қамшысы» деп атаған.", "He was called the Scourge of God."),
  },
  {
    id: "hsa5", subject: "history", topic: "hs-ancient", difficulty: 1180,
    stem: t("Где был найден Золотой человек?", "Алтын адам қай жерден табылды?", "Where was the Golden Man found?"),
    options: [t("Курган Иссык", "Есік қорғаны", "Issyk kurgan"), t("Курган Бесшатыр", "Бесшатыр қорғаны", "Besshatyr kurgan"), t("Городище Отрар", "Отырар қаласы", "Otrar site"), t("Мавзолей Ходжи Ахмеда Ясави", "Қожа Ахмет Ясауи кесенесі", "Yasawi mausoleum")], correct: 0,
    explain: t("Захоронение находится в кургане Иссык в Алматинской области.", "Жерлеу орны Алматы облысындағы Есік қорғанында.", "The burial is in the Issyk kurgan in the Almaty region."),
    hint: t("Название совпадает с названием города недалеко от Алматы.", "Атауы Алматыға жақын қала атымен сәйкес келеді.", "The name matches a town near Almaty."),
  },
  {
    id: "hsa6", subject: "history", topic: "hs-ancient", difficulty: 1300,
    stem: t("Какой торговый путь проходил через территорию Казахстана?", "Қазақстан аумағы арқылы қандай сауда жолы өтті?", "Which trade route crossed Kazakhstan?"),
    options: [t("Великий Шёлковый путь", "Ұлы Жібек жолы", "The Great Silk Road"), t("Янтарный путь", "Кәріптас жолы", "The Amber Road"), t("Путь из варяг в греки", "Варягтардан гректерге жол", "Varangians to the Greeks"), t("Соляной путь", "Тұз жолы", "The Salt Road")], correct: 0,
    explain: t("Через юг Казахстана — Тараз, Отрар, Испиджаб — проходил Великий Шёлковый путь.", "Қазақстанның оңтүстігі арқылы — Тараз, Отырар, Испиджаб — Ұлы Жібек жолы өтті.", "The Great Silk Road passed through southern Kazakhstan — Taraz, Otrar, Ispijab."),
    hint: t("Он соединял Китай со Средиземноморьем.", "Ол Қытайды Жерорта теңізімен байланыстырды.", "It linked China with the Mediterranean."),
  },
  {
    id: "hsk1", subject: "history", topic: "hs-khanate", difficulty: 760,
    stem: t("В каком году образовалось Казахское ханство?", "Қазақ хандығы қай жылы құрылды?", "In which year was the Kazakh Khanate founded?"),
    options: [n("1465"), n("1456"), n("1470"), n("1511")], correct: 0,
    explain: t("Казахское ханство основано в 1465 году султанами Кереем и Жанибеком.", "Қазақ хандығын 1465 жылы Керей мен Жәнібек сұлтандар құрды.", "The Kazakh Khanate was founded in 1465 by the sultans Kerey and Zhanibek."),
    hint: t("Это вторая половина XV века.", "Бұл XV ғасырдың екінші жартысы.", "It's the second half of the 15th century."),
  },
  {
    id: "hsk2", subject: "history", topic: "hs-khanate", difficulty: 860,
    stem: t("Кто основал Казахское ханство?", "Қазақ хандығын кім құрды?", "Who founded the Kazakh Khanate?"),
    options: [t("Керей и Жанибек", "Керей мен Жәнібек", "Kerey and Zhanibek"), t("Абылай и Абулхаир", "Абылай мен Әбілқайыр", "Abylai and Abulkhair"), t("Касым и Хакназар", "Қасым мен Хақназар", "Kasym and Haknazar"), t("Тауке и Есим", "Тәуке мен Есім", "Tauke and Esim")], correct: 0,
    explain: t("Султаны Керей и Жанибек откочевали от Абулхаира и основали ханство.", "Керей мен Жәнібек сұлтандар Әбілқайырдан көшіп, хандық құрды.", "The sultans Kerey and Zhanibek broke from Abulkhair and founded the khanate."),
    hint: t("Их имена всегда называют вместе.", "Олардың есімдері әрқашан қатар аталады.", "Their names are always mentioned together."),
  },
  {
    id: "hsk3", subject: "history", topic: "hs-khanate", difficulty: 960,
    stem: t("При каком хане Казахское ханство достигло наивысшего расцвета?", "Қазақ хандығы қай ханның тұсында ең жоғары гүлдену кезеңіне жетті?", "Under which khan did the Kazakh Khanate reach its peak?"),
    options: [n("Қасым"), n("Абылай"), n("Тәуке"), n("Есім")], correct: 0,
    explain: t("При хане Касыме в начале XVI века численность населения превысила миллион человек.", "Қасым хан тұсында XVI ғасыр басында халық саны миллионнан асты.", "Under Khan Kasym in the early 16th century the population passed a million."),
    hint: t("С его именем связано выражение «Қасым ханның қасқа жолы».", "Оның есімімен «Қасым ханның қасқа жолы» тіркесі байланысты.", "His name is linked to the law code Qasym khannyng qasqa zholy."),
  },
  {
    id: "hsk4", subject: "history", topic: "hs-khanate", difficulty: 1080,
    stem: t("Сколько жузов было у казахов?", "Қазақтарда неше жүз болды?", "How many zhuzes did the Kazakhs have?"),
    options: [t("Три", "Үш", "Three"), t("Два", "Екі", "Two"), t("Четыре", "Төрт", "Four"), t("Пять", "Бес", "Five")], correct: 0,
    explain: t("Три жуза: Старший (Ұлы), Средний (Орта) и Младший (Кіші).", "Үш жүз: Ұлы, Орта және Кіші жүз.", "Three zhuzes: Senior, Middle and Junior."),
    hint: t("Старший, Средний и ещё один.", "Ұлы, Орта және тағы біреуі.", "Senior, Middle and one more."),
  },
  {
    id: "hsk5", subject: "history", topic: "hs-khanate", difficulty: 1200,
    stem: t("Что означает «Ақтабан шұбырынды» 1723 года?", "1723 жылғы «Ақтабан шұбырынды» нені білдіреді?", "What does the 1723 Aqtaban shubyryndy mean?"),
    options: [
      t("Годы великого бедствия при нашествии джунгар", "Жоңғар шапқыншылығы кезіндегі ұлы апат жылдары", "The years of great disaster during the Dzungar invasion"),
      t("Год основания ханства", "Хандық құрылған жыл", "The year the khanate was founded"),
      t("Победу над джунгарами", "Жоңғарларды жеңу", "A victory over the Dzungars"),
      t("Принятие свода законов", "Заңдар жинағын қабылдау", "The adoption of a law code"),
    ], correct: 0,
    explain: t("Так называют годы массового бегства казахов от джунгарского нашествия, начавшегося в 1723 году.", "Бұл 1723 жылы басталған жоңғар шапқыншылығынан қазақтардың жаппай босуын білдіреді.", "It names the years of mass flight from the Dzungar invasion that began in 1723."),
    hint: t("Дословно — «босые ноги, бредущие в изнеможении».", "Сөзбе-сөз — «жалаң табан, әбден шаршап босу».", "Literally: bare soles, wandering in exhaustion."),
  },
  {
    id: "hsk6", subject: "history", topic: "hs-khanate", difficulty: 1340,
    stem: t("В каком году произошла Аныракайская битва?", "Аңырақай шайқасы қай жылы болды?", "In which year was the Battle of Anyrakai?"),
    options: [n("1730"), n("1723"), n("1728"), n("1741")], correct: 0,
    explain: t("Аныракайская битва 1730 года стала переломной победой над джунгарами.", "1730 жылғы Аңырақай шайқасы жоңғарларды жеңудегі бетбұрысты жеңіс болды.", "The 1730 Battle of Anyrakai was the decisive victory over the Dzungars."),
    hint: t("Это через два года после битвы при Буланты.", "Бұл Бұланты шайқасынан екі жыл кейін.", "It came two years after the Battle of Bulanty."),
  },
  {
    id: "hsm1", subject: "history", topic: "hs-modern", difficulty: 740,
    stem: t("Когда Казахстан провозгласил независимость?", "Қазақстан тәуелсіздігін қашан жариялады?", "When did Kazakhstan declare independence?"),
    options: [t("16 декабря 1991", "1991 жылғы 16 желтоқсан", "16 December 1991"), t("25 октября 1990", "1990 жылғы 25 қазан", "25 October 1990"), t("1 января 1992", "1992 жылғы 1 қаңтар", "1 January 1992"), t("30 августа 1995", "1995 жылғы 30 тамыз", "30 August 1995")], correct: 0,
    explain: t("Независимость провозглашена 16 декабря 1991 года — это главный государственный праздник.", "Тәуелсіздік 1991 жылғы 16 желтоқсанда жарияланды — бұл басты мемлекеттік мереке.", "Independence was declared on 16 December 1991 — the main state holiday."),
    hint: t("Это День Независимости, который отмечают каждый год.", "Бұл жыл сайын атап өтілетін Тәуелсіздік күні.", "It's the Independence Day celebrated every year."),
  },
  {
    id: "hsm2", subject: "history", topic: "hs-modern", difficulty: 860,
    stem: t("В каком году были приняты государственные символы Казахстана?", "Қазақстанның мемлекеттік рәміздері қай жылы қабылданды?", "When were Kazakhstan's state symbols adopted?"),
    options: [n("1992"), n("1991"), n("1995"), n("1997")], correct: 0,
    explain: t("Флаг, герб и гимн приняты в 1992 году, через год после независимости.", "Ту, елтаңба және әнұран 1992 жылы, тәуелсіздіктен бір жыл кейін қабылданды.", "The flag, emblem and anthem were adopted in 1992, a year after independence."),
    hint: t("Это следующий год после провозглашения независимости.", "Бұл тәуелсіздік жарияланғаннан кейінгі жыл.", "It's the year right after independence."),
  },
  {
    id: "hsm3", subject: "history", topic: "hs-modern", difficulty: 980,
    stem: t("В каком году столица была перенесена из Алматы?", "Елорда Алматыдан қай жылы көшірілді?", "In which year was the capital moved from Almaty?"),
    options: [n("1997"), n("1994"), n("1998"), n("1991")], correct: 0,
    explain: t("Фактический перенос состоялся в 1997 году, город тогда назывался Акмола.", "Нақты көшу 1997 жылы болды, қала сол кезде Ақмола аталды.", "The actual move happened in 1997, when the city was still Akmola."),
    hint: t("Решение приняли в 1994-м, а переехали позже.", "Шешім 1994 жылы қабылданды, ал көшу кейінірек болды.", "The decision came in 1994; the move was later."),
  },
  {
    id: "hsm4", subject: "history", topic: "hs-modern", difficulty: 1100,
    stem: t("Что произошло в Алма-Ате в декабре 1986 года?", "1986 жылғы желтоқсанда Алматыда не болды?", "What happened in Alma-Ata in December 1986?"),
    options: [
      t("Выступления молодёжи против решения Москвы", "Мәскеу шешіміне қарсы жастар шеруі", "Youth protests against Moscow's decision"),
      t("Провозглашение независимости", "Тәуелсіздік жариялау", "The declaration of independence"),
      t("Принятие Конституции", "Конституция қабылдау", "The adoption of the Constitution"),
      t("Перенос столицы", "Елорданы көшіру", "The capital's relocation"),
    ], correct: 0,
    explain: t("Молодёжь вышла на площадь после снятия Кунаева и назначения Колбина — первый массовый национальный протест в СССР.", "Қонаевты орнынан алып, Колбинді тағайындағаннан кейін жастар алаңға шықты — КСРО-дағы алғашқы жаппай ұлттық наразылық.", "Young people took to the square after Kunaev was replaced by Kolbin — the USSR's first mass national protest."),
    hint: t("Это связано со сменой руководителя республики.", "Бұл республика басшысының ауысуымен байланысты.", "It was tied to a change of the republic's leader."),
  },
  {
    id: "hsm5", subject: "history", topic: "hs-modern", difficulty: 1200,
    stem: t("В каком году принята действующая Конституция Казахстана?", "Қазақстанның қолданыстағы Конституциясы қай жылы қабылданды?", "When was Kazakhstan's current Constitution adopted?"),
    options: [n("1995"), n("1993"), n("1991"), n("1998")], correct: 0,
    explain: t("Действующая Конституция принята на референдуме 30 августа 1995 года.", "Қолданыстағы Конституция 1995 жылғы 30 тамызда референдумда қабылданды.", "The current Constitution was adopted by referendum on 30 August 1995."),
    hint: t("День Конституции отмечают 30 августа.", "Конституция күні 30 тамызда аталады.", "Constitution Day is 30 August."),
  },
  {
    id: "hsm6", subject: "history", topic: "hs-modern", difficulty: 1320,
    stem: t("Какой ядерный полигон был закрыт в 1991 году?", "1991 жылы қандай ядролық полигон жабылды?", "Which nuclear test site was closed in 1991?"),
    options: [n("Семипалатинский"), n("Байқоңыр"), n("Капустин Яр"), n("Азгир")], correct: 0,
    explain: t("Семипалатинский ядерный полигон закрыт указом 29 августа 1991 года.", "Семей ядролық полигоны 1991 жылғы 29 тамыздағы жарлықпен жабылды.", "The Semipalatinsk test site was closed by decree on 29 August 1991."),
    hint: t("Он находился на востоке страны, рядом с Семеем.", "Ол елдің шығысында, Семей маңында орналасқан.", "It was in the east, near Semey."),
  },
];
