import type { ExamItem, ListeningScript } from "../types";

/**
 * IELTS Listening.
 *
 * There are no audio files. The app reads each script with the browser's speech
 * synthesis, giving a different voice to each speaker. That is a real constraint
 * honestly handled: synthesised speech is cleaner than an exam recording, so it
 * trains the question types, the note-taking and the pacing rather than the
 * accents. It also means the whole section works offline and is readable by anyone
 * who needs the transcript instead — the same mechanism serves as the text-to-speech
 * accessibility feature.
 *
 * Spelling matters in Listening: answers are marked wrong for a misspelt word on the
 * real test, so the accepted forms below are deliberately narrow.
 */

export const LISTENING_SCRIPTS: ListeningScript[] = [
  {
    id: "l1-course",
    title: "Section 1 — Enrolling on a study skills course",
    setting: "A conversation between a student and a course administrator at a language centre.",
    turns: [
      { speaker: "Administrator", voice: "a", text: "Good morning, Central Language Centre. How can I help you?" },
      { speaker: "Student", voice: "b", text: "Hello. I'd like to enrol on the academic study skills course that starts next month." },
      { speaker: "Administrator", voice: "a", text: "Certainly. I'll take your details. Can I have your full name, please?" },
      { speaker: "Student", voice: "b", text: "It's Aigerim Nurlanovna Seitova. The surname is spelled S-E-I-T-O-V-A." },
      { speaker: "Administrator", voice: "a", text: "Thank you. And a contact number?" },
      { speaker: "Student", voice: "b", text: "It's seven seven zero, four one five, double two eight nine." },
      { speaker: "Administrator", voice: "a", text: "Seven seven zero, four one five, two two eight nine. And what's your current level of English?" },
      { speaker: "Student", voice: "b", text: "I took the placement test last week and I was put into upper intermediate." },
      { speaker: "Administrator", voice: "a", text: "Good, that's the right level for this course. Now, we run two groups. The Tuesday group meets in the evening, from six until eight thirty. The Saturday group runs in the morning, nine until half past eleven." },
      { speaker: "Student", voice: "b", text: "I work on Saturdays, so the Tuesday evening one would suit me better." },
      { speaker: "Administrator", voice: "a", text: "That's fine, there are still four places left in that group. The course runs for ten weeks." },
      { speaker: "Student", voice: "b", text: "And what does it cost?" },
      { speaker: "Administrator", voice: "a", text: "The full fee is sixty-eight thousand tenge. However, if you're currently enrolled at a university you get a twenty percent reduction, which brings it down to fifty-four thousand four hundred." },
      { speaker: "Student", voice: "b", text: "I am a student, yes. Do I need to bring proof?" },
      { speaker: "Administrator", voice: "a", text: "Yes, please bring your student card to the first session. One other thing — you'll need to buy the course book yourself. It's called Academic Writing in Practice, and the bookshop on the ground floor stocks it." },
      { speaker: "Student", voice: "b", text: "Right. Is there anything else I should bring?" },
      { speaker: "Administrator", voice: "a", text: "A laptop, if you have one. About half the sessions involve drafting, and it's much easier than working on paper. If you don't have one, the centre has a few you can borrow, but you'd need to reserve one in advance." },
      { speaker: "Student", voice: "b", text: "I'll bring my own. When does the course actually start?" },
      { speaker: "Administrator", voice: "a", text: "The first session is on the twelfth of March. Do arrive about fifteen minutes early on the first day, because there's a short induction in room B twelve before you go to your classroom." },
      { speaker: "Student", voice: "b", text: "Room B twelve, fifteen minutes early. Thank you very much." },
    ],
  },
  {
    id: "l2-library",
    title: "Section 2 — A talk about the new city library",
    setting: "A librarian gives a short talk to visitors on their first day at a newly opened city library.",
    turns: [
      { speaker: "Librarian", voice: "c", text: "Welcome, everyone, and thank you for coming to this introduction. I'll take about five minutes to explain how the building works, and then you're free to explore." },
      { speaker: "Librarian", voice: "c", text: "The library has four floors. The ground floor, where we are now, holds the lending collection and the returns desk. Anything you want to take home is on this floor." },
      { speaker: "Librarian", voice: "c", text: "The first floor is entirely silent study. There are ninety desks, and we ask that you don't take phone calls there — not even in the corridor, because sound carries in that stairwell more than you'd expect." },
      { speaker: "Librarian", voice: "c", text: "The second floor is the opposite: it's designed for group work. You'll find eight bookable rooms up there, each seating six to eight people. You can reserve one through the website up to two weeks ahead, and bookings are limited to three hours at a time so that everyone gets a turn." },
      { speaker: "Librarian", voice: "c", text: "The third floor holds the archive and the local history collection. That material doesn't leave the building, and you'll need to request items at the desk rather than browsing the shelves yourself. Requests are usually fulfilled within about twenty minutes." },
      { speaker: "Librarian", voice: "c", text: "A word about membership. Membership is free for anyone living or working in the city. You'll need to show one document with your address on it — a utility bill or a tenancy agreement is fine. A bank statement is also accepted, but it must be less than three months old." },
      { speaker: "Librarian", voice: "c", text: "Once you're a member you can borrow up to twelve items at a time, for three weeks, and you can renew twice online provided nobody else has reserved the item. We no longer charge late fees, which surprises people, but we do suspend borrowing until the item comes back." },
      { speaker: "Librarian", voice: "c", text: "Two things that are easy to miss. First, the café on the ground floor stays open an hour later than the library itself, so if you're meeting someone at closing time, that's where to wait. Second, we run free workshops every Wednesday evening — the current series is on digital research skills, and no booking is needed, though seats do go quickly." },
      { speaker: "Librarian", voice: "c", text: "Finally, opening hours. We're open from eight in the morning until nine at night on weekdays, and ten until six at weekends. The archive floor closes an hour before the rest of the building on every day. That's everything — please do ask if anything isn't clear." },
    ],
  },
];

