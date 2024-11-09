import React, { useState } from 'react';
import Navbar from "./navbar";
import Sidebar from './sidebar';
import RightPanel from './rightpanel';
import MainSimulator from './mainsimulator';
import './assets/css/simulator.css';

const SimulatorLayout = () => {
  const steps = ["Select Coffee Beans", "Select Grinder", "Grind Coffee", "Select Extraction Method", "Complete"];
  const descriptions = [
    "Choose the type of coffee beans you want to use.",
    "Select a grinder to grind your coffee beans.",
    "Press the button to start grinding the coffee.",
    "Select the method for extracting the coffee.",
    "Enjoy your coffee!"
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div>
        <Navbar />
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar steps={steps} currentStep={currentStep} />
            <MainSimulator step={currentStep} onStepComplete={handleStepComplete} />
            <RightPanel description={descriptions[currentStep]} />
        </div>
    </div>
  );
};

export default SimulatorLayout;