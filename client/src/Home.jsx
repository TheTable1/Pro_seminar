import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./navbar";
import { Link } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // ระยะเวลาในการแสดงผลของอนิเมชั่น (1 วินาที)
      once: false, // ทำให้อนิเมชั่นเกิดขึ้นหลายครั้ง
      easing: "ease-in-out", // ใช้การเปลี่ยนแปลงที่ราบรื่น
      offset: 100, // กำหนดจุดเริ่มต้นของการเลื่อน
    });
  }, []);

  const cardData = [
    { title: "ประวัติกาแฟ", path: "/history" },
    { title: "สายพันธุ์กาแฟ", path: "/geneCoffee" },
    { title: "การคั่วกาแฟ", path: "/roasting" },
    { title: "การสกัดกาแฟ", path: "/extraction" },
    { title: "การผลิตกาแฟ", path: "/process" },
  ];

  return (
    <div className="bg-[#f3f1ec]">
      <Navbar />

      {/* Header Section */}
      <header
        className="bg-cover bg-center h-64 flex items-center justify-center text-center text-white"
        style={{ backgroundImage: "url('/home1.jpg')" }}
        data-aos="fade-up"
      >
        <div className="bg-black bg-opacity-50 p-4 rounded-md">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
            ยินดีต้อนรับเข้าสู่โลกของคนรักกาแฟ
          </h1>
          <p className="text-sm md:text-base">Welcome Coffee Lover</p>
        </div>
      </header>

      {/* Knowledge Section */}
      <section className="py-8 px-4 md:px-16 lg:px-32" data-aos="fade-up">
        <h2 className="text-xl font-bold text-center mb-6">
          คลังความรู้ของกาแฟ
        </h2>
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 justify-start">
          {cardData.map((card, index) => (
            <Link
              key={index}
              to={card.path}
              className="min-w-[200px] sm:w-32 md:w-40 lg:w-48 flex-shrink-0 snap-center text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100} // ทำให้การแสดงผลของแต่ละการ์ดมีความหน่วงเวลา
            >
              <img
                src={`/home${index + 2}.jpg`}
                alt={card.title}
                className="rounded-md shadow-md"
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <p className="mt-2 text-sm">{card.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Coffee Info Section */}
      <section
        className="py-8 px-4 md:px-16 lg:px-32 lg:py-10 text-center bg-[#ffffff]"
        data-aos="fade-up"
      >
        <img src="/coffee.png" className="w-24 mx-auto" data-aos="zoom-in" />
        <h2 className="text-xl font-bold mt-4">กาแฟ</h2>
        <p className="text-base mt-2 mb-4 lg:px-72">
          กาแฟมีหลายประเภทที่นิยมบริโภค เช่น กาแฟซอง และ กาแฟสำเร็จรูป
          ซึ่งเน้นความสะดวกและรวดเร็วในการชง กาแฟแคปซูล
          ที่ช่วยให้ได้รสชาติใกล้เคียงกับกาแฟสดโดยง่าย, และ กาแฟสด
          ที่เน้นคุณภาพและกลิ่นรสจากการบดเมล็ดกาแฟสดใหม่
          การเลือกใช้ขึ้นอยู่กับความสะดวกและ ความชอบในรสชาติของแต่ละคน
        </p>
        <button className="bg-[#8b4513] text-white px-4 py-2 rounded-md">
          เพิ่มเติม
        </button>
      </section>

      {/* Menu Section */}
      <section
        className="py-8 px-4 md:px-16 lg:px-32 flex flex-col lg:flex-row items-center gap-8"
        data-aos="fade-up"
      >
        <img
          src="/menucoffee.png"
          alt="Coffee Menu"
          className="w-52 lg:w-80 rounded-md shadow-md"
        />
        <div className="lg:w-1/2 text-center mx-auto">
          <h2 className="text-xl font-bold">เมนูกาแฟ</h2>
          <p className="text-sm mt-2 text-base">
            สัมผัสรสชาติอันหลากหลายของกาแฟที่รอให้คุณลิ้มลอง!
            ไม่ว่าคุณจะชอบกาแฟร้อนอุ่นละมุนที่ช่วยให้เริ่มต้นวันอย่างสดใส
            หรือกาแฟเย็นสุดสดชื่นที่จะเติมพลังในวันอากาศร้อน
            ถ้าต้องการความชื่นใจแบบเต็ม ๆ ลองกาแฟปั่นเย็นจัด
            หรือถ้าชอบรสนุ่มนวลที่มีนมเป็นส่วนประกอบ
            เราก็มีตัวเลือกที่ตอบโจทย์ความต้องการ
            และสำหรับผู้ที่อยากสัมผัสความสดชื่นใหม่ ๆ
            กาแฟที่ผสานผลไม้จะช่วยเพิ่มความพิเศษในทุกจิบ!
          </p>
          <button className="bg-[#8b4513] text-white px-4 py-2 rounded-md mt-4">
            ค้นหาเมนู
          </button>
        </div>
      </section>

      {/* Quiz Section */}
      <section
        className="py-8 px-4 md:px-16 lg:px-32 text-center"
        data-aos="fade-up"
      >
        <h2 className="text-xl font-bold">
          คุณกำลังมองหาชนิดของกาแฟที่เหมาะกับคุณอยู่หรือไม่?
        </h2>
        <button className="bg-[#8b4513] text-white px-4 py-2 rounded-md mt-4">
          มาทำแบบทดสอบ
        </button>
      </section>

      {/* Footer */}
      <footer
        className="bg-[#3e2c23] text-white py-6 px-4 text-center"
        data-aos="fade-up"
      >
        <p className="font-semibold text-lg">Coffee Bean Fusion</p>
        <p>Social Contacts: coffee.bean.fusion@gmail.com | 001-234-5678</p>
        <p>© Copyright BdevIncodes. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
