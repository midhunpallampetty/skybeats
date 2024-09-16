import React, { useState } from 'react';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
      // Handle chatbot response here if needed
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      <button
        style={{
          border: 'none',
          color: 'white',
          padding: '10px 15px',
          fontSize: '24px',
          borderRadius: '50%',
          cursor: 'pointer',
        }}
        onClick={toggleChat}
      >
        <img width='55' src='https://airline-datacenter.s3.ap-south-1.amazonaws.com/chat-icon.png'/>
      </button>

      {isOpen && (
        <div
          style={{
            width: '300px',
            height: '400px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'fixed',
            bottom: '80px',
            right: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h4 style={{ margin: 0 }}>Chat with us!</h4>
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
              }}
              onClick={toggleChat}
            >
              ×
            </button>
          </div>

          <div
            style={{
              padding: '10px',
              height: '300px',
              overflowY: 'scroll',
              flexGrow: 1,
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  margin: '5px 0',
                  padding: '8px',
                  borderRadius: '5px',
                  backgroundColor:
                    message.sender === 'user' ? '#007bff' : '#f1f1f1',
                  color: message.sender === 'user' ? 'white' : 'black',
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                }}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              padding: '10px',
              borderTop: '1px solid #ddd',
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              style={{
                flexGrow: 1,
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '5px',
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                backgroundColor: '#007bff',
                border: 'none',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                marginLeft: '5px',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
