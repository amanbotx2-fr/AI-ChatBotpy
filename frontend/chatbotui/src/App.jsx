import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const botAvatar = (
  <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.2"/><path d="M12 14c2.21 0 4-1.79 4-4V8a4 4 0 10-8 0v2c0 2.21 1.79 4 4 4zm-6 4a6 6 0 0112 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1z" fill="currentColor"/></svg>
  </span>
);
const userAvatar = (
  <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold shadow-md">
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.2"/><path d="M12 14c2.21 0 4-1.79 4-4V8a4 4 0 10-8 0v2c0 2.21 1.79 4 4 4zm-6 4a6 6 0 0112 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1z" fill="currentColor"/></svg>
  </span>
);

const App = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatContainerRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    event.preventDefault();
    if (message.trim() === '') return;
    setLoading(true);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { id: crypto.randomUUID(), sender: 'user', text: message },
    ]);
    try {
      const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversation_id: conversationId }),
      });
      if (!response.ok) {
        let errorDetail = `API Error: ${response.status} ${response.statusText}`;
        try {
          // Try to parse a more specific error message from the backend
          const errorData = await response.json();
          if (errorData.detail) {
            errorDetail = `Error from server: ${errorData.detail}`;
          }
        } catch (e) {
          // The response body was not JSON, stick with the status text
        }
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
      let errorMessage = error.message || 'An unknown error occurred. Please check the console.';
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
    // Generate a new ID to start a fresh conversation on the backend
    setConversationId(Date.now().toString());
    setMessage('');
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 min-h-screen flex justify-center items-center p-2 sm:p-4">
      <div className="w-full max-w-lg bg-zinc-950/90 rounded-2xl shadow-2xl p-0 sm:p-0 flex flex-col border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-zinc-800 bg-zinc-950 rounded-t-2xl">
          <div className="flex items-center gap-3">
            {botAvatar}
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">AI Chatbot</h1>
          </div>
          <button onClick={handleNewChat} className="text-zinc-400 hover:text-white transition-colors p-1 rounded-full hover:bg-zinc-800" title="Start New Chat" aria-label="Start New Chat">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>
        {/* Chat History */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto h-96 space-y-3 px-4 py-4 bg-zinc-950/80"
        >
          {chatHistory.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              {msg.sender === 'ai' && botAvatar}
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md transition-all text-base break-words ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-zinc-800 text-zinc-100 rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && userAvatar}
            </div>
          ))}
          {loading && (
            <div className="flex items-end gap-2 justify-start animate-fadeIn">
              {botAvatar}
              <div className="max-w-[75%] px-4 py-2 rounded-2xl bg-zinc-800 text-zinc-100 shadow-md animate-pulse">
                AI is typing...
              </div>
            </div>
          )}
        </div>
        {/* Input Area */}
        <form onSubmit={sendMessage} className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800 bg-zinc-950 rounded-b-2xl">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 rounded-xl border border-zinc-700 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="Type your message..."
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white p-2 rounded-full shadow-md disabled:opacity-50"
            disabled={loading || !message.trim()}
            aria-label="Send"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;