import { useState } from 'react';

export default function ChatDock() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Parse messages like "from China hs 8703 value 20000" or "China hs 8703 value 20000"
  function parseMessage(text) {
    const re = /(?:from\s+)?([a-zA-Z\s]+)\s+hs\s+(\S+)\s+value\s+(\d+(\.\d+)?)/i;
    const match = text.match(re);
    if (match) {
      const origin = match[1].trim();
      const hs = match[2].trim();
      const value = match[3].trim();
      return { origin, hs_code: hs, value };
    }
    return null;
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((msgs) => [...msgs, { role: 'user', text: trimmed }]);
    setInput('');

    const parsed = parseMessage(trimmed);
    if (!parsed) {
      setMessages((msgs) => [
        ...msgs,
        {
          role: 'bot',
          text: "I didn't understand. Please use the format 'from China hs 8703 value 20000'.",
        },
      ]);
      return;
    }

    try {
      const query = new URLSearchParams(parsed).toString();
      const res = await fetch(`/api/calc?${query}`);
      const data = await res.json();
      if (res.ok) {
        const { hs_code, origin, baseRate, surchargeRate, duty, surcharge, total, source } = data;
        setMessages((msgs) => [
          ...msgs,
          {
            role: 'bot',
            text: `For HS ${hs_code} imported from ${origin}: Base duty (${baseRate}%): $${duty.toFixed(
              2
            )}, Surcharge (${surchargeRate}%): $${surcharge.toFixed(
              2
            )}. Total: $${total.toFixed(2)}. Source: ${source}`,
          },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { role: 'bot', text: `Error: ${data.error || 'Unknown error'}` },
        ]);
      }
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { role: 'bot', text: 'Server error. Please try again later.' },
      ]);
    }
  }

  return (
    <div className="p-2 border rounded-lg h-full flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          className="flex-1 border p-2 rounded"
          placeholder="from China hs 8703 value 20000"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