export const LISTENING_ITEMS: ExamItem[] = [
  /* ---------------- Section 1: form completion ---------------- */
  {
    id: "il-01",
    skill: "Form completion",
    topic: "Listening for names and numbers",
    difficulty: "easy",
    instruction: "Questions 1–10. Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.",
    stem: "ENROLMENT FORM\nSurname: _____",
    answer: { kind: "text", accept: ["Seitova"], maxWords: 1 },
    explain: {
      en: "The student spells it out: S-E-I-T-O-V-A. Spelled-out names are always an answer — write them down letter by letter as you hear them.",
      ru: "Студентка диктует по буквам: S-E-I-T-O-V-A. Продиктованное по буквам имя — всегда ответ; записывай сразу букву за буквой.",
    },
  },
  {
    id: "il-02",
    skill: "Form completion",
    topic: "Listening for names and numbers",
    difficulty: "medium",
    stem: "Contact number: 770 415 _____",
    answer: { kind: "text", accept: ["2289"], maxWords: 1 },
    explain: {
      en: "\"Double two eight nine\" means 2-2-8-9. The administrator then repeats it as \"two two eight nine\", which is your check.",
      ru: "«Double two eight nine» — это 2-2-8-9. Администратор затем повторяет «two two eight nine» — это и есть проверка.",
    },
    trap: {
      en: "\"Double\" before a digit means it appears twice. Writing 289 loses the mark.",
      ru: "«Double» перед цифрой значит, что она идёт дважды. Запись 289 теряет балл.",
    },
  },
  {
    id: "il-03",
    skill: "Form completion",
    topic: "Listening for detail",
    difficulty: "medium",
    stem: "Current English level: _____ intermediate",
    answer: { kind: "text", accept: ["upper"], maxWords: 1 },
    explain: {
      en: "\"I was put into upper intermediate.\" The word before \"intermediate\" is the gap.",
      ru: "«I was put into upper intermediate». В пропуске — слово перед «intermediate».",
    },
  },
  {
    id: "il-04",
    skill: "Form completion",
    topic: "Listening for detail",
    difficulty: "medium",
    stem: "Group chosen: _____ evenings",
    answer: { kind: "text", accept: ["Tuesday"], maxWords: 1 },
    explain: {
      en: "The student works on Saturdays, so she chooses the Tuesday evening group. The reason is given before the answer — a very common pattern.",
      ru: "Студентка работает по субботам, поэтому выбирает группу вторника. Причина звучит раньше ответа — очень частая схема.",
    },
    trap: {
      en: "Saturday is mentioned twice and is the wrong answer both times. The speaker rules it out rather than choosing it.",
      ru: "Суббота упомянута дважды и оба раза — неверный ответ. Говорящая её отвергает, а не выбирает.",
    },
  },
  {
    id: "il-05",
    skill: "Form completion",
    topic: "Listening for numbers",
    difficulty: "medium",
    stem: "Course length: _____ weeks",
    answer: { kind: "text", accept: ["ten", "10"], maxWords: 1 },
    explain: {
      en: "\"The course runs for ten weeks.\"",
      ru: "«The course runs for ten weeks».",
    },
  },
  {
    id: "il-06",
    skill: "Form completion",
    topic: "Listening for numbers",
    difficulty: "hard",
    stem: "Fee to be paid (with student discount): _____ tenge",
    answer: { kind: "text", accept: ["54400", "54,400"], maxWords: 1 },
    explain: {
      en: "The full fee is 68,000, but the student qualifies for the 20% reduction, giving 54,400 — a figure the speaker states aloud.",
      ru: "Полная цена — 68 000, но студентке положена скидка 20%, то есть 54 400; эту цифру говорящий называет вслух.",
    },
    trap: {
      en: "68,000 is spoken first and is the distractor. Listen to the end of the sentence before writing a number down.",
      ru: "68 000 звучит первым — это отвлекающий вариант. Дослушивай предложение до конца, прежде чем записывать число.",
    },
  },
  {
    id: "il-07",
    skill: "Form completion",
    topic: "Listening for detail",
    difficulty: "medium",
    stem: "Document to bring to the first session: student _____",
    answer: { kind: "text", accept: ["card"], maxWords: 1 },
    explain: {
      en: "\"Please bring your student card to the first session.\"",
      ru: "«Please bring your student card to the first session».",
    },
  },
  {
    id: "il-08",
    skill: "Form completion",
    topic: "Listening for detail",
    difficulty: "hard",
    stem: "Course book must be bought from the _____ on the ground floor.",
    answer: { kind: "text", accept: ["bookshop", "bookstore"], maxWords: 1 },
    explain: {
      en: "\"The bookshop on the ground floor stocks it.\"",
      ru: "«The bookshop on the ground floor stocks it».",
    },
  },
  {
    id: "il-09",
    skill: "Form completion",
    topic: "Listening for dates",
    difficulty: "medium",
    stem: "First session date: _____ March",
    answer: { kind: "text", accept: ["12", "12th", "twelfth"], maxWords: 1 },
    explain: {
      en: "\"The first session is on the twelfth of March.\"",
      ru: "«The first session is on the twelfth of March».",
    },
  },
  {
    id: "il-10",
    skill: "Form completion",
    topic: "Listening for detail",
    difficulty: "hard",
    stem: "Induction takes place in room _____",
    answer: { kind: "text", accept: ["B12", "B 12"], maxWords: 1 },
    explain: {
      en: "\"There's a short induction in room B twelve.\" The student repeats it, confirming the answer.",
      ru: "«There's a short induction in room B twelve». Студентка повторяет — это подтверждение ответа.",
    },
  },

  /* ---------------- Section 2: multiple choice and matching ---------------- */
  {
    id: "il-11",
    skill: "Multiple choice",
    topic: "Listening for specific information",
    difficulty: "medium",
    instruction: "Questions 11–16. Choose the correct letter, A, B, C or D.",
    stem: "What is found on the first floor of the library?",
    options: ["The lending collection", "Silent study space", "Bookable group rooms", "The local history archive"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "\"The first floor is entirely silent study.\" The lending collection is on the ground floor, group rooms on the second, archive on the third.",
      ru: "«The first floor is entirely silent study». Абонемент — на первом этаже по-английски (ground floor), групповые комнаты — на втором, архив — на третьем.",
    },
    trap: {
      en: "All four options appear in the talk, each attached to a different floor. Track the floor, not the facility.",
      ru: "Все четыре варианта звучат в тексте, каждый привязан к своему этажу. Следи за этажом, а не за помещением.",
    },
  },
  {
    id: "il-12",
    skill: "Multiple choice",
    topic: "Listening for specific information",
    difficulty: "hard",
    stem: "How far in advance can a group room be reserved?",
    options: ["Three hours", "Two weeks", "Three weeks", "Twenty minutes"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "\"You can reserve one through the website up to two weeks ahead.\" Three hours is the maximum length of a booking, not the notice period.",
      ru: "«You can reserve one through the website up to two weeks ahead». Три часа — предельная длительность брони, а не срок заказа.",
    },
    trap: {
      en: "Both numbers sit in the same sentence. The question asks how far ahead, which is the booking window, not the session length.",
      ru: "Оба числа стоят в одном предложении. Спрашивают, за сколько заранее — это окно брони, а не длительность сессии.",
    },
  },
  {
    id: "il-13",
    skill: "Multiple choice",
    topic: "Listening for specific information",
    difficulty: "medium",
    stem: "What must a bank statement satisfy if it is used to prove an address?",
    options: [
      "It must show a city address only",
      "It must be under three months old",
      "It must be accompanied by a utility bill",
      "It must be stamped by the bank",
    ],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "\"A bank statement is also accepted, but it must be less than three months old.\"",
      ru: "«A bank statement is also accepted, but it must be less than three months old».",
    },
  },
  {
    id: "il-14",
    skill: "Multiple choice",
    topic: "Listening for specific information",
    difficulty: "hard",
    stem: "What happens if a borrowed item is returned late?",
    options: [
      "A fee is charged per day",
      "The membership is cancelled",
      "Borrowing is paused until the item is returned",
      "The item cannot be borrowed again",
    ],
    answer: { kind: "choice", correct: 2 },
    explain: {
      en: "\"We no longer charge late fees... but we do suspend borrowing until the item comes back.\"",
      ru: "«We no longer charge late fees… but we do suspend borrowing until the item comes back».",
    },
    trap: {
      en: "\"Late fees\" is said aloud, which pulls you to option A — but it is said in a negative: the library no longer charges them.",
      ru: "«Late fees» звучит вслух и тянет к варианту A, но сказано это с отрицанием: библиотека их больше не берёт.",
    },
  },
  {
    id: "il-15",
    skill: "Multiple choice",
    topic: "Listening for specific information",
    difficulty: "medium",
    stem: "What is the subject of the current series of free workshops?",
    options: ["Local history", "Digital research skills", "Academic writing", "Using the archive"],
    answer: { kind: "choice", correct: 1 },
    explain: {
      en: "\"The current series is on digital research skills, and no booking is needed.\"",
      ru: "«The current series is on digital research skills, and no booking is needed».",
    },
  },
  {
    id: "il-16",
    skill: "Multiple choice",
    topic: "Listening for specific information",
    difficulty: "hard",
    stem: "What does the speaker say about the archive floor's opening hours?",
    options: [
      "It closes one hour earlier than the rest of the building",
      "It is closed at weekends",
      "It opens one hour later on weekdays",
      "It follows the same hours as the café",
    ],
    answer: { kind: "choice", correct: 0 },
    explain: {
      en: "\"The archive floor closes an hour before the rest of the building on every day.\"",
      ru: "«The archive floor closes an hour before the rest of the building on every day».",
    },
    trap: {
      en: "The café also has a different closing time — an hour later — which is the mirror image of this. Keep the two apart.",
      ru: "У кафе тоже другое время закрытия — на час позже; это зеркальный факт. Не путай их.",
    },
  },
  {
    id: "il-17",
    skill: "Note completion",
    topic: "Listening for numbers",
    difficulty: "medium",
    instruction: "Questions 17–20. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
    stem: "Silent study floor has _____ desks.",
    answer: { kind: "text", accept: ["90", "ninety"], maxWords: 1 },
    explain: {
      en: "\"There are ninety desks.\"",
      ru: "«There are ninety desks».",
    },
  },
  {
    id: "il-18",
    skill: "Note completion",
    topic: "Listening for numbers",
    difficulty: "medium",
    stem: "Members may borrow up to _____ items at once.",
    answer: { kind: "text", accept: ["12", "twelve"], maxWords: 1 },
    explain: {
      en: "\"You can borrow up to twelve items at a time, for three weeks.\"",
      ru: "«You can borrow up to twelve items at a time, for three weeks».",
    },
    trap: {
      en: "Three weeks and eight rooms are nearby numbers. Match the number to the noun the question asks about.",
      ru: "Рядом стоят «три недели» и «восемь комнат». Привязывай число к тому существительному, о котором спрашивают.",
    },
  },
  {
    id: "il-19",
    skill: "Note completion",
    topic: "Listening for detail",
    difficulty: "hard",
    stem: "Archive items are usually ready about _____ minutes after being requested.",
    answer: { kind: "text", accept: ["20", "twenty"], maxWords: 1 },
    explain: {
      en: "\"Requests are usually fulfilled within about twenty minutes.\"",
      ru: "«Requests are usually fulfilled within about twenty minutes».",
    },
  },
  {
    id: "il-20",
    skill: "Note completion",
    topic: "Listening for detail",
    difficulty: "medium",
    stem: "The _____ on the ground floor stays open later than the library.",
    answer: { kind: "text", accept: ["café", "cafe"], maxWords: 1 },
    explain: {
      en: "\"The café on the ground floor stays open an hour later than the library itself.\"",
      ru: "«The café on the ground floor stays open an hour later than the library itself».",
    },
  },
];
