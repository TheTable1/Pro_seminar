// src/simulator/Espresso-method/moka.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------
   MOKA_SPEC: ข้อมูลครบให้ไฟล์หลักนำไปใช้
------------------------------------------------------------------- */
export const MOKA_SPEC = {
  methodId: "moka",
  displayName: "โมก้าพอต",

  // ขั้นตอนและเงื่อนไขก่อนเริ่มชง
  workflow: {
    steps: [
      { id: "place_base",    label: "วางฐาน" },
      { id: "fill_water",    label: "เติมน้ำ (ใต้วาล์ว)" },
      { id: "insert_funnel", label: "ใส่กรวย" },
      { id: "add_coffee",    label: "ใส่ผงกาแฟ" },
      { id: "attach_top",    label: "ปิดส่วนบน" },
    ],
    requiresToStart: ["place_base","fill_water","insert_funnel","add_coffee","attach_top"],
  },

  // อุปกรณ์/ชิ้นส่วนที่ลากจากซ้าย
  equipmentTokens: [
    { id: "place_base",    label: "ฐาน" },
    { id: "insert_funnel", label: "กรวย" },
    { id: "attach_top",    label: "ส่วนบน" },
  ],
  // mapping id ขั้นตอน -> คีย์ assembly ใน state ภายใน
  assemblyMap: { place_base: "base", insert_funnel: "funnel", attach_top: "top" },

  // ค่าช่วงวัตถุดิบ/ไฟ/เวลา + ตัวเลือกบด + ระดับวาล์ว
  ingredients: {
    // slider ยืดหยุ่นกว้างได้ แต่มีช่วงแนะนำแคบกว่า
    dose:  { min: 0,   max: 30,  rec: 17,  recMin: 16, recMax: 18 },
    water: { min: 0,   max: 200, rec: 105, recMin: 95,  recMax: 115 },
    heat:  { min: 1,   max: 10,  rec: 6,   recMin: 5,  recMax: 7  },
    time:  { min: 0,   max: 300, rec: 110, recMin: 90,  recMax: 130 },
    grindOptions: ["fine","medium-fine","medium"],
    safetyValveMl: 120,
  },

  // ไกด์ตามแนวรสชาติ
  flavorGuides: {
    bright: {
      label: "เบาบางดื่มง่าย",
      tips: [
        "ลดไฟ 1 สเต็ปเพื่อลดโทนไหม้",
        "เล็งเวลา 90–105 วิ และ ratio ค่อนข้างยาว",
      ],
      targets: { ratio: "1:6–1:7", time: "90–105 วิ", heat: "5–6/10" },
      explain: "ใช้อัตราส่วนยาว (น้ำมากต่อกาแฟ) เพื่อเน้นโทนใสเปรี้ยวหวาน ฉ่ำและคลีน",
    },
    balanced: {
      label: "กลมกล่อม",
      tips: [
        "ตั้งไฟ 5–7/10 และเวลา 100–120 วิ",
        "ถ้าขมปลายให้ลดไฟลงครึ่งสเต็ป",
      ],
      targets: { ratio: "1:5.5–1:6.5", time: "100–120 วิ", heat: "5–7/10" },
      explain: "อัตราส่วนกลาง รสสมดุล ระหว่างความหวานบอดี้กับความใส ไม่หนาและไม่บางเกินไป",
    },
    bold: {
      label: "เข้มข้น",
      tips: [
        "ไฟ 6–7/10 และเวลา 110–130 วิ",
        "บดละเอียดขึ้นเล็กน้อยเพื่อบอดี้หนา",
      ],
      targets: { ratio: "1:5–1:5.5", time: "110–130 วิ", heat: "6–7/10" },
      explain: "ใช้อัตราส่วนสั้น (น้ำน้อยต่อกาแฟ) เพื่อบอดี้หนา กลิ่นช็อกโกแลต/นัตชัด และเข้มติดทนนาน",
    },

      help: {
    place_base:   { how: "ลากชิ้น 'ฐาน' จากซ้ายไปวางในภาพจำลอง", why: "เป็นฐานรองน้ำและเกิดแรงดัน" },
    fill_water:   { how: "เลื่อนสไลเดอร์ 'ปริมาณน้ำ' จากโซนน้ำให้ต่ำกว่าวาล์วนิรภัย", why: "ถ้าน้ำท่วมวาล์วอันตราย/ขมไหม้" },
    insert_funnel:{ how: "ลากชิ้น 'กรวย' ไปวางบนฐาน", why: "รองผงกาแฟและควบคุมทิศทางไหล" },
    add_coffee:   { how: "กดปุ่ม 'ใส่ผงกาแฟ' ในโซนกาแฟ (หรือปรับโดส)", why: "กำหนดความเข้ม/เวลาไหล" },
    attach_top:   { how: "ลากชิ้น 'ส่วนบน' ปิดให้ครบ", why: "ปิดระบบให้เกิดแรงดันดันกาแฟขึ้น" },
    },
  },

  // ผลลัพธ์ที่เป็นไปได้ (เงื่อนไขแบบง่าย)
  outcomes: [
    { condition: "heat>=9",        note: "ไฟแรงจัด เสี่ยงไหม้/ขม ให้ลดไฟลง 1 สเต็ป" },
    { condition: "time<90",        note: "เวลาสั้น อาจเปรี้ยวสดแต่บอดี้บาง" },
    { condition: "time>130",       note: "เวลายาว เสี่ยงขมติดปลาย/ไหม้" },
    { condition: "ratio>6.5",      note: "อัตราส่วนยาว โปรไฟล์ใส-สว่าง" },
    { condition: "ratio<5.2",      note: "อัตราส่วนสั้น ให้บอดี้หนาและเข้ม" },
  ],
};

