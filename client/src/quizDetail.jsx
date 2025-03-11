import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/firebase";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [quizResults, setQuizResults] = useState([]); // สำหรับผลการทำแบบทดสอบทั้งหมด
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    // โหลดข้อมูลจาก localStorage ก่อนใช้ Firebase
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("✅ ผู้ใช้ล็อกอินอยู่:", currentUser);
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));

        // ดึงข้อมูลโปรไฟล์จาก Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setUser(profileData);
          setAchievements(Object.keys(profileData.achievements || {}));
          localStorage.setItem("profileData", JSON.stringify(profileData));
        }

        // ดึงข้อมูลผลการทำแบบทดสอบทั้งหมดจาก subcollection "quiz"
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
      <div className="text-center mt-10 text-dark-brown text-2xl">
        ⏳ กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-beige-light to-beige">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-center text-4xl font-extrabold text-dark-brown mb-8">
          โปรไฟล์ของฉัน
        </h1>

        {/* Profile Section */}
        <div className="max-w-3xl mx-auto bg-brown-superlight shadow-2xl rounded-2xl p-8">
          {user ? (
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src={user.profilePic || "/profile_defualt.jpg"}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-brown shadow-lg"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold text-dark-brown">
                  {user.name}
                </h2>
                <p className="text-lg text-dark-brown">{user.email}</p>
                <button className="mt-4 px-6 py-2 bg-brown text-beige rounded-full shadow hover:bg-light-brown transition duration-300">
                  แก้ไขข้อมูล
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-dark-brown">
              โปรดเข้าสู่ระบบเพื่อดูข้อมูล
            </p>
          )}
        </div>

        {/* Achievements Section */}
        <div className="max-w-3xl mx-auto mt-10 bg-brown-superlight shadow-2xl rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-dark-brown mb-6">
            ความสำเร็จของคุณ
          </h2>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((ach, index) => (
                <div
                  key={index}
                  className="p-6 bg-beige shadow-lg rounded-2xl transform hover:scale-105 transition duration-300"
                >
                  <h3 className="text-xl font-bold text-dark-brown mb-2">
                    {ach}
                  </h3>
                  <p className="text-md text-dark-brown">✅ สำเร็จแล้ว</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-dark-brown">
              ยังไม่มีความสำเร็จที่บันทึก
            </p>
          )}
        </div>

        {/* Quiz Results Section */}
        <div className="max-w-3xl mx-auto mt-10 bg-brown-superlight shadow-2xl rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-dark-brown mb-6">
            ผลการทำแบบทดสอบทั้งหมด
          </h2>
          {quizResults.length > 0 ? (
            <div className="space-y-4">
              {quizResults.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-6 border border-brown rounded-2xl shadow hover:shadow-xl transition duration-300"
                >
                  <p className="text-xl font-bold text-dark-brown">
                    แบบทดสอบ: {quiz.title}
                  </p>
                  <p className="text-lg text-dark-brown">
                    คะแนน: {quiz.score} จาก {quiz.max}
                  </p>
                  <p className="text-lg text-dark-brown">
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
