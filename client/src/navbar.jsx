import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div>
      <header className="bg-dark-brown py-4 px-5 flex justify-between items-center relative">
        <div className="font-bold text-beige text-[5vw] md:text-[1rem] lg:text-[2rem]">
          Coffee Bean Fusion
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          <ul className="flex space-x-4 text-beige">
            <li className="relative group" ref={menuRef}>
              <span
                className="cursor-pointer hover:text-light-brown transition duration-300"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                คลังความรู้กาแฟ
              </span>
              {showMenu && (
                <ul className="absolute left-0 z-10 bg-brown shadow-lg mt-2 rounded-md w-48 text-beige text-sm transition duration-300">
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    ประวัติศาสตร์กาแฟ
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    สายพันธุ์กาแฟ
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    การคั่วกาแฟอย่างมืออาชีพ
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    เทคนิคการสกัดกาแฟ
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    กระบวนการผลิตกาแฟ
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    แผนที่แหล่งผลิตกาแฟโลก
                  </li>
                  <li className="p-3 hover:bg-dark-brown transition duration-200">
                    บทความน่ารู้
                  </li>
                </ul>
              )}
            </li>
            <li className="cursor-pointer hover:text-light-brown transition duration-300">
              เมล็ดกาแฟ
            </li>
            <li className="cursor-pointer hover:text-light-brown transition duration-300">
              เมนูกาแฟ
            </li>
            <li className="cursor-pointer hover:text-light-brown transition duration-300">
              ฟีดคอกาแฟ
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
        {showMenu && (
          <div className="absolute top-full left-0 w-full bg-brown shadow-md p-4 lg:hidden z-10">
            <ul className="space-y-4 text-beige">
              <li>
                <span className="cursor-pointer hover:text-light-brown transition duration-300">
                  คลังความรู้กาแฟ
                </span>
                <ul className="ml-4 mt-2 bg-dark-brown shadow-md rounded-md">
                  <li className="p-2 hover:bg-dark-brown transition duration-200">
                    ประวัติศาสตร์กาแฟ
                  </li>
                  <li className="p-2 hover:bg-dark-brown transition duration-200">
                    สายพันธุ์กาแฟ
                  </li>
                  <li className="p-2 hover:bg-dark-brown transition duration-200">
                    การคั่วกาแฟอย่างมืออาชีพ
                  </li>
                  <li className="p-2 hover:bg-dark-brown transition duration-200">
                    เทคนิคการสกัดกาแฟ
                  </li>
                  <li className="p-2 hover:bg-dark-brown transition duration-200">
                    กระบวนการผลิตกาแฟ
                  </li>
                  <li className="p-2 hover:bg-dark-brown transition duration-200">
                    แผนที่แหล่งผลิตกาแฟโลก
                  </li>
                  <li className="p-2 hover:bg-dark-brown transition duration-200">
                    บทความน่ารู้
                  </li>
                </ul>
              </li>
              <li className="cursor-pointer hover:text-light-brown transition duration-200">
                เมล็ดกาแฟ
              </li>
              <li className="cursor-pointer hover:text-light-brown transition duration-300">
                เมนูกาแฟ
              </li>
              <li className="cursor-pointer hover:text-light-brown transition duration-300">
                ฟีดคอกาแฟ
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}
