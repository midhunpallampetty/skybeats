import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import socketIOClient from "socket.io-client";
import Cookies from "js-cookie";

const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });
const socket = socketIOClient('http://localhost:3300');  // Backend server URL

const ClientPage = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ from: string; message: string }[]>([]);
  const userId = Cookies.get('userId');  // User identification cookie

  useEffect(() => {
    // Handle incoming messages from the server
    socket.on('message', (data: { from: string; message: string }) => {
      setChat(prevChat => [...prevChat, data]);
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      // Emit message to server with user identification
      socket.emit('message', {
        from: userId || 'user',  // Sending the message as the user
        message
      });

      // Update local chat with the sent message
      setChat(prevChat => [...prevChat, { from: userId || 'user', message }]);
      setMessage('');  // Clear input after sending
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex w-full h-screen bg-gray-100 rounded-lg">
        {/* Sidebar */}
        <div className="w-1/4 bg-blue-950 shadow-inner shadow-white text-white p-4">
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
              {['Elmer Murphy'].map((user, index) => (
                <li key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <img
                    src={`https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/d7462d01-eaa6-4971-9026-28d1385204c4/7e6c08d8-8c4e-4242-a2e8-356928a0ab3a.png`}
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
          <div className="w-2/3 bg-gray-50 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/d7462d01-eaa6-4971-9026-28d1385204c4/7e6c08d8-8c4e-4242-a2e8-356928a0ab3a.png"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-xl">Elmer Murphy</h3>
                  <p className="text-sm text-gray-500">Last active 5 mins ago</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-bold">End Chat</button>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start ${msg.from === 'admin' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`rounded-lg p-3 ${msg.from === 'admin' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                    <p className="font-semibold">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white flex items-center space-x-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-800"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientPage;
