'use client'

import { useState, useCallback } from 'react'
import type { Screen, AppState, AnswerResult } from '@/types'
import Header from '@/components/Header'
import LandingPage from '@/components/LandingPage'
import LearnScreen from '@/components/LearnScreen'
import QuizScreen from '@/components/QuizScreen'
import ResultScreen from '@/components/ResultScreen'

const initialState: AppState = {
  screen: 'intro',
  currentLesson: 0,
  currentQuestion: 0,
  score: 0,
  answers: [],
  isFinished: false,
}

export default function HomePage() {
  const [state, setState] = useState<AppState>(initialState)

  const goToLearn = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'learn' as Screen, currentLesson: 0 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goToQuiz = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'quiz' as Screen, currentQuestion: 0 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goToResult = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'result' as Screen, isFinished: true }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleRestart = useCallback(() => {
    setState(initialState)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleNextLesson = useCallback(() => {
    setState(prev => ({ ...prev, currentLesson: prev.currentLesson + 1 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handlePrevLesson = useCallback(() => {
    setState(prev => ({ ...prev, currentLesson: Math.max(0, prev.currentLesson - 1) }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleAnswer = useCallback((result: AnswerResult) => {
    setState(prev => ({
      ...prev,
      score: result.isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, result],
      currentQuestion: prev.currentQuestion + 1,
    }))
  }, [])

  const isLanding = state.screen === 'intro'

  return (
    <>
      <Header
        mode={isLanding ? 'landing' : 'app'}
        screen={state.screen}
        score={state.score}
        totalQuestions={5}
        onLogoClick={handleRestart}
      />

      <main className="w-full overflow-x-hidden">
        {isLanding && (
          <LandingPage onStart={goToLearn} />
        )}

        {state.screen === 'learn' && (
          <div className="pt-16">
            <LearnScreen
              currentLesson={state.currentLesson}
              onNext={handleNextLesson}
              onPrev={handlePrevLesson}
              onFinish={goToQuiz}
            />
          </div>
        )}

        {state.screen === 'quiz' && (
          <div className="pt-16">
            <QuizScreen
              currentQuestion={state.currentQuestion}
              score={state.score}
              onAnswer={handleAnswer}
              onFinish={goToResult}
            />
          </div>
        )}

        {state.screen === 'result' && (
          <div className="pt-16">
            <ResultScreen
              score={state.score}
              answers={state.answers}
              onRestart={handleRestart}
            />
          </div>
        )}
      </main>
    </>
  )
}
