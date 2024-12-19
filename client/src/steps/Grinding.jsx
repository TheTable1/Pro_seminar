import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PropTypes from "prop-types";

// คอมโพเนนต์สำหรับเมล็ดกาแฟที่สามารถลากได้
const CoffeeBean = ({ bean }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "bean",
    item: { bean },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        margin: "20px",
        padding: "10px",
        height: "200px",
        width: "200px",
        border: "1px solid #333",
        borderRadius: "5px",
        backgroundColor: "lightgoldenrodyellow",
        cursor: "grab",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {bean.name}
    </div>
  );
};

CoffeeBean.propTypes = {
  bean: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

// คอมโพเนนต์สำหรับตัวเลือกเครื่องบดกาแฟ
const GrindingMachineOption = ({ type, onSelect }) => {
  // เลือกไฟล์รูปภาพตามประเภทเครื่องบด
  const imageSrc =
    type === "electric"
      ? "/animation/เครื่องบดไฟฟ้า.png"
      : "/animation/เครื่องบดมือ.png";

  return (
    <div
      onClick={() => onSelect(type)}
      style={{
        margin: "20px",
        height: "220px",
        width: "220px",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img
        src={imageSrc} // ใช้รูปภาพเครื่องบด
        alt={type === "electric" ? "เครื่องบดไฟฟ้า" : "เครื่องบดมือ"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // ปรับให้ภาพไม่ผิดสัดส่วน
        }}
      />
    </div>
  );
};

GrindingMachineOption.propTypes = {
  type: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// คอมโพเนนต์สำหรับเครื่องบดกาแฟ
const GrindingMachine = ({ type, onDrop }) => {
  const [isGrinding, setIsGrinding] = useState(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "bean",
    drop: (item) => {
      setIsGrinding(true); // เริ่มแสดง GIF
      onDrop(item.bean);   // แจ้งสถานะไปยัง parent
      setTimeout(() => setIsGrinding(false), 5000); // รีเซ็ตภาพนิ่งหลัง 5 วินาที
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // ไฟล์ภาพที่ใช้
  const staticImage =
    type === "electric"
      ? "/animation/เครื่องบดไฟฟ้า.png"
      : "/animation/เครื่องบดมือ.png";

  const animatedGif =
    type === "electric"
      ? "/animation/เครื่องบดไฟฟ้า.gif"
      : "/animation/เครื่องบดมือ.gif";

  return (
    <div
      ref={drop}
      style={{
        width: "200px",
        height: "200px",
        backgroundColor: isOver ? "lightgreen" : "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px",
        cursor: "pointer",
        overflow: "hidden", // ป้องกันไม่ให้รูปภาพเกินขอบฅ
        
      }}
    >
      <img
        src={isGrinding ? animatedGif : staticImage} // เปลี่ยนภาพตามสถานะ
        alt={type === "electric" ? "เครื่องบดไฟฟ้า" : "เครื่องบดมือ"}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

GrindingMachine.propTypes = {
  type: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
};

// คอมโพเนนต์หลักสำหรับการบดกาแฟ
const Grinding = ({ onStepComplete, onStepBack }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [bean] = useState({ id: 1, name: "Arabica" });
  const [grindingStatus, setGrindingStatus] = useState("");

  const handleDrop = (bean) => {
    setGrindingStatus(`กำลังบดเมล็ดกาแฟ ${bean.name}...`);
    setTimeout(() => {
      setGrindingStatus(`เมล็ดกาแฟ ${bean.name} บดเสร็จแล้ว!`);
      setTimeout(() => {
        setGrindingStatus("");
        onStepComplete(); // ไปขั้นถัดไปหลัง 5 วินาที
      }, 5000); // หน่วงเวลา 5 วินาที
    }, 3000); // จำลองการบด 3 วินาที
  };  

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>เลือกอุปกรณ์และบดกาแฟ</h2>
        {!selectedMachine ? (
          <div>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" , marginTop: "140px"}}>
              <GrindingMachineOption
                type="electric"
                onSelect={setSelectedMachine}
              />
              <GrindingMachineOption
                type="manual"
                onSelect={setSelectedMachine}
              />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-around" , marginTop: "140px"}}>
              <CoffeeBean bean={bean} />
              <GrindingMachine
                type={selectedMachine}
                onDrop={handleDrop}
              />
            </div>
          </div>
        )}
        {grindingStatus && <p>{grindingStatus}</p>}
        <button onClick={onStepBack}>ย้อนกลับ</button>
      </div>
    </DndProvider>
  );
};

Grinding.propTypes = {
  onStepComplete: PropTypes.func.isRequired,
  onStepBack: PropTypes.func.isRequired,
};

export default Grinding;




  