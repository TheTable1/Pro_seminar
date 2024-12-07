import React, { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

const CoffeeInfo = () => {
  const coffeeData = {
    "คั่วอ่อน (Light Roast)": {
      alias: "Cinnamon Roast, New England Roast",
      color: "เมล็ดกาแฟสีอ่อน มักมีสีระหว่างน้ำตาลอ่อนถึงสีน้ำตาลกลาง",
      taste: [
        "รสชาติที่สดชื่นและเปรี้ยว มักจะมีโน้ตของผลไม้ เช่น เบอร์รี่และกลิ่นดอกไม้",
        "ความหวานที่น้อยกว่าระดับการคั่วที่สูงขึ้น",
        "สามารถสะท้อนลักษณะความเป็นธรรมชาติของกาแฟได้ดี",
      ],
      characteristics: [
        "ไม่มีน้ำมันบนผิวเมล็ด",
        "เมล็ดกาแฟจะไม่เกิดการแตก (first crack) ซึ่งเป็นเสียงที่เกิดจากการขยายตัวของเมล็ดกาแฟเมื่อได้รับความร้อน",
      ],
    },
    "คั่วกลาง (Medium Roast)": {
      alias: "City Roast, Breakfast Roast",
      color: "เมล็ดกาแฟมีสีน้ำตาลกลาง",
      taste: [
        "รสชาติสมดุลระหว่างความเปรี้ยว ความหวาน และความขม",
        "มักมีโน้ตของช็อกโกแลตและถั่ว",
      ],
      characteristics: [
        "มีน้ำมันเล็กน้อยบนผิวเมล็ด",
        "เหมาะสำหรับการชงด้วยวิธีหลากหลาย",
      ],
    },
    "คั่วเข้ม (Dark Roast)": {
      alias: "Full City Roast, Vienna Roast",
      color: "เมล็ดกาแฟมีสีน้ำตาลเข้มถึงดำ",
      taste: [
        "รสชาติขมเข้มข้นและมีความคั่วเด่นชัด",
        "โน้ตของคาราเมลและช็อกโกแลตเข้ม",
      ],
      characteristics: [
        "ผิวเมล็ดมันเนื่องจากมีน้ำมันออกมา",
        "เหมาะสำหรับการชงกาแฟเอสเปรสโซ",
      ],
    },
  };

  const [selectedRoast, setSelectedRoast] = useState("คั่วอ่อน (Light Roast)");

  const data = coffeeData[selectedRoast];

  return (
    <div>
      <Navbar />
      <div className="bg-beige-light min-h-screen p-6">
        {/* Header Buttons */}

        <div className="flex gap-4 mb-6 flex-wrap justify-center">
          {Object.keys(coffeeData).map((label) => (
            <button
              key={label}
              onClick={() => setSelectedRoast(label)}
              className={`w-60 ${
                selectedRoast === label
                  ? "bg-light-brown text-white"
                  : "bg-beige"
              } hover:bg-brown hover:text-white text-dark-brown font-medium py-2 px-4 rounded transition-all`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 text-dark-brown">
            {selectedRoast}
          </h2>

          {/* Image Section */}
          <div className="flex justify-center mb-6">
            <img
              src="https://via.placeholder.com/150" // Replace with actual image URL
              alt={`${selectedRoast} Coffee Beans`}
              className="w-40 h-40 object-cover rounded-full border-4 border-light-brown"
            />
          </div>

          {/* Info Section */}
          <div className="text-dark-brown">
            <p className="mb-2">
              <span className="font-semibold">ชื่อเรียกอื่น: </span>
              {data.alias}
            </p>
            <p className="mb-2">
              <span className="font-semibold">สี: </span>
              {data.color}
            </p>

            <div className="mb-4">
              <p className="font-semibold">รสชาติ:</p>
              <ul className="list-disc list-inside ml-4">
                {data.taste.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold">ลักษณะ:</p>
              <ul className="list-disc list-inside ml-4">
                {data.characteristics.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoffeeInfo;
