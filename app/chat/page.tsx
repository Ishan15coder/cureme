"use client";

import { useState, useRef, useEffect } from "react";
import { askAI } from "@/lib/gemini";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { deleteDoc, getDocs } from "firebase/firestore";
import {
  getFirestore, doc, getDoc,
  collection, addDoc, query,
  orderBy, onSnapshot, serverTimestamp
} from "firebase/firestore";
import { Circle, Droplets, Flower2, Heart, Scale } from "lucide-react";

// ── Firebase config ───────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyA0DHyKzIoQpQSVi2KU1AgA7mOrcxMsDiM",
  authDomain: "cureme-ed6d7.firebaseapp.com",
  projectId: "cureme-ed6d7",
  storageBucket: "cureme-ed6d7.firebasestorage.app",
  messagingSenderId: "495173236710",
  appId: "1:495173236710:web:6bea8835762bdf70618827",
  measurementId: "G-DRFWEELWCK",
};

// FIX 1: app must be initialised BEFORE db is created
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app); // was declared before app — moved here

// ── Types ─────────────────────────────────────────────────────────────────────
type Message = { role: "user" | "assistant"; content: string };
type Condition = { value: string; label: string; icon: React.ReactNode };

const CONDITIONS: Condition[] = [
  { value: "", label: "No Condition Selected", icon: <Circle size={15} strokeWidth={1.5} color="rgba(255,255,255,0.4)" /> },
  { value: "Diabetes", label: "Diabetes", icon: <Droplets size={15} strokeWidth={1.5} color="#f87171" /> },
  { value: "PCOS", label: "PCOS", icon: <Flower2 size={15} strokeWidth={1.5} color="#e879a0" /> },
  { value: "Hypertension", label: "Hypertension", icon: <Heart size={15} strokeWidth={1.5} color="#fb923c" /> },
  { value: "Obesity", label: "Obesity", icon: <Scale size={15} strokeWidth={1.5} color="#a78bfa" /> },
];

