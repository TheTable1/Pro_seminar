import { useState } from "react";
import Navbar from "./navbar";
import MenuItems from "./menuItems.json";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";

function CoffeeBeans() {
  const [activeFilter, setActiveFilter] = useState("กาแฟทั้งหมด");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State สำหรับการค้นหา

  const menuItems = MenuItems;

  const navigate = useNavigate();

  const filterButtons = [
    "กาแฟทั้งหมด",
    "กาแฟร้อน",
    "กาแฟเย็น",
    "กาแฟปั่น",
    "กาแฟนม",
    "กาแฟผลไม้",
  ];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleBack = () => {
    setSelectedItem(null);
  };

  const handleTryIt = () => {
    navigate("/simulator", { state: selectedItem }); // ส่งข้อมูล selectedItem ไป FinalStep
  };  
  
  // ฟังก์ชันสำหรับการค้นหา
  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="lg:p-6 sm:p-0">
        {/* แสดงรายละเอียดของเมนู */}
        {selectedItem ? (
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-3xl font-bold px-4 mb-3">{selectedItem.name}</h2>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Section: Image and Menu Name */}
            <div className="flex flex-col items-center">
              <img
                className="w-4/5 h-auto object-cover rounded-md shadow-lg"
                src={selectedItem.img}
                alt={selectedItem.name}
              />
            </div>

            {/* Right Section: Steps and Button */}
            <div className="space-y-6 ">
              <h2 className="text-3xl font-bold mb-4 text-brown">{selectedItem.name}</h2>
              <h3 className="font-semibold text-lg text-brown">ขั้นตอนการทำ</h3>
              <ol className="list-decimal pl-5 space-y-2">
                {selectedItem.steps.map((step, index) => (
                  <li key={index} className="text-gray-700">
                    {step}
                  </li>
                ))}
              </ol>
              <button
                onClick={handleTryIt}
                className="bg-brown text-white px-4 py-2 rounded-3xl hover:bg-light-brown"
              >
                ลองทำ
              </button>
            </div>
          </div>
        </div>
        ) : (
          <section className="bg-white rounded-lg h-full shadow-md transition duration-200 ease-in-out hover:shadow-lg">
            <div className="p-2 md:p-3 lg:p-5">
              {/* Search Bar */}
              <div className="mb-6 flex justify-center">
                <input
                  type="text"
                  placeholder="ค้นหาเมนู..."
                  className="md:w-2/5 sm:w-2/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 mb-6">
                {filterButtons.map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-full text-sm md:text-base transition duration-200 ease-in-out ${
                      activeFilter === filter
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
                {filteredItems
                  .filter(
                    (item) =>
                      activeFilter === "กาแฟทั้งหมด" ||
                      item.type === activeFilter
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      style={{ cursor: "pointer" }}
                      className="sm:p-4 md:p-1 bg-brown rounded-lg shadow-sm text-center text-white font-medium transition duration-200 ease-in-out hover:shadow-lg"
                      onClick={() => handleItemClick(item)} >
                      <div className="p-4 bg-brown rounded-lg shadow-sm text-center text-white font-medium transition duration-200 ease-in-out hover:shadow-lg">
                        <img
                          className="w-full h-40 object-cover rounded-md"
                          src={item.img}
                          alt={item.name}
                        />
                        <h4 className="mt-2">{item.name}</h4>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default CoffeeBeans;