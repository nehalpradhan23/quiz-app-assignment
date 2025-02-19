"use client";
import quiz from "@/data/questions.json";
import { getQuestionsFromDB, saveQuestionsToDB } from "@/utils/inexedDB";
import { createContext, useEffect, useState } from "react";

export const ContextProvider = createContext({
  currentQuestionObject: {
    currentQuestion: {},
    setCurrentQuestion: () => {},
  },
  questionModalObject: {
    showQuestionModal: false,
    setShowQuestionModal: () => {},
  },
  attemptsModalObject: {
    showAttemptsModal: {},
    setShowAttemptsModal: () => {},
  },
  allQuestionsObject: {
    allQuestions: quiz.questions,
    setallQuestions: () => {},
  },
  scoreObject: {
    score: {},
    setScore: () => {},
  },
});

// ======================================================
export default function GlobalContextProvider({ children }) {
  const [allQuestions, setallQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAttemptsModal, setShowAttemptsModal] = useState(false);

  const [score, setScore] = useState({ attempts: 0, correct: 0 });

  // Calculate Score ===============================
  const updateScore = () => {
    let attempts = 0;
    let correct = 0;

    allQuestions.forEach((question) => {
      attempts += question.attempts.length; // attempts count
      // check for one correct
      const hasCorrectAttempt = question?.attempts.some(
        (attempt) => attempt.index === question.answer
      );
      if (hasCorrectAttempt) correct += 1;
      // question.attempts.forEach((attempt) => {
      //   if (attempt.index === question.answer) {
      //     correct += 1;
      //   }
      // });
    });

    setScore({ attempts, correct });
  };

  // load data from DB =============================
  useEffect(() => {
    const fetchData = async () => {
      const questions = await getQuestionsFromDB();

      if (questions.length > 0) {
        setallQuestions(questions);
      } else {
        setallQuestions(quiz.questions);
        saveQuestionsToDB(quiz.questions);
      }
    };
    fetchData();
  }, []);

  // save data when updated
  useEffect(() => {
    if (allQuestions.length > 0) {
      saveQuestionsToDB(allQuestions);
      updateScore();
    }
  }, [allQuestions]);

  // ======================================
  return (
    <ContextProvider.Provider
      value={{
        currentQuestionObject: { currentQuestion, setCurrentQuestion },
        questionModalObject: { showQuestionModal, setShowQuestionModal },
        allQuestionsObject: { allQuestions, setallQuestions },
        attemptsModalObject: { showAttemptsModal, setShowAttemptsModal },
        scoreObject: { score, setScore },
      }}
    >
      {children}
    </ContextProvider.Provider>
  );
}
