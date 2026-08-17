import type { Lesson, Question, Topic } from "../types";
import { n, t } from "./util";

export const ieltsTopics: Topic[] = [
  {
    id: "ie-reading",
    subject: "ielts",
    title: t("IELTS Reading", "IELTS Reading", "IELTS Reading"),
    blurb: t(
      "Skimming, scanning и типы вопросов True / False / Not Given — где теряют больше всего баллов.",
      "Skimming, scanning және True / False / Not Given сұрақ түрлері — балл ең көп жоғалатын жер.",
      "Skimming, scanning and True / False / Not Given — where most band points leak away."
    ),
    weight: 0.35,
  },
  {
    id: "ie-writing",
    subject: "ielts",
    title: t("IELTS Writing", "IELTS Writing", "IELTS Writing"),
    blurb: t(
      "Структура Task 1 и Task 2, объём, связки и типичные ошибки, снижающие band.",
      "Task 1 мен Task 2 құрылымы, көлемі, байланыстырушы сөздер және band төмендететін қателер.",
      "Task 1 and Task 2 structure, word counts, linkers and the mistakes that cost you a band."
    ),
    weight: 0.35,
  },
  {
    id: "ie-vocab",
    subject: "ielts",
    title: t("Академическая лексика", "Академиялық лексика", "Academic vocabulary"),
    blurb: t(
      "Формальные синонимы, парафраз и коллокации: экзаменатор оценивает именно диапазон лексики.",
      "Формалды синонимдер, парафраз және коллокациялар: емтихан алушы дәл лексика ауқымын бағалайды.",
      "Formal synonyms, paraphrase and collocations — the examiner is grading your lexical range."
    ),
    weight: 0.3,
  },
];

