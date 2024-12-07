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
      <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>เลือกเมล็ดกาแฟ</h2>
      <div
        className="bean-selector"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowX: "auto",
          paddingBottom: "20px",
          marginTop: "140px",  // เพิ่ม marginTop เพื่อให้มีพื้นที่ระหว่างขอบบนของการ์ด
          paddingTop: "20px", // เพิ่ม paddingTop เพื่อให้ตัวเลือกมีพื้นที่ห่างจากขอบ
        }}
      >
        {coffeeBeans.map((bean) => (
          <div
            className="beans"
            key={bean.id}
            onClick={() => handleSelectBean(bean)}
            style={{
              border: selectedBean?.id === bean.id ? "2px solid brown" : "1px solid gray",
              padding: "20px",
              paddingTop: "30px",
              margin: "0 20px",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
              textAlign: "center",
              flexShrink: 0, // ป้องกันไม่ให้หดตัว
              boxShadow: selectedBean?.id === bean.id
                ? "0 4px 10px rgba(207, 168, 127, 0.6)"  // สีกาแฟอ่อนๆ (ใช้ rgba สำหรับความโปร่งใส)
                : "0 4px 6px rgba(207, 168, 127, 0.2)", // สีกาแฟอ่อนๆ แบบโปร่งใส
              transform: selectedBean?.id === bean.id ? "scale(1.05)" : "scale(1)",
              width: "180px",
              height:"200px",
              backgroundColor: "#fff", // พื้นหลังของการ์ด
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
          padding: "10px 20px",
          backgroundColor: "brown",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "darkbrown")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "brown")}
      >
        ไปยังขั้นตอนถัดไป
      </button>
    </div>
  );
};
//เพิ่ม PropTypes สำหรับตรวจสอบชนิดของ props
CoffeeBeanSelection.propTypes = {
  onStepComplete: PropTypes.func.isRequired, // onStepComplete ต้องเป็นฟังก์ชันและจำเป็นต้องส่งค่าเข้ามา
};

export default CoffeeBeanSelection;




  