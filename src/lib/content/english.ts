import type { Lesson, Question, Topic } from "../types";
import { n, t } from "./util";

export const englishTopics: Topic[] = [
  {
    id: "en-tenses",
    subject: "english",
    title: t("Времена глагола", "Етістік шақтары", "Verb tenses"),
    blurb: t(
      "Present / Past / Future и их перфектные формы — половина ошибок в тестах именно здесь.",
      "Present / Past / Future және олардың перфект формалары — тесттегі қателердің жартысы осында.",
      "Present / Past / Future and their perfect forms — half of all test mistakes live here."
    ),
    weight: 0.4,
  },
  {
    id: "en-articles",
    subject: "english",
    title: t("Артикли и предлоги", "Артикльдер мен көмекші сөздер", "Articles and prepositions"),
    blurb: t(
      "a / an / the и предлоги места и времени: то, чего нет в русском и казахском.",
      "a / an / the және орын мен уақыт көмекші сөздері: орыс пен қазақ тілінде жоқ дүние.",
      "a / an / the plus prepositions of place and time — the bits with no direct equivalent at home."
    ),
    weight: 0.3,
  },
  {
    id: "en-vocab",
    subject: "english",
    title: t("Лексика и словообразование", "Лексика және сөзжасам", "Vocabulary and word formation"),
    blurb: t(
      "Суффиксы, приставки и устойчивые сочетания — как из одного корня получить нужную часть речи.",
      "Жұрнақтар, префикстер және тұрақты тіркестер — бір түбірден керек сөз табын қалай жасау керек.",
      "Suffixes, prefixes and collocations — turning one root into the part of speech you need."
    ),
    weight: 0.3,
  },
];

