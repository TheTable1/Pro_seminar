import React, { useState } from 'react';
import './assets/css/simulator.css';

const MainSimulator = ({ step, onStepComplete }) => {
  const [selectedBean, setSelectedBean] = useState(null);
  const [selectedGrinder, setSelectedGrinder] = useState(null);

  const handleBeanSelection = (bean) => {
    setSelectedBean(bean);
    onStepComplete();
  };

  const handleGrinderSelection = (grinder) => {
    setSelectedGrinder(grinder);
    onStepComplete();
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <div><h2>Select Coffee Beans</h2></div>
            <div className="simulator-content">
              <button onClick={() => handleBeanSelection('Arabica')}>Arabica</button>
              <button onClick={() => handleBeanSelection('Robusta')}>Robusta</button>
              {selectedBean && <p>You selected {selectedBean} beans.</p>}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div><h2>Select Grinder</h2></div>
            <div className="simulator-content">
              <button onClick={() => handleGrinderSelection('Manual Grinder')}>Manual Grinder</button>
              <button onClick={() => handleGrinderSelection('Electric Grinder')}>Electric Grinder</button>
              {selectedGrinder && <p>You selected a {selectedGrinder}.</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="simulator-content">
            <h2>Grind Coffee</h2>
            <button className="interact-btn" onClick={onStepComplete}>Start Grinding</button>
          </div>
        );
      case 3:
        return (
          <div>
            <div>
                <h2>Select Extraction Method</h2>
              </div>
            <div className="simulator-content">
              <button onClick={() => onStepComplete()}>Drip</button>
              <button onClick={() => onStepComplete()}>Espresso</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="simulator-content">
            <h2>Complete!</h2>
            <p>Your coffee is ready to use for your chosen drink.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
      {renderStepContent()}
    </div>
  );
};

export default MainSimulator;
