import React, { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

const CoffeeVariety = () => {
  const [selectedVariety, setSelectedVariety] = useState("Arabica");
  const [selectedSubVariety, setSelectedSubVariety] = useState("");

  const coffeeData = {
    Arabica: {
      title: "Arabica",
      description:
        "อาราบิก้าเป็นสายพันธุ์กาแฟที่มีความสำคัญมากที่สุดในอุตสาหกรรมกาแฟ โดยประมาณ 60-70% ของกาแฟที่ผลิตและบริโภคทั่วโลกมาจากสายพันธุ์อาราบิก้านี้ เป็นพันธุ์ที่ปลูกในประเทศที่มีอากาศเย็น โดยเฉพาะในพื้นที่สูง มีรสชาติที่นุ่มนวลและกลมกล่อม มีกลิ่นหอมและมีกรดที่ดี...",
      subVarieties: [
        { name: "Typica", description: "สายพันธุ์หลักของกาแฟอาราบิก้า..." },
        { name: "Bourbon", description: "กาแฟที่มีกลิ่นหอมและรสชาติหวาน..." },
        { name: "Caturra", description: "กาแฟที่มีรสชาติซับซ้อน..." },
        {
          name: "Geisha",
          description: "กาแฟอาราบิก้าที่มีกลิ่นหอมมีความเปรี้ยวและหวาน...",
        },
      ],
      image: "/images/arabica.jpg",
    },
    Robusta: {
      title: "Robusta",
      description:
        "โรบัสต้าเป็นสายพันธุ์กาแฟที่มักพบในเขตร้อน มีปริมาณคาเฟอีนสูงกว่าสายพันธุ์อาราบิก้า และมีรสขมที่เข้มข้น มักถูกใช้ในกาแฟสำเร็จรูปเนื่องจากความทนทานและรสชาติที่โดดเด่น...",
      subVarieties: [
        { name: "Robusta 11", description: "สายพันธุ์ย่อยที่มีรสชาติขม..." },
        { name: "Conillon", description: "สายพันธุ์ย่อยที่ปลูกในเขตร้อน..." },
        { name: "SL28", description: "กาแฟที่มีรสชาติที่กลมกล่อม..." },
      ],
      image: "/images/robusta.jpg",
    },
    Liberica: {
      title: "Liberica",
      description:
        "ลิเบอริก้าเป็นสายพันธุ์กาแฟที่ปลูกในพื้นที่เขตร้อน มีกลิ่นหอมที่ค่อนข้างเป็นเอกลักษณ์ และรสชาติที่มีความเป็นควันเล็กน้อย โรบัสต้าเป็นพันธุ์ที่มีผลผลิตต่ำและถูกปลูกในบางพื้นที่เท่านั้น...",
      subVarieties: [
        { name: "Excelsa", description: "กาแฟที่มีกลิ่นหอมและรสชาติหวาน..." },
        { name: "Liberica 24", description: "กาแฟที่มีกลิ่นหอมยาวนาน..." },
      ],
      image: "/images/liberica.jpg",
    },
    Excelsa: {
      title: "Excelsa",
      description:
        "เอ็กเซลซ่าเป็นกาแฟที่ปลูกในพื้นที่ภูมิอากาศร้อนของเอเชียตะวันออกเฉียงใต้และแอฟริกา โดยมีลักษณะเฉพาะเป็นกลิ่นหอมที่มีรสชาติคล้ายกับผลไม้และดอกไม้ ปลูกในแหล่งที่ไม่กว้างขวางมากนัก...",
      subVarieties: [
        { name: "SL34", description: "กาแฟที่มีกลิ่นหอมและรสชาติเยี่ยมยอด..." },
        { name: "SL28", description: "กาแฟที่มีกลิ่นหอมและรสชาติหวาน..." },
      ],
      image: "/images/excelsa.jpg",
    },
  };

  const handleSubVarietyClick = (subVariety) => {
    setSelectedSubVariety(subVariety);
  };

  return (
    <div className="bg-[#fdfcfb] text-gray-800 font-sans">
      {/* ส่วนหัว */}
      <Navbar/>

      <header className="text-center py-6">
        <h1 className="text-2xl md:text-4xl font-bold text-[#5c4033]">
          สายพันธุ์กาแฟ
        </h1>
      </header>

      {/* ปุ่มเลือกสายพันธุ์หลัก */}
      <div className="flex justify-center space-x-4 py-4">
        {Object.keys(coffeeData).map((variety) => (
          <button
            key={variety}
            onClick={() => {
              setSelectedVariety(variety);
              setSelectedSubVariety(""); // รีเซ็ตสายพันธุ์ย่อย
            }}
            className={`${
              selectedVariety === variety ? "bg-[#d4cbc0]" : "bg-[#e0dcd3]"
            } px-4 py-2 rounded-lg text-[#5c4033] font-medium shadow-md hover:bg-[#c3b9a8]`}
          >
            {variety}
          </button>
        ))}
      </div>

      {/* ปุ่มเลือกสายพันธุ์ย่อย */}
      <div className="flex justify-center space-x-4 py-4">
        {coffeeData[selectedVariety].subVarieties.map((subVariety) => (
          <button
            key={subVariety.name}
            onClick={() => handleSubVarietyClick(subVariety.name)}
            className={`${
              selectedSubVariety === subVariety.name
                ? "bg-[#d4cbc0]"
                : "bg-[#e0dcd3]"
            } px-4 py-2 rounded-lg text-[#5c4033] font-medium shadow-md hover:bg-[#c3b9a8]`}
          >
            {subVariety.name}
          </button>
        ))}
      </div>

      {/* เนื้อหา */}
      <div className="px-4 md:px-16 lg:px-32 py-8">
        {/* ภาพ */}
        <img
          src={coffeeData[selectedVariety].image}
          alt={`${coffeeData[selectedVariety].title} Coffee Beans`}
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />

        {/* ข้อมูลของสายพันธุ์หลัก */}
        <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#7b4b29]">
            {coffeeData[selectedVariety].title}
          </h2>
          <p className="text-gray-700 text-justify mt-4 leading-7">
            {coffeeData[selectedVariety].description}
          </p>
        </div>

        {/* ข้อมูลของสายพันธุ์ย่อย */}
        {selectedSubVariety && (
          <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-center text-[#7b4b29]">
              {selectedSubVariety}
            </h3>
            <p className="text-gray-700 text-justify mt-4 leading-7">
              {
                coffeeData[selectedVariety].subVarieties.find(
                  (subVariety) => subVariety.name === selectedSubVariety
                ).description
              }
            </p>
          </div>
        )}
      </div>

      <Footer/>
    </div>
  );
};

export default CoffeeVariety;
