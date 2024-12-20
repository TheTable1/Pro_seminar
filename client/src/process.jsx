import Footer from "./footer";
import Navbar from "./navbar";
import { useState } from "react";

function Process() {
  const [selectedIcon, setSelectedIcon] = useState("cherry");

  const icons = [
    { id: 1, name: "cherry", image: "/path/to/cherry-icon.png", alt: "Cherry", content: "นี่คือขั้นตอนการเก็บเชอร์รี่สุกจากต้นกาแฟ." },
    { id: 2, name: "roast", image: "/path/to/roast-icon.png", alt: "Roast", content: "การคั่วกาแฟเป็นกระบวนการที่ทำให้กาแฟมีกลิ่นหอม." },
    { id: 3, name: "process", image: "/path/to/process-icon.png", alt: "Process", content: "ขั้นตอนการแปรรูปกาแฟเพื่อให้ได้เมล็ดที่พร้อมคั่ว." },
    { id: 4, name: "brew", image: "/path/to/brew-icon.png", alt: "Brew", content: "การชงกาแฟเป็นขั้นตอนสุดท้ายเพื่อให้ได้เครื่องดื่มพร้อมดื่ม." },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Header with icons */}
      <div className="flex justify-center items-center space-x-6 py-6">
        {icons.map((icon) => (
          <button
            key={icon.id}
            onClick={() => setSelectedIcon(icon.name)}
            className={`relative w-20 h-20 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-4 border-black bg-brown-300 flex justify-center items-center transition-transform duration-300 ${
              selectedIcon === icon.name ? "ring-4 ring-brown scale-110" : "hover:scale-105"
            }`}
          >
            <img
              src={icon.image}
              alt={icon.alt}
              className="w-12 h-12 sm:w-10 sm:h-10"
            />
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="mt-8 text-center">
        {icons.map(
          (icon) =>
            selectedIcon === icon.name && (
              <div key={icon.id}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{icon.alt}</h2>
                <p className="text-gray-700 max-w-2xl mx-auto">{icon.content}</p>
              </div>
            )
        )}
      </div>
    </div>
  );
};


export default Process;