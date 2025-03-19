import { Link, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { auth } from "./firebase/firebase";

const quizzes = [
  {
    id: 1,
    title: "แบบทดสอบความรู้ทั่วไป",
    description: "ทดสอบความรู้ทั่วไปของคุณ",
  },
  {
    id: 2,
    title: "เทคนิคและกระบวนการชงกาแฟ",
    description: "ทดสอบความรู้ทางเทคนิคและกระบวนการชงกาแฟ",
  },
];

const Quiz = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-dark-brown">
          รายการแบบทดสอบ
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              to={`/quiz/${quiz.id}`}
              onClick={(e) => {
                // ตรวจสอบว่าผู้ใช้งานได้เข้าสู่ระบบหรือยัง
                if (!auth.currentUser) {
                  // หากยังไม่เข้าสู่ระบบ ให้หยุดการนำทางและเปลี่ยนไปที่ /login
                  e.preventDefault();
                  navigate("/login");
                }
              }}
              className="block p-6 border rounded-lg hover:bg-light-brown hover:text-beige transition duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
              <p>{quiz.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;
