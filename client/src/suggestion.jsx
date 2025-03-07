import React, { useState } from "react";
import Navbar from "./navbar";
import menuItems from "./menuItems.json"; // Import ไฟล์ JSON

// โครงสร้าง decision tree ที่ปรับปรุงให้มีคำถามเพิ่มเติม โดยตัดส่วนเกี่ยวกับกลิ่นผลไม้ออกไป
const decisionTree = {
  question: "คุณชอบกาแฟรสอะไร?",
  key: "flavor",
  options: [
    {
      label: "ขม",
      value: "ขม",
      next: {
        question: "คุณชอบกาแฟที่มีนมมากน้อยแค่ไหน?",
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
                  next: { result: "ลาเต้" },
                },
                { label: "กลาง", value: "กลาง", next: { result: "ลาเต้" } },
                { label: "เบา", value: "เบา", next: { result: "แฟลตไวท์" } },
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
                { label: "ร้อน", value: "ร้อน", next: { result: "เอสเพรสโซ" } },
                {
                  label: "เย็น",
                  value: "เย็น",
                  next: { result: "อเมริกาโนเย็น" },
                },
                { label: "อุ่น", value: "อุ่น", next: { result: "คาปูชิโน" } },
              ],
            },
          },
          { label: "ปานกลาง", value: "ปานกลาง", next: { result: "แฟลตไวท์" } },
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
          { label: "สูง", value: "สูง", next: { result: "มักคิอาโต" } },
          {
            label: "ปานกลาง",
            value: "ปานกลาง",
            next: {
              question: "คุณชอบเพิ่มช็อกโกแลตในกาแฟหรือไม่?",
              key: "chocolate",
              options: [
                {
                  label: "ใช่",
                  value: "ใช่",
                  next: { result: "มอคค่าช็อกโกแลตเข้มข้นพิเศษ" },
                },
                { label: "ไม่", value: "ไม่", next: { result: "มอคค่า" } },
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
                { label: "มาก", value: "มาก", next: { result: "อัฟฟอกาโต" } },
                { label: "น้อย", value: "น้อย", next: { result: "คอร์ทาโด" } },
              ],
            },
          },
          {
            label: "ไม่แน่ใจ",
            value: "ไม่แน่ใจ",
            next: { result: "ริสเตรตโต" },
          },
        ],
      },
    },
    {
      label: "กลมกล่อม",
      value: "กลมกล่อม",
      next: { result: "คาปูชิโน" },
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

  // ดึงข้อมูลรูปภาพจากไฟล์ menuItem.json โดยหาว่าชื่อของ item ตรงกับ result หรือไม่
  const recommendedItem = result
    ? menuItems.find((item) => item.name === result)
    : null;


  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[url('../public/background.jpg')] bg-cover bg-center bg-white/85 bg-blend-overlay flex flex-col items-center justify-center px-4">
        <div className="bg-beige-light backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-4xl relative">
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
                      className={`p-4 rounded-3xl transition-colors text-left font-medium border bg-white text-brown border-brown ${
                        currentSelection &&
                        currentSelection.value === option.value
                          ? "!bg-brown !text-beige"
                          : "!hover:bg-light-brown hover:text-beige"
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
              <h2 className="text-2xl font-bold text-dark-brown mb-5">
                กาแฟที่แนะนำสำหรับคุณ
              </h2>
              <img
                src={
                  recommendedItem && recommendedItem.img
                    ? recommendedItem.img
                    : "../public/defult-coffeecup.png"
                }
                alt={
                  recommendedItem && recommendedItem.name
                    ? recommendedItem.name
                    : "Fallback image"
                }
                className="mx-auto w-full md:w-1/2 lg:w-1/3 mb-4"
              />
              <h2 className="text-2xl font-bold text-dark-brown mb-4 flex justify-center">
                <div className="px-4 py-2 bg-brown rounded-3xl text-beige">
                  {result}
                </div>
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
