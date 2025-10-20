// select.jsx (no difficulty picker, no flavor picker, image icons)
import React, { useState, useMemo, useEffect } from "react";
import Navbar from "../navbar";
import { useNavigate, useLocation } from "react-router-dom";

/** resolve path under public/ for CRA/Vite */
const pub = (p) => {
  let base = "/";
  try {
    if (typeof import.meta !== "undefined" && import.meta?.env?.BASE_URL) {
      base = import.meta.env.BASE_URL;
    } else if (typeof process !== "undefined" && process?.env?.PUBLIC_URL) {
      base = process.env.PUBLIC_URL;
    }
  } catch {}
  return `${String(base).replace(/\/+$/, "/")}${String(p).replace(/^\/+/, "")}`;
};

/**
 * หน้าเลือกวิธีการสกัด
 * - รับ recipe จากหน้าเมนู (navigate(..., { state }))
 * - เซฟลง localStorage: recipe, recipeId, brewingMethod
 * - ไปหน้าจำลอง /customcoffee
 */
export default function Selected() {
  const navigate = useNavigate();
  const { state } = useLocation() || {};
  const recipe = state?.recipe || null;
  const recipeId = state?.recipeId || recipe?.name || null;

  // ถ้ารีเฟรชหน้า ให้คง recipe ไว้
  useEffect(() => {
    if (!recipe && localStorage.getItem("recipe")) return;
    if (recipe) {
      localStorage.setItem("recipe", JSON.stringify(recipe));
      if (recipeId) localStorage.setItem("recipeId", recipeId);
    }
  }, [recipe, recipeId]);

  // ✅ เปลี่ยนจาก SVG เป็นรูปภาพใน public/simulator/*
  // ---- ปรับชื่อไฟล์ภาพตรงนี้ให้ตรงกับของคุณ ----
  const methodImages = {
    espresso: pub("simulator/เครื่องเอส.png"),
    drip: pub("simulator/เครื่องดิป.png"),
    frenchpress: pub("simulator/เฟรสเพรส.png"),
    moka: pub("simulator/โมก้าพอท.png"),
  };

  const methods = useMemo(
    () => [
      { id: "espresso", name: "เอสเพรสโซ", desc: "แรงดันสูง รสเข้ม–ครีม่า" },
      { id: "drip", name: "ดริป (Pour Over)", desc: "ใส สะอาด คุมรสด้วยสายน้ำ" },
      { id: "frenchpress", name: "เฟรนช์เพรส", desc: "บอดี้หนา กลิ่นชัด" },
      { id: "moka", name: "โมก้าพอต", desc: "เข้มกระชับ กลิ่นคั่วชัด" },
    ],
    []
  );

  const [active, setActive] = useState(null); // id ของ method ที่ hover/เลือก

  const NAVBAR_HEIGHT_PERCENT = 10;
  const areaHeight = { height: `calc(100vh - ${NAVBAR_HEIGHT_PERCENT}vh)` };

  const getWidthPercent = (id) => (!active ? 25 : active === id ? 55 : 15);

  const handleChoose = (id) => {
    if (recipe) localStorage.setItem("recipe", JSON.stringify(recipe));
    if (recipeId) localStorage.setItem("recipeId", recipeId);
    localStorage.setItem("brewingMethod", id);
    // ❌ ไม่ตั้งค่า flavorIntent ที่หน้านี้แล้ว
    navigate(`/customcoffee`);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-100">
      <Navbar />
      <section className="overflow-hidden" style={areaHeight} aria-label="เลือกวิธีการสกัด">
        <div className="h-full w-full flex flex-row">
          {methods.map((m, idx) => {
            const isActive = active === m.id;
            const imgSrc = methodImages[m.id];
            return (
              <button
                key={m.id}
                type="button"
                onMouseEnter={() => setActive(m.id)}
                onFocus={() => setActive(m.id)}
                onClick={() => setActive(m.id)}
                className="relative h-full overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60"
                style={{
                  flexBasis: `${getWidthPercent(m.id)}%`,
                  transition: "flex-basis 300ms ease, transform 200ms ease",
                }}
              >
                {/* พื้นหลัง */}
                <div
                  className={`absolute inset-0 transition-colors ${
                    isActive
                      ? "bg-gradient-to-br from-amber-50 to-orange-100"
                      : "bg-gradient-to-br from-stone-100 to-stone-200"
                  }`}
                />
                {/* เส้นไฮไลต์ซ้าย */}
                <div
                  className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${
                    ["from-amber-500", "from-rose-500", "from-emerald-500", "from-sky-500"][idx]
                  } to-transparent`}
                />
                {/* เนื้อหา */}
                <div className="relative h-full w-full flex items-center justify-center p-6">
                  {!isActive ? (
                    <div className="flex flex-col items-center text-center gap-3">
                      <img
                        src={imgSrc}
                        alt={m.name}
                        className="w-20 h-20 object-contain drop-shadow-sm"
                        draggable={false}
                      />
                      <div className="text-base font-semibold text-gray-900">{m.name}</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-center w-full max-w-5xl">
                      <div className="xl:col-span-2 flex justify-center">
                        <img
                          src={imgSrc}
                          alt={m.name}
                          className="w-24 h-24 xl:w-40 xl:h-40 object-contain drop-shadow-sm"
                          draggable={false}
                        />
                      </div>
                      <div className="xl:col-span-3">
                        <h2 className="text-2xl xl:text-3xl font-bold text-gray-900">{m.name}</h2>
                        <p className="mt-2 text-sm text-gray-700">{m.desc}</p>

                        {/* ❌ ตัด Flavor Intent ออก */}

                        <div className="mt-6 flex flex-wrap gap-3 justify-center">
                          <button
                            onClick={() => handleChoose(m.id)}
                            className="px-4 py-2 rounded-full bg-gray-900 text-white font-semibold shadow hover:bg-gray-800"
                          >
                            เลือกวิธีนี้
                          </button>
                          {recipeId && (
                            <span className="text-xs text-gray-600 self-center">
                              เมนู: <b>{recipeId}</b>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
