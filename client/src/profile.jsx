import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/firebase";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("✅ ผู้ใช้ล็อกอินอยู่:", currentUser);
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));

        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setUser(profileData);
          setAchievements(Object.keys(profileData.achievements || {}));
          localStorage.setItem("profileData", JSON.stringify(profileData));
        }

        const quizCollectionRef = collection(
          db,
          "users",
          currentUser.uid,
          "quiz"
        );
        const quizSnapshot = await getDocs(quizCollectionRef);
        const quizResultsList = quizSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizResults(quizResultsList);
      } else {
        console.log("🔴 ผู้ใช้ยังไม่ได้ล็อกอิน");
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

  return (
    <div className="flex flex-col min-h-screen bg-beige-light">
      <Navbar />

      <main className="flex-grow container mx-auto px-2 py-4">
        <h1 className="text-center text-3xl sm:text-2xl font-bold text-brown mb-4 sm:mb-6">
          โปรไฟล์ของฉัน
        </h1>

        {/* Profile Section */}
        <section className="max-w-md sm:max-w-2xl md:max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          {user ? (
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img
                  src={user.profilePic || "/profile_defualt.jpg"}
                  alt="Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-brown shadow"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-bold text-dark-brown">
                    {user.name}
                  </h2>
                  <p className="text-sm sm:text-md text-dark-brown">
                    {user.email}
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 bg-brown text-beige rounded-full shadow hover:bg-light-brown transition duration-300 text-sm sm:text-base">
                แก้ไขข้อมูล
              </button>
            </div>
          ) : (
            <p className="text-center text-dark-brown">
              โปรดเข้าสู่ระบบเพื่อดูข้อมูล
            </p>
          )}
        </section>

        {/* Achievements Section */}
        <section className="max-w-md sm:max-w-2xl md:max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-dark-brown mb-3 sm:mb-4">
            ความสำเร็จของคุณ
          </h2>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {achievements.map((ach, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 bg-beige rounded-lg shadow transform  transition duration-300"
                >
                  <h3 className="text-md sm:text-lg font-bold text-dark-brown mb-1">
                    {ach}
                  </h3>
                  <p className="text-sm text-dark-brown">✅ สำเร็จแล้ว</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-dark-brown">
              ยังไม่มีความสำเร็จที่บันทึก
            </p>
          )}
        </section>

        {/* Quiz Results Section */}
        <section className="max-w-md sm:max-w-2xl md:max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow rounded-lg p-3 sm:p-4">
          <h2 className="text-lg sm:text-xl font-semibold text-dark-brown mb-3 sm:mb-4">
            ผลการทำแบบทดสอบทั้งหมด
          </h2>
          {quizResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {quizResults.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-3 sm:p-4 border border-brown rounded-lg shadow hover:shadow-md transition duration-300"
                >
                  <p className="text-md sm:text-lg font-bold text-dark-brown">
                    แบบทดสอบ: {quiz.title}
                  </p>
                  <p className="text-sm sm:text-md text-dark-brown">
                    คะแนน: {quiz.score} จาก {quiz.max}
                  </p>
                  <p className="text-sm sm:text-md text-dark-brown">
                    เปอร์เซ็นต์: {((quiz.score / quiz.max) * 100).toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-dark-brown">
              ยังไม่มีผลการทำแบบทดสอบ
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
