import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithExpert } from '../services/geminiService';
import { SendIcon, MicIcon } from './Icons';

const AgriChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Namaste! I am your agricultural expert. Ask me about crop diseases, fertilizers, or weather impacts.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const responseText = await chatWithExpert(messages, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const QuickPrompts = [
    "Treat rice blast?",
    "Best fertilizer for wheat?",
    "High moisture advice"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header for Chat (Desktop visual) */}
      <div className="bg-blue-600 text-white p-4 text-center font-medium md:text-left shadow-sm">
        Agriculture Expert AI
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        {/* Quick Prompts */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
          {QuickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(prompt)}
              className="whitespace-nowrap px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 hover:bg-blue-100 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <button className="p-3 rounded-full text-gray-500 hover:bg-gray-100 transition">
            <MicIcon />
          </button>
          <input 
            type="text" 
            className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask AI expert..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg disabled:opacity-50 disabled:shadow-none hover:bg-blue-700 transition"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgriChat;