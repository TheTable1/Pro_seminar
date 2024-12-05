const Extraction = ({ onStepComplete, onStepBack }) => {
    return (
      <div>
        <h2>สกัดกาแฟ</h2>
        <button onClick={onStepBack}>ย้อนกลับ</button>
        <button onClick={onStepComplete}>ถัดไป</button>
      </div>
    );
  };
  
  export default Extraction;
  