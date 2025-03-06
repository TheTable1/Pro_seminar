import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const navbarRef = useRef(null);

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

  return (
    <div>
      <header
        ref={navbarRef}
        className="bg-dark-brown py-4 px-5 flex justify-between items-center relative"
      >
        <div className="font-bold text-beige text-[5vw] md:text-[1rem] lg:text-[2rem]">
          <Link to="/"> Coffee Bean Fusion </Link>
        </div>
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          <ul className="flex space-x-4 text-beige">
            <li className="relative group">
              <span
                className="cursor-pointer hover:text-light-brown transition duration-300"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                คลังความรู้กาแฟ
              </span>
              {showMenu && (
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
            <li className="cursor-pointer hover:text-light-brown transition duration-300">
              <Link to="/coffee_bean">เมล็ดกาแฟ</Link>
            </li>
            <li className="cursor-pointer hover:text-light-brown transition duration-300">
              <Link to="/coffee_menu">เมนูกาแฟ</Link>
            </li>
            <li className="cursor-pointer hover:text-light-brown transition duration-300">
              แบบทดสอบ
            </li>
          </ul>
          <img
            className="w-10 h-10 rounded-full border-2 border-beige"
            src="/woman.png"
            alt="woman"
          />
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
