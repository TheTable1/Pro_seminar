import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PropTypes from "prop-types";

// คอมโพเนนต์สำหรับกาแฟบด
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
        margin: "20px",
        padding: "10px",
        height: "200px",
        width: "200px",
        border: "1px solid #333",
        borderRadius: "5px",
        backgroundColor: "wheat",
        cursor: "grab",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {groundCoffee || "กรุณาเลือกกาแฟบด"} {/* แสดงข้อความในกรณีไม่มีค่า */}
    </div>
  );
};

GroundCoffee.propTypes = {
  groundCoffee: PropTypes.string.isRequired,
};

GroundCoffee.defaultProps = {
  groundCoffee: "กาแฟบดธรรมดา", // ค่าพื้นฐาน
};

// คอมโพเนนต์สำหรับตัวเลือกเครื่องสกัดกาแฟ
const ExtractionMachineOption = ({ machine, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(machine)}
      style={{
        margin: "20px",
        padding: "10px",
        height: "200px",
        width: "200px",
        border: "1px solid #333",
        borderRadius: "5px",
        backgroundColor: "lightgoldenrodyellow",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {machine.name}
    </div>
  );
};

ExtractionMachineOption.propTypes = {
  machine: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

// คอมโพเนนต์สำหรับเครื่องสกัดกาแฟ
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
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {type}
    </div>
  );
};

ExtractionMachine.propTypes = {
  type: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
};

// คอมโพเนนต์หลักสำหรับการสกัดกาแฟ
const Extraction = ({ onStepComplete, onStepBack, groundCoffee }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machines] = useState([
    { id: 1, name: "เครื่องเอสเพรสโซ" },
    { id: 2, name: "เครื่องดริป" },
  ]);
  const [extractionResult, setExtractionResult] = useState(null);

  const handleMachineSelect = (machine) => {
    setSelectedMachine(machine);
  };

  const handleCoffeeDrop = (groundCoffee) => {
    setExtractionResult(`กำลังสกัดกาแฟจาก: ${groundCoffee}`);
    setTimeout(() => {
      setExtractionResult(
        `กาแฟที่สกัดจาก ${groundCoffee} ด้วย ${selectedMachine.name} พร้อมแล้ว!`
      );
      onStepComplete();
    }, 3000);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>สกัดกาแฟ</h2>
        {!selectedMachine ? (
          <div>
            <h3>เลือกเครื่องสกัดกาแฟ:</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
              {machines.map((machine) => (
                <ExtractionMachineOption
                  key={machine.id}
                  machine={machine}
                  onSelect={handleMachineSelect}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3>ลากกาแฟบดไปยังเครื่องสกัดกาแฟ</h3>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <GroundCoffee groundCoffee={groundCoffee} />
              <ExtractionMachine
                type={selectedMachine.name}
                onDrop={handleCoffeeDrop}
              />
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

Extraction.propTypes = {
  onStepComplete: PropTypes.func.isRequired,
  onStepBack: PropTypes.func.isRequired,
  groundCoffee: PropTypes.string.isRequired,
};

export default Extraction;









  