import mongoose from "mongoose"

export interface ILeaderboardEntry {
  name: string
  score: number
  category: string
  timeTaken: number
  date: Date
}

const LeaderboardSchema = new mongoose.Schema<ILeaderboardEntry>({
  name: { type: String, required: true },
  score: { type: Number, required: true },
  category: { type: String, required: true },
  timeTaken: { type: Number, required: true },
  date: { type: Date, default: Date.now },
})

export default mongoose.models.Leaderboard || mongoose.model<ILeaderboardEntry>("Leaderboard", LeaderboardSchema)

