import React from "react";
import { motion } from "framer-motion";

/** สเปก (เผื่อใช้งานภายหลัง) */
export const FRENCHPRESS_SPEC = {
  methodId: "frenchpress",
  displayName: "เฟรนช์เพรส",
  workflow: {
    steps: [
      { id: "preheat", label: "อุ่นกา" },
      { id: "add_coffee", label: "ใส่ผงกาแฟ" },
      { id: "pour", label: "รินน้ำ" },
      { id: "steep", label: "แช่" },
      { id: "press", label: "กดลูกสูบ" },
    ],
    requiresToStart: ["add_coffee", "pour"],
  },
  ingredients: {
    dose: { min: 16, max: 22, rec: 18 },
    water: { min: 250, max: 360, rec: 320 },
    time: { min: 180, max: 300, rec: 240 },
    grindOptions: ["coarse"],
  },
};

export default function FrenchPressInteractive({
  progress = 0,
  temp = 25,
  isBrewing = false,
  onStart = () => {},
  onStop = () => {},
}) {
  // ระดับของเหลวในกา (อิง progress)
  const fillH = Math.max(6, (progress / 100) * 70);
  // ตำแหน่งลูกสูบ (กดลงเล็กน้อยเมื่อ progress สูง)
  const plungerY = 70 + Math.min(36, (progress / 100) * 36);

  return (
    <div className="relative w-full">
      <div className="mx-auto w-full max-w=[820px] md:max-w-[820px] rounded-3xl border border-neutral-200 bg-white/70 p-6 backdrop-blur shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
        <div className="grid gap-4 md:grid-cols-2 items-center">
          {/* ภาพจำลอง (SVG) */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 320 260" className="w-[min(360px,84vw)] drop-shadow-sm">
              {/* ตัวโถแก้ว */}
              <rect x="80" y="70" width="160" height="120" rx="14" fill="#ffffff" stroke="#d9cfc5" strokeWidth="2" />
              {/* มือจับ */}
              <path d="M242 100 q28 18 0 36" fill="none" stroke="#c9b8a6" strokeWidth="10" strokeLinecap="round" />
              {/* ของเหลว */}
              <motion.rect
                x="84"
                y={190 - fillH}
                width="152"
                height={fillH}
                rx="10"
                fill="#c9a586"
                transition={{ type: "tween", duration: 0.2 }}
              />
              {/* ฝา + ก้านลูกสูบ */}
              <rect x="100" y="58" width="120" height="12" rx="6" fill="#c7b8aa" />
              <rect x="158" y="58" width="4" height="12" rx="2" fill="#a3917f" />
              {/* ลูกสูบ (จานกรอง) */}
              <motion.rect
                x="86"
                y={plungerY}
                width="148"
                height="6"
                rx="3"
                fill="#8d7a68"
                animate={{ opacity: isBrewing ? [0.9, 0.7, 0.9] : 0.9 }}
                transition={{ repeat: isBrewing ? Infinity : 0, duration: 1.6 }}
              />
              {/* ไอน้ำเล็ก ๆ */}
              {isBrewing && (
                <>
                  <motion.rect
                    x="120"
                    y="44"
                    width="2"
                    height="14"
                    rx="1"
                    fill="#d9cfc5"
                    animate={{ y: [44, 40, 44], opacity: [0.2, 0.6, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                  />
                  <motion.rect
                    x="198"
                    y="44"
                    width="2"
                    height="14"
                    rx="1"
                    fill="#d9cfc5"
                    animate={{ y: [44, 40, 44], opacity: [0.2, 0.6, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                  />
                </>
              )}
              {/* ฐาน */}
              <rect x="76" y="190" width="168" height="10" rx="5" fill="#d9cfc5" />
            </svg>
          </div>

          {/* แผงควบคุมย่อ */}
          <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4">
            <div className="text-sm text-[#2a1c14]/70">เฟรนช์เพรส</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">
              {isBrewing ? "กำลังแช่..." : "พร้อมเริ่ม"}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Metric label="อุณหภูมิ" value={`${temp.toFixed(1)}°C`} hint="90–94°C" />
              <Metric label="ความคืบหน้า" value={`${Math.round(progress)}%`} />
            </div>

            <div className="mt-4">
              {isBrewing ? (
                <button
                  onClick={onStop}
                  className="px-3 py-2 rounded-full bg-[#b5835a] text-white font-semibold shadow hover:brightness-105"
                >
                  ⏹ หยุด / กดลูกสูบ
                </button>
              ) : (
                <button
                  onClick={onStart}
                  className="px-3 py-2 rounded-full bg-[#2a1c14] text-white font-semibold shadow hover:brightness-105"
                >
                  ☕ เริ่มแช่
                </button>
              )}
            </div>

            <div className="mt-3 text-xs text-[#2a1c14]/70">
              เคล็ดลับ: คนเบา ๆ หลังรินน้ำครบ แล้วแช่ 4 นาทีค่อยกดลูกสูบ
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
