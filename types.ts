export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password?: string; // In a real app, never store plain text
}

export enum ExerciseType {
  GRAMMAR = 'GRAMMAR',
  READING = 'READING',
  ORAL = 'ORAL',
  TUTOR = 'TUTOR'
}

export interface Question {
  id: number;
  text: string;
  type?: 'multiple-choice' | 'short-answer';
  options?: string[];
  correctAnswer?: string; // For MC, this is the exact string. For Short Answer, this can be empty/unused on client.
}

export interface ExerciseContent {
  title: string;
  content?: string; // The reading passage or grammar context
  questions: Question[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface OralGrade {
  score: number;
  fluency: string;
  grammar: string;
  vocabulary: string;
  improvements: string[];
}