import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ เพิ่ม state โหลดข้อมูล

  useEffect(() => {
    const auth = getAuth();
    
    // ✅ โหลดข้อมูลจาก localStorage ก่อนใช้ Firebase
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    // ✅ ดึงข้อมูลผู้ใช้จาก Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("✅ ผู้ใช้ล็อกอินอยู่:", currentUser);
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser)); // ✅ เก็บลง localStorage

        // ✅ โหลดข้อมูลจาก Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          setAchievements(Object.keys(docSnap.data().achievements || {}));
          localStorage.setItem("profileData", JSON.stringify(docSnap.data())); // ✅ เก็บลง localStorage
        }
      } else {
        console.log("🔴 ผู้ใช้ยังไม่ได้ล็อกอิน");
        setUser(null);
        localStorage.removeItem("user"); // ✅ ล้างข้อมูลเมื่อออกจากระบบ
        localStorage.removeItem("profileData");
      }
      setLoading(false); // ✅ ปิดโหลดข้อมูล
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">⏳ กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f1ec]">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          {user ? (
            <div className="flex items-center space-x-6">
              <img
                src={user.profilePic || "/profile_defualt.jpg"}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-gray-300"
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <button className="mt-2 px-4 py-2 bg-brown text-white rounded-md">
                  แก้ไขข้อมูล
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">โปรดเข้าสู่ระบบเพื่อดูข้อมูล</p>
          )}
        </div>

        {/* Achievements Section */}
        <div className="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ความสำเร็จของคุณ</h2>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((ach, index) => (
                <div key={index} className="p-4 bg-[#f9f7f3] shadow rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700">{ach}</h3>
                  <p className="text-sm text-gray-600 mt-1">✅ สำเร็จแล้ว</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">ยังไม่มีความสำเร็จที่บันทึก</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
