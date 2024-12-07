import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PropTypes from "prop-types";

const GroundCoffee = ({ groundCoffee }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "groundCoffee",
    item: { groundCoffee },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "10px",
        margin: "10px",
        border: "1px solid #333",
        borderRadius: "5px",
        backgroundColor: "wheat",
        cursor: "grab",
      }}
    >
      {groundCoffee}
    </div>
  );
};

// เพิ่ม PropTypes validation ให้กับ GroundCoffee
GroundCoffee.propTypes = {
  groundCoffee: PropTypes.string.isRequired,
};

const ExtractionMachine = ({ type, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "groundCoffee",
    drop: (item) => onDrop(item.groundCoffee),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        width: "200px",
        height: "200px",
        border: "2px dashed gray",
        borderRadius: "10px",
        backgroundColor: isOver ? "lightgreen" : "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px",
      }}
    >
      {type === "espresso" ? "เครื่องเอสเพรสโซ" : "เครื่องดริป"}
    </div>
  );
};

// เพิ่ม PropTypes validation ให้กับ ExtractionMachine
ExtractionMachine.propTypes = {
  type: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
};

const Extraction = ({ onStepComplete, onStepBack, groundCoffee }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [extractionResult, setExtractionResult] = useState(null);

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
  };

  const handleDrop = (groundCoffee) => {
    setExtractionResult(`กำลังสกัดกาแฟจาก: ${groundCoffee}`);
    setTimeout(() => {
      setExtractionResult(`กาแฟที่สกัดจาก ${groundCoffee} ด้วย ${selectedDevice} พร้อมแล้ว!`);
      onStepComplete(); // ไปยังขั้นตอนถัดไป
    }, 3000); // รอ 3 วินาที
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>สกัดกาแฟ</h2>
        {!selectedDevice ? (
          <div>
            <h3>เลือกอุปกรณ์สำหรับการสกัดกาแฟ:</h3>
            <button onClick={() => handleDeviceSelect("espresso")}>
              เครื่องเอสเพรสโซ
            </button>
            <button onClick={() => handleDeviceSelect("drip")}>
              เครื่องดริป
            </button>
          </div>
        ) : (
          <div>
            <h3>ลากกาแฟบดไปยังเครื่องสกัดกาแฟ</h3>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <GroundCoffee groundCoffee={groundCoffee} />
              <ExtractionMachine type={selectedDevice} onDrop={handleDrop} />
            </div>
            {extractionResult && <p>{extractionResult}</p>}
          </div>
        )}
        <div>
          <button onClick={onStepBack} style={{ marginRight: "10px" }}>
            ย้อนกลับ
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

// เพิ่ม PropTypes validation ให้กับ Extraction
Extraction.propTypes = {
  onStepComplete: PropTypes.func.isRequired, // ฟังก์ชันเมื่อขั้นตอนสำเร็จ
  onStepBack: PropTypes.func.isRequired, // ฟังก์ชันเมื่อย้อนกลับ
  groundCoffee: PropTypes.string.isRequired, // กาแฟบดจากขั้นตอนก่อนหน้า
};

export default Extraction;



  