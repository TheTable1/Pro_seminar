import PropTypes from 'prop-types'; // นำเข้า PropTypes
import { FaCoffee, FaBlender, FaMugHot } from 'react-icons/fa';

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
// เพิ่ม handleBack ใน PropTypes
Sidebar.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStep: PropTypes.number.isRequired,
  handleBack: PropTypes.func.isRequired // เพิ่มบรรทัดนี้
};

export default Sidebar;
