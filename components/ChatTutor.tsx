import React, { useState, useRef, useEffect } from 'react';
import { getTutorClient } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Button } from './Button';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { Chat } from "@google/genai";

export const ChatTutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your Gemini English Tutor. I can help you with grammar, vocabulary, or just have a conversation. What would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to persist the chat session across renders, initialized lazily
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initChat = () => {
      const client = getTutorClient();
      return client.chats.create({
        model: "gemini-2.0-flash",
        config: {
            systemInstruction: "You are an expert English tutor. You are helpful, patient, and correct mistakes politely. Explain grammar rules clearly if asked.",
        }
      });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
          chatSessionRef.current = initChat();
      }

      const response = await chatSessionRef.current.sendMessage({
          message: userMsg.text
      });

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm having trouble thinking of a response.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered a connection error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-indigo-600 text-white flex items-center gap-3">
         <div className="p-2 bg-white/20 rounded-lg">
             <Bot className="h-6 w-6" />
         </div>
         <div>
             <h2 className="font-bold">Gemini 3 Tutor</h2>
             <p className="text-xs text-indigo-100 flex items-center gap-1">
                 <Sparkles className="h-3 w-3" /> Online
             </p>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
              {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
              <span className={`text-[10px] mt-2 block opacity-70 ${msg.role === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                 <Bot size={20} />
             </div>
             <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or practice a phrase..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all"
        />
        <Button type="submit" disabled={!input.trim() || isLoading} className="rounded-xl aspect-square px-0 w-12 flex items-center justify-center">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};