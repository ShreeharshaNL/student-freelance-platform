import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

const Messages = ({ userType = "student" }) => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: userType === "student" ? "TechCorp India" : "Shreeharsha N L",
      avatar: userType === "student" ? "TC" : "SH",
      lastMessage: "Great! I'll start working on the project today.",
      time: "2 min ago",
      unread: 2,
      online: true,
      project: "WordPress Blog Setup"
    },
    {
      id: 2,
      name: userType === "student" ? "Small Business Owner" : "Rahul Kumar", 
      avatar: userType === "student" ? "SB" : "RK",
      lastMessage: "Can you share some examples of your previous work?",
      time: "1 hour ago",
      unread: 0,
      online: false,
      project: "Simple Business Website"
    },
    {
      id: 3,
      name: userType === "student" ? "Fitness Trainer" : "Sneha Patel",
      avatar: userType === "student" ? "FT" : "SP",
      lastMessage: "The designs look amazing! Thanks for the quick delivery.",
      time: "3 hours ago",
      unread: 0,
      online: true,
      project: "Instagram Post Designs"
    },
    {
      id: 4,
      name: userType === "student" ? "Food Blogger" : "Amit Singh",
      avatar: userType === "student" ? "FB" : "AS",
      lastMessage: "When can we schedule a call to discuss the requirements?",
      time: "1 day ago",
      unread: 1,
      online: false,
      project: "Blog Content Writing"
    }
  ];

  // Mock messages data
  const messages = {
    1: [
      {
        id: 1,
        sender: userType === "student" ? "client" : "student",
        content: "Hi! I saw your application for the WordPress blog project. I'm impressed with your portfolio.",
        time: "10:30 AM",
        date: "Today"
      },
      {
        id: 2,
        sender: userType === "student" ? "student" : "client",
        content: "Thank you! I'm really excited about this project. I have experience with similar blog setups.",
        time: "10:35 AM",
        date: "Today"
      },
      {
        id: 3,
        sender: userType === "student" ? "client" : "student",
        content: "That's perfect! Can you give me an estimate of how long this will take?",
        time: "10:40 AM",
        date: "Today"
      },
      {
        id: 4,
        sender: userType === "student" ? "student" : "client",
        content: "I can complete the basic setup in 3-4 days, including theme customization and SEO optimization.",
        time: "10:45 AM",
        date: "Today"
      },
      {
        id: 5,
        sender: userType === "student" ? "client" : "student",
        content: "Sounds great! I'd like to hire you for this project. I'll send you the project details and requirements.",
        time: "11:00 AM",
        date: "Today"
      },
      {
        id: 6,
        sender: userType === "student" ? "student" : "client",
        content: "Great! I'll start working on the project today.",
        time: "11:02 AM",
        date: "Today"
      }
    ]
  };

  const selectedChat = conversations.find(conv => conv.id === selectedConversation);
  const chatMessages = messages[selectedConversation] || [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      console.log("Sending message:", newMessage);
      setNewMessage("");
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

          {/* Search */}
          <div className="p-4 border-b">
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
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? "bg-indigo-50 border-indigo-200" : ""
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
                    className={`flex ${message.sender === "student" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "student"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === "student" ? "text-indigo-200" : "text-gray-500"
                      }`}>
                        {message.time}
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
