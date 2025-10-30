// src/simulator/Espresso.jsx
import React, {useEffect,useMemo,useRef,useState,lazy,Suspense,useLayoutEffect,} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../navbar";
import { onAuthStateChanged } from "firebase/auth";
import {collection,addDoc,deleteDoc,doc,onSnapshot,serverTimestamp,} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

import { EquipmentPaletteImages, GuideOverlay } from "./Espresso-method/moka";
// ✅ lazy-load อุปกรณ์แต่ละเมธอด
const MokaInteractive = lazy(() => import("./Espresso-method/moka"));
const EspressoInteractive = lazy(() => import("./Espresso-method/espresso"));
const DripInteractive = lazy(() => import("./Espresso-method/drip"));
const FrenchPressInteractive = lazy(() =>
  import("./Espresso-method/frenchpress")
);

// ⚠️ โหลดสเปก/แมนิฟเฟสต์ของ Moka เฉพาะตอนต้องใช้
const loadMokaSpec = async () => {
  try {
    const mod = await import("./Espresso-method/moka");
    return mod.MOKA_SPEC || null;
  } catch {
    return null;
  }
};

const BASE_FLAVOR_INTENTS = [
  { id: "bright",   label: "สว่าง สดฉ่ำ (Bright)", tips: [/* optional */] },
  { id: "balanced", label: "สมดุล (Balanced)",       tips: [/* optional */] },
  { id: "bold",     label: "เข้ม หนืด (Bold)",       tips: [/* optional */] },
];

/* ---------------- Workflow สำรอง (สำหรับเมธอดอื่น) ---------------- */
const FALLBACK_WORKFLOWS = {
  espresso: {
    steps: [
      { id: "preheat", label: "อุ่นหัวชง" },
      { id: "dose", label: "ชั่ง/บด" },
      { id: "tamp", label: "แทมป์" },
      { id: "lock_in", label: "ล็อกพอร์ตาฯ" },
      { id: "place_cup", label: "วางแก้ว" },
    ],
    requiresToStart: ["dose", "tamp", "lock_in", "place_cup"],
  },
  drip: {
    steps: [
      { id: "rinse_filter", label: "ล้างกระดาษ/อุ่นดริปเปอร์" },
      { id: "add_coffee", label: "ใส่ผงกาแฟ" },
      { id: "bloom", label: "bloom" },
      { id: "pour", label: "รินจนจบ" },
    ],
    requiresToStart: ["rinse_filter", "add_coffee", "bloom"],
  },
  frenchpress: {
    steps: [
      { id: "preheat", label: "อุ่นกา/น้ำ" },
      { id: "add_coffee", label: "ใส่ผงกาแฟ" },
    ],
    requiresToStart: ["add_coffee", "pour"],
  },
};

// — คำอธิบายแบบย่อ (fallback) —
/* ==== ชื่อขั้นตอนแบบเป็นมิตร (ใช้โชว์ในหัวข้อ/บับเบิล) ==== */
const STEP_LABELS = {
  // Moka assembly / flow
  place_base:   "วางฐาน",
  insert_funnel:"ใส่กรวย",
  fill_water:   "เติมน้ำ",
  add_coffee:   "ใส่ผงกาแฟ",
  attach_top:   "ประกอบส่วนบน",

  // Espresso
  preheat:   "อุ่นหัวชง/อุปกรณ์",
  dose:      "ชั่ง/บดกาแฟ",
  tamp:      "แทมป์",
  lock_in:   "ล็อกพอร์ตาฯ",
  place_cup: "วางแก้ว",

  // Drip / FP
  rinse_filter: "ล้างกระดาษ/อุ่นดริปเปอร์",
  bloom:        "Bloom",
  pour:         "รินจนจบ",
};

/* ==== คำอธิบายแบบละเอียด (how/why/doNow) ==== */
const STEP_HINTS = {
  // ---------- Moka ----------
  place_base: {
    how:   "ลาก ‘ฐาน’ ไปวางในภาพจำลองตำแหน่งด้านล่างให้เข้าที่",
    why:   "เป็นจุดเริ่มประกอบทุกอย่าง และใช้เป็นภาชนะใส่น้ำร้อน",
    doNow: "ลากชิ้นส่วน ฐาน → เติมน้ำ → ใส่กรวย → ใส่ผงกาแฟ → ปิดส่วนบน",
  },
  insert_funnel: {
    how:   "ใส่กรวยลงบนฐานให้แน่น ขอบต้องนั่งพอดี",
    why:   "กรวยคอยรับผงกาแฟและจัดทางไหลของไอน้ำดันผ่านกาแฟ",
    doNow: "ถ้ายังใส่ไม่ได้ ให้เติมน้ำก่อน (อย่าเกินวาล์วนิรภัย)",
  },
  fill_water: {
    how:   "เลื่อนสไลเดอร์ ‘ปริมาณน้ำ’ แล้วกดปุ่ม ‘เติมน้ำ’",
    why:   "น้ำคือเชื้อเพลิง—ปริมาณที่เหมาะทำให้เวลาและรสเข้าที่",
    doNow: "แนะนำเติมต่ำกว่า ‘วาล์วนิรภัย’ เล็กน้อยเพื่อรสสมดุล",
  },
  add_coffee: {
    how:   "ตั้ง ‘โดสกาแฟ’ แล้วกด ‘ใส่ผงกาแฟ’ (อย่ากดแน่นเกิน)",
    why:   "โดสกำหนดความเข้มและแรงต้านการไหล—เกี่ยวกับเวลา/บอดี้โดยตรง",
    doNow: "เกลี่ยผิวให้เสมอ ไม่โป่ง เพื่อสกัดสม่ำเสมอ",
  },
  attach_top: {
    how:   "วางส่วนบนให้ตรงเกลียวแล้วหมุนจนแน่นพอดี",
    why:   "ต้องซีลสนิทเพื่อให้แรงดันดันผ่านผงกาแฟอย่างสม่ำเสมอ",
    doNow: "เช็ดขอบฐาน–กรวยให้แห้งก่อนปิด จะซีลง่ายขึ้น",
  },

  // ---------- Espresso ----------
  preheat: {
    how:   "เปิดหัวชงให้น้ำไหลสั้นๆ อุ่นพอร์ตาฯ/แก้วให้ร้อน",
    why:   "ลดการสูญเสียความร้อนช่วงแรก ทำให้ flow/รสคงที่ขึ้น",
    doNow: "ถ้าห้องเย็น/ใช้น้ำเย็น ควรพรีฮีตทุกครั้ง",
  },
  dose: {
    how:   "ชั่งเมล็ดตามสูตรและบดความละเอียดที่เหมาะกับตะแกรง",
    why:   "โดสและการบดส่งผลต่อเวลา 25–30 วินาทีและบอดี้ของช็อต",
    doNow: "ชิมแล้วค่อยปรับละเอียด/หยาบทีละครึ่งสเต็ป",
  },
  tamp: {
    how:   "กระจายผงให้เสมอ แล้วแทมป์กดตรงๆ นิ่งๆ น้ำหนักสม่ำเสมอ",
    why:   "ลด channeling ให้การสกัดสม่ำเสมอ รสคงที่",
    doNow: "อย่าบิดตอนยกแทมป์ ลดโอกาสผิวแตกร้าว",
  },
  lock_in: {
    how:   "สอดพอร์ตาฯ เข้าหัวชง หมุนจนแน่น ไม่ต้องฝืนเกินไป",
    why:   "ซีลแรงดัน 9 bar ให้ไหลตามเวลาที่ตั้งใจ",
    doNow: "เช็ดขอบกลุ่มหัว/ตะแกรงก่อนล็อกทุกครั้ง",
  },
  place_cup: {
    how:   "วางแก้วให้อยู่ตรงหัวชง ระยะห่างไม่มากเกิน",
    why:   "ป้องกันสาด/สูญเสียความร้อนและอะโรม่า",
    doNow: "แก้วอุ่นช่วยคงอุณหภูมิช็อตได้นานขึ้น",
  },

  // ---------- Drip / French press ----------
  rinse_filter: {
    how:   "ล้างกระดาษและอุ่นดริปเปอร์ด้วยน้ำร้อน เททิ้งก่อนเริ่ม",
    why:   "ขจัดกลิ่นกระดาษและรักษาอุณหภูมิให้คงที่",
    doNow: "อย่าลืมอุ่นแก้ว/คาราฟไปพร้อมกัน",
  },
  bloom: {
    how:   "รินน้ำ ~2–2.5× น้ำหนักกาแฟ พัก 30–45 วินาที",
    why:   "ไล่อากาศ/CO₂ ช่วยให้การไหลช่วงหลักสม่ำเสมอ",
    doNow: "ถ้าผิวไม่ยุบแปลว่ากาแฟใหม่มาก—รอให้ยุบก่อนค่อยรินต่อ",
  },
  pour: {
    how:   "รินเป็นรอบเล็กๆ สม่ำเสมอจนถึงปริมาณเป้าหมาย",
    why:   "ควบคุมเวลา/การสกัดให้ตรงโปรไฟล์ที่ต้องการ",
    doNow: "รักษาระดับน้ำคงที่ อย่ารินเฉพาะขอบถุงกระดาษ",
  },
};

/* ==== ตัวช่วยเรนเดอร์เนื้อหา InfoTip ของขั้นตอน ==== */
function renderStepTip(id) {
  const L = STEP_LABELS[id] || id;
  const H = STEP_HINTS[id] || {};
  return (
    <div className="space-y-1.5">
      <div className="font-medium">{L}</div>
      {H.how   && <div className="text-sm"><b>ทำยังไง:</b> {H.how}</div>}
      {H.why   && <div className="text-sm"><b>ทำไม:</b> {H.why}</div>}
      {H.doNow && <div className="text-sm"><b>ทำตอนนี้:</b> {H.doNow}</div>}
    </div>
  );
}


