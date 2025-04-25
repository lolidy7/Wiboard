import React, { useState } from 'react';
import '../../css/chatbot/Chatbot.css'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! Welcome to Wboard website. How can I assist you today?' }
  ]);
  const [userInput, setUserInput] = useState('');

  const handleToggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setMessages([...messages, { sender: 'user', text: userInput }]);
    const botResponse = generateBotResponse(userInput.toLowerCase());
    setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    setUserInput('');
  };

  const generateBotResponse = (input) => {
    if (input.includes('what is this website') || input.includes('what does this site do')) {
      return 'This website lets you search for high-quality images from Unsplash using keywords. Explore images, view details, and discover categories like nature.';
    } else if (input.includes('how to search') || input.includes('search for images')) {
      return 'Type a keyword (e.g., "nature") in the search bar at the top and click "Explore". Images will appear below, and you can scroll to load more!';
    } else if (input.includes('navigate') || input.includes('how to use')) {
      return 'Use the search bar to find images, click an image for details, or check out links like "Welcome" or "Details" in the menu. I’m here for more help!';
    } else if (input.includes('who made this') || input.includes('creator')) {
      return 'This site was built to showcase image searching with React and the Unsplash API. I’m the chatbot assistant here to guide you!';
    } else {
      return 'Hmm, I am not sure about that. Try asking about how to search images, what this website does, or how to navigate!';
    }
  };

  return (
    <div className="chatbot-container">
      <img
        src="/images/chatbot.png"
        alt="Chatbot Icon"
        className="chatbot-icon"
        onClick={handleToggleChatbot}
      />
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Wboard assistant</h3>
            <button onClick={handleToggleChatbot}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="chatbot-input-form">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;