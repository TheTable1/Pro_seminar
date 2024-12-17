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
  return (
    <div
      onClick={() => onSelect(type)}
      style={{
        margin: "20px",
        padding: "10px",
        height: "200px",
        width: "200px",
        marginTop: "140px",
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
      {type === "electric" ? "เครื่องบดไฟฟ้า" : "เครื่องบดมือ"}
    </div>
  );
};

GrindingMachineOption.propTypes = {
  type: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// คอมโพเนนต์สำหรับเครื่องบดกาแฟ
const GrindingMachine = ({ type, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "bean",
    drop: (item) => onDrop(item.bean),
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
      {type === "electric" ? "เครื่องบดไฟฟ้า" : "เครื่องบดมือ"}
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
        onStepComplete();
      }, 3000);
    }, 3000);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>เลือกอุปกรณ์และบดกาแฟ</h2>
        {!selectedMachine ? (
          <div>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
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
            <div style={{ display: "flex", justifyContent: "space-around" }}>
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




  