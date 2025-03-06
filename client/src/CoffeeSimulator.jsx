import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from "./navbar";
import { updateUserAchievement } from "./firebase/firebaseAchievements";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CoffeeSimulator = ({ userId: propUserId, selectedMenu }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('ยินดีต้อนรับเข้าสู่ตัวจำลองการทำกาแฟ!');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [isGround,setIsGround] = useState(false);
  const [isGrinding, setIsGrinding] = useState(false);
  const [isPouring, setIsPouring] = useState(false);
  const [pointerPosition, setPointerPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [qteActive, setQteActive] = useState(false); // เปิด/ปิด QTE
  const [qteCount, setQteCount] = useState(0); // นับจำนวนการกดใน QTE
  const [isReadyToServe, setIsReadyToServe] = useState(false); // สถานะพร้อมเสิร์ฟ
  const [dripImage, setDripImage] = useState('/simulator/เครื่องดริปที่ล้างกระดาษกรอกแล้วและใส่กาแฟบด.png'); // ภาพปัจจุบัน
  const [isGifPlaying, setIsGifPlaying] = useState(false); // ล็อก QTE ขณะ gif เล่น
  const [menuId, setMenuId] = useState(selectedMenu || "espresso");
  const [userId, setUserId] = useState(propUserId || null);

  const navigate = useNavigate();

  const [steps, setSteps] = useState([
    {
      id: 'grind',
      name: 'บดเมล็ดกาแฟ',
      description: 'ลากเมล็ดกาแฟและเครื่องบดไปยังพื้นที่ดำเนินการ จากนั้นคลิกเม้าส์และหมุนเพื่อบด',
      equipment: [
        { id: 'coffee-beans', name: 'เมล็ดกาแฟ', draggable: true,image:'/simulator/เมล็ดกาแฟ.png' },
        { id: 'grinder', name: 'เครื่องบด', draggable: true,image:'/simulator/เครื่องบด(ไม่มีเมล็ด).png' },
        { id: 'ground-coffee', name: 'กาแฟบด', draggable: true, state: 'hidden',image:'/simulator/กาแฟบด.png' }, // ซ่อนเริ่มต้น
      ],
    },
    {
      id: 'prepare-drip',
      name: 'เตรียมเครื่องดริป',
      description: 'ลากอุปกรณ์ไปยังพื้นที่ดำเนินการตามลำดับ และล้างกระดาษกรองเพื่อลดกลิ่น',
      equipment: [
        { id: 'drip-stand', name: 'ดริปเปอร์', draggable: true,image:'/simulator/ดริปเปอร์.png' },
        { id: 'paper-filter', name: 'กระดาษกรอง', draggable: true,image:'/simulator/กระดาษกรอง.png' },
        { id: 'drip-pot', name: 'โถรองดริป', draggable: true,image:'/simulator/โถรอง.png' },
        { id: 'kettle', name: 'กาดริป', draggable: true,image:'/simulator/กาดริป.png' },
      ],
    },
    {
      id: 'brew',
      name: 'ดริปกาแฟ',
      description: 'ลากผงกาแฟบดและกาดริปไปยังพื้นที่ดำเนินการ แล้วหมุนเพื่อดริปกาแฟ',
      equipment: [
        { id: 'kettle', name: 'กาดริป', draggable: true,image:'/simulator/กาดริป.jpg' },
      ],
    },    
    {
      id: 'finish',
      name: 'เสร็จสิ้น',
      description: 'ยินดีด้วย! คุณได้ทำเมนูเอสเพรสโซสำเร็จแล้ว',
      equipment: [] // ไม่แสดงอุปกรณ์ในขั้นตอนนี้
    }    
  ]);

  useEffect(() => {
    if (!propUserId) { // ✅ ถ้ายังไม่มี userId ให้ดึงจาก Firebase
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
  }, [propUserId]); // ✅ ถ้า props มีค่าอยู่แล้ว จะไม่ดึงจาก Firebase

  useEffect(() => {
    const backgroundMusic = new Audio('/simulator/cafe-music.mp3');
    backgroundMusic.loop = true; // 🔄 วนซ้ำเพลง
    backgroundMusic.volume = 0.5; // 🔊 ระดับเสียง
    backgroundMusic.play().catch(error => console.log("Autoplay failed:", error)); // จับ error ถ้า autoplay ถูกบล็อค
  
    return () => {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0; // 🔹 รีเซ็ตเสียงเมื่อออกจากหน้า
    };
  }, []);

  const startBackgroundMusic = () => {
    if (!window.backgroundMusic) {
      window.backgroundMusic = new Audio('/simulator/cafe-music.mp3');
      window.backgroundMusic.loop = true;
      window.backgroundMusic.volume = 0.5;
    }
    window.backgroundMusic.play();
  };  

  const [subtitle, setSubtitle] = useState('');

  const workspaceRef = useRef(null);

  useEffect(() => {
    let interval;
    let newMessage = "";
  
    if (currentStep === 2 && qteActive) { // เมื่ออยู่ในขั้นตอน QTE (ดริปกาแฟ)
      newMessage = "คุณต้องกดปุ่มให้ตรงจังหวะเพื่อทำการดริปทั้งหมด 3 ครั้งจึงจะได้เมนูกาแฟที่คุณต้องการ";
  
      interval = setInterval(() => {
        setPointerPosition((prev) => {
          let newPosition = prev + direction * 1; // เพิ่มตำแหน่ง Pointer ตามทิศทาง
  
          if (newPosition <= 0) {
            setDirection(1); // เปลี่ยนทิศทางไปทางขวาเมื่อถึงขอบซ้าย
          } else if (newPosition >= 100) {
            setDirection(-1); // เปลี่ยนทิศทางไปทางซ้ายเมื่อถึงขอบขวา
          }
  
          return Math.max(0, Math.min(100, newPosition)); // จำกัดตำแหน่งให้อยู่ระหว่าง 0-100
        });
      }, 10); // อัปเดตตำแหน่ง pointer ทุก 10ms
  
    } else {
      // อัปเดตข้อความให้สอดคล้องกับขั้นตอนที่อยู่
      switch (currentStep) {
        case 0:
          newMessage = "ขั้นตอนที่ 1: เริ่มจากการบดกาแฟ โดยการนำเครื่องบดมือไปวางไว้ก่อน จากนั้นนำเมล็ดกาแฟไปใส่ไว้แล้วกดเพื่อบดกาแฟ";
          break;
        case 1:
          newMessage = "ขั้นตอนที่ 2: ทำการเตรียมเครื่องดริป โดยการเพิ่มโถรองดริป ดริปเปอร์ และกระดาษกรอง จากนั้นเทน้ำล้างกระดาษกรอง";
          break;
        case 2:
          newMessage = "ขั้นตอนที่ 3: เริ่มการดริปกาแฟกัน! นำกาแฟที่เราบดไว้มาใส่เครื่องดริปต่อไปนำกาดริปมาเพื่อทำการดริปกาแฟ";
          break;
        case 3:
          newMessage = "ขั้นตอนที่ 4: เสร็จสิ้นการทำเมนูเอสเพรสโซ! คุณสามารถเริ่มต้นทำใหม่อีกรอบได้";
          break;
        default:
          newMessage = steps[currentStep]?.description || "ยินดีต้อนรับเข้าสู่ตัวจำลองการทำกาแฟ!";
      }
    }
  
    setMessage(newMessage);
  
    return () => {
      if (interval) clearInterval(interval); // ล้าง Interval เมื่อออกจากขั้นตอน
    };
  }, [currentStep, qteActive, direction, steps]);
  
  // ✅ ใช้ useEffect แยกต่างหากเพื่ออัปเดต Subtitle Area
  useEffect(() => {
    // ใช้ message เป็นแหล่งข้อมูลหลักสำหรับ Subtitle
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
  
    if (isInWorkspace) {
      setWorkspaceItems((current) => {
        let updatedItems = [...current];
  
        // ตรวจสอบขั้นตอนที่ 1: บดกาแฟ
        if (currentStep === 0) {
          // ห้ามเพิ่มอุปกรณ์ที่ซ้ำ
          if (current.some((i) => i.id === item.id)) {
            setMessage('อุปกรณ์นี้ถูกเพิ่มไปแล้ว!');
            return current;
          }
  
          // ซ่อนกาแฟบดจนกว่าจะถูกลากกลับมายังพื้นที่อุปกรณ์
          if (item.id === 'ground-coffee' && item.state === 'ready-to-use') {
            if (current.some((i) => i.id === 'ground-coffee')) {
              setMessage('ผงกาแฟบดได้ถูกเพิ่มในพื้นที่ดำเนินการแล้ว!');
              return current;
            }

            updatedItems.push({
              id: 'ground-coffee',
              name: 'ผงกาแฟบด',
              state: 'in-workspace', // แสดงในพื้นที่ดำเนินการ
            });

            setMessage('ผงกาแฟบดถูกเพิ่มในพื้นที่ดำเนินการ!');

            // อย่าเรียก `handleNextStep` ในทันที ให้ผู้ใช้ลากกลับไปยังพื้นที่อุปกรณ์
            return updatedItems;
          }                  
          
          // ตรวจสอบเงื่อนไขของการเพิ่มอุปกรณ์
          if (item.id === 'grinder' && !current.some((i) => i.id === 'grinder')) {
            updatedItems.push({ ...item, state: 'default' });
            setMessage('เยี่ยมเลย ต่อไปนำเมล็ดกาแฟมาใส่เครื่องบด');
            return updatedItems;
          }
  
          if (item.id === 'coffee-beans' && current.some((i) => i.id === 'grinder')) {
            updatedItems = current.map((i) =>
              i.id === 'grinder'
                ? { ...i, name: 'เครื่องบดที่มีเมล็ดกาแฟ', state: 'ready-to-grind' }
                : i
            );
            setMessage('กดที่เครื่องบดเพื่อบดเมล็ดกาแฟได้เลย');
            
            return updatedItems;
          }

            // แสดงข้อความแจ้งเตือนถ้าลากเมล็ดกาแฟมาก่อนเครื่องบด
          if (item.id === 'coffee-beans' && !current.some((i) => i.id === 'grinder')) {
            setMessage('กรุณาเพิ่มเครื่องบดก่อนเมล็ดกาแฟ!');
            return current;
          }
          setMessage('กรุณาเพิ่มอุปกรณ์ตามลำดับ! เริ่มจากเครื่องบดก่อนจากนั้นเป็นเมล็ดกาแฟ');
          return current;
        }
  
        // ตรวจสอบขั้นตอนที่ 2: เตรียมเครื่องดริป
        if (currentStep === 1) {
          // ห้ามเพิ่มอุปกรณ์ที่ซ้ำ
          if (current.some((i) => i.id === item.id)) {
            setMessage('อุปกรณ์นี้ถูกเพิ่มไปแล้ว!');
            return current;
          }
        
          // เพิ่มโถรองดริป
          if (item.id === 'drip-pot' && !current.some((i) => i.state === 'drip-pot')) {
            setMessage('ต่อไปเป็นดริปเปอร์');
            return [...current, { ...item, state: 'drip-pot' }];
          }
        
          // เพิ่มดริปเปอร์
          if (item.id === 'drip-stand' && current.some((i) => i.state === 'drip-pot')) {
            setMessage('ชิ้นสุดท้ายของอุปกรณ์ดริปคือกระดาษกรอก');
            return current.map((i) =>
              i.state === 'drip-pot'
                ? { ...i, name: 'โถรองดริปที่มีดริปเปอร์', state: 'drip-stand' }
                : i
            );
          }
        
          // เพิ่มกระดาษกรอง
          if (item.id === 'paper-filter' && current.some((i) => i.state === 'drip-stand')) {
            setMessage('ต่อไปเป็นการล้างเครื่องดริป นำกาดริปมาเทใส่กระดาษกรอกได้เลย');
            return current.map((i) =>
              i.state === 'drip-stand'
                ? { ...i, name: 'โถรองดริปที่มีดริปเปอร์และกระดาษกรอง', state: 'paper-filter' }
                : i
            );
          }
        
          // ล้างกระดาษกรอง
          if (item.id === 'kettle' && current.some((i) => i.state === 'paper-filter')) {
            setMessage('กำลังล้างกระดาษกรอง...');
            setIsPouring(true);

            const dripSound = new Audio('/simulator/drip-sound.mp3');
            dripSound.play();

            setTimeout(() => {
              setIsPouring(false);
              const updatedItems = current.map((i) =>
                i.state === 'paper-filter'
                  ? { ...i, name: 'โถรองดริปพร้อมสำหรับเทน้ำ', state: 'ready-to-pour-out' }
                  : i
              );
              setWorkspaceItems(updatedItems);
              setMessage('ล้างกระดาษกรองเรียบร้อยแล้ว! กดที่เครื่องดริปเพื่อเทน้ำออกจากโถ');
            }, 3000);
        
            return current;
          }
        
          setMessage('กรุณาเพิ่มอุปกรณ์ตามลำดับ! เริ่มจากโถรองดริปก่อน');
          return current;
        }
  
        // ตรวจสอบขั้นตอนที่ 3: ดริปกาแฟ
        if (currentStep === 2) {
          if (current.some((i) => i.id === item.id)) {
            setMessage('อุปกรณ์นี้ถูกเพิ่มไปแล้ว!');
            return current;
          }
  
          if (item.id === 'ground-coffee' && current.some((i) => i.state === 'waiting-for-ground-coffee')) {
            const updatedItems = current.map((i) =>
              i.state === 'waiting-for-ground-coffee'
                ? { ...i, name: 'โถรองดริปที่มีผงกาแฟ', state: 'waiting-for-kettle' }
                : i
            );
            setMessage('ต่อไปนำกาดริปมาเพื่อทำการดริปกาแฟ');
            return updatedItems;
          }
  
          if (item.id === 'kettle' && current.some((i) => i.state === 'waiting-for-kettle')) {
            const updatedItems = current.map((i) =>
              i.state === 'waiting-for-kettle'
                ? { ...i, name: 'โถรองดริปพร้อมดริปกาแฟ', state: 'ready-to-brew' }
                : i
            );
            setMessage('คุณต้องกดปุ่มให้ตรงจังหวะเพื่อทำการดริปทั้งหมด 3 ครั้งจึงจะได้เมนูกาแฟที่คุณต้องการ');

                // เปิด QTE เมื่ออุปกรณ์ครบ
            setQteActive(true); // เปิดใช้งาน QTE
            return updatedItems;
          }
  
          setMessage('กรุณาเพิ่มอุปกรณ์ตามลำดับ! เริ่มจากผงกาแฟบดก่อน');
          return current;
        }
  
        return current;
      });
    } else {
      setMessage('โปรดลากอุปกรณ์ไปยังพื้นที่ดำเนินการ');
    }
  };  

  const handlePourOut = () => {
    if (currentStep === 1 && // ตรวจสอบว่าขั้นตอนคือการเตรียมเครื่องดริป
      workspaceItems.some((item) => item.state === 'ready-to-pour-out') // ตรวจสอบสถานะโถรองดริป
    ) {
      setMessage('กำลังเทน้ำออกจากโถรองดริป...');
  
      const pourSound = new Audio('/simulator/pour-sound.mp3');
      pourSound.play();

      setTimeout(() => {
        // เปลี่ยนสถานะของโถรองดริปให้พร้อมสำหรับขั้นตอนที่ 3
        const updatedItems = workspaceItems.map((item) =>
          item.state === 'ready-to-pour-out'
            ? { ...item, name: 'โถรองดริปที่มีดริปเปอร์และกระดาษกรอง', state: 'ready-to-drip' }
            : item
        );
  
        setWorkspaceItems(updatedItems); // อัปเดต workspaceItems
        setMessage('น้ำถูกเทออกเรียบร้อย! พร้อมสำหรับดริป');
        handleNextStep(); // ไปยังขั้นตอนถัดไป
      }, 3000); // รอ 3 วินาที
    } else {
      setMessage('คุณต้องล้างกระดาษกรองก่อนที่จะเทน้ำออก');
    }
  };

  const handleServe = () => {
    setMessage('กำลังเทกาแฟลงแก้ว...'); // แสดงข้อความระหว่างเทกาแฟ
    setTimeout(() => {
      // ลบโถรองดริปจาก Workspace
      setWorkspaceItems((current) =>
        current.filter((item) => item.state !== 'ready-to-serve')
      );
      handleNextStep(); // ไปยังขั้นตอนสุดท้าย
      setMessage('กาแฟพร้อมเสิร์ฟ! ไปยังขั้นตอนสุดท้าย'); // แสดงข้อความเมื่อเทกาแฟเสร็จ
    }, 1000); // ตั้งเวลา 3 วินาที
  };

  const handleQTEClick = () => {
    const targetLeft = 40; // ตำแหน่งซ้ายของ target zone
    const targetRight = 60; // ตำแหน่งขวาของ target zone

    if (isGifPlaying) return; // หยุดการทำงานถ้า gif กำลังเล่นอยู่

    // ตรวจสอบว่าตำแหน่ง Pointer อยู่ในพื้นที่เป้าหมายหรือไม่
    if (pointerPosition >= targetLeft && pointerPosition <= targetRight) {
        setQteCount((prevCount) => prevCount + 1); // เพิ่ม QTE count
    } else {
        setMessage('ดริปผิดพลาด! โปรดลองใหม่');
    }
  };

  useEffect(() => {
    if (qteCount > 0 && qteCount < 3) {
        setMessage(`ดริปสำเร็จ ${qteCount}/3 ครั้ง`);

        // ตั้งเวลาให้ข้อความหายไปหลังจาก 3 วินาที
        const timeout = setTimeout(() => {
            setMessage('');
        }, 3000);

        return () => clearTimeout(timeout); // ล้าง timeout เมื่อ component ออกจากการ render
    }

    if (qteCount === 3) {
        setQteActive(false); // ปิด QTE
        setIsReadyToServe(true); // เปิดสถานะพร้อมเสิร์ฟ
        setQteCount(0); // รีเซ็ต QTE count

        setMessage('ดริปกาแฟเสร็จสิ้น! โปรดกดที่โถเพื่อเทกาแฟใส่แก้ว');

        // ตั้งเวลาให้ข้อความหายไปหลังจาก 3 วินาที
        const timeout = setTimeout(() => {
            setMessage('');
        }, 3000);

        // อัปเดต workspace items ให้พร้อมสำหรับเสิร์ฟ
        setWorkspaceItems((current) =>
            current.map((item) =>
                item.id === 'ground-coffee' || item.id === 'kettle'
                    ? { ...item, state: 'ready-to-serve' }
                    : item
            )
        );

        handleNextStep(); // ไปยังขั้นตอนถัดไป

        return () => clearTimeout(timeout); // ล้าง timeout เมื่อ component ออกจากการ render
    }
  }, [qteCount]);
  
  const handleQTEProgress = () => {
    if (isGifPlaying) return; // หยุดการทำงานถ้า gif กำลังเล่นอยู่
  
    setIsGifPlaying(true); // ล็อก QTE
    setDripImage('/simulator/โถรองดริปพร้อมดริปกาแฟ.png'); // เปลี่ยนเป็น gif

    const dripSound = new Audio('/simulator/drip-sound.mp3');
    dripSound.play();
  
    setTimeout(() => {
      setIsGifPlaying(false); // ปลดล็อก QTE
      setDripImage('/simulator/เครื่องดริปที่ล้างกระดาษกรอกแล้วและใส่กาแฟบด.png'); // กลับไปเป็นภาพนิ่ง
      setQteCount((prev) => prev + 1); // เพิ่มจำนวนการกดสำเร็จ
  
      if (qteCount + 1 === 3) {
        // ถ้า QTE สำเร็จครบ 3 ครั้ง
        setDripImage('/simulator/เครื่องดริปที่ล้างกระดาษกรอกแล้วและใส่กาแฟบด.png'); // เปลี่ยนเป็นภาพดริปเสร็จ
        setQteActive(false); // ปิด QTE
        setIsReadyToServe(true); // พร้อมสำหรับขั้นตอนสุดท้าย
        setMessage('QTE เสร็จสิ้น! โปรดเทกาแฟใส่แก้ว');
      }
    }, 3000); // เวลา gif 3 วินาที
  };  
  
  const handleGrind = () => {
    if (workspaceItems.some((item) => item.state === 'ready-to-grind')) {
      setIsGrinding(true);
      setMessage('กำลังบดเมล็ดกาแฟ...3...2...1...');

      // ✅ เล่นเสียงบดกาแฟ
      const grindSound = new Audio('/simulator/grind-sound.mp3');
      grindSound.play();

      setTimeout(() => {
        setIsGrinding(false);
  
        // ลบ "เครื่องบดที่มีเมล็ดกาแฟ" ออกจากพื้นที่ดำเนินการ
        setWorkspaceItems((current) =>
          current.filter((item) => item.id !== 'grinder')
        );
  
        // เพิ่ม "กาแฟบด" ทันทีในพื้นที่อุปกรณ์
        setWorkspaceItems((current) => [
          ...current,
          {
            id: 'ground-coffee',
            name: 'กาแฟบด',
            state: 'ready-to-use',
            image: '/simulator/กาแฟบด.png', // ใช้ path ของรูปภาพ
          },
        ]);
  
        // อัปเดตขั้นตอนให้กาแฟบดแสดงในขั้นตอนถัดไป
        setSteps((prevSteps) =>
          prevSteps.map((step) =>
            step.id === 'grind'
              ? {
                  ...step,
                  equipment: step.equipment.map((equip) =>
                    equip.id === 'ground-coffee'
                      ? { ...equip, state: 'ready-to-use' } // ให้กาแฟบดพร้อมใช้งาน
                      : equip
                  ),
                }
              : step
          )
        );
  
        setMessage('เมล็ดกาแฟถูกบดเรียบร้อยแล้ว!');
        handleNextStep(); // ดำเนินการไปยังขั้นตอนถัดไป
      }, 3000);
    } else {
      setMessage('กรุณาเพิ่มเครื่องบดและเมล็ดกาแฟก่อนบด');
    }
  };     

  const getImageByState = (item) => {
    if (item.id === 'grinder') {
      // ✅ ถ้ากำลังบดอยู่ ให้ใช้ GIF
      if (isGrinding) return '/simulator/เครื่องบด_.gif';
      
      // ✅ ถ้ายังไม่ได้บด แต่มีเมล็ดกาแฟอยู่ แสดงเครื่องบดที่มีเมล็ด
      if (item.state === 'ready-to-grind') return '/simulator/เครื่องบด(มีเมล็ด).png';
  
      // ✅ ค่าเริ่มต้น: เครื่องบดเปล่า
      return '/simulator/เครื่องบด(ไม่มีเมล็ด).png';
    }
    const imageMap = {
      "เครื่องบด": "/simulator/เครื่องบด(ไม่มีเมล็ด).png",
      "เครื่องบดที่มีเมล็ดกาแฟ": "/simulator/เครื่องบด(มีเมล็ด).png",
      "ผงกาแฟบด": "/simulator/กาแฟบด.png",
      "โถรองดริป": "/simulator/โถรอง.png",
      "โถรองดริปที่มีดริปเปอร์": "/simulator/โถรองและดริปเปอร์.png",
      "โถรองดริปที่มีดริปเปอร์และกระดาษกรอง": "/simulator/เครื่องดริป.png",
      "โถรองดริปพร้อมสำหรับเทน้ำ": "/simulator/ล้างกระดาษกรอก.png",
      "โถรองดริปที่มีดริปเปอร์และกระดาษกรองที่ล้างกระดาษแล้ว(พร้อมใส่กาแฟบด)": "/simulator/เครื่องดริป(ล้างกระดาษแล้ว).png",
      "โถรองดริปที่มีผงกาแฟ": "/simulator/เครื่องดริปที่ล้างกระดาษกรอกแล้วและใส่กาแฟบด.png",
      "โถรองดริปพร้อมดริปกาแฟ": "/simulator/โถรองดริปพร้อมดริปกาแฟ.png",
      "เทกาแฟออกจากโถรอง": "/simulator/ดริปกาแฟเสร็จ.png",
    };
  
    // หาก state หรือ name ไม่ตรงกับใน map ให้ใช้ค่าดีฟอลต์
    return imageMap[item.name] || "/simulator/default.png";
  };  

  const handleNextStep = () => {
    setCompletedSteps((prev) => [...prev, steps[currentStep].id]); // เพิ่มขั้นตอนที่เสร็จสิ้น
  
    if (currentStep === 0) {
      // รีเซ็ต workspaceItems เพื่อเตรียมสำหรับขั้นตอนที่สอง
      setWorkspaceItems([]);
      setMessage('เตรียมเครื่องดริปต่อไป');
    } else if (currentStep === 1) {
      // เพิ่มโถรองดริปสำหรับขั้นตอนที่สาม
      const newItem = {
        id: 'drip-pot-complete',
        name: 'โถรองดริปที่มีดริปเปอร์และกระดาษกรองที่ล้างกระดาษแล้ว(พร้อมใส่กาแฟบด)',
        state: 'waiting-for-ground-coffee', // แสดงว่ายังต้องการกาแฟบด
      };
      setWorkspaceItems([newItem]);
      setMessage('โถรองดริปพร้อมแล้ว! โปรดเพิ่มกาแฟบดก่อนดริป');
    } else if (currentStep === steps.length - 1) {
      setMessage('คุณได้ทำเมนูเอสเพรสโซสำเร็จแล้ว!');
    } else {
      setWorkspaceItems([]);
    }
  
    // ไปยังขั้นตอนถัดไป
    setCurrentStep((prev) => prev + 1);
  };  
  
  const handleFinishMenu = async () => {
    if (!userId) {
      console.warn("❌ ไม่สามารถบันทึกได้: userId เป็น undefined หรือไม่ได้ล็อกอิน");
      navigate("/coffee_menu"); // ✅ ถ้าไม่มี userId ให้เปลี่ยนหน้าโดยไม่บันทึกข้อมูล
      return;
    }

    try {
      await updateUserAchievement(userId, menuId); // ✅ บันทึกค่าความสำเร็จของผู้ใช้
      setMessage(`คุณทำเมนู ${menuId} สำเร็จแล้ว!`);
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการบันทึกค่าความสำเร็จ:", error);
    } finally {
      navigate("/coffee_menu"); // ✅ ไม่ว่าเกิดอะไรขึ้น ให้เปลี่ยนหน้าไป coffee_menu
    }
  };
  
  const handleRestart = () => {
    setCurrentStep(0);
    setMessage('ยินดีต้อนรับเข้าสู่ตัวจำลองการทำกาแฟ!');
    setCompletedSteps([]);
    setWorkspaceItems([]);
    setIsGround(false);
    setIsGrinding(false);
    setIsPouring(false);
    setQteActive(false);
    setIsReadyToServe(false);
    setIsGifPlaying(false); // รีเซ็ตสถานะ gif
    setQteCount(0); // รีเซ็ต QTE count
  
    // รีเซ็ตสถานะของกาแฟบดใน steps กลับไปเป็น hidden
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === 'grind'
          ? {
              ...step,
              equipment: step.equipment.map((equip) =>
                equip.id === 'ground-coffee'
                  ? { ...equip, state: 'hidden' } // รีเซ็ตเป็นซ่อน
                  : equip
              ),
            }
          : step
      )
    );
  };  
 
const navbarHeight = 106; // ความสูงของ Navbar (px)
const simulatorHeight = `calc(100vh - ${navbarHeight}px)`; // ความสูงของ Simulator

  return (
    <div className="relative ">
      <Navbar />
      {/* 🔹 Background Blur Layer */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/simulator/bs-sim.jpg')", // เปลี่ยนเป็น path ของพื้นหลัง
          filter: "blur(8px)", // ปรับระดับความเบลอ
          zIndex: "-1", // ทำให้เป็นพื้นหลัง
        }}
      ></div>
      {/* Layout */}
      <div className="grid grid-cols-12 gap-2 pt-2 px-4 sm:px-8 "  
      style={{
        height: simulatorHeight,
      }}>
        {/* Left Area - Equipment list */}
        <div className="col-span-12 sm:col-span-5 h-screen p-2"style={{ height: simulatorHeight }}>
          {/* หัวข้อของรายการอุปกรณ์ */}
          <h3 className="text-center font-semibold text-2xl text-amber-900 mt-4">อุปกรณ์ที่ใช้ในเมนูนี้</h3>
          {/* รายการอุปกรณ์ */}
          <div className="mt-8 grid grid-cols-2  ">
            {/* รวมอุปกรณ์จากทุกขั้นตอน */}
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
                  className="flex items-center justify-center rounded-lg cursor-grab"
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={1}
                  initial={{ opacity: 0, scale: 0.8 }} // เริ่มต้นขนาดเล็กและจาง
                  animate={{ opacity: 1, scale: 1 }} // แสดงเต็มเมื่อโหลด
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.1 }} // ขยายเมื่อ hover
                  whileTap={{ scale: 0.9 }} // กดแล้วลดขนาดเล็กน้อย
                  onDragEnd={(event, info) => handleDragEnd(equipment, event, info)}
                  style={{
                    width: "100%", // ความกว้างพื้นหลัง
                    height: "180px", // ความสูงพื้นหลัง
                  }}
                >
                  {/* แสดงรูปภาพ */}
                  {equipment.image ? (
                    <motion.img
                    src={equipment.image} // ใช้ path ของรูปภาพ
                    alt={equipment.name}
                    className="object-contain cursor-grab" // เพิ่ม cursor-grab ให้รูปภาพ
                    style={{
                      width: "100%", // ความกว้างเต็มพื้นหลัง
                      height: "100%", // ความสูงเต็มพื้นหลัง
                    }}
                    drag // เปิดใช้งานการลากเฉพาะที่รูปภาพ
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // จำกัดการลาก
                    dragElastic={1} // เพิ่มความยืดหยุ่น
                    onDragEnd={(event, info) => handleDragEnd(equipment, event, info)} // ฟังก์ชันเรียกใช้เมื่อการลากสิ้นสุด
                    />
                  ) : (
                    <span>{equipment.name}</span> // แสดงข้อความหากไม่มีรูป
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Center Area - Action area */}
        <div ref={workspaceRef} className="col-span-12 sm:col-span-5 h-screen p-2 flex flex-col"style={{ height: simulatorHeight }}>
        {/* หัวข้อสำหรับพื้นที่ดำเนินการ */}
        <h3 className="text-center font-semibold text-2xl text-amber-900 mt-4">พื้นที่สำหรับนำอุปกรณ์ต่างๆ มาดำเนินการ</h3>
        {/* พื้นที่ทำงาน (Workspace) */}
        <div className="mt-4 h-full flex flex-col items-center justify-start" style={{ height: "70%", paddingTop: "50px" }}>
          {currentStep === 3 ? (
            // แสดงขั้นตอนที่ 4: ภาพเมนูเอสเพรสโซและปุ่มเริ่มใหม่
            <div className="flex flex-col items-center mt-4">
              {/* แสดงภาพเมนูที่ผู้ใช้ทำสำเร็จ */}
              <img
                src={`/simulator/เอสเพรสโซ.png`} // ใช้ dynamic path ให้รองรับทุกเมนู
                alt={`เมนู ${menuId}`}
                className="w-80 h-80 object-cover"
              />

              {/* ปุ่มสำหรับเริ่มต้นใหม่ */}
              <button
                onClick={handleRestart} // รีเซ็ตซิมมูเลเตอร์
                className="mt-4 text-white py-2 px-4 bg-blue-700 rounded shadow hover:bg-blue-800"
              >
                เริ่มต้นใหม่
              </button>

              {/* ปุ่มเสร็จสิ้น เฉพาะเมื่อถึงขั้นตอนสุดท้าย */}
              {currentStep === steps.length - 1 && (
                <button
                  onClick={() => {
                    handleFinishMenu(); // บันทึกค่าความสำเร็จ
                  }}
                  className="mt-4 text-white py-2 px-4 bg-green-600 rounded shadow hover:bg-green-700"
                >
                  เสร็จสิ้น
                </button>
              )}
            </div>
          ) : qteActive ? (
            // QTE แสดงเมื่อ qteActive เป็น true
            <div className="flex flex-col items-center">
            {/* แสดงภาพเครื่องดริป */}
              <img
                src={dripImage}
                alt="เครื่องดริป"
                className="w-96 h-96 object-contain mb-4"
                style={{ marginTop: "25px" }} // เพิ่ม marginTop เพื่อลดความสูง
              />
              {/* QTE Components */}
              <div className="progress-container relative w-full max-w-lg mt-8">
                <div className="progress-bar w-full h-4 relative o verflow-hidden">
                  <div
                    className="target-zone bg-green-500 h-full absolute"
                    style={{ width: "20%", left: "40%" }}
                  ></div>
                  <div
                    className="pointer bg-red-500 h-full w-2 absolute"
                    style={{ left: `${pointerPosition}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={handleQTEProgress}
                disabled={isGifPlaying} // ปิดการใช้งานปุ่มขณะ gif เล่นอยู่
                className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded ${
                  isGifPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                คลิกเพื่อดริป
              </button>
            </div>
          ) : isReadyToServe ? (
              // แสดงภาพแทนปุ่มให้กดเทกาแฟใส่แก้ว
            <div className="flex flex-col items-center">
            <img
              src="/simulator/ดริปกาแฟเสร็จ.png" // ใส่ path ของรูปภาพที่ต้องการ
              alt="เทกาแฟลงแก้ว"
              className="w-96 h-96 object-contain cursor-pointer" // ขนาดภาพและ cursor pointer
              onClick={handleServe} // เรียกฟังก์ชัน handleServe เมื่อคลิก
            />
          </div>
          ) : (
            // แสดง Workspace Items สำหรับขั้นตอนอื่น ๆ
            workspaceItems.length > 0 &&
            workspaceItems.map((item) => (
              <motion.div
                key={item.id}
                className={`p-4 rounded mt-2 
                  ${item.state === "ready-to-grind" && !isGrinding ? "cursor-pointer" : ""}
                  ${item.id === "kettle" && isPouring ? "text-blue-500" : ""}
                  ${item.state === "ready-to-drip" ? "cursor-pointer bg-yellow-200" : ""}
                  ${item.state === "ready-to-pour-out" ? "cursor-pointer " : ""}
                  ${item.state === "ready-to-brew" ? "cursor-pointer bg-orange-300" : ""}
                  ${item.state === "ready-to-serve" ? "cursor-pointer bg-purple-300" : ""}
                `}
                onClick={
                  item.state === "ready-to-grind" && !isGrinding
                    ? handleGrind // เรียกฟังก์ชัน handleGrind
                    : item.state === "ready-to-pour-out"
                    ? handlePourOut // เรียกฟังก์ชัน handlePourOut
                    : item.state === "waiting-for-ground-coffee"
                    ? () => setMessage("โปรดเพิ่มกาแฟบดก่อนดริป")
                    : item.state === "ready-to-brew"
                    ? handleQTEClick // เรียก QTE
                    : item.state === "ready-to-serve"
                    ? handleServe // กดเพื่อเทกาแฟลงแก้ว
                    : undefined
                }
                animate={item.id === 'grinder' && isGround ? { y: [-5, 5, 0] } : {}} // ✅ ทำให้เด้ง
                transition={{ duration: 0.3, repeat: isGrinding ? Infinity : 0, repeatType: "reverse" }} // ✅ ตั้งค่าให้เด้ง
                style={{
                  width: "500px", // กำหนดขนาดความกว้าง (ปรับค่าตามต้องการ)
                  height: "500px", // กำหนดขนาดความสูง (ปรับค่าตามต้องการ)
                  display: "flex",
                  justifyContent: "center", // จัดแนวนอน
                  alignItems: "center", // จัดแนวตั้ง
                  opacity: item.state === "hidden" ? 0 : 1, // ซ่อนกาแฟบดฅ
                }}
              >
                {/* แสดงภาพแทนข้อความ */}
                <img
                  src={getImageByState(item)} // ดึงภาพตาม state หรือ name
                  alt={item.name} // Alt text สำหรับภาพ
                  className="w-full h-full object-contain" // เพิ่มสไตล์เพื่อปรับขนาด
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
      <div className="relative flex flex-col items-center">
        {/* ปุ่มเปิดเพลงพื้นหลัง (ชิดขวา) */}
        <div className="w-full flex justify-end px-4">
          <button 
            onClick={startBackgroundMusic} 
            className="bg-gray-600 bg-opacity-80 hover:bg-gray-700 text-white mt-6 font-semibold px-5 py-2 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-300">
            🎵 
          </button>
        </div>

        {/* Right Area - Step List (จัดให้อยู่ตรงกลาง) */}
        <div 
          className="col-span-12 sm:col-span-2 bg-orange-200 rounded shadow p-4 flex flex-col justify-center"
          style={{ 
            height: "420px", 
            width: "260px", 
            margin: "auto", 
            backgroundSize: "contain", 
            backgroundPosition: "center", 
            backgroundRepeat: "no-repeat",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)" // ทำให้ Step List อยู่ตรงกลางระหว่างบน-ล่าง
          }}
        >
          {/* หัวข้อรายการขั้นตอน */}
          <h3 className="text-center font-semibold text-lg">รายการขั้นตอนต่างๆ</h3>

          {/* รายการขั้นตอน */}
          <ul className="mt-4 list-none flex-grow">
            {steps.map((step, index) => (
              <li
                key={step.id} 
                className={`flex items-center mt-2 ${
                  index === currentStep ? 'font-bold text-yellow-950' : 'text-gray-800'
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
          {/* ปุ่มย้อนกลับขั้นตอน */}
          <div className="mt-4">
            <button
              className="bg-yellow-900 text-white w-full py-2 rounded shadow hover:bg-yellow-950 disabled:opacity-50"
              disabled={currentStep === 0} 
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep((prev) => prev - 1);
                  setMessage(`กลับไปยังขั้นตอน: ${steps[currentStep - 1]?.name}`);
                  setWorkspaceItems([]); 
                }
              }}
            >
              ย้อนกลับขั้นตอน
            </button>
          </div>
        </div>
      </div>
        {/* Subtitle Area */}
        <div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-center text-lg font-semibold text-white px-4 py-2 rounded"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)", // เพิ่มพื้นหลังโปร่งแสงเพื่อให้อ่านง่าย
            maxWidth: "90%", // จำกัดความกว้างสูงสุด
            zIndex: 50, // วางคำบรรยายไว้บนสุด
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default CoffeeSimulator;
