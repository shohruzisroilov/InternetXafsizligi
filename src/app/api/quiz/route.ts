import { NextRequest, NextResponse } from 'next/server'
import { QUESTIONS } from '@/lib/data'
import type { QuizApiResponse, ScoreApiResponse } from '@/types'

// GET /api/quiz — return all questions
export async function GET(): Promise<NextResponse<QuizApiResponse>> {
  try {
    return NextResponse.json(
      {
        questions: QUESTIONS,
        total: QUESTIONS.length,
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json({ questions: [], total: 0 }, { status: 500 })
  }
}

// POST /api/quiz — calculate score and return grade
export async function POST(
  req: NextRequest,
): Promise<NextResponse<ScoreApiResponse>> {
  try {
    const body = await req.json()
    const { answers } = body as {
      answers: { questionId: number; selectedIndex: number }[]
    }

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        {
          score: 0,
          total: QUESTIONS.length,
          grade: 'tryAgain' as const,
          message: "Noto'g'ri so'rov formati",
        },
        { status: 400 },
      )
    }

    // Calculate score
    let score = 0
    for (const answer of answers) {
      const question = QUESTIONS.find(q => q.id === answer.questionId)
      if (question && question.correctIndex === answer.selectedIndex) {
        score++
      }
    }

    const total = QUESTIONS.length

    // Determine grade
    const grade: ScoreApiResponse['grade'] =
      score === total ? 'excellent' : score >= 3 ? 'good' : 'tryAgain'

    const messages: Record<ScoreApiResponse['grade'], string> = {
      excellent: "Zo'r! Siz internet xavfsizligi bo'yicha mutaxasssissiz!",
      good: 'Yaxshi! Yana biroz mashq qiling!',
      tryAgain: "Keling, yana o'rganamiz! Siz uddalaysiz!",
    }

    return NextResponse.json(
      {
        score,
        total,
        grade,
        message: messages[grade],
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      {
        score: 0,
        total: QUESTIONS.length,
        grade: 'tryAgain' as const,
        message: 'Server xatosi yuz berdi',
      },
      { status: 500 },
    )
  }
}
