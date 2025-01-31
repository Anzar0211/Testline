export interface Answer {
  answer_a: string | null
  answer_b: string | null
  answer_c: string | null
  answer_d: string | null
  answer_e: string | null
  answer_f: string | null
}

export interface CorrectAnswers {
  answer_a_correct: "true" | "false"
  answer_b_correct: "true" | "false"
  answer_c_correct: "true" | "false"
  answer_d_correct: "true" | "false"
  answer_e_correct: "true" | "false"
  answer_f_correct: "true" | "false"
}

export interface Question {
  id: number
  question: string
  description: string | null
  answers: Answer
  correct_answers: CorrectAnswers
  multiple_correct_answers: "true" | "false"
  category: string
  difficulty: string
}

export type QuizCategory = "Linux" | "DevOps" | "Docker" | "SQL" | "CMS" | "Code"

