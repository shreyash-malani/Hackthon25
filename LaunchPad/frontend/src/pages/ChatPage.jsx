import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import io from 'socket.io-client';

const ChatPage = () => {
  const { founderId } = useParams();
  const navigate = useNavigate();
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  const [userId, setUserId] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize socket connection once
  useEffect(() => {
    socket.current = io('http://localhost:3000');
    
    // Cleanup on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Get current user ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await API.get('/checkauth');
        setUserId(res.data._id);
      } catch (err) {
        console.error('Error fetching user ID:', err);
        setError('Authentication error');
      }
    };

    fetchUserId();
  }, []);

  // Prevent messaging yourself
  useEffect(() => {
    if (userId && userId === founderId) {
      setError('You cannot message yourself.');
      navigate('/');
    }
  }, [userId, founderId, navigate]);

  // Create or get conversation
  useEffect(() => {
    const fetchOrCreateConversation = async () => {
      if (!userId || !founderId || userId === founderId) return;

      try {
        setLoading(true);
        const res = await API.post('/conversations', {
          senderId: userId,
          receiverId: founderId,
        });
        setConversationId(res.data._id);
        
        // Only join the conversation room after we have a valid ID
        if (res.data._id) {
          socket.current.emit('joinConversation', res.data._id);
        }
      } catch (err) {
        console.error('Error fetching/creating conversation:', err);
        setError('Could not establish conversation');
      }
    };

    if (userId && founderId) {
      fetchOrCreateConversation();
    }
  }, [userId, founderId]);

  // Fetch messages after getting conversation ID
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
  
      try {
        const res = await API.get(`/messages/${conversationId}`);
        console.log('Fetched messages:', res.data);
        
        // Set messages only once from API
        setMessages(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      }
    };
  
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  // Set up socket listener for new messages
  useEffect(() => {
    if (!socket.current || !conversationId) return;

    // Define message handler
    const handleNewMessage = (message) => {
      if (message.conversationId === conversationId) {
        setMessages(prevMessages => {
          // Check if message already exists to prevent duplicates
          const messageExists = prevMessages.some(msg => 
            msg._id === message._id || 
            (msg.text === message.text && msg.sender === message.sender && 
             msg.createdAt === message.createdAt)
          );
          
          if (messageExists) return prevMessages;
          return [...prevMessages, message];
        });
      }
    };

    // Register and cleanup socket event
    socket.current.on('receiveMessage', handleNewMessage);
    
    return () => {
      socket.current.off('receiveMessage', handleNewMessage);
    };
  }, [conversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      const messageData = {
        conversationId,
        sender: userId,
        text: newMessage,
      };

      // Send the message through API
      const res = await API.post('/message', messageData);
      
      // Only emit after successful API response
      socket.current.emit('sendMessage', res.data);

      // Add to local messages - but don't add duplicates
      setMessages(prevMessages => {
        // If the message is already in the list (by ID), don't add it again
        if (prevMessages.some(msg => msg._id === res.data._id)) {
          return prevMessages;
        }
        return [...prevMessages, res.data];
      });
      
      setNewMessage('');
      setError('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page p-6 mt-14 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>

      {/* Messages List */}
      <div className="messages-list mb-4 h-96 overflow-y-auto border p-4 rounded-lg">
        {loading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={msg._id || `temp-msg-${index}`}
              className={`message-item mb-2 p-2 rounded-lg ${
                msg.sender === userId ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
              }`}
            >
              <p className="text-sm">{msg.text || msg.content || <em className="text-red-500">[No text]</em>}</p>
              <small className="text-xs text-gray-500">
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleString()
                  : 'Just now'}
              </small>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        )}
        <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
      </div>

      {/* New Message Input */}
      <div className="message-form flex items-center gap-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={!conversationId}
        />
        <button
          onClick={sendMessage}
          disabled={!conversationId || !newMessage.trim()}
          className={`px-4 py-2 ${
            !conversationId || !newMessage.trim() 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-lg`}
        >
          Send
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ChatPage;