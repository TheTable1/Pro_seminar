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
                โมก้าพอต (Moka Pot)
                เป็นอุปกรณ์ชงกาแฟที่ใช้แรงดันไอน้ำผ่านผงกาแฟบดหยาบถึงปานกลาง
                แบ่งออกเป็น 3 ส่วน: ส่วนล่างใส่น้ำ, ส่วนกลางใส่ผงกาแฟ,
                และส่วนบนเก็บน้ำกาแฟที่สกัดออกมา
                กาแฟที่ได้มีความเข้มข้นใกล้เคียงกับเอสเปรสโซ
                แต่มีกลิ่นและรสชาติที่เป็นเอกลักษณ์
                เหมาะสำหรับผู้ที่ต้องการกาแฟเข้มข้นโดยไม่ต้องใช้เครื่องชงแรงดันสูง
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
                กาแฟดริป (Drip)
                เป็นวิธีชงกาแฟแบบกรองที่ใช้น้ำร้อนรินผ่านผงกาแฟบดกลางถึงละเอียดลงบนกระดาษกรองหรือฟิลเตอร์
                วิธีนี้ช่วยดึงรสชาติและกลิ่นหอมของกาแฟออกมาอย่างช้าๆ
                ทำให้ได้กาแฟที่มีรสชาติสะอาด นุ่มนวล
                และสามารถควบคุมระดับความเข้มข้นได้
                เหมาะสำหรับผู้ที่ชื่นชอบกาแฟที่มีความซับซ้อนของรสชาติและต้องการสัมผัสโน้ตรสชาติของเมล็ดกาแฟแต่ละชนิดอย่างเต็มที่
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
                เฟรนช์เพรส (French Press) เป็นวิธีชงกาแฟแบบแช่ (Immersion
                Brewing) ที่ใช้น้ำร้อนแช่กับผงกาแฟบดหยาบประมาณ 4 นาที
                ก่อนกดลูกสูบที่มีตัวกรองโลหะลงเพื่อแยกกากกาแฟออก
                วิธีนี้ทำให้กาแฟมีเนื้อสัมผัสเข้มข้น
                มีน้ำมันกาแฟและกลิ่นหอมเต็มที่ เนื่องจากไม่มีการใช้กระดาษกรอง
                เหมาะสำหรับผู้ที่ชอบกาแฟที่มีบอดี้หนักและรสชาติเต็มอิ่ม
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
                เครื่องเอสเปรสโซ่ (Espresso Machine)
                เป็นอุปกรณ์ชงกาแฟที่ใช้แรงดันสูง (9 บาร์ขึ้นไป)
                ดันน้ำร้อนผ่านผงกาแฟบดละเอียด ทำให้ได้กาแฟที่เข้มข้น มีกลิ่นหอม
                และมีครีม่า (Crema) บนผิวหน้า กาแฟเอสเปรสโซ่สามารถดื่มแบบเพียว ๆ
                หรือใช้เป็นเบสสำหรับเมนูกาแฟอื่น ๆ เช่น ลาเต้ คาปูชิโน่
                และอเมริกาโน่
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
                ดริปเย็น (Cold Drip) เป็นวิธีการสกัดกาแฟแบบช้า
                โดยใช้น้ำเย็นค่อยๆ หยดผ่านผงกาแฟบดหยาบเป็นเวลาหลายชั่วโมง (ปกติ
                3-12 ชั่วโมง) เพื่อดึงรสชาติและความหวานตามธรรมชาติของกาแฟออกมา
                โดยไม่ต้องใช้ความร้อน กาแฟที่ได้จะมีรสชาตินุ่มนวล กลมกล่อม
                มีความเปรี้ยวต่ำ
                และมักให้รสชาติที่ชัดเจนของโน๊ตผลไม้หรือช็อกโกแลต
                นิยมดื่มแบบเย็นหรือใส่น้ำแข็งเพื่อเพิ่มความสดชื่น
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
                กาแฟแอโรเพรส (Aeropress)
                เป็นวิธีชงกาแฟที่ใช้แรงดันอากาศในการสกัด
                โดยใส่ผงกาแฟบดและน้ำร้อนลงในกระบอก
                จากนั้นใช้แรงกดดันลูกสูบเพื่อดันน้ำกาแฟผ่านตัวกรอง
                กาแฟที่ได้มีรสชาติเข้มข้น นุ่มนวล และมีบอดี้ที่สมดุล
                จุดเด่นของแอโรเพรสคือสามารถปรับเปลี่ยนสูตรการชงได้หลากหลาย
                ทั้งความเข้มข้น เวลาแช่ และอุณหภูมิ
                ทำให้เป็นที่นิยมในหมู่คอกาแฟที่ชื่นชอบการทดลองรสชาติใหม่ๆ
              </p>
            </div>
          </div>

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
                กาแฟไซฟอน (Siphon)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                กาแฟไซฟอน (Siphon)
                เป็นวิธีการชงกาแฟแบบสูญญากาศที่ใช้หลักการแรงดันไอน้ำและสุญญากาศในการสกัดกาแฟ
                ประกอบด้วยภาชนะสองส่วนคือ ส่วนล่างสำหรับใส่น้ำและให้ความร้อน
                และส่วนบนสำหรับใส่ผงกาแฟบด เมื่อน้ำร้อนเกิดแรงดัน
                ไอน้ำจะดันน้ำขึ้นไปผสมกับผงกาแฟด้านบน หลังจากนั้นเมื่อลดความร้อน
                น้ำกาแฟจะถูกดูดกลับลงมาผ่านตัวกรอง กาแฟไซฟอนให้รสชาติที่สะอาด
                ซับซ้อน และมีความหอมชัดเจน
                นิยมใช้สำหรับการชงกาแฟพิเศษที่ต้องการดึงรสชาติออกมาอย่างละเอียดอ่อน
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
                กาแฟสกัดเย็น (Cold Brew)
                เป็นวิธีการชงกาแฟที่ใช้เวลาและอุณหภูมิต่ำ
                โดยนำผงกาแฟบดแช่ในน้ำเย็นหรือน้ำที่อุณหภูมิห้องนาน 12-24 ชั่วโมง
                จากนั้นกรองเอากากกาแฟออก กาแฟที่ได้จะมีรสชาติที่นุ่มนวล
                หวานธรรมชาติ และมีความเป็นกรดต่ำกว่าการชงด้วยน้ำร้อน
                สามารถดื่มได้ทั้งแบบเพียว ๆ หรือเติมนมและไซรัปเพื่อเพิ่มรสชาติ
                นอกจากนี้ยังสามารถเก็บในตู้เย็นได้นานหลายวันโดยไม่เสียรสชาติ
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
                กาแฟไนโตร (Nitro Cold Brew) เป็นกาแฟสกัดเย็น (Cold Brew)
                ที่ผ่านการอัดก๊าซไนโตรเจนเพื่อเพิ่มเนื้อสัมผัสและความนุ่มนวล
                กาแฟที่ได้จะมีฟองครีมนุ่มละเอียดคล้ายเบียร์สด รสชาตินุ่มนวล
                หวานธรรมชาติ และมีความเป็นกรดต่ำ
                มักเสิร์ฟแบบไม่ใส่น้ำแข็งในแก้วทรงสูงเพื่อให้เห็นเลเยอร์ของฟองครีมด้านบน
                นิยมดื่มแบบเพียว ๆ เพื่อสัมผัสเนื้อสัมผัสที่เป็นเอกลักษณ์
              </p>
            </div>
          </div>

          <h6 className="mt-12 text-sm">
            ที่มา :{" "}
            <a href="https://www.koffeemart.com/article/12/วิธีการชงกาแฟ-9-แบบ-ที่เราควรรู้">
              https://www.koffeemart.com/article/12/วิธีการชงกาแฟ-9-แบบ-ที่เราควรรู้
            </a>
          </h6>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Extraction;
