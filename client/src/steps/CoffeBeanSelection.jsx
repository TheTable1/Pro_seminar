import { useState } from "react";
import PropTypes from "prop-types";

const CoffeeBeanSelection = ({ onStepComplete }) => {
  const coffeeBeans = [
    { id: 1, name: "Arabica", description: "Smooth and flavorful" },
    { id: 2, name: "Robusta", description: "Strong and bold" },
    { id: 3, name: "Liberica", description: "Unique and fruity" },
    { id: 4, name: "Excelsa", description: "Complex and tart" },
  ];

  const [selectedBean, setSelectedBean] = useState(null);

  const handleSelectBean = (bean) => {
    setSelectedBean(bean);
  };

  const handleNextStep = () => {
    if (selectedBean) {
      onStepComplete(selectedBean); // ส่งเมล็ดกาแฟที่เลือกไปยังขั้นตอนถัดไป
    } else {
      alert("กรุณาเลือกเมล็ดกาแฟก่อน!");
    }
  };

  return (
    <div>
      <h2>เลือกเมล็ดกาแฟ</h2>
      <div className="bean-grid" style={{ display: "flex", gap: "10px" }}>
        {coffeeBeans.map((bean) => (
          <div
            key={bean.id}
            onClick={() => handleSelectBean(bean)}
            style={{
              border: selectedBean?.id === bean.id ? "2px solid green" : "1px solid gray",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <h3>{bean.name}</h3>
            <p>{bean.description}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleNextStep}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "brown",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Next
      </button>
    </div>
  );
};

// เพิ่ม PropTypes สำหรับตรวจสอบชนิดของ props
CoffeeBeanSelection.propTypes = {
  onStepComplete: PropTypes.func.isRequired, // onStepComplete ต้องเป็นฟังก์ชันและจำเป็นต้องส่งค่าเข้ามา
};

export default CoffeeBeanSelection;


  