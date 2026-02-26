export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  level: string;
  duration: string;
  fee: string;
  outcomes: string[];
  icon: string;
}

export const courses: Course[] = [
  {
    id: "culture-communication",
    title: "Culture & Professional Communication",
    shortDescription: "Master cross-cultural communication and professional English for the workplace.",
    description: "This comprehensive module focuses on developing professional English communication skills essential for today's globalized workplace. Students learn business correspondence, presentation skills, meeting etiquette, and cross-cultural communication strategies.",
    level: "All Levels",
    duration: "3 Months",
    fee: "PKR 15,000",
    outcomes: [
      "Write professional emails and business correspondence",
      "Deliver confident presentations in English",
      "Navigate cross-cultural communication challenges",
      "Master workplace vocabulary and idioms",
    ],
    icon: "🌍",
  },
  {
    id: "basic-foundation",
    title: "Basic Language Foundation (A1)",
    shortDescription: "Build a solid English foundation from scratch with essential grammar and vocabulary.",
    description: "Designed for absolute beginners, this A1-level course builds fundamental English skills from the ground up. Students learn basic grammar structures, everyday vocabulary, pronunciation basics, and simple conversational patterns.",
    level: "A1 – Beginner",
    duration: "4 Months",
    fee: "PKR 12,000",
    outcomes: [
      "Understand and use basic everyday expressions",
      "Introduce yourself and ask simple questions",
      "Read and write simple sentences",
      "Develop correct pronunciation habits",
    ],
    icon: "📘",
  },
  {
    id: "elementary-skills",
    title: "Elementary Language Skills",
    shortDescription: "Develop core reading, writing, listening, and speaking skills at the elementary level.",
    description: "This course develops all four language skills at the elementary level. Through interactive activities, students strengthen their reading comprehension, writing accuracy, listening skills, and speaking fluency.",
    level: "A2 – Elementary",
    duration: "4 Months",
    fee: "PKR 13,000",
    outcomes: [
      "Communicate in routine situations",
      "Write short paragraphs and informal letters",
      "Understand conversations on familiar topics",
      "Expand vocabulary to 1500+ words",
    ],
    icon: "📗",
  },
  {
    id: "intermediate-skills",
    title: "Intermediate Language Skills (B1)",
    shortDescription: "Achieve fluency in everyday and academic English at the B1 intermediate level.",
    description: "The B1 intermediate course takes your English to a functional fluency level. Students engage with complex texts, participate in discussions, write structured essays, and develop the skills needed for academic and professional contexts.",
    level: "B1 – Intermediate",
    duration: "5 Months",
    fee: "PKR 18,000",
    outcomes: [
      "Express opinions and argue points effectively",
      "Write structured essays and reports",
      "Understand native-speed conversations",
      "Handle most travel and work situations in English",
    ],
    icon: "📙",
  },
  {
    id: "exam-preparation",
    title: "Exam Preparation Module",
    shortDescription: "Prepare for IELTS, TOEFL, and other English proficiency exams with expert guidance.",
    description: "This intensive module prepares students for major English proficiency exams including IELTS, TOEFL, and PTE. With mock tests, strategy sessions, and targeted practice, students develop the techniques needed to achieve their target scores.",
    level: "B1+ – Advanced",
    duration: "3 Months",
    fee: "PKR 20,000",
    outcomes: [
      "Master exam-specific strategies and techniques",
      "Complete full-length practice tests under timed conditions",
      "Improve scores in all exam sections",
      "Build confidence for test day",
    ],
    icon: "🎯",
  },
];
