import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // Add the new message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage, type: "user" },
    ]);

    // Clear the input field
    setNewMessage("");

    try {
      // Make an API call to the Flask backend
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: newMessage }),
      });

      const data = await response.json();
      const botResponse = data.answer;

      // Add bot response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, type: "bot" },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong.", type: "bot" },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 z-50"
      >
        💬
      </button>

      {/* "Chat with Agent" Popup (Home Page Only) */}
      {isHomePage && !isOpen && (
        <div className="fixed bottom-20 right-5 bg-white text-black p-3 rounded-lg shadow-lg z-50">
          <p className="text-sm">Chat with our agent!</p>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 w-80 bg-white rounded-lg shadow-lg flex flex-col z-50">
          <div className="bg-green-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-bold">LaunchPad</h2>
            <button onClick={toggleChat} className="text-white font-bold">
              ✖
            </button>
          </div>
          <div
            className="flex-1 overflow-y-auto p-3"
            style={{ maxHeight: "300px" }} // Set fixed height for the chat window
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.type === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotWidget;
