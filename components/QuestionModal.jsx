"use client";
import { ContextProvider } from "@/context/AppContext";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const QuestionModal = () => {
  const [answerInput, setAnswerInput] = useState(""); // for input answers
  const [selectedOption, setSelectedOption] = useState(); // for mcq questions

  const [isInputCorrect, setIsInputCorrect] = useState(""); // state for input answers

  const [message, setMessage] = useState(""); // correct answer message

  const [hasAttempted, setHasAttempted] = useState(false); // if attempted do not count close or timeout as attempts

  const {
    questionModalObject: { setShowQuestionModal },
    currentQuestionObject: { currentQuestion, setCurrentQuestion },
    allQuestionsObject: { allQuestions, setallQuestions },
  } = useContext(ContextProvider);

  // timer ==================================
  const [timer, setTimer] = useState(30);
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      handleModalClose();
    }
  }, [timer]);
  // ==================================

  const handleModalClose = () => {
    setShowQuestionModal(false);
    // add attempt every time question viewed --------------------------
    if (!hasAttempted) {
      const item = { index: null, text: null };
      const updatedData = allQuestions.map((q) =>
        q.id === currentQuestion.id
          ? { ...q, attempts: [...q.attempts, item] }
          : q
      );
      setallQuestions(updatedData);
    }
    setCurrentQuestion({});
  };

  // mcq question option click ============================
  const handleOptionClick = (item) => {
    setHasAttempted(true);
    setSelectedOption(item);

    // update main data ===================================
    const updatedData = allQuestions.map((q) =>
      q.id === currentQuestion.id
        ? { ...q, attempts: [...q.attempts, item] }
        : q
    );

    setallQuestions(updatedData);

    // update current viewing data ============================
    setCurrentQuestion((prev) => ({
      ...prev,
      attempts: [...prev.attempts, item],
    }));
  };

  // check if correct answer selected ---------------------
  useEffect(() => {
    if (selectedOption) {
      if (currentQuestion?.answer === selectedOption?.index) {
        setMessage("Correct answer, you can attempt another question.");
      } else {
        setMessage("");
      }
    }
  }, [selectedOption]);

  // input type answers ========================================
  const handleSubmitAnswer = (item) => {
    setHasAttempted(true);
    if (answerInput === item?.answer) {
      setIsInputCorrect("correct");
    } else {
      setIsInputCorrect("wrong");
    }

    // add attempts
    const updatedData = allQuestions.map((q) =>
      q.id === currentQuestion.id
        ? { ...q, attempts: [...q.attempts, answerInput] }
        : q
    );
    setallQuestions(updatedData);

    // setSelectedOption(item);
  };

  // reset on input answer ----------------------------
  useEffect(() => {
    setIsInputCorrect("");
  }, [answerInput]);

  // ============================================
  return createPortal(
    <div className="no-doc-scroll w-screen h-full overflow-y-scroll inset-0 fixed flex justify-center items-center bg-black/50 z-50">
      <div className="w-[90%] h-[80%] lg:w-[1000px] rounded-2xl bg-white p-2">
        <div className="p-6 overflow-y-scroll h-full flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="">Time remaining: {timer}</div>
            <button
              onClick={handleModalClose}
              className="bg-slate-900 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
          <span className="text-red-400 font-semibold">
            Attempts: {currentQuestion?.attempts.length}
          </span>
          {/* ----------------------------- */}
          <div className="text-xl font-semibold">
            Q. {currentQuestion?.question}
          </div>
          {/* if mcq ------------------------------------- */}
          {currentQuestion?.type === "mcq" && (
            <div className="flex flex-col gap-2">
              {currentQuestion?.options?.map((item, index) => (
                <div
                  className={`p-2 border-2 flex gap-2 font-semibold hover:bg-gray-100 cursor-pointer ${
                    selectedOption !== undefined
                      ? item?.index === selectedOption?.index
                        ? selectedOption?.index === currentQuestion?.answer
                          ? "border-green-500"
                          : "border-red-500"
                        : ""
                      : ""
                  }`}
                  key={index}
                  onClick={() => handleOptionClick(item)}
                >
                  <span>{item?.index}. </span>
                  <span>{item?.text}</span>
                </div>
              ))}
            </div>
          )}
          <span className="text-green-500 font-semibold">
            {message.length > 0 ? message : ""}
          </span>
          {/* if input ------------------------------------- */}
          {currentQuestion?.type === "input" && (
            <div className="flex flex-col">
              <div className="flex gap-4">
                <input
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  type="number"
                  className={`border-2 outline-none p-2 w-full ${
                    isInputCorrect !== ""
                      ? isInputCorrect === "correct"
                        ? "border-green-500"
                        : "border-red-500"
                      : ""
                  }`}
                  placeholder="Answer here"
                />
                <button
                  onClick={() => handleSubmitAnswer(currentQuestion)}
                  className="bg-slate-900 text-white px-4 py-2 rounded-md"
                >
                  Submit
                </button>
              </div>
              {isInputCorrect !== "" && (
                <span
                  className={`text-xl mt-4 ${
                    isInputCorrect === "correct"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {isInputCorrect} answer
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default QuestionModal;
