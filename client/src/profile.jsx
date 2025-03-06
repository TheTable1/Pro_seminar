import { useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: "/profile_default.jpg",
  });

  const achievements = [
    { title: "เรียนรู้เนื้อหา", progress: 80, status: "กำลังดำเนินการ" },
    { title: "ซิมูเลเตอร์", progress: 100, status: "สำเร็จแล้ว" },
    { title: "แบบทดสอบ", progress: 50, status: "เริ่มต้น" },
  ];

  return (
    <div className="bg-[#f3f1ec] min-h-screen">
      {/* Navbar */}
      <header className="bg-dark-brown text-white py-4 px-5 flex justify-between items-center">
        <h1 className="text-xl font-bold">Coffee Bean Fusion</h1>
        <div className="flex items-center">
          <span className="mr-3">{user.name}</span>
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        </div>
      </header>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
        <div className="flex items-center space-x-6">
          <img
            src={user.profilePic}
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
      </div>

      {/* Achievements Section */}
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">ความสำเร็จของคุณ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((ach, index) => (
            <div key={index} className="p-4 bg-[#f9f7f3] shadow rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">{ach.title}</h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="bg-[#8b4513] h-3 rounded-full"
                  style={{ width: `${ach.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{ach.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-700 mt-8">
        © 2025 Coffee Bean Fusion
      </footer>
    </div>
  );
};

export default Profile;
