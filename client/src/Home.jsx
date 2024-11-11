import React from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";

const Home = () => {
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
      <header
        className="bg-cover bg-center h-64 flex items-center justify-center text-center text-white"
        style={{ backgroundImage: "url('/home1.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-4 rounded-md">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
            ยินดีต้อนรับเข้าสู่โลกของคนรักกาแฟ
          </h1>
          <p className="text-sm md:text-base">Welcome Coffee Lover</p>
        </div>
      </header>

      <section className="py-8 px-4 md:px-16 lg:px-32">
        <h2 className="text-xl font-bold text-center mb-6">
          คลังความรู้ของกาแฟ
        </h2>
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 justify-center">
          {cardData.map((card, index) => (
            <Link
              key={index}
              to={card.path}
              className="w-64 sm:w-32 md:w-40 lg:w-48 flex-shrink-0 snap-center text-center"
            >
              <img
                src={`/home${index + 2}.jpg`}
                alt={card.title}
                style={{ width: "400px", height: "150px", objectFit: "cover" }}
                className="rounded-md shadow-md"
              />
              <p className="mt-2 text-sm">{card.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Coffee Info Section */}
      <section className="py-8 px-4 md:px-16 lg:px-32 lg:py-10 text-center bg-[#ffffff]">
        <img src="/coffee.png" className="w-24 mx-auto" /> <br /> <br />
        <h2 className="text-xl font-bold">กาแฟ</h2>
        <p className="flex text-base mt-2 mb-4 lg:px-72 justify-center">
          กาแฟมีหลายประเภทที่นิยมบริโภค เช่น กาแฟซอง และ กาแฟสำเร็จรูป
          ซึ่งเน้นความสะดวกและรวดเร็วในการชง กาแฟแคปซูล
          ที่ช่วยให้ได้รสชาติใกล้เคียงกับกาแฟสดโดยง่าย, และ กาแฟสด
          ที่เน้นคุณภาพและกลิ่นรสจากการบดเมล็ดกาแฟสดใหม่
          การเลือกใช้ขึ้นอยู่กับความสะดวกและ ความชอบในรสชาติของแต่ละคน
        </p>
        <br />
        <button className="bg-[#8b4513] text-white px-4 py-2 rounded-md">
          เพิ่มเติม
        </button>
      </section>

      {/* Menu Section */}
      <section className="py-8 px-4 md:px-16 lg:px-32 flex flex-col lg:flex-row items-center gap-8">
        <img
          src="/path/to/menu-image.jpg"
          alt="Coffee Menu"
          className="w-full lg:w-1/2 rounded-md shadow-md"
        />
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-xl font-bold">เมนูกาแฟ</h2>
          <p className="text-sm mt-2">
            ลิ้มรสและประสบการณ์หลากหลายของกาแฟในเมนูนี้
          </p>
          <button className="bg-[#8b4513] text-white px-4 py-2 rounded-md mt-4">
            ค้นหาเมนู
          </button>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-8 px-4 md:px-16 lg:px-32 text-center">
        <h2 className="text-xl font-bold">
          คุณกำลังมองหาชนิดของกาแฟที่เหมาะกับคุณอยู่หรือไม่?
        </h2>
        <button className="bg-[#8b4513] text-white px-4 py-2 rounded-md mt-4">
          มาทำแบบทดสอบ
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#3e2c23] text-white py-6 px-4 text-center">
        <p className="font-semibold text-lg">Coffee Bean Fusion</p>
        <p>Social Contacts: coffee.bean.fusion@gmail.com | 001-234-5678</p>
        <p>© Copyright BdevIncodes. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
