import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

const apiKey = "AIzaSyDB_b52eFnPSwPMuAIEcuPbcEHUnE7BZXQ";
const genAI = new GoogleGenerativeAI(apiKey);
console.log(apiKey);

let chatSession = null;

const initializeChat = () => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: "you are an expert in the field of Indian Educational system.Your job is to help students with what ever doubts they have on the system or about anything related to education",
  });
  console.log(model);
  chatSession = model.startChat({
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 4000,
      responseMimeType: "text/plain",
    },
    history: [],
  });
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatSession) {
      initializeChat();
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await chatSession.sendMessage(input);
      const response = result.response.text();
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center'>
      <div className="mt-4 rounded-xl flex flex-col h-[calc(100vh-9rem)] w-5/6 bg-gray-100 dark:bg-gray-800">
        <div className="flex-1 overflow-y-auto text-white p-4 space-y-4 dark:bg-gray-800 dark:[color-scheme:dark]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl p-4 rounded-2xl ${message.role === 'user'
                ? 'bg-gray-500 text-white dark:bg-gray-400  dark:text-black'
                : 'bg-white dark:bg-gray-700 dark:text-white'
                }`}>
                {message.role === 'user' ? (
    <div className='prose-sm'>
      {message.content}
    </div>
  ) : (
    <ReactMarkdown className="prose prose-sm dark:prose-invert">
      {message.content}
    </ReactMarkdown>
  )}
            </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-lg text-gray-800">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t rounded-xl bg-white dark:bg-gray-800 p-4 scrollbar-track-gray-600 scrollbar-thumb-black"
        >
          <div className="rounded-lg w-5/6 mx-auto flex gap-4 dark:bg-gray-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2 bg-gray-500 dark:bg-gray-400 text-white dark:text-black prose-sm rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
      </div>
      );
};

      export default ChatInterface;