export const englishLessons: Lesson[] = [
  {
    topic: "en-tenses",
    intro: t(
      "Английское время отвечает на два вопроса сразу: когда произошло и важен ли результат сейчас. Русское «я сделал» — это и Past Simple, и Present Perfect, поэтому выбирать приходится по контексту.",
      "Ағылшын шағы бір мезгілде екі сұраққа жауап береді: қашан болды және нәтиже қазір маңызды ма. Қазақша «істедім» — Past Simple те, Present Perfect те, сондықтан контекст бойынша таңдау керек.",
      "An English tense answers two questions at once: when it happened, and whether the result matters now. That second half is what learners usually miss."
    ),
    sections: [
      {
        heading: t("Past Simple и Present Perfect", "Past Simple және Present Perfect", "Past Simple vs Present Perfect"),
        body: t(
          "Past Simple — законченное действие в законченном времени: yesterday, in 2020, last week. Present Perfect — результат важен сейчас: already, just, yet, ever, never.",
          "Past Simple — аяқталған уақыттағы аяқталған әрекет: yesterday, in 2020, last week. Present Perfect — нәтиже қазір маңызды: already, just, yet, ever, never.",
          "Past Simple: a finished action in a finished time — yesterday, in 2020, last week. Present Perfect: the result matters now — already, just, yet, ever, never."
        ),
        formula: "I saw him yesterday.  ·  I have already seen this film.",
      },
      {
        heading: t("Continuous: процесс", "Continuous: үдеріс", "Continuous: process"),
        body: t(
          "Continuous показывает действие в процессе в конкретный момент: now, at the moment, while. Глаголы состояния (know, like, want, need) в Continuous обычно не ставятся.",
          "Continuous нақты сәттегі үдерісті көрсетеді: now, at the moment, while. Күй етістіктері (know, like, want, need) әдетте Continuous-та қолданылмайды.",
          "Continuous shows an action in progress at a given moment: now, at the moment, while. State verbs (know, like, want, need) normally avoid it."
        ),
        formula: "be + V-ing:  She is reading now.",
      },
      {
        heading: t("Будущее", "Келер шақ", "The future"),
        body: t(
          "will — решение в момент речи и прогноз. be going to — заранее принятое намерение или видимое доказательство.",
          "will — сөйлеу сәтіндегі шешім және болжам. be going to — алдын ала қабылданған ниет немесе көзге көрінетін дәлел.",
          "will — a decision made now, or a prediction. be going to — an intention decided earlier, or visible evidence."
        ),
      },
    ],
    example: {
      problem: n("Choose: I ___ my homework, so I can go out now."),
      steps: [
        t("Результат важен сейчас («могу выйти») → Present Perfect.", "Нәтиже қазір маңызды («шыға аламын») → Present Perfect.", "The result matters now (\"I can go out\") → Present Perfect."),
        t("Формула: have / has + V3. Подлежащее I → have.", "Формула: have / has + V3. Бастауыш I → have.", "Formula: have / has + V3. Subject I → have."),
        n("Answer: I have done my homework, so I can go out now."),
      ],
    },
  },
  {
    topic: "en-articles",
    intro: t(
      "Артикль показывает, знает ли собеседник, о каком предмете речь. «Дай книгу» на английском обязано выбрать между a book (любую) и the book (ту самую).",
      "Артикль тыңдаушының қай зат туралы айтылып жатқанын білетінін көрсетеді. «Кітап бер» ағылшынша a book (кез келген) мен the book (нақ сол) арасынан таңдауға мәжбүр.",
      "An article says whether the listener already knows which thing you mean. \"Give me a book\" and \"give me the book\" are different requests."
    ),
    sections: [
      {
        heading: t("a / an и the", "a / an және the", "a / an and the"),
        body: t(
          "a / an — предмет упоминается впервые или он один из многих. the — собеседник понимает, о каком именно предмете речь, либо предмет единственный в мире.",
          "a / an — зат алғаш рет аталады немесе көптің бірі. the — тыңдаушы нақты қай зат екенін түсінеді немесе зат әлемде жалғыз.",
          "a / an — first mention, or one of many. the — the listener knows which one, or the thing is unique."
        ),
        formula: "I saw a dog. The dog was huge.",
      },
      {
        heading: t("Предлоги времени", "Уақыт көмекші сөздері", "Prepositions of time"),
        body: t(
          "at — точное время (at 5 o'clock), on — дни и даты (on Monday), in — месяцы, годы, длинные периоды (in July, in 2026).",
          "at — нақты уақыт (at 5 o'clock), on — күндер мен күнтізбелік даталар (on Monday), in — айлар, жылдар, ұзақ кезеңдер (in July, in 2026).",
          "at — exact time (at 5 o'clock), on — days and dates (on Monday), in — months, years, long periods (in July, in 2026)."
        ),
        formula: "at 7 pm · on Friday · in September",
      },
    ],
    example: {
      problem: n("Choose: We met ___ Monday ___ the morning."),
      steps: [
        t("День недели → on Monday.", "Апта күні → on Monday.", "Day of the week → on Monday."),
        t("Часть дня → in the morning (устойчивое сочетание).", "Тәулік бөлігі → in the morning (тұрақты тіркес).", "Part of the day → in the morning (fixed phrase)."),
        n("Answer: We met on Monday in the morning."),
      ],
    },
  },
  {
    topic: "en-vocab",
    intro: t(
      "Одно английское слово даёт целое семейство: decide → decision → decisive. На тестах чаще спрашивают не перевод, а нужную форму.",
      "Бір ағылшын сөзі тұтас ұя береді: decide → decision → decisive. Тестте көбіне аударманы емес, керек форманы сұрайды.",
      "One English root gives a whole family: decide → decision → decisive. Tests usually ask for the right form, not the translation."
    ),
    sections: [
      {
        heading: t("Суффиксы существительных", "Зат есім жұрнақтары", "Noun suffixes"),
        body: t(
          "-tion, -ment, -ness, -ity превращают глагол или прилагательное в существительное: inform → information, develop → development, happy → happiness.",
          "-tion, -ment, -ness, -ity етістік не сын есімді зат есімге айналдырады: inform → information, develop → development, happy → happiness.",
          "-tion, -ment, -ness, -ity turn a verb or adjective into a noun: inform → information, develop → development, happy → happiness."
        ),
      },
      {
        heading: t("Отрицательные приставки", "Болымсыздық префикстері", "Negative prefixes"),
        body: t(
          "un-, in-, im-, dis- дают противоположное значение: happy → unhappy, possible → impossible, agree → disagree. Перед p чаще im-, перед r — ir-.",
          "un-, in-, im-, dis- қарама-қарсы мағына береді: happy → unhappy, possible → impossible, agree → disagree. p алдында көбіне im-, r алдында ir-.",
          "un-, in-, im-, dis- flip the meaning: happy → unhappy, possible → impossible, agree → disagree. Before p it's usually im-, before r it's ir-."
        ),
      },
    ],
    example: {
      problem: n("Form a word: The ___ of the project took two years. (DEVELOP)"),
      steps: [
        t("После артикля the нужно существительное.", "the артиклінен кейін зат есім керек.", "After the article the, a noun is needed."),
        t("Глагол develop + суффикс -ment.", "develop етістігі + -ment жұрнағы.", "Verb develop + the suffix -ment."),
        n("Answer: The development of the project took two years."),
      ],
    },
  },
];

