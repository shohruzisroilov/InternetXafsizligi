import { NextRequest, NextResponse } from 'next/server'
import { QUESTIONS } from '@/lib/data'

// POST /api/quiz/score — validate single answer
export async function POST(
  req: NextRequest,
): Promise<NextResponse<{ isCorrect: boolean; explanation: string }>> {
  try {
    const body = await req.json()
    const { questionId, selectedIndex } = body as {
      questionId: number
      selectedIndex: number
    }

    const question = QUESTIONS.find(q => q.id === questionId)

    if (!question) {
      return NextResponse.json(
        { isCorrect: false, explanation: 'Savol topilmadi' },
        { status: 404 },
      )
    }

    const isCorrect = question.correctIndex === selectedIndex

    return NextResponse.json(
      {
        isCorrect,
        explanation: question.explanation,
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      { isCorrect: false, explanation: 'Server xatosi' },
      { status: 500 },
    )
  }
}
