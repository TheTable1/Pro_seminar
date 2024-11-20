import { useState } from 'react';
import Navbar from "./navbar";
import Sidebar from './sidebar';
import RightPanel from './rightpanel';
import CoffeeBeanSelection from './steps/CoffeBeanSelection';
import Grinding from './steps/Grinding';
import Extraction from './steps/Extraction';
import AddIngredients from './steps/AddIngredients';
import MenuItems from './menuItems.json'; // ใช้ตัวแปรนี้โดยตรง
import './assets/css/simulator.css';

// กำหนด mapping ของชื่อขั้นตอนกับคอมโพเนนต์
const stepComponents = {
  "เลือกเมล็ดกาแฟ": CoffeeBeanSelection,
  "บดกาแฟ": Grinding,
  "สกัดกาแฟ": Extraction,
  "เติมส่วนผสมอื่น": AddIngredients,
};

const SimulatorLayout = () => { // ลบ props ออก
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // ตรวจสอบว่ามีข้อมูลขั้นตอนหรือไม่
  const steps = MenuItems.steps || []; // ใช้ MenuItems จากการ import
  const descriptions = MenuItems.descriptions || [];
  
  // ดึงขั้นตอนปัจจุบันจาก index
  const currentStepKey = steps[currentStepIndex] || "";
  const CurrentStepComponent = stepComponents[currentStepKey] || null;

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  console.log(MenuItems);

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
              coffeeData={MenuItems}
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
