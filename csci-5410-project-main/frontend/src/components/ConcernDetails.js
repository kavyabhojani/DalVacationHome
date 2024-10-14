import React, { useState } from 'react';
import { db } from '../firebase';  // Ensure the firebase configuration is in the correct path
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ConcernDetails = ({ concern }) => {
  const [response, setResponse] = useState('');

  const handleResponseSubmit = async () => {
    try {
      await addDoc(collection(db, 'responses'), {
        bookingReference: concern.bookingReference,
        concernMessage: concern.concernMessage,
        agentId: concern.agentId,
        agentName: concern.agentName,
        responseMessage: response,
        timestamp: serverTimestamp(),
      });
      setResponse('');
      alert('Response submitted successfully!');
    } catch (error) {
      console.error('Error submitting response: ', error);
    }
  };

  return (
    <div style={{ width: '50%' }}>
      <h2>Concern Details</h2>
      <p><strong>Booking Reference:</strong> {concern.bookingReference}</p>
      <p><strong>Concern:</strong> {concern.concernMessage}</p>
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Type your response here..."
      />
      <button onClick={handleResponseSubmit}>Submit Response</button>
    </div>
  );
};

export default ConcernDetails;
