import React from 'react';
import './assets/css/simulator.css';

const RightPanel = ({ description }) => {
  return (
    <aside class="panel" style={{ width: '250px', padding: '1rem' }}>
      <h3>Step Details</h3>
      <p>{description}</p>
    </aside>
  );
};

export default RightPanel;

