import React from "react";
import { motion } from "framer-motion";

/** สเปก (เผื่อใช้งานภายหลัง) */
export const DRIP_SPEC = {
  methodId: "drip",
  displayName: "ดริป (Pour-over)",
  workflow: {
    steps: [
      { id: "rinse_filter", label: "ล้างกระดาษกรอง" },
      { id: "add_coffee", label: "ใส่ผงกาแฟ" },
      { id: "bloom", label: "bloom" },
      { id: "pour", label: "รินน้ำ" },
    ],
    requiresToStart: ["rinse_filter", "add_coffee", "bloom"],
  },
  ingredients: {
    dose: { min: 12, max: 22, rec: 16 },
    water: { min: 200, max: 360, rec: 300 },
    time: { min: 150, max: 240, rec: 190 },
    grindOptions: ["medium", "medium-coarse"],
  },
};

export default function DripInteractive({
  progress = 0,
  temp = 25,
  isBrewing = false,
  onStart = () => {},
  onStop = () => {},
}) {
  // ความสูงของน้ำที่หยดลงเซิร์ฟเวอร์ (โถรอง) จาก progress
  const fillH = Math.max(2, (progress / 100) * 50);

  return (
    <div className="relative w-full">
      <div className="mx-auto w-full max-w-[820px] rounded-3xl border border-neutral-200 bg-white/70 p-6 backdrop-blur shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
        <div className="grid gap-4 md:grid-cols-2 items-center">
          {/* ภาพจำลอง (SVG) */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 320 260" className="w-[min(360px,84vw)] drop-shadow-sm">
              {/* ดริปเปอร์ */}
              <path
                d="M60 60 L260 60 L220 120 L100 120 Z"
                fill="#f4efe9"
                stroke="#d9cfc5"
                strokeWidth="2"
              />
              {/* กระดาษกรอง */}
              <path
                d="M80 70 L240 70 L210 115 L110 115 Z"
                fill="#fff"
                stroke="#e6ded4"
              />
              {/* ผงกาแฟในกรอง */}
              <motion.ellipse
                cx="175"
                cy="104"
                rx="52"
                ry="12"
                fill="#6f4e37"
                animate={{ opacity: isBrewing ? [0.85, 0.6, 0.85] : 0.85 }}
                transition={{ repeat: isBrewing ? Infinity : 0, duration: 1.6 }}
              />

              {/* กาต้มน้ำ (ไอคอนด้านบนซ้าย) */}
              <motion.path
                d="M40 28 h50 a14 14 0 0 1 14 14 v10 h-78 z"
                fill="#ece7e2"
                stroke="#d9cfc5"
                animate={{ y: isBrewing ? [0, -2, 0] : 0 }}
                transition={{ repeat: isBrewing ? Infinity : 0, duration: 2 }}
              />
              {/* สายน้ำจากกาลงดริปเปอร์ */}
              {isBrewing && (
                <motion.rect
                  x="110"
                  y="70"
                  width="3"
                  height="42"
                  rx="2"
                  fill="#c9a586"
                  animate={{ height: [0, 42, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                />
              )}

              {/* เซิร์ฟเวอร์ (โถรอง) */}
              <path
                d="M90 120 C90 210, 230 210, 230 120"
                fill="#ffffff"
                stroke="#d9cfc5"
                strokeWidth="2"
              />
              <rect x="90" y="120" width="140" height="90" fill="#ffffff" />

              {/* น้ำที่ค่อย ๆ เพิ่ม */}
              <motion.rect
                x="92"
                y={210 - fillH}
                width="136"
                height={fillH}
                rx="6"
                fill="#c9a586"
                transition={{ type: "tween", duration: 0.2 }}
              />

              {/* ฐานวาง */}
              <rect x="60" y="212" width="200" height="10" rx="5" fill="#d9cfc5" />
            </svg>
          </div>

          {/* แผงควบคุมย่อ */}
          <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4">
            <div className="text-sm text-[#2a1c14]/70">ดริป (Pour-over)</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">
              {isBrewing ? "กำลังริน..." : "พร้อมเริ่ม"}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Metric label="อุณหภูมิ" value={`${temp.toFixed(1)}°C`} hint="91–94°C" />
              <Metric label="ความคืบหน้า" value={`${Math.round(progress)}%`} />
            </div>

            <div className="mt-4">
              {isBrewing ? (
                <button
                  onClick={onStop}
                  className="px-3 py-2 rounded-full bg-[#b5835a] text-white font-semibold shadow hover:brightness-105"
                >
                  ⏹ หยุด
                </button>
              ) : (
                <button
                  onClick={onStart}
                  className="px-3 py-2 rounded-full bg-[#2a1c14] text-white font-semibold shadow hover:brightness-105"
                >
                  ☕ เริ่มริน
                </button>
              )}
            </div>

            <div className="mt-3 text-xs text-[#2a1c14]/70">
              เคล็ดลับ: Bloom ~30–45 วิ แล้วรินแบ่งเป็นพัลส์ให้เสถียร
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
