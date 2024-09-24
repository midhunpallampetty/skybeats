import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import Cookies from 'js-cookie';

const socket = socketIOClient('http://localhost:3300');  // Backend server URL

const Chat = () => {
    const userId = Cookies.get('userId');  // Retrieve userId from cookies
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<{ from: string; message: string }[]>([]);

    useEffect(() => {
        
            // Join user's room based on their userId
           

            // Listen for incoming messages
            socket.on('message', (data: any) => {
                setChat((prevChat) => [...prevChat, data]);
                console.log('data received',data.message)
            });

            // Cleanup when the component unmounts
            return () => {
                socket.off('message'); // Unsubscribe to avoid memory leaks
               
            };
        
    }, [userId]);

    // Handle sending messages
    const sendMessage = () => {
        if (message.trim() !== '') {
            socket.emit('message', {
                from: userId,
              // Always send the message to admin
                message: message
            });
            setMessage('');  // Clear input after sending
        }
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', minHeight: '100vh' }}>
            <h2>Chat</h2>

            {/* Chat window displaying messages */}
            <div className="chat-window" style={{ border: '1px solid black', padding: '10px', marginTop: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {chat.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.from === userId ? 'You' : 'Admin'}:</strong> {msg.message}
                    </div>
                ))}
            </div>

            {/* Input for sending a message */}
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                style={{ marginRight: '10px', marginTop: '10px' }}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
