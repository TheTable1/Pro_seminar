import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase/firebase";
import articles from "./article.json"; // ดึงข้อมูลบทความทั้งหมดจากไฟล์ JSON

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

        // ดึงข้อมูลโปรไฟล์ผู้ใช้
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          localStorage.setItem("profileData", JSON.stringify(data));
        }

        // ดึงผลแบบทดสอบ
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

  // ฟังก์ชันเปิด popup แก้ไขโปรไฟล์
  const openEditPopup = () => {
    console.log("Edit button clicked");
    if (profileData) {
      setEditedName(profileData.name || "");
      setEditedEmail(profileData.email || "");
    }
    setIsEditing(true);
  };

  // ฟังก์ชันบันทึกข้อมูลแก้ไขโปรไฟล์ (ใช้ updateDoc)
  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: editedName, email: editedEmail });
      const updatedProfile = {
        ...profileData,
        name: editedName,
        email: editedEmail,
      };
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

  // ถ้าไม่มีข้อมูล achievements ให้ตั้งเป็น {} เพื่อป้องกัน error
  const achievements =
    profileData && profileData.achievements ? profileData.achievements : {};

  // คำนวณคะแนนรวมจากแบบทดสอบ (quiz)
  const totalQuizScore = quizResults.reduce((acc, quiz) => acc + quiz.score, 0);
  // คำนวณคะแนนจากความสำเร็จ (นับจำนวน achievement ในแต่ละหมวด)
  const totalAchievementScore =
    (achievements.content ? Object.keys(achievements.content).length : 0) +
    (achievements.simulator ? Object.keys(achievements.simulator).length : 0) +
    (achievements.knowledge ? Object.keys(achievements.knowledge).length : 0);
  // รวมคะแนนทั้งหมด
  const overallScore = totalQuizScore + totalAchievementScore;

  return (
    <div className="flex flex-col min-h-screen bg-beige-light">
      <Navbar />
      <main className="flex-grow container mx-auto px-2 py-4">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-dark-brown mb-6">
          โปรไฟล์ของฉัน
        </h1>

        {/* Profile Section */}
        <section className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6 mb-8">
          {user ? (
            <div>
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={profileData?.profilePic || "/profile_default.jpg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-2 border-brown shadow-lg"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-dark-brown">
                      {profileData?.name}
                    </h2>
                    <p className="text-lg text-dark-brown">
                      {profileData?.email}
                    </p>
                    {/* แสดงคะแนนรวมไว้ใต้ชื่ออีเมล */}
                  </div>
                </div>
                <button
                  onClick={openEditPopup}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-light-brown text-beige rounded-full shadow hover:bg-brown transition duration-300 text-sm sm:text-base"
                >
                  แก้ไขข้อมูล
                </button>
              </div>
              <div className="mt-4 p-3 bg-brown rounded-lg shadow-xl">
                <p className="text-xl font-extrabold text-beige text-center">
                  คะแนนรวม: {overallScore}
                </p>
              </div>
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

        {/* Quiz Results Section */}
        <section className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6 mb-3">
          <h2 className="text-2xl font-semibold text-dark-brown mb-4">
            ผลการทำแบบทดสอบทั้งหมด
          </h2>
          {quizResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizResults.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-4 border border-brown rounded-lg shadow hover:shadow-md transition duration-300"
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
        </section>

        {/* Achievements Section */}
        <section className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-dark-brown mb-4">
            ความสำเร็จของคุณ
          </h2>
          <div className="space-y-6">
            {["content", "simulator", "knowledge"].map((category) => {
              let title, total, completed, percentage;
              if (category === "content") {
                title = "บทความ";
                total = 5; // จำนวนบทความเต็มคือ 5
                completed = achievements.content
                  ? Math.min(Object.keys(achievements.content).length, 5)
                  : 0;
                percentage = (completed / total) * 100;
              } else if (category === "simulator") {
                title = "ซิมมูเลเตอร์";
                total = 1; // จำนวนเต็มคือ 1
                completed =
                  achievements.simulator &&
                  Object.keys(achievements.simulator).length > 0
                    ? 1
                    : 0;
                percentage = (completed / total) * 100;
              } else if (category === "knowledge") {
                title = "ความรู้";
                total = articles.length; // จำนวนความรู้จากไฟล์ article.json
                completed = achievements.knowledge
                  ? Object.keys(achievements.knowledge).length
                  : 0;
                percentage = total > 0 ? (completed / total) * 100 : 0;
              }
              return (
                <div
                  key={category}
                  className="p-4 bg-light-brown2 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-bold text-dark-brown mb-3 capitalize">
                    {title}
                  </h3>
                  <p className="text-sm text-dark-brown mb-2">
                    {category === "knowledge"
                      ? `ทำความรู้สำเร็จ: ${completed} / ${total}`
                      : category === "content"
                      ? `ทำบทความสำเร็จ: ${completed} / ${total}`
                      : `ทำซิมมูเลเตอร์สำเร็จ: ${completed} / ${total}`}
                  </p>
                  <div className="w-full bg-gray-300 rounded-full h-4">
                    <div
                      className="bg-brown h-4 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-dark-brown mt-1">
                    {percentage.toFixed(2)}%
                  </p>

                  {/* Render รายการ achievement */}
                  {achievements[category] &&
                  Object.keys(achievements[category]).length > 0 ? (
                    category === "content" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {Object.keys(achievements[category]).map((key) => {
                          // mapping สำหรับ key ที่ต้องการเปลี่ยนข้อความและใส่ไอคอนพร้อมลิงก์
                          const mapping = {
                            history_coffee: {
                              label: "ประวิติกาแฟ",
                              icon: "nav/icons8-history-80.png",
                              link: "/history",
                            },
                            gene_coffee: {
                              label: "สายพันธุ์กาแฟ",
                              icon: "nav/icons8-coffee-beans-48 (2).png",
                              link: "/geneCoffee",
                            },
                            roasting_coffee: {
                              label: "ระดับการคั่วกาแฟ",
                              icon: "nav/icons8-coffee-bag-50.png",
                              link: "/roasting",
                            },
                            extraction_coffee: {
                              label: "เทคนิคการสกัดกาแฟ",
                              icon: "nav/icons8-vietnamese-coffee-50.png",
                              link: "/extraction",
                            },
                            process_coffee: {
                              label: "กระบวนการผลิตกาแฟ",
                              icon: "nav/icons8-coffee-cup-50.png",
                              link: "/process",
                            },
                          }[key];
                          if (mapping) {
                            return (
                              <div
                                key={key}
                                className="p-3 bg-white/65 rounded-lg shadow hover:shadow-md transition transform"
                              >
                                <Link
                                  to={mapping.link}
                                  className="flex items-center"
                                >
                                  <img
                                    src={mapping.icon}
                                    alt={`${mapping.label} icon`}
                                    className="w-6 h-6 mr-2"
                                  />
                                  <h4 className="text-md font-bold text-dark-brown">
                                    {mapping.label}
                                  </h4>
                                </Link>
                              </div>
                            );
                          } else {
                            // กรณีที่ key ไม่ตรงกับ mapping ที่กำหนดไว้
                            return (
                              <div
                                key={key}
                                className="p-3 bg-white/65 rounded-lg shadow hover:shadow-md transition transform"
                              >
                                <h4 className="text-lg font-bold text-dark-brown">
                                  {key}
                                </h4>
                              </div>
                            );
                          }
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {Object.keys(achievements[category]).map((key) => (
                          <div
                            key={key}
                            className="p-3 bg-white/65 rounded-lg shadow hover:shadow-md transition transform"
                          >
                            <h4 className="text-lg font-bold text-dark-brown">
                              {key}
                            </h4>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-dark-brown mt-4">
                      ยังไม่มีความสำเร็จในหมวดนี้
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
