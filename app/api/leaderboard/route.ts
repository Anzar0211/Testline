import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Leaderboard from "../../../models/leaderboard";

export async function POST(request: Request) {
  await dbConnect();

  const body = await request.json();
  const { name, score, category } = body;

  try {
    const newEntry = await Leaderboard.create({ name, score, category });
    return NextResponse.json(newEntry);
  } catch {
    return NextResponse.json(
      { error: "Error submitting score" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 }
    );
  }

  try {
    const leaderboard = await Leaderboard.find({ category })
      .sort({ score: -1, date: 1 })
      .limit(10)
      .lean();
    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json(
      { error: "Error fetching leaderboard" },
      { status: 500 }
    );
  }
}
