import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "linux"
  const limit = searchParams.get("limit") || "10"
  const difficulty = searchParams.get("difficulty") || "easy"

  try {
    const response = await fetch(
      `https://quizapi.io/api/v1/questions?category=${category}&limit=${limit}&difficulty=${difficulty}`,
      {
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_QUIZ_API_KEY!,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch quiz data")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch quiz data" }, { status: 500 })
  }
}

