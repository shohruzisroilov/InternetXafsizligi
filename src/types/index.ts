// Screen navigation
export type Screen = 'intro' | 'learn' | 'quiz' | 'result'

// Lesson (O'rgatuvchi qism)
export interface Lesson {
  id: number
  title: string
  emoji: string
  bgColor: string
  content: string[]        // array of paragraphs
  funFact: string
  interactiveType: 'lock' | 'chat' | 'warning'
  videoId?: string         // optional YouTube video ID
}

// Quiz question
export interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string      // shown after answer
}

// Quiz answer result
export interface AnswerResult {
  questionId: number
  selectedIndex: number
  isCorrect: boolean
}

// App state
export interface AppState {
  screen: Screen
  currentLesson: number
  currentQuestion: number
  score: number
  answers: AnswerResult[]
  isFinished: boolean
}

// API response types
export interface QuizApiResponse {
  questions: Question[]
  total: number
}

export interface ScoreApiResponse {
  score: number
  total: number
  grade: 'excellent' | 'good' | 'tryAgain'
  message: string
}