/* ---------------- หน้า Simulation หลัก ---------------- */
export default function BrewSimulator() {
  /* ------- meta & method ------- */
  const [recipeId, setRecipeId] = useState(null);
  const [method, setMethod] = useState("moka");
  const [intent, setIntent] = useState("balanced");

  /* ------- โหลดสเปกของ Moka ------- */
  const [mokaSpec, setMokaSpec] = useState(null);
  useEffect(() => {
    if (method === "moka" && !mokaSpec) {
      loadMokaSpec().then(setMokaSpec);
    }
  }, [method, mokaSpec]);

  const INTENT_OPTIONS = useMemo(() => {
  if (method === "moka" && mokaSpec?.flavorGuides) {
    return Object.entries(mokaSpec.flavorGuides).map(([id, g]) => ({
      id,
      label: g?.label || id,
    }));
  }
  return BASE_FLAVOR_INTENTS;
}, [method, mokaSpec]);


  /* ------- สถานะประกอบของ Moka ------- */
  const [assembly, setAssembly] = useState({
    base: false,
    funnel: false,
    top: false,
  });
  const isAssembled = useMemo(
    () => assembly.base && assembly.funnel && assembly.top,
    [assembly]
  );

  useEffect(() => {
    try {
      const rid = localStorage.getItem("recipeId");
      const m = localStorage.getItem("brewingMethod") || "moka";
      const fi = localStorage.getItem("flavorIntent") || "balanced";
      setRecipeId(rid || null);
      setMethod(m);
      setIntent(fi);
    } catch {}
  }, []);

  // ➕ เพิ่ม useEffect ใกล้ๆ กับที่คุณอ่าน localStorage / or หลัง setMethod
  useEffect(() => {
    // รีเซ็ตค่าเป้าหมาย/ตัวแปรสำคัญให้เข้ากับเมธอด
    if (method === "espresso") {
      setTargetTime(28);             // 23–33 วิ
      setGrind("fine");
      setHeat((h) => Math.max(6, h)); // ไม่ต่ำเกินไป
      // ปริมาณดีฟอลต์เอสเพรสโซ
      if (dose === 0) setDose(18);
      if (water === 0) setWater(36);  // 1:2
    } else if (method === "drip") {
      setTargetTime(190);            // 150–240 วิ
      setGrind("medium-coarse");
      if (dose === 0) setDose(16);
      if (water === 0) setWater(300);
    } else if (method === "frenchpress") {
      setTargetTime(240);            // 3–5 นาที
      setGrind("coarse");
      if (dose === 0) setDose(18);
      if (water === 0) setWater(320);
    } else { // moka
      setTargetTime(110);            // 90–130 วิ
      if (grind !== "medium-fine" && grind !== "fine") setGrind("medium-fine");
    }

    // ล้างสถานะลำดับ/ประกอบให้สะอาดเมื่อเปลี่ยนวิธี
    setIsBrewing(false);
    setProgress(0);
    setElapsedMs(0);
    setPressure(0);
    setAssembly({ base:false, funnel:false, top:false });
    setFlow((prev) => Object.fromEntries(Object.keys(prev || {}).map(k => [k,false])));
  }, [method]); // ← สำคัญ

  /* ------- สูตร/ตัวแปรร่วม ------- */
  const [grind, setGrind] = useState("medium-fine");
  const [dose, setDose] = useState(0);
  const [water, setWater] = useState(0);
  const [heat, setHeat] = useState(6);
  const [targetTime, setTargetTime] = useState(110);
  const [preheat, setPreheat] = useState(false);
  const [overpack, setOverpack] = useState(false);
  const [cupPreheated, setCupPreheated] = useState(false);

  const [message, setMessage] = useState(
    "พร้อมชง — ลากอุปกรณ์จากซ้ายไปที่ภาพจำลองกลางจอ เติมวัตถุดิบด้านขวา แล้วเริ่มชง"
  );
  const [isBrewing, setIsBrewing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [temp, setTemp] = useState(25);
  const [pressure, setPressure] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0); // ⏱ elapsed time

  const [isFinished, setIsFinished] = useState(false);
  const [brewResult, setBrewResult] = useState(null);

  const [summary, setSummary] = useState(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  /* ------- user / favorites ------- */
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // เติมน้ำ (auto สำหรับเมธอดอื่นเท่านั้น)
  useEffect(() => {
    if (method !== "moka" && water > 0) {
      markFlow("fill_water", true);
    }
  }, [method, water]);

  // ใส่กาแฟ (auto สำหรับเมธอดอื่นเท่านั้น)
  useEffect(() => {
    if (method !== "moka" && dose > 0) {
      if (method === "espresso") markFlow("dose", true);
      else markFlow("add_coffee", true);
    }
  }, [method, dose]);

  useEffect(() => {
    const unsub = onAuthStateChanged?.(auth, (u) => setUser(u));
    return () => unsub && typeof unsub === "function" && unsub();
  }, []);
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const colRef = collection(db, "users", user.uid, "mokapotFavorites");
    const unsub = onSnapshot(colRef, (snap) => {
      setFavorites(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    try {
      const rid = localStorage.getItem("recipeId");
      const m = localStorage.getItem("brewingMethod") || "moka";
      const fi = localStorage.getItem("flavorIntent") || "balanced";
      const bt = localStorage.getItem("beanType") || "arabica";   // ▲ เพิ่ม
      setRecipeId(rid || null);
      setMethod(m);
      setIntent(fi);
      setBeanType(bt);                                            // ▲ เพิ่ม
    } catch {}
  }, []);


  /* ------- Workflow (ใช้จากสเปกของเมธอดถ้ามี) ------- */
  const workflowForMethod = useMemo(() => {
    if (method === "moka" && mokaSpec?.workflow) return mokaSpec.workflow;
    return FALLBACK_WORKFLOWS[method] ?? { steps: [], requiresToStart: [] };
  }, [method, mokaSpec]);

  const [flow, setFlow] = useState({});
  useEffect(() => {
    const init = Object.fromEntries(
      (workflowForMethod.steps ?? []).map((s) => [s.id, false])
    );
    setFlow(init);
    setAssembly({ base: false, funnel: false, top: false });
  }, [workflowForMethod]);

  const SAFETY_VALVE_ML = useMemo(() => (
    method === "moka" ? (mokaSpec?.ingredients?.safetyValveMl ?? 120) : 120
  ), [method, mokaSpec]);
  
  const waterReady  = method === "moka" ? !!flow.fill_water : (water > 0 && water < SAFETY_VALVE_ML);
  const coffeeReady = method === "moka" ? !!flow.add_coffee  : dose > 0;

  const requiredSteps = workflowForMethod.requiresToStart ?? [];
  const stepsForMethod = workflowForMethod.steps ?? [];

  // เพิ่มใต้ const intervalRef = useRef(null);
  const startAtRef = useRef(null);
  const elapsedRef = useRef(0);

  // sync กับ assembly ของ Moka
  useEffect(() => {
    if (method === "moka") {
      if (assembly.base) markFlow("place_base", true);
      if (assembly.funnel) markFlow("insert_funnel", true);
      if (assembly.top) markFlow("attach_top", true);
    }
  }, [method, assembly]);

  // พรีฮีต
  useEffect(() => {
    if (preheat) {
      if (method === "espresso" || method === "frenchpress")
        markFlow("preheat", true);
    }
  }, [method, preheat]);

  /* ------- brew loop ------- */
  const intervalRef = useRef(null);

  useEffect(
    () => () => intervalRef.current && clearInterval(intervalRef.current),
    []
  );

  // favorites helpers (ซ่อนไว้ยังไม่แสดง UI)
  const currentRecipe = {
    grind,
    dose,
    water,
    heat,
    targetTime,
    preheat,
    overpack,
  };
  const isCurrentFav = favorites.some((f) => recipeEquals(f, currentRecipe));
  const toggleFavorite = async () => {
    try {
      if (!user) return setMessage("กรุณาเข้าสู่ระบบเพื่อบันทึกสูตรที่ชอบ");
      const colRef = collection(db, "users", user.uid, "mokapotFavorites");
      const match = favorites.find((f) => recipeEquals(f, currentRecipe));
      if (match) {
        await deleteDoc(
          doc(db, "users", user.uid, "mokapotFavorites", match.id)
        );
        setMessage("ลบสูตรจากรายการโปรดแล้ว");
      } else {
        await addDoc(colRef, {
          ...currentRecipe,
          createdAt: serverTimestamp(),
          _intent: intent,
          _method: method,
        });
        setMessage("บันทึกเป็นรายการโปรดแล้ว");
      }
    } catch (e) {
      setMessage("บันทึกไม่สำเร็จ: " + (e?.message || "unknown"));
    }
  };

  /* ------- อุปกรณ์ (ซ้าย) → ลากไปวางที่ภาพจำลอง (กลาง) ------- */
  const equipmentTokens = useMemo(() => {
    if (method === "moka" && mokaSpec?.equipmentTokens)
      return mokaSpec.equipmentTokens;
    const wf = FALLBACK_WORKFLOWS[method];
    if (!wf?.steps) return [];
    return wf.steps
      .filter((s) =>
        [
          "place_base",
          "insert_funnel",
          "attach_top",
          "lock_in",
          "place_cup",
          "rinse_filter",
          "preheat",
        ].includes(s.id)
      )
      .map((s) => ({ id: s.id, label: s.label, map: null }));
  }, [method, mokaSpec]);

  const handlePlaceToken = (id) => {
    if (method !== "moka" || !mokaSpec?.assemblyMap?.[id]) {
      // เมธอดอื่นๆ หรือสเต็ปที่ไม่ใช่ assembly แท้ๆ
      markFlow(id, true);
      return;
    }

    const key = mokaSpec.assemblyMap[id];
    const can = {
      base:   true,
      funnel: assembly.base && waterReady,
      top:    assembly.base && assembly.funnel && coffeeReady,
    };

    if (!can[key]) {
      setMessage(
        key === "funnel"
          ? "ใส่กรวยได้หลังวางฐานและเติมน้ำ"
          : "ปิดส่วนบนได้หลังใส่กรวยและผงกาแฟ"
      );
      return;
    }

    markFlow(id, true);
    setAssembly(prev => ({ ...prev, [key]: true }));
  };

  /* ------- คู่มือ (เอากลับมา) ------- */
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const steps = useMemo(() => guideSteps(method, intent), [method, intent]);

  // ให้เด้งทุกครั้งที่โหลดหน้า (mount)
  useEffect(() => {
    setGuideOpen(true);
    setGuideStep(0);
  }, [method]);


  const markFlow = (id, done = true) =>
    setFlow((prev) => ({ ...prev, [id]: !!done }));
  const canStartBrew = requiredSteps.every((id) => flow[id]);

  const startBrew = () => {
    setSummary(null);
    if (!canStartBrew) return setMessage("ยังไม่ครบขั้นตอนจำเป็นก่อนเริ่มชง");
    if (water <= 0) return setMessage("ยังไม่มีน้ำ");
    if (method === "moka" && water >= SAFETY_VALVE_ML) return setMessage("น้ำเกินระดับวาล์วนิรภัย — ลดน้ำก่อนเริ่ม");
    if (dose <= 0) return setMessage("ยังไม่ได้ใส่ผงกาแฟ");
    if (method === "moka" && !isAssembled) return setMessage("ประกอบอุปกรณ์ให้ครบก่อนเริ่ม");

    setIsBrewing(true);
    setIsBrewing(true);
    setElapsedMs(0); 
    startAtRef.current = Date.now();
    elapsedRef.current = 0;

    setIsFinished(false);
    setBrewResult(null);

    setMessage(`กำลังจับเวลา… เป้าหมาย ~${targetTime} วิ • กด "หยุด" ให้ตรงเป้า`);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startAtRef.current) / 1000; // วินาที
      elapsedRef.current = elapsed;
      setElapsedMs(Math.round(elapsed * 1000));

      // ความคืบหน้าเทียบเป้า (ปล่อยให้เกิน 100 ได้เล็กน้อยเพื่อบอกว่านานเกิน)
      const p = Math.min(140, Math.round((elapsed / Math.max(1, targetTime)) * 100));
      setProgress(Math.min(100, p));

      // แบบจำลอง temp/pressure ง่ายๆ ตามเวลาและไฟ
      const heatFactor = heat / 10;
      const startT = preheat ? 65 : 25;
      const targetT = method === "espresso" ? 93 : 92 + (heat > 8 ? 3 : 0);
      const k = (preheat ? 0.8 : 0.5) * heatFactor; // อัตราเพิ่มอุณหภูมิ
      const curTemp = Math.min(targetT, startT + (targetT - startT) * (1 - Math.exp(-k * elapsed)));
      let flowResistance = 1.0;
      if (grind === "fine") flowResistance += 0.45;
      if (grind === "medium-fine") flowResistance += 0.25;
      if (overpack) flowResistance += 0.35;
      const maxBar = method === "espresso" ? 9.0 : 3.0;
      const curPressure = Math.max(0, Math.min(maxBar, ((curTemp - 70) / 10) * heatFactor * flowResistance));

      setTemp(curTemp);
      setPressure(curPressure);

      const e = Math.round(elapsed);
      let msg = `ผ่านไป ${e} วิ — เป้าหมาย ~${targetTime} วิ`;
      if (elapsed < targetTime * 0.6) msg += " • อุ่นเครื่อง/เริ่มไหล";
      else if (elapsed < targetTime * 0.95) msg += " • ใกล้ถึงแล้ว";
      else if (elapsed > targetTime * 1.15) msg += " • เลยเป้าแล้ว";
      setMessage(msg);
    }, 100);
  };

  const stopBrew = () => finishBrew(`หยุดที่ ~${Math.round(elapsedRef.current || 0)} วิ`);

  const finishBrew = (reason = "เสร็จสิ้น") => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsBrewing(false);

    const actualSec = Math.round(elapsedRef.current || 0);
    setElapsedMs(actualSec * 1000);
    const tol = Math.max(5, Math.round(targetTime * 0.08)); 
    let timing = "ตรงเวลา";
    if (actualSec < targetTime - tol) timing = "เร็วกว่ากำหนด";
    else if (actualSec > targetTime + tol) timing = "ช้ากว่ากำหนด";

    setMessage(`${reason} (${timing}) — สรุปโปรไฟล์ที่คาดการณ์…`);

    const summaryObj = makeSummaryForUser(
      {
        method, intent, grind, dose, water, heat,
        targetTime,             
        actualTimeSec: actualSec, 
        preheat, overpack, cupPreheated,
        beanType, 
      },
      mokaSpec
    );
    const insight = analyzeSummary(summaryObj);
    setSummary({ ...summaryObj, ...insight });
    setIsSummaryOpen(true);

    setBrewResult({
      totalSeconds: actualSec,
      yieldMl: summaryObj.yieldMl,  
      grind,
      dose,
      notes: timing,              
    });
    setIsFinished(true);
  };

  const waterOk =
    method === "moka" &&
    water > 0 &&
    water < (mokaSpec?.ingredients?.safetyValveMl ?? 120);

  const toggleWater = () => {
    if (method !== "moka") { markFlow("fill_water", true); return; }
    if (!assembly.base) { setMessage("วางฐานก่อนเติมน้ำ"); return; }

    setFlow(prev => {
      const next = !prev.fill_water;
      if (next) {
        return { ...prev, fill_water: true };
      } else {
        // เทน้ำออก -> ย้อนกลับ: เอากรวย/ผง/ฝาออก และล้างสถานะ
        setAssembly(a => ({ ...a, funnel: false, top: false }));
        return { ...prev, fill_water: false, add_coffee: false, attach_top: false, insert_funnel: false };
      }
    });
  };

  const toggleCoffee = () => {
    if (method !== "moka") { markFlow("add_coffee", true); return; }
    if (!assembly.base)      { setMessage("วางฐานก่อน"); return; }
    if (!waterReady)         { setMessage("เติมน้ำก่อน"); return; }
    if (!assembly.funnel)    { setMessage("ใส่กรวยก่อน"); return; }

    setFlow(prev => {
      const next = !prev.add_coffee;
      if (next) {
        return { ...prev, add_coffee: true };
      } else {
        // เทผงกาแฟ -> ย้อนกลับจากสเตจก่อนหน้า: ถอดส่วนบนถ้ามี
        setAssembly(a => ({ ...a, top: false }));
        return { ...prev, add_coffee: false, attach_top: false };
      }
    });
  };

  // ด้านบนของ JSX (ในคอมโพเนนต์เดียวกัน) จะประกาศตัวแปร class ไว้ก่อนก็ได้
  const waterBtnClass = `
    px-3 py-1.5 rounded-full border text-sm shrink-0 transition-colors
    ${method === "moka" && waterReady
      ? "bg-[#6f4e37] text-white border-[#6f4e37] hover:bg-[#5b3e2c]" // สถานะ: เทน้ำออก
      : "bg-white text-[#2a1c14] border-amber-300 hover:bg-amber-50"}  // สถานะ: เติมน้ำ
  `;
  const coffeeBtnClass = `
  px-3 py-1.5 rounded-full border text-sm shrink-0 transition-colors
  ${method === "moka" && coffeeReady
    ? "bg-[#6f4e37] text-white border-[#6f4e37] hover:bg-[#5b3e2c]" // สถานะ: เทผงกาแฟออก
    : "bg-white text-[#2a1c14] border-neutral-300 hover:bg-neutral-50"} // สถานะ: ใส่ผงกาแฟ
  ${method === "moka" && !assembly.funnel ? "opacity-50 cursor-not-allowed" : ""}
`;
  // หา required steps ที่ยังไม่ครบ (อิง workflow ของวิธี)
  const pendingSteps = requiredSteps.filter((id) => !flow[id]);
  const nextStepId   = pendingSteps[0] || null;

  const stepMetaById = useMemo(() => {
    const obj = {};
    for (const s of stepsForMethod) obj[s.id] = s;
    return obj;
  }, [stepsForMethod]);

  const stepHelp = (id) =>
    (method === "moka" ? mokaSpec?.help?.[id] : null) || { how: "", why: "" };

  // ปุ่ม 'ทำเลย' สำหรับสเต็ปยอดฮิต
  const doQuickActionForStep = (id) => {
    if (method !== "moka") return; // ตัวอย่างโค้ดนี้โฟกัส Moka
    if (["place_base","insert_funnel","attach_top"].includes(id)) {
      handlePlaceToken(id);                 // ใช้ของเดิม
    } else if (id === "fill_water") {
      if (!assembly.base) setMessage("วางฐานก่อนเติมน้ำ");
      else toggleWater();                   // ใช้ของเดิม
    } else if (id === "add_coffee") {
      if (!assembly.funnel) setMessage("ใส่กรวยก่อนใส่ผงกาแฟ");
      else toggleCoffee();                  // ใช้ของเดิม
    }
  };

  const [beanType, setBeanType] = useState("arabica");

  // ใช้ตัวเลือกจาก mokaSpec ถ้ามี ไม่งั้นใช้ค่า fallback
  const BEAN_OPTIONS = useMemo(() => {
    const specOpts = method === "moka" ? mokaSpec?.ingredients?.beanOptions : null;
    if (Array.isArray(specOpts) && specOpts.length) return specOpts;
    return [
      { id: "arabica",  label: "อาราบิก้า" },
      { id: "robusta",  label: "โรบัสต้า" },
    ];
  }, [method, mokaSpec]);

  const resetAll = () => {
    try { clearInterval(intervalRef.current); } catch {}
    setIsBrewing(false);
    setIsFinished(false);
    setBrewResult(null);
    setIsSummaryOpen(false);

    setGuideStep(0);
    setGuideOpen(true);

    // เวลา/มิเตอร์
    setElapsedMs(0);
    setProgress(0);
    setTemp(25);
    setPressure(0);

    // ตัวเครื่อง/ลำดับ
    setAssembly({ base:false, funnel:false, top:false });
    setFlow((prev) => Object.fromEntries(Object.keys(prev || {}).map(k => [k,false])));

    // วัตถุดิบ (ปรับตามที่อยากรีเซ็ต)
    setDose(0);
    setWater(0);
    // heat/targetTime จะคงไว้ หรือรีเซ็ตก็ได้ตามดีไซน์:
    // setHeat(6); setTargetTime(110);

    setMessage("พร้อมชง — ลากอุปกรณ์จากซ้ายไปที่ภาพจำลองกลางจอ เติมวัตถุดิบด้านขวา แล้วเริ่มชง");
  };

  /* ------- UI ------- */
  return (
    <div className="min-h-screen w-full text-[#2a1c14] bg-gradient-to-b from-amber-50 via-orange-50/30 to-amber-50 [background-image:radial-gradient(60rem_30rem_at_70%_-10%,rgba(245,158,11,.12),transparent),radial-gradient(40rem_24rem_at_10%_110%,rgba(234,179,8,.10),transparent)]">
      <Navbar />

      <main className="mx-auto max-w-[1980px] px-4 md:px-6 py-3">
        {/* Header */}
        <header className="mb-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <p className="uppercase tracking-widest text-xs text-amber-700/70">
              ตัวจำลองการชงกาแฟ
            </p>
            <h1 className="mt-1 text-xl md:text-3xl font-extrabold text-[#7a4112]">
              {recipeId ? `${recipeId} — ` : ""}
              {methodLabel(method)} (Simulator)
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs text-[#3e2a1f]/70">แนวรสชาติ:</span>

            <FlavorSelect
              value={intent}
              onChange={(e) => {
                setIntent(e.target.value);
                localStorage.setItem("flavorIntent", e.target.value);
              }}
              options={INTENT_OPTIONS}
            />

            <HeaderChipButton onClick={() => setGuideOpen(true)}>
              <span className="text-[#845f45]"></span> คู่มือ
            </HeaderChipButton>

            <HeaderChipButton onClick={() => setIsSummaryOpen(true)}>
              <span className="text-[#845f45]"></span> ดูสรุปล่าสุด
            </HeaderChipButton>
          </div>
        </header>

        {/* 3-คอลัมน์ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* ซ้าย: โค้ช + คลังอุปกรณ์ (ลาก) */}
          <section className="lg:col-span-3">
            <Card
              title="ผู้ช่วยแนวรสชาติ"
              action={
                <span className="text-xs text-[#2a1c14]/60">
                  {INTENT_OPTIONS.find((x) => x.id === intent)?.label || "แนวรสชาติ"}
                </span>
              }
            >
              <FlavorCoach
                intent={intent}
                params={{
                  method,
                  grind,
                  dose,
                  water,
                  heat,
                  targetTime,
                  preheat,
                  overpack,
                }}
                methodSpec={method === "moka" ? mokaSpec : null}
              />
            </Card>

            <Card title="อุปกรณ์ (ลากไปวางที่ภาพจำลอง)">
              <EquipmentPaletteImages
                tokens={equipmentTokens}
                onQuickPlace={handlePlaceToken}
              />
            </Card>
          </section>

          {/* กลาง: อุปกรณ์จำลอง (รองรับ drop) */}
          <section className="lg:col-span-6">
            <Card
              title={`${methodLabel(method)} — ภาพจำลอง`}
              className="h-full relative"
              action={
                <NextHint
                  method={method}
                  flow={flow}
                  requiredSteps={requiredSteps}
                  stepsForMethod={stepsForMethod}
                  canStartBrew={canStartBrew}
                  isBrewing={isBrewing}
                  targetTime={targetTime}
                  methodSpec={method === "moka" ? mokaSpec : null}
                />
              }
            >
              <Suspense fallback={<div className="p-6 text-sm">กำลังโหลดอุปกรณ์…</div>}>
                {method === "moka" && (
                  <MokaInteractive
                    progress={progress}
                    pressure={pressure}
                    temp={temp}
                    heat={heat}
                    setHeat={setHeat}
                    onHeatChange={setHeat}
                    assembly={assembly}
                    setAssembly={setAssembly}
                    isAssembled={isAssembled}
                    isBrewing={isBrewing}
                    onStart={startBrew}
                    onStop={stopBrew}
                    spec={mokaSpec || undefined}
                    onFlowMark={(id) => markFlow(id, true)}
                    elapsedMs={elapsedMs}
                    targetTime={targetTime}
                    waterFilled={waterReady}
                    coffeeFilled={coffeeReady}
                    isFinished={isFinished}
                    onReset={resetAll}
                    brewResult={brewResult}
                  />
                )}

                {method === "espresso" && (
                  <EspressoInteractive
                    progress={progress}
                    pressure={pressure}
                    temp={temp}
                    isBrewing={isBrewing}
                    onStart={startBrew}
                    onStop={stopBrew}
                  />
                )}

                {method === "drip" && (
                  <DripInteractive
                    progress={progress}
                    temp={temp}
                    isBrewing={isBrewing}
                    onStart={startBrew}
                    onStop={stopBrew}
                  />
                )}

                {method === "frenchpress" && (
                  <FrenchPressInteractive
                    progress={progress}
                    temp={temp}
                    isBrewing={isBrewing}
                    onStart={startBrew}
                    onStop={stopBrew}
                  />
                )}
              </Suspense>
            </Card>
          </section>

          {/* ขวา: วัตถุดิบเป็น “โซน” */}
          <section className="lg:col-span-3">
            <Card
              title="โซนกาแฟ"
              action={
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#2a1c14]/70">ชนิดกาแฟ:</span>
                  <select
                    value={beanType}
                    onChange={(e) => {
                      setBeanType(e.target.value);
                      localStorage.setItem("beanType", e.target.value);
                    }}
                    className="rounded-xl border px-2.5 py-1.5 bg-white text-sm shrink-0"
                    aria-label="ชนิดกาแฟ"
                  >
                    {BEAN_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label || opt.id}
                      </option>
                    ))}
                  </select>
                </div>
              }
            >
              {/* ───── ความละเอียดบด (responsive + helper text) ───── */}
              <div className="mt-1">
                <div className="flex items-center justify-between gap-2">
                  <Label>ความละเอียดบด</Label>
                  <InfoTip title="ความละเอียดบดคืออะไร?">
                    ยิ่งบด “ละเอียด” น้ำไหลยาก → เวลาไหลยาวขึ้น รสเข้ม/หนา<br/>
                    ยิ่งบด “หยาบ”  น้ำไหลง่าย → เวลาไหลสั้น รสบาง/ใส<br/><br/>
                    เริ่มจากค่าที่แนะนำของแต่ละวิธี แล้วค่อยปรับทีละครึ่งสเต็ปครับ
                  </InfoTip>
                </div>

                {/* ปุ่มเลือก (responsive): 2 คอลัมน์บนจอเล็ก, 3 คอลัมน์ตั้งแต่ sm ขึ้นไป */}
                <div
                  role="radiogroup"
                  aria-label="เลือกระดับความละเอียดของการบด"
                  className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2"
                >
                  {grindOptionsFor(method, mokaSpec).map((g) => {
                    const active = grind === g;
                    return (
                      <button
                        key={g}
                        role="radio"
                        aria-checked={active}
                        onClick={() => setGrind(g)}
                        className={
                          "w-full px-3 py-2 rounded-xl border text-sm transition " +
                          (active
                            ? "bg-[#6f4e37]/10 border-[#6f4e37] text-[#6f4e37] font-medium"
                            : "border-neutral-300 hover:border-neutral-400 text-[#2a1c14]")
                        }
                      >
                        {grindLabel(g)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ส่วนสไลเดอร์ + ปุ่ม ใส่ผงกาแฟ/แทมป์ แล้ว คงเดิม */}
              {/* ส่วนสไลเดอร์ + ปุ่ม ใส่ผงกาแฟ/แทมป์ */}
              <div className="mt-3">
                <Slider
                  label={`ปริมาณกาแฟ — ${dose} กรัม`}
                  min={method === "moka" ? (mokaSpec?.ingredients?.dose?.min ?? 12) : 12}
                  max={method === "moka" ? (mokaSpec?.ingredients?.dose?.max ?? 22) : 22}
                  step={0.5}
                  value={dose}
                  onChange={(v) => setDose(v)}
                />

                <div className="mt-2">
                  {method === "espresso" ? (
                    <button
                      onClick={() => markFlow("tamp", true)}
                      className="px-3 py-1.5 rounded-full border border-amber-300 text-sm bg-white hover:bg-amber-50"
                    >
                      ทำเครื่องหมายว่า “แทมป์แล้ว”
                    </button>
                  ) : (
                    <button
                      onClick={toggleCoffee}
                      className={coffeeBtnClass}
                      disabled={method === "moka" && !assembly.funnel}
                      aria-pressed={method === "moka" && coffeeReady}
                    >
                      {method === "moka"
                        ? (coffeeReady ? "เทผงกาแฟออก" : "ใส่ผงกาแฟ")
                        : "ใส่ผงกาแฟ"}
                    </button>
                  )}
                </div>
              </div>
            </Card>

            <Card title="โซนน้ำ">
              <Slider
                label={`ปริมาณน้ำ — ${water} มล.`}
                min={
                  method === "espresso"
                    ? 25
                    : method === "moka"
                    ? mokaSpec?.ingredients?.water?.min ?? 80
                    : 80
                }
                max={
                  method === "espresso"
                    ? 60
                    : method === "moka"
                    ? mokaSpec?.ingredients?.water?.max ?? 130
                    : 130
                }
                step={1}
                value={water}
                onChange={(v) => setWater(v)}
              />
              {method !== "espresso" && (
              <div className="mt-2 flex items-center justify-between gap-3">
                <button
                  onClick={toggleWater}
                  className={waterBtnClass}
                  aria-pressed={method === "moka" && waterReady}
                >
                  {method === "moka" ? (waterReady ? "เทน้ำออก" : "เติมน้ำ") : "เติมน้ำ"}
                </button>

                <div className="shrink-0">
                  <Toggle
                    checked={preheat}
                    onChange={(v) => setPreheat(v)}
                    label={
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        พรีฮีตน้ำ/อุปกรณ์
                        <InfoTip title="พรีฮีตน้ำ/อุปกรณ์คืออะไร?">
                          อุ่นน้ำและอุปกรณ์ให้ร้อนก่อนเริ่มชง เพื่อลดการสูญเสียความร้อนช่วงแรก
                          ทำให้การสกัดเสถียรขึ้น รสสะอาดขึ้น และเวลาไหลใกล้เคียงเป้าที่ตั้งไว้มากขึ้น
                          <br /><br />
                          <b>เมื่อควรเปิด:</b> ต้องการความนิ่งของรส/เวลา โดยเฉพาะเมื่อใช้น้ำเย็นหรืออุณหภูมิห้องต่ำ  
                          <br />
                          <b>ข้อควรระวัง:</b> ถ้าไฟแรงมากอยู่แล้ว อาจทำให้ไหลเร็วขึ้นเล็กน้อย—ปรับไฟลดลง 0.5–1 ระดับได้
                        </InfoTip>
                      </span>
                    }
                  />
                </div>
              </div>
              )}
            </Card>

            <Card title="ตัวเลือกเพิ่มเติม">
              {/* แถวสวิตช์: ชิดซ้าย–ขวา, ยืดเต็มกว้าง, รองรับหน้าจอแคบด้วยการ wrap */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <Toggle
                  checked={overpack}
                  onChange={setOverpack}
                  label={
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      อัดผงกาแฟ
                      <InfoTip title="อัดผงกาแฟคืออะไร?">
                        กดผงกาแฟแน่นกว่าปกติให้แน่นและต้านแรงไหลมากขึ้น
                        ทำให้ไหลช้าลงและรสเข้มหนาขึ้น แต่เสี่ยง “ขม/ไหม้” ถ้ามากเกินไป
                      </InfoTip>
                    </span>
                  }
                />

                <Toggle
                  checked={cupPreheated}
                  onChange={setCupPreheated}
                  label={
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      อุ่นแก้วก่อนเสิร์ฟ
                      <InfoTip title="ทำไมต้องอุ่นแก้ว?">
                        แก้วที่อุ่นช่วยรักษาอุณหภูมิเครื่องดื่มให้คงที่นานขึ้น
                        ลดการสูญเสียความร้อนทันทีที่ชงเสร็จ ทำให้รสชาติสมดุลขึ้น
                      </InfoTip>
                    </span>
                  }
                />
              </div>

              {method === "espresso" && (
                <div className="mt-3">
                  <button
                    onClick={() => markFlow("lock_in", true)}
                    className="mr-2 px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-neutral-50"
                  >
                    ล็อกพอร์ตาฯ
                  </button>
                  <button
                    onClick={() => markFlow("place_cup", true)}
                    className="px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-neutral-50"
                  >
                    วางแก้ว
                  </button>
                </div>
              )}
            </Card>
          </section>
        </div>
      </main>
      {isSummaryOpen && (
        <SummaryModal
          data={summary}
          onClose={() => setIsSummaryOpen(false)}
          imageUrl="./public/simulator/เอสเพรสโซ.png"  // 👈 พาธรูปของคุณ
          size="xl"
          variant="compare"   // "split" | "poster" | "compare" | "timeline"
        />
      )}

      <GuideOverlay
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        step={guideStep}
        onNext={() => setGuideStep((s) => Math.min(s + 1, steps.length - 1))}
        onPrev={() => setGuideStep((s) => Math.max(s - 1, 0))}
        steps={steps}
      />
    </div>
  );
}

/* ---------------- Sidebar/Coach ---------------- */
function FlavorCoach({ intent, params, methodSpec }) {
  // label ของแนวรสชาติ: ใช้จากสเปกถ้ามี ไม่งั้น fallback
  const intentLabel =
    methodSpec?.flavorGuides?.[intent]?.label ||
    (intent === "bright"
      ? "สว่าง สดฉ่ำ (Bright)"
      : intent === "bold"
      ? "เข้ม หนืด (Bold)"
      : "สมดุล (Balanced)");

  // targets จากสเปก (ถ้าไม่มีให้ใช้ค่าปลอดภัย)
  const t = methodSpec?.flavorGuides?.[intent]?.targets || {};
  const DEF = {
    bright:   { ratio: "1:6–1:7",   time: "90–105 วิ",  heat: "5–6/10" },
    balanced: { ratio: "1:5.5–1:6.5",time: "100–120 วิ",heat: "5–7/10" },
    bold:     { ratio: "1:5–1:5.5",  time: "110–130 วิ",heat: "6–7/10" },
  }[intent] || { ratio: "—", time: "—", heat: "—" };

  const ratioTxt = t.ratio || DEF.ratio;
  const timeTxt  = t.time  || DEF.time;
  const heatTxt  = t.heat  || DEF.heat;

  // ภาษาที่เป็นมิตรสำหรับมือใหม่ — สั้น กระชับ ทำตามได้เลย
  const BULLETS = {
    bright: [
      "โทนใส สดชื่น หวานปลาย",
      `ใช้น้ำมากขึ้น 20-30 มล.`,
      `ไฟ ${heatTxt} • เวลา ${timeTxt}`,
      "ถ้าเริ่มขม ให้ลดไฟลงนิดเดียว",
    ],
    balanced: [
      "รสกลมกล่อม ดื่มง่าย",
      `อัตราส่วน ${ratioTxt}`,
      `ไฟ ${heatTxt} • เวลา ${timeTxt}`,
      "ถ้าเปรี้ยวไป → เพิ่มเวลาเล็กน้อย / ถ้าขมไป → ลดไฟเล็กน้อย",
    ],
    bold: [
      "เข้มหนา กลิ่นช็อกโกแลต/นัตชัด",
      `ผงกาแฟ 16 กรัม : น้ำ 95 มล.`,
      `ไฟ ${heatTxt} • เวลา ${timeTxt}`,
      "ถ้าขมปลาย → ลดไฟครึ่ง-หนึ่งสเต็ป",
    ],
  }[intent] || [];

  return (
    <div className="space-y-3 text-sm">
      {/* กล่องคำแนะนำหลัก (คงเลย์เอาต์เดิม) */}
      <div className="rounded-xl bg-[#f9f7f4] p-3">
        <div className="font-semibold mb-1">{intentLabel}</div>
        <ul className="list-disc list-inside leading-relaxed">
          {BULLETS.map((x, i) => <li key={i}>{x}</li>)}
        </ul>
      </div>

      {/* ช่วงค่าที่แนะนำของวิธีนี้ (ดึงจากสเปก/ฟังก์ชันเดิม) */}
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <div className="font-semibold mb-1">ช่วงค่าที่แนะนำของวิธีนี้</div>
        {methodRanges(params.method, methodSpec)}
      </div>
    </div>
  );
}

function coachAdvice(p, intentId) {
  const tips = [];
  if (intentId === "bright") {
    if (p.method === "moka" || p.method === "espresso") {
      if (p.targetTime > 125) tips.push("ย่นเวลาเล็กน้อยเพื่อโทนสว่างขึ้น");
      if (p.heat >= 8) tips.push("ลดไฟลง ~1 ระดับเพื่อลดโทนไหม้/ขม");
    }
    if (p.method === "drip")
      tips.push("เพิ่มสัดส่วนน้ำ (1:16–1:17) เพื่อโปรไฟล์ใส");
  }
  if (intentId === "balanced") {
    if (p.heat < 5) tips.push("เพิ่มไฟเล็กน้อยเพื่อช่วยการสกัดให้สมดุล");
    if (p.targetTime < 90 || p.targetTime > 140)
      tips.push("เล็งเวลา ~90–130 วินาที");
  }
  if (intentId === "bold") {
    if (p.targetTime < 100 && p.method !== "espresso")
      tips.push("ยืดเวลาอีกนิดให้บอดี้หนาขึ้น");
    if (p.method === "espresso" && p.targetTime < 23)
      tips.push("เพิ่มเวลาเป็น ~25–30 วิ เพื่อความกลมกล่อม");
  }
  if (p.overpack) tips.push("ลดการอัดแน่น เพื่อลดแรงดันสูง/ขมจัด");
  if (!p.preheat && (p.method === "moka" || p.method === "drip"))
    tips.push("พรีฮีตน้ำ/อุปกรณ์ช่วยให้รสสะอาดขึ้น");
  return tips;
}

/* ---------------- Summary ---------------- */
function makeSummaryForUser(p, mokaSpec) {
  const intentLabel =
    mokaSpec?.flavorGuides?.[p.intent]?.label ||
    (BASE_FLAVOR_INTENTS.find((x) => x.id === p.intent)?.label ?? "รสชาติสมดุล");

  const isEsp = p.method === "espresso";
  const ratio   = round1(p.water / Math.max(1, p.dose));
  const effTime = p.actualTimeSec ?? p.targetTime;
  const strength =
    ratio <= (isEsp ? 2.0 : 6.0) ? "เข้ม" :
    ratio <= (isEsp ? 3.0 : 8.0) ? "กลาง" : "บาง/ใส";

  const tdsPct  = isEsp ? clamp(round1(14 / ratio), 6, 12) : clamp(round1(5.2 / ratio), 1.1, 3.2);
  const yieldMl = Math.round((isEsp ? 1.0 : 0.85) * p.water);
  const extraction =
    effTime < (isEsp ? 22 : 90) ? "อ่อน" :
    effTime > (isEsp ? 35 : 140) ? "มาก" : "กำลังดี";

  const tol = Math.max(5, Math.round((p.targetTime || effTime) * 0.08));
  let timing = "ตรงเป้า";
  if (p.actualTimeSec && p.targetTime) {
    if (p.actualTimeSec < p.targetTime - tol) timing = "เร็วกว่าเป้า";
    else if (p.actualTimeSec > p.targetTime + tol) timing = "ช้ากว่าเป้า";
  }

  const flavorTags =
    p.intent === "bright" ? ["ผลไม้/ซิตรัส","หอมสด","หวานปลายใส"] :
    p.intent === "bold"   ? ["ช็อกโกแลต","นัตตี้","เข้มหนา"] :
                            ["บาลานซ์","คาราเมล","นุ่มลื่น"];

  const nextTimeTips = [];
  if (extraction === "อ่อน") nextTimeTips.push("ยืดเวลาอีกนิด หรือเพิ่มไฟเล็กน้อย");
  if (extraction === "มาก")  nextTimeTips.push("หยุดให้เร็วขึ้น หรือ ลดไฟเล็กน้อย");
  if (p.heat >= 9)           nextTimeTips.push("ไฟแรงไปนิด ลองลดลง 1 ระดับ");
  if (p.overpack)            nextTimeTips.push("แน่นไปหน่อย ลองอัดเบาลง");

  let caffeineMg = 0;
  let caloriesKcal = 0;

  if (p.beanType === "robusta") {
    caffeineMg = p.dose * 22;
  } else {
    caffeineMg = p.dose * 11;
  }
  caloriesKcal = (p.water / 100) * 2;

  caffeineMg = Math.round(caffeineMg);
  caloriesKcal = Math.round(caloriesKcal);

  return {
    // สำหรับหัวสรุป/ส่วนหลัก
    intent: intentLabel,
    intentId: p.intent,
    ratio, strength, yieldMl, tdsPct, extraction,
    targetTimeSec: p.targetTime,
    actualTimeSec: effTime,
    timing,
    flavorTags,
    serve: (isEsp ? "ดื่มเป็นช็อต หรือเติมนม 1:1–1:2" : "จิบเดี่ยว ๆ หรือเติมนมเล็กน้อยได้"),
    headline: `ชงสำเร็จใน ~${effTime} วิ`,
    subline:  `สไตล์ ${intentLabel} • ความเข้ม ${strength} • สัดส่วน ~1:${ratio}`,
    moveTips: nextTimeTips,

    // 👉 Quick facts
    doseGram: p.dose,
    waterMl: p.water,
    heatLevel: p.heat,
    grind: p.grind,
    method: p.method,

    beanType: p.beanType || "arabica",
    beanLabel: labelBeanType?.(p.beanType, mokaSpec),

    caffeineMg,
    caloriesKcal,
  };
}

function analyzeSummary(data) {
  const good = [];
  const issues = [];
  const actions = [];

  // 1) เวลา
  if (data.timing?.includes("เร็ว")) {
    issues.push("เวลาด่วนไปเล็กน้อย → รสอาจใส/เปรี้ยวกว่าที่ตั้งใจ");
    actions.push("ยืดเวลาอีก ~5–10 วิ หรือเพิ่มไฟเล็กน้อย");
  } else if (data.timing?.includes("ช้า")) {
    issues.push("เวลานานไป → รสอาจเข้ม/ขมปลาย");
    actions.push("หยุดให้เร็วขึ้น ~5–10 วิ หรือ ลดไฟเล็กน้อย");
  } else {
    good.push("เวลาใกล้เป้าที่ตั้งไว้");
  }

  // 2) ความเข้มโดยรวม (จากสัดส่วน)
  if (data.strength === "เข้ม") {
    issues.push("เครื่องดื่มค่อนข้างเข้ม");
    actions.push("เพิ่มน้ำเล็กน้อย (อัตราส่วนยาวขึ้น) หรือหยุดเร็วขึ้นนิดเดียว");
  } else if (data.strength?.includes("บาง")) {
    issues.push("รสค่อนข้างใส/บาง");
    actions.push("ลดน้ำลงเล็กน้อย หรือยืดเวลาอีกนิด");
  } else if (data.strength === "กลาง") {
    good.push("ความเข้มพอดี ดื่มง่าย");
  }

  // 3) ไฟที่ใช้
  const heat = data?.heatLevel ?? null;
  if (typeof heat === "number") {
    if (heat >= 8) {
      issues.push("ไฟค่อนข้างแรง อาจมีโทนไหม้ปลาย");
      actions.push("ลดไฟลง 1 ระดับ");
    } else if (heat <= 4) {
      issues.push("ไฟอ่อน อาจสกัดไม่ทัน");
      actions.push("เพิ่มไฟขึ้นเล็กน้อย");
    } else {
      good.push("ระดับไฟอยู่ในโซนปลอดภัย");
    }
  }

  // 4) การสกัด (แปลศัพท์ให้เป็นภาษาคน)
  if (data.extraction === "อ่อน") {
    issues.push("การสกัดยังอ่อนไปนิด");
    actions.push("ยืดเวลา/เพิ่มไฟ หรือบดให้ละเอียดขึ้นครึ่งสเต็ป");
  } else if (data.extraction === "มาก") {
    issues.push("การสกัดค่อนข้างมาก");
    actions.push("หยุดเร็วขึ้น/ลดไฟ หรือบดหยาบขึ้นครึ่งสเต็ป");
  } else if (data.extraction === "กำลังดี") {
    good.push("ระดับการสกัดกำลังดี");
  }

  // จำกัดจำนวน action ให้ไม่ล้น
  const next = Array.from(new Set(actions)).slice(0, 3);

  return { good, issues, next };
}

/* ---------------- Info tooltip (smart) ---------------- */
function InfoButton({ text, placement = "auto", className = "" }) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);

  // ปิดเมื่อคลิกนอก/เลื่อน/รีไซส์
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!btnRef.current) return setOpen(false);
      if (!btnRef.current.contains(e.target)) setOpen(false);
    };
    const off = () => setOpen(false);
    document.addEventListener("click", close);
    window.addEventListener("scroll", off, true);
    window.addEventListener("resize", off);
    return () => {
      document.removeEventListener("click", close);
      window.removeEventListener("scroll", off, true);
      window.removeEventListener("resize", off);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={
          "inline-grid place-items-center h-5 w-5 rounded-full border text-[11px] leading-none " +
          "border-neutral-300 text-[#2a1c14]/80 bg-white hover:bg-neutral-50 " + className
        }
        aria-label="ดูคำอธิบาย"
      >
        i
      </button>
      {open && (
        <SmartTooltip anchorRef={btnRef} placement={placement}>
          {text}
        </SmartTooltip>
      )}
    </>
  );
}

