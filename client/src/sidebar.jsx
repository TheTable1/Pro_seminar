// import React from 'react';
// import PropTypes from 'prop-types'; // นำเข้า PropTypes
// import { FaCoffee, FaBlender, FaMugHot } from 'react-icons/fa';

<<<<<<< HEAD
const Sidebar = ({ steps, currentStep, handleBack }) => {
  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h3>ขั้นตอนการทำกาแฟ</h3>
      <ul style={{ flex: 1 }}>
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

      {/* ปุ่ม 'กลับ' อยู่ล่างสุด */}
      <div style={{ marginTop: 'auto', padding: '10px' }}>
        <button 
          onClick={handleBack}
          style={{
            width: '100%', // กำหนดความกว้างให้เต็ม
            padding: '10px',
            backgroundColor: '#f3e0b8',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          กลับ
        </button>
      </div>
    </div>
  );
};
=======
// const Sidebar = ({ steps, currentStep }) => {
//   return (
//     <div className="sidebar">
//       <h3>ขั้นตอนการทำกาแฟ</h3>
//       <ul>
//         {steps.map((step, index) => (
//           <li 
//             key={index} 
//             style={{ background: currentStep === index ? '#ebebeb' : '' }}
//           >
//             {step === 'เลือกเมล็ดกาแฟ' && <FaCoffee />} {/* Icon */}
//             {step === 'บดกาแฟ' && <FaBlender />}
//             {step === 'สกัดกาแฟ' && <FaMugHot />}
//             {step}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
>>>>>>> c0f0eabb3d15c16d423eaf5948510823ea1a5222

// // กำหนด PropTypes
// Sidebar.propTypes = {
//   steps: PropTypes.arrayOf(PropTypes.string).isRequired, // ตรวจสอบว่า steps เป็น Array ของ String
//   currentStep: PropTypes.number.isRequired, // ตรวจสอบว่า currentStep เป็น Number
// };

// export default Sidebar;

