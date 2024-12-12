import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "./navbar";
import Sidebar from './sidebar';
import RightPanel from './rightpanel';

import CoffeeBeanSelection from './steps/CoffeBeanSelection';
import Grinding from './steps/Grinding';
import Extraction from './steps/extraction';
import FinalStep from './steps/Finalstep';

import MenuItems from './menuItems.json'; // ใช้ตัวแปรนี้โดยตรง
import './assets/css/simulator.css';

// กำหนด mapping ของชื่อขั้นตอนกับคอมโพเนนต์
const stepComponents = {
  "เลือกเมล็ดกาแฟ": CoffeeBeanSelection,
  "บดกาแฟ": Grinding,
  "สกัดกาแฟ": Extraction,
  "เสร็จสิ้น": FinalStep,
};

const SimulatorLayout = () => {
  const location = useLocation(); // ใช้ useLocation เพื่อดึงข้อมูลจาก state
  const selectedItem = location.state; // ตัวแปรที่เก็บข้อมูลจาก state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = selectedItem?.steps || []; // ใช้ steps จาก selectedItem
  const descriptions = selectedItem?.descriptions || []; // ใช้ descriptions จาก selectedItem

  const currentStepKey = steps[currentStepIndex] || "";
  const CurrentStepComponent = stepComponents[currentStepKey] || null;

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      document.querySelector('.main-simulator').classList.add('animate');
      setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 300); // Delay เพื่อให้ Animation ทำงาน
    }
  };
  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  console.log(MenuItems);

  // const handleBack = () => {
  //   navigate(-1); // ใช้ navigate(-1) เพื่อย้อนกลับไปยังหน้าเดิม
  // };
  
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* แถบ Sidebar แสดงขั้นตอนทั้งหมด */}
        <Sidebar steps={steps} currentStep={currentStepIndex} />
        
        {/* พื้นที่หลักสำหรับแสดงซิมมูเลเตอร์ */}
        <div className="main-simulator">
          {CurrentStepComponent ? (
            <CurrentStepComponent
              onStepComplete={handleNextStep}
              onStepBack={handlePreviousStep}
              coffeeData={selectedItem} // ส่งข้อมูลทั้งหมดของ selectedItem
            />
          ) : (
            <div className="error-message">
              <p>ไม่พบขั้นตอนในข้อมูล</p>
            </div>
          )}
        </div>  
        {/* แสดงคำอธิบายของแต่ละขั้นตอน */}
        <RightPanel description={descriptions[currentStepIndex] || "ไม่มีคำอธิบายสำหรับขั้นตอนนี้"} />
      </div>
    </div>
  );
};

export default SimulatorLayout;