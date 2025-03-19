import { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import BackToTop from "./BackToTop";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateUserAchievement } from "./firebase/firebaseAchievements";

function Process() {
  const [selectedIcon, setSelectedIcon] = useState("cherry");
  const [userId, setUserId] = useState(null);

  const icons = [
    { id: 1, name: "cherry", image: "/process/process1.png", alt: "การเตรียมเมล็ดกาแฟ", img: "/process/process5.jpg", content: "การเก็บเมล็ดกาแฟเป็นขั้นตอนแรกที่สำคัญต่อคุณภาพของกาแฟในอนาคต โดยทั่วไปจะรอให้ผลกาแฟสุกเต็มที่จนเปลือกผลเปลี่ยนเป็นสีแดงสดหรือเหลือง (ขึ้นอยู่กับสายพันธุ์) ก่อนจะเก็บเกี่ยว ซึ่งสามารถทำได้สองวิธีหลัก ๆ ได้แก่ การเก็บด้วยมือ (Hand Picking) ที่เน้นการเก็บผลเชอร์รี่สุกทีละลูก เพื่อคัดเลือกเฉพาะผลที่มีคุณภาพสูง และ การเก็บด้วยเครื่องจักร (Mechanical Harvesting) ซึ่งเหมาะสำหรับฟาร์มขนาดใหญ่ที่ต้องการความรวดเร็ว อย่างไรก็ตาม วิธีการเก็บที่เหมาะสมจะขึ้นอยู่กับเป้าหมายด้านคุณภาพ รสชาติ และปริมาณของผลผลิต รวมถึงลักษณะภูมิประเทศของพื้นที่ปลูกอีกด้วย" },
    { id: 2, name: "roast", image: "/process/process2.png", alt: "การคั่วกาแฟ", img: "/process/process6.jpg", content: "เมล็ดกาแฟดิบที่ผ่านกระบวนการแปรรูปและอบแห้งจะถูกนำมาคั่วเพื่อดึงกลิ่นและรสชาติที่ซ่อนอยู่ในเมล็ดออกมา การคั่วเป็นกระบวนการที่ซับซ้อนและต้องการความแม่นยำ โดยเริ่มจากการให้ความร้อนแก่เมล็ดกาแฟในอุณหภูมิที่เหมาะสม ซึ่งส่วนใหญ่จะอยู่ระหว่าง 180-250 องศาเซลเซียส ความร้อนจะกระตุ้นการเปลี่ยนแปลงทางเคมี เช่น การเกิด Maillard Reaction ที่ทำให้เมล็ดกาแฟมีสีน้ำตาลและปลดปล่อยน้ำมันที่ช่วยสร้างกลิ่นหอมออกมา ระดับการคั่วที่แตกต่างกัน เช่น คั่วอ่อน (Light Roast) ที่ยังคงรสชาติเปรี้ยวและกลิ่นเฉพาะของเมล็ดไว้มากที่สุด คั่วกลาง (Medium Roast) ที่ให้สมดุลระหว่างรสเปรี้ยวและขม หรือ คั่วเข้ม (Dark Roast) ที่เน้นความเข้มและกลิ่นที่มีลักษณะไหม้เล็กน้อย ล้วนส่งผลต่อรสชาติของกาแฟเมื่อชง" },
    { id: 3, name: "process", image: "/process/process3.png", alt: "การบดกาแฟ", img: "/process/process7.jpg", content: "การบดกาแฟเป็นขั้นตอนที่ต้องการความละเอียดและความแม่นยำ เพราะระดับความละเอียดของผงกาแฟส่งผลโดยตรงต่อการสกัดรสชาติในกระบวนการชง การบดสามารถแบ่งออกได้หลายระดับ เช่น บดหยาบ (Coarse Grind) ที่เหมาะสำหรับการชงแบบ French Press หรือ Cold Brew บดปานกลาง (Medium Grind) ที่นิยมใช้สำหรับการดริปหรือเครื่องชงไฟฟ้า และ บดละเอียด (Fine Grind) ที่ใช้กับการชง Espresso ซึ่งต้องการแรงดันสูงในการสกัดกาแฟ นอกจากนี้ การเลือกใช้เครื่องบดคุณภาพสูง เช่น เครื่องบดแบบ Burr Grinder จะช่วยให้ได้ขนาดของผงกาแฟที่สม่ำเสมอ และส่งผลให้รสชาติของกาแฟในถ้วยสมดุลมากยิ่งขึ้น" },
    { id: 4, name: "brew", image: "/process/process4.png", alt: "การชงกาแฟ", img: "/process/process8.jpg", content: "ขั้นตอนสุดท้ายคือการชงกาแฟ ซึ่งมีวิธีการหลากหลายตามวัฒนธรรมและความนิยม เช่น การชงแบบ Espresso ที่ใช้แรงดันสูงและอุณหภูมิน้ำที่เหมาะสมในการสกัดกาแฟภายในเวลาอันสั้น การดริป (Pour Over) ที่เน้นความพิถีพิถันในการรินน้ำร้อนผ่านผงกาแฟในรูปแบบวงกลม เพื่อควบคุมการสกัดให้ได้รสชาติที่ละเอียดอ่อน การชงแบบ French Press ที่ใช้น้ำร้อนแช่ผงกาแฟในระยะเวลาหนึ่งก่อนกดกรอง การชง Cold Brew ที่ใช้น้ำเย็นแช่กาแฟในระยะเวลานานเพื่อดึงรสชาติที่นุ่มนวลและหวานเป็นธรรมชาติ และวิธีการอื่น ๆ อีกมากมาย โดยการเลือกวิธีการชงที่เหมาะสมกับระดับการบดกาแฟและชนิดของเมล็ด จะช่วยให้ได้รสชาติกาแฟที่ตรงใจผู้ดื่มมากที่สุด" },
  ];

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

  // เมื่อผู้ใช้เลื่อนดูเนื้อหา Process จนเกือบจบ → บันทึก achievement
  useEffect(() => {
    if (!userId) return; // ถ้าไม่ได้ล็อกอิน จะไม่บันทึก achievement

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;

      if (scrollY + viewportHeight >= contentHeight - 100) {
        console.log("✅ บันทึกความสำเร็จสำหรับ process_coffee");
        updateUserAchievement(userId, "content", "process_coffee", true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userId]);

  return (
    <div className="bg-[#f3f1ec]">
      <Navbar />
      <BackToTop />
      <div className="container mx-auto p-6 ">
        {/* Header with icons */}
        <div className="flex justify-center items-center space-x-6 py-6">
          {icons.map((icon) => (
            <button
              key={icon.id}
              onClick={() => setSelectedIcon(icon.name)}
              className={`relative w-20 h-20 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-4 border-black bg-brown-300 flex justify-center items-center transition-transform duration-300 ${
                selectedIcon === icon.name
                  ? "ring-4 ring-brown scale-110"
                  : "hover:scale-105"
              }`}
            >
              <img
                src={icon.image}
                alt={icon.alt}
                className="w-1/2 h-1/2 sm:w-10 sm:h-10"
              />
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="mt-8 text-center">
          {icons.map(
            (content) =>
              selectedIcon === content.name && (
                <div key={content.id}>
                  <img
                    src={content.img}
                    className="w-1/2 mx-auto mb-5"
                    alt={content.alt}
                  />
                  <div className="bg-[#e5c1af] py-5 mb-3 rounded-2xl">
                    <h2 className="text-lg md:text-2xl font-bold mb-4">
                      {content.alt}
                    </h2>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                      {content.content}
                    </p>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Process;
