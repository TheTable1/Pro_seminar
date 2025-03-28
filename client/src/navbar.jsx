import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "./firebase/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  // กำหนดความสูงของ Navbar เป็น % (ตัวอย่างนี้ใช้ 10% ของหน้าจอ)
  const NAVBAR_HEIGHT_PERCENT = 10;

  const [showKnowledgeMenu, setShowKnowledgeMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const knowledgeMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const navbarRef = useRef(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ดึง path ปัจจุบัน
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setShowMenu(false);
        setShowKnowledgeMenu(false);
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowProfileMenu(false);
    navigate("/login");
  };

  // เช็คว่า path ปัจจุบันเป็นของหมวดความรู้กาแฟหรือไม่
  const knowledgeRoutes = [
    "/history",
    "/geneCoffee",
    "/roasting",
    "/extraction",
    "/process",
    "/worldCoffee",
    "/articles",
  ];
  const isKnowledgeActive = knowledgeRoutes.some(
    (r) => location.pathname === r
  );

  // เช็ค path ของเมนูอื่น ๆ
  const isCoffeeBeanActive = location.pathname === "/coffee_bean";
  const isCoffeeMenuActive = location.pathname === "/coffee_menu";
  const isQuizActive = location.pathname === "/quiz";

  return (
    <div
      ref={navbarRef}
      style={{ height: `${NAVBAR_HEIGHT_PERCENT}%`, width: "100%" }}
      className="relative z-50"
    >
      <header
        className="bg-dark-brown flex justify-between items-center"
        style={{ padding: "1rem 1.25rem", height: "100%" }}
      >
        {/* โลโก้ */}
        <div className="font-bold text-beige text-xl md:text-2xl lg:text-3xl leading-none">
          <Link to="/">Coffee Bean Fusion</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          <ul className="flex items-center space-x-6 text-beige">
            {/* คลังความรู้กาแฟ */}
            <li
              className={`relative group ${
                isKnowledgeActive ? "border-b-2 border-light-brown" : ""
              }`}
              ref={knowledgeMenuRef}
            >
              <span
                className="cursor-pointer hover:text-light-brown transition duration-300"
                onClick={() => setShowKnowledgeMenu((prev) => !prev)}
              >
                คลังความรู้กาแฟ
              </span>
              {showKnowledgeMenu && (
                <ul className="absolute left-0 z-10 bg-brown shadow-lg mt-2 rounded-md w-60 text-beige text-sm transition duration-300">
                  <li>
                    <Link
                      to="/history"
                      className="flex items-center p-3 hover:bg-dark-brown transition duration-200"
                    >
                      <img
                        src="nav/icons8-history-80.png"
                        alt="history icon"
                        className="w-6 h-6 mr-2"
                      />
                      <span>ประวัติศาสตร์กาแฟ</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/geneCoffee"
                      className="flex items-center p-3 hover:bg-dark-brown transition duration-200"
                    >
                      <img
                        src="nav/icons8-coffee-beans-48 (2).png"
                        alt="history icon"
                        className="w-6 h-6 mr-2"
                      />
                      สายพันธุ์กาแฟ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/roasting"
                      className="flex items-center p-3 hover:bg-dark-brown transition duration-200"
                    >
                      <img
                        src="nav/icons8-coffee-bag-50.png"
                        alt="history icon"
                        className="w-6 h-6 mr-2"
                      />
                      ระดับของการคั่วกาแฟ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/extraction"
                      className="flex items-center p-3 hover:bg-dark-brown transition duration-200"
                    >
                      <img
                        src="nav/icons8-vietnamese-coffee-50.png"
                        alt="history icon"
                        className="w-6 h-6 mr-2"
                      />
                      เทคนิคการสกัดกาแฟ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/process"
                      className="flex items-center p-3 hover:bg-dark-brown transition duration-200"
                    >
                      <img
                        src="nav/icons8-coffee-cup-50.png"
                        alt="history icon"
                        className="w-6 h-6 mr-2"
                      />
                      กระบวนการผลิตกาแฟ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/worldCoffee"
                      className="flex items-center p-3 hover:bg-dark-brown transition duration-200"
                    >
                      <img
                        src="nav/icons8-map-80 (1).png"
                        alt="history icon"
                        className="w-6 h-6 mr-2"
                      />
                      แผนที่แหล่งผลิตกาแฟโลก
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/articles"
                      className="flex items-center p-3 hover:bg-dark-brown transition duration-200"
                    >
                      <img
                        src="nav/icons8-article-50.png"
                        alt="history icon"
                        className="w-6 h-6 mr-2"
                      />
                      บทความน่ารู้
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* เมล็ดกาแฟ */}
            <li
              className={`cursor-pointer hover:text-light-brown transition duration-300 ${
                isCoffeeBeanActive ? "border-b-2 border-light-brown" : ""
              }`}
            >
              <Link to="/coffee_bean">เมล็ดกาแฟ</Link>
            </li>

            {/* เมนูกาแฟ */}
            <li
              className={`cursor-pointer hover:text-light-brown transition duration-300 ${
                isCoffeeMenuActive ? "border-b-2 border-light-brown" : ""
              }`}
            >
              <Link to="/coffee_menu">เมนูกาแฟ</Link>
            </li>

            {/* แบบทดสอบ */}
            <li
              className={`cursor-pointer hover:text-light-brown transition duration-300 ${
                isQuizActive ? "border-b-2 border-light-brown" : ""
              }`}
            >
              <Link to="/quiz">แบบทดสอบ</Link>
            </li>

            {/* เมนูโปรไฟล์ */}
            <li className="relative group" ref={profileMenuRef}>
              <img
                src={user?.photoURL || "/coffeebean.png"}
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
                      <li
                        className="p-3 hover:bg-red-500 transition duration-200 cursor-pointer"
                        onClick={handleLogout}
                      >
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
          className="lg:hidden text-beige focus:outline-none text-2xl"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          ☰
        </button>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="absolute top-full left-0 w-full bg-brown shadow-lg p-6 lg:hidden z-50 rounded-b-xl animate-slideDown">
            <ul className="space-y-4 text-beige">
              <li>
                <span className="block text-lg font-semibold">
                  คลังความรู้กาแฟ
                </span>
                <ul className="mt-2 bg-dark-brown rounded-lg shadow-inner divide-y divide-gray-700">
                  <li>
                    <Link
                      to="/history"
                      className="block p-3 hover:bg-brown transition duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      ประวัติศาสตร์กาแฟ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/geneCoffee"
                      className="block p-3 hover:bg-brown transition duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      สายพันธุ์กาแฟ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/roasting"
                      className="block p-3 hover:bg-brown transition duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      ระดับของการคั่วกาแฟ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/extraction"
                      className="block p-3 hover:bg-brown transition duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      เทคนิคการสกัดกาแฟ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/process"
                      className="block p-3 hover:bg-brown transition duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      กระบวนการผลิตกาแฟ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/worldCoffee"
                      className="block p-3 hover:bg-brown transition duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      แผนที่แหล่งผลิตกาแฟโลก
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/articles"
                      className="block p-3 hover:bg-brown transition duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      บทความน่ารู้
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="hover:bg-brown text-lg pt-3 rounded transition duration-200 font-semibold">
                <Link to="/coffee_bean" onClick={() => setShowMenu(false)}>
                  เมล็ดกาแฟ
                </Link>
              </li>
              <li className="hover:bg-brown text-lg pt-3 rounded transition duration-200 font-semibold">
                <Link to="/coffee_menu" onClick={() => setShowMenu(false)}>
                  เมนูกาแฟ
                </Link>
              </li>
              <li className="hover:bg-brown text-lg pt-3 rounded transition duration-200 font-semibold">
                <Link to="/quiz" onClick={() => setShowMenu(false)}>
                  แบบทดสอบ
                </Link>
              </li>
              {/* Mobile Profile Menu (Always Expanded) */}
              <li>
                <span className="block text-lg font-semibold">โปรไฟล์</span>
                {/* เพิ่มคลาส bg-dark-brown และอื่น ๆ ให้เหมือนเมนู "คลังความรู้กาแฟ" */}
                <ul className="mt-2 bg-dark-brown rounded-lg shadow-inner divide-y divide-gray-700">
                  {user ? (
                    <>
                      <li>
                        <Link
                          to="/profile"
                          onClick={() => setShowMenu(false)}
                          className="block p-3 hover:bg-brown transition duration-200"
                        >
                          โปรไฟล์ของฉัน
                        </Link>
                      </li>
                      <li
                        className="cursor-pointer block p-3 hover:bg-red-500 transition duration-200"
                        onClick={() => {
                          handleLogout();
                          setShowMenu(false);
                        }}
                      >
                        ออกจากระบบ
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link
                        to="/login"
                        onClick={() => setShowMenu(false)}
                        className="block p-3 hover:bg-brown transition duration-200"
                      >
                        เข้าสู่ระบบ
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}
