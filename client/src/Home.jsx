import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./navbar";
import { Link, useNavigate, useRevalidator } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Footer from "./footer";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    AOS.init({
      duration: 1000, // ระยะเวลาในการแสดงผลของอนิเมชั่น (1 วินาที)
      once: false, // ทำให้อนิเมชั่นเกิดขึ้นหลายครั้ง
      easing: "ease-in-out", // ใช้การเปลี่ยนแปลงที่ราบรื่น
      offset: 100, // กำหนดจุดเริ่มต้นของการเลื่อน
    });

    // ✅ ดึงข้อมูลผู้ใช้จาก Firebase Auth
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log("🔴 ผู้ใช้ยังไม่ได้ล็อกอิน");
      navigate("/login"); // ถ้ายังไม่ได้ล็อกอินให้กลับไปหน้า Login
    } else {
      console.log("✅ ข้อมูลผู้ใช้จาก Firebase:", currentUser);
      setUser(currentUser);
    }
  }, [navigate]);

  const cardData = [
    { title: "ประวัติกาแฟ", path: "/history" },
    { title: "สายพันธุ์กาแฟ", path: "/geneCoffee" },
    { title: "การคั่วกาแฟ", path: "/roasting" },
    { title: "การสกัดกาแฟ", path: "/extraction" },
    { title: "การผลิตกาแฟ", path: "/process" },
  ];

  const coffeeClick = () => {
    navigate("/coffee_bean");
    window.scrollTo({ top: 0, behavior: "smooth" }); // เลื่อนหน้าไปด้านบนอย่างนุ่มนวล
  };

  const handleClick = () => {
    navigate("/coffee_menu");
    window.scrollTo({ top: 0, behavior: "smooth" }); // เลื่อนหน้าไปด้านบนอย่างนุ่มนวล
  };

  // console.log(userId);  

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
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 justify-start lg:justify-center">
          {cardData.map((card, index) => (
            <Link
              key={index}
              to={card.path}
              className="min-w-[200px] sm:w-32 md:w-40 lg:w-48 flex-shrink-0 snap-center text-center 
  transform transition-all duration-300 ease-in-out 
  hover:scale-110 hover:translate-y-[-10px] hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Rest of the code remains the same */}

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
        <button
          className="bg-[#8b4513] text-white px-4 py-2 rounded-md mt-4"
          onClick={coffeeClick}
        >
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
          <button
            className="bg-[#8b4513] text-white px-4 py-2 rounded-md mt-4"
            onClick={handleClick}
          >
            ค้นหาเมนู
          </button>
        </div>
      </section>

      {/* Quiz Section */}
      <section
        className="py-8 pb-16 px-4 md:px-16 lg:px-32 text-center bg-[#ffffff]"
        data-aos="fade-up"
      >
        <h2 className="text-xl font-bold">
          มาดูกันว่าคุณเป็นคอกาแฟระดับไหนกัน!
        </h2>
        <button className="bg-[#8b4513] text-white px-4 py-2 rounded-md mt-4">
          มาทำแบบทดสอบกันเถอะ!!
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
