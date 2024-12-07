// import { useState } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import PropTypes from "prop-types";

// // คอมโพเนนต์สำหรับเมล็ดกาแฟที่สามารถลากได้
// const CoffeeBean = ({ bean }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "bean", // ระบุประเภทไอเท็มสำหรับ Drag and Drop
//     item: { bean },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(), // ตรวจสอบสถานะการลาก
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       style={{
//         opacity: isDragging ? 0.5 : 1, // ความโปร่งใสระหว่างลาก
//         padding: "10px",
//         margin: "10px",
//         border: "1px solid #333",
//         borderRadius: "5px",
//         backgroundColor: "lightgoldenrodyellow",
//         cursor: "grab",
//       }}
//     >
//       {bean.name}
//     </div>
//   );
// };

// // เพิ่ม PropTypes สำหรับ CoffeeBean
// CoffeeBean.propTypes = {
//   bean: PropTypes.shape({
//     id: PropTypes.number.isRequired, // ต้องมี `id` เป็นตัวเลข
//     name: PropTypes.string.isRequired, // ต้องมี `name` เป็นข้อความ
//   }).isRequired,
// };

// // คอมโพเนนต์สำหรับเครื่องบดกาแฟ
// const GrindingMachine = ({ type, onDrop }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: "bean", // ระบุประเภทไอเท็มที่รองรับ
//     drop: (item) => onDrop(item.bean), // เรียกฟังก์ชันเมื่อมีการปล่อยไอเท็ม
//     collect: (monitor) => ({
//       isOver: monitor.isOver(), // ตรวจสอบสถานะการลากไอเท็มเหนือพื้นที่ Drop
//     }),
//   }));

//   return (
//     <div
//       ref={drop}
//       style={{
//         width: "200px",
//         height: "200px",
//         border: "2px dashed gray",
//         borderRadius: "10px",
//         backgroundColor: isOver ? "lightgreen" : "white", // เปลี่ยนสีเมื่อไอเท็มอยู่ด้านบน
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         margin: "20px",
//         cursor: "pointer",
//       }}
//     >
//       {type === "electric"
//         ? "เครื่องบดไฟฟ้า"
//         : "เครื่องบดมือ"}
//     </div>
//   );
// };

// // เพิ่ม PropTypes สำหรับ GrindingMachine
// GrindingMachine.propTypes = {
//   type: PropTypes.string.isRequired, // ต้องมี `type` เป็นข้อความ
//   onDrop: PropTypes.func.isRequired, // ต้องมี `onDrop` เป็นฟังก์ชัน
// };

// // คอมโพเนนต์หลักสำหรับการบดกาแฟ
// const Grinding = ({ onStepComplete, onStepBack }) => {
//   const [selectedMachine, setSelectedMachine] = useState(null);
//   const [bean] = useState({ id: 1, name: "Arabica" }); // ตัวอย่างเมล็ดกาแฟ

//   const handleDrop = (bean) => {
//     alert(`คุณได้บดเมล็ดกาแฟ ${bean.name} ด้วย ${selectedMachine}`);
//     onStepComplete(); // ไปยังขั้นตอนถัดไป
//   };

<<<<<<< HEAD
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>เลือกอุปกรณ์และบดกาแฟ</h2>
        {!selectedMachine ? (
          <div>
            <button onClick={() => setSelectedMachine("electric")}>
              เครื่องบดไฟฟ้า
            </button>
            <button onClick={() => setSelectedMachine("manual")}>
              เครื่องบดมือ
            </button>
          </div>
        ) : (
          <div>
            <h3>ลากเมล็ดกาแฟไปยังเครื่องบด</h3>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <CoffeeBean bean={bean} />
              <GrindingMachine
                type={selectedMachine}
                onDrop={handleDrop}
              />
            </div>
            <button onClick={() => setSelectedMachine(null)}>ย้อนกลับ</button>
          </div>
        )}
        <button onClick={onStepBack}>ย้อนกลับ</button>
      </div>
    </DndProvider>
  );
};
=======
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div>
//         <h2>เลือกอุปกรณ์และบดกาแฟ</h2>
//         {!selectedMachine ? (
//           <div>
//             <h3>เลือกเครื่องบดกาแฟ:</h3>
//             <button onClick={() => setSelectedMachine("electric")}>
//               เครื่องบดไฟฟ้า
//             </button>
//             <button onClick={() => setSelectedMachine("manual")}>
//               เครื่องบดมือ
//             </button>
//           </div>
//         ) : (
//           <div>
//             <h3>ลากเมล็ดกาแฟไปยังเครื่องบด</h3>
//             <div style={{ display: "flex", justifyContent: "space-around" }}>
//               <CoffeeBean bean={bean} />
//               <GrindingMachine
//                 type={selectedMachine}
//                 onDrop={handleDrop}
//               />
//             </div>
//             <button onClick={() => setSelectedMachine(null)}>ย้อนกลับ</button>
//           </div>
//         )}
//         <button onClick={onStepBack}>ย้อนกลับ</button>
//       </div>
//     </DndProvider>
//   );
// };
>>>>>>> c0f0eabb3d15c16d423eaf5948510823ea1a5222

// // เพิ่ม PropTypes สำหรับ Grinding
// Grinding.propTypes = {
//   onStepComplete: PropTypes.func.isRequired, // ต้องมี `onStepComplete` เป็นฟังก์ชัน
//   onStepBack: PropTypes.func.isRequired, // ต้องมี `onStepBack` เป็นฟังก์ชัน
// };

// export default Grinding;


  