"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { QuizCategory } from "../types/quiz";
import { motion } from "framer-motion";
import { Trophy, Award, Star, Clock } from "lucide-react";
import confetti from "canvas-confetti";
import type { ILeaderboardEntry } from "../../models/Leaderboard";

interface QuizSummaryProps {
  score: number;
  totalQuestions: number;
  category: QuizCategory;
  onRestart: () => void;
  timeTaken: number;
}

export default function QuizSummary({
  score,
  totalQuestions,
  category,
  onRestart,
  timeTaken,
}: QuizSummaryProps) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<ILeaderboardEntry[]>([]);

  const percentage = Math.round((score / totalQuestions) * 100);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(`/api/leaderboard?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }, [category]);

  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    fetchLeaderboard();
  }, [percentage, fetchLeaderboard]);

  const submitScore = async () => {
    if (name.trim() === "") return;

    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score, category, timeTaken }),
      });

      if (response.ok) {
        setSubmitted(true);
        fetchLeaderboard();
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const getScoreMessage = () => {
    if (percentage >= 90)
      return {
        message: "Outstanding!",
        icon: <Trophy className="w-12 h-12 text-yellow-500" />,
      };
    if (percentage >= 70)
      return {
        message: "Great job!",
        icon: <Award className="w-12 h-12 text-blue-500" />,
      };
    return {
      message: "Keep practicing!",
      icon: <Star className="w-12 h-12 text-purple-500" />,
    };
  };

  const { message, icon } = getScoreMessage();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl"
    >
      <Card className="border shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900" />
        <CardHeader className="relative">
          <CardTitle className="text-3xl font-bold text-center">
            {message}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {icon}
          </motion.div>
          <div className="text-center space-y-2">
            <p className="text-xl font-semibold text-muted-foreground">
              {category} Quiz
            </p>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              {score}/{totalQuestions}
            </p>
            <div className="relative pt-4">
              <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <motion.div
                  className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="absolute top-1/3 left-1/2 bottom-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
                {percentage}%
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                Time taken: {formatTime(timeTaken)}
              </p>
            </div>
          </div>

          {!submitted ? (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                onClick={submitScore}
                className="w-full bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
              >
                Submit Score
              </Button>
            </div>
          ) : (
            <p className="text-center text-green-600 font-semibold">
              Score submitted!
            </p>
          )}

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Leaderboard</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 max-h-60 overflow-y-auto">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <span>{entry.name}</span>
                  <div className="flex items-center space-x-4">
                    <span>{entry.score}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(entry.timeTaken)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="relative flex flex-col gap-4 sm:flex-row justify-center pt-6">
          <Button
            onClick={onRestart}
            size="lg"
            className="w-full sm:w-auto bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
          >
            Retry this Quiz
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
          >
            Back to Categories
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
