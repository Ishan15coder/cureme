"use client";

import { useState } from "react";
import { askAI } from "@/lib/gemini";

export default function Home() {
  const [disease, setDisease] = useState("");
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = async () => {
  if (!input.trim()) return;

  setResponse("Thinking... 🤔");

  const prompt = `
You are a professional AI doctor.

User condition (if any): ${disease || "None"}
User question: ${input}

Give:
- Safe medical advice
- Diet suggestion
- What to avoid
- Keep it short and simple
`;

  const res = await askAI(prompt);
  setResponse(res);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
       <h1 className="text-2xl font-bold text-white mb-4 text-center">
  CureMe AI 🩺
</h1>
    <p className="text-sm text-gray-200 text-center mb-4">
  Your AI-powered health companion
</p>
        <select
  className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none"
  value={disease}
  onChange={(e) => setDisease(e.target.value)}
>
  <option value="">Select Condition</option>
  <option value="Diabetes">Diabetes</option>
  <option value="PCOS">PCOS</option>
  <option value="Hypertension">Hypertension</option>
  <option value="Obesity">Obesity</option>
</select>

        <input
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none"
          placeholder="Ask your health question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
  onClick={handleAsk}
  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold hover:scale-105 transition-transform"
>
  Ask AI 🚀
</button>

        <div className="mt-4 p-4 rounded-lg bg-white/20 text-white min-h-[80px]">
  {response}
</div>
      </div>
    </div>
  );
}