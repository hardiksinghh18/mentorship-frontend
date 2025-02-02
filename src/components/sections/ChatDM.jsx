import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FaPaperPlane, FaRegSmile } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5';

const ChatDM = () => {
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState([]);
  const { id } = useParams();
  
  // Declare socket here, so it can be initialized inside useEffect
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish WebSocket connection
    const socketConnection = io(process.env.REACT_APP_BACKEND_BASE_URL, {
      // transports: ['websocket'], // Ensure both WebSocket and polling
      withCredentials: true,
    });

    setSocket(socketConnection);

    // Debugging WebSocket connection
    socketConnection.on('connect', () => {
      console.log('Socket connected:', socketConnection.id);
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Set up listener for incoming messages
    socketConnection.on('receiveMessage', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // Clean up socket connection on unmount
    return () => {
      socketConnection.off('receiveMessage');
      socketConnection.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const chatMessage = { senderId: user?.id, receiverId: id, createdAt: new Date().toISOString(), message };

        if (socket) {
          console.log('Sending message:', chatMessage);
          socket.emit('sendMessage', chatMessage);
        } else {
          console.error('Socket not connected');
        }

        await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/chat/send`, chatMessage);
        setMessage('');
      } catch (error) {
        console.log('Error sending message:', error);
      }
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/chat/${user?.id}/${id}`);
      setMessages(response?.data);
    } catch (error) {
      console.log('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/${id}`);
      setReceiver(response?.data.user);
    } catch (error) {
      console.log('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full my-10 max-w-2xl bg-[#0e0e0e] rounded-xl shadow-xl overflow-hidden">
        {/* Header with Receiver's name and profile */}
        <div className="flex items-center p-4 bg-gray-900">
          <Link to={'/messages'} className="text-gray-400 mr-4 hover:text-blue-500 transition-all text-3xl">
            <IoArrowBack />
          </Link>
          <Link to={`/profile/${receiver?.username}`} className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full text-xl font-bold text-white">
              {receiver?.username?.charAt(0).toUpperCase()}
            </div>
            <h2 className="ml-4 text-xl font-bold text-white">{receiver?.username || receiver?.fullName}</h2>
          </Link>
        </div>

        {/* Messages Section */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages?.length > 0 ? messages?.map((msg, index) => (
            <div key={index} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
              <div className={`text-[.6rem] text-gray-400 ${msg.senderId === user?.id ? 'right-2' : 'left-2'}`}>
                {formatTime(msg.createdAt)}
              </div>
              <div className={`relative max-w-xs px-4 py-1 rounded-2xl text-white ${msg.senderId === user?.id ? 'bg-blue-600' : 'bg-gray-700'}`}>
                <p>{msg.message}</p>
              </div>
            </div>
          )) : (
            <div className="w-full h-full text-gray-600 flex justify-center items-center">
              Start a new conversation
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="flex items-center p-4 bg-gray-800 rounded-b-xl">
          <button className="text-gray-400 hover:text-white transition duration-200">
            <FaRegSmile size={24} />
          </button>
          <input
            type="text"
            className="ml-2 w-full p-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="ml-3 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:bg-gradient-to-l transition duration-200"
            onClick={sendMessage}
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDM;