function SmartTooltip({ anchorRef, children, placement = "auto" }) {
  const tipRef = useRef(null);
  const [style, setStyle] = useState({ opacity: 0 });

  const compute = () => {
    const a = anchorRef.current;
    const t = tipRef.current;
    if (!a || !t) return;
    const r = a.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 10;

    // กำหนดตำแหน่งเริ่มต้น (บนเป็นค่าเริ่ม)
    let place = placement;
    if (place === "auto") {
      place = r.top > vh / 2 ? "top" : "bottom";
    }
    // ขนาดทูลทิปจริง
    const tw = t.offsetWidth;
    const th = t.offsetHeight;

    let top = 0;
    let left = Math.min(
      vw - tw - 8,
      Math.max(8, r.left + r.width / 2 - tw / 2)
    );

    if (place === "top") {
      if (r.top - th - gap < 8) place = "bottom";
    } else if (place === "bottom") {
      if (r.bottom + th + gap > vh - 8) place = "top";
    }

    if (place === "top") top = r.top - th - gap;
    if (place === "bottom") top = r.bottom + gap;
    if (place === "left") {
      left = r.left - tw - gap;
      top = Math.min(vh - th - 8, Math.max(8, r.top + r.height / 2 - th / 2));
    }
    if (place === "right") {
      left = r.right + gap;
      top = Math.min(vh - th - 8, Math.max(8, r.top + r.height / 2 - th / 2));
    }

    setStyle({ position: "fixed", top, left, opacity: 1, zIndex: 9999 });
  };

  useLayoutEffect(() => {
    compute();
    const obs = new ResizeObserver(compute);
    if (tipRef.current) obs.observe(tipRef.current);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      ref={tipRef}
      style={style}
      className="max-w-[320px] rounded-xl border border-neutral-200 bg-white p-3 text-xs text-[#2a1c14] shadow-xl"
      role="tooltip"
    >
      {children}
    </div>,
    document.body
  );
}

/* === ปุ่มอธิบายขนาดเล็ก (ⓘ) พร้อม Popover === */
/* ------------ InfoTip: ปุ่ม i + ทูลทิปแบบ smart ไม่ล้นกรอบ ------------ */
function InfoTip({ title, children, placement = "auto" }) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);

  // ปิดเมื่อคลิกนอก/เลื่อน/รีไซส์
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!btnRef.current) return setOpen(false);
      if (!btnRef.current.contains(e.target)) setOpen(false);
    };
    const off = () => setOpen(false);
    document.addEventListener("click", onDoc);
    window.addEventListener("scroll", off, true);
    window.addEventListener("resize", off);
    return () => {
      document.removeEventListener("click", onDoc);
      window.removeEventListener("scroll", off, true);
      window.removeEventListener("resize", off);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="ml-1 inline-grid place-items-center h-4 w-4 rounded-full border border-neutral-300 bg-white text-[10px] leading-none text-[#2a1c14]/80 hover:bg-neutral-50"
        aria-label="ดูคำอธิบาย"
        title="ดูคำอธิบาย"
      >
        i
      </button>

      {open && (
        <TooltipBubble anchorRef={btnRef} placement={placement} title={title}>
          {children}
        </TooltipBubble>
      )}
    </>
  );
}

