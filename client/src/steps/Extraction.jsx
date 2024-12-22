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
        height: "400px",
        width: "400px",
        backgroundColor: "white",
        cursor: "grab",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden"
      }}
    >
      {groundCoffee ? (
        <>
          <img 
            src="/animation/กาแฟบด.png"
            alt={groundCoffee.name}
            style={{
              width: "300px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "50%",
              marginBottom: "10px"
            }}
          />
          <div style={{
            fontSize: "14px",
            fontWeight: "bold",
            maxWidth: "80%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            <p>กาแฟ: {groundCoffee.name}</p>
            <p>บดด้วย: {groundCoffee.grindingMachine === "electric" ? "เครื่องบดไฟฟ้า" : "เครื่องบดมือ"}</p>
          </div>
        </>
      ) : (
        <p>ไม่มีข้อมูลกาแฟบด</p>
      )}
    </div>
  );
};

GroundCoffee.propTypes = {
  groundCoffee: PropTypes.shape({
    name: PropTypes.string,
    grindingMachine: PropTypes.string,
    groundCoffeeImage: PropTypes.string,
  }),
};

// คอมโพเนนต์สำหรับตัวเลือกเครื่องสกัดกาแฟ
const ExtractionMachineOption = ({ type, onSelect }) => {
  const imageSrc = type === "Espresso" ? "/animation/เครื่องเอสเพรสโซ.png" : "/animation/เครื่องดริป.png";
  const machineName = type === "Espresso" ? "เครื่องสกัดแบบเอสเพรสโซ" : "เครื่องสกัดแบบดริป";

  return (
    <div
      onClick={() => onSelect(type)}
      style={{
        margin: "20px",
        height: "400px",
        width: "400px",
        marginTop: "140px",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={imageSrc}
        alt={machineName}
        style={{
          width: "100%",
          height: "400px",
          objectFit: "contain",
        }}
      />
      <h3 style={{ 
        marginTop: "10px",
        fontSize: "18px",
        textAlign: "center",
        color: "#333"
      }}>
        {machineName}
      </h3>
    </div>
  );
};

ExtractionMachineOption.propTypes = {
  type: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// คอมโพเนนต์สำหรับเครื่องสกัดกาแฟ
const ExtractionMachine = ({ type, onDrop }) => {
  const [isExtraction, setIsExtraction] = useState(false);
  const machineName = type === "Espresso" ? "เครื่องสกัดแบบเอสเพรสโซ" : "เครื่องสกัดแบบดริป";

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "groundCoffee",
    drop: (item) => {
      setIsExtraction(true);
      onDrop(item.groundCoffee);
      setTimeout(() => setIsExtraction(false), 5000);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const staticImage = type === "Espresso" ? "/animation/เครื่องเอสเพรสโซ.png" : "/animation/เครื่องดริป.png";
  const animatedGif = type === "Espresso" ? "/animation/เครื่องเอสเพรสโซ.gif" : "/animation/เครื่องดริป.gif";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <div
        ref={drop}
        style={{
          width: "400px",
          height: "400px",
          backgroundColor: isOver ? "lightgreen" : "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <img
          src={isExtraction ? animatedGif : staticImage}
          alt={machineName}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <h3 style={{ 
        marginTop: "10px",
        fontSize: "18px",
        textAlign: "center",
        color: "#333"
      }}>
      </h3>
    </div>
  );
};

ExtractionMachine.propTypes = {
  type: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
};

// คอมโพเนนต์หลักสำหรับการสกัดกาแฟ
const Extraction = ({ onStepComplete, groundCoffee }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [extractionStatus, setExtractionStatus] = useState("");

  const handleDrop = (coffee) => {
    if (coffee?.name) {
      setExtractionStatus(`กำลังสกัดกาแฟ ${coffee.name}...`);
      setTimeout(() => {
        setExtractionStatus(`กาแฟ ${coffee.name} สกัดเสร็จแล้ว!`);
        setTimeout(() => {
          setExtractionStatus("");
          onStepComplete();
        }, 3000);
      }, 3000);
    } else {
      setExtractionStatus("ไม่พบข้อมูลกาแฟ");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>สกัดกาแฟ</h2>
        {!selectedMachine ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              <ExtractionMachineOption
                type="Espresso"
                onSelect={setSelectedMachine}
              />
              <ExtractionMachineOption
                type="Drip"
                onSelect={setSelectedMachine}
              />
            </div>
          </div>
        ) : (
          <div>
            <h3
              style={{
                textAlign: 'center',
                marginTop: '20px',
              }}
            >
              ลากกาแฟบดไปยังเครื่องสกัด
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "120px",
              }}
            >
              {groundCoffee ? (
                <GroundCoffee groundCoffee={groundCoffee} />
              ) : (
                <p>กรุณาเลือกกาแฟบด</p>
              )}
              <ExtractionMachine type={selectedMachine} onDrop={handleDrop} />
            </div>
          </div>
        )}
        {extractionStatus && <p style={{textAlign:"center"}}>{extractionStatus}</p>}
      </div>
    </DndProvider>
  );
};

Extraction.propTypes = {
  onStepComplete: PropTypes.func.isRequired,
  onStepBack: PropTypes.func.isRequired,
  groundCoffee: PropTypes.shape({
    name: PropTypes.string,
    grindingMachine: PropTypes.string,
    groundCoffeeImage: PropTypes.string,
  }),
};

export default Extraction;







  