const GUIDE_IMG = {
  layout:  pub("simulator/Guide/p1.png"),   
  flavor:  pub("simulator/Guide/p2.png"),  
  coach:   pub("simulator/Guide/p3.png"),   
  equip:   pub("simulator/Guide/p4.png"),   
  moka:    pub("simulator/Guide/p5.png"),   
  coffee:  pub("simulator/Guide/p6.png"),   
  water:   pub("simulator/Guide/p7.png"),   
  extra:   pub("simulator/Guide/p8.png"),   
  knob:    pub("simulator/Guide/p9.png"),   
  timer:   pub("simulator/Guide/p10.png"),  
  summary: pub("simulator/Guide/p11.png"),
};

function pub(p) {
  let base = "/";
  try {
    if (typeof import.meta !== "undefined" && import.meta?.env?.BASE_URL) {
      base = import.meta.env.BASE_URL;
    } else if (typeof process !== "undefined" && process?.env?.PUBLIC_URL) {
      base = process.env.PUBLIC_URL;
    }
  } catch {}
  return `${String(base).replace(/\/+$/, "/")}${String(p).replace(/^\/+/, "")}`;
}

// === รูปชิ้นส่วน (อ่านจาก public/moka/*) ===
const IMG = Object.freeze({
  base:   pub("simulator/moka/base.png"),
  funnel: pub("simulator/moka/funnel.png"),
  top:    pub("simulator/moka/top.png"),
});

// แม็ปของ palette: id ของ token -> ไฟล์รูป
const IMG_BY_TOKEN = Object.freeze({
  place_base:    IMG.base,
  insert_funnel: IMG.funnel,
  attach_top:    IMG.top,
});

