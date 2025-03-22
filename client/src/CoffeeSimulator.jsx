  import { useState, useRef, useEffect } from "react";
  import { motion } from "framer-motion";
  import Navbar from "./navbar";
  import { updateUserAchievement } from "./firebase/firebaseAchievements";
  import { useNavigate } from "react-router-dom";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import "./assets/css/simulator.css";  // นำไฟล์ CSS ที่สร้างไว้มาใช้

  const CoffeeSimulator = ({ userId: propUserId, selectedMenu }) => {
    // กำหนดความสูงของ Navbar เป็น 10vh
    const NAVBAR_HEIGHT_VH = 10;
    // ส่วนเนื้อหาหลักจะมีความสูงเท่ากับ 100vh - Navbar (คือ 90vh)
    const CONTENT_HEIGHT_PERCENT = 90 - NAVBAR_HEIGHT_VH;

    // state ต่าง ๆ
    const [currentStep, setCurrentStep] = useState(0);
    const [message, setMessage] = useState("ยินดีต้อนรับเข้าสู่ตัวจำลองการทำกาแฟ!");
    const [completedSteps, setCompletedSteps] = useState([]);
    const [workspaceItems, setWorkspaceItems] = useState([]);
    const [isGround, setIsGround] = useState(false);
    const [isGrinding, setIsGrinding] = useState(false);
    const [isPouring, setIsPouring] = useState(false);
    const [pointerPosition, setPointerPosition] = useState(0);
    const [direction, setDirection] = useState(1);
    const [qteActive, setQteActive] = useState(false);
    const [qteCount, setQteCount] = useState(0);
    const [isReadyToServe, setIsReadyToServe] = useState(false);
    const [dripImage, setDripImage] = useState("/simulator/เครื่องดริปที่ล้างกระดาษกรอกแล้วและใส่กาแฟบด.png");
    const [isGifPlaying, setIsGifPlaying] = useState(false);
    const [menuId, setMenuId] = useState(selectedMenu || "espresso");
    const [userId, setUserId] = useState(propUserId || null);
    const [subtitle, setSubtitle] = useState("");
    const [isMusicPlaying, setIsMusicPlaying] = useState(true);
    const [isServing, setIsServing] = useState(false);
    const [isDiscardingWater, setIsDiscardingWater] = useState(false);

    const navigate = useNavigate();
    const workspaceRef = useRef(null);

    // ---------- Steps ----------
    const [steps, setSteps] = useState([
      {
        id: "grind",
        name: "บดเมล็ดกาแฟ",
        description: "ลากเมล็ดกาแฟและเครื่องบดไปยังพื้นที่ดำเนินการ จากนั้นคลิกเม้าส์และหมุนเพื่อบด",
        equipment: [
          {
            id: "coffee-beans",
            name: "เมล็ดกาแฟ",
            draggable: true,
            image: "/simulator/เมล็ดกาแฟ.png",
          },
          {
            id: "grinder",
            name: "เครื่องบด",
            draggable: true,
            image: "/simulator/เครื่องบด(ไม่มีเมล็ด).png",
          },
          {
            id: "ground-coffee",
            name: "กาแฟบด",
            draggable: true,
            state: "hidden",
            image: "/simulator/กาแฟบด.png",
          },
        ],
      },
      {
        id: "prepare-drip",
        name: "เตรียมเครื่องดริป",
        description: "ลากอุปกรณ์ไปยังพื้นที่ดำเนินการตามลำดับ และล้างกระดาษกรองเพื่อลดกลิ่น",
        equipment: [
          {
            id: "drip-stand",
            name: "ดริปเปอร์",
            draggable: true,
            image: "/simulator/ดริปเปอร์.png",
          },
          {
            id: "paper-filter",
            name: "กระดาษกรอง",
            draggable: true,
            image: "/simulator/กระดาษกรอง.png",
          },
          {
            id: "drip-pot",
            name: "โถรองดริป",
            draggable: true,
            image: "/simulator/โถรอง.png",
          },
          {
            id: "kettle",
            name: "กาดริป",
            draggable: true,
            image: "/simulator/กาดริป.png",
          },
        ],
      },
      {
        id: "brew",
        name: "ดริปกาแฟ",
        description: "ลากผงกาแฟบดและกาดริปไปยังพื้นที่ดำเนินการ แล้วหมุนเพื่อดริปกาแฟ",
        equipment: [
          {
            id: "kettle",
            name: "กาดริป",
            draggable: true,
            image: "/simulator/กาดริป.jpg",
          },
        ],
      },
      {
        id: "finish",
        name: "เสร็จสิ้น",
        description: "ยินดีด้วย! คุณได้ทำเมนูเอสเพรสโซสำเร็จแล้ว",
        equipment: [],
      },
    ]);

    // ---------- ดึง userId จาก Firebase หากยังไม่มี prop ----------
    useEffect(() => {
      if (!propUserId) {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log("✅ ดึง userId จาก Firebase:", user.uid);
            setUserId(user.uid);
          } else {
            console.log("❌ ไม่มีผู้ใช้ล็อกอิน");
          }
        });
        return () => unsubscribe();
      }
    }, [propUserId]);

    // ---------- เล่นเพลงพื้นหลัง ----------
    const backgroundMusicRef = useRef(null);
    useEffect(() => {
      if (!backgroundMusicRef.current) {
        backgroundMusicRef.current = new Audio("/simulator/cafe-music.mp3");
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.volume = 0.2;
      }
      backgroundMusicRef.current.play().catch((error) =>
        console.log("Autoplay failed:", error)
      );
      
      return () => {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      };
    }, []);    

    // ฟังก์ชัน toggleBackgroundMusic
    const toggleBackgroundMusic = () => {
      if (!backgroundMusicRef.current) return;
      if (isMusicPlaying) {
        backgroundMusicRef.current.pause();
      } else {
        backgroundMusicRef.current.play().catch((err) =>
          console.log("Play error:", err)
        );
      }
      setIsMusicPlaying(!isMusicPlaying);
    };

  // ---------- อัปเดตข้อความ (Subtitle) ตามขั้นตอนและ QTE ----------
    useEffect(() => {
      let interval;
      let newMessage = "";

      if (currentStep === 2 && qteActive) {
        newMessage =
          "คุณต้องกดปุ่มให้ตรงจังหวะเพื่อทำการดริปทั้งหมด 3 ครั้งจึงจะได้เมนูกาแฟที่คุณต้องการ";
        interval = setInterval(() => {
          setPointerPosition((prev) => {
            let newPosition = prev + direction * 1;
            if (newPosition <= 0) {
              setDirection(1);
            } else if (newPosition >= 100) {
              setDirection(-1);
            }
            return Math.max(0, Math.min(100, newPosition));
          });
        }, 10);
      } else {
        switch (currentStep) {
          case 0:
            newMessage =
              "ขั้นตอนที่ 1: เริ่มจากการบดกาแฟ โดยการนำเครื่องบดมือไปวางไว้ก่อน จากนั้นนำเมล็ดกาแฟไปใส่ไว้แล้วกดเพื่อบดกาแฟ";
            break;
          case 1:
            newMessage =
              "ขั้นตอนที่ 2: ทำการเตรียมเครื่องดริป โดยการเพิ่มโถรองดริป ดริปเปอร์ และกระดาษกรอง จากนั้นเทน้ำล้างกระดาษกรอง";
            break;
          case 2:
            newMessage =
              "ขั้นตอนที่ 3: เริ่มการดริปกาแฟกัน! นำกาแฟที่เราบดไว้มาใส่เครื่องดริปต่อไปนำกาดริปมาเพื่อทำการดริปกาแฟ";
            break;
          case 3:
            newMessage =
              "ขั้นตอนที่ 4: เสร็จสิ้นการทำเมนูเอสเพรสโซ! คุณสามารถเริ่มต้นทำใหม่อีกรอบได้";
            break;
          default:
            newMessage = steps[currentStep]?.description || "ยินดีต้อนรับเข้าสู่ตัวจำลองการทำกาแฟ!";
        }
      }
      setMessage(newMessage);
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [currentStep, qteActive, direction, steps]);

    // ---------- อัปเดต Subtitle ----------
    useEffect(() => {
      setSubtitle(message);
    }, [message]);

    const handleDragEnd = (item, event, info) => {
      const workspaceRect = workspaceRef.current?.getBoundingClientRect();
      if (!workspaceRect) return;
      const isInWorkspace =
        info.point.x >= workspaceRect.left &&
        info.point.x <= workspaceRect.right &&
        info.point.y >= workspaceRect.top &&
        info.point.y <= workspaceRect.bottom;
      
      console.log("handleDragEnd: isInWorkspace =", isInWorkspace, "for item =", item);
    
      if (isInWorkspace) {
        setWorkspaceItems((current) => {
          console.log("Before processing, workspaceItems =", current);
          let updatedItems = [...current];
          
          // ----- ขั้นตอนที่ 1: บดกาแฟ -----
          if (currentStep === 0) {
            if (current.some((i) => i.id === item.id)) {
              setMessage("อุปกรณ์นี้ถูกเพิ่มไปแล้ว!");
              return current;
            }
            if (item.id === "ground-coffee" && item.state === "ready-to-use") {
              if (current.some((i) => i.id === "ground-coffee")) {
                setMessage("ผงกาแฟบดได้ถูกเพิ่มในพื้นที่ดำเนินการแล้ว!");
                return current;
              }
              updatedItems.push({
                id: "ground-coffee",
                name: "ผงกาแฟบด",
                state: "in-workspace",
              });
              setMessage("ผงกาแฟบดถูกเพิ่มในพื้นที่ดำเนินการ!");
              return updatedItems;
            }
            if (item.id === "grinder" && !current.some((i) => i.id === "grinder")) {
              updatedItems.push({ ...item, state: "default" });
              setMessage("เยี่ยมเลย ต่อไปนำเมล็ดกาแฟมาใส่เครื่องบด");
              return updatedItems;
            }
            if (item.id === "coffee-beans" && current.some((i) => i.id === "grinder")) {
              updatedItems = current.map((i) =>
                i.id === "grinder"
                  ? { ...i, name: "เครื่องบดที่มีเมล็ดกาแฟ", state: "ready-to-grind" }
                  : i
              );
              setMessage("กดที่เครื่องบดเพื่อบดเมล็ดกาแฟได้เลย");
              return updatedItems;
            }
            if (item.id === "coffee-beans" && !current.some((i) => i.id === "grinder")) {
              setMessage("กรุณาเพิ่มเครื่องบดก่อนเมล็ดกาแฟ!");
              return current;
            }
            setMessage("กรุณาเพิ่มอุปกรณ์ตามลำดับ! เริ่มจากเครื่องบดก่อนจากนั้นเป็นเมล็ดกาแฟ");
            return current;
          }
          
          // ----- ขั้นตอนที่ 2: เตรียมเครื่องดริป -----
          if (currentStep === 1) {
            if (current.some((i) => i.id === item.id)) {
              setMessage("อุปกรณ์นี้ถูกเพิ่มไปแล้ว!");
              return current;
            }
            if (item.id === "drip-pot" && !current.some((i) => i.state === "drip-pot")) {
              setMessage("ต่อไปเป็นดริปเปอร์");
              return [...current, { ...item, state: "drip-pot" }];
            }
            if (item.id === "drip-stand" && current.some((i) => i.state === "drip-pot")) {
              setMessage("ชิ้นสุดท้ายของอุปกรณ์ดริปคือกระดาษกรอก");
              return current.map((i) =>
                i.state === "drip-pot"
                  ? { ...i, name: "โถรองดริปที่มีดริปเปอร์", state: "drip-stand" }
                  : i
              );
            }
            if (item.id === "paper-filter" && current.some((i) => i.state === "drip-stand")) {
              setMessage("ต่อไปเป็นการล้างเครื่องดริป นำกาดริปมาเทใส่กระดาษกรอกได้เลย");
              return current.map((i) =>
                i.state === "drip-stand"
                  ? { ...i, name: "โถรองดริปที่มีดริปเปอร์และกระดาษกรอง", state: "paper-filter" }
                  : i
              );
            }
            if (item.id === "kettle" && current.some((i) => i.state === "paper-filter")) {
              setMessage("กำลังล้างกระดาษกรอง...");
              setIsPouring(true);
    
              const dripSound = new Audio("/simulator/drip-sound.mp3");
              dripSound.play();
    
              setTimeout(() => {
                setIsPouring(false);
                const updatedItemsAfter = current.map((i) =>
                  i.state === "paper-filter"
                    ? { ...i, name: "โถรองดริปพร้อมสำหรับเทน้ำ", state: "ready-to-pour-out" }
                    : i
                );
                setWorkspaceItems(updatedItemsAfter);
                setMessage("ล้างกระดาษกรองเรียบร้อยแล้ว! กดที่เครื่องดริปเพื่อเทน้ำออกจากโถ");
                console.log("Updated workspaceItems after cleaning =", updatedItemsAfter);
              }, 3000);
              return current;
            }          
          }
          
          // ----- ขั้นตอนที่ 3: ดริปกาแฟ -----
          if (currentStep === 2) {
            if (current.some((i) => i.id === item.id)) {
              setMessage("อุปกรณ์นี้ถูกเพิ่มไปแล้ว!");
              return current;
            }
            if (item.id === "ground-coffee" && current.some((i) => i.state === "waiting-for-ground-coffee")) {
              const updatedItems = current.map((i) =>
                i.state === "waiting-for-ground-coffee"
                  ? { ...i, name: "โถรองดริปที่มีผงกาแฟ", state: "waiting-for-kettle" }
                  : i
              );
              setMessage("ต่อไปนำกาดริปมาเพื่อทำการดริปกาแฟ");
              return updatedItems;
            }
            if (item.id === "kettle" && current.some((i) => i.state === "waiting-for-kettle")) {
              const updatedItems = current.map((i) =>
                i.state === "waiting-for-kettle"
                  ? { ...i, name: "โถรองดริปพร้อมดริปกาแฟ", state: "ready-to-brew" }
                  : i
              );
              setMessage("คุณต้องกดปุ่มให้ตรงจังหวะเพื่อทำการดริปทั้งหมด 3 ครั้งจึงจะได้เมนูกาแฟที่คุณต้องการ");
              setQteActive(true);
              return updatedItems;
            }
            setMessage("กรุณาเพิ่มอุปกรณ์ตามลำดับ! เริ่มจากผงกาแฟบดก่อน");
            return current;
          }
          
          return current;
        });
      } else {
        setMessage("โปรดลากอุปกรณ์ไปยังพื้นที่ดำเนินการ");
      }
    };

    const handlePourOut = () => {
      if (
        currentStep === 1 &&
        workspaceItems.some((item) => item.state === "ready-to-pour-out")
      ) {
        setMessage("กำลังเทน้ำออกจากโถรองดริป...");
        setIsDiscardingWater(true); // บอกว่ากำลังเทน้ำทิ้ง
    
        const pourSound = new Audio("/simulator/pour-sound.mp3");
        pourSound.play();
    
        setTimeout(() => {
          // เทน้ำออกเสร็จ
          setIsDiscardingWater(false);
    
          const updatedItems = workspaceItems.map((item) =>
            item.state === "ready-to-pour-out"
              ? { ...item, name: "โถรองดริปที่มีดริปเปอร์และกระดาษกรอง", state: "ready-to-drip" }
              : item
          );
          setWorkspaceItems(updatedItems);
          setMessage("น้ำถูกเทออกเรียบร้อย! พร้อมสำหรับดริป");
          handleNextStep();
        }, 3000);
      } else {
        setMessage("คุณต้องล้างกระดาษกรองก่อนที่จะเทน้ำออก");
      }
    };    

    const handleServe = () => {
      setMessage("กำลังเทกาแฟลงแก้ว...");
      setIsServing(true); // บอกว่ากำลังเทกาแฟ
      const pourSound = new Audio("/simulator/pour-sound.mp3");
      pourSound.play();
      setTimeout(() => {
        // ลบอุปกรณ์ "ready-to-serve" ออกจาก workspace
        setWorkspaceItems((current) =>
          current.filter((item) => item.state !== "ready-to-serve")
        );
        // ไปยังขั้นตอนถัดไป
        handleNextStep();
        // เปลี่ยนข้อความ
        setMessage("กาแฟพร้อมเสิร์ฟ! ไปยังขั้นตอนสุดท้าย");
        // เลิกสถานะกำลังเทกาแฟ
        setIsServing(false);
      }, 3000);
    };    
    
    const handleQTEProgress = () => {
      if (isGifPlaying) return;
      // ตรวจสอบตำแหน่ง pointer ก่อน
      if (pointerPosition < 40 || pointerPosition > 60) {
        // กดผิดจังหวะ: แสดงข้อความแจ้งเตือนและแสดงภาพ static
        setDripImage("/simulator/เครื่องดริปที่ล้างกระดาษกรอกแล้วและใส่กาแฟบด.png");
        setTimeout(() => {
          // หลังจาก 3 วินาทีให้รีเซ็ตข้อความกลับไปแสดงคำแนะนำสำหรับ QTE อีกครั้ง
          setMessage("ดริปพลาด! กรุณากดให้ตรงจังหวะ");
        }, 3000);
        return; // ไม่ทำงานต่อ
      }
      
      // ถ้า pointer อยู่ใน target zone ให้เล่น effect (gif กับเสียง)
      setIsGifPlaying(true);
      setDripImage("/simulator/ดริปกาแฟ.gif");
      const dripSound = new Audio("/simulator/drip-sound.mp3");
      dripSound.play();
      setTimeout(() => {
        setIsGifPlaying(false);
        setDripImage("/simulator/เครื่องดริปที่ล้างกระดาษกรอกแล้วและใส่กาแฟบด.png");
        setQteCount((prev) => {
          const newCount = prev + 1;
          if (newCount === 3) {
            setQteActive(false);
            setIsReadyToServe(true);
            setMessage("QTE เสร็จสิ้น! โปรดเทกาแฟใส่แก้ว");
          } else {
            setMessage(`ดริปสำเร็จ ${newCount}/3 ครั้ง`);
          }
          return newCount;
        });
      }, 3000);
    };    

    const handleGrind = () => {
      if (workspaceItems.some((item) => item.state === "ready-to-grind")) {
        setIsGrinding(true);
        setMessage("กำลังบดเมล็ดกาแฟ...3...2...1...");
        const grindSound = new Audio("/simulator/grind-sound.mp3");
        grindSound.play();
        setTimeout(() => {
          setIsGrinding(false);
          setWorkspaceItems((current) =>
            current.filter((item) => item.id !== "grinder")
          );
          setWorkspaceItems((current) => [
            ...current,
            {
              id: "ground-coffee",
              name: "กาแฟบด",
              state: "ready-to-use",
              image: "/simulator/กาแฟบด.png",
            },
          ]);
          setSteps((prevSteps) =>
            prevSteps.map((step) =>
              step.id === "grind"
                ? {
                    ...step,
                    equipment: step.equipment.map((equip) =>
                      equip.id === "ground-coffee"
                        ? { ...equip, state: "ready-to-use" }
                        : equip
                    ),
                  }
                : step
            )
          );
          setMessage("เมล็ดกาแฟถูกบดเรียบร้อยแล้ว!");
          handleNextStep();
        }, 3000);
      } else {
        setMessage("กรุณาเพิ่มเครื่องบดและเมล็ดกาแฟก่อนบด");
      }
    };

    const getImageByState = (item) => {
      if (item.id === "grinder") {
        if (isGrinding) return "/simulator/เครื่องบด_.gif";
        if (item.state === "ready-to-grind") return "/simulator/เครื่องบด(มีเมล็ด).png";
        return "/simulator/เครื่องบด(ไม่มีเมล็ด).png";
      }
      if (item.id === "kettle") {
        console.log("getImageByState: isPouring =", isPouring, "item.state =", item.state);
        // ทดสอบบังคับให้ return gif ถ้าเงื่อนไขไหนตรง
        return "/simulator/ล้างที่กรอง.gif";
      }
      const imageMap = {
        "เครื่องบด": "/simulator/เครื่องบด(ไม่มีเมล็ด).png",
        "เครื่องบดที่มีเมล็ดกาแฟ": "/simulator/เครื่องบด(มีเมล็ด).png",
        "ผงกาแฟบด": "/simulator/กาแฟบด.png",
        "โถรองดริป": "/simulator/โถรอง.png",
        "โถรองดริปที่มีดริปเปอร์": "/simulator/โถรองและดริปเปอร์.png",
        "โถรองดริปที่มีดริปเปอร์และกระดาษกรอง": "/simulator/เครื่องดริป.png",
        "โถรองดริปพร้อมสำหรับเทน้ำ": "/simulator/ล้างกระดาษกรอก.png",
        "โถรองดริปที่มีดริปเปอร์และกระดาษกรองที่ล้างกระดาษแล้ว(พร้อมใส่กาแฟบด)":
          "/simulator/เครื่องดริป(ล้างกระดาษแล้ว).png",
        "โถรองดริปที่มีผงกาแฟ":
          "/simulator/เครื่องดริปที่ล้างกระดาษกรอกแล้วและใส่กาแฟบด.png",
        "โถรองดริปพร้อมดริปกาแฟ": "/simulator/โถรองดริปพร้อมดริปกาแฟ.png",
        "เทกาแฟออกจากโถรอง": "/simulator/ดริปกาแฟเสร็จ.png",
      };
      return imageMap[item.name] || "/simulator/default.png";
    };

    const handleNextStep = () => {
      setCompletedSteps((prev) => [...prev, steps[currentStep].id]);
      if (currentStep === 0) {
        setWorkspaceItems([]);
        setMessage("เตรียมเครื่องดริปต่อไป");
      } else if (currentStep === 1) {
        const newItem = {
          id: "drip-pot-complete",
          name: "โถรองดริปที่มีดริปเปอร์และกระดาษกรองที่ล้างกระดาษแล้ว(พร้อมใส่กาแฟบด)",
          state: "waiting-for-ground-coffee",
        };
        setWorkspaceItems([newItem]);
        setMessage("โถรองดริปพร้อมแล้ว! โปรดเพิ่มกาแฟบดก่อนดริป");
      } else if (currentStep === steps.length - 1) {
        setMessage("คุณได้ทำเมนูเอสเพรสโซสำเร็จแล้ว!");
      } else {
        setWorkspaceItems([]);
      }
      setCurrentStep((prev) => prev + 1);

      console.log("ขั้นตอนที่ :"+currentStep);
    };

    const handleFinishMenu = async () => {
      if (!userId) {
        console.warn("❌ ไม่สามารถบันทึกได้: userId เป็น undefined หรือไม่ได้ล็อกอิน");
        navigate("/coffee_menu");
        return;
      }
      try {
        // ส่ง category เป็น "simulator" และ achievementId เป็น menuId
        await updateUserAchievement(userId, "simulator", menuId, true);
        setMessage(`คุณทำเมนู ${menuId} สำเร็จแล้ว!`);
      } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการบันทึกค่าความสำเร็จ:", error);
      } finally {
        navigate("/coffee_menu");
      }
    };    

    const handleRestart = () => {
      setCurrentStep(0);
      setMessage("ยินดีต้อนรับเข้าสู่ตัวจำลองการทำกาแฟ!");
      setCompletedSteps([]);
      setWorkspaceItems([]);
      setIsGround(false);
      setIsGrinding(false);
      setIsPouring(false);
      setQteActive(false);
      setIsReadyToServe(false);
      setIsGifPlaying(false);
      setQteCount(0);
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === "grind"
            ? {
                ...step,
                equipment: step.equipment.map((equip) =>
                  equip.id === "ground-coffee" ? { ...equip, state: "hidden" } : equip
                ),
              }
            : step
        )
      );
    };

    // ---------- เตรียม list ของอุปกรณ์ทั้งหมดที่ไม่ hidden ----------
    const equipmentList = Array.from(
      new Set(
        steps.flatMap((step) =>
          step.equipment.filter((item) => item.state !== "hidden").map((equipment) => equipment.id)
        )
      )
    ).map((id) =>
      steps.flatMap((step) => step.equipment).find((eq) => eq.id === id)
    );

    // กำหนดจำนวนแถว (rows) สำหรับ grid ในคอลัมน์อุปกรณ์
    const itemCount = equipmentList.length;
    let rows = Math.ceil(itemCount / 2);
    if (rows < 3) rows = 3;
    if (rows > 4) rows = 4;
    // ถ้า itemCount > 8 ให้ scale อุปกรณ์ลง
    let scaleFactor = 1;
    if (itemCount > 8) {
      scaleFactor = 8 / itemCount;
    }

    return (
      <div className="relative bg-[url('../public/background.jpg')] bg-cover bg-center bg-white/85 bg-blend-overlay" style={{ height: "90vh", width: "100%" }}>
        <Navbar />
        {/* ส่วนเนื้อหาหลักแบ่งเป็น 2 ส่วน: พื้นที่เนื้อหา (90%) กับ Footer (10%) */}
        <div className="simulator-container">
          <div className="sim-content desktop-layout flex items-start p-2">
            {/* Left Area: Equipment List */}
            <div className="left-area equipment-area">
              <h3 className="title m-0">อุปกรณ์ที่ใช้ในเมนูนี้</h3>
              <div
                className="equipment-grid"
                style={{
                  gridTemplateRows: `repeat(${rows}, 1fr)`,
                }}
              >
              {Array.from(new Set(steps.flatMap(step => step.equipment
              .filter((item) => item.state !== "hidden") // กรองเฉพาะอุปกรณ์ที่ไม่ซ่อน
              .map(equipment => equipment.id)))).map((id) => {
                // หาข้อมูลของอุปกรณ์จากขั้นตอน
                const equipment = steps
                  .flatMap(step => step.equipment)
                  .find(equipment => equipment.id === id);
                return (
                  <motion.div
                    key={equipment.id}
                    className="equipment-slot flex items-center justify-center rounded-lg cursor-grab"
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={1}
                    dragSnapToOrigin={true}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onDragEnd={(event, info) => handleDragEnd(equipment, event, info)}
                    style={{
                      width: "100%",
                      height: "140px",
                      transform: `scale(${scaleFactor})`,
                      transformOrigin: "top left",
                    }}
                  >
                    {equipment.image ? (
                      <motion.img
                        src={equipment.image}
                        alt={equipment.name}
                        className="object-contain cursor-grab"
                        style={{ width: "80%", height: "80%" }}
                        drag
                        dragElastic={1}
                        dragSnapToOrigin={true}
                        onDragEnd={(event, info) => handleDragEnd(equipment, event, info)}
                      />
                    ) : (
                      <span>{equipment.name}</span>
                    )}
                  </motion.div>
                );})}
              </div>
            </div>

            {/* Center Area: Workspace */}
            <div className="center-area workspace-area flex-1" ref={workspaceRef}>
              <h3 className="title m-0">
                พื้นที่สำหรับนำอุปกรณ์ต่างๆ มาดำเนินการ
              </h3>
              <div className="flex-1 flex flex-col items-center mt-4">
                {currentStep === 3 ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={`/simulator/เอสเพรสโซ.png`}
                      alt={`เมนู ${menuId}`}
                      className="final-img"
                    />
                    {/* 🔹 กล่องครอบปุ่มแบบแนวนอน */}
                    <div className="mt-2 flex flex-row items-center gap-4">
                      <button
                        onClick={handleRestart}
                        className="text-white 
                          py-2 px-4 
                          bg-yellow-800
                          font-semibold 
                          rounded-full 
                          shadow-md 
                          hover:bg-yellow-900
                          transition 
                          transform 
                          hover:scale-105 
                          focus:outline-none 
                          focus:ring-2 
                          focus:ring-blue-500 
                          focus:ring-offset-2"
                      >
                        เริ่มต้นใหม่
                      </button>
                      {currentStep === steps.length - 1 && (
                        <button
                          onClick={handleFinishMenu}
                          className="
                            text-white 
                            py-2 px-4 
                            bg-yellow-800 
                            font-semibold 
                            rounded-full 
                            shadow-md 
                            hover:bg-yellow-900
                            transition 
                            transform 
                            hover:scale-105 
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-blue-500 
                            focus:ring-offset-2
                          "
                        >
                          เสร็จสิ้น
                        </button>
                      )}
                    </div>
                  </div>
                ) : qteActive ? (
                  <div className="flex flex-col items-center" style={{ minHeight: "300px" }}>
                    {/* รูปเครื่องดริป */}
                    <img
                      src={dripImage}
                      alt="เครื่องดริป"
                      className="object-contain mb-4 drip-image"
                      style={{
                        width: "300px",
                        height: "350px",
                        marginTop: "25px",
                        objectFit: "contain",
                      }}
                    />
                    {/* Progress Bar */}
                    <div
                      className="progress-container relative mt-8"
                      style={{ width: "300px", height: "7px" }}
                    >
                      <div className="progress-bar bg-gray-300 w-full h-full relative overflow-visible">
                        <div
                          className="target-zone bg-orange-600 absolute"
                          style={{
                            width: "20%",
                            height: "100%",
                            left: "40%",
                            top: 0,
                          }}
                        />
                        <img
                          src="/simulator/เมล็ดกาแฟqte.png"
                          alt="Pointer"
                          className="absolute pointer-point"
                          style={{
                            width: "80px",       // กำหนดความกว้างเป็น 20px (หรือมากกว่านี้ตามต้องการ)
                            height: "80px",      // กำหนดความสูงเป็น 20px
                            left: `${pointerPosition}%`,
                            top: "50%",
                            transform: "translate(-50%, -50%)", // เลื่อนให้อยู่กึ่งกลาง pointer
                            zIndex: 9999, // เพิ่ม z-index สูง ๆ
                          }}
                        />
                      </div>
                    </div>
                    {/* ปุ่มกดเพื่อดริป (QTE) */}
                    <button
                      onClick={handleQTEProgress}
                      disabled={isGifPlaying}
                      className={`mt-4 bg-amber-900 text-white py-2 px-4 rounded ${
                        isGifPlaying ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-950"
                      }`}
                    >
                      คลิกเพื่อดริป
                    </button>
                  </div>
                ) : isDiscardingWater ? (
                  <div className="flex flex-col items-center pour-out">
                    <img
                      src="/simulator/เทน้ำทิ้ง.png"
                      alt="กำลังเทน้ำทิ้ง"
                      style={{
                        width: "auto",
                        height: "400px",
                        marginTop: "25px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ) : currentStep === 1 && isPouring ? (
                  // 🔸 ถ้าอยู่ในขั้นตอนที่ 2 และกำลังล้างกระดาษกรอง
                  <div className="flex flex-col items-center pouring">
                    <img
                      src="/simulator/ล้างที่กรอง.gif"
                      alt="กำลังล้างกระดาษกรอง"
                      style={{
                        width: "auto",
                        height: "400px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ) : isServing ? (  // <-- เพิ่มเงื่อนไข isServing
                  <div className="flex flex-col items-center pour-img">
                    <img
                      src="/simulator/เทกาแฟออก.png"
                      alt="กำลังเทกาแฟ"
                      style={{
                        width: "auto",
                        height: "400px",
                        marginTop: "25px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ) : isReadyToServe ? (
                  <div className="flex flex-col items-center">
                    <img
                      src="/simulator/ดริปกาแฟเสร็จ.png"
                      alt="เทกาแฟลงแก้ว"
                      className="serve-image object-contain cursor-pointer"
                      onClick={handleServe}
                      style={{
                        width: "auto",
                        height: "450px",
                        marginTop: "25px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ) : (
                  workspaceItems.length > 0 &&
                  workspaceItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`workspace-item p-4 rounded 
                        ${item.state === "ready-to-grind" && !isGrinding ? "cursor-pointer" : ""}
                        ${item.id === "kettle" && isPouring ? "text-blue-500" : ""}
                        ${item.state === "ready-to-drip" ? "cursor-pointer bg-yellow-200" : ""}
                        ${item.state === "ready-to-pour-out" ? "cursor-pointer" : ""}
                        ${item.state === "ready-to-brew" ? "cursor-pointer bg-orange-300" : ""}
                        ${item.state === "ready-to-serve" ? "cursor-pointer bg-purple-300" : ""}
                      `}
                      onClick={
                        item.state === "ready-to-grind" && !isGrinding
                          ? handleGrind
                          : item.state === "ready-to-pour-out"
                          ? handlePourOut
                          : item.state === "waiting-for-ground-coffee"
                          ? () => setMessage("โปรดเพิ่มกาแฟบดก่อนดริป")
                          : item.state === "ready-to-brew"
                          ? handleQTEProgress
                          : item.state === "ready-to-serve"
                          ? handleServe
                          : undefined
                      }
                      animate={item.id === "grinder" && isGround ? { y: [-5, 5, 0] } : {}}
                      transition={{ duration: 0.3, repeat: isGrinding ? Infinity : 0, repeatType: "reverse" }}
                    >
                      <img
                        src={getImageByState(item)}
                        alt={item.name}
                        className="workspace-img" 
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Right Area: Step List (สำหรับเดสก์ท็อปเท่านั้น) */}
            <div className="right-area">
              <button
                onClick={toggleBackgroundMusic}  // ฟังก์ชันเปิด/ปิดเสียง
                className="bg-gray-600 bg-orange-300 hover:bg-red-400 text-white font-semibold px-3 py-1 rounded-full shadow-lg transition-all duration-300 mb-2"
              >
                {/* ใช้รูปแทนข้อความ */}
                <img
                  src={isMusicPlaying ? "/simulator/music-sign.png" : "/simulator/mute.png"}
                  alt={isMusicPlaying ? "mute icon" : "music icon"}
                  className="w-6 h-6 object-contain"
                />
              </button>
              <div className="right-item flex flex-col relative">
                <h3 className="text-center font-semibold text-lg text-dark-brown m-0">
                  รายการขั้นตอนต่างๆ
                </h3>
                <ul className="mt-4 list-none flex-grow text-dark-brown items-center">
                  {steps.map((step, index) => (
                    <li
                      key={step.id}
                      className={`flex items-center mt-2 ${
                        index === currentStep
                          ? "font-bold text-yellow-950"
                          : "text-gray-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        readOnly
                        checked={completedSteps.includes(step.id)}
                        className="mr-2 accent-yellow-950"
                      />
                      {step.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <button
                    className="bg-yellow-900 text-white w-full py-2 rounded shadow hover:bg-yellow-950 disabled:opacity-50"
                    onClick={() => {
                      if (currentStep > 0) {
                        const oldStep = currentStep;
                        const newStep = oldStep - 1;  // ขั้นตอนที่จะย้อนกลับไป
                        const stepIdToRemove = steps[oldStep].id;      // ขั้นตอนที่กำลังออก
                        const arrivingStepId = steps[newStep].id;      // ขั้นตอนที่ย้อนกลับไป

                        // ลดขั้นตอน
                        setCurrentStep(newStep);
                        // ล้าง workspace
                        setWorkspaceItems([]);

                        // เอาขั้นตอนที่กำลังออก (stepIdToRemove) และขั้นตอนที่ไปถึง (arrivingStepId) ออกจาก completedSteps
                        // เพื่อให้ต้องทำใหม่ทั้งสองขั้น
                        setCompletedSteps((prev) =>
                          prev.filter((id) => id !== stepIdToRemove && id !== arrivingStepId)
                        );

                        // ตรวจสอบการย้อนกลับในกรณีที่ย้อนกลับจากขั้นตอนสุดท้ายหรือ QTE
                        if (oldStep === 3 && newStep === 2) {
                          // กลับมา QTE
                          setQteActive(true);
                          setQteCount(0);
                          setIsGifPlaying(false);
                          setIsReadyToServe(false);
                          setDripImage("/simulator/เครื่องดริปที่ล้างกระดาษกรอกแล้วและใส่กาแฟบด.png");
                          setMessage("กลับมาที่ขั้นตอน 3: ดริปกาแฟ (QTE) อีกครั้ง!");
                        } else if (oldStep === 2 && newStep === 1) {
                          // ปิด QTE
                          setQteActive(false);
                          setQteCount(0);
                          setIsGifPlaying(false);
                          setIsReadyToServe(false);
                          setDripImage("/simulator/เครื่องดริปที่ล้างกระดาษกรอกแล้วและใส่กาแฟบด.png");
                          setMessage("กลับมาที่ขั้นตอน 2: เตรียมเครื่องดริป");
                        }

                        // ถ้าย้อนกลับมา step 0 (บดกาแฟ) → รีเซ็ตกาแฟบดเป็น hidden
                        if (newStep === 0) {
                          // นอกจากรีเซ็ต state ของกาแฟบดแล้ว
                          // เอา "grind" ออกจาก completedSteps ด้วย (เผื่อมีค้างอยู่)
                          setCompletedSteps((prev) => prev.filter((id) => id !== "grind"));
                          setSteps((prevSteps) =>
                            prevSteps.map((step) =>
                              step.id === "grind"
                                ? {
                                    ...step,
                                    equipment: step.equipment.map((equip) =>
                                      equip.id === "ground-coffee" ? { ...equip, state: "hidden" } : equip
                                    ),
                                  }
                                : step
                            )
                          );
                        }
                      }
                    }}
                  >
                    ย้อนกลับขั้นตอน
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Subtitle */}
        <footer className="footer-subtitle">
          <p className="
            text-base     /* default มือถือเล็ก ๆ */
            font-bold
            sm:text-lg    /* ≥640px */
            md:text-xl    /* ≥768px */
            lg:text-2xl   /* ≥1024px */
          ">{subtitle}</p>
        </footer>
      </div>
    );
  };

  export default CoffeeSimulator;
