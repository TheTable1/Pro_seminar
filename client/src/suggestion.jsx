import React, { useState } from "react";
import Navbar from "./navbar";

// โครงสร้าง decision tree ที่ปรับปรุงให้มีคำถามเพิ่มเติม
const decisionTree = {
  question: "คุณชอบกาแฟรสอะไร?",
  key: "flavor",
  options: [
    {
      label: "ขม",
      value: "ขม",
      next: {
        question: "คุณชอบกาแฟที่มีนมมากหรือน้อย?",
        key: "milk",
        options: [
          {
            label: "มาก",
            value: "มาก",
            next: {
              question: "คุณต้องการกาแฟที่มีความเข้มข้นแบบไหน?",
              key: "intensity",
              options: [
                {
                  label: "เข้ม",
                  value: "เข้ม",
                  next: {
                    // เปลี่ยนคำถามนี้จากเรื่องเผ็ดและกรดเป็นเรื่องรสคั่ว
                    question: "คุณชอบกาแฟที่มีรสคั่วจัดหรือรสละมุน?",
                    key: "roastPreference",
                    options: [
                      {
                        label: "จัด",
                        value: "จัด",
                        next: { result: "Bold Roast Espresso" },
                      },
                      {
                        label: "ละมุน",
                        value: "ละมุน",
                        next: { result: "Smooth Espresso" },
                      },
                    ],
                  },
                },
                {
                  label: "กลาง",
                  value: "กลาง",
                  next: { result: "Ristretto" },
                },
                {
                  label: "เบา",
                  value: "เบา",
                  next: { result: "Americano" },
                },
              ],
            },
          },
          {
            label: "น้อย",
            value: "น้อย",
            next: {
              question: "คุณต้องการกาแฟอุณหภูมิแบบไหน?",
              key: "temperature",
              options: [
                {
                  label: "ร้อน",
                  value: "ร้อน",
                  next: {
                    question: "คุณชอบกาแฟที่มีการเติมวิปครีมหรือไม่?",
                    key: "whippedCream",
                    options: [
                      {
                        label: "ใช่",
                        value: "ใช่",
                        next: { result: "Latte with whipped cream" },
                      },
                      {
                        label: "ไม่",
                        value: "ไม่",
                        next: { result: "Latte" },
                      },
                    ],
                  },
                },
                {
                  label: "เย็น",
                  value: "เย็น",
                  next: { result: "Iced Coffee" },
                },
                {
                  label: "อุ่น",
                  value: "อุ่น",
                  next: { result: "Cappuccino" },
                },
              ],
            },
          },
          {
            label: "ปานกลาง",
            value: "ปานกลาง",
            next: { result: "Flat White" },
          },
        ],
      },
    },
    {
      label: "หวาน",
      value: "หวาน",
      next: {
        question: "คุณต้องการระดับคาเฟอีนเท่าไหร่?",
        key: "caffeineLevel",
        options: [
          { label: "สูง", value: "สูง", next: { result: "Macchiato" } },
          {
            label: "ปานกลาง",
            value: "ปานกลาง",
            next: {
              question: "คุณชอบเพิ่มช็อคโกแลตในกาแฟหรือไม่?",
              key: "chocolate",
              options: [
                {
                  label: "ใช่",
                  value: "ใช่",
                  next: { result: "Mocha with extra chocolate" },
                },
                {
                  label: "ไม่",
                  value: "ไม่",
                  next: { result: "Mocha" },
                },
              ],
            },
          },
          {
            label: "ต่ำ",
            value: "ต่ำ",
            next: {
              question: "คุณชอบกาแฟที่มีนมมากหรือน้อย?",
              key: "milkSweet",
              options: [
                { label: "มาก", value: "มาก", next: { result: "Affogato" } },
                { label: "น้อย", value: "น้อย", next: { result: "Cortado" } },
              ],
            },
          },
          {
            label: "ไม่แน่ใจ",
            value: "ไม่แน่ใจ",
            next: { result: "Ristretto" },
          },
        ],
      },
    },
    {
      label: "กลมกล่อม",
      value: "กลมกล่อม",
      next: {
        question: "วัตถุประสงค์การดื่มกาแฟของคุณคืออะไร?",
        key: "occasion",
        options: [
          {
            label: "กระปรี้กระเปร่า",
            value: "กระปรี้กระเปร่า",
            next: { result: "Espresso" },
          },
          {
            label: "ผ่อนคลาย",
            value: "ผ่อนคลาย",
            next: {
              question: "คุณชอบการคั่วกาแฟแบบไหน?",
              key: "roast",
              options: [
                {
                  label: "อ่อน",
                  value: "อ่อน",
                  next: {
                    question: "คุณต้องการกาแฟที่มีรสผลไม้หรือไม่?",
                    key: "fruity",
                    options: [
                      {
                        label: "ใช่",
                        value: "ใช่",
                        next: {
                          result: "Latte with light roast and fruity notes",
                        },
                      },
                      {
                        label: "ไม่",
                        value: "ไม่",
                        next: { result: "Latte with light roast" },
                      },
                    ],
                  },
                },
                {
                  label: "กลาง",
                  value: "กลาง",
                  next: {
                    question: "คุณต้องการกาแฟที่มีรสผลไม้หรือไม่?",
                    key: "fruity",
                    options: [
                      {
                        label: "ใช่",
                        value: "ใช่",
                        next: {
                          result: "Latte with medium roast and fruity notes",
                        },
                      },
                      {
                        label: "ไม่",
                        value: "ไม่",
                        next: { result: "Latte with medium roast" },
                      },
                    ],
                  },
                },
                {
                  label: "เข้ม",
                  value: "เข้ม",
                  next: {
                    question: "คุณต้องการกาแฟที่มีรสผลไม้หรือไม่?",
                    key: "fruity",
                    options: [
                      {
                        label: "ใช่",
                        value: "ใช่",
                        next: {
                          result: "Latte with dark roast and fruity notes",
                        },
                      },
                      {
                        label: "ไม่",
                        value: "ไม่",
                        next: { result: "Latte with dark roast" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            label: "เพื่อสังคม",
            value: "เพื่อสังคม",
            next: { result: "Cappuccino" },
          },
          {
            label: "เพื่อความคิดสร้างสรรค์",
            value: "เพื่อความคิดสร้างสรรค์",
            next: {
              question: "คุณต้องการกาแฟแบบไหนสำหรับเสริมความคิดสร้างสรรค์?",
              key: "creative",
              options: [
                {
                  label: "สดชื่น",
                  value: "สดชื่น",
                  next: { result: "Americano" },
                },
                {
                  label: "อุ่นสบาย",
                  value: "อุ่นสบาย",
                  next: { result: "Flat White" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

const Suggestion = () => {
  // State สำหรับเก็บ node ปัจจุบันใน decision tree และประวัติสำหรับย้อนกลับ
  const [currentNode, setCurrentNode] = useState(decisionTree);
  const [path, setPath] = useState([]);
  // State สำหรับเก็บคำตอบ (ถ้าต้องการใช้งานเพิ่มเติม)
  const [answers, setAnswers] = useState({});
  // State สำหรับเก็บผลลัพธ์ terminal node
  const [result, setResult] = useState("");
  // State สำหรับเก็บตัวเลือกที่ถูกเลือกใน node ปัจจุบัน
  const [currentSelection, setCurrentSelection] = useState(null);

  // เมื่อผู้ใช้เลือกตัวเลือก (แต่ยังไม่ยืนยันด้วยปุ่ม "ถัดไป")
  const handleOptionSelect = (option) => {
    setCurrentSelection(option);
  };

  // เมื่อกดปุ่ม "ถัดไป" หลังจากเลือกตัวเลือกแล้ว
  const handleNextOption = () => {
    if (!currentSelection) {
      alert("กรุณาเลือกตัวเลือกก่อน");
      return;
    }
    // บันทึกคำตอบสำหรับ node ปัจจุบัน
    setAnswers((prev) => ({
      ...prev,
      [currentNode.key]: currentSelection.value,
    }));
    // บันทึก node ปัจจุบันไว้ใน path สำหรับย้อนกลับ
    setPath((prev) => [...prev, currentNode]);
    // ตรวจสอบว่า option ที่เลือกเป็น terminal node หรือไม่
    if (currentSelection.next.result) {
      setResult(currentSelection.next.result);
      setCurrentNode(null);
    } else {
      setCurrentNode(currentSelection.next);
    }
    // รีเซ็ตการเลือกสำหรับ node ใหม่
    setCurrentSelection(null);
  };

  // ฟังก์ชันย้อนกลับ
  const handleBack = () => {
    if (path.length === 0) return;
    const previous = path[path.length - 1];
    setPath(path.slice(0, path.length - 1));
    setCurrentNode(previous);
    setCurrentSelection(null);
    setResult("");
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[url('../public/background.jpg')] bg-cover bg-center bg-white/85 bg-blend-overlay flex flex-col items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-4xl relative">
          {!result ? (
            <>
              <h2 className="text-center text-2xl md:text-3xl font-bold text-brown mb-4">
                {currentNode ? currentNode.question : "กรุณาตอบคำถาม"}
              </h2>
              {currentNode && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentNode.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option)}
                      className={`p-4 rounded-3xl transition-colors text-left font-medium border bg-beige-light text-brown border-brown ${
                        currentSelection &&
                        currentSelection.value === option.value
                          ? "bg-brown !text-beige"
                          : "hover:bg-light-brown hover:text-beige"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex justify-between mt-6">
                {path.length > 0 && (
                  <button
                    onClick={handleBack}
                    className="bg-brown text-beige py-2 px-4 rounded-3xl hover:bg-dark-brown transition-colors"
                  >
                    ย้อนกลับ
                  </button>
                )}
                {currentSelection && (
                  <button
                    onClick={handleNextOption}
                    className="ml-auto bg-brown text-beige py-2 px-4 rounded-3xl hover:bg-dark-brown transition-colors"
                  >
                    ถัดไป
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-dark-brown mb-4">
                กาแฟที่แนะนำสำหรับคุณ
              </h2>
              <h2 className="text-3xl font-bold text-dark-brown mb-4">
                {result}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
