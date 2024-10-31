'use client';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

const AdminChat = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ userId: string; text: string }[]>([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      console.log('Admin connected');
    });

    // Listen to messages from the clients
    socket.on('client_message', (msg: { userId: string; text: string }) => {
      setMessages((prev) => [...prev, { userId: msg.userId, text: msg.text }]);
    });
  };

  const sendMessage = () => {
    if (message) {
      socket.emit('admin_message', { adminId: 'Admin', text: message });
      setMessages((prev) => [...prev, { userId: 'Admin', text: message }]);
      setMessage('');
    }
  };

  return (
    <div className="text-white">
      <div>
        <h2>Admin Chat</h2>
        <div>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.userId}: </strong>
              {msg.text}
            </div>
          ))}
        </div>
      </div>
      <input className="text-black"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default AdminChat;
