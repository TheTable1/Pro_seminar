import React, { useState } from "react";
import Navbar from "./navbar";

function CoffeeBeans() {
  const [activeFilter, setActiveFilter] = useState("กาแฟทั้งหมด");

  const menuItems = [
    {
      name: "เอสเปรสโซ",
      type: "กาแฟร้อน",
      img: "https://shorturl.at/n6YZW",
    },
    {
      name: "อเมริกาโนร้อน",
      type: "กาแฟเย็น",
      img: "https://shorturl.at/Mww7O",
    },
    { name: "ลาเต้เย็น", type: "กาแฟปั่น", img: "https://shorturl.at/dGrWr" },
  ];

  const filterButtons = [
    "กาแฟทั้งหมด",
    "กาแฟร้อน",
    "กาแฟเย็น",
    "กาแฟปั่น",
    "กาแฟนม",
  ];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-6">
        <section className="bg-white rounded-lg shadow-md transition duration-200 ease-in-out hover:shadow-lg">
          <div className="p-2 md:p-3 lg:p-5">
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 mb-6">
              {filterButtons.map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-full text-sm md:text-base transition duration-200 ease-in-out ${activeFilter === filter
                      ? "bg-brown text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-300"
                    }`}
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
              {menuItems
                .filter(
                  (item) =>
                    activeFilter === "กาแฟทั้งหมด" || item.type === activeFilter
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-brown rounded-lg shadow-sm text-center text-white font-medium transition duration-200 ease-in-out hover:shadow-lg"
                  >
                    {item.name}
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CoffeeBeans;
