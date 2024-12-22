import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "./navbar";
import Sidebar from './sidebar';
import RightPanel from './rightpanel';

import CoffeeBeanSelection from './steps/CoffeBeanSelection';
import Grinding from './steps/Grinding';
import Extraction from './steps/extraction';
import FinalStep from './steps/Finalstep';

import MenuItems from './menuItems.json';
import './assets/css/simulator.css';

const stepComponents = {
  "เลือกเมล็ดกาแฟ": CoffeeBeanSelection,
  "บดกาแฟ": Grinding,
  "สกัดกาแฟ": Extraction,
  "เสร็จสิ้น": FinalStep,
};

const SimulatorLayout = () => {
  const location = useLocation();
  const selectedItem = location.state;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedBean, setSelectedBean] = useState(null);

  const steps = selectedItem?.steps || [];
  const descriptions = selectedItem?.descriptions || [];

  const currentStepKey = steps[currentStepIndex] || "";
  const CurrentStepComponent = stepComponents[currentStepKey] || null;

  const handleNextStep = (data) => {
    if (currentStepIndex < steps.length - 1) {
      if (currentStepKey === "เลือกเมล็ดกาแฟ") {
        setSelectedBean(data);
      }
      document.querySelector('.main-simulator').classList.add('animate');
      setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 300);
    }
  };

  // ฟังก์ชันสำหรับย้อนกลับขั้นตอน
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
        <Sidebar 
          steps={steps} 
          currentStep={currentStepIndex} 
          handleBack={handlePreviousStep} // ส่ง handlePreviousStep แทน
        />
        
        <div className="main-simulator">
          {CurrentStepComponent ? (
            <CurrentStepComponent
              onStepComplete={handleNextStep}
              coffeeData={selectedItem}
              selectedBean={selectedBean}
            />
          ) : (
            <div className="error-message">
              <p>ไม่พบขั้นตอนในข้อมูล</p>
            </div>
          )}
        </div>  
        <RightPanel description={descriptions[currentStepIndex] || "ไม่มีคำอธิบายสำหรับขั้นตอนนี้"} />
      </div>
    </div>
  );
};

export default SimulatorLayout;