"use client";
import QuestionModal from "@/components/QuestionModal";
import Questions from "@/components/Questions";
import ViewAllAttempts from "@/components/ViewAllAttempts";
import { ContextProvider } from "@/context/AppContext";
import { saveQuestionsToDB } from "@/utils/inexedDB";
import { useContext } from "react";
import quiz from "@/data/questions.json";

export default function Home() {
  const {
    questionModalObject: { showQuestionModal },
    attemptsModalObject: { showAttemptsModal },
    allQuestionsObject: { setallQuestions },
    scoreObject: { score },
  } = useContext(ContextProvider);

  const resetQuiz = () => {
    saveQuestionsToDB(quiz.questions);
    setallQuestions(quiz.questions);
  };

  return (
    <div className="">
      <div className="mx-auto max-md:mx-10 md:max-w-2xl my-10 relative">
        <h1 className="text-4xl font-bold text-center my-8">
          Interactive quiz app
        </h1>
        <div className="flex justify-between items-center my-5">
          <div className="flex gap-2 font-semibold">
            <span className="text-red-500">
              Total attempts: {score.attempts}
            </span>
            -
            <span className="text-green-500">
              Correct answers: {score.correct}
            </span>
          </div>
          <button
            onClick={resetQuiz}
            className="my-5 bg-slate-900 px-4 py-2 rounded-md text-white text-right "
          >
            Reset quiz
          </button>
        </div>
        <Questions />
      </div>
      {showQuestionModal && <QuestionModal />}
      {showAttemptsModal && <ViewAllAttempts />}
    </div>
  );
}
