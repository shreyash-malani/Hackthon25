import React, { useEffect, useRef, useState } from 'react';
import API from '../api/axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const socket = io('http://localhost:3000'); // Consider using env variable for production

const FounderDMPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const previousConversationIdRef = useRef(null);

  // Fetch user conversations
  useEffect(() => {
    if (user?._id) {
      setLoading(true);
      API.get(`/api/v1/conversations/${user._id}`)
        .then(res => {
          setConversations(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching conversations:", err);
          setError("Failed to load conversations");
          setLoading(false);
        });
    }
  }, [user]);

  // Join socket room and fetch messages
  useEffect(() => {
    if (selectedConversation?._id) {
      setLoading(true);

      // Leave previous room
      if (previousConversationIdRef.current) {
        socket.emit('leaveConversation', previousConversationIdRef.current);
      }

      // Join new room
      socket.emit('joinConversation', selectedConversation._id);
      previousConversationIdRef.current = selectedConversation._id;

      // Fetch messages
      API.get(`/api/v1/messages/${selectedConversation._id}`)
        .then(res => {
          setMessages(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching messages:", err);
          setError("Failed to load messages");
          setLoading(false);
        });
    }

    // Cleanup on unmount
    return () => {
      if (selectedConversation?._id) {
        socket.emit('leaveConversation', selectedConversation._id);
      }
    };
  }, [selectedConversation]);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (msg.conversationId === selectedConversation?._id) {
        setMessages(prevMessages => {
          const exists = prevMessages.some(m =>
            m._id === msg._id ||
            (m.content === msg.content && m.sender === msg.sender)
          );
          if (exists) return prevMessages;
          return [...prevMessages.filter(m => !m._id?.startsWith('temp-')), msg];
        });
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    return () => socket.off('receiveMessage', handleReceiveMessage);
  }, [selectedConversation]);

  // Send new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      conversationId: selectedConversation._id,
      sender: user._id,
      text: newMessage
    };

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      sender: user._id,
      content: newMessage,
      createdAt: new Date().toISOString(),
      conversationId: selectedConversation._id
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const res = await API.post('/api/v1/message', messageData);
      socket.emit('sendMessage', res.data);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex mt-16">
      {/* Sidebar */}
      <div className="w-1/3 border-r h-screen overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">Inbox</h2>

        {loading && conversations.length === 0 ? (
          <p className="text-gray-600">Loading conversations...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-600">No conversations yet</p>
        ) : (
          conversations.map((conv) => {
            const other = conv.members.find(m => m._id !== user._id);
            return (
              <div
                key={conv._id}
                className={`p-3 mb-2 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedConversation?._id === conv._id ? 'bg-gray-200' : ''
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <p className="font-semibold">{other?.fullName}</p>
                <p className="text-sm text-gray-600">{other?.email}</p>
                {conv.latestMessage && (
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {conv.latestMessage.content}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Message View */}
      <div className="w-2/3 h-screen flex flex-col justify-between p-4">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="border-b pb-3 mb-4 font-bold">
              {selectedConversation.members.find(m => m._id !== user._id)?.fullName}
            </div>

            {/* Messages */}
            <div className="overflow-y-auto h-full mb-4 px-2">
              {loading ? (
                <div className="text-center text-gray-600">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-600 mt-4">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={msg._id || `msg-${idx}`} className="flex flex-col my-2">
                    <div
                      className={`p-3 max-w-md rounded-lg ${
                        msg.sender === user._id
                          ? 'bg-blue-500 text-white self-end ml-auto'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      {msg.content || msg.text}
                    </div>
                    <span
                      className={`text-xs text-gray-500 mt-1 ${
                        msg.sender === user._id ? 'self-end' : ''
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border rounded resize-none"
                placeholder="Type a message..."
                rows="2"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className={`px-4 py-2 rounded ${
                  newMessage.trim()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 flex items-center justify-center h-full">
            <div>
              <p className="mb-2">Select a conversation to start chatting</p>
              <p className="text-sm">Or start a new conversation from the contacts page</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FounderDMPage;
