import { useState } from 'react';

export default function ChatDock() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const parseMessage = (text) => {
    const lower = text.toLowerCase();
    const originMatch = lower.match(/from\s+([a-z\s]+)/);
    const hsMatch = lower.match(/hs\s*([0-9]{4,6})/);
    const valueMatch =
      lower.match(/value\s*\$?\s*([0-9.,]+)/) ||
      lower.match(/\$\s*([0-9.,]+)/);
    const origin = originMatch ? originMatch[1].trim() : '';
    const hs_code = hsMatch ? hsMatch[1].trim() : '';
    let value = 0;
    if (valueMatch) {
      value = parseFloat(valueMatch[1].replace(/,/g, ''));
    }
    return { origin, hs_code, value };
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { sender: 'user', text: trimmed };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    try {
      const { origin, hs_code, value } = parseMessage(trimmed);
      let url = '';
      if (origin && hs_code && value) {
        url = `/api/calc?origin=${encodeURIComponent(origin)}&hs_code=${encodeURIComponent(hs_code)}&value=${value}`;
      } else {
        url = `/api/calc?message=${encodeURIComponent(trimmed)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      let botText = '';
      if (data.total !== undefined) {
        const hsDisplay = data.hs || hs_code;
        botText = `Importing HS ${hsDisplay} from ${data.origin.toUpperCase()} valued at $${data.value.toFixed(2)} results in duties of $${data.duty.toFixed(2)} and surcharges of $${data.surcharge.toFixed(2)}, for a total cost of $${data.total.toFixed(2)}.`;
      } else if (data.response || data.answer) {
        botText = data.response || data.answer;
      } else {
        botText = 'Sorry, I could not compute that.';
      }
      const botMsg = { sender: 'bot', text: botText };
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
          className="flex-1 border p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about importing a product…"
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button
          className="border p-2 rounded-r bg-blue-500 text-white"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
