import React from 'react';

const ConcernsList = ({ concerns, onSelectConcern }) => {
  return (
    <div style={{ width: '50%' }}>
      <h2>Customer Concerns</h2>
      <ul>
        {concerns.map(concern => (
          <li key={concern.id} onClick={() => onSelectConcern(concern)}>
            {concern.bookingReference}: {concern.concernMessage}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConcernsList;
