import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import menuItems from "./menuItems.json"; // ไฟล์ JSON เก็บข้อมูลเมนู

// โครงสร้าง decision tree
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
                { label: "เข้ม", value: "เข้ม", next: { result: "ลาเต้" } },
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
                {
                  label: "อุ่น",
                  value: "อุ่น",
                  next: { result: "คาปูชิโน" },
                },
              ],
            },
          },
          {
            label: "ปานกลาง",
            value: "ปานกลาง",
            next: { result: "แฟลตไวท์" },
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
          { label: "สูง", value: "สูง", next: { result: "มักคิอาโต" } },
          {
            label: "ปานกลาง",
            value: "ปานกลาง",
            next: {
              question: "คุณชอบเพิ่มช็อกโกแลตในกาแฟหรือไม่?",
              key: "chocolate",
              options: [
                { label: "ใช่", value: "ใช่", next: { result: "มอคค่า" } },
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
                {
                  label: "มาก",
                  value: "มาก",
                  next: { result: "อัฟฟอกาโต" },
                },
                {
                  label: "น้อย",
                  value: "น้อย",
                  next: { result: "คอร์ทาโด" },
                },
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
      next: {
        question: "คุณชอบฟองนมกาแฟแบบไหน?",
        key: "foam",
        options: [
          { label: "หนา", value: "หนา", next: { result: "คาปูชิโน" } },
          { label: "บาง", value: "บาง", next: { result: "คาปูชิโน" } },
        ],
      },
    },
    {
      label: "เปรี้ยว",
      value: "เปรี้ยว",
      next: {
        question: "คุณชอบกาแฟเปรี้ยวระดับไหน?",
        key: "sourIntensity",
        options: [
          { label: "จัด", value: "จัด", next: { result: "เอสเพรสโซ" } },
          {
            label: "ปานกลาง",
            value: "ปานกลาง",
            next: { result: "ลาเต้ซิตริค" },
          },
          {
            label: "เบาๆ",
            value: "เบาๆ",
            next: { result: "อเมริกาโนเปรี้ยว" },
          },
        ],
      },
    },
  ],
};

const Suggestion = () => {
  const [currentNode, setCurrentNode] = useState(decisionTree);
  const [path, setPath] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");
  const [currentSelection, setCurrentSelection] = useState(null);

  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    setCurrentSelection(option);
  };

  const handleNextOption = () => {
    if (!currentSelection) {
      alert("กรุณาเลือกตัวเลือกก่อน");
      return;
    }
    setAnswers((prev) => ({
      ...prev,
      [currentNode.key]: currentSelection.value,
    }));
    setPath((prev) => [...prev, currentNode]);

    if (currentSelection.next.result) {
      setResult(currentSelection.next.result);
      setCurrentNode(null);
    } else {
      setCurrentNode(currentSelection.next);
    }
    setCurrentSelection(null);
  };

  const handleBack = () => {
    if (path.length === 0) return;
    const previous = path[path.length - 1];
    setPath(path.slice(0, path.length - 1));
    setCurrentNode(previous);
    setCurrentSelection(null);
    setResult("");
  };

  // ค้นหาเมนูใน menuItems ที่ตรงกับชื่อ result
  const recommendedItem = result
    ? menuItems.find((item) => item.name === result)
    : null;

  // ปุ่มสำหรับลิงก์ไปหน้า /coffee_bean พร้อมส่งข้อมูลเมนู
  const handleViewDetails = () => {
    if (recommendedItem) {
      navigate("/coffee_menu", { state: recommendedItem });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[url('../public/background.jpg')] bg-cover bg-center bg-white/85 bg-blend-overlay flex flex-col items-center justify-center px-4">
        <div className="bg-beige-light backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-4xl relative">
          {/* ยังไม่มี result -> แสดงคำถามและตัวเลือก */}
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
            // มี result -> แสดงเมนูที่แนะนำ
            <div className="text-center">
              <h2 className="text-2xl font-bold text-dark-brown mb-5">
                กาแฟที่แนะนำสำหรับคุณ
              </h2>
              {/* รูปกาแฟ */}
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

              {/* ชื่อกาแฟ */}
              <h2 className="text-2xl font-bold text-dark-brown mb-4 flex justify-center">
                <div className="px-4 py-2 rounded-3xl text-brown font-bold">
                  {result}
                </div>
              </h2>

              {/* การ์ดข้อมูล 4 ใบ */}
              {recommendedItem && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="text-lg font-bold text-brown mb-2">
                      รายละเอียด
                    </h3>
                    <p className="text-gray-600">
                      {recommendedItem.details || "ไม่มีข้อมูล"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="text-lg font-bold text-brown mb-2">
                      ระดับความเข้ม
                    </h3>
                    <p className="text-gray-600">
                      {recommendedItem.cafeid || "ไม่มีข้อมูล"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="text-lg font-bold text-brown mb-2">
                      คาเฟอีน
                    </h3>
                    <p className="text-gray-600">
                      {recommendedItem.caffeine || "ไม่มีข้อมูล"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="text-lg font-bold text-brown mb-2">
                      แคลอรี่
                    </h3>
                    <p className="text-gray-600">
                      {recommendedItem.calories || "ไม่มีข้อมูล"}
                    </p>
                  </div>
                </div>
              )}

              <div>
                {/* ปุ่มไปดูรายละเอียดในหน้า coffee_bean */}
                {recommendedItem && (
                  <button
                    onClick={handleViewDetails}
                    className="mt-4 px-4 py-2 bg-brown text-beige rounded-3xl hover:bg-dark-brown transition-colors"
                  >
                    ดูข้อมูลเมนูนี้
                  </button>
                )}
              </div>

              {/* <div>
                
                <button
                  onClick={() => {
                    setResult("");
                    setCurrentNode(decisionTree);
                    setPath([]);
                    setCurrentSelection(null);
                  }}
                  className="mt-4 ml-2 bg-brown text-beige py-2 px-4 rounded-3xl hover:bg-dark-brown transition-colors"
                >
                  เลือกเมนูใหม่
                </button>
              </div> 
              */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
