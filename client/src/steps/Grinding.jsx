import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PropTypes from "prop-types";

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
      {bean ? (
        <>
          <img 
            src={bean.image} 
            alt={bean.name}
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
            {bean.name}
          </div>
        </>
      ) : (
        <p>ไม่มีข้อมูลเมล็ดกาแฟ</p>
      )}
    </div>
  );
};

CoffeeBean.propTypes = {
  bean: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
  }),
};

const GrindingMachineOption = ({ type, onSelect }) => {
  const imageSrc = type === "electric" ? "/animation/เครื่องบดไฟฟ้า.png" : "/animation/เครื่องบดมือ.png";
  const machineName = type === "electric" ? "เครื่องบดไฟฟ้า" : "เครื่องบดมือ";

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

GrindingMachineOption.propTypes = {
  type: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const GrindingMachine = ({ type, onDrop }) => {
  const [isGrinding, setIsGrinding] = useState(false);
  const machineName = type === "electric" ? "เครื่องบดไฟฟ้า" : "เครื่องบดมือ";

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "bean",
    drop: (item) => {
      setIsGrinding(true);
      onDrop(item.bean);
      setTimeout(() => setIsGrinding(false), 5000);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const staticImage = type === "electric" ? "/animation/เครื่องบดไฟฟ้า.png" : "/animation/เครื่องบดมือ.png";
  const animatedGif = type === "electric" ? "/animation/เครื่องบดไฟฟ้า.gif" : "/animation/เครื่องบดมือ.gif";

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
          src={isGrinding ? animatedGif : staticImage}
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

GrindingMachine.propTypes = {
  type: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
};

const GroundCoffeeResult = ({ machineType }) => {
  const imageSrc = machineType === "electric" ? "/animation/กาแฟบด1.png" : "/animation/กาแฟบด2.png";
  
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "400px",
      width: "400px",
      margin: "20px auto",
      marginTop: "120px",
    }}>
      <img
        src={imageSrc}
        alt="กาแฟบด"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain"
        }}
      />
    </div>
  );
};

GroundCoffeeResult.propTypes = {
  machineType: PropTypes.string.isRequired,
};

const Grinding = ({ onStepComplete, selectedBean }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [grindingStatus, setGrindingStatus] = useState("");
  const [isGrindingComplete, setIsGrindingComplete] = useState(false);

  const handleDrop = (bean) => {
    if (bean?.name) {
      setGrindingStatus(`กำลังบดเมล็ดกาแฟ ${bean.name}...`);
      setTimeout(() => {
        setGrindingStatus(`เมล็ดกาแฟ ${bean.name} บดเสร็จแล้ว!`);
        setIsGrindingComplete(true);
        setTimeout(() => {
          setGrindingStatus("");
          onStepComplete();
        }, 3000);
      }, 3000);
    } else {
      setGrindingStatus("ไม่พบข้อมูลเมล็ดกาแฟ");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>เลือกอุปกรณ์และบดกาแฟ</h2>
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
            {!isGrindingComplete ? (
              <>
                <h3
                  style={{
                    textAlign: 'center',
                    marginTop: '20px',
                  }}
                >
                  ลากเมล็ดกาแฟไปยังเครื่องบด
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: "120px",
                  }}
                >
                  {selectedBean ? (
                    <CoffeeBean bean={selectedBean} />
                  ) : (
                    <p>กรุณาเลือกเมล็ดกาแฟ</p>
                  )}
                  <GrindingMachine type={selectedMachine} onDrop={handleDrop} />
                </div>
              </>
            ) : (
              <GroundCoffeeResult machineType={selectedMachine} />
            )}
          </div>
        )}
        {grindingStatus && <p style={{textAlign:"center"}}>{grindingStatus}</p>}
      </div>
    </DndProvider>
  );
};

Grinding.propTypes = {
  onStepComplete: PropTypes.func.isRequired,
  onStepBack: PropTypes.func.isRequired,
  selectedBean: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

export default Grinding;