function TooltipBubble({ anchorRef, title, children, placement = "auto" }) {
  const tipRef = useRef(null);
  const [style, setStyle] = useState({ opacity: 0 });

  const compute = () => {
    const a = anchorRef.current, t = tipRef.current;
    if (!a || !t) return;

    const r  = a.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 10;           // เว้นขอบปุ่ม
    const pad = 8;            // เว้นขอบจอ

    // จำกัดความกว้างตามขนาดหน้าจอ กันล้นขวา/ซ้าย
    const maxW = Math.min(320, vw - pad * 2);
    t.style.maxWidth = `${maxW}px`;

    // วัดอีกครั้งหลังตั้ง maxWidth
    const tw = t.offsetWidth;
    const th = t.offsetHeight;

    // เลือกวางบน/ล่างโดยอัตโนมัติเป็นค่าเริ่ม
    let placeV = placement === "auto" ? (r.top > vh / 2 ? "top" : "bottom") : placement;

    // เซ็นเตอร์แนวนอนก่อน แล้ว "หนีขอบ" หากจำเป็น
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.min(vw - tw - pad, Math.max(pad, left));

    // ถ้าใกล้ขวาหนักมาก ให้ชิดซ้ายของปุ่ม; ถ้าใกล้ซ้ายหนักมาก ให้ชิดขวาของปุ่ม
    const tooRight = left + tw > vw - pad - 4;
    const tooLeft  = left < pad + 4;
    if (tooRight && r.left > vw * 0.60) {
      left = Math.max(pad, r.right - tw);   // ชิดซ้ายของปุ่ม
    } else if (tooLeft && r.right < vw * 0.40) {
      left = Math.min(vw - tw - pad, r.left); // ชิดขวาของปุ่ม
    }

    // คำนวณ top พร้อมกันล้นแนวตั้ง
    let top;
    if (placeV === "top") {
      top = r.top - th - gap;
      if (top < pad) { placeV = "bottom"; top = r.bottom + gap; }
    } else {
      top = r.bottom + gap;
      if (top + th > vh - pad) { placeV = "top"; top = r.top - th - gap; }
    }
    top = Math.min(vh - th - pad, Math.max(pad, top));

    setStyle({
      position: "fixed",
      top,
      left,
      opacity: 1,
      zIndex: 99999,          // ดันให้อยู่บนสุด
      pointerEvents: "auto",
    });
  };

  useLayoutEffect(() => {
    compute();
    const obs = new ResizeObserver(compute);
    if (tipRef.current) obs.observe(tipRef.current);
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      ref={tipRef}
      role="tooltip"
      className="rounded-xl border border-neutral-200 bg-white p-3 text-xs text-[#2a1c14] shadow-xl"
      style={style}
    >
      {title && <div className="mb-1 font-semibold">{title}</div>}
      <div className="leading-relaxed">{children}</div>
    </div>,
    document.body
  );
}


/* === ปรับ Fact ให้รับ label เป็น ReactNode ได้ === */
function Fact({ icon, label, value, hint }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
      <div className="text-[11px] text-[#2a1c14]/60 flex items-center gap-1">
        {icon ? <span>{icon}</span> : null}
        <span className="inline-flex items-center">{label}</span>
      </div>
      <div className="text-lg font-semibold leading-tight">{value}</div>
      {hint && <div className="text-[11px] text-[#2a1c14]/60 mt-0.5">{hint}</div>}
    </div>
  );
}

