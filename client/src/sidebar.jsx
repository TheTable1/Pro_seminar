import React from 'react';
import PropTypes from 'prop-types'; // นำเข้า PropTypes
import { FaCoffee, FaBlender, FaMugHot } from 'react-icons/fa';

const Sidebar = ({ steps, currentStep }) => {
  return (
    <div className="sidebar">
      <h3>ขั้นตอนการทำกาแฟ</h3>
      <ul>
        {steps.map((step, index) => (
          <li 
            key={index} 
            style={{ background: currentStep === index ? '#ebebeb' : '' }}
          >
            {step === 'เลือกเมล็ดกาแฟ' && <FaCoffee />} {/* Icon */}
            {step === 'บดกาแฟ' && <FaBlender />}
            {step === 'สกัดกาแฟ' && <FaMugHot />}
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
};

// กำหนด PropTypes
Sidebar.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired, // ตรวจสอบว่า steps เป็น Array ของ String
  currentStep: PropTypes.number.isRequired, // ตรวจสอบว่า currentStep เป็น Number
};

export default Sidebar;

