"use client";
import { ContextProvider } from "@/context/AppContext";
import { useContext } from "react";
import { createPortal } from "react-dom";

const ViewAllAttempts = () => {
  const {
    attemptsModalObject: { setShowAttemptsModal },
    currentQuestionObject: { currentQuestion, setCurrentQuestion },
  } = useContext(ContextProvider);

  const handleModalClose = () => {
    setShowAttemptsModal(false);

    setCurrentQuestion({});
  };

  //==========================================================
  return createPortal(
    <div className="no-doc-scroll w-screen h-full overflow-y-scroll inset-0 fixed flex justify-center items-center bg-black/50 z-50">
      <div className="w-[90%] h-[80%] lg:w-[1000px] rounded-2xl bg-white p-2">
        <div className="p-6 overflow-y-scroll h-full flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="font-semibold text-xl md:text-2xl">
              All attempts
            </div>
            <button
              onClick={handleModalClose}
              className="bg-slate-900 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
          <div className="font-semibold text-xl">
            Q. {currentQuestion?.question}
          </div>
          {/* list attempts ==================================== */}
          <span className="text-md font-semibold text-gray-500">
            Total attempts: {currentQuestion?.attempts?.length}
          </span>
          <div className="flex flex-col gap-3">
            {currentQuestion?.attempts?.map((item, index) => (
              <div className="font-semibold" key={index}>
                {currentQuestion?.type === "mcq" ? (
                  <div className="">
                    {item?.index === null ? (
                      <div className="text-red-500">
                        - attempted but not answered
                      </div>
                    ) : (
                      <div
                        className={`${
                          item?.index === currentQuestion?.answer
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        - {item?.index}. {item?.text}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="">
                    {item?.index === null ? (
                      <div className="text-red-500">
                        - attempted but not answered
                      </div>
                    ) : (
                      <div
                        className={`${
                          currentQuestion?.answer === item
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        - {item}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewAllAttempts;