/* === สรุปผล: เลย์เอาต์ 2 กล่องบน + 1 กล่องล่าง + ปุ่มอธิบายต่อหัวข้อ === */
function SummaryModal({ data, onClose, imageUrl }) {
  const img = imageUrl || data?.imageUrl || "simulator/espresso-shot.png";
  const { good, issues, next } = analyzeSummary(data || {});

  const tTarget = data?.targetTimeSec ?? null;
  const tActual = data?.actualTimeSec ?? null;
  const tDelta =
    tTarget != null && tActual != null ? tActual - tTarget : null;
  const tDeltaTxt =
    tDelta == null ? "—" : tDelta === 0 ? "ตรงเป้า" : tDelta > 0 ? `+${tDelta} วิ` : `${tDelta} วิ`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] grid place-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onKeyDown={(e) => { if (e.key === "Escape") onClose?.(); }}
        tabIndex={-1}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/45" onClick={onClose} />

        {/* Modal */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="summary-title"
          initial={{ y: 18, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 12, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="relative z-[61] w-[min(1100px,96vw)] max-h-[90vh] overflow-hidden rounded-[24px] bg-white shadow-2xl ring-1 ring-black/5 flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 backdrop-blur px-4 py-3">
            <div id="summary-title" className="font-semibold">สรุปผล</div>
            <CloseBtn onClick={onClose} />
          </div>

          {/* Content */}
          <div className="overflow-auto px-4 md:px-6 py-5 space-y-6">

            {/* SECTION: ภาพ + สรุปหัวข้อ */}
            <section aria-label="ภาพรวม">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ภาพ */}
                <div className="rounded-[24px] border border-neutral-200 bg-white p-4">
                  <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-50 to-neutral-100 aspect-[4/3] sm:aspect-[16/10]">
                    <img
                      src={img}
                      alt="ผลลัพธ์เครื่องดื่ม"
                      className="absolute inset-0 m-auto max-h-[95%] max-w-[95%] object-contain p-2"
                    />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-extrabold leading-tight">ชงสำเร็จ!</div>
                    {data?.headline && <div className="text-[#2a1c14]/80">{data.headline}</div>}
                    {data?.subline && <div className="text-xs text-[#2a1c14]/60">{data.subline}</div>}

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Pill>สไตล์ {data?.intent ?? "-"}</Pill>
                      <Pill>ความเข้ม {data?.strength ?? "-"}</Pill>
                      <Pill>สัดส่วน 1:{data?.ratio ?? "-"}</Pill>
                    </div>
                  </div>
                </div>

                {/* บัตรสรุปผลลัพธ์หลัก */}
                <div className="rounded-[24px] border border-neutral-200 bg-white p-4 md:p-5">
                  <h3 className="text-lg font-semibold text-[#7a4112] mb-3">ผลลัพธ์ที่ได้</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Fact
                      label={<>เวลา (วิ)<InfoTip title="เวลา">เวลาตั้งแต่เริ่มไหลจนกดหยุด</InfoTip></>}
                      value={tActual != null ? `${tActual}` : "—"}
                      hint={`เป้าหมาย ${tTarget ?? "—"} • ${data?.timing ?? tDeltaTxt}`}
                    />
                    <Fact
                      label={<>สัดส่วน<InfoTip title="สัดส่วน (น้ำ:กาแฟ)">1:x ยิ่ง x มาก → ใส/เบา</InfoTip></>}
                      value={`1:${data?.ratio ?? "-"}`}
                    />
                    <Fact
                      label={<>ปริมาณ (มล.)<InfoTip title="ปริมาณ">ประมาณการผลลัพธ์ในถ้วย</InfoTip></>}
                      value={data?.yieldMl != null ? `${data?.yieldMl}` : "—"}
                    />
                    <Fact
                      label={<>TDS (ประมาณ)<InfoTip title="TDS">เปอร์เซ็นต์ของแข็งที่ละลาย</InfoTip></>}
                      value={data?.tdsPct != null ? `~${data.tdsPct}%` : "—"}
                    />
                    <Fact
                      label={<>การสกัด<InfoTip title="ระดับการสกัด">อ่อน/มาก/กำลังดี</InfoTip></>}
                      value={data?.extraction ?? "-"}
                    />
                    <Fact
                      label={<>คาเฟอีน<InfoTip title="คาเฟอีนโดยประมาณ">ขึ้นกับสายพันธุ์/โดส</InfoTip></>}
                      value={`${data?.caffeineMg ?? "-"} มก.`}
                    />
                    <Fact
                      label={<>แคลอรี<InfoTip title="แคลอรี">กาแฟดำ (ไม่ใส่น้ำตาล/นม)</InfoTip></>}
                      value={`${data?.caloriesKcal ?? "-"} kcal`}
                    />
                    <Fact
                      label={<>ไฟ (/10)<InfoTip title="ไฟ">เร่งอุณหภูมิ/แรงดัน</InfoTip></>}
                      value={data?.heatLevel != null ? `${data.heatLevel}` : "—"}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-neutral-200/80" />

            {/* SECTION: สิ่งที่ทำไป (การตั้งค่า) */}
            <section aria-label="สิ่งที่ทำไป">
              <h3 className="text-lg font-semibold text-[#7a4112] mb-3">ข้อมูลที่ทำไป</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <BadgeRow label="วิธีชง" value={
                  data?.method === "espresso" ? "เอสเพรสโซ" :
                  data?.method === "drip" ? "ดริป" :
                  data?.method === "frenchpress" ? "เฟรนช์เพรส" : "โมก้าพอต"
                }/>
                <BadgeRow label="ชนิดเมล็ด" value={data?.beanLabel || data?.beanType || "-"} />
                <BadgeRow label="เป้าหมายเวลา" value={tTarget != null ? `${tTarget} วิ` : "—"} />
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <BadgeRow label="ปริมาณผงกาแฟ" value={`${data?.doseGram ?? "-"} กรัม`} />
                <BadgeRow label="น้ำ" value={`${data?.waterMl ?? "-"} มล.`} />
                <BadgeRow label="บด" value={labelGrind?.(data?.grind) ?? "-"} />
                <BadgeRow label="ไฟ" value={data?.heatLevel != null ? `${data.heatLevel}/10` : "—"} />
              </div>
            </section>

            <div className="h-px bg-neutral-200/80" />

            {/* SECTION: คำแนะนำ */}
            <section aria-label="คำแนะนำ">
              <h3 className="text-lg font-semibold text-[#7a4112] mb-3">คำแนะนำ</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <SectionCard title="สิ่งที่ทำได้ดี">
                  {good?.length ? (
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      {good.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  ) : <EmptyLine/>}
                </SectionCard>

                <SectionCard title="จุดที่น่าปรับ" tone="warn">
                  {issues?.length ? (
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      {issues.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  ) : <EmptyLine/>}
                </SectionCard>

                <SectionCard title="แผนช็อตถัดไป">
                  {next?.length ? (
                    <ol className="list-inside list-decimal space-y-1 text-sm">
                      {next.map((t, i) => <li key={i}>{t}</li>)}
                    </ol>
                  ) : <EmptyLine/>}
                </SectionCard>
              </div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


function Pill({ children }) {
  return (
    <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs">
      {children}
    </span>
  );
}

function Collapsible({ title, children, defaultOpen=false }) {
  return (
    <details open={defaultOpen} className="rounded-xl border border-neutral-200 bg-white p-3 group">
      <summary className="cursor-pointer list-none flex items-center justify-between">
        <span className="font-semibold">{title}</span>
        <span className="text-xs text-[#2a1c14]/60 group-open:hidden">กดเพื่อดู</span>
        <span className="text-xs text-[#2a1c14]/60 hidden group-open:inline">กดเพื่อซ่อน</span>
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}

function Explain({ term, eg, children }) {
  return (
    <div>
      <span className="font-medium">{term}</span>{" "}
      <span>— {children}</span>
      {eg && <div className="mt-0.5">เช่น: {eg}</div>}
    </div>
  );
}

/* —— ชิ้นส่วนเล็ก ๆ เพื่อความกะทัดรัด —— */
function Quick({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
      <div className="text-[11px] text-[#2a1c14]/60">{label}</div>
      <div className="text-base font-semibold leading-none">{value}</div>
      {hint && <div className="text-[11px] text-[#2a1c14]/60 mt-0.5">{hint}</div>}
    </div>
  );
}
function SectionCard({ title, children, tone }) {
  const cls =
    tone === "warn"
      ? "rounded-xl border border-yellow-200 bg-yellow-50 p-3"
      : "rounded-xl border border-neutral-200 bg-white p-3";
  return (
    <div className={cls}>
      <div className="font-semibold mb-1">{title}</div>
      {children}
    </div>
  );
}
function ExplainLine({ term, meaning, eg }) {
  return (
    <div>
      <b>{term}</b> — {meaning}
      {eg ? <span className="block">ตัวอย่าง: {eg}</span> : null}
    </div>
  );
}
function EmptyLine() {
  return <div className="text-sm text-[#2a1c14]/60">—</div>;
}

/* ---------------- คู่มืออินเทอร์แอคทีฟ ---------------- */

function guideSteps(method, intent) {
  const intentWord =
    intent === "bright" ? "โทนสว่าง" : intent === "bold" ? "โทนเข้มหนา" : "สมดุล";
  return [
    {
      title: "โครงหน้าแบบจำลอง",
      desc: "หน้าจอแบ่งเป็น 4 ส่วนหลัก: คำแนะนำ, อุปกรณ์, ภาพจำลอง, และวัตถุดิบ.\nแต่ละส่วนมีการโต้ตอบของตัวเอง",
      image: "layout",
    },
    {
      title: "เลือกแนวรสชาติ",
      desc: "เลือกแนวรสชาติ เช่น เบาบางดื่มง่าย หรือเข้มข้น เพื่อให้ระบบแนะนำค่าการชงและไฟที่เหมาะสม",
      image: "flavor",
    },
    {
      title: "อ่านคำแนะนำจากผู้ช่วย",
      desc: "ช่องซ้ายบนจะแสดงรายละเอียดโทนรสชาติและค่าที่แนะนำ เช่น ปริมาณน้ำ กาแฟ เวลา และไฟ",
      image: "coach",
    },
    {
      title: "อุปกรณ์โมก้าพอต",
      desc: "ลากชิ้นส่วน เช่น ฐาน กรวย และส่วนบน ไปวางบนภาพจำลองตามลำดับ หรือคลิกเพื่อวางทันที",
      image: "equip",
    },
    {
      title: "ภาพจำลองเครื่องชง",
      desc: "บริเวณตรงกลางจะแสดงโมก้าพอตตามขั้นตอนที่ประกอบไว้ และเปลี่ยนภาพอัตโนมัติเมื่อชง",
      image: "moka",
    },
    {
      title: "โซนกาแฟ",
      desc: "เลือกความละเอียดของการบดหรือชนิดของกาแฟและปรับปริมาณที่ต้องการ แล้วกด 'ใส่ผงกาแฟ'",
      image: "coffee",
    },
    {
      title: "โซนน้ำ",
      desc: "เลื่อนสไลเดอร์เพื่อเติมน้ำ (ข้อสำคัญไม่ควรเกินวาล์วนิรภัยของฐานโมก้าพอท) และกดปุ่ม 'เติมน้ำ' เพื่อยืนยัน",
      image: "water",
    },
    {
      title: "ตัวเลือกเพิ่มเติม",
      desc: "สามารถเปิดตัวเลือกเสริม เช่น อัดผงกาแฟแน่น หรืออุ่นแก้วก่อนเสิร์ฟ เพื่อปรับผลลัพธ์",
      image: "extra",
    },
    {
      title: "ปรับระดับไฟ",
      desc: "ใช้ปุ่มครึ่งวงกลมเพื่อปรับความแรงของไฟ ระหว่าง 1–10 ระดับ ก่อนเริ่มชง",
      image: "knob",
    },
    {
      title: "จับเวลาและเริ่มชง",
      desc: "แสดงเวลาที่ผ่านไปเทียบกับเป้าหมาย และกดปุ่ม 'ตั้งไฟ / เริ่มชง' เพื่อเริ่มการสกัด",
      image: "timer",
    },
    { title: "ดูสรุปผลและคำแนะนำ",
      desc: "เมื่อหยุดเวลาแล้ว จะมีสรุปโปรไฟล์ สิ่งที่ทำได้ดี จุดที่น่าปรับ และแผนช็อตถัดไป",
      image: "summary" 
    },
  ];
}

/* ---------------- UI helpers ---------------- */
function methodLabel(m) {
  return m === "espresso"
    ? "เอสเพรสโซ"
    : m === "drip"
    ? "ดริป"
    : m === "frenchpress"
    ? "เฟรนช์เพรส"
    : "โมก้าพอต";
}
// ➕ วางไว้เหนือ JSX (ใกล้ๆ methodLabel ก็ได้)
function grindOptionsFor(method, mokaSpec) {
  if (method === "moka") return mokaSpec?.ingredients?.grindOptions || ["fine","medium-fine","medium"];
  if (method === "espresso") return ["fine"];                    // เฉพาะเอสเพรสโซ
  if (method === "drip") return ["medium-coarse","medium","medium-fine"];
  if (method === "frenchpress") return ["coarse","medium-coarse"];
  return ["medium"]; // fallback ปลอดภัย
}
function grindLabel(g) {
  return (
    {
      "fine": "ละเอียด",
      "medium-fine": "กลาง-ละเอียด",
      "medium": "กลาง",
      "medium-coarse": "กลาง-หยาบ",
      "coarse": "หยาบ",
    }[g] || g
  );
}
function labelGrind(g) {
  if (g === "fine") return "ละเอียด";
  if (g === "medium-fine") return "กลาง-ละเอียด";
  return "กลาง";
}
function labelBeanType(id, methodSpec) {
  const specOpts = methodSpec?.ingredients?.beanOptions;
  if (Array.isArray(specOpts)) {
    const found = specOpts.find((x) => x.id === id);
    if (found?.label) return found.label;
  }
  // fallback label
  return (
    {
      arabica: "อาราบิก้า",
      robusta: "โรบัสต้า",
    }[id] || id || "-"
  );
}
function Label({ children }) {
  return <div className="text-sm text-[#2a1c14] font-medium">{children}</div>;
}
function Card({ title, children, action = null, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-amber-200 bg-white/90 backdrop-blur p-5 shadow-[0_12px_28px_rgba(180,83,9,0.10)] ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#7a4112]">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className={disabled ? "opacity-60" : ""}>
      <Label>{label}</Label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full mt-2 accent-[#6f4e37]"
        disabled={disabled}
      />
      <div className="flex justify-between text-xs text-[#2a1c14]/60">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-2 select-none cursor-pointer">
      <span
        className={
          "h-5 w-10 rounded-full transition relative " +
          (checked ? "bg-[#2a1c14]/70" : "bg-neutral-300")
        }
      >
        <span
          className={
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow " +
            (checked ? "left-5" : "left-1")
          }
        />
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#6f4e37]/20 bg-[#6f4e37]/10 px-2.5 py-1 text-xs text-[#2a1c14]">
      {children}
    </span>
  );
}
function BadgeRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2">
      <span className="text-[#2a1c14]/70 text-sm">{label}</span>
      <span className="font-semibold text-[#7a4112]">{String(value)}</span>
    </div>
  );
}
function methodRanges(method, mokaSpec) {
  const node = (rows) => (
    <ul className="text-sm space-y-1">
      {rows.map((r, i) => (
        <li key={i}>{r}</li>
      ))}
    </ul>
  );
  if (method === "moka" && mokaSpec?.ingredients) {
    const g = mokaSpec.ingredients;
    const pick = (k, fallback) => {
      const o = g[k] || {};
      const recMin = (o.recMin ?? fallback[0]);
      const recMax = (o.recMax ?? fallback[1]);
      const rec    = (o.rec    ?? fallback[2]);
      return { recMin, recMax, rec };
    };

    const dose  = pick("dose",  [16, 18, 17]);
    const water = pick("water", [95,115,105]);
    const heat  = pick("heat",  [5,  7,  6 ]);
    const time  = pick("time",  [90,130,110]);

    return node([
      `กาแฟ: ${dose.recMin}–${dose.recMax} กรัม (แนะนำ ~${dose.rec})`,
      `น้ำ: ${water.recMin}–${water.recMax} มล. (ใต้ระดับวาล์ว)`,
      `ไฟ: ${heat.recMin}–${heat.recMax} /10 (แนะนำ ~${heat.rec})`,
      `เวลา: ${time.recMin}–${time.recMax} วิ (แนะนำ ~${time.rec})`,
    ]);
  }
  if (method === "espresso")
    return node([
      "กาแฟ: 16–22 กรัม",
      "ช็อตที่ได้: ~25–45 มล.",
      "อุณหภูมิ: 90–95°C",
      "ความดัน: 8–9.5 bar",
      "เวลา: 23–33 วิ",
    ]);
  if (method === "drip")
    return node([
      "กาแฟ: 12–20 กรัม",
      "น้ำ: 200–360 มล.",
      "อุณหภูมิ: 91–94°C",
      "เวลาโดยรวม: 150–240 วิ",
    ]);
  if (method === "frenchpress")
    return node([
      "กาแฟ: 16–22 กรัม",
      "น้ำ: 220–360 มล.",
      "อุณหภูมิ: 90–94°C",
      "แช่: 3–5 นาที",
    ]);
  return node([
    "กาแฟ: 16–18 กรัม",
    "น้ำ: 95–115 มล.",
    "ไฟ: 5–7 /10",
    "เวลา: 90–130 วิ",
  ]);
}

/* ---------------- utils ---------------- */
function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}
function round1(x) {
  return Math.round(x * 10) / 10;
}
function recipeEquals(a, b) {
  return (
    a?.grind === b?.grind &&
    Number(a?.dose) === Number(b?.dose) &&
    Number(a?.water) === Number(b?.water) &&
    Number(a?.heat) === Number(b?.heat) &&
    Number(a?.targetTime) === Number(b?.targetTime) &&
    Boolean(a?.preheat) === Boolean(b?.preheat) &&
    Boolean(a?.overpack) === Boolean(b?.overpack) &&
    (a?.beanType || "arabica") === (b?.beanType || "arabica")
  );
}

function NextHint({ method, flow, requiredSteps, stepsForMethod, canStartBrew, isBrewing, targetTime, methodSpec }) {
  const labelOf = (id) => stepsForMethod?.find((s) => s.id === id)?.label || STEP_LABELS[id] || id;
  const nextId = (requiredSteps || []).find((id) => !flow?.[id]);

  let main = "", tipTitle = "", tipBodyNode = null;

  if (isBrewing) {
    main = `กำลังชง… เล็งหยุดที่ ~${targetTime} วิ`;
    tipTitle = "กำลังชง";
    tipBodyNode = (
      <div className="text-sm space-y-1.5">
        <div><b>ทำยังไง:</b> จับเวลาแล้วกด “หยุด” ใกล้เป้าหมาย</div>
        <div><b>ทิป:</b> เกินเป้าหมาย → เข้ม/ขม • ต่ำกว่าเป้า → ใส/เปรี้ยว</div>
      </div>
    );
  } else if (nextId) {
    main = `ขั้นตอนถัดไป: ${labelOf(nextId)}`;
    tipTitle = labelOf(nextId);
    tipBodyNode = renderStepTip(nextId);
  } else if (canStartBrew) {
    main = "พร้อมเริ่มชงแล้ว";
    tipTitle = "เริ่มชง";
    tipBodyNode = (
      <div className="text-sm space-y-1.5">
        <div><b>ทำยังไง:</b> กด “ตั้งไฟ / เริ่ม” ให้ระบบจับเวลา</div>
        <div><b>ทิป:</b> ตั้งเป้าเวลาให้เหมาะกับเมธอดเพื่อรสที่ตั้งใจ</div>
      </div>
    );
  } else {
    main = "ตั้งค่าวัตถุดิบให้ครบก่อนเริ่ม";
    tipTitle = "ต้องทำอะไรบ้าง";
    tipBodyNode = (
      <div className="text-sm space-y-1.5">
        <div>เลือกบด/โดสกาแฟ เติมน้ำ (อย่าเกินวาล์ว) และประกอบชิ้นส่วนตามลำดับ</div>
        <div>ครบแล้วปุ่มเริ่มจะพร้อมใช้งาน</div>
      </div>
    );
  }

  return (
    <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50/60 backdrop-blur px-3 py-1">
      <div className="text-sm font-medium inline-flex items-center gap-1 text-[#7a4112]">
        {main}
        <InfoTip title={tipTitle}>{tipBodyNode}</InfoTip>
      </div>
    </div>
  );
}
function CloseBtn({ onClick, className = "", label = "ปิด" }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={"group grid place-items-center h-9 w-9 rounded-full border border-neutral-200 bg-white/90 hover:bg-neutral-100 shadow-sm " + className}
      title={label}
    >
      <span className="text-xl leading-none text-[#2a1c14]/70 group-hover:text-[#2a1c14]">×</span>
    </button>
  );
}
function HeaderChipButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border bg-white/90
                 px-3 py-1.5 text-sm shadow-sm
                 border-[#e6ddd5] hover:bg-[#fff8f2]
                 hover:shadow transition
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e4c9ad]"
    >
      {children}
    </button>
  );
}

function FlavorSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none rounded-full border bg-white/95 
                   pl-3 pr-9 py-1.5 text-sm shadow-sm
                   border-[#e6ddd5] hover:bg-[#fff8f2]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e4c9ad]"
      >
        {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
      {/* ไอคอนลูกศร */}
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#845f45]"
        viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/>
      </svg>
    </div>
  );
}



