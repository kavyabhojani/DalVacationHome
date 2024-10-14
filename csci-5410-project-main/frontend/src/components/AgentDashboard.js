import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import './AgentDashboard.css'; // Assuming you have a CSS file for styling

const AgentDashboard = () => {
  const [concerns, setConcerns] = useState([]);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [agentId, setAgentId] = useState('');

  useEffect(() => {
    // Retrieve user information from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log("User found in localStorage:", user);

      // Set the agentId directly from the user's email
      setAgentId(user.email);
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (agentId) {
      const q = query(
        collection(db, 'concerns'),
        where('agentId', '==', agentId)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const concernsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setConcerns(concernsData);
      });
      return () => unsubscribe();
    }
  }, [agentId]);

  useEffect(() => {
    if (selectedConcern) {
      const q = query(
        collection(db, 'chats'),
        where('concernId', '==', selectedConcern.concernId),
        orderBy('timestamp')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChats(chatData);
      });
      return () => unsubscribe();
    }
  }, [selectedConcern]);

  const sendMessage = async () => {
    if (!selectedConcern || !selectedConcern.concernId) {
      console.error('Selected concern or concern ID is undefined');
      return;
    }

    try {
      const messageData = {
        concernId: selectedConcern.concernId,
        sender: agentId,
        chatMessage: message,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'chats'), messageData);
      setMessage('');

      // Publish to Pub/Sub via the Cloud Function
      const response = await axios.post('https://us-central1-serverless-term-project-428419.cloudfunctions.net/roomSearchandConcern', {
        queryResult: {
          parameters: {
            concernId: selectedConcern.concernId,
            chatMessage: message,
            sender: agentId
          }
        },
        intent: {
          displayName: 'SendMessage'
        }
      });
      console.log(`Message published: ${response.data}`);
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div className="agent-dashboard">
      <h1>Agent Dashboard</h1>
      <div className="dashboard-content">
        <div className="concerns-list">
          <h2>Concerns</h2>
          <ul>
            {concerns.map((concern) => (
              <li 
                key={concern.id} 
                onClick={() => setSelectedConcern(concern)}
                className={selectedConcern && selectedConcern.id === concern.id ? 'selected' : ''}
              >
                {concern.concernId}: {concern.concernMessage}
              </li>
            ))}
          </ul>
        </div>
        {selectedConcern && (
          <div className="chat-window">
            <h2>Chat</h2>
            <div className="chat-messages">
              {chats.map((chat, index) => (
                <div key={index} className={`chat-message ${chat.sender === agentId ? 'agent' : 'user'}`}>
                  <strong>{chat.sender}:</strong> {chat.chatMessage}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
