import type { SpeakingPrompt } from "../types";

/**
 * IELTS Speaking prompts, across all three parts.
 *
 * `upgrades` is the part that teaches: each pair names the plain phrase a band 5
 * candidate reaches for and the stronger one an examiner rewards. The grader checks
 * which upgrades actually appeared, so the advice and the mark are measuring the
 * same thing rather than being two unrelated opinions.
 */

export const IELTS_SPEAKING: SpeakingPrompt[] = [
  /* ---------------- Part 1 ---------------- */
  {
    id: "sp1-hometown",
    part: 1,
    topic: "Your home town",
    target: 90,
    questions: [
      "Where is your home town, and how long have you lived there?",
      "What do you like most about the place where you live?",
      "Is there anything you would like to change about it?",
      "Would you recommend your home town to a visitor? Why?",
    ],
    upgrades: [
      { plain: "It's a big city.", better: "It's a sprawling city that has grown enormously in the last decade." },
      { plain: "I like it.", better: "What appeals to me most is how walkable the centre is." },
      { plain: "There's a lot of traffic.", better: "Congestion at peak times is the one thing I would change." },
      { plain: "Yes, it's good.", better: "I'd recommend it without hesitation, particularly in early autumn." },
    ],
  },
  {
    id: "sp1-study",
    part: 1,
    topic: "Study and work",
    target: 90,
    questions: [
      "Are you studying or working at the moment?",
      "What is the most interesting part of what you do?",
      "Do you prefer studying in the morning or in the evening? Why?",
      "What would you like to be doing in five years' time?",
    ],
    upgrades: [
      { plain: "I'm a student.", better: "I'm in my final year, specialising in economics." },
      { plain: "It's interesting.", better: "What I find genuinely absorbing is the problem-solving side of it." },
      { plain: "In the morning.", better: "I'm sharpest first thing, so I front-load the difficult work." },
      { plain: "I want a good job.", better: "Ideally I'd be working in policy analysis, though I'm keeping my options open." },
    ],
  },
  {
    id: "sp1-technology",
    part: 1,
    topic: "Technology",
    target: 90,
    questions: [
      "How often do you use a computer or a smartphone?",
      "What app do you find most useful, and why?",
      "Has technology changed the way you study? How?",
      "Do you think people spend too much time online?",
    ],
    upgrades: [
      { plain: "I use it a lot.", better: "I'm on it constantly — probably more than I'd like to admit." },
      { plain: "It's useful.", better: "It's indispensable for keeping my deadlines straight." },
      { plain: "Yes, it changed.", better: "It's transformed how I revise: everything is searchable now." },
      { plain: "Yes, too much.", better: "There's a strong case that we do, though it depends enormously on what they're doing." },
    ],
  },
  {
    id: "sp1-food",
    part: 1,
    topic: "Food and cooking",
    target: 90,
    questions: [
      "Do you enjoy cooking? Why or why not?",
      "What kind of food is typical where you come from?",
      "Have your eating habits changed in recent years?",
      "Do you prefer eating at home or in restaurants?",
    ],
    upgrades: [
      { plain: "I like cooking.", better: "I find cooking genuinely relaxing after a long day." },
      { plain: "We eat meat.", better: "The cuisine is quite meat-heavy — beef and horse meat especially." },
      { plain: "Yes, it changed.", better: "They've shifted noticeably: I eat far less red meat than I used to." },
      { plain: "At home.", better: "At home, mainly because I can control what goes into the food." },
    ],
  },

  /* ---------------- Part 2 ---------------- */
  {
    id: "sp2-teacher",
    part: 2,
    topic: "A teacher who influenced you",
    target: 180,
    questions: ["Describe a teacher who has influenced you."],
    bullets: [
      "who this person was",
      "what subject they taught",
      "what was special about the way they taught",
      "and explain how they influenced you.",
    ],
    upgrades: [
      { plain: "She was a good teacher.", better: "She had a knack for making a difficult idea feel obvious." },
      { plain: "She taught maths.", better: "She taught mathematics, which until then I had written off entirely." },
      { plain: "She helped me.", better: "She changed how I approached problems — I stopped looking for the formula and started looking for the structure." },
      { plain: "I remember her.", better: "I still catch myself using a phrase of hers when I get stuck." },
    ],
  },
  {
    id: "sp2-decision",
    part: 2,
    topic: "A difficult decision",
    target: 180,
    questions: ["Describe a difficult decision you have made."],
    bullets: [
      "what the decision was",
      "when you had to make it",
      "what made it difficult",
      "and explain how you feel about it now.",
    ],
    upgrades: [
      { plain: "It was hard.", better: "It was genuinely agonising, because both options had real costs." },
      { plain: "I thought a lot.", better: "I went back and forth for weeks before committing." },
      { plain: "I chose it.", better: "In the end I went with the option that felt less safe but more interesting." },
      { plain: "Now it's good.", better: "With hindsight I'm confident it was the right call, though I couldn't have known that at the time." },
    ],
  },
  {
    id: "sp2-place",
    part: 2,
    topic: "A place you would like to visit",
    target: 180,
    questions: ["Describe a place you would like to visit but have not been to yet."],
    bullets: [
      "where it is",
      "how you first heard about it",
      "what you would do there",
      "and explain why you want to go.",
    ],
    upgrades: [
      { plain: "It's very beautiful.", better: "By all accounts the landscape there is spectacular." },
      { plain: "I saw it on the internet.", better: "I came across it in a documentary and it stuck with me." },
      { plain: "I want to see it.", better: "What draws me is the chance to see somewhere that hasn't been reshaped for tourists." },
      { plain: "I will go someday.", better: "I'm hoping to get there within the next couple of years." },
    ],
  },
  {
    id: "sp2-skill",
    part: 2,
    topic: "A skill you learned",
    target: 180,
    questions: ["Describe a practical skill you have learned."],
    bullets: [
      "what the skill is",
      "how you learned it",
      "how difficult it was to learn",
      "and explain how it has been useful to you.",
    ],
    upgrades: [
      { plain: "It was difficult.", better: "The learning curve was steeper than I expected." },
      { plain: "I learned from videos.", better: "I taught myself largely from online tutorials, with a lot of trial and error." },
      { plain: "It's useful.", better: "It's proved unexpectedly useful, in situations I'd never have predicted." },
      { plain: "I practise it.", better: "I keep it sharp by using it regularly rather than in bursts." },
    ],
  },

  /* ---------------- Part 3 ---------------- */
  {
    id: "sp3-education",
    part: 3,
    topic: "Education and society",
    target: 120,
    questions: [
      "Should schools focus more on practical skills than on academic subjects?",
      "How has the role of a teacher changed now that information is freely available online?",
      "Do you think examinations are a fair way to measure ability?",
      "What responsibility do governments have for education in remote areas?",
    ],
    upgrades: [
      { plain: "I think yes.", better: "On balance I'd say yes, though with an important qualification." },
      { plain: "Teachers are important.", better: "A teacher's value has shifted from delivering information to helping students judge it." },
      { plain: "Exams are not fair.", better: "Examinations measure a narrow slice of ability rather reliably, which isn't the same as being fair." },
      { plain: "Government should help.", better: "There's a strong case that the state has an obligation to equalise access, not merely to provide it." },
    ],
  },
  {
    id: "sp3-technology",
    part: 3,
    topic: "Technology and change",
    target: 120,
    questions: [
      "Do you think artificial intelligence will change the kinds of jobs people do?",
      "Are there any skills that machines will never replace?",
      "How should schools prepare students for a changing job market?",
      "Do older and younger generations adapt to new technology differently?",
    ],
    upgrades: [
      { plain: "It will change jobs.", better: "It's likely to reshape the composition of work rather than simply eliminate it." },
      { plain: "Machines can't do everything.", better: "Judgement under uncertainty seems difficult to automate, at least for now." },
      { plain: "Schools should teach computers.", better: "Schools would do better to teach adaptability than any specific tool." },
      { plain: "Old people find it hard.", better: "Older generations tend to adopt selectively rather than reluctantly, which is a different thing." },
    ],
  },
  {
    id: "sp3-environment",
    part: 3,
    topic: "The environment",
    target: 120,
    questions: [
      "Whose responsibility is it to protect the environment — individuals or governments?",
      "Do you think people are willing to change their habits for environmental reasons?",
      "How effective are environmental campaigns in your country?",
      "What environmental problem do you consider most urgent?",
    ],
    upgrades: [
      { plain: "Both are responsible.", better: "Responsibility is shared, but the leverage is unevenly distributed." },
      { plain: "People don't want to change.", better: "People are willing in principle, but far less so when the cost is immediate." },
      { plain: "Campaigns are not effective.", better: "Campaigns raise awareness effectively but rarely shift behaviour on their own." },
      { plain: "Pollution is the problem.", better: "Water scarcity strikes me as the most pressing, given how it compounds every other problem." },
    ],
  },
];

export const speakingByPart = (part: 1 | 2 | 3) => IELTS_SPEAKING.filter((p) => p.part === part);
export const speakingById = (id: string) => IELTS_SPEAKING.find((p) => p.id === id);
