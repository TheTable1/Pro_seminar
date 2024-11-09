import React from 'react';
import './assets/css/simulator.css';

const Sidebar = ({ steps, currentStep }) => {
  return (
    <aside class="sidebar" style={{ width: '200px', padding: '1rem' }}>
      <h3>Progress</h3>
      <ul>
        {steps.map((step, index) => (
          <li
            key={index}
            className={index === currentStep ? 'step-active' : ''}
          >
            {step}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;