export const ieltsLessons: Lesson[] = [
  {
    topic: "ie-reading",
    intro: t(
      "В Reading нет времени читать текст целиком. Стратегия одна: сначала вопросы, потом поиск конкретного места в тексте, где спрятан ответ.",
      "Reading бөлімінде мәтінді толық оқуға уақыт жоқ. Стратегия біреу: алдымен сұрақтар, сосын жауап жасырынған нақты орынды іздеу.",
      "There is no time to read the whole passage. The strategy is fixed: questions first, then hunt for the exact place that holds the answer."
    ),
    sections: [
      {
        heading: t("True / False / Not Given", "True / False / Not Given", "True / False / Not Given"),
        body: t(
          "True — утверждение подтверждается текстом. False — текст прямо противоречит. Not Given — в тексте об этом просто не сказано. Самая частая ошибка: ставить False там, где Not Given.",
          "True — мәтін растайды. False — мәтін тікелей қайшы келеді. Not Given — мәтінде бұл туралы айтылмаған. Ең жиі қате: Not Given орнына False қою.",
          "True: the text confirms it. False: the text contradicts it. Not Given: the text simply doesn't say. The classic error is choosing False where the answer is Not Given."
        ),
      },
      {
        heading: t("Skimming и scanning", "Skimming және scanning", "Skimming and scanning"),
        body: t(
          "Skimming — быстрый просмотр ради общей идеи, читаем первое предложение каждого абзаца. Scanning — поиск конкретного слова: даты, имени, числа.",
          "Skimming — жалпы идея үшін жылдам шолу, әр абзацтың бірінші сөйлемін оқимыз. Scanning — нақты сөзді іздеу: дата, есім, сан.",
          "Skimming: read the first sentence of each paragraph for the gist. Scanning: hunt for a specific word — a date, a name, a number."
        ),
      },
    ],
    example: {
      problem: n("Text: \"The museum opened in 1887 and was funded entirely by private donors.\" Statement: \"The government paid for the museum.\""),
      steps: [
        t("Ищем в тексте про финансирование: «funded entirely by private donors».", "Мәтіннен қаржыландыру туралы іздейміз: «funded entirely by private donors».", "Find the funding claim: \"funded entirely by private donors\"."),
        t("Текст прямо противоречит утверждению — значит не Not Given.", "Мәтін тұжырымға тікелей қайшы — демек Not Given емес.", "The text directly contradicts the statement, so it isn't Not Given."),
        n("Answer: False"),
      ],
    },
  },
  {
    topic: "ie-writing",
    intro: t(
      "Band за Writing складывается из четырёх критериев, и три из них — не про идеи, а про структуру, связность и язык. Поэтому шаблон структуры даёт больше баллов, чем оригинальность мысли.",
      "Writing бойынша band төрт критерийден құралады, оның үшеуі идея емес, құрылым, байланыс және тіл туралы. Сондықтан құрылым шаблоны ой түпнұсқалығынан көбірек балл береді.",
      "Your Writing band comes from four criteria, and three of them are about structure, cohesion and language rather than ideas. A reliable template beats originality."
    ),
    sections: [
      {
        heading: t("Task 1 и Task 2", "Task 1 және Task 2", "Task 1 and Task 2"),
        body: t(
          "Task 1 (Academic) — описание графика или таблицы, минимум 150 слов, без личного мнения. Task 2 — эссе с аргументацией, минимум 250 слов, стоит вдвое дороже.",
          "Task 1 (Academic) — график не кестені сипаттау, кемінде 150 сөз, жеке пікірсіз. Task 2 — дәлелді эссе, кемінде 250 сөз, екі есе қымбат.",
          "Task 1 (Academic) describes a chart or table in at least 150 words with no personal opinion. Task 2 is an argued essay of at least 250 words and counts double."
        ),
        formula: "Task 1: 150+ words · Task 2: 250+ words (×2 weight)",
      },
      {
        heading: t("Структура эссе", "Эссе құрылымы", "Essay structure"),
        body: t(
          "Введение с перефразированным вопросом, два основных абзаца по одной идее в каждом, вывод. Каждый абзац: тезис, объяснение, пример.",
          "Кіріспе (сұрақты өз сөзіңмен), әрқайсысы бір идеядан екі негізгі абзац, қорытынды. Әр абзац: тезис, түсіндірме, мысал.",
          "Introduction paraphrasing the prompt, two body paragraphs with one idea each, conclusion. Every paragraph: claim, explanation, example."
        ),
      },
    ],
    example: {
      problem: n("Task 1 opening: how to start describing a line graph?"),
      steps: [
        t("Перефразируй заголовок графика, не копируй его.", "График тақырыбын көшірме, өз сөзіңмен жаз.", "Paraphrase the chart title; never copy it."),
        t("Добавь overview: главная тенденция без конкретных цифр.", "Overview қос: нақты сандарсыз басты үрдіс.", "Add an overview: the main trend without specific figures."),
        n("Example: \"The graph illustrates changes in car ownership between 1990 and 2020. Overall, ownership rose steadily throughout the period.\""),
      ],
    },
  },
  {
    topic: "ie-vocab",
    intro: t(
      "Экзаменатор специально ищет разнообразие лексики. Повторять слово important пять раз — прямой путь к band 6. Один точный синоним стоит дороже длинного предложения.",
      "Емтихан алушы лексика әртүрлілігін арнайы іздейді. important сөзін бес рет қайталау — band 6-ға тура жол. Бір дәл синоним ұзын сөйлемнен қымбат.",
      "Examiners actively look for lexical range. Repeating \"important\" five times is a direct route to band 6. One precise synonym is worth more than a long sentence."
    ),
    sections: [
      {
        heading: t("Формальные синонимы", "Формалды синонимдер", "Formal synonyms"),
        body: t(
          "big → significant, substantial. good → beneficial, favourable. bad → detrimental, adverse. a lot of → a considerable number of.",
          "big → significant, substantial. good → beneficial, favourable. bad → detrimental, adverse. a lot of → a considerable number of.",
          "big → significant, substantial. good → beneficial, favourable. bad → detrimental, adverse. a lot of → a considerable number of."
        ),
      },
      {
        heading: t("Парафраз", "Парафраз", "Paraphrase"),
        body: t(
          "Парафраз — это не замена одного слова синонимом, а перестройка предложения: смена части речи, залога, порядка слов.",
          "Парафраз — бір сөзді синониммен ауыстыру емес, сөйлемді қайта құру: сөз табын, етісті, сөз тәртібін өзгерту.",
          "Paraphrase isn't swapping one word for a synonym — it's rebuilding the sentence: change the part of speech, the voice, the order."
        ),
      },
    ],
    example: {
      problem: n("Paraphrase: \"Many people think cars cause pollution.\""),
      steps: [
        t("Замени many people на более формальное выражение.", "many people-ді формалдырақ тіркеспен ауыстыр.", "Replace many people with something more formal."),
        t("Смени think на believe / argue и добавь точности.", "think-ті believe / argue-ге ауыстырып, нақтылық қос.", "Swap think for believe / argue and add precision."),
        n("Result: \"It is widely believed that vehicles contribute significantly to air pollution.\""),
      ],
    },
  },
];

