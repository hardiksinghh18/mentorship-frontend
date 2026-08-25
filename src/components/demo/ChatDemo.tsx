import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';

interface Message {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  fullName: string;
  username: string;
  bio: string;
  messages: Message[];
}

const ChatDemo: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'sarahj',
      fullName: 'Sarah Jenkins',
      username: 'sarahj',
      bio: 'Staff Engineer at Stripe. Frontend performance lead.',
      messages: [
        {
          senderId: 'sarahj',
          senderName: 'Sarah Jenkins',
          text: "Hi there! I saw you checked out my 'React Architecture & Design Systems' track. Do you have any questions about the syllabus?",
          timestamp: new Date(Date.now() - 3600000)
        }
      ]
    },
    {
      id: 'aravinds',
      fullName: 'Aravind Swamy',
      username: 'aravinds',
      bio: 'Frontend developer eager to master components architecture.',
      messages: [
        {
          senderId: 'aravinds',
          senderName: 'Aravind Swamy',
          text: 'Hey! I just submitted an application to join your Product Management course. Excited to collaborate!',
          timestamp: new Date(Date.now() - 7200000)
        }
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState('sarahj');
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeConv.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      senderId: 'currentUser',
      senderName: 'You',
      text: inputText,
      timestamp: new Date()
    };

    // Append user message
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          messages: [...c.messages, userMessage]
        };
      }
      return c;
    }));

    setInputText('');

    // Trigger auto-reply bot after 1 second
    setTimeout(() => {
      let replyText = '';
      if (activeConvId === 'sarahj') {
        replyText = "That's a great question! In Lesson 2, we actually look at concrete bundle splittings and Suspense boundaries. I can show you some real-world production profiles from Stripe.";
      } else {
        replyText = "Awesome! I've been working on scoping OKRs. Let's catch up during the scheduled Google Meet check-in today!";
      }

      const botMessage: Message = {
        senderId: activeConv.id,
        senderName: activeConv.fullName,
        text: replyText,
        timestamp: new Date()
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: [...c.messages, botMessage]
          };
        }
        return c;
      }));
    }, 1000);
  };

  return (
    <div className="flex h-[500px] border border-zinc-200 bg-white rounded-[24px] overflow-hidden text-left shadow-xs animate-in fade-in duration-300">
      
      {/* Sidebar - Conversations list (w-1/3) */}
      <div className="w-1/3 bg-zinc-50 border-r border-zinc-200 flex flex-col">
        <div className="p-4 border-b border-zinc-200">
          <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest leading-none">
            Active Chats
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {conversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            const lastMsg = conv.messages[conv.messages.length - 1];

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-4 cursor-pointer transition-colors text-left flex flex-col gap-1 ${
                  isActive ? 'bg-white' : 'hover:bg-zinc-100/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-zinc-900 truncate leading-tight">
                    {conv.fullName}
                  </span>
                  <span className="text-[8px] text-zinc-400 font-mono">
                    {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 truncate leading-normal">
                  {lastMsg ? lastMsg.text : conv.bio}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main chat view (w-2/3) */}
      <div className="w-2/3 flex flex-col bg-white">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-zinc-900 leading-tight">
              {activeConv.fullName}
            </h4>
            <span className="text-[9px] text-zinc-400 font-semibold mt-0.5">
              Active Member
            </span>
          </div>
        </div>

        {/* Messages list area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeConv.messages.map((msg, index) => {
            const isMe = msg.senderId === 'currentUser';
            return (
              <div
                key={index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[9px] text-zinc-455 font-bold mb-1">{msg.senderName}</span>
                <div
                  className={`px-4 py-2.5 rounded-[18px] text-xs font-medium max-w-[80%] leading-relaxed break-words ${
                    isMe
                      ? 'bg-zinc-950 text-white rounded-tr-none'
                      : 'bg-zinc-100 text-zinc-900 rounded-tl-none border border-zinc-150'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-250 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-all"
          />
          <button
            type="submit"
            className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center hover:bg-zinc-800 active:scale-[0.95] transition-all shrink-0"
          >
            <FiSend className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatDemo;
