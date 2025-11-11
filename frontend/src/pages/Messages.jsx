import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext.jsx";
import { useLocation, useSearchParams } from "react-router-dom";
import { messagesAPI } from "../utils/messagesAPI";
import { io } from "socket.io-client";
import API from "../utils/api";

const Messages = ({ userType = "student" }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get('userId');
  const initialConversation = location.state?.selectedConversation || null;
  const [selectedConversation, setSelectedConversation] = useState(initialConversation);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userNames, setUserNames] = useState({}); // Store user names by ID
  const socketRef = useRef(null);
  const { user } = useAuth();
  const [emailInput, setEmailInput] = useState("");
  const [creating, setCreating] = useState(false);
  const hasHandledUrlParam = useRef(false);

  // Fetch user names for conversations
  const fetchUserName = async (userId) => {
    if (!userId) return null;
    if (userNames[userId]) return userNames[userId];
    
    try {
      const res = await API.get(`/user/${userId}`);
      const name = res.data?.data?.name || res.data?.name || 'Unknown User';
      setUserNames(prev => ({ ...prev, [userId]: name }));
      return name;
    } catch (error) {
      console.error('Failed to fetch user name:', error);
      return 'Unknown User';
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await messagesAPI.getConversations();
      const list = (res.data?.conversations || res.conversations || []);
      
      // Fetch names for users that don't have names from backend
      const namePromises = list.map(async (c) => {
        if (c.otherUserName) {
          return c.otherUserName;
        }
        return await fetchUserName(c.otherUserId);
      });
      const names = await Promise.all(namePromises);
      
      const mapped = list.map((c, index) => {
        const userName = names[index] || 'Unknown User';
        return {
          _id: c._id,
          name: userName,
          avatar: userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          lastMessage: c.lastMessage?.content || "",
          time: new Date(c.updatedAt).toLocaleTimeString(),
          unread: 0,
          online: false,
          project: "",
          otherUserId: c.otherUserId,
        };
      });
      setConversations(mapped);
      if (mapped.length > 0 && !selectedConversation) setSelectedConversation(mapped[0]._id);
    } catch (e) {
      console.error("Failed to load conversations", e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (socketRef.current) return;
    const token = localStorage.getItem('authToken');
    
    // Use the same backend URL logic as API
    const SOCKET_URL = import.meta.env.VITE_API_URL || 
      (import.meta.env.DEV 
        ? "http://localhost:5000" 
        : "https://student-freelance-platform-2.onrender.com");
    
    console.log('Connecting to Socket.IO at:', SOCKET_URL);
    const s = io(SOCKET_URL, { auth: { token } });
    socketRef.current = s;
  }, []);

  // Handle userId from URL parameter (when clicking Message from applications)
  useEffect(() => {
    if (!userIdFromUrl || hasHandledUrlParam.current) return;
    
    hasHandledUrlParam.current = true;
    
    const createConversationFromUrl = async () => {
      setCreating(true);
      try {
        console.log('Creating conversation with userId from URL:', userIdFromUrl);
        const convoRes = await messagesAPI.createOrGetConversation(userIdFromUrl);
        const convoId = convoRes.data?.conversation?._id || convoRes.conversation?._id;
        
        console.log('Conversation created/retrieved:', convoId);
        
        // Refresh conversations list
        await fetchConversations();
        
        // Select the new/existing conversation
        if (convoId) {
          setSelectedConversation(convoId);
        }
      } catch (error) {
        console.error('Failed to create conversation from URL:', error);
      } finally {
        setCreating(false);
      }
    };
    
    createConversationFromUrl();
  }, [userIdFromUrl]);

  useEffect(() => {
    const s = socketRef.current;
    if (!s || !selectedConversation) return;

    s.emit('join_conversation', selectedConversation);

    const handleNew = (msg) => {
      if (msg.conversation?.toString() !== selectedConversation?.toString()) return;
      setChatMessages((prev) => [...prev, msg]);
    };
    s.on('message:new', handleNew);

    (async () => {
      try {
        const res = await messagesAPI.getMessages(selectedConversation);
        const list = res.data?.messages || res.messages || [];
        setChatMessages(list);
      } catch (e) {
        console.error("Failed to load messages", e);
      }
    })();

    return () => {
      s.emit('leave_conversation', selectedConversation);
      s.off('message:new', handleNew);
    };
  }, [selectedConversation]);

  const selectedChat = conversations.find(conv => (conv._id || conv.id) === selectedConversation) || null;

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      await messagesAPI.sendMessage(selectedConversation, newMessage.trim());
      setNewMessage("");
    } catch (e) {
      console.error("Send message failed", e);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout userType={userType}>
      <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border flex">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <p className="text-sm text-gray-500">
              {conversations.filter(c => c.unread > 0).length} unread conversations
            </p>
          </div>

          {/* Search & Start Chat */}
          <div className="p-4 border-b space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={userType === 'student' ? "Enter client email" : "Enter student email"}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={async () => {
                  if (!emailInput.trim()) return;
                  setCreating(true);
                  try {
                    const res = await API.get('/user/by-email', { params: { email: emailInput.trim() } });
                    const otherUserId = res.data?.data?.user?._id || res.data?.user?._id;
                    if (!otherUserId) throw new Error('User not found');

                    const convoRes = await messagesAPI.createOrGetConversation(otherUserId);
                    const convoId = convoRes.data?.conversation?._id || convoRes.conversation?._id;

                    // Refresh conversations list with names
                    await fetchConversations();
                    
                    if (convoId) setSelectedConversation(convoId);
                    setEmailInput("");
                  } catch (e) {
                    console.error('Failed to start conversation', e);
                    alert(e.message || 'Failed to start conversation. Please check the email address.');
                  } finally {
                    setCreating(false);
                  }
                }}
                disabled={!emailInput.trim() || creating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {creating ? 'Starting...' : 'Start Chat'}
              </button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation._id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation._id ? "bg-indigo-50 border-indigo-200" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">{conversation.project}</p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate flex-1">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{selectedChat.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Project: {selectedChat.project}</span>
                      <span>•</span>
                      <span className={selectedChat.online ? "text-green-600" : "text-gray-400"}>
                        {selectedChat.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${(message.sender?.toString?.() === user?.id) ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender?.toString?.() === user?.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender?.toString?.() === user?.id ? "text-indigo-200" : "text-gray-500"
                      }`}>
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-end gap-3">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      rows="1"
                    />
                  </div>

                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No conversation selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💡</span>
            <h3 className="font-medium text-gray-900">Communication Tips</h3>
          </div>
          <p className="text-sm text-gray-600">
            Be clear and professional in your messages. Ask questions if project requirements are unclear.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚡</span>
            <h3 className="font-medium text-gray-900">Quick Responses</h3>
          </div>
          <p className="text-sm text-gray-600">
            Respond to messages within 24 hours to maintain good client relationships.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔒</span>
            <h3 className="font-medium text-gray-900">Stay Safe</h3>
          </div>
          <p className="text-sm text-gray-600">
            Keep all communication on the platform. Never share personal contact information.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
