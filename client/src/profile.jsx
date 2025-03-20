import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

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
          const data = docSnap.data();
          setProfileData(data);
          localStorage.setItem("profileData", JSON.stringify(data));
        }

        const quizCollectionRef = collection(db, "users", currentUser.uid, "quiz");
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

  // เริ่มต้นค่าแก้ไขโปรไฟล์
  const openEditPopup = () => {
    console.log("Edit button clicked");
    if (profileData) {
      setEditedName(profileData.name || "");
      setEditedEmail(profileData.email || "");
    }
    setIsEditing(true);
  };

  // ฟังก์ชันบันทึกข้อมูลแก้ไขโปรไฟล์ (ตัวอย่าง ใช้ updateDoc)
  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: editedName, email: editedEmail });
      const updatedProfile = { ...profileData, name: editedName, email: editedEmail };
      setProfileData(updatedProfile);
      localStorage.setItem("profileData", JSON.stringify(updatedProfile));
      setIsEditing(false);
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการบันทึกโปรไฟล์:", error);
    }
  };

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
      <main className="flex-grow container mx-auto px-2 py-4">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-brown mb-6">
          โปรไฟล์ของฉัน
        </h1>

        {/* Profile Section */}
        <section className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6 mb-8">
          {user ? (
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={profileData?.profilePic || "/profile_default.jpg"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-brown shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold text-dark-brown">{profileData?.name}</h2>
                  <p className="text-lg text-dark-brown">{profileData?.email}</p>
                </div>
              </div>
              <button 
                onClick={openEditPopup}
                className="mt-4 sm:mt-0 px-4 py-2 bg-brown text-beige rounded-full shadow hover:bg-light-brown transition duration-300 text-sm sm:text-base"
              >
                แก้ไขข้อมูล
              </button>
            </div>
          ) : (
            <p className="text-center text-dark-brown">
              โปรดเข้าสู่ระบบเพื่อดูข้อมูล
            </p>
          )}
        </section>

        {/* Popup Edit Profile */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-80 sm:w-96 shadow-lg">
              <h2 className="text-xl font-bold text-dark-brown mb-4 text-center">
                แก้ไขโปรไฟล์
              </h2>
              <div className="mb-4">
                <label className="block text-dark-brown mb-1">ชื่อ:</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
                />
              </div>
              <div className="mb-4">
                <label className="block text-dark-brown mb-1">อีเมล:</label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-brown text-beige rounded-full shadow hover:bg-light-brown transition duration-300 mr-2"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-dark-brown rounded-full shadow hover:bg-gray-400 transition duration-300"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        <section className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-dark-brown mb-4">ความสำเร็จของคุณ</h2>
          {Object.keys(achievements).length > 0 ? (
            <div className="space-y-6">
              {["content", "simulator", "knowledge"].map((category) => (
                <div key={category} className="p-4 bg-beige rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-dark-brown mb-3 capitalize">
                    {category === "content"
                      ? "บทความ"
                      : category === "simulator"
                      ? "ซิมมูเลเตอร์"
                      : "ความรู้"}
                  </h3>
                  {achievements[category] && Object.keys(achievements[category]).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(achievements[category]).map((key) => (
                        <div
                          key={key}
                          className="p-3 bg-white rounded-lg shadow hover:shadow-md transition transform hover:scale-105"
                        >
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
                <div
                  key={quiz.id}
                  className="p-4 border border-brown rounded-lg shadow hover:shadow-md transition duration-300"
                >
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
