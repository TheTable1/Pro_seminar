import { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import BackToTop from "./BackToTop";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateUserAchievement } from "./firebase/firebaseAchievements";

const CoffeeVariety = () => {
  const [selectedVariety, setSelectedVariety] = useState("Arabica");
  const [selectedSubVariety, setSelectedSubVariety] = useState("");
  const [userId, setUserId] = useState(null);

  // Sample data for coffee varieties
  const coffeeData = {
    Arabica: {
      title: "Arabica",
      description:
        "อาราบิก้าเป็นสายพันธุ์กาแฟที่มีความสำคัญมากที่สุดในอุตสาหกรรมกาแฟ โดยประมาณ 60-70% ของกาแฟที่ผลิตและบริโภคทั่วโลกมาจากสายพันธุ์อาราบิก้านี้...",
      subVarieties: [
        {
          name: "Typica",
          description: "Typica เป็นสายพันธุ์ดั้งเดิมของอาราบิก้า ให้รสชาตินุ่มนวลและซับซ้อน..."
        },
        {
          name: "Bourbon",
          description: "Bourbon เป็นสายพันธุ์ที่พัฒนามาจาก Typica ให้รสชาติหวานและกลิ่นหอมซับซ้อน..."
        },
        {
          name: "Caturra",
          description: "Caturra เป็นสายพันธุ์กลายพันธุ์จาก Bourbon ที่ให้ผลผลิตสูงและมีรสชาติซับซ้อน..."
        },
        {
          name: "Geisha",
          description: "Geisha เป็นสายพันธุ์อาราบิก้าที่มีชื่อเสียงด้วยกลิ่นหอมเฉพาะตัวและรสชาติเปรี้ยวหวาน..."
        },
      ],
      image: "/gene/gene1.jpg",
    },
    Robusta: {
      title: "Robusta",
      description:
        "โรบัสต้าเป็นสายพันธุ์กาแฟที่ปลูกในเขตร้อนชื้น มีคาเฟอีนสูงกว่าสายพันธุ์อาราบิก้า...",
      subVarieties: [
        {
          name: "Robusta 11",
          description: "Robusta 11 ให้รสชาติขมเข้ม นิยมใช้ในกาแฟสำเร็จรูป..."
        },
        {
          name: "Conillon",
          description: "Conillon เป็นสายพันธุ์โรบัสต้าที่ปลูกในบราซิลและมีรสชาติเข้มข้น..."
        },
        {
          name: "SL28",
          description: "SL28 เป็นพันธุ์ที่พัฒนาขึ้นในเคนยาและมีรสชาติซับซ้อน..."
        },
      ],
      image: "/gene/gene2.jpg",
    },
    Liberica: {
      title: "Liberica",
      description:
        "ลิเบอริก้าเป็นสายพันธุ์กาแฟที่มีลักษณะเฉพาะ มีเมล็ดใหญ่และรสชาติออกควัน...",
      subVarieties: [
        {
          name: "Excelsa",
          description: "Excelsa เป็นสายพันธุ์ย่อยของ Liberica ที่มีรสชาติเปรี้ยวหวาน..."
        },
        {
          name: "Liberica 24",
          description: "Liberica 24 ให้กลิ่นหอมยาวนานและรสชาติออกควันเล็กน้อย..."
        },
      ],
      image: "/gene/gene3.jpg",
    },
    Excelsa: {
      title: "Excelsa",
      description:
        "เอ็กเซลซ่าเป็นสายพันธุ์กาแฟที่มีลักษณะเด่นคือกลิ่นหอมคล้ายผลไม้และดอกไม้...",
      subVarieties: [
        {
          name: "SL34",
          description: "SL34 ให้รสชาติหอมหวานซับซ้อน นิยมปลูกในเคนยา..."
        },
        {
          name: "SL28",
          description: "SL28 ให้รสชาติเปรี้ยวหวานและกลิ่นหอมคล้ายผลไม้..."
        },
      ],
      image: "/gene/gene4.jpg",
    },
  };

  // Handleการเลือกสายพันธุ์ย่อย
  const handleSubVarietyClick = (subVariety) => {
    setSelectedSubVariety(subVariety);
  };

  // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
  }, []);

  // เมื่อผู้ใช้เลื่อนอ่านเนื้อหา Coffee Variety จนเกือบจบ
  useEffect(() => {
    if (!userId) return; // ถ้าไม่ล็อกอิน จะไม่บันทึก achievement

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;

      // ถ้าเลื่อนลงเกือบสุด (ปรับค่าตามต้องการ)
      if (scrollY + viewportHeight >= contentHeight - 100) {
        console.log("✅ บันทึกความสำเร็จสำหรับ Coffee Variety");
        updateUserAchievement(userId, "content", "gene_coffee", true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userId]);

  return (
    <div className="bg-[#fdfcfb] text-gray-800 font-sans">
      <Navbar />
      <BackToTop />
      <header className="text-center py-6">
        <h1 className="text-2xl md:text-4xl font-bold text-[#5c4033]">
          สายพันธุ์กาแฟ
        </h1>
      </header>

      <div className="flex flex-wrap justify-center pt-4 gap-2">
        {Object.keys(coffeeData).map((variety) => (
          <button
            key={variety}
            onClick={() => {
              setSelectedVariety(variety);
              setSelectedSubVariety("");
            }}
            className={`${
              selectedVariety === variety
                ? "bg-[#7a5647] text-[#FFE2B4] border-[#4e3629] shadow-lg"
                : "bg-[#efdfc3] text-[#4e3629] border-[#7a5647]"
            } px-6 py-2 rounded-lg font-medium shadow-md hover:bg-[#FFE2B4] hover:text-[#4e3629] transition duration-200 border-2`}
          >
            {variety}
          </button>
        ))}
      </div>

      <div className="px-4 md:px-16 lg:px-32 py-8">
        <img
          src={coffeeData[selectedVariety].image}
          alt={`${coffeeData[selectedVariety].title} Coffee Beans`}
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />

        <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#7b4b29]">
            {coffeeData[selectedVariety].title}
          </h2>
          <p className="text-gray-700 text-justify mt-4 leading-7">
            {coffeeData[selectedVariety].description}
          </p>
        </div>

        <h2 className="mt-6 text-xl md:text-2xl font-bold text-center text-[#7b4b29]">
          สายพันธุ์ย่อยของ {coffeeData[selectedVariety].title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {coffeeData[selectedVariety].subVarieties.map((subVariety) => (
            <div
              key={subVariety.name}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-pointer hover:shadow-lg flex flex-col justify-center items-center"
              onClick={() => handleSubVarietyClick(subVariety.name)}
            >
              <h2 className="text-xl font-semibold text-orange-600 text-center">
                {subVariety.name}
              </h2>
              <p className="text-gray-700 text-sm mt-2 text-center">
                {subVariety.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoffeeVariety;
