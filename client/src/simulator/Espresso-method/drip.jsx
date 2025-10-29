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
