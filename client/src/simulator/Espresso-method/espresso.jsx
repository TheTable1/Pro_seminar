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
