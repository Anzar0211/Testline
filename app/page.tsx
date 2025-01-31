import QuizContainer from "./components/QuizContainer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Quiz Master
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Challenge yourself with questions from various tech domains
          </p>
        </div>
        <QuizContainer />
      </div>
    </main>
  );
}
