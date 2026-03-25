"use client";

import { useState, useRef, useEffect } from "react";
import { askAI } from "@/lib/gemini";

export default function ChatBotPremium() {
  const [disease, setDisease] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const prompt = `You are a professional AI doctor.

User condition (if any): ${disease || "None"}
User question: ${input}

Give:
- Safe medical advice
- Diet suggestion
- What to avoid
- Keep it short and simple
`;

    const aiResponse = await askAI(prompt);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: aiResponse },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-6">
      <div className="flex flex-col w-full max-w-lg h-[90vh] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-6">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
            CureMe AI 🩺
          </h1>
          <p className="text-gray-200 mt-1 text-sm">
            Your premium AI-powered health companion
          </p>
        </div>

        {/* Disease Selector */}
        <select
          className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white border border-white/30 appearance-none focus:ring-2 focus:ring-purple-400 transition"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
        >
          <option value="" className="text-black">
            Select Condition
          </option>
          <option value="Diabetes" className="text-black">
            Diabetes
          </option>
          <option value="PCOS" className="text-black">
            PCOS
          </option>
          <option value="Hypertension" className="text-black">
            Hypertension
          </option>
          <option value="Obesity" className="text-black">
            Obesity
          </option>
        </select>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl max-w-[80%] break-words ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white self-end shadow-lg"
                  : "bg-white/30 text-black backdrop-blur-md self-start shadow-md"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="p-3 rounded-2xl bg-white/30 backdrop-blur-md self-start animate-pulse shadow-md">
              CureMe is typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your health question..."
            className="flex-1 p-3 rounded-2xl bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:ring-2 focus:ring-purple-400 transition outline-none"
          />
          <button
            onClick={handleSend}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Send 🚀
          </button>
        </div>
      </div>
    </div>
  );
}