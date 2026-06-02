export type Gender = 'male' | 'female' | null;

export interface QuizAnswer {
  questionId: number;
  answer: number;
}

export type Screen = 'landing' | 'gender' | 'quiz' | 'loading' | 'additional-info' | 'result';
