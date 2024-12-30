import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import React from 'react';


const CoffeeSimulator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('ยินดีต้อนรับเข้าสู่ตัวจำลองการทำกาแฟ!');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [isGround,setIsGround] = useState(false);
  const [isGrinding, setIsGrinding] = useState(false);
  const [isPouring, setIsPouring] = useState(false);

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
      id: 'serve',
      name: 'เสิร์ฟกาแฟ',
      description: 'รินกาแฟจากโถรองลงแก้ว พร้อมเสิร์ฟ',
      equipment: [
        { id: 'coffee-pot', name: 'โถรอง', draggable: true },
        { id: 'cup', name: 'แก้ว', draggable: true },
      ],
    },
  ];

  const workspaceRef = useRef(null);

  // Reset state when the component mounts
  useEffect(() => {
    setCurrentStep(0);
    setMessage('ยินดีต้อนรับเข้าสู่ตัวจำลองการทำกาแฟ!');
    setCompletedSteps([]);
    setWorkspaceItems([]);
    setIsGround(false);
    setIsGrinding(false);
    setIsPouring(false);
  }, []);

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
        if (!current.some((i) => i.id === item.id)) {
          if (currentStep === 0) {
            // Handle grinding step
            if (item.id === 'coffee-beans' && !current.some((i) => i.id === 'grinder')) {
              setMessage('กรุณาลากเครื่องบดมาก่อนเมล็ดกาแฟ!');
              return current;
            }
            if (item.id === 'coffee-beans' && current.some((i) => i.id === 'grinder')) {
              return current.map((i) =>
                i.id === 'grinder'
                  ? { ...i, name: 'เครื่องบดที่มีเมล็ดกาแฟ', state: 'ready-to-grind' }
                  : i
              );
            }
          } else if (currentStep === 1) {
            // Handle preparation sequence for drip
            if (item.id === 'drip-pot' && current.length === 0) {
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
                setMessage('ล้างกระดาษกรองเรียบร้อยแล้ว! คลิกที่โถรองดริปเพื่อเทน้ำออก');
              }, 3000);
              return current;
            }
          }
          return [...current, { ...item, state: 'default' }];
        }
        return current;
      });
  
      setMessage(`เพิ่ม ${item.name} ในพื้นที่ดำเนินการ`);
    } else {
      setMessage('โปรดลากอุปกรณ์ไปยังพื้นที่ดำเนินการ');
    }
  };
  
  const handlePourOut = () => {
    if (workspaceItems.some((item) => item.state === 'paper-filter')) {
      setMessage('กำลังเทน้ำออกจากโถรองดริป...');
      setTimeout(() => {
        setWorkspaceItems([]);
        handleNextStep();
      }, 3000);
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
            item.id === 'grinder'
              ? { ...item, name: 'เครื่องบดพร้อมผงกาแฟ', state: 'ground' }
              : item
          )
        );
  
        setMessage('เมล็ดกาแฟถูกบดเรียบร้อยแล้ว!');
        handleNextStep();
      }, 3000);
    }
  };

  const handleNextStep = () => {
    setCompletedSteps((prev) => [...prev, steps[currentStep].id]);
    setWorkspaceItems([]);
    setIsGround(false);
    setCurrentStep((prev) => prev + 1);
    setMessage('ยินดีด้วย! ไปขั้นตอนถัดไป');
  };  

  return (
    <div className="relative w-full h-screen bg-neutral-100">
      {/* Header Section */}
      <div className="absolute top-4 left-4">
        <button className="bg-gray-300 p-2 rounded">ย้อนกลับ</button>
      </div>
      <div className="absolute top-4 right-4">
        <button className="bg-gray-300 p-2 rounded">รายการเมนูกาแฟ (เลื่อนเปลี่ยนได้)</button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-12 gap-4 w-full h-full pt-16 px-4 sm:px-8">
        {/* Left Area - Equipment list */}
        <div className="col-span-12 sm:col-span-5 bg-gray-200 rounded shadow p-4">
          <h3 className="text-center">อุปกรณ์ที่ใช้ในขั้นตอนนี้</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {steps[currentStep]?.equipment.map((item) => (
              <motion.div
                key={item.id}
                className="border border-gray-400 rounded-lg p-4 bg-white shadow-sm cursor-grab"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragEnd={(event, info) => handleDragEnd(item, event, info)}
              >
                <span>{item.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center Area - Action area */}
      <div
        ref={workspaceRef}
        className="col-span-12 sm:col-span-5 bg-gray-200 rounded shadow p-4"
      >
        <h3 className="text-center">พื้นที่สำหรับนำอุปกรณ์ต่างๆ มาดำเนินการ</h3>
        <div className="mt-4 border-dashed border-2 border-gray-400 h-full flex flex-col items-center justify-center">
          {workspaceItems.map((item) => (
            <React.Fragment key={item.id}>
              <motion.div
                className={`p-4 border border-gray-400 bg-white rounded shadow-sm mt-2 ${
                  item.state === 'ready-to-grind' && !isGrinding ? 'cursor-pointer' : ''
                }`}
                onClick={
                  item.state === 'ready-to-grind' && !isGrinding ? handleGrind : undefined
                }
                whileHover={{ scale: item.state === 'ready-to-grind' && !isGrinding ? 1.1 : 1 }}
              >
                <span>{item.name}</span>
              </motion.div>

              {item.state === 'paper-filter' && (
                <motion.div
                  className={`p-4 border border-gray-400 bg-white rounded shadow-sm mt-2 ${
                    !isPouring ? 'cursor-pointer' : ''
                  }`}
                  onClick={!isPouring ? handlePourOut : undefined}
                >
                  <span>{item.name}</span>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>



        {/* Right Area - Step List */}
        <div className="col-span-12 sm:col-span-2 bg-gray-200 rounded shadow p-4">
          <h3 className="text-center">รายการขั้นตอนต่างๆ</h3>
          <ul className="mt-4 list-none">
            {steps.map((step, index) => (
              <li
                key={step.id}
                className={`flex items-center ${index === currentStep ? 'font-bold' : ''}`}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={completedSteps.includes(step.id)}
                  className="mr-2"
                />
                {step.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Section - Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-200 p-4 rounded shadow w-11/12 sm:w-3/4 text-center">
        <p>{steps[currentStep]?.description || message}</p>
      </div>
    </div>
  );
};

export default CoffeeSimulator;
