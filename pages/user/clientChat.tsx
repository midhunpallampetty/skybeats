import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';
import EmojiPicker from "emoji-picker-react";

interface Message {
  id: number;
  message: string;
  from: 'admin' | 'user';
}

// Dynamically import components to prevent SSR issues
const UserNavbar = dynamic(() => import('../components/Navbar'), { ssr: false });

const UserChat: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Simulate loading time
    }, 5000); // 2 seconds delay for loading

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);
  // Initialize Socket.io connection
  useEffect(() => {
    const socketConnection: Socket = io('http://localhost:3300'); // Replace with your backend Socket.io URL
    setSocket(socketConnection);

    // Identify as user
    socketConnection.emit('identify', 'user');

    // Listen for messages from admin
    socketConnection.on('privateMessageFromAdmin', (data: { message: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, message: data.message, from: 'admin' },
      ]);
    });
   
    // Clean up the connection when the component is unmounted
    return () => {
      socketConnection.disconnect();
    };
  }, []);
  const handleEmojiClick = (emojiObject: any) => {
    // Append the emoji to the current message
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
  };
  
  
  // Function to send a message
  const sendMessage = () => {
    if (message.trim()) {
      // Send the message (including any emojis) to the admin via socket
      socket?.emit('privateMessageToAdmin', { message });
  
      // Update the message list in the user chat UI, including emojis
      setMessages([...messages, { id: messages.length + 1, message, from: 'user' }]);
  
      // Clear the input field after sending
      setMessage('');
    }
  };
  

  // Inline styles for loading screen and animation
  const loadingScreenStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a2d45', // Dark background for loading screen
  };

  const loadingBarStyle = {
    width: '100px',
    height: '5px',
    backgroundColor: '#0c2336', // Bar background
    marginTop: '10px',
    borderRadius: '3px',
    overflow: 'hidden',
  };

  const loadingBarFillStyle = {
    width: '0',
    height: '100%',
    backgroundColor: '#0073b1', // Loading bar fill color
    animation: 'load 3s ease-in-out infinite',
  };

  // Keyframe animation using JavaScript
  const loadingKeyframes = `
    @keyframes load {
      0% { width: 0; }
      50% { width: 100%; }
      100% { width: 0; }
    }
  `;

  return (
    <>
    <style>
      {loadingKeyframes}
    </style>
    {isLoading ? (
      <div style={loadingScreenStyle}>
        <Image
          src="/chat-icon.png" // Replace with your logo path
          alt="Logo"
          width={100}
          height={100}
        />
        <p className='text-white font-extrabold font-sans text-xl'>Loading Customer Support Please Wait......</p>
        <div style={loadingBarStyle}>
          <div style={loadingBarFillStyle}></div>
        </div>
      </div>
    ) : (
    <>
      <UserNavbar />
      <div className="flex w-full h-screen bg-gray-100 rounded-lg">
        {/* Sidebar */}
        <div className="w-1/4 bg-blue-950 shadow-inner shadow-white text-white p-4">
          {/* Profile & Navigation */}
          <div className="flex items-center space-x-4 mb-8">
            <img
              src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/d7462d01-eaa6-4971-9026-28d1385204c4/7e6c08d8-8c4e-4242-a2e8-356928a0ab3a.png"
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <h2 className="font-bold">Mark Norway</h2>
          </div>
          <nav>
            <ul className="space-y-4">
              <li className="flex justify-center items-center hover:bg-blue-800/25 hover:rounded-lg hover:shadow-white/15 hover:shadow-inner font-extrabold p-2 text-2xl rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="white" width="25">
                  <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                </svg>
                &nbsp;Home
              </li>
              <li className="flex justify-center items-center hover:bg-blue-800/25 hover:rounded-lg hover:shadow-white/15 hover:shadow-inner font-extrabold p-2 text-2xl rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white" width="25">
                  <path d="M256 48C141.1 48 48 141.1 48 256l0 40c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40C0 114.6 114.6 0 256 0S512 114.6 512 256l0 144.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24l-32 0c-26.5 0-48-21.5-48-48s21.5-48 48-48l32 0c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40L464 256c0-114.9-93.1-208-208-208zM144 208l16 0c17.7 0 32 14.3 32 32l0 112c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-48c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64l0 48c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-112c0-17.7 14.3-32 32-32l16 0z" />
                </svg>
                &nbsp; Chat Bot
              </li>
            </ul>
          </nav>
        </div>

        {/* Chat Section */}
        <div className="flex-grow flex">
          {/* Chat List */}
          <div className="w-1/3 bg-white shadow-blue-950 shadow-inner border-r">
            <div className="p-4 border-b">
              <h3 className="text-xl font-bold">Chats</h3>
            </div>
            <ul className="space-y-4 p-4">
              {['Jithin'].map((user, index) => (
                <li key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <img
                    src="https://media.licdn.com/dms/image/v2/C5603AQFUUiMCTz33zg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1517405946768?e=1732752000&v=beta&t=B8m-ZvygfZNZWpscCYzGxlAjg5c-ZTPZriwmpCYCff8"
                    alt={user}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold">{user}</h4>
                    <p className="text-sm text-gray-500">This is a short message...</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Window */}
          <div className="w-2/3 bg-gray-50 flex flex-col relative">
            {/* Chat Header */}
            <div className="bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Chat with Elmer Murphy</h2>
            </div>

            {/* Messages List */}
            <div className="flex-grow p-4 overflow-y-auto space-y-2 flex flex-col">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-l-lg rounded-r-sm text-xl font-semibold shadow-inner flex items-center justify-center ${msg.from === 'user'
                    ? 'bg-gradient-to-r from-[#4a00e0] to-[#8e2de2] text-white self-end max-w-xs'
                    : 'bg-gray-200 text-black self-start max-w-xs'
                    }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t p-4 flex items-center">
              <div className="relative">
                {showEmojiPicker && (
                  <div className="absolute bottom-full mb-2 left-0">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
                <button
                  className="p-2 rounded-md border bg-gray-200"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  😀
                </button>
              </div>
              <input 
                type="text"
                placeholder="Type a message"
                value={message}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(); 
                  }
                }}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow p-2 border rounded-lg mx-2"
              />
              <button onClick={sendMessage} className="p-2 bg-blue-600 text-white rounded-lg">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
      )}
    </>
  );
};

export default UserChat;
