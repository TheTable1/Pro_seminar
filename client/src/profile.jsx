import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/firebase";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // ตรวจสอบสถานะล็อกอิน และดึงข้อมูลผู้ใช้จาก Firestore
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          localStorage.setItem("profileData", JSON.stringify(data));
        }
        // ดึงข้อมูลแบบทดสอบ
        const quizCollectionRef = collection(db, "users", currentUser.uid, "quiz");
        const quizSnapshot = await getDocs(quizCollectionRef);
        const quizResultsList = quizSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizResults(quizResultsList);
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("profileData");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-8 text-brown text-lg">
        ⏳ กำลังโหลดข้อมูล...
      </div>
    );
  }

  // สมมุติว่า profileData.achievements มีโครงสร้างเป็น:
  // {
  //   content: { history_coffee: true, extraction_coffee: true, ... },
  //   simulator: { espresso: true, latte: true, ... },
  //   knowledge: { coffee_quiz: true, ... }
  // }
  const achievements = profileData && profileData.achievements ? profileData.achievements : {};

  return (
    <div className="flex flex-col min-h-screen bg-beige-light">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-brown mb-6">
          โปรไฟล์ของฉัน
        </h1>

        {/* Profile Section */}
        <section className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6 mb-8">
          {user ? (
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={user.profilePic || "/profile_default.jpg"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-brown shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold text-dark-brown">{user.name}</h2>
                  <p className="text-lg text-dark-brown">{user.email}</p>
                </div>
              </div>
              <button className="mt-4 sm:mt-0 px-4 py-2 bg-brown text-beige rounded-full shadow hover:bg-light-brown transition duration-300">
                แก้ไขข้อมูล
              </button>
            </div>
          ) : (
            <p className="text-center text-dark-brown">โปรดเข้าสู่ระบบเพื่อดูข้อมูล</p>
          )}
        </section>

        {/* Achievements Section */}
        <section className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-dark-brown mb-4">ความสำเร็จของคุณ</h2>
          {Object.keys(achievements).length > 0 ? (
            <div className="space-y-6">
              {["content", "simulator", "knowledge"].map((category) => (
                <div key={category} className="p-4 bg-beige rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-dark-brown mb-3 capitalize">
                    {category === "content"
                      ? "คลังความรู้"
                      : category === "simulator"
                      ? "ซิมมูเลเตอร์"
                      : "บทความ"}
                  </h3>
                  {achievements[category] && Object.keys(achievements[category]).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(achievements[category]).map((key) => (
                        <div key={key} className="p-3 bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105">
                          <h4 className="text-lg font-bold text-dark-brown">{key}</h4>
                          <p className="text-sm text-dark-brown">✅ สำเร็จแล้ว</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-dark-brown">ยังไม่มีความสำเร็จในหมวดนี้</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-dark-brown">ยังไม่มีความสำเร็จที่บันทึก</p>
          )}
        </section>

        {/* Quiz Results Section */}
        <section className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-dark-brown mb-4">ผลการทำแบบทดสอบทั้งหมด</h2>
          {quizResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizResults.map((quiz) => (
                <div key={quiz.id} className="p-4 border border-brown rounded-lg shadow hover:shadow-md transition duration-300">
                  <p className="text-xl font-bold text-dark-brown">แบบทดสอบ: {quiz.title}</p>
                  <p className="text-lg text-dark-brown">คะแนน: {quiz.score} จาก {quiz.max}</p>
                  <p className="text-lg text-dark-brown">
                    เปอร์เซ็นต์: {((quiz.score / quiz.max) * 100).toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-dark-brown">ยังไม่มีผลการทำแบบทดสอบ</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
