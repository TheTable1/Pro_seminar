import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate


const CoffeeSimulator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการนำทาง
  const [message, setMessage] = useState('ยินดีต้อนรับเข้าสู่ตัวจำลองการทำกาแฟ!');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [isGround,setIsGround] = useState(false);
  const [isGrinding, setIsGrinding] = useState(false);
  const [isPouring, setIsPouring] = useState(false);
  const [pointerPosition, setPointerPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [gameInterval, setGameInterval] = useState(null);
  const [qteActive, setQteActive] = useState(false); // เปิด/ปิด QTE
  const [qteCount, setQteCount] = useState(0); // นับจำนวนการกดใน QTE
  const [isReadyToServe, setIsReadyToServe] = useState(false); // สถานะพร้อมเสิร์ฟ



  const steps = [
    {
      id: 'grind',
      name: 'บดเมล็ดกาแฟ',
      description: 'ลากเมล็ดกาแฟและเครื่องบดไปยังพื้นที่ดำเนินการ จากนั้นคลิกเม้าส์และหมุนเพื่อบด',
      equipment: [
        { id: 'coffee-beans', name: 'เมล็ดกาแฟ', draggable: true },
        { id: 'grinder', name: 'เครื่องบด', draggable: true },
      ],
    },
    {
      id: 'prepare-drip',
      name: 'เตรียมเครื่องดริป',
      description: 'ลากอุปกรณ์ไปยังพื้นที่ดำเนินการตามลำดับ และล้างกระดาษกรองเพื่อลดกลิ่น',
      equipment: [
        { id: 'drip-stand', name: 'ดริปเปอร์', draggable: true },
        { id: 'paper-filter', name: 'กระดาษกรอง', draggable: true },
        { id: 'drip-pot', name: 'โถรองดริป', draggable: true },
        { id: 'kettle', name: 'กาดริป', draggable: true },
      ],
    },
    {
      id: 'brew',
      name: 'ดริปกาแฟ',
      description: 'ลากผงกาแฟบดและกาดริปไปยังพื้นที่ดำเนินการ แล้วหมุนเพื่อดริปกาแฟ',
      equipment: [
        { id: 'ground-coffee', name: 'ผงกาแฟบด', draggable: true },
        { id: 'kettle', name: 'กาดริป', draggable: true },
      ],
    },    
    {
      id: 'finish',
      name: 'เสร็จสิ้น',
      description: 'ยินดีด้วย! คุณได้ทำเมนูเอสเพรสโซสำเร็จแล้ว',
      equipment: [] // ไม่แสดงอุปกรณ์ในขั้นตอนนี้
    }    
  ];

  const workspaceRef = useRef(null);

  useEffect(() => {
    if (currentStep === 2) { // เริ่ม QTE ในขั้นตอนที่ 2
      const interval = setInterval(() => {
        setPointerPosition((prev) => {
          let newPosition = prev + direction * 1; // เพิ่มตำแหน่ง Pointer ตามทิศทาง
          if (newPosition <= 0) {
            setDirection(1); // เปลี่ยนทิศทางไปทางขวาเมื่อถึงขอบซ้าย
          } else if (newPosition >= 100) {
            setDirection(-1); // เปลี่ยนทิศทางไปทางซ้ายเมื่อถึงขอบขวา
          }
          return Math.max(0, Math.min(100, newPosition)); // จำกัดตำแหน่งให้อยู่ระหว่าง 0-100
        });
      }, 10); // อัปเดตตำแหน่งทุก 10ms
  
      return () => clearInterval(interval); // ล้าง Interval เมื่อออกจากขั้นตอน
    }
  }, [currentStep, direction]);  
   
  // ฟังก์ชันรีเซ็ตสถานะของ Simulator
  const resetSimulator = () => {
    setCurrentStep(0); // ตั้งค่าขั้นตอนเริ่มต้น
    setMessage('ยินดีต้อนรับเข้าสู่ตัวจำลองการทำกาแฟ!'); // ข้อความต้อนรับ
    setCompletedSteps([]); // ล้างรายการขั้นตอนที่เสร็จสิ้น
    setWorkspaceItems([]); // ล้างอุปกรณ์ในพื้นที่ดำเนินการ
    setIsGround(false); // รีเซ็ตสถานะการบด
    setIsGrinding(false); // รีเซ็ตสถานะการบดที่กำลังทำงาน
    setIsPouring(false); // รีเซ็ตสถานะการเทน้ำ
    setPointerPosition(0); // รีเซ็ตตำแหน่ง Pointer
    setDirection(1); // รีเซ็ตทิศทาง Pointer
    clearInterval(gameInterval); // หยุด QTE หากยังทำงานอยู่
    setGameInterval(null); // ล้างสถานะ QTE
  };

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
  
          // ตรวจสอบเงื่อนไขของการเพิ่มอุปกรณ์
          if (item.id === 'grinder' && !current.some((i) => i.id === 'grinder')) {
            updatedItems.push({ ...item, state: 'default' });
            setMessage('เครื่องบดถูกเพิ่มในพื้นที่ดำเนินการ');
            return updatedItems;
          }
  
          if (item.id === 'coffee-beans' && current.some((i) => i.id === 'grinder')) {
            updatedItems = current.map((i) =>
              i.id === 'grinder'
                ? { ...i, name: 'เครื่องบดที่มีเมล็ดกาแฟ', state: 'ready-to-grind' }
                : i
            );
            setMessage('เมล็ดกาแฟถูกเพิ่มในเครื่องบด');
            return updatedItems;
          }

            // แสดงข้อความแจ้งเตือนถ้าลากเมล็ดกาแฟมาก่อนเครื่องบด
          if (item.id === 'coffee-beans' && !current.some((i) => i.id === 'grinder')) {
            setMessage('กรุณาเพิ่มเครื่องบดก่อนเมล็ดกาแฟ!');
            return current;
          }
  
          setMessage('กรุณาเพิ่มอุปกรณ์ตามลำดับ! เริ่มจากเครื่องบดก่อน');
          return current;
        }
  
        // ตรวจสอบขั้นตอนที่ 2: เตรียมเครื่องดริป
        if (currentStep === 1) {
          // ห้ามเพิ่มอุปกรณ์ที่ซ้ำ
          if (current.some((i) => i.id === item.id)) {
            setMessage('อุปกรณ์นี้ถูกเพิ่มไปแล้ว!');
            return current;
          }
  
          if (item.id === 'drip-pot' && !current.some((i) => i.state === 'drip-pot')) {
            setMessage('โถรองดริปถูกเพิ่มในพื้นที่ดำเนินการ');
            return [...current, { ...item, state: 'drip-pot' }];
          }
  
          if (item.id === 'drip-stand' && current.some((i) => i.state === 'drip-pot')) {
            setMessage('ดริปเปอร์ถูกเพิ่มในโถรองดริป');
            return current.map((i) =>
              i.state === 'drip-pot'
                ? { ...i, name: 'โถรองดริปที่มีดริปเปอร์', state: 'drip-stand' }
                : i
            );
          }
  
          if (item.id === 'paper-filter' && current.some((i) => i.state === 'drip-stand')) {
            setMessage('กระดาษกรองถูกเพิ่มในดริปเปอร์');
            return current.map((i) =>
              i.state === 'drip-stand'
                ? { ...i, name: 'โถรองดริปที่มีดริปเปอร์และกระดาษกรอง', state: 'paper-filter' }
                : i
            );
          }
  
          if (item.id === 'kettle' && current.some((i) => i.state === 'paper-filter')) {
            setMessage('กำลังล้างกระดาษกรอง...');
            setIsPouring(true);
  
            setTimeout(() => {
              setIsPouring(false);
              const updatedItems = current.map((i) =>
                i.state === 'paper-filter'
                  ? { ...i, name: 'โถรองดริปพร้อมสำหรับเทน้ำ', state: 'ready-to-pour-out' }
                  : i
              );
              setWorkspaceItems(updatedItems);
              setMessage('ล้างกระดาษกรองเรียบร้อยแล้ว! คลิกเพื่อเทน้ำออก');
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
            setMessage('ผงกาแฟถูกเพิ่มในโถรองดริป!');
            return updatedItems;
          }
  
          if (item.id === 'kettle' && current.some((i) => i.state === 'waiting-for-kettle')) {
            const updatedItems = current.map((i) =>
              i.state === 'waiting-for-kettle'
                ? { ...i, name: 'โถรองดริปพร้อมดริปกาแฟ', state: 'ready-to-brew' }
                : i
            );
            setMessage('กาดริปถูกเพิ่มในโถรองดริป! พร้อมเริ่มดริปกาแฟ');

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
    if (
      currentStep === 1 && // ตรวจสอบว่าขั้นตอนคือการเตรียมเครื่องดริป
      workspaceItems.some((item) => item.state === 'ready-to-pour-out') // ตรวจสอบสถานะโถรองดริป
    ) {
      setMessage('กำลังเทน้ำออกจากโถรองดริป...');
  
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
    }, 3000); // ตั้งเวลา 3 วินาที
  };

  const handleQTEClick = () => {
    const targetLeft = 40; // ตำแหน่งซ้ายของ target zone
    const targetRight = 60; // ตำแหน่งขวาของ target zone
  
    if (pointerPosition >= targetLeft && pointerPosition <= targetRight) {
      setQteCount((prev) => prev + 1); // เพิ่มจำนวนการกดที่สำเร็จ
      setMessage(`ดริปสำเร็จ ${qteCount + 1}/3 ครั้ง`);
  
      // เช็คว่ากดครบ 3 ครั้งแล้วหรือยัง
      if (qteCount + 1 === 3) {
        setQteActive(false); // ปิด QTE
        setIsReadyToServe(true); // เปิดสถานะพร้อมเสิร์ฟ
        setQteCount(0); // รีเซ็ตจำนวนการกด
        setMessage('QTE เสร็จสิ้น! โปรดเทกาแฟใส่แก้ว');
        
        setWorkspaceItems((current) =>
          current.map((item) =>
            item.id === 'ground-coffee' || item.id === 'kettle'
              ? { ...item, state: 'ready-to-serve' }
              : item
          )
        );
        
        handleNextStep(); // ไปยังขั้นตอนถัดไป
      }
    } else {
      setMessage('ดริปผิดพลาด! โปรดลองใหม่');
    }
  };  
  
  const handleGrind = () => {
    if (workspaceItems.some((item) => item.state === 'ready-to-grind')) {
      setIsGrinding(true);
      setMessage('กำลังบดเมล็ดกาแฟ...');
  
      setTimeout(() => {
        setIsGrinding(false);
  
        setWorkspaceItems((current) =>
          current.map((item) =>
            item.state === 'ready-to-grind'
              ? { ...item, name: 'เครื่องบดพร้อมผงกาแฟ', state: 'ground' }
              : item
          )
        );
  
        setMessage('เมล็ดกาแฟถูกบดเรียบร้อยแล้ว!');
        handleNextStep();
      }, 3000);
    } else {
      setMessage('กรุณาเพิ่มเครื่องบดและเมล็ดกาแฟก่อนบด');
    }
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
        name: 'โถรองดริปที่มีดริปเปอร์และกระดาษกรอง',
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
  };
  
 
  return (
    <div className="relative w-full h-screen bg-neutral-100">
      {/* Header Section */}
      <div className="absolute top-4 left-4">
        {/* ปุ่มย้อนกลับ */}
        <button className="bg-gray-300 p-2 rounded" onClick={() => navigate(-1)}>ย้อนกลับ</button>
      </div>
      <div className="absolute top-4 right-4">
        {/* ปุ่มสำหรับรายการเมนูกาแฟ */}
        <button className="bg-gray-300 p-2 rounded">รายการเมนูกาแฟ (เลื่อนเปลี่ยนได้)</button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-12 gap-4 w-full h-full pt-16 px-4 sm:px-8">
        {/* Left Area - Equipment list */}
        <div className="col-span-12 sm:col-span-5 bg-gray-200 rounded shadow p-4">
          {/* หัวข้อของรายการอุปกรณ์ */}
          <h3 className="text-center">อุปกรณ์ที่ใช้ในเมนูนี้</h3>

          {/* รายการอุปกรณ์ */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* รวมอุปกรณ์จากทุกขั้นตอน */}
            {Array.from(new Set(steps.flatMap(step => step.equipment.map(equipment => equipment.id)))).map((id) => {
              // หาข้อมูลของอุปกรณ์จากขั้นตอน
              const equipment = steps
                .flatMap(step => step.equipment)
                .find(equipment => equipment.id === id);

              return (
                <motion.div
                  key={equipment.id} // กำหนด unique key สำหรับ React
                  className="border border-gray-400 rounded-lg p-4 bg-white shadow-sm cursor-grab"
                  drag // เปิดใช้งานการลากวางด้วย Framer Motion
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // จำกัดการลากให้อยู่ในพื้นที่
                  dragElastic={1} // ความยืดหยุ่นขณะลาก
                  onDragEnd={(event, info) => handleDragEnd(equipment, event, info)} // ฟังก์ชันเรียกใช้เมื่อการลากสิ้นสุด
                >
                  <span>{equipment.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Center Area - Action area */}
        <div ref={workspaceRef} className="col-span-12 sm:col-span-5 bg-gray-200 rounded shadow p-4 flex flex-col">
          {/* หัวข้อสำหรับพื้นที่ดำเนินการ */}
          <h3 className="text-center font-semibold text-lg">
            พื้นที่สำหรับนำอุปกรณ์ต่างๆ มาดำเนินการ
          </h3>
          {/* พื้นที่ทำงาน (Workspace) */}
          <div className="mt-4 border-dashed border-2 border-gray-400 h-full flex flex-col items-center justify-center">
            {currentStep === 3 ? (
              // แสดงขั้นตอนที่ 4: ภาพเมนูเอสเพรสโซและปุ่มเริ่มใหม่
              <div className="flex flex-col items-center">
                {/* แสดงภาพเมนูเอสเพรสโซ */}
                <img
                  src="path_to_espresso_image.jpg" // เปลี่ยนเป็น URL หรือ path ของรูปภาพ
                  alt="เมนูเอสเพรสโซ"
                  className="w-40 h-40 object-cover rounded shadow-lg"
                />
                {/* ปุ่มสำหรับเริ่มต้นใหม่ */}
                <button
                  onClick={handleRestart} // รีเซ็ตซิมมูเลเตอร์
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-700"
                >
                  เริ่มต้นใหม่
                </button>
              </div>
            ) : qteActive ? (
              // QTE แสดงเมื่อ qteActive เป็น true
              <div className="flex flex-col items-center">
                {/* QTE Components */}
                <div className="progress-container relative w-full max-w-lg">
                  <div className="progress-bar bg-gray-300 w-full h-4 relative overflow-hidden">
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
                  onClick={handleQTEClick}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  คลิกเพื่อดริป
                </button>
              </div>
            ) : isReadyToServe ? (
              // แสดงปุ่มให้กดเทกาแฟใส่แก้ว
              <div className="flex flex-col items-center">
                <button
                  onClick={handleServe} // เรียกใช้ฟังก์ชัน handleServe
                  className="bg-purple-500 text-white py-2 px-4 rounded shadow hover:bg-purple-700"
                >
                  กดเพื่อเทกาแฟลงแก้ว
                </button>
              </div>
            ) : (
              // แสดง Workspace Items สำหรับขั้นตอนอื่น ๆ
              workspaceItems.length > 0 &&
              workspaceItems.map((item) => (
                <motion.div
                  key={item.id}
                  className={`p-4 border border-gray-400 bg-white rounded shadow-sm mt-2 
                    ${item.state === "ready-to-grind" && !isGrinding ? "cursor-pointer" : ""}
                    ${item.id === "kettle" && isPouring ? "text-blue-500" : ""}
                    ${item.state === "ready-to-drip" ? "cursor-pointer bg-yellow-200" : ""}
                    ${item.state === "ready-to-pour-out" ? "cursor-pointer bg-green-200" : ""}
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
                >
                  <span>
                    {item.state === "ready-to-drip"
                      ? "คลิกเพื่อเริ่มดริป"
                      : item.state === "ready-to-pour-out"
                      ? "คลิกเพื่อเทน้ำออก"
                      : item.state === "ready-to-brew"
                      ? "ดริปกาแฟ"
                      : item.state === "ready-to-serve"
                      ? "คลิกเพื่อเทกาแฟลงแก้ว"
                      : item.name}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>


        {/* Right Area - Step List */}
        <div className="col-span-12 sm:col-span-2 bg-gray-200 rounded shadow p-4 flex flex-col justify-between">
          {/* หัวข้อรายการขั้นตอน */}
          <h3 className="text-center font-semibold text-lg">รายการขั้นตอนต่างๆ</h3>

          {/* รายการขั้นตอน */}
          <ul className="mt-4 list-none flex-grow">
            {steps.map((step, index) => (
              <li
                key={step.id} // กำหนด unique key สำหรับ React
                className={`flex items-center mt-2 ${
                  index === currentStep ? 'font-bold text-blue-600' : 'text-gray-800'
                }`} // ไฮไลต์ขั้นตอนปัจจุบัน
              >
                <input
                  type="checkbox" // ช่องทำเครื่องหมายสำหรับสถานะเสร็จสิ้น
                  readOnly
                  checked={completedSteps.includes(step.id)} // เช็คว่าขั้นตอนนี้อยู่ในรายการที่เสร็จสิ้นหรือไม่
                  className="mr-2 accent-blue-600" // สีของช่องทำเครื่องหมาย
                />
                {step.name} {/* ชื่อขั้นตอน */}
              </li>
            ))}
          </ul>

          {/* ปุ่มย้อนกลับขั้นตอน */}
          <div className="mt-4">
            <button
              className="bg-red-500 text-white w-full py-2 rounded shadow hover:bg-red-700 disabled:opacity-50"
              disabled={currentStep === 0} // ปิดการใช้งานปุ่มเมื่ออยู่ขั้นตอนแรก
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep((prev) => prev - 1); // ย้อนกลับขั้นตอน
                  setMessage(`กลับไปยังขั้นตอน: ${steps[currentStep - 1]?.name}`);
                  setWorkspaceItems([]); // ล้าง workspace สำหรับขั้นตอนก่อนหน้า
                }
              }}
            >
              ย้อนกลับขั้นตอน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSimulator;
