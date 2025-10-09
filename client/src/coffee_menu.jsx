import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import MenuItems from "./menuItems.json";

function CoffeeBeans() {
  const [activeFilter, setActiveFilter] = useState("กาแฟทั้งหมด");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const mainRef = useRef(null);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = MenuItems;

  // ----- Utils -----
  const scrollToTopWithOffset = () => {
    if (!mainRef.current) return;
    const offset = -70;
    const y = mainRef.current.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // แปลง tests/type เป็นแท็กสั้น ๆ (ไม่เกิน 3 อัน)
  const getTags = (item) => {
    const t = Array.isArray(item.type) ? item.type : (item.type ? [item.type] : []);
    const tests = (item.tests || "").split(/[,\s]+/).filter(Boolean);
    const unique = [...new Set([...t, ...tests])];
    return unique.slice(0, 3);
  };

  // ----- init จาก state หรือ ?item= -----
  useEffect(() => {
    const fromState = location.state;
    const fromQuery = (searchParams.get("item") || "").toLowerCase();

    let candidate = null;
    if (fromState && (fromState.id || fromState.img || fromState.ingredients)) candidate = fromState;
    if (!candidate && fromState?.name) {
      candidate = menuItems.find(i => i.name.toLowerCase() === String(fromState.name).toLowerCase()) || null;
    }
    if (!candidate && fromQuery) {
      candidate = menuItems.find(i => i.name.toLowerCase() === fromQuery) || null;
    }

    if (candidate) {
      setSelectedItem(candidate);
      scrollToTopWithOffset();
    }
  }, [location.state, searchParams, menuItems]);

  const filterButtons = [
    "กาแฟทั้งหมด",
    "กาแฟร้อน",
    "กาแฟเย็น",
    "กาแฟปั่น",
    "กาแฟนม",
    "กาแฟผลไม้",
  ];

  const handleFilterChange = (filter) => setActiveFilter(filter);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    scrollToTopWithOffset();
  };

  const handleBack = () => {
    setSelectedItem(null);
    scrollToTopWithOffset();
  };

  const handleTryIt = () => navigate("/select", { state: selectedItem });

  const filteredItems = menuItems.filter((item) => {
    const matchesFilter =
      activeFilter === "กาแฟทั้งหมด" ||
      (Array.isArray(item.type) ? item.type.includes(activeFilter) : item.type === activeFilter);
    const matchesSearch =
      !searchTerm.trim() || item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f1ec]">
      <Navbar />
      <main ref={mainRef} className="flex-1 lg:p-6 sm:p-0">

        {/* =============== DETAIL VIEW =============== */}
        {selectedItem ? (
          <div className="bg-white rounded-2xl shadow-md p-5 md:p-6">
            {/* Back */}
            <button
              onClick={handleBack}
              className="mb-4 rounded-full px-4 py-2 text-sm bg-[#6f4e37] text-white hover:opacity-90"
            >
              ← ย้อนกลับ
            </button>

            {/* HERO รูป + ชื่อ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <figure className="lg:col-span-5">
                <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                  <img
                    src={selectedItem.img}
                    alt={selectedItem.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {/* level / cafeid */}
                  {selectedItem.cafeid && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/85 backdrop-blur px-3 py-1 text-[11px] text-neutral-800">
                      {selectedItem.cafeid}
                    </span>
                  )}
                  <figcaption className="absolute bottom-4 left-4 right-4 text-white">
                    <h1 className="text-xl md:text-2xl font-bold drop-shadow">{selectedItem.name}</h1>
                  </figcaption>
                </div>
              </figure>

              {/* ขวา: key facts + คำอธิบาย */}
              <div className="lg:col-span-7 space-y-6">
                {/* chips facts */}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(selectedItem.type) && selectedItem.type.map((t, i) => (
                    <span key={i} className="rounded-full border border-[#2a1c14]/15 bg-white px-3 py-1 text-xs text-[#2a1c14]">
                      {t}
                    </span>
                  ))}
                  {!Array.isArray(selectedItem.type) && selectedItem.type && (
                    <span className="rounded-full border border-[#2a1c14]/15 bg-white px-3 py-1 text-xs text-[#2a1c14]">
                      {selectedItem.type}
                    </span>
                  )}
                  {selectedItem.caffeine && (
                    <span className="rounded-full bg-[#f1e9e2] px-3 py-1 text-xs text-[#2a1c14]">
                      คาเฟอีน: {selectedItem.caffeine}
                    </span>
                  )}
                  {selectedItem.calories && (
                    <span className="rounded-full bg-[#f1e9e2] px-3 py-1 text-xs text-[#2a1c14]">
                      แคลอรี่: {selectedItem.calories}
                    </span>
                  )}
                </div>

                {/* รายละเอียด */}
                <section>
                  <h2 className="text-lg md:text-xl font-bold text-[#2a1c14]">รายละเอียดเมนู</h2>
                  <p className="mt-2 text-neutral-700 leading-relaxed">{selectedItem.details}</p>
                </section>

                {/* รสชาติ/ระดับความเข้ม */}
                {(selectedItem.tests || selectedItem.cafeid) && (
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem.tests && (
                      <div className="rounded-xl bg-[#faf6f3] p-4">
                        <h3 className="font-semibold text-[#2a1c14]">โปรไฟล์รสชาติ</h3>
                        <p className="text-neutral-700 mt-1">{selectedItem.tests}</p>
                      </div>
                    )}
                    {selectedItem.cafeid && (
                      <div className="rounded-xl bg-[#faf6f3] p-4">
                        <h3 className="font-semibold text-[#2a1c14]">ระดับความเข้ม</h3>
                        <p className="text-neutral-700 mt-1">{selectedItem.cafeid}</p>
                      </div>
                    )}
                  </section>
                )}

                {/* วัตถุดิบ / ขั้นตอน */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-[#2a1c14]">วัตถุดิบในการทำ</h3>
                    <ol className="mt-2 list-decimal pl-5 space-y-1 text-neutral-700">
                      {selectedItem.ingredients?.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2a1c14]">ขั้นตอนการทำ</h3>
                    <ol className="mt-2 list-decimal pl-5 space-y-1 text-neutral-700">
                      {selectedItem.stepsAll?.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                </section>

                {/* CTA */}
                <div className="pt-2">
                  <button
                    onClick={handleTryIt}
                    className="rounded-full bg-[#6f4e37] px-6 py-3 text-white font-semibold shadow hover:opacity-90"
                  >
                    ลองทำ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (

          /* =============== LIST VIEW =============== */
          <section className="rounded-2xl bg-white shadow-md transition hover:shadow-lg">
            <div className="p-4 md:p-6 lg:p-7">

              {/* Search */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-full max-w-xl">
                  <input
                    type="text"
                    placeholder="ค้นหาเมนู..."
                    className="w-full rounded-full border border-black/10 bg-black/5 px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#6f4e37]/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">🔎</span>
                </div>
              </div>

              {/* Filter chips */}
              <div className="mb-6 flex flex-wrap justify-center gap-2 md:gap-3">
                {filterButtons.map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFilterChange(f)}
                    className={`rounded-full border px-4 py-2 text-sm transition
                      ${activeFilter === f
                        ? "bg-[#6f4e37] text-white border-[#6f4e37]"
                        : "bg-white text-[#2a1c14] border-black/10 hover:bg-black/5"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Suggestion button */}
              <div className="mb-4 flex justify-end">
                <button
                  className="rounded-full bg-[#b5835a] px-4 py-2 text-white hover:opacity-90"
                  onClick={() => navigate("/suggestion")}
                >
                  แนะนำกาแฟที่คุณต้องชอบ
                </button>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {filteredItems.map((item, idx) => {
                  const tags = getTags(item);
                  return (
                    <div
                      key={idx}
                      role="button"
                      onClick={() => handleItemClick(item)}
                      className="group relative overflow-hidden rounded-2xl bg-white shadow hover:shadow-xl transition"
                    >
                      {/* รูป */}
                      <div className="relative h-44 w-full">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        {/* level badge */}
                        {item.cafeid && (
                          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] text-neutral-800">
                            {item.cafeid}
                          </span>
                        )}
                        {/* ชื่อบนรูป (ล่างซ้าย) */}
                        <div className="absolute bottom-3 left-3 right-3 text-white drop-shadow">
                          <h3 className="font-semibold leading-tight line-clamp-2">
                            {item.name}
                          </h3>
                        </div>
                      </div>

                      {/* เนื้อหาล่างการ์ด */}
                      <div className="p-4">
                        {item.tests && (
                          <p className="text-sm text-neutral-700 line-clamp-1 mb-3">
                            {item.tests}
                          </p>
                        )}

                        <div className="mt-1 flex items-center justify-between gap-3">
                          {/* info ซ้าย (เช่น แคลอรี่/คาเฟอีน – ใส่ถ้ามี) */}
                          <span className="text-xs text-neutral-500">
                            {item.calories || ""}
                          </span>

                          {/* แท็กขวา */}
                          <div className="flex flex-wrap justify-end gap-2">
                            {tags.map((t, i) => (
                              <span
                                key={`${t}-${i}`}
                                className="rounded-full border border-[#6f4e37]/25 bg-[#6f4e37]/5 px-2.5 py-1 text-[11px] text-[#6f4e37]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* เผื่อข้อมูลน้อย – เพิ่ม padding ล่างให้ภาพรวมดูเต็มขึ้น */}
              <div className="h-4 md:h-6" />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default CoffeeBeans;
