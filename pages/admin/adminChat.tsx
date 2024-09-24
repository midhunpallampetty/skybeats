import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import io from 'socket.io-client'; // Client-side socket.io
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for messages

const AdminPage = () => {
  const [messages, setMessages] = useState([]); // To store messages
  const [message, setMessage] = useState(''); // Input message state
  const [socket, setSocket] = useState(null); // Socket instance

  const AdminNavbar = dynamic(() => import('../components/AdminNavbar'), { ssr: false });
  const Adminaside = dynamic(() => import('../components/Adminaside'), { ssr: false });

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io('http://localhost:3300', {
      query: { role: 'admin' }, // Add role or room as needed
    });

    // Set socket instance to state
    setSocket(socketInstance);

    // Listen for incoming messages from the server
    socketInstance.on('messageFromUser', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { id: uuidv4(), from: 'user', message: msg }]);
    });

    // Clean up the socket connection when component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Handle sending messages
  const sendMessage = () => {
    if (message.trim() === '') return; // Prevent sending empty messages

    // Emit message to the server
    socket.emit('messageFromAdmin', message);

    // Update local message state
    setMessages((prevMessages) => [...prevMessages, { id: uuidv4(), from: 'admin', message }]);
    setMessage(''); // Clear input
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-row w-full">
          <Adminaside />
          <div className="w-[70%] ml-[500px] h-[85vh] rounded-lg shadow-inner shadow-white/25 flex flex-col bg-blue-900/20">
            {/* Top Navbar */}
            <div className="w-full h-16 bg-blue-900/50 flex items-center justify-between px-4 rounded-t-lg">
              <h1 className="text-white font-bold">Admin Chat</h1>
              <div className="flex space-x-4">
                <button className="bg-red-600 text-white font-extrabold py-2 px-4 rounded hover:bg-blue-700">
                  End Chat
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg p-3 ${msg.from === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    <p className="font-semibold">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="w-full h-16 bg-blue-900/50 flex items-center justify-between px-4 rounded-b-lg">
              <div className="flex w-full space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow p-4 rounded-lg shadow-inner text-sm text-white bg-blue-950 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg px-4 py-2"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
