import { useState, useMemo } from "react";
import Navbar from "../navbar";
import { useNavigate } from "react-router-dom";
/**
 * หน้าเลือกวิธีการชงกาแฟ (เต็มความสูงหลังลบ Navbar)
 * - 4 วิธี: เอสเพรสโซ / ดริป / เฟรนช์เพรส / โมก้าพอต
 * - ความสูงของพื้นที่เลือก = calc(100vh - NAVBAR_HEIGHT_PERCENT vh)
 * - เมื่อยังไม่เลือก: แสดงไอคอน+ชื่อ
 * - เมื่อเลือก: วิธีนั้น "ขยายกว้าง" และโชว์รายละเอียด + ปุ่ม "เลือกวิธีนี้"
 */
export default function Selected() {
  const navigate = useNavigate();

  // ให้สอดคล้องกับ navbar.jsx (ที่ตั้ง 10%)
  const NAVBAR_HEIGHT_PERCENT = 10;

  const methods = useMemo(
    () => [
      {
        id: "espresso",
        name: "เพรสโซ", // ถ้าต้องการ "เอสเพรสโซ" แก้ตรงนี้ได้เลย
        desc:
          "การสกัดด้วยแรงดันสูงผ่านผงกาแฟบดละเอียด เหมาะกับช็อตเข้ม เป็นฐานของลาเต้/คาปูชิโน่",
        icon: EspressoIcon,
      },
      {
        id: "drip",
        name: "ดริป (Pour Over)",
        desc:
          "เทน้ำร้อนผ่านฟิลเตอร์ด้วยอัตราการไหลที่คุมได้ รสชาติใส เคลียร์ และชูโน้ตกลิ่นรสของเมล็ด",
        icon: DripIcon,
      },
      {
        id: "frenchpress",
        name: "เฟรนช์เพรส",
        desc:
          "แช่กาแฟบดหยาบในน้ำร้อนแล้วกดด้วยตะแกรงโลหะ ให้บอดี้ชัด เนื้อสัมผัสหนา",
        icon: FrenchPressIcon,
      },
      {
        id: "moka",
        name: "โมก้าพอต",
        desc:
          "ไอน้ำดันผ่านผงกาแฟจากหม้อต้มบนเตา ให้ความเข้มใกล้เคียงเอสเพรสโซแบบโฮมเมด",
        icon: MokaIcon,
      },
    ],
    []
  );

  const [active, setActive] = useState(null); // method.id หรือ null
  const [difficulty, setDifficulty] = useState(1); // 1 | 2 | 3

  // คำนวณสัดส่วนความกว้าง (desktop)
  const getWidthPercent = (id) => {
    if (!active) return 25;        // ยังไม่เลือก -> เท่ากันทุกอัน
    return active === id ? 55 : 15; // เลือกแล้ว -> อันที่เลือกกว้าง 55% ที่เหลือ 15%
  };

  const areaHeight = {
    height: `calc(100vh - ${NAVBAR_HEIGHT_PERCENT}vh)`,
  };

  const handleChoose = (id) => {
  // เก็บค่าที่เลือกไว้ให้หน้า simulator ใช้
  localStorage.setItem("brewingMethod", id);
  localStorage.setItem("difficulty", String(difficulty));
  navigate(`/customcoffee`);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-100">
      <Navbar />

      {/* พื้นที่เลือกวิธี: ยึดสูงตาม calc(...) ชัดเจน ไม่ใช้ flex-1 */}
      <section className="overflow-hidden" style={areaHeight}aria-label="เลือกวิธีการชงกาแฟ">
        {/* ให้ wrapper สูงเต็ม และจัดวางแนวนอนตลอด (ถ้าต้องการ stack บนมือถือ ค่อยเปลี่ยนเป็น lg:flex-row) */}
        <div className="h-full w-full flex flex-row">
          {methods.map((m, idx) => {
            const Icon = m.icon;
            const isActive = active === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActive(m.id)}
                aria-expanded={isActive}
                // การ์ดแต่ละใบต้องสูงเต็ม container
                className="relative h-full overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60"
                style={{flexBasis: `${getWidthPercent(m.id)}%`, transition: "flex-basis 300ms ease, transform 200ms ease"}}
              >
                {/* พื้นหลังแผง */}
                <div className={`absolute inset-0 transition-colors duration-300 ${isActive? "bg-gradient-to-br from-amber-100 to-orange-100" : "bg-gradient-to-br from-stone-100 to-stone-200"}`}/>

                {/* เส้นไฮไลต์ซ้าย */}
                <div className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b to-transparent opacity-70 ${["from-amber-500", "from-rose-500", "from-emerald-500", "from-sky-500"][idx]}`}/>

                {/* เนื้อหาในการ์ด (จัดกลางทั้งแนวตั้ง/แนวนอน) */}
                <div className="relative h-full w-full flex items-center justify-center p-6">
                  {!isActive ? (
                    // ยังไม่เลือก -> โชว์ไอคอน + ชื่อ
                    <div className="flex flex-col items-center text-center gap-3">
                      <Icon className="w-20 h-20 opacity-90" />
                      <div className="text-base font-semibold text-gray-900">
                        {m.name}
                      </div>
                    </div>
                  ) : (
                    // เลือกแล้ว -> โชว์รายละเอียด + ปุ่ม
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-center w-full max-w-5xl">
                      <div className="xl:col-span-2 flex justify-center">
                        <Icon className="w-24 h-24 xl:w-40 xl:h-40" />
                      </div>
                      <div className="xl:col-span-3">
                        <h2 className="text-2xl xl:text-3xl font-bold text-gray-900">
                          {m.name}
                        </h2>
                        <p className="mt-3 text-gray-700 leading-relaxed">
                          {m.desc}
                        </p>

                      {/* เลือกระดับความยาก */}
                      <div className="mt-6 p-4 rounded-2xl bg-white/80 shadow grid gap-3">
                        <div className="text-sm font-semibold">เลือกระดับความยาก</div>
                        <label className="flex items-start gap-3 text-sm">
                          <input type="radio" name="difficulty" value={1} checked={difficulty === 1} onChange={() => setDifficulty(1)} />
                          <span>
                            <b>Level 1 – Beginner:</b> ระบบกำหนดค่ามาตรฐานให้ (น้ำ/กาแฟ/ไฟ) ลากอุปกรณ์น้อย ช่วยอธิบายทุกขั้นตอนอย่างละเอียด
                          </span>
                        </label>
                        <label className="flex items-start gap-3 text-sm">
                          <input type="radio" name="difficulty" value={2} checked={difficulty === 2} onChange={() => setDifficulty(2)} />
                          <span>
                            <b>Level 2 – Intermediate:</b> เลือกบางค่าได้ มีช่วงแนะนำ/ตัวช่วยบอกขั้นตอนแบบกระชับ
                        </span>
                        </label>
                        <label className="flex items-start gap-3 text-sm">
                          <input type="radio" name="difficulty" value={3} checked={difficulty === 3} onChange={() => setDifficulty(3)} />
                          <span>
                            <b>Level 3 – Expert:</b> เลือกได้ทั้งหมด ไม่มีคำอธิบาย (แสดงเฉพาะว่ากำลังอยู่ขั้นไหน) แต่มีข้อจำกัดความเป็นจริงต่อ 1 ที่เสิร์ฟ
                          </span>
                        </label>
                      </div>

                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChoose(m.id);
                            }}
                            className="px-5 py-3 rounded-2xl bg-amber-600 text-white font-semibold shadow hover:shadow-md hover:bg-amber-700 active:scale-[.98] transition"
                          >
                            เลือกวิธีนี้
                          </button>
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

/* ====== ไอคอนแบบ SVG ในไฟล์เดียว ไม่ต้องโหลด asset ภายนอก ====== */
function EspressoIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Espresso">
      <rect x="10" y="22" width="36" height="22" rx="4" fill="#8B5E3C" />
      <rect x="10" y="22" width="36" height="10" rx="4" fill="#3B2A1E" />
      <path d="M46 26h6a6 6 0 0 1 0 12h-6z" fill="#8B5E3C" />
      <rect x="14" y="44" width="28" height="4" rx="2" fill="#A0785A" />
    </svg>
  );
}
function DripIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Pour Over">
      <path d="M12 18h40l-8 12H20z" fill="#C4B5A5" />
      <rect x="22" y="30" width="20" height="10" fill="#8B5E3C" />
      <rect x="28" y="40" width="8" height="10" fill="#3B2A1E" />
      <rect x="24" y="50" width="16" height="2" fill="#6B7280" />
    </svg>
  );
}
function FrenchPressIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="French Press">
      <rect x="18" y="16" width="28" height="36" rx="4" fill="#C4B5A5" />
      <rect x="22" y="22" width="20" height="24" fill="#8B5E3C" />
      <rect x="46" y="24" width="6" height="16" rx="3" fill="#6B7280" />
      <rect x="18" y="12" width="28" height="4" fill="#6B7280" />
    </svg>
  );
}
function MokaIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Moka Pot">
      <path d="M26 14h12l2 10H24z" fill="#9CA3AF" />
      <path d="M22 24h20l-4 24H26z" fill="#6B7280" />
      <rect x="16" y="24" width="6" height="12" fill="#4B5563" />
      <rect x="42" y="26" width="6" height="10" fill="#4B5563" />
    </svg>
  );
}
