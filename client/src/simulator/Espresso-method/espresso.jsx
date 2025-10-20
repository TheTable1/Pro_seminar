import React from "react";
import { motion } from "framer-motion";

/** สเปก (เผื่อคุณอยากอ้างอิงภายหลัง) */
export const ESPRESSO_SPEC = {
  methodId: "espresso",
  displayName: "เอสเพรสโซ",
  workflow: {
    steps: [
      { id: "preheat", label: "อุ่นหัวชง" },
      { id: "dose", label: "ใส่ผงกาแฟ" },
      { id: "tamp", label: "แทมป์" },
      { id: "lock_in", label: "ล็อกพอร์ตาฯ" },
      { id: "place_cup", label: "วางแก้ว" },
    ],
    requiresToStart: ["dose", "tamp", "lock_in", "place_cup"],
  },
  ingredients: {
    dose: { min: 14, max: 22, rec: 18 },
    water: { min: 25, max: 60, rec: 40 },
    time: { min: 20, max: 35, rec: 28 },
    grindOptions: ["fine"],
  },
};

export default function EspressoInteractive({
  progress = 0,
  pressure = 0,
  temp = 25,
  isBrewing = false,
  onStart = () => {},
  onStop = () => {},
}) {
  // ความยาวของสายน้ำ espresso (px) อิง progress ที่พ่อควบคุมอยู่แล้ว
  const streamLen = Math.max(0, Math.min(56, (progress / 100) * 56));
  // สีสถานะเล็ก ๆ ที่หัวชง (อิงแรงดัน)
  const barColor =
    pressure >= 8.5 ? "#b91c1c" : pressure >= 7 ? "#6f4e37" : "#c9a586";

  return (
    <div className="relative w-full">
      <div className="mx-auto w-full max-w-[820px] rounded-3xl border border-neutral-200 bg-white/70 p-6 backdrop-blur shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
        <div className="grid gap-4 md:grid-cols-2 items-center">
          {/* ภาพเครื่อง (SVG ไม่ต้องใช้ asset) */}
          <div className="flex items-center justify-center">
            <svg
              viewBox="0 0 320 240"
              className="w-[min(360px,84vw)] drop-shadow-sm"
            >
              {/* ตัวเครื่อง */}
              <rect
                x="20"
                y="20"
                width="280"
                height="140"
                rx="18"
                fill="#f4efe9"
                stroke="#d9cfc5"
                strokeWidth="2"
              />
              {/* หน้าปัดและ bar แรงดัน */}
              <circle cx="70" cy="90" r="22" fill="#fff" stroke="#d9cfc5" />
              <path
                d="M70 72 A18 18 0 1 1 69.9 72"
                fill="none"
                stroke="#c9a586"
                strokeWidth="3"
              />
              <line
                x1="70"
                y1="90"
                x2={70 + Math.cos(((pressure / 9) * Math.PI) - Math.PI / 2) * 16}
                y2={90 + Math.sin(((pressure / 9) * Math.PI) - Math.PI / 2) * 16}
                stroke="#2a1c14"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <rect
                x="108"
                y="76"
                width="180"
                height="12"
                rx="6"
                fill="#ece7e2"
              />
              <rect
                x="108"
                y="76"
                width={Math.max(6, Math.min(180, (pressure / 9) * 180))}
                height="12"
                rx="6"
                fill={barColor}
              />

              {/* หัวชง + พอร์ตาฯ */}
              <rect
                x="140"
                y="120"
                width="120"
                height="20"
                rx="10"
                fill="#c7b8aa"
              />
              <rect
                x="180"
                y="140"
                width="40"
                height="10"
                rx="5"
                fill="#a3917f"
              />
              <rect
                x="190"
                y="150"
                width="20"
                height="8"
                rx="4"
                fill="#8d7a68"
              />

              {/* น้ำ espresso (แอนิเมชันอาศัยความยาว) */}
              <motion.rect
                x="200"
                y="158"
                width="4"
                animate={{ height: isBrewing ? streamLen : 0 }}
                transition={{
                  type: "tween",
                  duration: 0.15,
                }}
                rx="2"
                fill="#6f4e37"
              />

              {/* แก้ว */}
              <rect
                x="188"
                y="158"
                width="28"
                height="38"
                rx="6"
                fill="#ffffff"
                stroke="#d9cfc5"
              />
              {/* ของเหลวในแก้ว */}
              <motion.rect
                x="190"
                y={158 + 38 - Math.max(2, (progress / 100) * 32)}
                width="24"
                height={Math.max(2, (progress / 100) * 32)}
                rx="4"
                fill="#6f4e37"
                transition={{ type: "tween", duration: 0.2 }}
              />

              {/* ฐานวางแก้ว */}
              <rect
                x="150"
                y="198"
                width="120"
                height="10"
                rx="5"
                fill="#d9cfc5"
              />
            </svg>
          </div>

          {/* แผงควบคุมย่อ */}
          <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4">
            <div className="text-sm text-[#2a1c14]/70">เอสเพรสโซ (Simulator)</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">
              {isBrewing ? "กำลังสกัด..." : "พร้อมชง"}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <Metric label="อุณหภูมิ" value={`${temp.toFixed(1)}°C`} hint="90–95°C" />
              <Metric label="แรงดัน" value={`${pressure.toFixed(1)} bar`} hint="~9 bar" />
              <Metric label="ความคืบหน้า" value={`${Math.round(progress)}%`} />
            </div>

            <div className="mt-4">
              {isBrewing ? (
                <button
                  onClick={onStop}
                  className="px-3 py-2 rounded-full bg-[#b5835a] text-white font-semibold shadow hover:brightness-105"
                >
                  ⏹ หยุดการชง
                </button>
              ) : (
                <button
                  onClick={onStart}
                  className="px-3 py-2 rounded-full bg-[#2a1c14] text-white font-semibold shadow hover:brightness-105"
                >
                  ☕ เริ่มชง
                </button>
              )}
            </div>

            <div className="mt-3 text-xs text-[#2a1c14]/70">
              เคล็ดลับ: ถ้าไหลเร็วไปให้บดละเอียดขึ้น/เพิ่มแรงกดแทมป์เล็กน้อย
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
      <div className="text-[11px] text-[#2a1c14]/60">{label}</div>
      <div className="text-lg font-semibold leading-tight">{value}</div>
      {hint && <div className="text-[11px] text-[#2a1c14]/60 mt-0.5">{hint}</div>}
    </div>
  );
}
