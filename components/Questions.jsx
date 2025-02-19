"use client";
import { ContextProvider } from "@/context/AppContext";
// import quiz from "@/data/questions.json";
import { useContext, useState } from "react";

const Questions = () => {
  // useEffect(() => {
  //   setQuizData(questions);
  // }, []);

  // const [quizData, setQuizData] = useState(quiz.questions);

  const {
    allQuestionsObject: { allQuestions },
    currentQuestionObject: { setCurrentQuestion },
    questionModalObject: { setShowQuestionModal },
    attemptsModalObject: { setShowAttemptsModal },
  } = useContext(ContextProvider);

  const handleQuestionAttempt = (data) => {
    setShowQuestionModal(true);
    setCurrentQuestion(data);
  };
  const handleShowAttempts = (data) => {
    setShowAttemptsModal(true);
    setCurrentQuestion(data);
  };
  // ==============================================
  return (
    <div className="space-y-5">
      {allQuestions.map((data) => (
        <div
          className="flex gap-8 flex-col border border-slate-400 rounded-md p-4"
          key={data?.id}
        >
          {/* ----------------- */}
          <div className="flex justify-between font-semibold">
            {data?.id} - {data?.question}
            {/* <div className="text-sm text-slate-700 flex items-center whitespace-nowrap">
              Attempts - {data?.attempts}
            </div> */}
          </div>
          {/* ----------------- */}
          <div className="flex justify-between items-center">
            {/* TODO */}
            <div className="flex gap-2 items-center max-md:text-sm">
              <span>Attempts: {data?.attempts.length} </span>
              {data?.attempts.length > 0 && (
                <button
                  onClick={() => handleShowAttempts(data)}
                  className="text-green-700 font-semibold"
                >
                  - View all attempts
                </button>
              )}
            </div>
            <button
              className="bg-slate-950 text-white px-4 py-2 max-md:text-sm rounded-md"
              onClick={() => handleQuestionAttempt(data)}
            >
              Attempt
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Questions;
