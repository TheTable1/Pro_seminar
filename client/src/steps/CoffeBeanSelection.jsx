import PropTypes from 'prop-types';

const CoffeeBeanSelection = ({ onStepComplete }) => {
    return (
        <div>
            <h2>เลือกเมล็ดกาแฟ</h2>
            <button onClick={onStepComplete}>Next</button>
        </div>
    );
};

// เพิ่ม PropTypes สำหรับตรวจสอบชนิดของ props
CoffeeBeanSelection.propTypes = {
    onStepComplete: PropTypes.func.isRequired, // onStepComplete ต้องเป็นฟังก์ชันและจำเป็นต้องส่งค่าเข้ามา
};

export default CoffeeBeanSelection;

  