import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebase/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [showKnowledgeMenu, setShowKnowledgeMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const menuRef = useRef(null);
  const knowledgeMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const navbarRef = useRef(null);
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    function handleClickOutside(event) {
      // ถ้าคลิกนอก navbar ให้ปิดเมนู
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      document.body.style.overflowY = "scroll"; // ทำให้ Scroll Bar อยู่ตลอดเวลา
      document.body.style.width = "100vw"; // ป้องกันการเปลี่ยนขนาดเมื่อมี Scroll Bar
    };
  
    handleResize(); // เรียกใช้ครั้งแรกเมื่อ Component ถูกโหลด
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // ✅ ตรวจสอบสถานะการล็อกอินของผู้ใช้
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  
  // ✅ ฟังก์ชัน Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowProfileMenu(false);
  };

  return (
    <div>
      <header className="bg-dark-brown py-4 px-5 flex justify-between items-center relative" style={{ paddingRight: `${scrollbarWidth}px` }}>
        <div className="font-bold text-beige text-[5vw] md:text-[1rem] lg:text-[2rem]">
          <Link to="/"> Coffee Bean Fusion </Link>
        </div>
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          <ul className="flex space-x-6 text-beige my-auto">
            {/* คลังความรู้กาแฟ */}
            <li className="relative group" ref={knowledgeMenuRef}>
              <span
                className="cursor-pointer hover:text-light-brown transition duration-300"
                onClick={() => setShowKnowledgeMenu((prev) => !prev)}
              >
                คลังความรู้กาแฟ
              </span>
              {showKnowledgeMenu && (
                <ul className="absolute left-0 z-10 bg-brown shadow-lg mt-2 rounded-md w-48 text-beige text-sm transition duration-300">
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    <Link to="/history">ประวัติศาสตร์กาแฟ</Link>
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    <Link to="/geneCoffee">สายพันธุ์กาแฟ</Link>
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    <Link to="/roasting">ระดับของการคั่วกาแฟ</Link>
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    <Link to="/extraction">เทคนิคการสกัดกาแฟ</Link>
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    <Link to="/process">กระบวนการผลิตกาแฟ</Link>
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    <Link to="/worldCoffee">แผนที่แหล่งผลิตกาแฟโลก</Link>
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    <Link to="/articles">บทความน่ารู้</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* เมล็ดกาแฟ */}
            <li className="cursor-pointer hover:text-light-brown transition duration-300">
              <Link to="/coffee_bean">เมล็ดกาแฟ</Link>
            </li>

            {/* เมนูกาแฟ */}
            <li className="cursor-pointer hover:text-light-brown transition duration-300">
              <Link to="/coffee_menu">เมนูกาแฟ</Link>
            </li>

            {/* ทดสอบความรู้ */}
            <li className="cursor-pointer hover:text-light-brown transition duration-300">
              แบบทดสอบ
            </li>

            {/* 🔹 เมนูโปรไฟล์ */}
            <li className="relative group" ref={profileMenuRef}>
              <img
                src={user?.photoURL || "/profile_defualt.jpg"} // ✅ ใช้รูปโปรไฟล์ของผู้ใช้ ถ้าไม่มีให้ใช้ default
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition duration-300"
                onClick={() => setShowProfileMenu((prev) => !prev)}
              />
              {showProfileMenu && (
                <ul className="absolute right-0 z-10 bg-brown shadow-lg mt-2 rounded-md w-48 text-beige text-sm transition duration-300">
                  {user ? (
                    <>
                      <li className="p-3 hover:bg-dark-brown transition duration-200">
                        <Link to="/profile">โปรไฟล์ของฉัน</Link>
                      </li>
                      <li className="p-3 hover:bg-red-500 transition duration-200 cursor-pointer" onClick={handleLogout}>
                        ออกจากระบบ
                      </li>
                    </>
                  ) : (
                    <li className="p-3 hover:bg-dark-brown transition duration-200">
                      <Link to="/login">เข้าสู่ระบบ</Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
          </ul>
        </div>
        {/* Mobile Menu Toggle Button */}
        <button
          className="lg:hidden text-beige focus:outline-none"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          ☰
        </button>
        {/* Mobile Menu */}
        {/* Mobile Menu */}
        {showMenu && (
          <div className="absolute top-full left-0 w-full bg-gradient-to-b from-brown to-dark-brown shadow-lg p-6 lg:hidden z-10 rounded-b-xl animate-slideDown">
            <ul className="space-y-4 text-beige">
              <li>
                <span className="block text-lg font-semibold cursor-pointer hover:text-light-brown transition duration-300">
                  คลังความรู้กาแฟ
                </span>
                <ul className="mt-2 bg-dark-brown rounded-lg shadow-inner divide-y divide-gray-700">
                  <li className="p-3 hover:bg-brown transition duration-200">
                    <Link to="/history" onClick={() => setShowMenu(false)}>
                      ประวัติศาสตร์กาแฟ
                    </Link>
                  </li>
                  <li className="p-3 hover:bg-brown transition duration-200">
                    <Link to="/geneCoffee" onClick={() => setShowMenu(false)}>
                      สายพันธุ์กาแฟ
                    </Link>
                  </li>
                  <li className="p-3 hover:bg-brown transition duration-200">
                    <Link to="/roasting" onClick={() => setShowMenu(false)}>
                      การคั่วกาแฟอย่างมืออาชีพ
                    </Link>
                  </li>
                  <li className="p-3 hover:bg-brown transition duration-200">
                    <Link to="/extraction" onClick={() => setShowMenu(false)}>
                      เทคนิคการสกัดกาแฟ
                    </Link>
                  </li>
                  <li className="p-3 hover:bg-brown transition duration-200">
                    <Link to="/process" onClick={() => setShowMenu(false)}>
                      กระบวนการผลิตกาแฟ
                    </Link>
                  </li>
                  <li className="p-3 hover:bg-brown transition duration-200">
                    <Link to="/worldCoffee" onClick={() => setShowMenu(false)}>
                      แผนที่แหล่งผลิตกาแฟโลก
                    </Link>
                  </li>
                  <li className="p-3 hover:bg-brown transition duration-200">
                    <Link to="/articles" onClick={() => setShowMenu(false)}>
                      บทความน่ารู้
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="hover:bg-brown p-3 rounded transition duration-200">
                <Link to="/coffee_bean" onClick={() => setShowMenu(false)}>
                  เมล็ดกาแฟ
                </Link>
              </li>
              <li className="hover:bg-brown p-3 rounded transition duration-200">
                <Link to="/coffee_menu" onClick={() => setShowMenu(false)}>
                  เมนูกาแฟ
                </Link>
              </li>
              <li className="hover:bg-brown p-3 rounded transition duration-200 cursor-pointer">
                แบบทดสอบ
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}
