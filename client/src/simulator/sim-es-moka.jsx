'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase"; // <- ปรับ path ให้ตรงกับโครงสร้างจริง

// Navbar (อยู่ใน src/navbar.jsx)
import Navbar from "../navbar";

export default function MokaPotEspressoGame() {
  // --- Recipe state (ตัดโหมดอุปกรณ์ออก เหลือเฉพาะสูตร) ---
  const [grind, setGrind] = useState("medium-fine");
  const [dose, setDose] = useState(16);
  const [water, setWater] = useState(100);
  const [heat, setHeat] = useState(6); // 1-10
  const [targetTime, setTargetTime] = useState(110);
  const [preheat, setPreheat] = useState(true);
  const [overpack, setOverpack] = useState(false);
  const [cupPreheated, setCupPreheated] = useState(false);

  // --- Simulation/output state ---
  const [message, setMessage] = useState("พร้อมชง — ตั้งสูตรของคุณแล้วกด Start");
  const [isBrewing, setIsBrewing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [temp, setTemp] = useState(25);
  const [pressure, setPressure] = useState(0);
  const [result, setResult] = useState(null);

  const [isResultOpen, setIsResultOpen] = useState(false);

  // --- Auth & favorites ---
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // --- LIGHT SELF TESTS (ไม่แตะของเดิม เพิ่มกรณี) ---
  useEffect(() => {
    try {
      const good = evaluateCup({ grind: "medium-fine", dose: 17, water: 105, heat: 6, targetTime: 110, preheat: true, overpack: false, cupPreheated: true });
      console.assert(good.score >= 70, "expected good >= 70, got", good.score);
      const bad = evaluateCup({ grind: "fine", dose: 10, water: 130, heat: 10, targetTime: 200, preheat: false, overpack: true, cupPreheated: false });
      console.assert(bad.score <= 60, "expected bad <= 60, got", bad.score);
      const A = { grind: "medium-fine", dose: 16, water: 100, heat: 6, targetTime: 110, preheat: true, overpack: false };
      console.assert(recipeEquals(A, { ...A }), "recipeEquals should be true");
      console.assert(!recipeEquals(A, { ...A, dose: 18 }), "recipeEquals should be false when changed");
      const over1 = evaluateCup({ ...A, overpack: true });
      const over0 = evaluateCup({ ...A, overpack: false });
      console.assert(over1.score < over0.score, "overpack should reduce score");
      const p0 = evaluateCup({ ...A, preheat: false });
      const p1 = evaluateCup({ ...A, preheat: true });
      console.assert(p1.score >= p0.score, "preheat should help or equal");
    } catch (e) {
      console.warn("self-tests failed:", e);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub && unsub();
  }, []);

  useEffect(() => {
    if (!user) { setFavorites([]); return; }
    const colRef = collection(db, "users", user.uid, "mokapotFavorites");
    const unsub = onSnapshot(colRef, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFavorites(list);
    });
    return () => unsub();
  }, [user]);

  const SAFETY_VALVE_ML = 120;
  const intervalRef = useRef(null);

  const reset = () => {
    setIsBrewing(false);
    setProgress(0);
    setTemp(25);
    setPressure(0);
    setMessage("พร้อมชง — ตั้งสูตรของคุณแล้วกด Start");
    setResult(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startBrew = () => {
    setResult(null);
    // เงื่อนไขขั้นต่ำ (ตัดประกอบอุปกรณ์ออก)
    if (water <= 0) return setMessage("ยังไม่มีน้ำ");
    if (water >= SAFETY_VALVE_ML) return setMessage("น้ำเกินระดับวาล์วนิรภัย — ลดน้ำก่อนเริ่ม");
    if (dose <= 0) return setMessage("ยังไม่ได้ใส่ผงกาแฟ");

    setIsBrewing(true);
    setMessage("กำลังขึ้นอุณหภูมิและความดัน…");

    const totalMs = targetTime * 1000;
    const tickMs = 100;
    const steps = Math.max(1, Math.floor(totalMs / tickMs));
    let step = 0;

    const heatFactor = heat / 10;
    const preheatedStart = preheat ? 65 : 25;
    let curTemp = preheatedStart;
    let curPressure = 0;
    setTemp(preheatedStart);
    setPressure(0);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      step += 1;
      const p = Math.min(100, Math.round((step / steps) * 100));
      const targetTemp = 92 + (heat > 8 ? 4 : 0);
      const tRise = preheat ? 0.1 : 0.06;
      curTemp = Math.min(targetTemp, curTemp + (targetTemp - curTemp) * (tRise * heatFactor));
      let flowResistance = 1.0;
      if (grind === "fine") flowResistance += 0.45;
      if (grind === "medium-fine") flowResistance += 0.25;
      if (overpack) flowResistance += 0.35;
      const basePressure = Math.min(3.0, ((curTemp - 70) / 10) * heatFactor * flowResistance);
      curPressure = Math.max(0, Math.min(3.0, basePressure));
      let msg = "น้ำกำลังเดือดเบา ๆ…";
      if (curPressure > 1.5 && curTemp > 85) msg = "เริ่มมีเสียงฮึม… กาแฟไหลสวย!";
      if (heat >= 9 && curTemp > 90) msg = "ระวัง! ไฟแรงเกินไป อาจไหม้/ขม";
      if (overpack && curPressure > 2.4) msg = "แรงดันสูงมาก! เสี่ยงอุดตัน/ไหม้";
      setProgress(p);
      setTemp(curTemp);
      setPressure(curPressure);
      setMessage(msg);
      if (p >= 100 || (heat >= 10 && curTemp > 95) || (overpack && curPressure > 2.8)) {
        finishBrew(p >= 100 ? "ครบเวลา" : "หยุดก่อน — เพื่อความปลอดภัย");
      }
    }, tickMs);
  };

  const stopBrew = () => finishBrew("หยุดด้วยตนเอง");

  const finishBrew = (why = "เสร็จสิ้น") => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsBrewing(false);
    setMessage(why + " — ประเมินรสชาติกำลังมา…");
    const scoreObj = evaluateCup({ grind, dose, water, heat, targetTime, preheat, overpack, cupPreheated });
    setResult(scoreObj);
    setIsResultOpen(true);
  };

  useEffect(() => () => intervalRef.current && clearInterval(intervalRef.current), []);

  const currentRecipe = { grind, dose, water, heat, targetTime, preheat, overpack };
  const isCurrentFav = favorites.some((f) => recipeEquals(f, currentRecipe));

  const toggleFavorite = async () => {
    try {
      if (!user) { setMessage("กรุณาเข้าสู่ระบบเพื่อบันทึกเมนูชื่นชอบ"); return; }
      const colRef = collection(db, "users", user.uid, "mokapotFavorites");
      const match = favorites.find((f) => recipeEquals(f, currentRecipe));
      if (match) {
        await deleteDoc(doc(db, "users", user.uid, "mokapotFavorites", match.id));
        setMessage("ลบเมนูชื่นชอบแล้ว");
      } else {
        await addDoc(colRef, { ...currentRecipe, createdAt: serverTimestamp() });
        setMessage("บันทึกเมนูชื่นชอบแล้ว");
      }
    } catch (e) {
      setMessage("บันทึกเมนูล้มเหลว: " + (e?.message || "unknown"));
    }
  };

  const applyFavorite = (f) => {
    if (!f) return;
    setGrind(f.grind);
    setDose(f.dose);
    setWater(f.water);
    setHeat(f.heat);
    setTargetTime(f.targetTime);
    setPreheat(!!f.preheat);
    setOverpack(!!f.overpack);
  };

  // --- Layout: ให้ส่วนหลักสูงพอดีกับหน้าจอ "window" โดยรวมความสูง Navbar (12vh) ---
  return (
    <div className="h-screen w-full overflow-hidden bg-[#f3f1ec] text-[#2a1c14]">
      <Navbar />

      {/* ใช้ calc(100vh-12vh) เพื่อให้พื้นที่หลักพอดีกับหน้าจอรวม Navbar */}
      <main className="relative mx-auto max-w-full px-4 md:px-8 py-4 h-[calc(100vh-56px)] overflow-hidden flex flex-col">
        {/* decor เบลอจาง */}
        <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-[#b5835a]/10 blur-2xl translate-x-1/3 -translate-y-1/3" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#3e2a1f]/10 blur-2xl -translate-x-1/3 translate-y-1/3" />

        {/* Header กะทัดรัดให้พอดี viewport */}
        <header className="mb-4 text-center md:text-left">
          <p className="uppercase tracking-widest text-xs text-[#3e2a1f]/70">Brew Simulator</p>
          <h1 className="mt-1 text-2xl md:text-4xl font-extrabold">Moka Pot Espresso — Brewing Simulator</h1>
        </header>

        {/* Grid หลักกินพื้นที่ที่เหลือของ viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 items-stretch">
          {/* left: recipe & results */}
          <section className="lg:col-span-2 md:top-4 self-start min-h-0">
            <Card title="ช่วงค่าที่แนะนำ">
                <ul className="text-sm space-y-1 text-start">
                    <li>ความละเอียด <br/><b>Medium‑Fine</b></li>
                    <li>ผงกาแฟ <br/><b>16–18 g</b></li>
                    <li>น้ำ <br/><b>95–115 ml</b></li>
                    <li>ระดับความร้อน<br/><b>5–7/10</b></li>
                    <li>เวลาทั้งหมด <br/><b>90–130 s</b></li>
                </ul>
            </Card>
          </section>
          <section className="lg:col-span-7 min-h-0 h-full self-stretch">
            <Card className="h-full flex flex-col" title="ตั้งค่าสูตร / Recipe" action={<HeartButton active={isCurrentFav} disabled={!user} onClick={toggleFavorite} /> }>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0 overflow-auto">
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Grind Size</Label>
                    <Info title="Grind Size">ขนาดความละเอียดมีผลต่อแรงดันและเวลาสกัด: ละเอียดเกินไปจะขมและเสี่ยงอุดตัน หยาบไปจะจาง</Info>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {["fine", "medium-fine", "medium"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrind(g)}
                        disabled={grind === g}
                        className={
                          "px-3 py-1.5 rounded-xl border transition disabled:opacity-60 disabled:cursor-not-allowed " +
                          (grind === g ? "bg-[#6f4e37]/10 border-[#6f4e37] text-[#6f4e37]" : "border-neutral-300 hover:border-neutral-400 text-[#2a1c14]")
                        }
                      >
                        {title(g)}
                      </button>
                    ))}
                  </div>
                </div>

                <Slider label={`Dose (กาแฟ) — ${dose} g`} min={12} max={22} step={0.5} value={dose} onChange={setDose} />
                <Slider label={`Water (น้ำ) — ${water} ml`} min={80} max={130} step={1} value={water} onChange={setWater} />
                <Slider label={`Heat (ไฟ) — ${heat}/10`} min={1} max={10} step={1} value={heat} onChange={setHeat} />
                <Slider label={`Target Brew Time — ${targetTime} s`} min={70} max={180} step={1} value={targetTime} onChange={setTargetTime} />

                <div className="flex items-center gap-3">
                  <Toggle checked={preheat} onChange={setPreheat} label="Preheat Water (อุ่นน้ำก่อน)" />
                  <Info title="Preheat Water">ใช้น้ำอุ่นช่วยลดเวลาที่ฐานสัมผัสไฟ ลดโอกาสเกิดกลิ่นไหม้โลหะ</Info>
                </div>
                <div className="flex items-center gap-3">
                  <Toggle checked={overpack} onChange={setOverpack} label="Overpack/Tamp (อัดแน่น) — ไม่แนะนำ" />
                  <Info title="Overpack">หม้อโมก้าไม่ต้องแทมป์แน่นเหมือนเครื่องเอสเพรสโซ อาจทำให้แรงดันสูงและขม</Info>
                </div>
                <div className="flex items-center gap-3">
                  <Toggle checked={cupPreheated} onChange={setCupPreheated} label="Preheat Cup (อุ่นแก้ว)" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {!isBrewing ? (
                  <button onClick={startBrew} className="px-4 py-2 rounded-full bg-[#2a1c14] text-white font-semibold shadow">Start</button>
                ) : (
                  <button onClick={stopBrew} className="px-4 py-2 rounded-full bg-[#b5835a] text-white font-semibold shadow">Stop</button>
                )}
                <button onClick={reset} className="px-4 py-2 rounded-full bg-white border border-neutral-300 hover:border-neutral-400">Reset</button>
                <span className="text-sm text-[#2a1c14]/70">{message}</span>
              </div>
            </Card>
          </section>

          {/* right: visualization & meters */}
          <section className="lg:col-span-3 min-h-0 h-full self-stretch">
            <Card className="h-full flex flex-col" title="Moka Pot — Visualization">
              <div className="flex flex-col items-center gap-8 h-full">
                <MokaSVG progress={progress} pressure={pressure} temp={temp} />
                <div className="w-full space-y-4">
                  <MiniMeter label={"Progress"} value={progress} suffix="%" />
                  <MiniMeter label={"Temp"} value={Math.round(temp)} suffix="°C" max={100} />
                  <MiniMeter label={"Pressure"} value={pressure.toFixed(2)} suffix=" bar" max={3} />
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
      {isResultOpen && (<ResultModal data={result} onClose={() => setIsResultOpen(false)} />)}
    </div>
  );
}

