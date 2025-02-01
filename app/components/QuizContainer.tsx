"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Question, QuizCategory } from "../types/quiz";
import StartQuiz from "./StartQuiz";
import QuizQuestion from "./QuizQuestion";
import QuizSummary from "./QuizSummary";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const QUIZ_TIME_LIMIT = 120;

export default function QuizContainer() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<QuizCategory>("Linux");
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME_LIMIT);
  const [timeTaken, setTimeTaken] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizEnded && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizStarted, quizEnded, timeRemaining]);

  const endQuiz = useCallback(() => {
    setQuizEnded(true);
    setTimeTaken(QUIZ_TIME_LIMIT - timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0 && !quizEnded) {
      endQuiz();
    }
  }, [timeRemaining, quizEnded, endQuiz]);

  const fetchQuizData = async (category: QuizCategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/quiz?category=${category.toLowerCase()}&limit=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch quiz data");
      }
      const data = await response.json();
      setQuestions(data);
      setLoading(false);
    } catch {
      setError("Failed to load quiz data. Please try again later.");
      setLoading(false);
    }
  };

  const startQuiz = async (category: QuizCategory) => {
    setSelectedCategory(category);
    await fetchQuizData(category);
    setQuizStarted(true);
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeRemaining(QUIZ_TIME_LIMIT);
    setTimeTaken(0);
  };

  const handleAnswer = (selectedAnswers: Record<string, boolean>) => {
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect = true;

    Object.entries(currentQuestion.correct_answers).forEach(([key, value]) => {
      const answerKey = key.replace("_correct", "");
      if (selectedAnswers[answerKey] && value === "true") {
      } else if (!selectedAnswers[answerKey] && value === "false") {
      } else {
        isCorrect = false;
      }
    });

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      endQuiz();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleLeave = () => {
    // Reset quiz state
    setQuizStarted(false);
    setQuizEnded(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeRemaining(QUIZ_TIME_LIMIT);
    setTimeTaken(0);

    router.replace("/");
  };

  const restartQuiz = async () => {
    setQuizStarted(false);
    setQuizEnded(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeRemaining(QUIZ_TIME_LIMIT);
    setTimeTaken(0);

    await fetchQuizData(selectedCategory);

    setQuizStarted(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (!quizStarted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <StartQuiz onStart={startQuiz} />
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <QuizSummary
          score={score}
          totalQuestions={questions.length}
          category={selectedCategory}
          onRestart={restartQuiz}
          timeTaken={timeTaken}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <QuizQuestion
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onLeave={handleLeave}
      />
    </div>
  );
}
