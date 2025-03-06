import React, { useState } from "react";
import Navbar from "./navbar";

const Suggestion = () => {
  // ชุดคำถามพร้อมตัวเลือก
  const questions = [
    {
      key: "flavor",
      question: "คุณชอบกาแฟรสอะไร",
      options: [
        { label: "ขม", value: "ขม" },
        { label: "หวาน", value: "หวาน" },
        { label: "กลมกล่อม", value: "กลมกล่อม" },
      ],
    },
    {
      key: "milk",
      question: "คุณชอบกาแฟที่มีนมมากหรือน้อย",
      options: [
        { label: "มาก", value: "มาก" },
        { label: "น้อย", value: "น้อย" },
        { label: "ปานกลาง", value: "ปานกลาง" },
      ],
    },
    {
      key: "intensity",
      question: "คุณต้องการกาแฟที่มีความเข้มข้นแบบไหน",
      options: [
        { label: "เข้ม", value: "เข้ม" },
        { label: "กลาง", value: "กลาง" },
        { label: "เบา", value: "เบา" },
      ],
    },
    {
      key: "temperature",
      question: "คุณต้องการกาแฟอุณหภูมิแบบไหน",
      options: [
        { label: "ร้อน", value: "ร้อน" },
        { label: "เย็น", value: "เย็น" },
        { label: "อุ่น", value: "อุ่น" },
      ],
    },
    {
      key: "caffeineLevel",
      question: "คุณต้องการระดับคาเฟอีนเท่าไหร่",
      options: [
        { label: "สูง", value: "สูง" },
        { label: "ปานกลาง", value: "ปานกลาง" },
        { label: "ต่ำ", value: "ต่ำ" },
        { label: "ไม่แน่ใจ", value: "ไม่แน่ใจ" },
      ],
    },
    {
      key: "occasion",
      question: "วัตถุประสงค์การดื่มกาแฟของคุณคืออะไร",
      options: [
        { label: "กระปรี้กระเปร่า", value: "กระปรี้กระเปร่า" },
        { label: "ผ่อนคลาย", value: "ผ่อนคลาย" },
        { label: "เพื่อสังคม", value: "เพื่อสังคม" },
        { label: "เพื่อความคิดสร้างสรรค์", value: "เพื่อความคิดสร้างสรรค์" },
      ],
    },
  ];

  // กำหนด state เริ่มต้นสำหรับคำตอบแต่ละข้อ
  const initialAnswers = {};
  questions.forEach((q) => {
    initialAnswers[q.key] = "";
  });
  const [answers, setAnswers] = useState(initialAnswers);

  // ติดตามคำถามปัจจุบันและผลการแนะนำกาแฟ
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recommendation, setRecommendation] = useState("");

  // เมื่อผู้ใช้คลิกเลือกตัวเลือก จะทำการอัปเดตคำตอบ
  const handleOptionSelect = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // ปุ่ม "ถัดไป" ตรวจสอบว่าผู้ใช้ได้เลือกคำตอบแล้วหรือไม่
  const handleNext = () => {
    if (!answers[questions[currentQuestionIndex].key]) {
      alert("กรุณาเลือกคำตอบ");
      return;
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  // ปุ่ม "ย้อนกลับ" เพื่อกลับไปแก้ไขคำตอบข้อก่อนหน้า
  const handleBack = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  // วิเคราะห์คำตอบและคำนวณคะแนนสำหรับแต่ละเมนูกาแฟ
  const analyzeAnswers = () => {
    let score = {
      espresso: 0,
      ristretto: 0,
      lungo: 0,
      americano: 0,
      cappuccino: 0,
      latte: 0,
      flatWhite: 0,
      macchiato: 0,
      mocha: 0,
      cortado: 0,
      affogato: 0,
      icedCoffee: 0,
      nitroColdBrew: 0,
    };

    // วิเคราะห์ "รสชาติ"
    if (answers.flavor === "ขม") {
      score.espresso += 2;
      score.ristretto += 2;
      score.lungo += 1;
      score.americano += 2;
      score.macchiato += 1;
      score.cortado += 1;
      score.nitroColdBrew += 2;
    } else if (answers.flavor === "หวาน") {
      score.latte += 2;
      score.cappuccino += 2;
      score.mocha += 3;
      score.affogato += 2;
    } else if (answers.flavor === "กลมกล่อม") {
      score.latte += 1;
      score.cappuccino += 1;
      score.flatWhite += 1;
      score.macchiato += 1;
    }

    // วิเคราะห์ "ปริมาณนม"
    if (answers.milk === "มาก") {
      score.latte += 2;
      score.cappuccino += 2;
      score.flatWhite += 2;
      score.mocha += 1;
      score.affogato += 1;
    } else if (answers.milk === "น้อย") {
      score.espresso += 1;
      score.ristretto += 1;
      score.lungo += 1;
      score.americano += 1;
      score.macchiato += 1;
      score.cortado += 1;
    } else if (answers.milk === "ปานกลาง") {
      score.latte += 1;
      score.cappuccino += 1;
      score.flatWhite += 1;
    }

    // วิเคราะห์ "ความเข้มข้น"
    if (answers.intensity === "เข้ม") {
      score.espresso += 2;
      score.ristretto += 3;
      score.americano += 2;
      score.macchiato += 2;
      score.cortado += 2;
    } else if (answers.intensity === "เบา") {
      score.latte += 1;
      score.cappuccino += 1;
      score.flatWhite += 1;
      score.mocha += 1;
      score.affogato += 1;
      score.icedCoffee += 1;
      score.nitroColdBrew += 1;
    } else if (answers.intensity === "กลาง") {
      score.latte += 1;
      score.cappuccino += 1;
      score.flatWhite += 1;
    }

    // วิเคราะห์ "อุณหภูมิ"
    if (answers.temperature === "ร้อน") {
      score.espresso += 1;
      score.ristretto += 1;
      score.lungo += 1;
      score.americano += 1;
      score.cappuccino += 1;
      score.latte += 1;
      score.flatWhite += 1;
      score.macchiato += 1;
      score.mocha += 1;
      score.cortado += 1;
    } else if (answers.temperature === "เย็น") {
      score.icedCoffee += 3;
      score.nitroColdBrew += 3;
      score.affogato += 2;
    } else if (answers.temperature === "อุ่น") {
      score.latte += 1;
      score.cappuccino += 1;
      score.flatWhite += 1;
      score.macchiato += 1;
      score.mocha += 1;
    }

    // วิเคราะห์ "ระดับคาเฟอีน"
    if (answers.caffeineLevel === "สูง") {
      score.espresso += 2;
      score.ristretto += 2;
      score.lungo += 2;
      score.americano += 2;
      score.macchiato += 2;
      score.nitroColdBrew += 2;
    } else if (answers.caffeineLevel === "ปานกลาง") {
      score.cappuccino += 1;
      score.latte += 1;
      score.flatWhite += 1;
      score.cortado += 1;
    } else if (answers.caffeineLevel === "ต่ำ") {
      score.mocha += 1;
      score.affogato += 2;
    }

    // วิเคราะห์ "วัตถุประสงค์การดื่มกาแฟ"
    if (answers.occasion === "กระปรี้กระเปร่า") {
      score.espresso += 2;
      score.ristretto += 2;
      score.americano += 2;
      score.nitroColdBrew += 2;
    } else if (answers.occasion === "ผ่อนคลาย") {
      score.latte += 2;
      score.cappuccino += 2;
      score.flatWhite += 2;
      score.mocha += 2;
      score.affogato += 2;
    } else if (answers.occasion === "เพื่อสังคม") {
      score.latte += 1;
      score.cappuccino += 1;
      score.icedCoffee += 1;
      score.affogato += 1;
    } else if (answers.occasion === "เพื่อความคิดสร้างสรรค์") {
      score.americano += 1;
      score.flatWhite += 1;
      score.cortado += 1;
      score.nitroColdBrew += 1;
    }

    // ค้นหาเมนูกาแฟที่ได้คะแนนสูงสุด
    let maxScore = 0;
    let recommended = "";
    for (const coffee in score) {
      if (score[coffee] > maxScore) {
        maxScore = score[coffee];
        recommended = coffee;
      }
    }
    setRecommendation(recommended);
  };

  // เมื่อครบทุกคำถามแล้วให้ส่งคำตอบเพื่อวิเคราะห์
  const handleSubmit = () => {
    if (!answers[questions[currentQuestionIndex].key]) {
      alert("กรุณาเลือกคำตอบ");
      return;
    }
    analyzeAnswers();
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[url('../public/background.jpg')] bg-cover bg-center bg-white/85 bg-blend-overlay flex flex-col items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-4xl relative">
          {!recommendation ? (
            <div>
              {/* ส่วนหัวข้อ */}
              <h2 className="text-center text-2xl md:text-3xl font-bold text-brown mb-4">
                แนะนำเมนูเลือกกาแฟสำหรับคุณ
              </h2>
              {/* ลำดับคำถาม */}
              <p className="text-center text-brown mb-4">
                คำถาม {currentQuestionIndex + 1} จาก {questions.length}
              </p>
              {/* คำถามปัจจุบัน */}
              <p className="text-dark-brown text-xl md:text-2xl font-semibold mb-6">
                {questions[currentQuestionIndex].question}
              </p>
              {/* ตัวเลือก (Options) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleOptionSelect(
                        questions[currentQuestionIndex].key,
                        option.value
                      )
                    }
                    className={`p-4 rounded-3xl transition-colors text-left font-medium border ${
                      answers[questions[currentQuestionIndex].key] ===
                      option.value
                        ? "bg-brown text-beige border-brown"
                        : "bg-beige-light text-brown border-brown hover:bg-light-brown hover:text-beige"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {/* ปุ่มย้อนกลับ/ถัดไป/ส่งคำตอบ */}
              <div className="flex justify-end mt-6">
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={handleBack}
                    className="bg-brown text-beige py-2 px-4 rounded-3xl hover:bg-dark-brown transition-colors"
                  >
                    กลับ
                  </button>
                )}
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="ml-auto bg-brown text-beige py-2 px-4 rounded-3xl hover:bg-dark-brown transition-colors"
                  >
                    ถัดไป
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="ml-auto bg-brown text-beige py-2 px-4 rounded-3xl hover:bg-dark-brown transition-colors"
                  >
                    ส่งคำตอบ
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-dark-brown mb-4">
                กาแฟที่แนะนำ
              </h2>
              <h2 className="text-3xl font-bold text-dark-brown mb-4">
                {recommendation}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
