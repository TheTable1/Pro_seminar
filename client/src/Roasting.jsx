import { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import BackToTop from "./BackToTop";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateUserAchievement } from "./firebase/firebaseAchievements";

const CoffeeInfo = () => {
  const [selectedRoast, setSelectedRoast] = useState("คั่วอ่อน (Light Roast)");
  const [userId, setUserId] = useState(null);
  const [selectedSubVariety, setSelectedSubVariety] = useState("");

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
        "เมล็ดกาแฟจะไม่เกิดการแตก (first crack)",
        "เหมาะสำหรับกาแฟพิเศษ (Specialty Coffee)",
        "เหมาะสำหรับการชงแบบ Pour Over หรือ Aeropress",
      ],
      img: "/roasting/roasting1.png",
    },
    "คั่วกลาง (Medium Roast)": {
      alias: "City Roast, Breakfast Roast",
      color: "เมล็ดกาแฟมีสีน้ำตาลกลาง",
      taste: [
        "รสชาติสมดุลระหว่างความเปรี้ยว ความหวาน และความขม",
        "มักมีโน้ตของช็อกโกแลตและถั่ว",
        "ยังคงมีความสดชื่นในระดับหนึ่ง แต่รสชาติความคั่วจะเด่นขึ้น",
      ],
      characteristics: [
        "มีน้ำมันเล็กน้อยบนผิวเมล็ด",
        "เหมาะสำหรับการชงด้วยวิธีหลากหลาย เช่น Drip, French Press หรือ Espresso",
        "เหมาะสำหรับการดื่มในแบบที่ไม่มีส่วนผสม เช่น กาแฟดำ",
        "เป็นที่นิยมในหมู่นักดื่มกาแฟที่ชอบรสชาติกาแฟแบบสมดุล",
      ],
      img: "/roasting/roasting2.JPG",
    },
    "คั่วเข้ม (Dark Roast)": {
      alias: "Full City Roast, Vienna Roast",
      color: "เมล็ดกาแฟมีสีน้ำตาลเข้มถึงดำ",
      taste: [
        "รสชาติขมเข้มข้นและมีความคั่วเด่นชัด",
        "โน้ตของคาราเมลและช็อกโกแลตเข้ม",
        "ความเปรี้ยวลดลงแทบหมดไป แต่ความหวานจากการคั่วจะเด่นขึ้น",
      ],
      characteristics: [
        "ผิวเมล็ดมันเนื่องจากมีน้ำมันออกมา",
        "เหมาะสำหรับการชงกาแฟเอสเพรสโซ และกาแฟที่มีส่วนผสม เช่น ลาเต้หรือคาปูชิโน่",
        "ให้รสชาติหนักแน่น เหมาะสำหรับผู้ที่ชอบกาแฟเข้มข้น",
        "บางครั้งจะมีกลิ่นหอมคล้ายควันหรือถ่านเล็กน้อย",
      ],
      img: "/roasting/roasting3.PNG",
    },
    "คั่วเข้มมาก (Very Dark Roast)": {
      alias: "French Roast, Italian Roast",
      color: "เมล็ดกาแฟมีสีน้ำตาลเข้มถึงดำสนิท",
      taste: [
        "รสชาติขมเข้มข้นมาก เน้นรสคั่วอย่างชัดเจน",
        "โน้ตของคาราเมลไหม้และความเผ็ดร้อนเล็กน้อยจากการคั่วนาน",
        "ไม่มีรสชาติผลไม้หรือความเปรี้ยวหลงเหลืออยู่",
      ],
      characteristics: [
        "ผิวเมล็ดมันมากเนื่องจากมีน้ำมันออกมาเยอะ",
        "เหมาะสำหรับการชงกาแฟเอสเพรสโซแบบเข้มข้น หรือกาแฟแบบอเมริกาโน่",
        "รสชาติของเมล็ดกาแฟดั้งเดิมจะถูกกลบด้วยรสคั่วที่โดดเด่น",
        "บางครั้งอาจมีกลิ่นหอมควันไฟที่ชัดเจน",
      ],
      img: "/roasting/roasting4.PNG",
    },
  };

  const data = coffeeData[selectedRoast];

  // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
  }, []);

  // เมื่อผู้ใช้เลื่อนดูเนื้อหา CoffeeInfo จนเกือบจบ → บันทึก achievement
  useEffect(() => {
    if (!userId) return; // ถ้าไม่ได้ล็อกอินจะไม่บันทึก achievement

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      if (scrollY + viewportHeight >= contentHeight - 100) {
        console.log("✅ บันทึก achievement สำหรับ Roasting");
        // บันทึก achievement โดยส่งหมวด "content" และ achievementId "roasting_info"
        updateUserAchievement(userId, "content", "roasting_coffee", true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userId]);

  return (
    <div>
      <Navbar />
      <div className="bg-[#f3f1ec] min-h-screen p-6">
        {/* Header Buttons */}
        <div className="flex gap-4 mb-6 flex-wrap justify-center">
          {Object.keys(coffeeData).map((label) => (
            <button
              key={label}
              onClick={() => setSelectedRoast(label)}
              className={`w-70 ${
                selectedRoast === label
                  ? "bg-light-brown text-white"
                  : "bg-[#e0dcd3]"
              } hover:bg-brown hover:text-white text-dark-brown font-medium py-2 px-4 rounded transition-all duration-200 border-2`}
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
              src={data.img}
              alt={`${selectedRoast} Coffee Beans`}
              className="w-40 h-40 object-cover rounded-full border-4 border-light-brown"
            />
          </div>

          {/* Info Section */}
          <div className="text-dark-brown">
            <ul className="mb-2">
              <li className="flex items-center mb-2">
                <img src="/roasting/icon.png" alt="icon" className="w-6 h-6 mr-2" />
                <span className="font-semibold">ชื่อเรียกอื่น : </span> {data.alias}
              </li>
              <li className="flex items-center mb-2">
                <img src="/roasting/icon.png" alt="icon" className="w-6 h-6 mr-2" />
                <span className="font-semibold">สี : </span> {data.color}
              </li>
            </ul>

            <div className="mb-4">
              <p className="font-semibold flex items-center">
                <img src="/roasting/icon.png" alt="icon" className="w-6 h-6 mr-2" />
                รสชาติ : 
              </p>
              <ul className="list-disc list-inside ml-4">
                {data.taste.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold flex items-center">
                <img src="/roasting/icon.png" alt="icon" className="w-6 h-6 mr-2" />
                ลักษณะ : 
              </p>
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
