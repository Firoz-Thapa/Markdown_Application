import React, { useState, useRef, useEffect } from 'react';
import runChat from '../services/chatService';
import './Chatbot.css';

function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I can help you with Markdown questions. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const prompt = `As a Markdown expert, please help with this query: ${input}. 
                     If I ask for templates or examples, please provide the exact Markdown code.`;
      const response = await runChat(prompt);
      const botMessage = { role: 'bot', content: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Markdown Assistant</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isLoading && <div className="message bot typing">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chatbot-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Markdown..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}

export default Chatbot;