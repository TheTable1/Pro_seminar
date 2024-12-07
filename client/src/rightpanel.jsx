import React from 'react';
import './assets/css/simulator.css';

const RightPanel = ({ description }) => {
  return (
    <aside className="panel" style={{ width: '250px', padding: '1rem' }}>
      <h3>รายละเอียดขั้นตอน</h3>
      <p>{description}</p>
    </aside>
  );
};

export default RightPanel;


