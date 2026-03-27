"use client";
import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <title>CureMe AI — Your AI Health Companion</title>
      <style>{`
        :root {
          --ink: #06060e;
          --surface: #0d0d1a;
          --surface2: #13121f;
          --violet: #7c3aed;
          --indigo: #4f46e5;
          --cyan: #2563eb;
          --rose: #e879a0;
          --text: rgba(255,255,255,0.88);
          --muted: rgba(255,255,255,0.4);
          --faint: rgba(255,255,255,0.06);
          --border: rgba(255,255,255,0.1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          background: var(--ink);
          color: var(--text);
          font-family: 'Sora', sans-serif;
          overflow-x: hidden;
          line-height: 1.6;
        }

        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }

        .blobs {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.18;
        }
        .blob-1 { width: 700px; height: 700px; background: #7c3aed; top: -200px; left: -200px; animation: float1 18s ease-in-out infinite alternate; }
        .blob-2 { width: 500px; height: 500px; background: #2563eb; bottom: -150px; right: -150px; animation: float2 22s ease-in-out infinite alternate; }
        .blob-3 { width: 400px; height: 400px; background: #e879a0; top: 40%; left: 50%; animation: float3 15s ease-in-out infinite alternate; }

        @keyframes float1 { to { transform: translate(100px, 80px); } }
        @keyframes float2 { to { transform: translate(-80px, -100px); } }
        @keyframes float3 { to { transform: translate(60px, -60px); } }

        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          background: rgba(6,6,14,0.6);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: #fff;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--violet), var(--cyan));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 14px rgba(124,58,237,0.4);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }
        .nav-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: #fff; }

        .nav-cta {
          padding: 9px 22px;
          background: linear-gradient(135deg, var(--violet), var(--indigo));
          border-radius: 10px;
          color: #fff !important;
          font-weight: 600 !important;
          font-size: 0.8rem !important;
          box-shadow: 0 4px 14px rgba(124,58,237,0.4);
          transition: all 0.2s !important;
        }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.55) !important; }

        section { position: relative; z-index: 1; }

        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.35);
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #a78bfa;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 32px;
          animation: fadeUp 0.6s ease both;
        }
        .hero-badge-dot {
          width: 6px; height: 6px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 6px #22c55e;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(3rem, 8vw, 6.5rem);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #fff;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .hero-title em {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          max-width: 520px;
          margin: 24px auto 48px;
          font-size: 1rem;
          color: var(--muted);
          font-weight: 400;
          line-height: 1.7;
          animation: fadeUp 0.7s 0.2s ease both;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 0.7s 0.3s ease both;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: linear-gradient(135deg, var(--violet), var(--indigo));
          border-radius: 14px;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 6px 24px rgba(124,58,237,0.45);
          transition: all 0.25s;
          cursor: pointer;
          border: none;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(124,58,237,0.6); }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 14px;
          color: rgba(255,255,255,0.7);
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.25s;
          cursor: pointer;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #fff; background: rgba(255,255,255,0.04); }

        .hero-visual {
          margin-top: 80px;
          width: 100%;
          max-width: 700px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
          animation: fadeUp 0.8s 0.4s ease both;
        }
        .hero-visual-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          border-bottom: 1px solid var(--faint);
          background: rgba(255,255,255,0.02);
        }
        .hv-dot { width: 10px; height: 10px; border-radius: 50%; }
        .hv-dot:nth-child(1) { background: #ff5f57; }
        .hv-dot:nth-child(2) { background: #ffbd2e; }
        .hv-dot:nth-child(3) { background: #28c840; }
        .hv-label {
          margin-left: auto;
          font-size: 0.7rem;
          color: var(--muted);
          font-family: 'Space Mono', monospace;
        }
        .hero-visual-chat {
          padding: 24px 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .hv-msg {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          opacity: 0;
          animation: fadeUp 0.5s ease both;
        }
        .hv-msg.user { flex-direction: row-reverse; }
        .hv-msg:nth-child(1) { animation-delay: 1s; }
        .hv-msg:nth-child(2) { animation-delay: 1.6s; }
        .hv-msg:nth-child(3) { animation-delay: 2.2s; }
        .hv-msg:nth-child(4) { animation-delay: 2.8s; }

        .hv-avatar {
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }
        .hv-avatar.ai { background: linear-gradient(135deg, var(--violet), var(--cyan)); }
        .hv-avatar.user { background: rgba(255,255,255,0.1); }

        .hv-bubble {
          padding: 10px 15px;
          border-radius: 16px;
          font-size: 0.8rem;
          line-height: 1.55;
          max-width: 75%;
        }
        .hv-bubble.ai {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          border-bottom-left-radius: 4px;
        }
        .hv-bubble.user {
          background: linear-gradient(135deg, var(--violet), var(--indigo));
          color: #fff;
          border-bottom-right-radius: 4px;
          text-align: right;
        }

        .features { padding: 100px 24px; }
        .section-label {
          text-align: center;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a78bfa;
          margin-bottom: 16px;
        }
        .section-title {
          text-align: center;
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 60px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .feature-card {
          padding: 32px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(124,58,237,0.08), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover { transform: translateY(-4px); border-color: rgba(124,58,237,0.3); }
        .feature-card:hover::before { opacity: 1; }

        .feature-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          margin-bottom: 20px;
        }
        .feature-icon.violet { background: rgba(124,58,237,0.2); }
        .feature-icon.cyan { background: rgba(37,99,235,0.2); }
        .feature-icon.rose { background: rgba(232,121,160,0.2); }
        .feature-icon.green { background: rgba(34,197,94,0.2); }

        .feature-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          color: #fff;
          margin-bottom: 10px;
        }
        .feature-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.7; }

        .conditions {
          padding: 80px 24px;
          background: linear-gradient(180deg, transparent, rgba(124,58,237,0.04) 50%, transparent);
        }

        .conditions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .condition-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          font-size: 0.88rem;
          font-weight: 500;
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          transition: all 0.2s;
        }
        .condition-pill:hover {
          background: rgba(124,58,237,0.12);
          border-color: rgba(124,58,237,0.4);
          color: #fff;
          transform: scale(1.04);
        }
        .condition-pill .ci { font-size: 1.2rem; }

        .how { padding: 100px 24px; }
        .how-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }
        .how-steps::before {
          content: '';
          position: absolute;
          top: 32px;
          left: calc(16.6% + 24px);
          right: calc(16.6% + 24px);
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(37,99,235,0.4), transparent);
        }

        .how-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 24px;
          gap: 16px;
        }
        .how-step-num {
          width: 64px; height: 64px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--surface);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 1.1rem;
          color: #a78bfa;
          position: relative;
          z-index: 1;
        }
        .how-step-title { font-family: 'DM Serif Display', serif; font-size: 1rem; color: #fff; }
        .how-step-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.65; }

        .stats { padding: 80px 24px; display: flex; justify-content: center; }
        .stats-inner {
          display: flex;
          flex-wrap: wrap;
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          max-width: 800px;
          width: 100%;
        }
        .stat { flex: 1; min-width: 160px; padding: 40px 32px; background: var(--surface); text-align: center; }
        .stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 2.6rem;
          color: #fff;
          line-height: 1;
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label { font-size: 0.75rem; color: var(--muted); margin-top: 8px; font-weight: 500; }

        .cta-section { padding: 100px 24px 120px; text-align: center; position: relative; }
        .cta-section::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-card {
          max-width: 620px;
          margin: 0 auto;
          padding: 60px 48px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 28px;
          position: relative;
          overflow: hidden;
        }
        .cta-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(124,58,237,0.06), rgba(37,99,235,0.06));
        }
        .cta-card h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 16px;
          position: relative;
        }
        .cta-card p { font-size: 0.9rem; color: var(--muted); margin-bottom: 36px; position: relative; }
        .cta-card .btn-primary { position: relative; font-size: 1rem; padding: 16px 40px; }

        footer {
          padding: 40px 48px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          position: relative;
          z-index: 1;
        }
        .footer-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.6);
        }
        .footer-note { font-size: 0.72rem; color: rgba(255,255,255,0.2); letter-spacing: 0.02em; }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { font-size: 0.75rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: #fff; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* ─── MOBILE FIXES ─────────────────────────────────────────── */
        @media (max-width: 768px) {
          nav {
            padding: 14px 16px;
          }
          .nav-links { display: none; }

          /* Show only logo + open-app button in nav */
          .nav-mobile-cta {
            display: inline-flex !important;
          }

          /* Hero: compact so it fits one screen */
          .hero {
            min-height: 100svh;
            padding: 80px 20px 40px;
            justify-content: center;
            gap: 0;
          }
          .hero-badge {
            font-size: 0.62rem;
            padding: 5px 12px;
            margin-bottom: 20px;
            letter-spacing: 0.06em;
          }
          .hero-title {
            font-size: clamp(2.4rem, 11vw, 3.2rem);
            line-height: 1.08;
          }
          .hero-sub {
            font-size: 0.85rem;
            margin: 16px auto 28px;
            line-height: 1.6;
          }
          .hero-actions {
            gap: 10px;
          }
          .btn-primary, .btn-ghost {
            padding: 12px 24px;
            font-size: 0.85rem;
            border-radius: 12px;
          }

          /* Hide the chat preview on mobile to save space */
          .hero-visual { display: none; }

          /* Sections: tighter vertical rhythm */
          .features { padding: 60px 16px; }
          .features-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .feature-card { padding: 22px 20px; }
          .feature-icon { width: 40px; height: 40px; font-size: 18px; margin-bottom: 14px; }
          .feature-title { font-size: 1rem; }
          .feature-desc { font-size: 0.78rem; }
          .section-title { font-size: clamp(1.6rem, 7vw, 2.2rem); margin-bottom: 36px; }

          .conditions { padding: 50px 16px; }
          .conditions-grid { gap: 10px; }
          .condition-pill { padding: 10px 18px; font-size: 0.8rem; }

          .how { padding: 60px 16px; }
          .how-steps { gap: 32px; }
          .how-steps::before { display: none; }
          .how-step { padding: 0 12px; }
          .how-step-num { width: 52px; height: 52px; font-size: 0.95rem; }

          .stats { padding: 40px 16px; }
          .stats-inner { border-radius: 16px; }
          .stat { min-width: 120px; padding: 24px 16px; }
          .stat-num { font-size: 2rem; }
          .stat-label { font-size: 0.65rem; }

          .cta-section { padding: 60px 16px 80px; }
          .cta-card { padding: 36px 20px; border-radius: 20px; }
          .cta-card h2 { font-size: clamp(1.5rem, 7vw, 2rem); }
          .cta-card p { font-size: 0.82rem; margin-bottom: 24px; }
          .cta-card .btn-primary { padding: 14px 32px; font-size: 0.9rem; }

          footer {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 28px 16px;
            gap: 12px;
          }
          .footer-links { justify-content: center; gap: 16px; }
          .footer-note { font-size: 0.65rem; }
        }

        /* Extra small phones */
        @media (max-width: 380px) {
          .hero-title { font-size: 2.1rem; }
          .hero-sub { font-size: 0.78rem; }
          .btn-primary, .btn-ghost { padding: 11px 18px; font-size: 0.8rem; }
        }
      `}</style>

      <div className="blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <nav>
        <a className="nav-logo" href="#">
          <div className="nav-logo-icon">🩺</div>
          CureMe AI
        </a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#conditions">Conditions</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="./chat" className="nav-cta">Open App ↗</a></li>
        </ul>
        {/* Mobile-only CTA in nav */}
        <a href="./chat" className="nav-cta nav-mobile-cta" style={{ display: 'none' }}>Open App ↗</a>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          AI Health Companion · Powered by Cohere
        </div>
        <h1 className="hero-title">
          Your health,<br /><em>understood.</em>
        </h1>
        <p className="hero-sub">
          CureMe AI gives you warm, knowledgeable guidance tailored to your condition — whether it's diabetes, PCOS, hypertension, or more.
        </p>
        <div className="hero-actions">
          <a href="./chat" className="btn-primary">Start Chatting &rarr;</a>
          <a href="#features" className="btn-ghost">Learn more</a>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-bar">
            <div className="hv-dot"></div>
            <div className="hv-dot"></div>
            <div className="hv-dot"></div>
            <span className="hv-label">CureMe AI — Health Chat</span>
          </div>
          <div className="hero-visual-chat">
            <div className="hv-msg user">
              <div className="hv-avatar user">👤</div>
              <div className="hv-bubble user">What foods should I avoid with diabetes?</div>
            </div>
            <div className="hv-msg">
              <div className="hv-avatar ai">✦</div>
              <div className="hv-bubble ai">
                <strong>Foods to limit with Diabetes:</strong><br />
                Avoid refined carbs like white bread and sugary drinks. Focus on whole grains, lean proteins, and fibre-rich vegetables. Monitor your glycaemic index. <em>Always consult your doctor for personalized advice.</em>
              </div>
            </div>
            <div className="hv-msg user">
              <div className="hv-avatar user">👤</div>
              <div className="hv-bubble user">Any morning routine tips?</div>
            </div>
            <div className="hv-msg">
              <div className="hv-avatar ai">✦</div>
              <div className="hv-bubble ai">Start with a 10-min walk, check blood sugar, eat a balanced breakfast with protein. Hydrate well. Consistency matters most. <em>Always consult your doctor for personalized advice.</em></div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <p className="section-label reveal">What we offer</p>
        <h2 className="section-title reveal">Built for <em style={{ fontStyle: 'italic', color: '#a78bfa' }}>real</em> health questions</h2>
        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-icon violet">🧠</div>
            <h3 className="feature-title">Condition-Aware AI</h3>
            <p className="feature-desc">Tell us your condition once and every response is tailored — diet, routine, and medication context all adjusted automatically.</p>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon cyan">💬</div>
            <h3 className="feature-title">Natural Conversation</h3>
            <p className="feature-desc">Ask anything the way you'd ask a knowledgeable friend. No forms, no menus — just a warm, clear dialogue.</p>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon rose">🌿</div>
            <h3 className="feature-title">Non-Alarming Tone</h3>
            <p className="feature-desc">CureMe is designed to inform, not scare. Responses are calm, caring, and never use medical jargon without explanation.</p>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon green">⚡</div>
            <h3 className="feature-title">Instant Answers</h3>
            <p className="feature-desc">No waiting for appointments. Get thoughtful guidance on symptoms, diet, and daily habits in seconds, any time of day.</p>
          </div>
        </div>
      </section>

      <section className="conditions" id="conditions">
        <p className="section-label reveal">Supported conditions</p>
        <h2 className="section-title reveal">Tailored for your diagnosis</h2>
        <div className="conditions-grid">
          <div className="condition-pill reveal"><span className="ci">🩸</span> Diabetes</div>
          <div className="condition-pill reveal"><span className="ci">🌸</span> PCOS</div>
          <div className="condition-pill reveal"><span className="ci">💓</span> Hypertension</div>
          <div className="condition-pill reveal"><span className="ci">⚖️</span> Obesity</div>
          <div className="condition-pill reveal"><span className="ci">✦</span> General Health</div>
        </div>
      </section>

      <section className="how" id="how">
        <p className="section-label reveal">How it works</p>
        <h2 className="section-title reveal">Three steps to clarity</h2>
        <div className="how-steps">
          <div className="how-step reveal">
            <div className="how-step-num">01</div>
            <h3 className="how-step-title">Pick your condition</h3>
            <p className="how-step-desc">Select from our supported conditions or leave it blank for general health guidance.</p>
          </div>
          <div className="how-step reveal">
            <div className="how-step-num">02</div>
            <h3 className="how-step-title">Ask your question</h3>
            <p className="how-step-desc">Type naturally — symptoms, diet, medication, or lifestyle. No jargon needed.</p>
          </div>
          <div className="how-step reveal">
            <div className="how-step-num">03</div>
            <h3 className="how-step-title">Get clear guidance</h3>
            <p className="how-step-desc">Receive a focused, warm response tailored to you — with a gentle reminder to consult your doctor.</p>
          </div>
        </div>
      </section>

      <div className="stats">
        <div className="stats-inner">
          <div className="stat reveal">
            <div className="stat-num">4+</div>
            <div className="stat-label">Conditions supported</div>
          </div>
          <div className="stat reveal">
            <div className="stat-num">120</div>
            <div className="stat-label">Word limit · Focused answers</div>
          </div>
          <div className="stat reveal">
            <div className="stat-num">0</div>
            <div className="stat-label">Unnecessary alarm</div>
          </div>
          <div className="stat reveal">
            <div className="stat-num">∞</div>
            <div className="stat-label">Questions you can ask</div>
          </div>
        </div>
      </div>

      <section className="cta-section">
        <div className="cta-card reveal">
          <h2>Start your health<br />conversation today.</h2>
          <p>Free to use. No sign-up required. Just ask.</p>
          <a href="./chat" className="btn-primary">Open CureMe AI &rarr;</a>
        </div>
      </section>

      <footer>
        <div className="footer-logo">🩺 CureMe AI</div>
        <p className="footer-note">For informational purposes only · Not a substitute for professional medical advice</p>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#conditions">Conditions</a>
          <a href="#how">How it works</a>
        </div>
      </footer>
    </>
  );
}