function DragPiece({ name, placed }) {
  return (
    <div draggable={!placed} onDragStart={(e) => e.dataTransfer.setData("text/plain", name)} className={(placed ? "opacity-40 " : "") + "px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-sm capitalize"} title={placed ? "Placed" : "Drag me"}>
      {labelFromKey(name)}
    </div>
  );
}

function DropSlot({ name, occupied, onDropPiece }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const piece = e.dataTransfer.getData("text/plain");
    if (piece === name) onDropPiece(name);
  };
  return (
    <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className={"h-16 rounded-xl border flex items-center justify-center text-sm " + (occupied ? "border-[#2ecc71] bg-[#2ecc71]/10 text-[#2a1c14]" : "border-dashed border-neutral-300 text-[#2a1c14]/60") }>
      {occupied ? "Placed: " + labelFromKey(name) : "Drop: " + labelFromKey(name)}
    </div>
  );
}

function labelFromKey(k) {
  const map = { grinder: "Grinder", basket: "Filter Basket", boiler: "Boiler (Lower)", upper: "Upper Chamber", stove: "Stove", lid: "Lid" };
  return map[k] || k;
}

function title(s) { return s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-"); }
function Label({ children }) { return <div className="text-sm text-[#2a1c14] font-medium">{children}</div>; }

function Card({ title, children, action=null, className="" }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur p-5 shadow-[0_12px_32px_rgba(0,0,0,0.08)] ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Slider({ label, min, max, step = 1, value, onChange, disabled=false }) {
  return (
    <div className={disabled ? "opacity-60" : ""}>
      <Label>{label}</Label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full mt-2 accent-[#6f4e37]" disabled={disabled} />
      <div className="flex justify-between text-xs text-[#2a1c14]/60"><span>{min}</span><span>{max}</span></div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-2 select-none cursor-pointer">
      <span className={"h-5 w-10 rounded-full transition relative " + (checked ? "bg-[#2a1c14]/70" : "bg-neutral-300")}>
        <span className={"absolute top-0.5 h-4 w-4 rounded-full bg-white shadow " + (checked ? "left-5" : "left-1")} />
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="hidden" />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function Info({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen((v) => !v)} className="text-xs px-2 py-1 rounded-full border border-neutral-300 hover:border-neutral-400 text-[#2a1c14] bg-white">i</button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-3 text-xs text-[#2a1c14] shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
            <div className="font-semibold mb-1">{title}</div>
            <div>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniMeter({ label, value, suffix = "", max = 100 }) {
  const pct = Math.max(0, Math.min(100, (parseFloat(value) / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs text-[#2a1c14]/70 mb-1"><span>{label}</span><span>{value}{suffix}</span></div>
      <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden"><div className="h-full bg-[#6f4e37]" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function HeartButton({ active, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label="Toggle Favorite" title={disabled ? "เข้าสู่ระบบก่อน" : active ? "ลบจากชื่นชอบ" : "บันทึกเป็นชื่นชอบ"} className={"rounded-full p-2 border transition " + (active ? "border-[#b5651d] bg-[#b5651d]/10 text-[#b5651d]" : "border-neutral-300 hover:border-neutral-400 text-[#2a1c14] disabled:opacity-50 disabled:cursor-not-allowed") }>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-6.7-4.3-9.2-7.7C-0.6 9.1 3 3.8 7.7 6.2 9.3 7 10.2 8.5 12 9.6c1.8-1.1 2.7-2.6 4.3-3.4 4.7-2.4 8.3 2.9 4.9 7.1C18.7 16.7 12 21 12 21z"/>
      </svg>
    </button>
  );
}

function ScoreBadge({ label, value }) {
  return (
    <div className="rounded-2xl bg-white border border-neutral-200 p-4 text-center">
      <div className="text-sm text-[#2a1c14]/70">{label}</div>
      <div className="text-3xl font-bold mt-1">{Math.round(value)}</div>
      <Stars n={Math.round(value / 20)} />
    </div>
  );
}

function Stars({ n }) {
  const arr = new Array(5).fill(0).map((_, i) => i < n);
  return (
    <div className="mt-2 flex justify-center gap-1">
      {arr.map((filled, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className={filled ? "text-[#b5835a]" : "text-neutral-400"} stroke="currentColor">
          <path d="M12 17.3l-5.4 3.2 1.6-6.1-4.7-4.1 6.2-.5L12 4l2.3 5.8 6.2.5-4.7 4.1 1.6 6.1z"/>
        </svg>
      ))}
    </div>
  );
}

function BadgeRow({ label, value }) { return <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2"><span className="text-[#2a1c14]/70 text-sm">{label}</span><span className="font-semibold">{value}</span></div>; }
function fmt(v) { if (typeof v === "number") return Math.round(v * 10) / 10; return String(v); }

function MokaSVG({ progress, pressure, temp, onStove=false, assembled=false }) {
  const fillPct = Math.max(0, Math.min(100, progress));
  return (
    <div className="w-full flex items-center justify-center">
      <svg viewBox="0 0 220 260" className="w-60 drop-shadow">
        {onStove && (
          <g>
            <path d="M110 210 C95 205, 85 215, 110 230 C135 215, 125 205, 110 210" fill="#6f4e37" opacity="0.8">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
            </path>
          </g>
        )}
        <path d="M50 200 L170 200 L160 150 L60 150 Z" fill="#aaaaaa" stroke="#888"/>
        <path d="M60 150 L160 150 L170 80 L50 80 Z" fill="#bbbbbb" stroke="#999"/>
        <path d="M50 80 L170 80 L160 60 L60 60 Z" fill="#a6a6a6" stroke="#8a8a8a"/>
        <path d="M60 60 L160 60 L150 45 L70 45 Z" fill={assembled ? "#9a9a9a" : "#b5b5b5"} stroke="#8a8a8a"/>
        <path d="M170 120 C195 115,195 165,170 160" fill="none" stroke="#c9c9c9" strokeWidth="10" strokeLinecap="round"/>
        <clipPath id="chamber"><path d="M50 80 L170 80 L160 60 L60 60 Z" /></clipPath>
        <rect x="50" y={80 - (fillPct/100)*20} width="120" height={20} fill="#8B6E4A" clipPath="url(#chamber)"/>
        <text x="110" y="245" textAnchor="middle" fill="#6b6b6b" fontSize="12">Temp: {Math.round(temp)}°C | Pressure: {pressure.toFixed(2)} bar</text>
      </svg>
    </div>
  );
}

function evaluateCup({ grind, dose, water, heat, targetTime, preheat, overpack, cupPreheated }) {
  const notes = [];
  let score = 100;

  // ===== เดิม: logic ให้คะแนน =====
  const penalizeRange = (val, [lo, hi], weight, label) => {
    let pen = 0;
    if (val < lo) pen = (lo - val) ** 1.2;
    if (val > hi) pen = (val - hi) ** 1.2;
    score -= pen * weight;
    if (pen > 0.5) notes.push(`${label}: ค่าหลุดช่วงแนะนำ (${val})`);
  };

  if (grind !== "medium-fine") {
    score -= grind === "fine" ? 7 : 5;
    notes.push(`Grind: ควรใช้ Medium-Fine (ตอนนี้: ${grind})`);
  }
  penalizeRange(dose, [16, 18], 1.3, "Dose");
  penalizeRange(water, [95, 115], 0.9, "Water");
  penalizeRange(heat, [5, 7], 4.0, "Heat");
  penalizeRange(targetTime, [90, 130], 0.8, "Time");

  if (!preheat) { score -= 6; notes.push("ไม่พรีฮีต: อาจได้กลิ่นไหม้โลหะเล็กน้อยจากฐานหม้อ"); }
  if (overpack) { score -= 12; notes.push("อัดแน่นเกิน: เสี่ยงอุดตัน/ไหม้ ทำให้ขม"); }
  if (cupPreheated) { score += 2; notes.push("อุ่นแก้ว: รักษาอุณหภูมิช็อตได้ดีขึ้น"); }

  // body/acidity/bitterness/crema/balance (เดิม)
  let body = clamp01((dose - 14) / 6 + (grind === "fine" ? 0.2 : grind === "medium-fine" ? 0.1 : 0));
  let acidity = clamp01(0.6 - (targetTime - 90) / 120 - (heat - 5) * 0.05);
  let bitterness = clamp01(0.3 + (heat - 5) * 0.12 + (targetTime - 110) * 0.005 + (overpack ? 0.2 : 0));
  let crema = clamp01(0.4 + (grind === "medium-fine" ? 0.2 : grind === "fine" ? 0.15 : 0) + (dose - 16) * 0.02);
  const balance = clamp01(1 - Math.abs(acidity - 0.45) - Math.max(0, bitterness - 0.5) * 0.6);

  // ===== ใหม่: คำนวณข้อมูลเชิงอธิบาย =====
  const ratio = water / Math.max(1, dose); // ml/g
  const strength =
    ratio <= 5.5 ? "เข้มมาก" :
    ratio <= 6.5 ? "เข้ม" :
    ratio <= 7.5 ? "กลาง" : "อ่อน";

  // TDS ประมาณ (Moka ปกติ ~2–4%)
  let tdsBase = 18 / ratio; // 6:1 ~3.0%
  let tdsAdj = 0;
  if (grind === "fine") tdsAdj += 0.3;
  if (heat >= 8) tdsAdj += 0.2;
  if (targetTime >= 120) tdsAdj += 0.2;
  if (preheat) tdsAdj += 0.1;
  if (overpack) tdsAdj += 0.25;
  const tdsPct = round1(clamp(tdsBase + tdsAdj, 1.5, 4.5));

  // Yield ประมาณ (ผงดูดน้ำ ~1.7 ml/g)
  const yieldMl = Math.round(clamp(water - dose * 1.7, 20, 120));

  // คาเฟอีนโดยประมาณ (คาเฟอีนในผง ~1.2% ⇒ 12 mg/g, อัตราสกัด 0.55–0.85)
  const eff =
    clamp(0.55 + (targetTime - 90) / 160 * 0.25 + (heat - 5) * 0.03 + (grind === "fine" ? 0.06 : 0), 0.55, 0.85);
  const caffeineMg = Math.round(clamp(dose * 12 * eff, 60, 220)); // guard rails

  // จัดหมวดการสกัด
  const extraction =
    (targetTime < 85 || (heat >= 8 && grind === "medium")) ? "Under" :
    (targetTime > 140 || heat >= 9 || overpack) ? "Over" : "Ideal";

  // แท็กรสชาติ (เอาไว้แสดงเป็นชิป)
  const flavorTags = (() => {
    const t = ["ช็อกโกแลต", "นัทตี้"];
    if (strength === "เข้ม" || strength === "เข้มมาก") t.push("เข้มข้น");
    if (targetTime < 90) t.push("เปรี้ยวผลไม้");
    if (heat >= 8) t.push("คั่วไหม้/กลิ่นควัน");
    if (preheat) t.push("หวานสะอาด");
    if (overpack) t.push("ขมจัด");
    return Array.from(new Set(t));
  })();

  // คำแนะนำเสิร์ฟ
  const serve =
    strength === "เข้มมาก" ? "ดื่มเป็นช็อต/ริสเตรตโต้ หรือเติมน้ำ 40–80 ml เป็นอเมริกาโน" :
    strength === "เข้ม"     ? "ดื่มเดี่ยวได้ดี หรือทำอเมริกาโนเบา ๆ" :
    strength === "กลาง"     ? "เหมาะกับลาเต้/คาปูชิโน่ (นม 120–180 ml)" :
                               "เหมาะกับเมนูนม เพิ่มปริมาณผง/ลดน้ำเล็กน้อยถ้าอยากให้เข้มขึ้น";

  // ปรับคะแนนให้อยู่ใน 0–100 และขึ้นต้นคำแนะนำ
  score = Math.max(0, Math.min(100, score));
  if (score > 85) notes.unshift("ยอดเยี่ยม! กลิ่นรสกลมกล่อม เหมาะเป็นช็อตหรืออเมริกาโน");
  else if (score > 70) notes.unshift("ดีมาก! ปรับเล็กน้อยอาจยกระดับได้อีก");
  else if (score > 55) notes.unshift("พอใช้ — ลองลดไฟ/ปรับบดเพื่อบาลานซ์รส");
  else notes.unshift("ควรปรับสูตรใหม่ — ความร้อน/เวลา/การอัดแน่นส่งผลเสีย");

  return {
    score,
    body: round1(body),
    acidity: round1(acidity),
    bitterness: round1(bitterness),
    crema: round1(crema),
    balance: round1(balance),
    notes,
    // ใหม่
    ratio: round1(ratio),
    strength,
    tdsPct,
    yieldMl,
    caffeineMg,
    extraction,   // Under / Ideal / Over
    flavorTags,
    serve
  };
}

function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
function round1(x) { return Math.round(x * 10) / 10; }

function recipeEquals(a, b) {
  return (
    a?.grind === b?.grind &&
    Number(a?.dose) === Number(b?.dose) &&
    Number(a?.water) === Number(b?.water) &&
    Number(a?.heat) === Number(b?.heat) &&
    Number(a?.targetTime) === Number(b?.targetTime) &&
    Boolean(a?.preheat) === Boolean(b?.preheat) &&
    Boolean(a?.overpack) === Boolean(b?.overpack)
  );
}
// วางไว้ล่างสุดของไฟล์ (แทนตัวเดิม)
function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#6f4e37]/20 bg-[#6f4e37]/10 px-2.5 py-1 text-xs text-[#2a1c14]">
      {children}
    </span>
  );
}

function ResultModal({ data, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] grid place-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        {/* กล่องผลลัพธ์ */}
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 12, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="relative z-[61] w-[min(920px,94vw)] max-h-[86vh] overflow-auto rounded-2xl bg-white p-6 shadow-2xl"
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold">ผลลัพธ์การจำลอง</h3>
            <button
              onClick={onClose}
              className="rounded-full border px-3 py-1 text-sm hover:bg-neutral-50"
            >
              ปิด
            </button>
          </div>

          {data ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* ซ้าย: คะแนน + ค่าสรุปสั้น */}
              <div className="md:col-span-1 space-y-2">
                <ScoreBadge label="Score" value={data.score} />
                <BadgeRow label="Strength"   value={data.strength} />
                <BadgeRow label="Ratio (น้ำ:กาแฟ)" value={`${data.ratio}:1`} />
                <BadgeRow label="TDS (ประมาณ)" value={`${data.tdsPct}%`} />
                <BadgeRow label="Yield (ปริมาณช็อต)" value={`${data.yieldMl} ml`} />
                <BadgeRow label="คาเฟอีน (ประมาณ)" value={`${data.caffeineMg} mg`} />
                <BadgeRow label="Extraction" value={data.extraction} />

                <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
                  <div className="text-[#2a1c14]/70 text-sm mb-1">องค์ประกอบรส</div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.flavorTags.map((t, i) => <Chip key={i}>{t}</Chip>)}
                  </div>
                </div>

                <BadgeRow label="Balance"    value={fmt(data.balance)} />
                <BadgeRow label="Body"       value={fmt(data.body)} />
                <BadgeRow label="Acidity"    value={fmt(data.acidity)} />
                <BadgeRow label="Bitterness" value={fmt(data.bitterness)} />
                <BadgeRow label="Crema"      value={fmt(data.crema)} />
              </div>

              {/* ขวา: คำอธิบาย + คำแนะนำ */}
              <div className="md:col-span-2 space-y-4">
                <div className="rounded-xl border border-neutral-200 bg-[#f9f7f4] p-4">
                  <div className="font-semibold mb-1">สรุปโดยรวม</div>
                  <p className="text-sm text-[#2a1c14]">
                    โปรไฟล์โดยรวม <b>{data.strength}</b> (Ratio <b>{data.ratio}:1</b>, TDS ประมาณ <b>{data.tdsPct}%</b>) —
                    ปริมาณช็อตได้ราว <b>{data.yieldMl} ml</b> และคาเฟอีนประมาณ <b>{data.caffeineMg} mg</b>.
                    สถานะการสกัด: <b>{data.extraction}</b>.
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                  <div className="font-semibold mb-2">คำแนะนำการเสิร์ฟ</div>
                  <p className="text-sm">{data.serve}</p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                  <div className="font-semibold mb-2">ข้อสังเกต/สิ่งที่ปรับได้</div>
                  <ul className="list-disc list-inside text-[#2a1c14] space-y-1 text-sm">
                    {data.notes.map((n, i) => (<li key={i}>{n}</li>))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[#2a1c14]/70">ยังไม่มีผลลัพธ์</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

