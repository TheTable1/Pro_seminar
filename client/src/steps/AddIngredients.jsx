import PropTypes from 'prop-types';
const AddIngredients = ({ onStepBack }) => {
    return (
      <div>
        <h2>เติมส่วนผสมอื่น</h2>
        <button onClick={onStepBack}>ย้อนกลับ</button>
      </div>
    );
  };
  
  export default AddIngredients;
  