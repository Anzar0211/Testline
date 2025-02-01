"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Question } from "../types/quiz";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answers: Record<string, boolean>) => void;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  onNext: () => void;
  onPrevious: () => void;
  onLeave: () => void;
}

export default function QuizQuestion({
  question,
  onAnswer,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  onNext,
  onPrevious,
  onLeave,
}: QuizQuestionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, boolean>
  >({});

  const handleAnswerSelect = (key: string, checked: boolean) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSubmit = () => {
    onAnswer(selectedAnswers);
    setSelectedAnswers({});
  };

  const answers = Object.entries(question.answers).filter(
    ([, value]) => value !== null
  );
  const progress = (currentQuestion / totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl"
    >
      <Card className="border shadow-lg">
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestion} of {totalQuestions}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                Time remaining: {formatTime(timeRemaining)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <CardTitle className="text-xl font-semibold leading-tight">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {answers.map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: answers.indexOf([key, value]) * 0.1 }}
            >
              <div
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors duration-200 ${
                  selectedAnswers[key]
                    ? "bg-primary/5 border-primary/50"
                    : "hover:bg-accent hover:border-accent"
                }`}
              >
                <Checkbox
                  id={key}
                  checked={selectedAnswers[key] || false}
                  onCheckedChange={(checked) =>
                    handleAnswerSelect(key, checked as boolean)
                  }
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor={key}
                  className="flex-grow cursor-pointer text-lg"
                >
                  {value}
                </label>
              </div>
            </motion.div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <div className="flex gap-2">
            <Button
              onClick={onPrevious}
              disabled={currentQuestion === 1}
              variant="outline"
              size="sm"
              className="sm:size-lg bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
            >
              Previous
            </Button>

            <Button
              onClick={onNext}
              disabled={currentQuestion === totalQuestions}
              variant="outline"
              size="sm"
              className="sm:size-lg bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
            >
              Next
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onLeave}
              variant="destructive"
              size="sm"
              className="sm:size-lg bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
            >
              End Test
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length === 0}
              size="sm"
              className="sm:size-lg bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 border-purple-200"
            >
              Submit Answer
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
