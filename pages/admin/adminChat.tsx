import React, { useEffect, useState, CSSProperties } from 'react';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import EmojiPicker from 'emoji-picker-react';

interface Message {
  id: number;
  message: string;
  from: 'admin' | 'user';
  userId?: string;
  time?: string;
}

const AdminNavbar = dynamic(() => import('../components/AdminNavbar'), { ssr: false });
const AdminAside = dynamic(() => import('../components/Adminaside'), { ssr: false });

const AdminChat: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any | null>(null);

  useEffect(() => {
    const socketConnection: any = io('http://localhost:3300');
    setSocket(socketConnection);

    socketConnection.emit('identify', 'admin');

    socketConnection.on('privateMessageFromUser', (data: { message: string; userId: string; time: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, message: data.message, from: 'user', userId: data.userId, time: data.time },
      ]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const sendMessage = () => {
    if (message.trim() && messages.length > 0) {
      const lastUser = messages[messages.length - 1];
      const adminMessage = { message, userId: lastUser.userId };

      socket?.emit('privateMessageToUser', adminMessage);

      setMessages([...messages, { id: messages.length + 1, message, from: 'admin' }]);
      setMessage('');
    }
  };

  const loadingScreenStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a2d45',
  };

  const loadingBarStyle: CSSProperties = {
    width: '100px',
    height: '5px',
    backgroundColor: '#0c2336',
    marginTop: '10px',
    borderRadius: '3px',
    overflow: 'hidden',
  };

  const loadingBarFillStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#0073b1',
    animation: 'load 3s ease-in-out infinite',
  };

  const loadingKeyframes = `
    @keyframes load {
      0% { width: 0; }
      50% { width: 100%; }
      100% { width: 0; }
    }
  `;

  return (
    <>
      <style>{loadingKeyframes}</style>
      {isLoading ? (
        <div style={loadingScreenStyle}>
          <Image src="/chat-icon.png" alt="Logo" width={100} height={100} />
          <p className="text-white font-extrabold font-sans text-xl">
            Launching Chat Instance Please Wait......
          </p>
          <div style={loadingBarStyle}>
            <div style={loadingBarFillStyle}></div>
          </div>
        </div>
      ) : (
        <>
          <AdminNavbar />
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex flex-row w-full">
              <AdminAside />
              <div className="w-[70%] ml-[500px] h-[85vh] rounded-lg shadow-inner shadow-white/25 flex flex-col bg-blue-900/20">
                <div className="w-full h-16 bg-blue-900/50 flex items-center justify-between px-4 rounded-t-lg">
                  <img
                    src="https://pics.craiyon.com/2023-06-08/0f959bef16e244bba7936ab9556e21b2.webp"
                    className="rounded-full w-10 h-10"
                  />
                  <h1 className="text-white text-3xl font-sans font-extrabold ">Admin Chat</h1>
                  <div className="flex space-x-4">
                    <button className="bg-red-600 text-white font-extrabold py-2 px-4 rounded hover:bg-blue-700">
                      End Chat
                    </button>
                  </div>
                </div>

                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`relative rounded-lg p-3 ${msg.from === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        <p className="font-semibold">
                          {typeof msg.message === 'string' ? msg.message : msg.message?.message}
                        </p>

                      </div>
                      <span className="ml-2 text-[10px] text-white/60 font-thin font-sans">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full h-16 bg-blue-900/50 flex items-center justify-between px-4 rounded-b-lg">
                  <div className="flex w-full space-x-4">
                    <div className="relative">
                      {showEmojiPicker && (
                        <div className="absolute bottom-full mb-2 left-0">
                          <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                      )}
                      <button
                        className="p-2 rounded-md shadow-white shadow-inner bg-blue-600/40"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                      >
                        😀
                      </button>
                    </div>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage();
                        }
                      }}
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
      )}
    </>
  );
};

export default AdminChat;
