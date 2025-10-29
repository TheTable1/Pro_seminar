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