function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/^([A-Za-z][^:\n]+):$/gm, "<strong>$1:</strong>")
    .replace(/^- (.+)/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)(\s*<li>[\s\S]*?<\/li>)*/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n{2,}/g, "<br/>")
    .replace(/\n/g, " ");
}
export default function ChatBotPremium() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [disease, setDisease] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // FIX 2: onAuthStateChanged callback must be async to use await inside it
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthReady(true);
      if (u) {
        // FIX 3: profile fetch was outside the if(u) guard — would crash if u is null
        const snap = await getDoc(doc(db, "profiles", u.uid));
        if (snap.exists()) setProfile(snap.data());
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".user-menu")) setDropdownOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    if (!user) return;

    // Real-time listener — loads history and stays in sync
    const q = query(
      collection(db, "chats", user.uid, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const loaded: Message[] = snapshot.docs.map((doc) => ({
        role: doc.data().role,
        content: doc.data().content,
      }));
      setMessages(loaded);
      setHistoryLoaded(true);
    });

    return () => unsub();
  }, [user]);

  const getInitials = (u: User) => {
    if (u.displayName) {
      const parts = u.displayName.trim().split(" ");
      return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0];
    }
    return u.email?.[0]?.toUpperCase() ?? "?";
  };

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = "/";
  };
  const handleClearChat = async () => {
    if (!user) return;
    const q = query(collection(db, "chats", user.uid, "messages"));
    const snapshot = await getDocs(q);
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
    setMessages([]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to Firestore
    if (user) {
      await addDoc(collection(db, "chats", user.uid, "messages"), {
        role: "user",
        content: input,
        timestamp: serverTimestamp(),
      });
    }
    setInput("");
    setLoading(true);
    const prompt = `You are CureMe, an expert AI health companion with the warmth of a trusted family doctor and the precision of a specialist. You have years of experience helping patients with chronic conditions live better lives.

PERSONALITY:
- Warm and empathetic — you genuinely care about this person
- Direct and confident — you don't hedge everything with "maybe" or "possibly"
- Slightly personal — use the user's profile data naturally in conversation, not robotically
- Encouraging — always end on a positive, actionable note
- Never preachy — give advice once, don't repeat warnings multiple times

USER PROFILE:
- Name: ${user?.displayName || "there"}
- Age: ${profile?.age || "not specified"}
- Gender: ${profile?.gender || "not specified"}
- Height: ${profile?.heightCm ? profile.heightCm + "cm" : "not specified"}
- Weight: ${profile?.weightKg ? profile.weightKg + "kg" : "not specified"}
- BMI: ${profile?.heightCm && profile?.weightKg ? (parseFloat(profile.weightKg) / Math.pow(parseFloat(profile.heightCm) / 100, 2)).toFixed(1) : "not calculated"}
- Health conditions: ${profile?.healthIssues || "none mentioned"}
- Current medications: ${profile?.medications || "none mentioned"}
- Allergies: ${profile?.allergies || "none mentioned"}
- Selected condition today: ${disease || "General Health"}

STRICT RULES:
- NEVER suggest anything containing: ${profile?.allergies || "nothing"}
- ALWAYS consider medication interactions with: ${profile?.medications || "none"}
- If BMI > 25, naturally weave in portion awareness without being preachy
- If user is on medication, acknowledge it naturally — not as a warning label
- Max 130 words — be concise, not exhaustive
- Use **bold** for section headers
- Use - for bullet points
- End with one specific, actionable tip — not just "consult your doctor"
- The LAST line must always be: *Always consult your doctor for personalised advice.*

TONE EXAMPLES:
❌ "Based on your profile data, it is recommended that you..."
✅ "Given your hypertension, here's what actually works..."

❌ "You should avoid foods that may possibly cause issues."
✅ "Skip the salty sauces — your blood pressure will thank you."

❌ "Please note that your medication may interact with..."
✅ "Since you're on Amlodipine, stay away from grapefruit — it's a known interaction."

User asks: "${input}"

Respond now as CureMe:`;

    try {
      const aiResponse = await askAI(prompt);
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
      if (user) {
        await addDoc(collection(db, "chats", user.uid, "messages"), {
          role: "assistant",
          content: aiResponse,
          timestamp: serverTimestamp(),
        });
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. ❌" }]);
    }
    setLoading(false);
  };

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
          padding-top: 65px;
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
        @keyframes drift1 { from{transform:translate(0,0);}to{transform:translate(80px,60px);} }
        @keyframes drift2 { from{transform:translate(0,0);}to{transform:translate(-60px,-80px);} }

        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes borderSpin { 0%{--angle:0deg;}100%{--angle:360deg;} }

        .cure-panel-wrapper {
          position: relative; z-index: 1;
          width: 100%; max-width: 480px;
          height: 92vh; max-height: 800px;
          margin: 20px;
          border-radius: 28px;
          padding: 2px;
          background: conic-gradient(
            from var(--angle) at 50% 50%,
            rgba(160,100,255,0.9) 0deg,
            rgba(60,180,255,0.9) 90deg,
            rgba(255,100,220,0.8) 180deg,
            rgba(60,180,255,0.9) 270deg,
            rgba(160,100,255,0.9) 360deg
          );
          animation: borderSpin 4s linear infinite;
        }
        @media (min-width: 1024px) {
          .cure-panel-wrapper { max-width: 1100px; width: 95vw; height: 85vh; max-height: 700px; }
        }

        .cure-panel {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          background: #0d0d1a;
          border-radius: 26px;
          overflow: hidden;
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.7);
        }
        @media (min-width: 1024px) { .cure-panel { flex-direction: row; } }

        .cure-sidebar {
          display: flex; flex-direction: column; flex-shrink: 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 1024px) {
          .cure-sidebar { width: 260px; border-bottom: none; border-right: 1px solid rgba(255,255,255,0.06); height: 100%; }
        }

        .cure-main { display: flex; flex-direction: column; flex: 1; min-width: 0; height: 100%; }

        .cure-header {
          padding: 24px 28px 20px;
          display: flex; align-items: center; gap: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .cure-logo {
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; box-shadow: 0 4px 20px rgba(124,58,237,0.4); flex-shrink: 0;
        }
        .cure-header-text h1 { font-family: 'DM Serif Display', serif; font-size: 1.4rem; color: #fff; letter-spacing: -0.01em; line-height: 1; }
        .cure-header-text p { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight: 400; margin-top: 3px; letter-spacing: 0.04em; text-transform: uppercase; }
        .cure-status { margin-left: auto; display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: rgba(255,255,255,0.35); font-weight: 500; }
        .cure-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; animation: pulse-dot 2s ease-in-out infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1;}50%{opacity:0.4;} }

        .cure-condition-wrap { padding: 14px 20px; flex-shrink: 0; border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; }
        .cure-condition-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 8px; }
        .cure-condition-btn { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; cursor: pointer; transition: all 0.2s; font-family: 'Sora', sans-serif; font-size: 0.85rem; font-weight: 500; }
        .cure-condition-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2); }
        .cure-condition-btn span:last-child { margin-left: auto; font-size: 0.7rem; color: rgba(255,255,255,0.4); transition: transform 0.2s; }
        .cure-condition-btn.open span:last-child { transform: rotate(180deg); }
        .cure-condition-dropdown { position: absolute; left: 20px; right: 20px; top: calc(100% - 4px); background: #13121f; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; overflow: hidden; z-index: 10; box-shadow: 0 16px 40px rgba(0,0,0,0.6); animation: slideDown 0.18s ease; }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }
        .cure-condition-option { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; color: rgba(255,255,255,0.7); font-size: 0.85rem; transition: background 0.15s; }
        .cure-condition-option:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .cure-condition-option.active { color: #a78bfa; background: rgba(124,58,237,0.12); }

        .cure-chat { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth; overflow-y: scroll; }
        .cure-chat::-webkit-scrollbar { width: 4px; }
        .cure-chat::-webkit-scrollbar-track { background: transparent; }
        .cure-chat::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .cure-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: rgba(255,255,255,0.2); text-align: center; padding: 40px 20px; }
        .cure-empty-icon { font-size: 2.5rem; opacity: 0.4; }
        .cure-empty h3 { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: rgba(255,255,255,0.3); }
        .cure-empty p { font-size: 0.75rem; line-height: 1.6; max-width: 220px; }

        .cure-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 8px; }
        .cure-chip { padding: 6px 12px; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); border-radius: 20px; color: #a78bfa; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; font-family: 'Sora', sans-serif; }
        .cure-chip:hover { background: rgba(124,58,237,0.3); transform: translateY(-1px); }

        .cure-bubble-row { display: flex; gap: 8px; align-items: flex-end; }
        .cure-bubble-row.user { justify-content: flex-end; }
        .cure-bubble-row.assistant { justify-content: flex-start; }

        .cure-avatar { width: 28px; height: 28px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .cure-avatar.ai { background: linear-gradient(135deg, #7c3aed, #2563eb); box-shadow: 0 2px 12px rgba(124,58,237,0.4); }

        .cure-bubble { max-width: 75%; padding: 12px 16px; border-radius: 18px; font-size: 0.82rem; line-height: 1.65; word-break: break-word; animation: bubbleIn 0.25s ease; }
        @keyframes bubbleIn { from{opacity:0;transform:translateY(8px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);} }
        .cure-bubble.user { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #fff; border-bottom-right-radius: 5px; box-shadow: 0 4px 20px rgba(124,58,237,0.35); }
        .cure-bubble.assistant { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.88); border-bottom-left-radius: 5px; }
        .cure-bubble strong { color: #c4b5fd; font-weight: 600; }
        .cure-bubble.user strong { color: rgba(255,255,255,0.95); }
        .cure-bubble ul { margin: 6px 0 6px 16px; display: flex; flex-direction: column; gap: 4px; }
        .cure-bubble li { list-style: disc; line-height: 1.6; }

        .cure-typing { display: flex; align-items: center; gap: 5px; padding: 14px 18px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; border-bottom-left-radius: 5px; width: fit-content; }
        .cure-typing span { width: 6px; height: 6px; background: rgba(255,255,255,0.5); border-radius: 50%; animation: bounce 1.2s ease-in-out infinite; }
        .cure-typing span:nth-child(2){animation-delay:0.2s;} .cure-typing span:nth-child(3){animation-delay:0.4s;}
        @keyframes bounce { 0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-5px);} }

        .cure-input-wrap { padding: 14px 16px 18px; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
        .cure-input-row { display: flex; gap: 10px; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 6px 6px 6px 16px; transition: border-color 0.2s, box-shadow 0.2s; }
        .cure-input-row:focus-within { border-color: rgba(124,58,237,0.5); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .cure-input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-family: 'Sora', sans-serif; font-size: 0.85rem; padding: 6px 0; }
        .cure-input::placeholder { color: rgba(255,255,255,0.25); }
        .cure-send-btn { width: 40px; height: 40px; border-radius: 11px; border: none; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s; flex-shrink: 0; box-shadow: 0 4px 14px rgba(124,58,237,0.4); }
        .cure-send-btn:hover:not(:disabled) { transform: scale(1.06); box-shadow: 0 6px 20px rgba(124,58,237,0.55); }
        .cure-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .cure-footer-note { text-align: center; font-size: 0.62rem; color: rgba(255,255,255,0.2); margin-top: 8px; letter-spacing: 0.03em; }

        /* ── CHAT NAV ── */
        .chat-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 16px 48px; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(6,6,14,0.7); }
        .chat-nav-logo { display: flex; align-items: center; gap: 10px; font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: #fff; text-decoration: none; }
        .chat-nav-logo-icon { width: 34px; height: 34px; background: linear-gradient(135deg, #7c3aed, #2563eb); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 17px; box-shadow: 0 4px 14px rgba(124,58,237,0.4); }
        .chat-nav-links { display: flex; align-items: center; gap: 28px; list-style: none; }
        .chat-nav-links a { color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.04em; transition: color 0.2s; }
        .chat-nav-links a:hover { color: #fff; }

        .user-menu { position: relative; }
        .user-avatar-btn { display: flex; align-items: center; gap: 10px; padding: 6px 14px 6px 6px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; cursor: pointer; transition: all 0.2s; color: rgba(255,255,255,0.8); font-size: 0.8rem; font-weight: 500; font-family: 'Sora', sans-serif; }
        .user-avatar-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(124,58,237,0.4); }
        .user-avatar-circle { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #2563eb); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: #fff; flex-shrink: 0; }
        .user-photo { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
        .user-chevron { width: 14px; height: 14px; opacity: 0.5; transition: transform 0.2s; }
        .user-chevron.open { transform: rotate(180deg); }
        .user-dropdown { position: absolute; top: calc(100% + 10px); right: 0; min-width: 220px; background: #13121f; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 8px; box-shadow: 0 24px 60px rgba(0,0,0,0.6); animation: dropIn 0.18s ease both; z-index: 300; }
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }
        .dropdown-header { padding: 12px 14px 10px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 6px; }
        .dropdown-name { font-size: 0.82rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dropdown-email { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 14px; background: none; border: none; color: rgba(255,255,255,0.65); font-family: 'Sora', sans-serif; font-size: 0.8rem; border-radius: 10px; cursor: pointer; transition: all 0.15s; text-decoration: none; }
        .dropdown-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .dropdown-item.danger:hover { background: rgba(232,121,160,0.1); color: #f9a8d4; }

        .chat-nav-login-ghost { padding: 8px 18px; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; color: rgba(255,255,255,0.65); font-size: 0.8rem; font-weight: 500; text-decoration: none; transition: all 0.2s; }
        .chat-nav-login-ghost:hover { border-color: rgba(255,255,255,0.3); color: #fff; background: rgba(255,255,255,0.04); }
        .chat-nav-placeholder { width: 120px; height: 34px; background: rgba(255,255,255,0.04); border-radius: 100px; animation: shimmer 1.5s ease infinite; }
        @keyframes shimmer { 0%,100%{opacity:0.4;}50%{opacity:0.8;} }

        @media (max-width: 1023px) {
          .cure-panel-wrapper { width: 100%; max-width: 100%; height: 100vh; max-height: 100vh; margin: 0; border-radius: 0; padding: 2px; }
          .cure-panel { border-radius: 0; }
          .cure-root::before, .cure-root::after { display: none; }
        }
        @media (max-width: 768px) {
          .chat-nav { padding: 12px 16px; }
          .chat-nav-links { display: none; }
          .cure-root { padding-top: 57px; }
        }
      `}</style>

      {/* ── CHAT NAV ── */}
      <nav className="chat-nav">
        <a className="chat-nav-logo" href="/">
          <div className="chat-nav-logo-icon">🩺</div>
          CureMe AI
        </a>

        <ul className="chat-nav-links">
          <li><a href="/#features">Features</a></li>
          <li><a href="/#conditions">Conditions</a></li>
          <li><a href="/#how">How it works</a></li>
        </ul>

        {/* FIX 4: the nav auth JSX had mismatched braces — dropdown closing tag
            was missing, causing ) : ( ... to be in the wrong place */}
        {!authReady ? (
          <div className="chat-nav-placeholder" />
        ) : user ? (
          <div className="user-menu">
            <button className="user-avatar-btn" onClick={() => setDropdownOpen((o) => !o)}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="user-photo" />
              ) : (
                <div className="user-avatar-circle">{getInitials(user)}</div>
              )}
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>
                {user.displayName?.split(" ")[0] || user.email?.split("@")[0]}
              </span>
              <svg className={`user-chevron ${dropdownOpen ? "open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-name">{user.displayName || "User"}</div>
                  <div className="dropdown-email">{user.email}</div>
                </div>
                <a href="/dashboard" className="dropdown-item">
                  <span>📊</span> Dashboard
                </a>
                <a href="/survey" className="dropdown-item">
                  <span>👤</span> Edit Profile
                </a>
                <button className="dropdown-item" onClick={handleClearChat}>
                  <span>🗑</span> Clear Chat
                </button>
                <button className="dropdown-item danger" onClick={handleSignOut}>
                  <span>↩</span> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <a href="/login" className="chat-nav-login-ghost">Login</a>
        )}
      </nav>

      <div className="cure-root">
        <div className="cure-panel-wrapper">
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
                        onClick={() => { setDisease(c.value); setConditionOpen(false); }}
                      >
                        <span>{c.icon}</span>
                        <span>{c.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
                        <button key={q} className="cure-chip" onClick={() => setInput(q)}>{q}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`cure-bubble-row ${msg.role}`}>
                        {msg.role === "assistant" && <div className="cure-avatar ai">✦</div>}
                        <div className={`cure-bubble ${msg.role}`}>
                          <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="cure-bubble-row assistant">
                        <div className="cure-avatar ai">✦</div>
                        <div className="cure-typing"><span /><span /><span /></div>
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

          </div>
        </div>
      </div>
    </>
  );
}