/* ---------------- คลังอุปกรณ์ (ซ้าย) — แสดงเป็นรูป ---------------- */
export function EquipmentPaletteImages({ tokens = [], onQuickPlace = () => {} }) {
  const onDragStart = (e, tokenId) => {
    e.dataTransfer.setData("text/plain", tokenId);
  };

  return (
    <div>
      <div className="text-xs text-[#2a1c14]/60 mb-2">
        ลากชิ้นส่วนไปวางบนภาพจำลอง หรือคลิกเพื่อวางทันที
      </div>

      <div className="grid grid-cols-3 gap-3">
        {tokens.map((t) => {
          const src = IMG_BY_TOKEN[t.id];
          return (
            <div key={t.id} className="group">
              <div
                role="button"
                tabIndex={0}
                draggable
                onDragStart={(e) => onDragStart(e, t.id)}
                onClick={() => onQuickPlace(t.id)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && onQuickPlace(t.id)
                }
                className="rounded-xl border border-amber-200 bg-white p-2 grid place-items-center
                           shadow-sm hover:shadow-md transition hover:bg-amber-50/60
                           cursor-grab active:cursor-grabbing select-none"
                title={t.label}
              >
                <img
                  src={src}
                  alt={t.label}
                  className="h-20 object-contain pointer-events-none"
                  draggable={false}
                />
              </div>
              <div className="mt-1 text-center text-xs text-amber-800/70">
                {t.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * MokaInteractive — จออินเทอร์แอคทีฟของโมก้าพอต
 * รองรับ drop จากพาเลตซ้าย + คลิกชิ้นส่วนบนเครื่อง
 */
export default function MokaInteractive({
  heat, setHeat,
  assembly, setAssembly,
  isBrewing, onStart, onStop,
  spec = MOKA_SPEC,
  onFlowMark = () => {},
  elapsedMs = 0,
  targetTime = 110,
  waterFilled,
  coffeeFilled,      // ← เพิ่ม
  isFinished,
  onReset,
  brewResult,
}) {
  const [dropHint, setDropHint] = useState(false);
  const onDragOver  = (e) => { e.preventDefault(); setDropHint(true); };
  const onDragLeave = () => setDropHint(false);
  const onDrop = (e) => {
    e.preventDefault(); setDropHint(false);
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    const key = spec.assemblyMap?.[id];
    if (!key) return;
    const hasWater  = !!waterFilled;
    const hasCoffee = !!coffeeFilled;
    const can = {
      base:   true,
      funnel: assembly.base && hasWater,
      top:    assembly.base && assembly.funnel && hasCoffee,
    };
    if (!can[key]) return;                  // ❌ ไม่ผ่านลำดับ → เมิน
    setAssembly(prev => ({ ...prev, [key]: true }));
    onFlowMark(id);
  };

  // คลิกชิ้นส่วนบนเครื่อง (base→funnel→top)
  const clickPart = (k) => {
    const hasWater  = !!waterFilled;   // ✅ ต้องประกาศในสโคปนี้
    const hasCoffee = !!coffeeFilled;  // ✅
    const can = {
      base:   true,
      funnel: assembly.base && hasWater,                      // ต้องวางฐาน + เติมน้ำก่อน
      top:    assembly.base && hasWater && assembly.funnel && hasCoffee, // ต้องใส่ผงก่อน
    };

    if (!can[k]) return;
    setAssembly((s) => ({ ...s, [k]: true }));
    const id = Object.entries(spec.assemblyMap || {}).find(([,v]) => v === k)?.[0];
    if (id) onFlowMark(id);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={
        "relative flex flex-col gap-2 " +
        (dropHint ? "ring-4 ring-emerald-200 rounded-2xl" : "")
      }
    >
      {/* เครื่อง — กลางจอ เด่นขึ้น */}
      <div className="relative w-full max-w-[960px] mx-auto rounded-3xl border border-amber-200 bg-white/80 backdrop-blur p-6 shadow-[0_12px_36px_rgba(180,83,9,0.12)]">
          {/* สปอร์ตไลต์อ่อนๆ ด้านหลังเครื่อง */}
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl
                          bg-[radial-gradient(62%_52%_at_50%_40%,rgba(245,158,11,0.14),transparent_65%)]" />
          <MokaSVG
            assembly={assembly}
            onClickPart={clickPart}
            waterFilled={waterFilled}
            coffeeFilled={coffeeFilled}
            isBrewing={isBrewing}
          />
      </div>

      {/* แผงควบคุม: ปรับไฟซ้าย • เวลา+ปุ่ม ขวา (การ์ดเดียว) */}
      <div className="w-full max-w-[860px] mx-auto">
        <div className=" p-2  ">
          <div className="grid md:grid-cols-2 items-center gap-6">
            {/* ซ้าย: ปรับไฟ */}
            <div className="md:pr-4">
              <StoveKnob heat={heat} setHeat={setHeat} disabled={isBrewing} isFinished={isFinished} isBrewing={isBrewing} onStart={onStart} resetAll={onReset}/>
            </div>

            {/* ขวา: เวลา + ปุ่มเริ่ม/หยุด */}
            <div className="md:pl-4 flex flex-col items-stretch">
              <TimerDisplay
                elapsedMs={elapsedMs}
                targetSec={targetTime}
                isBrewing={isBrewing}
              />
              <div className="mt-4 flex justify-start">
                {isFinished ? (
                  <button
                    onClick={onReset}
                    className="px-3 py-2 rounded-full bg-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition hover:-translate-y-[1px] active:translate-y-0"
                  >
                    ลองทำอีกรอบ
                  </button>
                ) : !isBrewing ? (
                  <button
                    onClick={onStart}
                    className="px-3 py-2 rounded-full bg-[#7a4112] text-white font-semibold shadow-lg hover:shadow-xs transition hover:-translate-y-[1px] active:translate-y-0"
                  >
                    ตั้งไฟ / เริ่มชง
                  </button>
                ) : (
                  <button
                    onClick={onStop}
                    className="px-3 py-2 rounded-full bg-[#b9773f] text-white font-semibold shadow-lg hover:shadow-xl transition hover:-translate-y-[1px] active:translate-y-0"
                  >
                    ⏹ หยุด
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SVG ของเครื่อง ================= */
function MokaSVG({
  assembly = {},
  onClickPart = () => {},
  waterFilled,
  coffeeFilled,  
  isBrewing = false,
}) {
  // กล่องสำหรับฮิตบ็อกซ์คลิก (อิง viewBox 0..220 x 0..260)
  const BOX = {
    base:   { x: 52, y: 138, w: 120, h: 96 },
    funnel: { x: 60, y: 86,  w: 110, h: 86 },
    top:    { x: 48, y: 36,  w: 128, h: 92 },
  };

  // รูปตาม “สถานะรวม” ของเครื่อง
  const STAGE_IMG = {
    outline: pub("simulator/moka/moka-Outline.png"),
    base:    pub("simulator/moka/base.png"),
    sec:     pub("simulator/moka/sec-moka.png"),
    secCoffee: pub("simulator/moka/sec-moka-coffee.png"), 
    full:    pub("simulator/moka/moka-full.png"),
    baseWater: pub("simulator/moka/base-water.png"),   
    boiling:   pub("simulator/moka/moka-boiling.gif"),
  };

  // ถ้าไม่ได้ส่ง waterFilled มา ให้ถือว่า "ไม่ล็อกตามน้ำ" (เพื่อความยืดหยุ่น)
  const hasWater = typeof waterFilled === "boolean" ? waterFilled : true;
  const hasCoffee = !!coffeeFilled;

  const stageSrc =
    (isBrewing && assembly.top) ? STAGE_IMG.boiling
  : (!assembly.funnel && assembly.base && hasWater) ? STAGE_IMG.baseWater
  :  assembly.top ? STAGE_IMG.full
  : (assembly.funnel && hasWater && hasCoffee) ? STAGE_IMG.secCoffee
  : (assembly.funnel && hasWater) ? STAGE_IMG.sec
  :  assembly.base ? STAGE_IMG.base
  :  STAGE_IMG.outline;

  // ฮิตบ็อกซ์โปร่งใสไว้คลิกทีละขั้น
  const Hit = ({ box, onClick }) => (
    <rect
      x={box.x} y={box.y} width={box.w} height={box.h}
      fill="transparent" style={{ cursor: "pointer" }}
      onClick={onClick}
    />
  );

  return (
    <div className="w-full flex items-center justify-center">
      <svg viewBox="0 0 220 260" className="w-[min(300px,84vw)] drop-shadow-lg">
        {/* รูปเดียวที่เปลี่ยนตามสถานะ */}
        <image
          href={stageSrc}
          x="0" y="0" width="220" height="260"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* ลำดับคลิก: base → funnel → top */}
        {!assembly.base && (
          <Hit box={BOX.base} onClick={() => onClickPart("base")} />
        )}
        {assembly.base && !assembly.funnel && hasWater &&(
          <Hit box={BOX.funnel} onClick={() => onClickPart("funnel")} />
        )}
        {assembly.base && assembly.funnel && !assembly.top && hasCoffee && (
          <Hit box={BOX.top} onClick={() => onClickPart("top")} />
        )}
      </svg>
    </div>
  );
}

/* ================= ปุ่มไฟครึ่งวงกลม ================= */
function StoveKnob({
  heat,
  setHeat,
  disabled,
  // เพิ่ม props ที่ใช้ด้านล่างนี้
  isFinished,
  onStart,
  resetAll,
  isBrewing,
}) {
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  const wrapRef = useRef(null);

  // ขนาดใหม่: ศูนย์กลางอยู่ในเฟรม → ไม่ลวงตาเอียง
  const W = 200, H = 80, P = 10, R = 72;
  const CX = W / 2, CY = R + P;
  const TRACK_W = 8;
  const KNOB_R  = 8;

  // จำกัดมุมเล็กน้อยไม่ให้ลูกบิดชนขอบ
  const ANGLE_EPS = 0.18;          // ~10°
  const ANG_MIN = Math.PI - ANGLE_EPS;       // ใกล้ขวา
  const ANG_MAX = ANGLE_EPS; // ใกล้ซ้าย

  const LEVELS = Array.from({length:10}, (_,i)=>i+1);

  const heatToTheta = (h) => {
    const lv = Math.max(1, Math.min(10, h));
    return ANG_MIN + ((lv - 1) / 9) * (ANG_MAX - ANG_MIN);
  };

  const thetaToHeat = (theta) => {
    const th = Math.max(Math.min(theta, ANG_MIN), ANG_MAX);
    const t = (th - ANG_MIN) / (ANG_MAX - ANG_MIN);
    return Math.max(1, Math.min(10, Math.round(t * 9) + 1));
  };

  const pointToHeat = (clientX, clientY) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const x = clientX - box.left;
    const y = clientY - box.top;
    if (y > CY + 2) return; // ครึ่งล่างไม่รับ
    const dx = x - CX;
    const dy = CY - y;
    let theta = Math.atan2(dy, dx);            // 0..π
    if (theta < 0) theta = 0;
    if (theta > Math.PI) theta = Math.PI;
    theta = Math.max(ANGLE_EPS, Math.min(Math.PI - ANGLE_EPS, theta));
    setHeat(thetaToHeat(theta));
  };

  useEffect(() => {
    const up = () => setDrag(false);
    const move = (e) => {
      if (!drag || disabled) return;
      const t = "touches" in e ? e.touches[0] : e;
      // ป้องกันหน้าเลื่อนตอนลาก
      if ("preventDefault" in e) e.preventDefault?.();
      pointToHeat(t.clientX, t.clientY);
    };
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchend", up);
    window.addEventListener("touchmove", move, { passive: false });
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchmove", move);
    };
  }, [drag, disabled]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (disabled) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); setHeat(h => Math.max(1, h - 1)); }
      if (e.key === "ArrowRight"){ e.preventDefault(); setHeat(h => Math.min(10, h + 1)); }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [disabled, setHeat]);

  const onDown = (e) => {
    if (disabled) return;
    setDrag(true);
    const t = "touches" in e ? e.touches[0] : e;
    // ป้องกันหน้าเลื่อนตอนแตะเริ่ม
    e.preventDefault?.();
    pointToHeat(t.clientX, t.clientY);
  };

  const theta = heatToTheta(heat);
  const knobX = CX + R * Math.cos(theta);
  const knobY = CY - R * Math.sin(theta);

  // เส้นครึ่งวงกลมแนวนอนเป๊ะ (ขวา→ซ้าย)
  const arcPath = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

  // เส้น active จาก "มุมขวา" (ANG_MIN) → knob
  const sx = CX + R * Math.cos(ANG_MIN);
  const sy = CY - R * Math.sin(ANG_MIN);
  // sweep-flag = 0 เพื่อวิ่งจากขวาไปซ้ายตามทิศที่เราต้องการ (ลองปรับเป็น 1 ถ้าต้องการกลับทิศ)
  const activePath = `M ${sx} ${sy} A ${R} ${R} 0 0 1 ${knobX} ${knobY}`;

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      className="w-[320px] mx-auto select-none rounded-xl border border-amber-200 bg-white/85 backdrop-blur px-2 py-1.5 shadow-[0_8px_24px_rgba(180,83,9,0.10)] focus:outline-none focus:ring-2 focus:ring-amber-300/70"
      aria-label="ปรับความแรงของไฟ"
    >
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={onDown}
        onTouchStart={onDown}
        className={disabled ? "opacity-50 block mx-auto" : "cursor-pointer block mx-auto"}
      >
        {/* track */}
        <path d={arcPath} fill="none" stroke="#f1e8dc" strokeWidth={TRACK_W} />

        {/* active gradient */}
        <defs>
          <linearGradient id="heatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f5d7a8" />
            <stop offset="55%" stopColor="#e8b987" />
            <stop offset="100%" stopColor="#b9773f" />
          </linearGradient>
        </defs>
        <path d={activePath} fill="none" stroke="url(#heatGrad)" strokeWidth={TRACK_W} strokeLinecap="round" />

        {/* ticks */}
        {LEVELS.map((lvl, i) => {
          const t = ANG_MIN + ((lvl - 1) / 9) * (ANG_MAX - ANG_MIN);
          const x1 = CX + (R - 10) * Math.cos(t);
          const y1 = CY - (R - 10) * Math.sin(t);
          const x2 = CX + (R + 4) * Math.cos(t);
          const y2 = CY - (R + 4) * Math.sin(t);
          return (
            <g key={i} onClick={() => !disabled && setHeat(lvl)} style={{ cursor: disabled ? "default" : "pointer" }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e6d3bf" strokeWidth="2" />
              {/* แสดงตัวเลขที่ระดับ 1,3,5,7,10 เพื่อลดความรก */}
              {(lvl === 1 || lvl === 3 || lvl === 5 || lvl === 7 || lvl === 10) && (
                <text
                  x={CX + (R + 14) * Math.cos(t)}
                  y={CY - (R + 14) * Math.sin(t) + 4}
                  textAnchor="middle"
                  className="fill-[#7a4112]"
                  style={{ fontSize: 10, fontWeight: 700, userSelect: "none" }}
                >
                  {lvl}
                </text>
              )}
              {/* ฮิตโซนวงกลมนิ่ม ๆ สำหรับคลิก */}
              <circle
                cx={CX + (R + 2) * Math.cos(t)}
                cy={CY - (R + 2) * Math.sin(t)}
                r={8}
                fill="transparent"
              />
            </g>
          );
        })}

        {/* knob */}
        <circle cx={knobX} cy={knobY} r={KNOB_R} fill="#2a1c14" />
        <circle cx={knobX} cy={knobY} r={KNOB_R * 0.44} fill="#fff" />

        {/* value */}
        <text x={CX} y={CY + 24} textAnchor="middle" className="fill-[#7a4112]" style={{ fontSize: 12, fontWeight: 800 }}>
          🔥 ระดับ {heat}/10
        </text>
      </svg>
      {/* แถบควบคุมเสริม: ปุ่ม -, + และปุ่มลัด */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => !disabled && setHeat(h => Math.max(1, h - 1))}
            className="h-7 w-7 rounded-full border border-amber-300 text-[#7a4112] text-sm grid place-items-center hover:bg-amber-50 disabled:opacity-50"
            disabled={disabled || heat <= 1}
            aria-label="ลดระดับไฟ"
          >
            –
          </button>
          <button
            type="button"
            onClick={() => !disabled && setHeat(h => Math.min(10, h + 1))}
            className="h-7 w-7 rounded-full border border-amber-300 text-[#7a4112] text-sm grid place-items-center hover:bg-amber-50 disabled:opacity-50"
            disabled={disabled || heat >= 10}
            aria-label="เพิ่มระดับไฟ"
          >
            +
          </button>
        </div>
        <div className="text-[11px] text-[#2a1c14]/60">
          {disabled ? "กำลังชง..." : "คลิกสเกลหรือใช้ปุ่มลัด"}
        </div>
        <div className="flex items-center gap-1">
          <QuickLevel onPick={(v)=>!disabled && setHeat(v)} label="ต่ำ" value={3} active={heat===3}/>
          <QuickLevel onPick={(v)=>!disabled && setHeat(v)} label="กลาง" value={6} active={heat===6}/>
          <QuickLevel onPick={(v)=>!disabled && setHeat(v)} label="สูง" value={8} active={heat===8}/>
        </div>
      </div>
    </div>
  );
}

function QuickLevel({ label, value, active, onPick }) {
  return (
    <button
      type="button"
      onClick={() => onPick?.(value)}
      className={
        "px-2.5 py-1 rounded-full border text-xs " +
        (active
          ? "border-amber-500 bg-amber-100 text-[#7a4112]"
          : "border-amber-300 bg-white hover:bg-amber-50 text-[#7a4112]")
      }
      aria-label={`ตั้งไฟระดับ ${value}`}
      title={`ตั้งไฟระดับ ${value}`}
    >
      {label}
    </button>
  );
}


function TimerDisplay({ elapsedMs = 0, targetSec = 110, isBrewing = false }) {
  const sec = Math.floor(elapsedMs / 1000);
  const pctRaw = sec / Math.max(1, targetSec);
  const pct = Math.max(0, Math.min(1, pctRaw)); // 0..1
  const state = pctRaw < 0.9 ? "normal" : pctRaw <= 1.1 ? "near" : "over";
  const barGrad = "linear-gradient(90deg,#fde68a,#fbbf24,#b9773f)";

  return (
    <div className="w-full">
      <div className="flex items-end gap-1">
        <span className="text-xs text-[#2a1c14]/60">
          {isBrewing ? "กำลังจับเวลา" : "เวลาที่ได้"}
        </span>
      </div>

      <div className="mt-1 flex items-baseline gap-3">
        <div className="text-lg md:text-2xl font-extrabold tracking-tight tabular-nums">
          {String(Math.floor(sec / 60)).padStart(1, "0")}:
          {String(sec % 60).padStart(2, "0")}
        </div>
        <div className="text-xs text-[#2a1c14]/60">เป้า ~{targetSec} วิ</div>
      </div>

      {/* progress bar */}
      <div className="mt-3 relative h-3 w-full rounded-full bg-amber-100/70">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width]"
          style={{ width: `${pct * 100}%`, background: barGrad }}
        />
        <div
          className="absolute -top-2 h-6 w-6 rounded-full border-2 border-white shadow transform -translate-x-1/2"
          style={{
            left: `${pct * 100}%`,
            backgroundColor: state === "over" ? "#b91c1c" : "#b9773f",
          }}
        />
      </div>

      <div className="mt-1 text-[11px] text-[#2a1c14]/60">
        {state === "normal" && "อุ่นเครื่อง/เริ่มไหล"}
        {state === "near"   && "ใกล้ถึงแล้ว — เตรียมหยุดให้ตรงเป้า"}
        {state === "over"   && "เลยเป้าแล้ว"}
      </div>
    </div>
  );
}
/* ---------------- คู่มืออินเทอร์แอคทีฟ (มีภาพประกอบ) ---------------- */
export function GuideOverlay({ open, onClose, step, onNext, onPrev, steps }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative z-[71] w-[min(960px,94vw)] max-h-[86vh] overflow-auto rounded-2xl bg-white shadow-2xl mx-3"
          >
            <div className="p-5 border-b flex items-center justify-between">
              <div className="font-bold text-4xl">คู่มืออธิบายการทำงาน</div>
              <button
                onClick={onClose}
                className="rounded-full border border-amber-300 px-3 py-1 text-sm hover:bg-amber-50"
              >
                ปิด
              </button>
            </div>

            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* ซ้าย: ข้อความ */}
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="text-xs text-[#2a1c14]/60 uppercase tracking-wider">
                      ขั้นตอน {step + 1} / {steps.length}
                    </div>
                    <h3 className="text-xl font-semibold mt-1">
                      {steps[step]?.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#2a1c14]" style={{ whiteSpace: "pre-line" }}>
                      {steps[step]?.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <button
                      onClick={onPrev}
                      disabled={step === 0}
                      className="px-3 py-1.5 rounded-full border disabled:opacity-50"
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      onClick={onNext}
                      disabled={step === steps.length - 1}
                      className="px-3 py-1.5 rounded-full border bg-amber-100 border-amber-300"
                    >
                      ถัดไป
                    </button>
                    {step === steps.length - 1 && (
                      <span className="text-xs text-[#2a1c14]/60">
                        ปิดหน้าต่างนี้ แล้วทำตาม UI ซ้าย/กลาง/ขวา
                      </span>
                    )}
                  </div>
                </div>

                {/* ขวา: ภาพประกอบ */}
                <div className="rounded-xl border border-amber-200 bg-[#fffaf2] p-3">
                  <GuideIllustration type={steps[step]?.image} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
function GuideIllustration({ type = "layout" }) {
  const src = GUIDE_IMG[type] || GUIDE_IMG.layout;
  return (
    <div className="w-full aspect-[16/10] grid place-items-center bg-[#faf9f7] rounded-xl border">
      <img
        src={src}
        alt={type}
        className="max-h-[320px] object-contain drop-shadow-sm"
        draggable={false}
      />
    </div>
  );
}

