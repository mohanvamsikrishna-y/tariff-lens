import { useState } from 'react';

export default function ChatDock() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { sender: 'user', text: trimmed };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    try {
      const res = await fetch(`/api/calc?message=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      const botMsg = { sender: 'bot', text: data.answer || 'Sorry, I could not compute that.' };
      setMessages((msgs) => [...msgs, botMsg]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Error contacting server.' }]);
    }
  };

  return (
    <div className="flex flex-col h-full border-l border-gray-200 p-4">
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${msg.sender === 'user' ? 'bg-gray-200' : 'bg-white'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-gray-300 text-gray-800 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}
