const Grinding = ({ onStepComplete, onStepBack }) => {
    return (
      <div>
        <h2>บดกาแฟ</h2>
        <button onClick={onStepBack}>ย้อนกลับ</button>
        <button onClick={onStepComplete}>ถัดไป</button>
      </div>
    );
  };
  
  export default Grinding;
  