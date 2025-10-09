// ================================
// File: src/pages/customcoffee.jsx
// ================================
import { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../navbar";
import { useNavigate } from "react-router-dom";
import "../assets/css/simulator.css";

/**
 * Moka Pot Espresso Simulator — Difficulty Behaviors
 * L1: fixed amounts + fixed heat, guidance ON, names ON, blink ON
 * L2: adjustable amounts + adjustable heat, guidance ON, names ON, blink ON
 * L3: adjustable amounts + adjustable heat, guidance OFF, names OFF, blink OFF
 *
 * ทุกระดับต้อง "ลากอุปกรณ์มาเอง + ใส่วัตถุดิบเอง"
 * เพิ่ม: Popup ให้เลือกพันธุ์เมล็ด / ระดับการคั่ว / ความละเอียด ก่อนเริ่ม
 */
export default function Customcoffee() {
  const NAVBAR_HEIGHT = 10;
  const stageHeightStyle = { height: `calc(100vh - ${NAVBAR_HEIGHT}vh)` };

  const difficulty = Number(localStorage.getItem("difficulty") || 1);
  const levelLabel = difficulty === 1 ? "มือใหม่" : difficulty === 2 ? "ฝึกหัด" : "เชี่ยวชาญ";

  const guidanceOn = difficulty !== 3;
  const showNames  = difficulty !== 3;
  const blinkOn    = difficulty !== 3;

  // steps: 0 prepare | 1 brew | 2 pour
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");

  const [panelMode, setPanelMode] = useState("equipment"); // equipment | ingredients

  // ---------- NEW: Bean/roast/grind preferences ----------
  const BEANS  = ["Arabica", "Robusta", "Blend"];
  const ROASTS = ["Light", "Medium", "Dark"];
  const GRINDS = ["Fine", "Medium-Fine", "Medium", "Coarse"]; // แนะนำ Moka: Medium-Fine

  const initialPrefs = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("coffee_prefs") || "{}");
      return {
        bean: saved.bean || "Arabica",
        roast: saved.roast || "Medium",
        grind: saved.grind || "Medium-Fine",
      };
    } catch { return { bean: "", roast: "", grind: "" }; }
  };
  const [prefs, setPrefs] = useState(initialPrefs);
  const [showPrefs, setShowPrefs] = useState(false); // ให้เด้งทุกครั้ง

  const [showTutorial, setShowTutorial] = useState(true);

  const savePrefs = (next) => {
    setPrefs(next);
    localStorage.setItem("coffee_prefs", JSON.stringify(next));
  };

  // ---------- Stage / brewing ----------
  const workspaceRef = useRef(null);
  const [stage, setStage] = useState({
    base: null,
    basket: null,
    top: null,
    stove: null,
    cup: null,
    baseFilled: false,   // ✅ น้ำถูกเติมจริงหรือยัง
    basketFilled: false, // ✅ กาแฟถูกเติมจริงหรือยัง
  });

  // สถานะอุปกรณ์ที่ถูกใช้ออกจาก sidebar
  const [usedItems, setUsedItems] = useState({
    stove: false,
    "moka-base": false,
    "moka-basket": false,
    "moka-top": false,
    cup: false,
    water: false,
    ground: false,
  });

  const LIMITS = useMemo(() => {
    if (difficulty === 1) return { MIN_WATER: 150, MAX_WATER: 150, MIN_COFFEE: 16, MAX_COFFEE: 16 };
    if (difficulty === 2) return { MIN_WATER: 100, MAX_WATER: 220, MIN_COFFEE: 12, MAX_COFFEE: 22 };
    return { MIN_WATER: 80,  MAX_WATER: 250, MIN_COFFEE: 10, MAX_COFFEE: 25 };
  }, [difficulty]);

  const defaults = useMemo(() => {
    if (difficulty === 1) return { water: 150, coffee: 16, heat: "medium" };
    if (difficulty === 2) return { water: 150, coffee: 16, heat: "medium" };
    return { water: 120, coffee: 14, heat: "medium" };
  }, [difficulty]);

  const [waterML, setWaterML] = useState(defaults.water);
  const [coffeeG, setCoffeeG] = useState(defaults.coffee);
  const [heatStrength, setHeatStrength] = useState(defaults.heat); // "low" | "medium" | "high"

  const [extraction, setExtraction] = useState(0);
  const [isHeating, setIsHeating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isPoured, setIsPoured] = useState(false);

  const [blinkingItem, setBlinkingItem] = useState(null);

  const [selectedHeat, setSelectedHeat] = useState("low"); // ค่า default "medium"

  // L1 lock
  useEffect(() => {
    if (difficulty === 1) {
      setWaterML(150); setCoffeeG(16); setHeatStrength("medium");
    }
  }, [difficulty]);

  // lists
  const equipment = useMemo(() => ([
    { id: "moka-base",   name: "ฐานโมก้าพอต",    type: "equipment", image: "", svg: MokaBaseSVG },
    { id: "moka-basket", name: "ตะกร้ากาแฟ",     type: "equipment", image: "", svg: BasketSVG },
    { id: "moka-top",    name: "ส่วนบนโมก้าพอต", type: "equipment", image: "", svg: MokaTopSVG },
    { id: "stove",       name: "เตา",            type: "equipment", image: "", svg: StoveSVG },
    { id: "cup",         name: "แก้วเอสเพรสโซ",  type: "equipment", image: "", svg: CupSVG },
  ]), []);
  const ingredients = useMemo(() => ([
    { id: "water",  name: "น้ำ (ml)",   type: "ingredient", image: "", svg: WaterSVG },
    { id: "ground", name: "ผงกาแฟ (g)", type: "ingredient", image: "", svg: GroundsSVG },
  ]), []);
  const list = panelMode === "equipment" ? equipment : ingredients;

  // next-needed (blink)ฟ
  const computeNextNeeded = () => {
    if (!blinkOn) return null;
    if (step === 0) {      
      if (!stage.stove) return "stove";
      if (!stage.base) return "moka-base";
      if (!stage.basket) return "moka-basket";
      if (!stage.top) return "moka-top";
      if (!stage.cup) return "cup";
      return null;
    }
    if (step === 1) return null;
    if (step === 2 && !isPoured) return "cup";
    return null;
  };
  useEffect(() => {
    setBlinkingItem(computeNextNeeded());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, stage.base, stage.basket, stage.top, stage.stove, stage.cup, isPoured, blinkOn]);

  // guidance
  useEffect(() => {
    if (!guidanceOn) { setMessage(""); return; }
    if (!prefs.bean || !prefs.roast || !prefs.grind) {
      setMessage("เลือกพันธุ์เมล็ด/ระดับคั่ว/ความละเอียดก่อนเริ่ม [ปุ่มด้านบน]");
      return;
    }
    const grindHint = (prefs.grind === "Coarse")
      ? " (หมายเหตุ: บดหยาบอาจทำให้การไหลช้า/เจือจาง)"
      : (prefs.grind === "Medium-Fine" ? " (เหมาะกับ Moka)" : "");
    if (step === 0) {
      setMessage(`ลากอุปกรณ์ทั้งหมดลงเวที แล้วเติมน้ำ/ผงตามช่วงที่กำหนด`);
    } else if (step === 1) {
      setMessage("กำลังสกัดบนเตา — เฝ้าดูเกจการสกัด ");
    } else if (step === 2) {
      setMessage("สกัดเสร็จแล้ว กด ‘เทใส่แก้ว’ ");
    }
  }, [step, guidanceOn, prefs]);

  // DnD
  const onDragEnd = (item, _e, info) => {
    const rect = workspaceRef.current?.getBoundingClientRect();
    if (!rect) return;
    const inside = info.point.x >= rect.left && info.point.x <= rect.right && info.point.y >= rect.top && info.point.y <= rect.bottom;
    if (!inside) return;

    setStage((prev) => {
      const st = { ...prev };

      // อุปกรณ์หลัก
      if (item.id === "stove") {
        st.stove = { id: item.id, on: false, strength: "low" };
        setVisiblePlaceholders(p => ({ ...p, mokaBase: true }));
        setUsedItems(u => ({ ...u, stove: true }));
      }
      if (item.id === "moka-base") {
        st.base = { id: item.id };
        setVisiblePlaceholders(p => ({ ...p, mokaBasket: true }));
        setUsedItems(u => ({ ...u, [item.id]: true }));
      }
      if (item.id === "moka-basket") {
        st.basket = { id: item.id };
        setVisiblePlaceholders(p => ({ ...p, mokaTop: true }));
        setUsedItems(u => ({ ...u, [item.id]: true }));
      }
      if (item.id === "moka-top") {
        st.top = { id: item.id };
        setVisiblePlaceholders(p => ({ ...p, cup: true }));
        setUsedItems(u => ({ ...u, [item.id]: true }));
      }
      if (item.id === "cup") {
        st.cup = st.cup ? { ...st.cup } : { id: item.id, hasCoffee: false }; 
        // ✅ ถ้า cup เคยมีอยู่แล้ว ไม่ overwrite hasCoffee
        setUsedItems(u => ({ ...u, cup: true }));
      }
      // เพิ่มเติม: น้ำและกาแฟ
      if (item.id === "water" && st.base) {
        st.baseFilled = true; // ✅ เติมน้ำใน base
        st.base.filled = true;    // ✅ เพิ่มตรงนี้
        setUsedItems(u => ({ ...u, water: true }));
      }
      if (item.id === "ground" && st.basket) {
        st.basketFilled = true; // ✅ เติมกาแฟใน basket
        st.basket.filled = true;  // ✅ เพิ่มตรงนี้
        setUsedItems(u => ({ ...u, ground: true }));
      }

      return st;
    });
  };

  const [visiblePlaceholders, setVisiblePlaceholders] = useState({
    stove: true,       // เริ่มแรกให้เตาเห็น
    mokaBase: false,
    mokaBasket: false,
    mokaTop: false,
    cup: false,
  });

  // brew loop
  const isExtractingRef = useRef(false);
  useEffect(() => () => (isExtractingRef.current = false), []);

  const startHeat = () => {
    // ต้องเลือกพรีเซ็ตก่อน
    if (!prefs.bean || !prefs.roast || !prefs.grind) {
      alert("กรุณาเลือกรายละเอียดเมล็ด/การคั่ว/ความละเอียดก่อน");
      setShowPrefs(true);
      return;
    }
    // ต้องประกอบครบ
    if (!stage.base?.filled || !stage.basket?.filled || !stage.top || !stage.stove || !stage.cup) {
      alert("ยังเตรียมไม่ครบ: ฐาน+น้ำ, ตะกร้า+ผงกาแฟ, ส่วนบน, เตา และแก้ว");
      return;
    }
    if (!stage.baseFilled || !stage.basketFilled) {
      alert("ยังเติมน้ำหรือกาแฟไม่ครบ!");
      return;
    }
    // ช่วงค่า
    if (waterML < LIMITS.MIN_WATER || waterML > LIMITS.MAX_WATER || coffeeG < LIMITS.MIN_COFFEE || coffeeG > LIMITS.MAX_COFFEE) {
      alert(`ปริมาณต้องอยู่ในช่วงที่กำหนด\nน้ำ: ${LIMITS.MIN_WATER}-${LIMITS.MAX_WATER} ml • กาแฟ: ${LIMITS.MIN_COFFEE}-${LIMITS.MAX_COFFEE} g`);
      return;
    }
    if (isExtractingRef.current) return;
    isExtractingRef.current = true;
    

    setStep(1);
    setIsHeating(true);
    setIsExtracting(true);
    console.log("[PLACEHOLDER] เล่นเสียง: start-heating.wav");

    const base = stage.stove?.strength === "low" ? 8000 :
             stage.stove?.strength === "high" ? 4500 : 6000;
    const levelAdj = difficulty === 1 ? -300 : difficulty === 3 ? +300 : 0;
    // ปรับเวลาตามความละเอียด—ยิ่งละเอียด ยิ่งเร็วขึ้นเล็กน้อย
    const grindAdj = prefs.grind === "Fine" ? -400 : prefs.grind === "Medium-Fine" ? -200 : prefs.grind === "Coarse" ? +400 : 0;
    const duration = Math.max(3000, base + levelAdj + grindAdj);

    const addWaterToBase = () => setStage(s => ({ ...s, baseFilled: true }));
    const addCoffeeToBasket = () => setStage(s => ({ ...s, basketFilled: true }));

    const startedAt = Date.now();
    const tick = () => {
      if (!isExtractingRef.current) return;
      const t = Math.min(1, (Date.now() - startedAt) / duration);
      setExtraction(Math.round(t * 100));
      if (t < 1) requestAnimationFrame(tick);
      else {
        setIsHeating(false);
        setIsExtracting(false);
        setStage((s) => ({ ...s, base: { ...s.base, filled: false } }));
        setStep(2);
        isExtractingRef.current = false;
        console.log("[PLACEHOLDER] เล่นเสียง: finish-extract.wav");
      }
    };
    requestAnimationFrame(tick);
  };

  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  const pourToCup = () => {
    if (step !== 2 || !stage.cup) return;
    setStage((s) => ({ ...s, cup: { ...s.cup, hasCoffee: true } }));
    setIsPoured(true);
    setResultData({
    prefs,
    waterML,
    coffeeG,
    heatStrength,
    brewMethod: "Moka Pot",
    });
    setShowResult(true);
  };

  const navigate = useNavigate();

  const handlebackMenu = async () => {
      navigate("/coffee_menu");
  };

  const slidersDisabled = difficulty === 1;
  const heatDisabled    = difficulty === 1;

  return (
    <div className="min-h-screen w-screen flex flex-col bg-neutral-100">
      <Navbar />

      {/* Tutorial popup */}
      {showTutorial && (
        <TutorialModal onClose={() => { setShowTutorial(false); setShowPrefs(true); }} />
      )}

      {/* ---------- Popup เลือกเมล็ด / การคั่ว / ความละเอียด ---------- */}
      {showPrefs && (
        <PrefsModal
          BEANS={BEANS}
          ROASTS={ROASTS}
          GRINDS={GRINDS}
          value={prefs}
          onClose={() => setShowPrefs(false)}
          onSave={(v) => { savePrefs(v); setShowPrefs(false); }}
        />
      )}

      <div className="w-full flex" style={stageHeightStyle}>
        {/* LEFT */}
        <aside className="w-[20%] max-w-[440px] min-w-[300px] h-full border-r border-neutral-200 bg-white flex flex-col">
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center justify-between text-xl font-semibold mb-4">
                ระดับความยาก: <span className="text-amber-700">{levelLabel}</span>
            </div>

            <div className="flex rounded-xl overflow-hidden shadow-sm items-center justify-between">
              <button className={`flex-1 px-3 py-2 text-sm font-semibold ${panelMode === "equipment" ? "bg-amber-600 text-white" : "bg-neutral-100 text-neutral-700"}`} onClick={() => setPanelMode("equipment")}>อุปกรณ์</button>
              <button className={`flex-1 px-3 py-2 text-sm font-semibold ${panelMode === "ingredients" ? "bg-amber-600 text-white" : "bg-neutral-100 text-neutral-700"}`} onClick={() => setPanelMode("ingredients")}>วัตถุดิบ</button>
            </div>
          </div>
          {panelMode === "ingredients" && (
            <div className="p-4 border-b border-neutral-200">
              {/* แสดงค่าที่เลือก + ปุ่มแก้ไข */}
                <div className="text-sm text-neutral-700 grid grid-cols-1 gap-1">
                  <div className="flex items-center justify-between">
                    <div>เมล็ด: <b>{prefs.bean || "—"}</b></div>
                    <button className="px-2 py-1 rounded-lg border text-[11px] hover:bg-neutral-50" onClick={() => setShowPrefs(true)}>แก้ไข</button>
                  </div>
                  <div>ระดับคั่ว: <b>{prefs.roast || "—"}</b></div>
                  <div>ความละเอียด: <b>{prefs.grind || "—"}</b> {prefs.grind === "Medium-Fine" && <span className="text-emerald-600">แนะนำ</span>}</div>
                </div>
              {/* ปริมาณ */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-neutral-700">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" />น้ำ: {waterML} ml</div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-700" />ผงกาแฟ: {coffeeG} g</div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="text-xs text-neutral-600">
                    น้ำ (ml)
                    <input type="range" min={LIMITS.MIN_WATER} max={LIMITS.MAX_WATER} value={waterML} onChange={(e) => setWaterML(Number(e.target.value))} className="w-full" disabled={slidersDisabled} />
                    {guidanceOn && difficulty !== 1 && <small className="block text-[10px] text-neutral-500">แนะนำ ~120–180 ml</small>}
                  </label>
                  <label className="text-xs text-neutral-600">
                    ผงกาแฟ (g)
                    <input type="range" min={LIMITS.MIN_COFFEE} max={LIMITS.MAX_COFFEE} value={coffeeG} onChange={(e) => setCoffeeG(Number(e.target.value))} className="w-full" disabled={slidersDisabled} />
                    {guidanceOn && difficulty !== 1 && <small className="block text-[10px] text-neutral-500">แนะนำ ~14–18 g</small>}
                  </label>
                </div>
            </div>
          )}
          {/* Draggable list */}
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              {list.map((it) => {
                 if (usedItems[it.id]) return null;
                const Img = it.svg; const hasImage = !!it.image;
                const shouldBlink = blinkOn && blinkingItem === it.id;
                return (
                  <motion.div
                    key={it.id}
                    drag
                    dragMomentum={false}
                    dragSnapToOrigin={true} // ✅ เพิ่มตรงน
                    onDragEnd={(e, info) => onDragEnd(it, e, info)}
                    className={`rounded-xl border border-neutral-200 ${shouldBlink ? "animate-pulse ring-2 ring-amber-400" : ""} bg-neutral-50 hover:bg-white cursor-grab active:cursor-grabbing shadow-sm p-3 flex flex-col items-center gap-2`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {hasImage ? (<img src={it.image} alt={showNames ? it.name : "item"} className="w-20 h-20 object-contain" />) : (<Img className="w-20 h-20" />)}
                    {showNames && <div className="text-xs text-center font-medium">{it.name}</div>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT: workspace */}
        <main className="flex-1 h-full relative overflow-hidden">
          {/* status bar */}
          <div className="h-[64px] border-b border-neutral-200 bg-white/80 backdrop-blur flex items-center justify-between px-4">
            <div className="text-2xl font-semibold">
              {step === 0 && "เตรียมอุปกรณ์"}
              {step === 1 && "กำลังสกัดบนเตา"}
              {step === 2 && "เทใส่แก้ว"}
            </div>
            <div className="text-xl text-amber-800 whitespace-pre-line font-semibold" aria-live="polite">
              {guidanceOn ? <span key={`step-${step}`}>{message}</span> : null}
            </div>
          </div>

          {/* stage */}
          <div ref={workspaceRef} className="h-[calc(100%-64px)] w-full relative bg-gradient-to-b from-neutral-50 to-neutral-200">
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-300 to-transparent" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-10" key="stage-row">
              {/* CUP */}
              <div className={`relative ${blinkOn && blinkingItem==="cup" && !isPoured ? "animate-pulse" : ""} -translate-x-80`} key="cup-slot">
                {stage.cup ? (
                  <div className="flex flex-col items-center">
                    <CupSVG className="w-24 h-24" filled={isPoured} />
                    {showNames && <div className="text-xs mt-1 text-neutral-600">แก้ว</div>}
                  </div>
                ) : (
                  <Placeholder label={showNames ? "ลากแก้วมา" : ""} />
                )}
              </div>

              <div className="relative w-full h-[320px] flex items-center justify-center -translate-x-20">
                {/* STOVE + MOKA STACK WRAPPER */}
                <div className="relative w-56 h-80 flex items-end justify-center">
                  {/* STOVE */}
                  <div className={`absolute bottom-0 ${blinkOn && blinkingItem === "stove" ? "animate-pulse" : ""}`}
                    key="stove-slot">{stage.stove ? (
                      <StoveSVG
                        className={`w-60 h-28 cursor-pointer ${
                          stage.stove.strength === "low" ? "" :
                          stage.stove.strength === "medium" ? "" :
                          ""
                        }`}
                        on={isHeating}
                        strength={stage.stove.strength}
                        onClick={() => {
                          // cycle ความแรงไฟ
                          const nextStrength = stage.stove.strength === "low" ? "medium" :
                                              stage.stove.strength === "medium" ? "high" : "low";
                          setStage(s => ({ ...s, stove: { ...s.stove, strength: nextStrength } }));
                          console.log("ความแรงไฟปัจจุบัน:", nextStrength);
                        }}
                      />
                    ) : (
                      <Placeholder label={showNames ? "เตา" : ""} />
                    )}
                  </div>

                  {/* MOKA BASE */}
                  <div className={`absolute bottom-24 ${blinkOn && blinkingItem === "moka-base" ? "animate-pulse" : ""}`}
                    key="moka-slot-base">{stage.base ? (<MokaBaseSVG className="w-40 h-40" filled={stage.baseFilled} waterML={waterML}/>) : (<Placeholder label={showNames ? "ฐาน" : ""} />)}
                  </div>

                  {/* MOKA BASKET */}
                  <div className={`absolute bottom-40 ${blinkOn && blinkingItem === "moka-basket" ? "animate-pulse" : ""}`}
                    key="moka-slot-basket">{stage.basket ? (<BasketSVG className="w-36 h-24"filled={stage.basketFilled} coffeeG={coffeeG}/>) : null}
                  </div>

                  {/* MOKA TOP */}
                  <div className={`absolute bottom-44 ${blinkOn && blinkingItem === "moka-top" ? "animate-pulse" : ""}`}
                    key="moka-slot-top">{stage.top ? (<MokaTopSVG className="w-40 h-40"extracting={isExtracting}extraction={extraction}/>) : null}
                  </div>
                </div>
              </div>
            </div>
            {/* controls */}
            <div className="absolute right-4 bottom-4 flex items-center gap-3">
              {step === 0 && (
                <button className="px-5 py-3 rounded-xl bg-emerald-600 text-white shadow hover:bg-emerald-700" onClick={startHeat}>
                  เริ่มตั้งไฟ
                </button>
              )}
              {step === 2 && !isPoured && (
                <button className="px-5 py-3 rounded-xl bg-amber-700 text-white shadow hover:bg-amber-800" onClick={pourToCup}>
                  เทใส่แก้ว
                </button>
              )}
            </div>

            {/* extraction indicator */}
            {step >= 1 && (
              <div className="absolute top-20 right-4 bg-white/80 rounded-xl shadow p-3 text-sm">
                <div className="font-semibold mb-1">การสกัด</div>
                <div className="w-56 h-2 bg-neutral-200 rounded">
                  <div className="h-2 bg-amber-600 rounded" style={{ width: `${extraction}%`, transition: "width 200ms linear" }} />
                </div>
                <div className="text-right mt-1 text-neutral-600">{extraction}%</div>
              </div>
            )}
          </div>
        </main>
        {showResult && (
          <ResultModal
            prefs={prefs}
            waterML={waterML}
            coffeeG={coffeeG}
            heatStrength={heatStrength}
            brewMethod="Moka Pot"
            handlebackMenu={handlebackMenu}
            onRetry={() => {
              // รีเซ็ต stage, usedItems, slider, step, extraction
              setStage({
                base: null,
                basket: null,
                top: null,
                stove: null,
                cup: null,
                baseFilled: false,
                basketFilled: false,
              });
              setUsedItems({
                stove: false,
                "moka-base": false,
                "moka-basket": false,
                "moka-top": false,
                cup: false,
                water: false,
                ground: false,
              });
              setWaterML(defaults.water);
              setCoffeeG(defaults.coffee);
              setHeatStrength(defaults.heat);
              setIsPoured(false);
              setStep(0);
              setExtraction(0);
              setIsHeating(false);
              setIsExtracting(false);
              setBlinkingItem(null);
              setShowResult(false);
              setMessage(guidanceOn ? "รีเซ็ตแล้ว — เริ่มเตรียมอุปกรณ์ใหม่" : "");
            }}
          />
        )}
      </div>
    </div>
  );
}

function TutorialModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden p-6">
          <h3 className="text-lg font-semibold mb-2 text-center border-b border-neutral-200 pb-2 mb-4">สวัสดี! ยินดีต้อนรับสู่ Moka Pot Simulator</h3>
          <p className="text-sm mb-4">
            คุณจะได้เรียนรู้การชงกาแฟแบบ Moka Pot ตั้งแต่เตรียมอุปกรณ์จนถึงขั้นตอนการทำโดยจะมีขั้นตอนทำดังนี้
          </p>
          <ul className="list-disc list-inside text-sm mb-4">
            <li>เลือกสายพันธ์ุกาแฟ ระดับคั่วของกาแฟ และความละเอียดการบดของกาแฟ</li>
            <li>เตรียมอุปกรณ์ โดยจะลากอุปกรณ์จากด้านซ้ายในหมวดของอุปกรณ์</li>
            <li>เติมน้ำและผงกาแฟตามปริมาณที่แนะนำ โดยลากจากหมวดของวัตถุดิบ</li>
            <li>ตั้งไฟและเริ่มการสกัดกาแฟ</li>
            <li>เทกาแฟใส่แก้วพร้อมเสิร์ฟ!</li>
          </ul>
          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 rounded-lg border hover:bg-neutral-50" onClick={onClose}>เริ่มเรียนรู้</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Prefs Modal ---------- */
function PrefsModal({ BEANS, ROASTS, GRINDS, value, onSave, onClose }) {
  const [bean, setBean] = useState(value.bean || "");
  const [roast, setRoast] = useState(value.roast || "");
  const [grind, setGrind] = useState(value.grind || "");

  const canSave = bean && roast && grind;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">ตั้งค่าวัตถุดิบก่อนเริ่ม</h3>
            <p className="text-xs text-neutral-600">เลือกพันธุ์เมล็ด, ระดับการคั่ว และความละเอียดการบด</p>
          </div>

          <div className="p-6 grid gap-5">
            <ChoiceRow label="พันธุ์เมล็ด" items={BEANS} value={bean} setValue={setBean} />
            <ChoiceRow label="ระดับการคั่ว" items={ROASTS} value={roast} setValue={setRoast} />
            <ChoiceRow
              label="ความละเอียด"
              items={GRINDS}
              value={grind}
              setValue={setGrind}
              hint="แนะนำ ‘Medium-Fine’ สำหรับวิธีนี้"
            />
          </div>

          <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
            <button className="px-4 py-2 rounded-lg border hover:bg-neutral-50" onClick={onClose}>ยกเลิก</button>
            <button
              className={`px-4 py-2 rounded-lg text-white ${canSave ? "bg-amber-600 hover:bg-amber-700" : "bg-neutral-400 cursor-not-allowed"}`}
              disabled={!canSave}
              onClick={() => onSave({ bean, roast, grind })}
            >
              บันทึกและเริ่มเตรียมอุปกรณ์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoiceRow({ label, items, value, setValue, hint }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <button
            key={it}
            type="button"
            className={`px-3 py-2 rounded-xl border text-sm ${
              value === it ? "bg-amber-600 text-white border-amber-600" : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50"
            }`}
            onClick={() => setValue(it)}
          >
            {it}
          </button>
        ))}
      </div>
      {hint && <div className="mt-2 text-[11px] text-neutral-500">{hint}</div>}
      {/* [PLACEHOLDER] คุณสามารถใส่ภาพประกอบของแต่ละตัวเลือกตรงนี้ */}
    </div>
  );
}

/* ---------- SVG Fallbacks ---------- */
function Placeholder({ label }) {
  return (
    <div className="w-24 h-24 rounded-xl border border-dashed border-neutral-400 text-[10px] text-neutral-500 grid place-items-center bg-white/60">
      {label}
    </div>
  );
}
function MokaBaseSVG({ className = "", filled = false, waterML = 150 }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Moka base">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <path d="M20 100 L40 20 L80 20 L100 100 Z" fill="url(#g1)" stroke="#475569" strokeWidth="2" />
      {filled && (
        <rect x="30" y={100 - Math.min(55, (waterML / 250) * 55)} width="60" height={Math.min(55, (waterML / 250) * 55)} fill="#60a5fa" opacity="0.8" />
      )}
    </svg>
  );
}
function BasketSVG({ className = "", filled = false, coffeeG = 16 }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-label="Filter basket">
      <rect x="20" y="20" width="80" height="40" rx="8" fill="#d1d5db" stroke="#6b7280" strokeWidth="2" />
      {filled && (<rect x="24" y={40 - Math.min(18, (coffeeG / 22) * 18)} width="72" height={Math.min(36, (coffeeG / 22) * 36)} fill="#8b5e3c" />)}
    </svg>
  );
}
function MokaTopSVG({ className = "", extracting = false, extraction = 0 }) {
  const height = Math.round((extraction / 100) * 40);
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Moka top">
      <polygon points="30,80 90,80 80,20 40,20" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
      <rect x="40" y={80 - height} width="40" height={height} fill="#8b5e3c" opacity="0.85" />
      {extracting && (
        <>
          <path d="M60 10 C55 5, 55 15, 60 20 C65 25, 65 35, 60 40" stroke="#a3a3a3" strokeWidth="2" fill="none" />
          <path d="M70 8 C65 3, 65 13, 70 18 C75 23, 75 33, 70 38" stroke="#a3a3a3" strokeWidth="2" fill="none" />
        </>
      )}
    </svg>
  );
}
function StoveSVG({ className = "", on = false, strength = "medium", onClick }) {
  const fillColor = strength === "low" ? "#60a5fa" :
                    strength === "medium" ? "#facc15" : "#f87171";

  return (
    <svg 
      viewBox="0 0 90 90" 
      className={className} 
      aria-label="Stove"
      onClick={onClick}  // ✅ เพิ่มตรงนี้
    >
      <rect x="10" y="50" width="70" height="20" rx="6" fill={fillColor} />
      <circle cx="45" cy="45" r="18" fill={fillColor} />
      {on && (
        <g>
          <circle cx="45" cy="45" r="16" fill="none" stroke="#fb923c" strokeWidth="3" />
          <circle cx="45" cy="45" r="12" fill="none" stroke="#fdba74" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}


function CupSVG({ className = "", filled = false }) {
  return (
    <svg viewBox="0 0 90 90" className={className} aria-label="Cup">
      <rect x="20" y="35" width="40" height="30" rx="6" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
      <rect x="60" y="38" width="10" height="20" rx="4" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
      {filled && <rect x="22" y="55" width="36" height="8" fill="#8b5e3c" />}
    </svg>
  );
}
function WaterSVG({ className = "" }) {
  return (
    <svg viewBox="0 0 90 90" className={className} aria-label="Water">
      <path d="M45 10 C20 40, 20 60, 45 80 C70 60, 70 40, 45 10 Z" fill="#60a5fa" />
    </svg>
  );
}
function GroundsSVG({ className = "" }) {
  return (
    <svg viewBox="0 0 90 90" className={className} aria-label="Ground coffee">
      <ellipse cx="45" cy="55" rx="24" ry="12" fill="#8b5e3c" />
      <ellipse cx="45" cy="55" rx="24" ry="12" fill="#000" opacity=".08" />
    </svg>
  );
}
function ResultModal({ handlebackMenu, onRetry, prefs, waterML, coffeeG, heatStrength, brewMethod = "Moka Pot" }) {

  // ฟังก์ชันคำนวณรสชาติ
  const calculateTaste = () => {
    let taste = "";

    // วิเคราะห์จากการคั่ว
    if (prefs.roast === "Light") taste += "รสชาติสดชื่น มีความเปรี้ยวเล็กน้อย";
    if (prefs.roast === "Medium") taste += "รสชาติสมดุล ระหว่างเปรี้ยวและขม";
    if (prefs.roast === "Dark") taste += "รสชาติขมเข้ม มี body หนัก";

    // วิเคราะห์จากการบด
    if (prefs.grind === "Coarse") taste += ", การสกัดช้า รสชาติเบาบาง";
    if (prefs.grind === "Medium-Fine") taste += ", การสกัดเหมาะสม";
    if (prefs.grind === "Fine") taste += ", การสกัดเร็ว รสเข้ม";

    // วิเคราะห์จากความร้อน
    if (heatStrength === "high") taste += ", ใช้ความร้อนสูง ทำให้ขมเพิ่มขึ้น";
    if (heatStrength === "low") taste += ", ความร้อนต่ำ ทำให้รสชาติอ่อนลง";

    // วิเคราะห์จากปริมาณน้ำ
    if (waterML > 180) taste += ", น้ำมาก ทำให้เจือจาง";
    if (waterML < 120) taste += ", น้ำต่ำ ทำให้เข้มข้น";

    // วิเคราะห์จากวิธีสกัด
    if (brewMethod === "Moka Pot") {
      taste += ", วิธี Moka Pot ให้รสเข้มและ body หนักเล็กน้อย";
    }

    return taste;
  };

  const calculateCaffeine = () => Math.round(coffeeG * 12);
  const calculateCalories = () => Math.round(coffeeG * 2);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-11/12 max-w-lg shadow-lg flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">สรุปผลการชงกาแฟ</h2>

        <div>
          <p><b>วิธีการสกัด:</b> {brewMethod}</p>
          <p><b>พันธุ์เมล็ด:</b> {prefs.bean}</p>
          <p><b>ระดับการคั่ว:</b> {prefs.roast}</p>
          <p><b>ความละเอียดการบด:</b> {prefs.grind}</p>
          <p><b>ระดับความร้อน:</b> {heatStrength}</p>
          <p><b>ปริมาณน้ำ:</b> {waterML} ml</p>
          <p><b>ปริมาณกาแฟ:</b> {coffeeG} g</p>
        </div>

        <div>
          <p><b>รสชาติ:</b> {calculateTaste()}</p>
          <p><b>คาเฟอีน:</b> {calculateCaffeine()} mg</p>
          <p><b>แคลอรี่:</b> {calculateCalories()} kcal</p>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700"
          >
            ลองทำอีกครั้ง
          </button>
          <button
            onClick={handlebackMenu}
            className="px-4 py-2 bg-gray-400 text-white rounded-xl shadow hover:bg-gray-500"
          >
            ปิด / กลับไปเมนู
          </button>
        </div>
      </div>
    </div>
  );
}
