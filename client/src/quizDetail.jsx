import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import quiz from "./quiz.json";

const quizData = quiz;

const QuizDetail = () => {
  const { id } = useParams();
  const quiz = quizData[id];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(quiz?.questions.length).fill(null)
  );
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <p>ไม่พบแบบทดสอบ</p>
        </div>
        <Footer />
      </div>
    );
  }

  // ฟังก์ชันเลือกคำตอบในแต่ละข้อ
  const handleSelect = (option) => {
    const newSelected = [...selectedAnswers];
    newSelected[currentQuestion] = option;
    setSelectedAnswers(newSelected);
  };

  // คำนวณคะแนนเมื่อส่งคำตอบ
  const calculateScore = () => {
    let count = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        count++;
      }
    });
    setScore(count);
  };

  // ปุ่มถัดไปหรือส่งคำตอบ
  const handleNext = () => {
    if (selectedAnswers[currentQuestion] === null) {
      alert("กรุณาเลือกคำตอบก่อน");
      return;
    }
    if (currentQuestion === quiz.questions.length - 1) {
      calculateScore();
      setShowScore(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // ปุ่มย้อนกลับ
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // คำนวณเปอร์เซ็นต์ความคืบหน้า
  const progressPercent = Math.round(
    ((currentQuestion + 1) / quiz.questions.length) * 100
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[url('../public/background.jpg')] bg-cover bg-center bg-white/85 bg-blend-overlay flex flex-col items-center justify-center px-4">
        <div className="bg-beige-light backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-4xl relative">
          {!showScore ? (
            <>
              <h2 className="text-center text-2xl md:text-3xl font-bold text-dark-brown mb-4">
                {quiz.title}
              </h2>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-dark-brown h-3 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-dark-brown mt-1">
                  {progressPercent}% (คำถาม {currentQuestion + 1} /{" "}
                  {quiz.questions.length})
                </p>
              </div>
              <div className="mb-4">
                <p className="text-lg text-dark-brown">
                  {quiz.questions[currentQuestion].question}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quiz.questions[currentQuestion].options.map(
                  (option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelect(option)}
                      className={`p-4 rounded-3xl transition-colors text-left font-medium border bg-white text-dark-brown border-dark-brown ${
                        selectedAnswers[currentQuestion] === option
                          ? "!bg-brown !text-beige"
                          : "hover:bg-light-brown hover:text-beige"
                      }`}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
              <div className="flex justify-between mt-6">
                {currentQuestion > 0 && (
                  <button
                    onClick={handleBack}
                    className="bg-dark-brown text-beige py-2 px-4 rounded-3xl hover:bg-brown transition-colors"
                  >
                    ย้อนกลับ
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === null}
                  className="ml-auto bg-dark-brown text-beige py-2 px-4 rounded-3xl hover:bg-brown transition-colors disabled:opacity-50"
                >
                  {currentQuestion === quiz.questions.length - 1
                    ? "ส่งคำตอบ"
                    : "ถัดไป"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-dark-brown mb-4">
                คะแนนของคุณ: {score} / {quiz.questions.length}
              </h2>

              <p className="text-xl mb-6">
                <span className="font-bold">
                  {Math.round((score / quiz.questions.length) * 100)}%
                </span>
              </p>

              {(() => {
                const percentage = Math.round(
                  (score / quiz.questions.length) * 100
                );
                if (percentage >= 80) {
                  return (
                    <p className="text-xl font-bold mb-6">
                      เก่งมาก คะแนนอยู่ในระดับดีเยี่ยม
                    </p>
                  );
                } else if (percentage >= 50) {
                  return (
                    <p className="text-xl font-bold mb-6">
                      เก่งมาก คะแนนอยู่ในระดับดี
                    </p>
                  );
                } else {
                  return (
                    <p className="text-xl font-bold mb-6">
                      สู้ๆนะพยายามให้มากกว่านี้
                    </p>
                  );
                }
              })()}

              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-8 py-3 bg-brown text-beige font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ทำแบบทดสอบอีกครั้ง
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuizDetail;
