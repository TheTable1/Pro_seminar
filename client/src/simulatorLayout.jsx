import { useState } from 'react';
import Navbar from "./navbar";
import Sidebar from './sidebar';
import RightPanel from './rightpanel';
import MainSimulator from './mainsimulator';
import './assets/css/simulator.css';

const SimulatorLayout = ({ menuSteps }) => {
  // ตรวจสอบว่าได้ menuSteps มาหรือไม่ และกำหนดค่าเริ่มต้น
  const steps = menuSteps?.map(step => step.title) || ["Default Step 1", "Default Step 2", "Complete"];
  const descriptions = menuSteps?.map(step => step.description) || [
    "Default description 1",
    "Default description 2",
    "Enjoy your coffee!"
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Simulator complete!");
    }
  };

  const resetSimulator = () => {
    setCurrentStep(0);
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar steps={steps} currentStep={currentStep} onReset={resetSimulator} />
        <MainSimulator step={currentStep} onStepComplete={handleStepComplete} />
        <RightPanel description={descriptions[currentStep]} />
      </div>
    </div>
  );
};

export default SimulatorLayout;
