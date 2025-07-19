import React, { useState, useEffect, useRef } from 'react';

const botAvatar = (
  <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-emerald-300/30">
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
    </svg>
  </span>
);

const userAvatar = (
  <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-slate-400/20">
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
    </svg>
  </span>
);

const App = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatContainerRef = useRef(null);

  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString());
    }
  }, [conversationId]);

  const sendMessage = async (event) => {
    if (event) event.preventDefault();
    if (message.trim() === '') return;
    setLoading(true);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { id: crypto.randomUUID(), sender: 'user', text: message },
    ]);
    
    
    // setTimeout(() => {
    //   setChatHistory((prevHistory) => [
    //     ...prevHistory,
    //     { id: crypto.randomUUID(), sender: 'ai', text: `Thanks for your message!` },
    //   ]);
    //   setMessage('');
    //   setLoading(false);
    // }, 1500);
    
    try {
      const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversation_id: conversationId }),
      });
      if (!response.ok) {
        let errorDetail = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorDetail = `Error from server: ${errorData.detail}`;
          }
        } catch (e) {}
        throw new Error(errorDetail);
      }
      const data = await response.json();
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { id: crypto.randomUUID(), sender: 'ai', text: data.response },
      ]);
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = error.message || 'An unknown error occurred.';
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = `Connection failed. Please ensure the backend server is running at ${API_URL}.`;
      }
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { id: crypto.randomUUID(), sender: 'ai', text: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setChatHistory([]);
    setConversationId(Date.now().toString());
    setMessage('');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-800 min-h-screen flex justify-center items-center p-2 sm:p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,249,154,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(5,150,105,0.15),transparent_50%)] pointer-events-none"></div>
      
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-500/20 flex flex-col relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-emerald-500/20 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-t-3xl relative">
          <div className="flex items-center gap-3">
            {botAvatar}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent tracking-tight">
                AI Assistant
              </h1>
              <p className="text-xs text-emerald-400/60">Always here to help</p>
            </div>
          </div>
          <button 
            onClick={handleNewChat} 
            className="text-emerald-400/60 hover:text-emerald-300 transition-all duration-300 p-2 rounded-xl hover:bg-emerald-500/10 group" 
            title="Start New Chat" 
            aria-label="Start New Chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        {/* Chat History */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto h-96 space-y-4 px-6 py-6 bg-gradient-to-b from-slate-900/60 to-slate-900/80 backdrop-blur-sm custom-scrollbar"
        >
          {chatHistory.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {msg.sender === 'ai' && botAvatar}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 text-sm leading-relaxed relative ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md shadow-emerald-500/25 hover:shadow-emerald-500/40'
                    : 'bg-gradient-to-r from-slate-700/80 to-slate-600/80 backdrop-blur-sm text-slate-100 rounded-bl-md border border-slate-600/30 hover:border-slate-500/50'
                }`}
              >
                {msg.sender === 'user' && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-sm"></div>
                )}
                <span className="relative z-10">{msg.text}</span>
              </div>
              {msg.sender === 'user' && userAvatar}
            </div>
          ))}
          {loading && (
            <div className="flex items-end gap-3 justify-start animate-fadeIn">
              {botAvatar}
              <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-gradient-to-r from-slate-700/60 to-slate-600/60 backdrop-blur-sm text-slate-100 shadow-lg border border-slate-600/30 rounded-bl-md">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-emerald-500/20 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-b-3xl">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              className="w-full p-3 pr-4 rounded-2xl border border-emerald-500/20 bg-slate-800/60 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 text-sm placeholder-slate-400 transition-all duration-300"
              placeholder="Type your message..."
              autoFocus
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none opacity-0 transition-opacity duration-300 focus-within:opacity-100"></div>
          </div>
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 text-white p-3 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-emerald-500/25 active:scale-95 relative group"
            disabled={loading || !message.trim()}
            aria-label="Send"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur group-hover:blur-md transition-all duration-300"></div>
            <svg className="w-5 h-5 relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #0d9488);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #34d399, #14b8a6);
        }
      `}</style>
    </div>
  );
};

export default App;