export const ieltsQuestions: Question[] = [
  {
    id: "ier1", subject: "ielts", topic: "ie-reading", difficulty: 820,
    stem: n("Text: \"The library is open on weekdays only.\" Statement: \"The library opens on Sundays.\""),
    options: [n("False"), n("True"), n("Not Given"), n("Partly true")], correct: 0,
    explain: t("Текст говорит «только в будни», значит воскресенье исключено — прямое противоречие, False.", "Мәтін «тек жұмыс күндері» дейді, демек жексенбі жоққа шығарылады — тікелей қайшылық, False.", "The text says weekdays only, which excludes Sunday — a direct contradiction, so False."),
    hint: t("Слово «only» делает утверждение исключающим.", "«only» сөзі тұжырымды шектеуші етеді.", "The word \"only\" makes the claim exclusive."),
  },
  {
    id: "ier2", subject: "ielts", topic: "ie-reading", difficulty: 960,
    stem: n("Text: \"The building was designed by a French architect.\" Statement: \"The architect was famous.\""),
    options: [n("Not Given"), n("True"), n("False"), n("Probably true")], correct: 0,
    explain: t("О известности архитектора в тексте ничего не сказано — это Not Given, а не False.", "Сәулетшінің танымалдығы туралы мәтінде ештеңе жоқ — бұл False емес, Not Given.", "The text says nothing about fame — that's Not Given, not False."),
    hint: t("Отсутствие информации не равно опровержению.", "Ақпараттың болмауы теріске шығару емес.", "Missing information is not the same as contradiction."),
  },
  {
    id: "ier3", subject: "ielts", topic: "ie-reading", difficulty: 1080,
    stem: n("Which strategy suits finding a specific date in a passage?"),
    options: [n("Scanning"), n("Skimming"), n("Close reading"), n("Predicting")], correct: 0,
    explain: t("Scanning — быстрый поиск конкретной информации: даты, имени, числа.", "Scanning — нақты ақпаратты жылдам іздеу: дата, есім, сан.", "Scanning is the fast hunt for a specific item: a date, a name, a number."),
    hint: t("Одно из двух: общая идея или конкретное слово.", "Екінің бірі: жалпы идея немесе нақты сөз.", "It's either the gist or a specific word."),
  },
  {
    id: "ier4", subject: "ielts", topic: "ie-reading", difficulty: 1220,
    stem: n("In matching headings tasks, which part of a paragraph is most useful?"),
    options: [n("The topic sentence"), n("The last example"), n("Any statistic"), n("The longest sentence")], correct: 0,
    explain: t("Заголовок отражает главную идею абзаца, которая обычно в первом предложении.", "Тақырып абзацтың басты идеясын білдіреді, ол әдетте бірінші сөйлемде.", "A heading reflects the paragraph's main idea, usually carried by the topic sentence."),
    hint: t("Заголовок — про главную мысль, а не про детали.", "Тақырып — басты ой туралы, детальдар туралы емес.", "A heading is about the main point, not the details."),
  },
  {
    id: "ier5", subject: "ielts", topic: "ie-reading", difficulty: 1340,
    stem: n("Text: \"Sales rose sharply until 2010, after which they levelled off.\" Statement: \"Sales fell after 2010.\""),
    options: [n("False"), n("True"), n("Not Given"), n("Cannot decide")], correct: 0,
    explain: t("«Levelled off» значит стабилизировались, а не упали — текст противоречит утверждению.", "«Levelled off» тұрақтады дегенді білдіреді, құлдырады емес — мәтін тұжырымға қайшы.", "\"Levelled off\" means stabilised, not fell — the text contradicts the statement."),
    hint: t("Обрати внимание на точное значение levelled off.", "levelled off тіркесінің нақты мағынасына назар аудар.", "Check the exact meaning of levelled off."),
  },
  {
    id: "iew1", subject: "ielts", topic: "ie-writing", difficulty: 840,
    stem: n("What is the minimum word count for IELTS Writing Task 2?"),
    options: [n("250"), n("150"), n("200"), n("300")], correct: 0,
    explain: t("Task 2 требует минимум 250 слов; за меньший объём снижают балл.", "Task 2 кемінде 250 сөзді талап етеді; аз болса балл төмендейді.", "Task 2 requires at least 250 words; going under costs you marks."),
    hint: t("Task 1 — 150, а Task 2 больше.", "Task 1 — 150, ал Task 2 одан көп.", "Task 1 is 150; Task 2 is more."),
  },
  {
    id: "iew2", subject: "ielts", topic: "ie-writing", difficulty: 940,
    stem: n("In Task 1 (Academic), you should NOT include:"),
    options: [n("Your personal opinion"), n("An overview"), n("Key figures"), n("A paraphrased introduction")], correct: 0,
    explain: t("Task 1 — описание данных без личного мнения. Мнение уместно только в Task 2.", "Task 1 — деректерді сипаттау, жеке пікірсіз. Пікір тек Task 2-де орынды.", "Task 1 describes data without opinion. Opinion belongs only in Task 2."),
    hint: t("Одна из этих вещей относится к эссе, а не к описанию графика.", "Осылардың бірі график сипаттауға емес, эссеге тән.", "One of these belongs to an essay, not a chart description."),
  },
  {
    id: "iew3", subject: "ielts", topic: "ie-writing", difficulty: 1060,
    stem: n("Which sentence best opens a Task 1 response about a graph?"),
    options: [
      n("The graph illustrates changes in energy use between 1990 and 2020."),
      n("I will describe this graph about energy."),
      n("The graph is very interesting and useful."),
      n("Energy is an important topic nowadays."),
    ], correct: 0,
    explain: t("Нужен нейтральный парафраз заголовка с указанием периода — без личных местоимений и оценок.", "Кезеңді көрсететін бейтарап парафраз керек — жіктеу есімдіктері мен бағасыз.", "You need a neutral paraphrase of the title with the period — no pronouns, no evaluation."),
    hint: t("Академический стиль не использует «I» и оценочные слова.", "Академиялық стильде «I» мен бағалау сөздері қолданылмайды.", "Academic style avoids \"I\" and value judgements."),
  },
  {
    id: "iew4", subject: "ielts", topic: "ie-writing", difficulty: 1180,
    stem: n("How much does Task 2 count compared with Task 1?"),
    options: [n("Twice as much"), n("The same"), n("Half as much"), n("Three times as much")], correct: 0,
    explain: t("Task 2 весит вдвое больше Task 1, поэтому на него оставляют около 40 минут.", "Task 2 Task 1-ден екі есе ауыр, сондықтан оған 40 минуттай қалдырады.", "Task 2 carries double the weight, which is why you leave it about 40 minutes."),
    hint: t("Поэтому на него и отводят больше времени.", "Сондықтан оған көбірек уақыт бөлінеді.", "That's why it gets more time."),
  },
  {
    id: "iew5", subject: "ielts", topic: "ie-writing", difficulty: 1320,
    stem: n("Which structure fits a body paragraph in Task 2?"),
    options: [
      n("Claim → explanation → example"),
      n("Example → example → example"),
      n("Question → question → answer"),
      n("Statistics only"),
    ], correct: 0,
    explain: t("Тезис, объяснение, пример — структура, которую ждёт экзаменатор по критерию Coherence.", "Тезис, түсіндірме, мысал — емтихан алушы Coherence критерийі бойынша күтетін құрылым.", "Claim, explanation, example is the shape the examiner expects under Coherence."),
    hint: t("Абзац должен содержать одну идею и её раскрытие.", "Абзацта бір идея және оның ашылуы болуы керек.", "A paragraph holds one idea and develops it."),
  },
  {
    id: "iev1", subject: "ielts", topic: "ie-vocab", difficulty: 880,
    stem: n("Choose the most formal synonym for 'a lot of people':"),
    options: [n("a considerable number of people"), n("lots of people"), n("loads of people"), n("plenty of folks")], correct: 0,
    explain: t("Академический стиль требует формальных выражений: a considerable number of.", "Академиялық стиль формалды тіркестерді талап етеді: a considerable number of.", "Academic style calls for formal phrasing: a considerable number of."),
    hint: t("Разговорные варианты снижают балл за лексику.", "Ауызекі нұсқалар лексика балын төмендетеді.", "Colloquial options cost you lexical marks."),
  },
  {
    id: "iev2", subject: "ielts", topic: "ie-vocab", difficulty: 1000,
    stem: n("Choose the correct collocation: ___ research"),
    options: [n("conduct"), n("make"), n("do up"), n("perform on")], correct: 0,
    explain: t("Устойчивое сочетание — conduct research; make research считается ошибкой.", "Тұрақты тіркес — conduct research; make research қате саналады.", "The collocation is conduct research; make research is an error."),
    hint: t("Это устойчивое академическое сочетание.", "Бұл тұрақты академиялық тіркес.", "It's a fixed academic collocation."),
  },
  {
    id: "iev3", subject: "ielts", topic: "ie-vocab", difficulty: 1120,
    stem: n("Which word means 'harmful'?"),
    options: [n("detrimental"), n("beneficial"), n("substantial"), n("feasible")], correct: 0,
    explain: t("Detrimental — формальный синоним harmful. Beneficial значит наоборот, полезный.", "Detrimental — harmful сөзінің формалды синонимі. Beneficial керісінше, пайдалы.", "Detrimental is the formal synonym of harmful. Beneficial means the opposite."),
    hint: t("Один из вариантов означает прямо противоположное.", "Нұсқалардың бірі тура қарама-қарсы мағына береді.", "One option means exactly the opposite."),
  },
  {
    id: "iev4", subject: "ielts", topic: "ie-vocab", difficulty: 1240,
    stem: n("Best paraphrase of 'Cars pollute cities':"),
    options: [
      n("Vehicles contribute to urban air pollution."),
      n("Cars make cities dirty."),
      n("Cars pollute urban cities."),
      n("Automobiles pollute cities."),
    ], correct: 0,
    explain: t("Настоящий парафраз меняет и лексику, и структуру, а не одно слово.", "Нағыз парафраз бір сөзді емес, лексика мен құрылымды да өзгертеді.", "Real paraphrase changes both vocabulary and structure, not just one word."),
    hint: t("Замена одного слова синонимом — это ещё не парафраз.", "Бір сөзді синониммен ауыстыру әлі парафраз емес.", "Swapping a single word isn't paraphrase yet."),
  },
  {
    id: "iev5", subject: "ielts", topic: "ie-vocab", difficulty: 1360,
    stem: n("Choose the academic alternative: 'The number of students went up a lot.'"),
    options: [
      n("Student numbers rose significantly."),
      n("Students went up much."),
      n("The students number increased a lot."),
      n("There were more students than before, a lot."),
    ], correct: 0,
    explain: t("Академический вариант использует точный глагол rose и наречие significantly.", "Академиялық нұсқа нақты rose етістігі мен significantly үстеуін қолданады.", "The academic version uses the precise verb rose with the adverb significantly."),
    hint: t("«A lot» почти никогда не подходит для академического письма.", "«A lot» академиялық жазуға жарамайды дерлік.", "\"A lot\" almost never fits academic writing."),
  },
];
