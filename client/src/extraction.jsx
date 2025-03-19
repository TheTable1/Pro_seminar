import { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import AOS from "aos";
import "aos/dist/aos.css";
import BackToTop from "./BackToTop";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateUserAchievement } from "./firebase/firebaseAchievements";

function Extraction() {
  const [userId, setUserId] = useState(null);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

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

  // เมื่อผู้ใช้เลื่อนดูหน้า Extraction จนเกือบจบ → บันทึก achievement ในหมวด "content"
  useEffect(() => {
    if (!userId) return; // ถ้าไม่ได้ล็อกอิน ไม่ต้องบันทึก achievement

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;

      if (scrollY + viewportHeight >= contentHeight - 100) {
        console.log("✅ บันทึก achievement สำหรับ Extraction");
        updateUserAchievement(userId, "content", "extraction_coffee", true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userId]);

  return (
    <div>
      <Navbar />
      <BackToTop />
      <div>
        <img
          src="/extraction/extraction.jpg"
          className="w-full h-80 md:h-96 object-cover"
          alt="Coffee Extraction"
        />

        <h1 className="text-center m-3 text-3xl lg:text-4xl font-bold text-[#5c4033]">
          วิธีการสกัดกาแฟ
        </h1>

        <div className="p-4 pt-0 lg:p-8 bg-gray-100">
          {/* Moka Pot Section */}
          <div
            className="flex flex-col lg:flex-row bg-white shadow-lg mb-8 overflow-hidden rounded-3xl"
            data-aos="fade-right"
          >
            {/* Image (Left) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction2.png"
                alt="Moka Pot"
                className="w-1/2 h-auto object-cover rounded-3xl my-6"
              />
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-beige-light flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                โมก้าพอต (MOKA POT)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Moka Pot หรือหม้อต้มกาแฟแบบอิตาเลียน เป็นอุปกรณ์ที่ใช้ในการชงกาแฟโดยอาศัยหลักการของแรงดันไอน้ำที่ดันน้ำร้อนขึ้นผ่านชั้นกาแฟบดละเอียด...
              </p>
            </div>
          </div>

          {/* Drip Coffee Section (Image on Right) */}
          <div
            className="flex flex-col lg:flex-row-reverse bg-white shadow-lg mb-8 rounded-3xl overflow-hidden"
            data-aos="fade-left"
          >
            {/* Image (Right) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction3.jpg"
                alt="Drip Coffee"
                className="w-1/2 h-auto object-cover rounded-3xl my-6"
              />
            </div>
            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-brown-superlight flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                กาแฟดริป (Drip)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                เป็นวิธีการชงกาแฟที่ได้รับความนิยมอย่างมากทั่วโลก โดยเฉพาะในเอเชียตะวันออกและสหรัฐอเมริกา...
              </p>
            </div>
          </div>

          {/* French Press Section (Image on Left) */}
          <div
            className="flex flex-col lg:flex-row bg-white shadow-lg mb-8 overflow-hidden rounded-3xl"
            data-aos="fade-right"
          >
            {/* Image (Left) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction4.jpg"
                alt="French Press"
                className="w-1/2 h-auto object-cover rounded-3xl my-6"
              />
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-beige-light flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                เฟรนช์เพรส (French Press)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                เป็นอุปกรณ์การชงกาแฟที่ไม่ยุ่งยากซับซ้อน โดยใช้วิธีแบบแช่กาแฟให้ชุ่มน้ำ เพื่อสกัดน้ำกาแฟออกมา...
              </p>
            </div>
          </div>

          {/* Espresso Section (Image on Right) */}
          <div
            className="flex flex-col lg:flex-row-reverse bg-white shadow-lg mb-8 rounded-3xl overflow-hidden"
            data-aos="fade-left"
          >
            {/* Image (Right) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction5.jpg"
                alt="Espresso"
                className="w-1/2 h-auto object-cover rounded-3xl my-6"
              />
            </div>
            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-brown-superlight flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                เครื่องเอสเปรสโซ่ (Espresso)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                เครื่องชงกาแฟเอสเปรสโซ่ คืออุปกรณ์ที่สร้างสรรค์รสชาติเข้มข้นของกาแฟให้เราได้ลิ้มลอง...
              </p>
            </div>
          </div>

          {/* Cold drip Section (Image on Left) */}
          <div
            className="flex flex-col lg:flex-row bg-white shadow-lg rounded-3xl mb-8 overflow-hidden"
            data-aos="fade-right"
          >
            {/* Image (Left) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction6.jpg"
                alt="Cold drip"
                className="w-1/2 h-auto object-cover rounded-3xl my-6"
              />
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-beige-light flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                ดริปเย็น (Cold drip)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                ดริปเย็น หรือ Cold drip เป็นวิธีการชงกาแฟชนิดหนึ่งที่ใช้ น้ำเย็นในการสกัดกาแฟ...
              </p>
            </div>
          </div>

          {/* Aeropress Section (Image on Right) */}
          <div
            className="flex flex-col lg:flex-row-reverse bg-white shadow-lg mb-8 rounded-3xl overflow-hidden"
            data-aos="fade-left"
          >
            {/* Image (Right) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction7.jpg"
                alt="Aeropress"
                className="w-1/2 h-auto object-cover rounded-3xl my-6"
              />
            </div>
            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-brown-superlight flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                กาแฟแอโรเพรส (Aeropress)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                แอโรเพรสเป็นอุปกรณ์ชงกาแฟแบบพกพาที่มีขนาดกะทัดรัดและใช้งานง่าย...
              </p>
            </div>
          </div>

          {/* Cold brew Section (Image on Right) */}
          <div
            className="flex flex-col lg:flex-row-reverse bg-white shadow-lg mb-8 rounded-3xl overflow-hidden"
            data-aos="fade-left"
          >
            {/* Image (Right) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction9.jpg"
                alt="Cold brew"
                className="w-1/2 h-auto object-cover rounded-3xl my-6"
              />
            </div>
            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-brown-superlight flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                กาแฟสกัดเย็น (Cold brew)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                การสกัดกาแฟด้วยน้ำเย็นเป็นวิธีการชงกาแฟที่ใช้น้ำเย็นหรือน้ำอุณหภูมิห้องในการสกัด...
              </p>
            </div>
          </div>

          {/* Nitro Cold Brew Section (Image on Left) */}
          <div
            className="flex flex-col lg:flex-row bg-white shadow-lg rounded-3xl mb-8 overflow-hidden"
            data-aos="fade-right"
          >
            {/* Image (Left) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <img
                src="/extraction/extraction10.jpg"
                alt="Nitro Cold Brew"
                className="w-2/3 h-auto object-cover rounded-3xl my-6"
              />
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-beige-light flex justify-center flex-col">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                กาแฟไนโตร (Nitro Cold Brew)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                กาแฟไนโตร คือกาแฟสกัดเย็นที่ผ่านการอัดก๊าซไนโตรเจน ทำให้ได้ฟองละเอียดนุ่มคล้ายครีมเบียร์...
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Extraction;
