"use client";

import { useState, useRef, useEffect } from "react";
import { askAI } from "@/lib/gemini";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CONDITIONS = [
  { value: "", label: "No Condition Selected", icon: "◎" },
  { value: "Diabetes", label: "Diabetes", icon: "🩸" },
  { value: "PCOS", label: "PCOS", icon: "🌸" },
  { value: "Hypertension", label: "Hypertension", icon: "💓" },
  { value: "Obesity", label: "Obesity", icon: "⚖️" },
];

function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/^([A-Za-z][^:\n]+):$/gm, "<strong>$1:</strong>")
    .replace(/^- (.+)/gm, "<li>$1</li>")
    .replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/gs, (match) => `<ul>${match}</ul>`)
    .replace(/\n{2,}/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

export default function ChatBotPremium() {
  const [disease, setDisease] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const prompt = `You are CureMe, a warm and knowledgeable AI health assistant.

${disease ? `The user has: ${disease}.` : ""}
User asks: "${input}"

Reply rules:
- Use **bold** for section headers
- Use - bullet points for lists
- Only include sections that are relevant to the question
- If the question is simple, give a simple answer — don't force all sections
- Max 120 words
- Tone: clear, caring, non-alarming
- End with one short disclaimer line in italics like: *Always consult your doctor for personalized advice.*

Respond now:`;

    try {
      const aiResponse = await askAI(prompt);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. ❌" },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const selected = CONDITIONS.find((c) => c.value === disease) || CONDITIONS[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cure-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #06060e;
          font-family: 'Sora', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .cure-root::before,
        .cure-root::after {
          content: '';
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .cure-root::before {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #2d0a6e55 0%, transparent 70%);
          top: -150px; left: -150px;
          animation: drift1 12s ease-in-out infinite alternate;
        }
        .cure-root::after {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #0a3d6255 0%, transparent 70%);
          bottom: -100px; right: -100px;
          animation: drift2 14s ease-in-out infinite alternate;
        }

        @keyframes drift1 {
          from { transform: translate(0, 0); }
          to   { transform: translate(80px, 60px); }
        }
        @keyframes drift2 {
          from { transform: translate(0, 0); }
          to   { transform: translate(-60px, -80px); }
        }

        /* PANEL */
        .cure-panel {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          height: 92vh;
          max-height: 800px;
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          overflow: hidden;
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 32px 80px rgba(0,0,0,0.7),
            0 0 80px rgba(90,40,200,0.12);
          margin: 20px;
        }

        .cure-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(160,100,255,0.6), rgba(60,180,255,0.6), transparent);
          z-index: 2;
        }

        /* DESKTOP: horizontal split */
        @media (min-width: 1024px) {
          .cure-panel {
            flex-direction: row;
            max-width: 1100px;
            width: 95vw;
            height: 85vh;
            max-height: 700px;
          }
        }

        /* SIDEBAR */
        .cure-sidebar {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        @media (min-width: 1024px) {
          .cure-sidebar {
            width: 260px;
            border-bottom: none;
            border-right: 1px solid rgba(255,255,255,0.06);
            height: 100%;
          }
        }

        /* MAIN */
        .cure-main {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          height: 100%;
        }

        /* Header */
        .cure-header {
          padding: 24px 28px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .cure-logo {
          width: 44px; height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 4px 20px rgba(124,58,237,0.4);
          flex-shrink: 0;
        }

        .cure-header-text h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.4rem;
          color: #fff;
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .cure-header-text p {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
          margin-top: 3px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .cure-status {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
        }
        .cure-status-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Condition selector */
        .cure-condition-wrap {
          padding: 14px 20px;
          flex-shrink: 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }

        .cure-condition-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 8px;
        }

        .cure-condition-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .cure-condition-btn:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.2);
        }
        .cure-condition-btn span:last-child {
          margin-left: auto;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
          transition: transform 0.2s;
        }
        .cure-condition-btn.open span:last-child {
          transform: rotate(180deg);
        }

        .cure-condition-dropdown {
          position: absolute;
          left: 20px; right: 20px;
          top: calc(100% - 4px);
          background: #13121f;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          overflow: hidden;
          z-index: 10;
          box-shadow: 0 16px 40px rgba(0,0,0,0.6);
          animation: slideDown 0.18s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cure-condition-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          cursor: pointer;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          transition: background 0.15s;
        }
        .cure-condition-option:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .cure-condition-option.active { color: #a78bfa; background: rgba(124,58,237,0.12); }

        /* Chat area */
        .cure-chat {
          flex: 1;
          overflow-y: auto;
          padding: 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scroll-behavior: smooth;
        }
        .cure-chat::-webkit-scrollbar { width: 4px; }
        .cure-chat::-webkit-scrollbar-track { background: transparent; }
        .cure-chat::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .cure-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: rgba(255,255,255,0.2);
          text-align: center;
          padding: 40px 20px;
        }
        .cure-empty-icon {
          font-size: 2.5rem;
          opacity: 0.4;
        }
        .cure-empty h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.3);
        }
        .cure-empty p {
          font-size: 0.75rem;
          line-height: 1.6;
          max-width: 220px;
        }

        /* Suggestion chips */
        .cure-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 8px;
        }
        .cure-chip {
          padding: 6px 12px;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 20px;
          color: #a78bfa;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Sora', sans-serif;
        }
        .cure-chip:hover {
          background: rgba(124,58,237,0.3);
          transform: translateY(-1px);
        }

        /* Bubbles */
        .cure-bubble-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .cure-bubble-row.user { justify-content: flex-end; }
        .cure-bubble-row.assistant { justify-content: flex-start; }

        .cure-avatar {
          width: 28px; height: 28px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .cure-avatar.ai {
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          box-shadow: 0 2px 12px rgba(124,58,237,0.4);
        }

        .cure-bubble {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 0.82rem;
          line-height: 1.65;
          word-break: break-word;
          animation: bubbleIn 0.25s ease;
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cure-bubble.user {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          border-bottom-right-radius: 5px;
          box-shadow: 0 4px 20px rgba(124,58,237,0.35);
        }

        .cure-bubble.assistant {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.88);
          border-bottom-left-radius: 5px;
        }

        /* Markdown formatting */
        .cure-bubble strong {
          color: #c4b5fd;
          font-weight: 600;
        }
        .cure-bubble.user strong {
          color: rgba(255,255,255,0.95);
        }
        .cure-bubble ul {
          margin: 6px 0 6px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cure-bubble li {
          list-style: disc;
          line-height: 1.6;
        }

        /* Typing indicator */
        .cure-typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          border-bottom-left-radius: 5px;
          width: fit-content;
        }
        .cure-typing span {
          width: 6px; height: 6px;
          background: rgba(255,255,255,0.5);
          border-radius: 50%;
          animation: bounce 1.2s ease-in-out infinite;
        }
        .cure-typing span:nth-child(2) { animation-delay: 0.2s; }
        .cure-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%,60%,100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }

        /* Input */
        .cure-input-wrap {
          padding: 14px 16px 18px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .cure-input-row {
          display: flex;
          gap: 10px;
          align-items: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 6px 6px 6px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cure-input-row:focus-within {
          border-color: rgba(124,58,237,0.5);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        .cure-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          padding: 6px 0;
        }
        .cure-input::placeholder { color: rgba(255,255,255,0.25); }

        .cure-send-btn {
          width: 40px; height: 40px;
          border-radius: 11px;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          transition: all 0.2s;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(124,58,237,0.4);
        }
        .cure-send-btn:hover:not(:disabled) {
          transform: scale(1.06);
          box-shadow: 0 6px 20px rgba(124,58,237,0.55);
        }
        .cure-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .cure-footer-note {
          text-align: center;
          font-size: 0.62rem;
          color: rgba(255,255,255,0.2);
          margin-top: 8px;
          letter-spacing: 0.03em;
        }
      `}</style>

      <div className="cure-root">
        <div className="cure-panel">

          {/* ── SIDEBAR ── */}
          <div className="cure-sidebar">

            <div className="cure-header">
              <div className="cure-logo">🩺</div>
              <div className="cure-header-text">
                <h1>CureMe AI</h1>
                <p>AI Health Companion</p>
              </div>
              <div className="cure-status">
                <div className="cure-status-dot" />
                Online
              </div>
            </div>

            <div className="cure-condition-wrap">
              <div className="cure-condition-label">Your Condition</div>
              <button
                className={`cure-condition-btn ${conditionOpen ? "open" : ""}`}
                onClick={() => setConditionOpen((v) => !v)}
              >
                <span>{selected.icon}</span>
                <span>{selected.label}</span>
                <span>▾</span>
              </button>

              {conditionOpen && (
                <div className="cure-condition-dropdown">
                  {CONDITIONS.map((c) => (
                    <div
                      key={c.value}
                      className={`cure-condition-option ${disease === c.value ? "active" : ""}`}
                      onClick={() => {
                        setDisease(c.value);
                        setConditionOpen(false);
                      }}
                    >
                      <span>{c.icon}</span>
                      <span>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
          {/* ── END SIDEBAR ── */}

          {/* ── MAIN ── */}
          <div className="cure-main">

            <div className="cure-chat">
              {messages.length === 0 && !loading ? (
                <div className="cure-empty">
                  <div className="cure-empty-icon">✦</div>
                  <h3>How can I help you?</h3>
                  <p>Ask anything about your health, symptoms, or diet.</p>
                  <div className="cure-chips">
                    {["What should I eat?", "Any side effects?", "Daily routine tips"].map((q) => (
                      <button
                        key={q}
                        className="cure-chip"
                        onClick={() => setInput(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`cure-bubble-row ${msg.role}`}>
                      {msg.role === "assistant" && (
                        <div className="cure-avatar ai">✦</div>
                      )}
                      <div className={`cure-bubble ${msg.role}`}>
                        <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="cure-bubble-row assistant">
                      <div className="cure-avatar ai">✦</div>
                      <div className="cure-typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="cure-input-wrap">
              <div className="cure-input-row">
                <input
                  className="cure-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask your health question…"
                />
                <button
                  className="cure-send-btn"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                >
                  ↑
                </button>
              </div>
              <div className="cure-footer-note">
                For informational purposes only · Not a substitute for professional advice
              </div>
            </div>

          </div>
          {/* ── END MAIN ── */}

        </div>
      </div>
    </>
  );
}