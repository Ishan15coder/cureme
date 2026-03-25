"use client";

import { useState, useRef, useEffect } from "react";
import { askAI } from "@/lib/gemini";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBotPremium() {
  const [disease, setDisease] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
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
    setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    setLoading(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-6">
      {/* ...rest of JSX unchanged */}
      <div className="flex flex-col w-full max-w-lg h-[90vh] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-6">
        {/* Header, select, chat area, input box */}
      </div>
    </div>
  );
}