export const englishQuestions: Question[] = [
  {
    id: "ent1", subject: "english", topic: "en-tenses", difficulty: 780,
    stem: n("She ___ to school every day."),
    options: [n("goes"), n("go"), n("is going"), n("went")], correct: 0,
    explain: t("every day — регулярное действие, Present Simple. С she добавляем -s: goes.", "every day — тұрақты әрекет, Present Simple. she-мен -s қосылады: goes.", "every day signals Present Simple; with she the verb takes -s: goes."),
    hint: t("Обрати внимание на «every day» — как часто это происходит?", "«every day» тіркесіне назар аудар — бұл қаншалықты жиі болады?", "Look at \"every day\" — how often does this happen?"),
  },
  {
    id: "ent2", subject: "english", topic: "en-tenses", difficulty: 880,
    stem: n("Look! The baby ___ ."),
    options: [n("is crying"), n("cries"), n("cried"), n("has cried")], correct: 0,
    explain: t("«Look!» указывает на процесс прямо сейчас → Present Continuous.", "«Look!» дәл қазіргі үдерісті көрсетеді → Present Continuous.", "\"Look!\" points at something happening right now → Present Continuous."),
    hint: t("Действие происходит в момент речи.", "Әрекет сөйлеу сәтінде болып жатыр.", "The action is happening as we speak."),
  },
  {
    id: "ent3", subject: "english", topic: "en-tenses", difficulty: 960,
    stem: n("I ___ this film last year."),
    options: [n("watched"), n("have watched"), n("watch"), n("was watching")], correct: 0,
    explain: t("last year — законченное время в прошлом → Past Simple.", "last year — өткен шақтағы аяқталған уақыт → Past Simple.", "last year is a finished past time → Past Simple."),
    hint: t("Есть точное указание на прошлое.", "Өткен шаққа нақты нұсқау бар.", "There's an explicit past time marker."),
  },
  {
    id: "ent4", subject: "english", topic: "en-tenses", difficulty: 1080,
    stem: n("They ___ already ___ the report."),
    options: [n("have / finished"), n("has / finished"), n("are / finishing"), n("did / finish")], correct: 0,
    explain: t("already — маркер Present Perfect. Подлежащее they → have + V3 (finished).", "already — Present Perfect маркері. Бастауыш they → have + V3 (finished).", "already marks Present Perfect. Subject they → have + V3 (finished)."),
    hint: t("Слово already почти всегда тянет за собой Present Perfect.", "already сөзі әрдайым дерлік Present Perfect-ті ертіп келеді.", "The word already almost always brings Present Perfect."),
  },
  {
    id: "ent5", subject: "english", topic: "en-tenses", difficulty: 1180,
    stem: n("While I ___ dinner, the phone rang."),
    options: [n("was cooking"), n("cooked"), n("have cooked"), n("cook")], correct: 0,
    explain: t("Длительное действие в прошлом, прерванное другим → Past Continuous.", "Өткендегі ұзақ әрекет басқасымен үзілген → Past Continuous.", "A longer past action interrupted by a shorter one → Past Continuous."),
    hint: t("Одно действие шло, второе его прервало.", "Бір әрекет жүріп жатты, екіншісі оны үзді.", "One action was in progress, another cut in."),
  },
  {
    id: "ent6", subject: "english", topic: "en-tenses", difficulty: 1300,
    stem: n("Look at those clouds! It ___ rain."),
    options: [n("is going to"), n("will"), n("goes to"), n("would")], correct: 0,
    explain: t("Есть видимое доказательство (тучи) → be going to, а не will.", "Көзге көрінетін дәлел бар (бұлттар) → will емес, be going to.", "There's visible evidence (the clouds) → be going to, not will."),
    hint: t("Мы это предсказываем не наугад, а по тому, что видим.", "Бұл болжам кездейсоқ емес, көріп тұрғанымызға негізделген.", "The prediction is based on what we can see."),
  },
  {
    id: "ena1", subject: "english", topic: "en-articles", difficulty: 760,
    stem: n("I bought ___ apple and ___ banana."),
    options: [n("an / a"), n("a / an"), n("the / a"), n("a / the")], correct: 0,
    explain: t("Перед гласным звуком — an (an apple), перед согласным — a (a banana).", "Дауысты дыбыс алдында — an (an apple), дауыссыз алдында — a (a banana).", "Before a vowel sound use an (an apple); before a consonant use a (a banana)."),
    hint: t("Смотри на первый звук слова, а не букву.", "Сөздің әрпіне емес, алғашқы дыбысына қара.", "Look at the first sound, not the letter."),
  },
  {
    id: "ena2", subject: "english", topic: "en-articles", difficulty: 880,
    stem: n("___ sun rises in the east."),
    options: [n("The"), n("A"), n("An"), n("—")], correct: 0,
    explain: t("Солнце единственное в своём роде → всегда the sun.", "Күн — жалғыз, бірегей → әрқашан the sun.", "The sun is unique, so it always takes the."),
    hint: t("Сколько солнц у нас на небе?", "Аспанда неше күн бар?", "How many suns do we have?"),
  },
  {
    id: "ena3", subject: "english", topic: "en-articles", difficulty: 940,
    stem: n("The lesson starts ___ 9 o'clock."),
    options: [n("at"), n("in"), n("on"), n("to")], correct: 0,
    explain: t("Точное время часов — предлог at: at 9 o'clock.", "Нақты сағат — at көмекші сөзі: at 9 o'clock.", "Exact clock time takes at: at 9 o'clock."),
    hint: t("at — точка на часах, in — большой период, on — день.", "at — сағаттағы нүкте, in — үлкен кезең, on — күн.", "at is a point on the clock, in is a long period, on is a day."),
  },
  {
    id: "ena4", subject: "english", topic: "en-articles", difficulty: 1020,
    stem: n("My birthday is ___ December."),
    options: [n("in"), n("on"), n("at"), n("of")], correct: 0,
    explain: t("Месяцы используются с in: in December, in May.", "Айлар in-мен қолданылады: in December, in May.", "Months take in: in December, in May."),
    hint: t("Месяц — это длинный период, а не точка.", "Ай — нүкте емес, ұзақ кезең.", "A month is a long period, not a point."),
  },
  {
    id: "ena5", subject: "english", topic: "en-articles", difficulty: 1120,
    stem: n("She is good ___ mathematics."),
    options: [n("at"), n("in"), n("on"), n("with")], correct: 0,
    explain: t("Устойчивое сочетание: to be good at something.", "Тұрақты тіркес: to be good at something.", "Fixed collocation: to be good at something."),
    hint: t("Это устойчивое выражение — его просто запоминают.", "Бұл тұрақты тіркес — жаттап алады.", "This is a collocation you simply memorise."),
  },
  {
    id: "ena6", subject: "english", topic: "en-articles", difficulty: 1240,
    stem: n("I have never been to ___ United States."),
    options: [n("the"), n("a"), n("an"), n("—")], correct: 0,
    explain: t("Страны с множественным числом или словами States, Kingdom идут с the: the United States.", "Көпше түрдегі немесе States, Kingdom сөздері бар елдер the-мен: the United States.", "Countries that are plural or contain States/Kingdom take the: the United States."),
    hint: t("Сравни: France без артикля, но the Netherlands с ним.", "Салыстыр: France артикльсіз, ал the Netherlands артикльмен.", "Compare: France takes none, but the Netherlands does."),
  },
  {
    id: "env1", subject: "english", topic: "en-vocab", difficulty: 820,
    stem: n("Choose the noun: to inform → ___"),
    options: [n("information"), n("informing"), n("informative"), n("informed")], correct: 0,
    explain: t("Суффикс -tion делает существительное: inform → information.", "-tion жұрнағы зат есім жасайды: inform → information.", "The suffix -tion makes a noun: inform → information."),
    hint: t("Ищи типичный суффикс существительного.", "Зат есімнің тән жұрнағын тап.", "Look for the typical noun suffix."),
  },
  {
    id: "env2", subject: "english", topic: "en-vocab", difficulty: 900,
    stem: n("The opposite of 'possible' is ___"),
    options: [n("impossible"), n("unpossible"), n("dispossible"), n("nonpossible")], correct: 0,
    explain: t("Перед p ставится приставка im-: impossible.", "p алдында im- префиксі қойылады: impossible.", "Before p the prefix is im-: impossible."),
    hint: t("Приставка меняется в зависимости от первой буквы корня.", "Префикс түбірдің бірінші әрпіне қарай өзгереді.", "The prefix changes with the root's first letter."),
  },
  {
    id: "env3", subject: "english", topic: "en-vocab", difficulty: 980,
    stem: n("She made a ___ to study abroad. (DECIDE)"),
    options: [n("decision"), n("decisive"), n("deciding"), n("decided")], correct: 0,
    explain: t("После артикля a нужно существительное: decision.", "a артиклінен кейін зат есім керек: decision.", "After the article a we need a noun: decision."),
    hint: t("Какая часть речи стоит после «a»?", "«a» артиклінен кейін қандай сөз табы тұрады?", "What part of speech follows \"a\"?"),
  },
  {
    id: "env4", subject: "english", topic: "en-vocab", difficulty: 1060,
    stem: n("Choose the correct collocation: ___ a decision"),
    options: [n("make"), n("do"), n("take up"), n("give")], correct: 0,
    explain: t("По-английски решение «делают» глаголом make: make a decision.", "Ағылшынша шешімді make етістігімен «жасайды»: make a decision.", "In English you make a decision — not do one."),
    hint: t("Do и make делят между собой разные фразы: do homework, make a choice.", "Do мен make әртүрлі тіркестерге бөлінеді: do homework, make a choice.", "Do and make split the phrases between them: do homework, make a choice."),
  },
  {
    id: "env5", subject: "english", topic: "en-vocab", difficulty: 1160,
    stem: n("The weather was ___ , so we stayed at home. (RAIN)"),
    options: [n("rainy"), n("rain"), n("rained"), n("raining")], correct: 0,
    explain: t("После was нужно прилагательное: суффикс -y даёт rainy.", "was-тан кейін сын есім керек: -y жұрнағы rainy береді.", "After was we need an adjective; the -y suffix gives rainy."),
    hint: t("Какое слово описывает погоду как признак?", "Ауа райын белгі ретінде сипаттайтын сөз қайсы?", "Which word describes the weather as a quality?"),
  },
  {
    id: "env6", subject: "english", topic: "en-vocab", difficulty: 1280,
    stem: n("His explanation was completely ___ . (LOGIC)"),
    options: [n("illogical"), n("unlogical"), n("dislogical"), n("nonlogic")], correct: 0,
    explain: t("Перед l приставка становится il-: logic → logical → illogical.", "l алдында префикс il- болады: logic → logical → illogical.", "Before l the prefix becomes il-: logic → logical → illogical."),
    hint: t("Сначала сделай прилагательное, потом добавь отрицание.", "Алдымен сын есім жаса, сосын болымсыздық қос.", "Make the adjective first, then negate it."),
  },
];
