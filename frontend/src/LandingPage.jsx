import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, BookOpen, Brain, Target, ChevronRight, Shield, Cpu, BarChart3, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body, #root {
    font-family: 'DM Sans', sans-serif;
    background: #ffffff;
    color: #111111;
    min-height: 100vh;
    overflow-x: hidden;
  }

  :root {
    --red: #dc2020;
    --red-dark: #b91c1c;
    --red-light: #fee2e2;
    --red-mid: #fca5a5;
    --text: #111111;
    --text-muted: #6b7280;
    --border: #e5e7eb;
    --card: #f9fafb;
    --card-hover: #f3f4f6;
    --white: #ffffff;
  }

  /* ─── NAV ─── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 60px;
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(20px);
  }

  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 18px; color: var(--text); text-decoration: none;
  }
  .nav-logo-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, #ef4444, #b91c1c);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(220,32,32,0.35);
  }

  .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
  .nav-links a {
    font-size: 13.5px; font-weight: 400; color: var(--text-muted);
    text-decoration: none; letter-spacing: 0.02em; transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--text); }

  .nav-cta { display: flex; align-items: center; gap: 10px; }

  .btn-ghost {
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500;
    color: var(--text-muted); background: none; border: none; cursor: pointer;
    padding: 9px 18px; border-radius: 8px; transition: all 0.18s;
  }
  .btn-ghost:hover { color: var(--text); background: var(--card); }

  .btn-primary {
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 600;
    color: #fff; background: var(--red); border: none; cursor: pointer;
    padding: 9px 20px; border-radius: 8px;
    display: flex; align-items: center; gap: 6px;
    transition: all 0.18s; box-shadow: 0 4px 16px rgba(220,32,32,0.3);
  }
  .btn-primary:hover { background: var(--red-dark); transform: translateY(-1px); box-shadow: 0 6px 22px rgba(220,32,32,0.4); }

  /* ─── HERO ─── */
  .hero {
    position: relative; min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 140px 60px 100px;
    text-align: center; overflow: hidden;
    background: #fff;
  }

  .hero::after {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 480px; height: 480px;
    background: linear-gradient(225deg, #fee2e2 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  .hero-glow {
    position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
    width: 800px; height: 400px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(220,32,32,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(220,32,32,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(220,32,32,0.05) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 100%, black, transparent);
  }

  .hero-badge {
    position: relative; z-index: 1;
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--red-light); border: 1px solid var(--red-mid);
    color: var(--red-dark); font-size: 12px; font-weight: 600; letter-spacing: 0.06em;
    padding: 6px 16px; border-radius: 99px; margin-bottom: 32px;
    text-transform: uppercase; animation: fadeUp 0.6s ease both;
  }

  .hero-title {
    position: relative; z-index: 1;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(48px, 7vw, 88px); line-height: 1.0;
    letter-spacing: -0.03em; color: var(--text);
    max-width: 900px; margin: 0 auto 28px;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero-title .accent { color: var(--red); }

  .hero-sub {
    position: relative; z-index: 1;
    font-size: 17px; font-weight: 300; line-height: 1.75;
    color: var(--text-muted); max-width: 520px; margin: 0 auto 48px;
    animation: fadeUp 0.6s 0.2s ease both;
  }

  .hero-actions {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap; justify-content: center;
    animation: fadeUp 0.6s 0.3s ease both;
  }

  .btn-hero {
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    color: #fff; background: linear-gradient(135deg, #ef4444, #b91c1c);
    border: none; cursor: pointer; padding: 14px 32px; border-radius: 12px;
    display: flex; align-items: center; gap: 8px;
    transition: all 0.2s; box-shadow: 0 8px 28px rgba(220,32,32,0.35);
  }
  .btn-hero:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(220,32,32,0.45); }

  .btn-hero-outline {
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 400;
    color: var(--text); background: none;
    border: 1.5px solid var(--border); cursor: pointer; padding: 14px 32px; border-radius: 12px;
    display: flex; align-items: center; gap: 8px; transition: all 0.2s;
  }
  .btn-hero-outline:hover { border-color: var(--red); color: var(--red); background: var(--red-light); }

  .hero-stats {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 40px; margin-top: 72px;
    padding-top: 40px; border-top: 1px solid var(--border);
    animation: fadeUp 0.6s 0.4s ease both;
    flex-wrap: wrap; justify-content: center;
  }
  .stat { text-align: center; }
  .stat-num {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 34px; color: var(--text); letter-spacing: -0.02em;
  }
  .stat-num span { color: var(--red); }
  .stat-lbl { font-size: 12px; color: var(--text-muted); margin-top: 4px; letter-spacing: 0.04em; }
  .stat-sep { width: 1px; height: 40px; background: var(--border); }

  /* ─── SECTIONS ─── */
  section { position: relative; z-index: 1; }
  .section-inner { max-width: 1100px; margin: 0 auto; padding: 0 60px; }

  .tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--red); margin-bottom: 16px;
  }
  .tag::before { content: ''; width: 20px; height: 2px; background: var(--red); border-radius: 2px; }

  .section-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: clamp(30px, 4vw, 46px); letter-spacing: -0.025em;
    line-height: 1.1; color: var(--text); margin-bottom: 18px;
  }
  .section-sub {
    font-size: 16px; font-weight: 300; color: var(--text-muted);
    line-height: 1.75; max-width: 520px;
  }

  /* ─── WHY RAG ─── */
  .why-section { padding: 120px 0; background: #fff; }

  .compare-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    margin-top: 64px; border-radius: 18px; overflow: hidden;
    border: 1.5px solid var(--border);
    box-shadow: 0 4px 32px rgba(0,0,0,0.06);
  }

  .compare-col { padding: 40px 36px; background: var(--card); }
  .compare-col.right {
    background: linear-gradient(160deg, #fff0f0 0%, #fff8f8 100%);
    border-left: 2px solid var(--red-mid);
  }

  .compare-header {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 17px; margin-bottom: 28px; padding-bottom: 20px;
    border-bottom: 1px solid var(--border); color: var(--text);
  }
  .compare-col.right .compare-header { border-bottom-color: var(--red-mid); }
  .compare-col:not(.right) .compare-header { color: var(--text-muted); }

  .compare-badge {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 3px 10px; border-radius: 99px;
  }
  .badge-generic { background: #f3f4f6; color: #9ca3af; border: 1px solid #e5e7eb; }
  .badge-rag { background: var(--red-light); color: var(--red-dark); border: 1px solid var(--red-mid); }

  .compare-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border); font-size: 14px; line-height: 1.6;
  }
  .compare-item:last-child { border-bottom: none; }
  .compare-col:not(.right) .compare-item { color: #9ca3af; }
  .compare-col.right .compare-item { color: #1f2937; }
  .ci-icon { flex-shrink: 0; margin-top: 2px; }

  /* ─── HOW IT WORKS ─── */
  .how-section {
    padding: 120px 0;
    background: linear-gradient(180deg, #fff 0%, #fef2f2 40%, #fff 100%);
    border-top: 1px solid var(--border);
  }

  .steps-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    margin-top: 64px;
  }

  .step-card {
    padding: 36px 32px; background: #fff;
    border: 1.5px solid var(--border); border-radius: 16px;
    position: relative; overflow: hidden; transition: all 0.25s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }
  .step-card:hover {
    border-color: var(--red); transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(220,32,32,0.1);
  }
  .step-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--red), #f87171);
    opacity: 0; transition: opacity 0.25s;
  }
  .step-card:hover::before { opacity: 1; }

  .step-num {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 52px; color: #fee2e2;
    line-height: 1; margin-bottom: 20px; letter-spacing: -0.04em;
  }

  .step-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--red-light); border: 1px solid var(--red-mid);
    display: flex; align-items: center; justify-content: center;
    color: var(--red); margin-bottom: 18px;
  }

  .step-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 17px; color: var(--text); margin-bottom: 10px;
  }
  .step-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.75; }

  /* ─── FEATURES ─── */
  .features-section { padding: 120px 0; background: #fff; border-top: 1px solid var(--border); }

  .features-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
    margin-top: 64px;
  }

  .feat-card {
    padding: 32px 28px; background: var(--card);
    border: 1.5px solid var(--border); border-radius: 14px; transition: all 0.2s;
  }
  .feat-card:hover {
    background: #fff; border-color: var(--red);
    box-shadow: 0 8px 32px rgba(220,32,32,0.08); transform: translateY(-2px);
  }

  .feat-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--red-light); border: 1px solid var(--red-mid);
    display: flex; align-items: center; justify-content: center;
    color: var(--red); margin-bottom: 16px;
  }

  .feat-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 16px; color: var(--text); margin-bottom: 8px;
  }
  .feat-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.7; }

  /* ─── TOPICS ─── */
  .topics-section { padding: 120px 0; background: #fafafa; border-top: 1px solid var(--border); }
  .topics-wrap { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 48px; }

  .topic-chip {
    font-size: 13px; color: var(--text-muted);
    background: #fff; border: 1.5px solid var(--border);
    padding: 8px 18px; border-radius: 99px;
    transition: all 0.18s; cursor: default;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .topic-chip:hover { color: var(--red-dark); border-color: var(--red-mid); background: var(--red-light); }
  .topic-chip.highlight {
    color: var(--red-dark); background: var(--red-light);
    border-color: var(--red-mid); font-weight: 500;
  }

  /* ─── CTA — full red band ─── */
  .cta-section {
    padding: 140px 0;
    background: linear-gradient(135deg, #ef4444 0%, var(--red-dark) 100%);
    text-align: center; position: relative; overflow: hidden;
  }
  .cta-section .tag { color: rgba(255,255,255,0.7); }
  .cta-section .tag::before { background: rgba(255,255,255,0.5); }
  .cta-section .section-title { color: #fff; }
  .cta-section .section-sub { color: rgba(255,255,255,0.75); }

  .cta-grid-overlay {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .btn-hero-white {
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    color: var(--red); background: #fff;
    border: none; cursor: pointer; padding: 14px 32px; border-radius: 12px;
    display: flex; align-items: center; gap: 8px;
    transition: all 0.2s; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  }
  .btn-hero-white:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(0,0,0,0.25); }

  /* ─── FOOTER ─── */
  footer {
    border-top: 1px solid var(--border); padding: 32px 60px;
    display: flex; align-items: center; justify-content: space-between;
    background: #fff;
  }
  .footer-left {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: var(--text);
  }
  .footer-right { font-size: 12.5px; color: var(--text-muted); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) {
    nav { padding: 18px 24px; }
    .nav-links { display: none; }
    .hero { padding: 120px 24px 80px; }
    .section-inner { padding: 0 24px; }
    .compare-grid { grid-template-columns: 1fr; }
    .steps-grid { grid-template-columns: 1fr; gap: 14px; }
    .features-grid { grid-template-columns: 1fr; }
    footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
  }
`

const EE_TOPICS = [
  'Electric Circuits', 'Electromagnetic Fields', 'Signals & Systems',
  'Control Systems', 'Electrical Machines', 'Power Systems',
  'Analog Electronics', 'Digital Electronics', 'Power Electronics',
  'Microprocessors', 'Communication Systems', 'Electronic Devices',
  'Network Theory', 'Measurement & Instrumentation', 'Engineering Mathematics',
  'General Aptitude', 'Laplace Transforms', 'Fourier Analysis',
  'MOSFET & BJT', 'Op-Amp Circuits', 'Bode Plots', 'Nyquist Criterion',
  'Synchronous Machines', 'Induction Motors', 'Transformers',
]

const COMPARE = {
  generic: [
    { text: 'Generic knowledge — not tuned to GATE syllabus or weightage' },
    { text: 'May give outdated or incorrect formulas from mixed sources' },
    { text: 'No awareness of GATE exam pattern or previous year trends' },
    { text: 'Cannot cite a specific standard textbook or topic source' },
    { text: 'One-size-fits-all responses regardless of your exam context' },
  ],
  rag: [
    { text: 'Pulls directly from GATE EE/ECE syllabus, standard textbooks & PYQs' },
    { text: 'Formulas verified against Hayt, Nagrath & Kothari, Sedra/Smith sources' },
    { text: 'Understands marks distribution, important topics, and exam weightage' },
    { text: 'Every answer is grounded — no hallucinated derivations or wrong units' },
    { text: "Context-aware: knows you're preparing for GATE 2026 EE/ECE" },
  ],
}

const STEPS = [
  {
    icon: <BookOpen size={18} strokeWidth={1.8} />,
    title: 'Curated Knowledge Base',
    desc: "We've ingested GATE EE/ECE syllabi, standard textbooks (Hayt, Sedra/Smith, Nagrath & Kothari), 10 years of PYQs, and topic-wise notes into a vector database."
  },
  {
    icon: <Brain size={18} strokeWidth={1.8} />,
    title: 'Semantic Retrieval',
    desc: 'When you ask a question, the system searches this knowledge base semantically — finding the most relevant passages, formulas, and examples before generating an answer.'
  },
  {
    icon: <Zap size={18} strokeWidth={1.8} />,
    title: 'Grounded Generation',
    desc: 'The LLM generates its response using the retrieved context as an anchor. Every explanation, derivation, and formula is grounded in verified GATE-specific material.'
  },
]

const FEATURES = [
  {
    icon: <Target size={16} strokeWidth={1.8} />,
    title: 'GATE Syllabus Aligned',
    desc: "Covers all 9 sections of GATE EE and all ECE topics with exact weightage awareness. Ask about Control Systems and get a response tuned to GATE's depth, not a generic textbook chapter."
  },
  {
    icon: <Shield size={16} strokeWidth={1.8} />,
    title: 'No Hallucinations on Formulas',
    desc: 'Standard LLMs often fabricate formulas under pressure. Our RAG retrieves the exact formula from verified source texts before constructing any derivation.'
  },
  {
    icon: <Cpu size={16} strokeWidth={1.8} />,
    title: 'PYQ-Aware Explanations',
    desc: 'Previous year questions are part of the knowledge base. Ask "what types of questions come from Signals & Systems" and get data-backed pattern analysis.'
  },
  {
    icon: <BarChart3 size={16} strokeWidth={1.8} />,
    title: 'Concept Depth Control',
    desc: "Distinguish between a quick formula recall and a full derivation. The tutor knows how deep to go based on GATE's actual expectation for each topic."
  },
]

export default function LandingPage({ onNavigate }) {
  const navigate = useNavigate()
  const revealRefs = useRef([])

  // ✅ FIX 3: Check if user is already logged in
  const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    revealRefs.current.forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const addRef = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el) }

  return (
    <>
      <style>{style}</style>

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon"><Zap size={16} color="#fff" strokeWidth={2.5} /></div>
          GATE Tutor
        </a>
        <ul className="nav-links">
          <li><a href="#why">Why RAG</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#topics">Topics</a></li>
        </ul>

        {/* ✅ FIX 3: Smart navbar buttons */}
        <div className="nav-cta">
          {isLoggedIn ? (
            <button className="btn-primary" onClick={() => navigate('/chat')}>
              Go to Workspace <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate('/auth')}>Log in</button>
              <button className="btn-primary" onClick={() => navigate('/auth')}>
                Start Free <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-grid" />
        <div className="hero-badge">
          <Sparkles size={11} strokeWidth={2} /> RAG-powered · GATE EE &amp; ECE · 2026
        </div>
        <h1 className="hero-title">
          The only tutor that<br />
          <span className="accent">actually knows</span><br />
          GATE
        </h1>
        <p className="hero-sub">
          Generic AI gives generic answers. We built a Retrieval-Augmented system that pulls from verified GATE textbooks, PYQs, and syllabus before it ever responds to you.
        </p>

        {/* ✅ FIX 3: Smart hero buttons */}
        <div className="hero-actions">
          <button className="btn-hero" onClick={() => navigate(isLoggedIn ? '/chat' : '/auth')}>
            {isLoggedIn ? 'Open Workspace' : 'Start Preparing'} <ArrowRight size={15} strokeWidth={2.5} />
          </button>
          <button className="btn-hero-outline" onClick={() => document.getElementById('why')?.scrollIntoView({ behavior: 'smooth' })}>
            See how it works
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat"><div className="stat-num">10<span>+</span></div><div className="stat-lbl">Years of PYQs</div></div>
          <div className="stat-sep" />
          <div className="stat"><div className="stat-num">9<span>+</span></div><div className="stat-lbl">GATE EE Sections</div></div>
          <div className="stat-sep" />
          <div className="stat"><div className="stat-num">0</div><div className="stat-lbl">Formula Hallucinations</div></div>
          <div className="stat-sep" />
          <div className="stat"><div className="stat-num">∞</div><div className="stat-lbl">Questions. Ask away.</div></div>
        </div>
      </section>

      {/* WHY RAG */}
      <section className="why-section" id="why">
        <div className="section-inner">
          <div ref={addRef} className="reveal">
            <div className="tag">Why RAG</div>
            <h2 className="section-title">Generic LLMs fail GATE students</h2>
            <p className="section-sub">ChatGPT knows a lot. But it doesn't know <em>your</em> exam. Here's what changes when your tutor is grounded in GATE-specific knowledge.</p>
          </div>
          <div ref={addRef} className="reveal compare-grid">
            <div className="compare-col">
              <div className="compare-header">
                <span className="compare-badge badge-generic">Generic LLM</span>
                Regular ChatGPT / Gemini
              </div>
              {COMPARE.generic.map((item, i) => (
                <div key={i} className="compare-item">
                  <div className="ci-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="#d1d5db" strokeWidth="1.2"/>
                      <path d="M5 8h6" stroke="#d1d5db" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
            <div className="compare-col right">
              <div className="compare-header">
                <span className="compare-badge badge-rag">GATE Tutor RAG</span>
                Retrieval-Augmented
              </div>
              {COMPARE.rag.map((item, i) => (
                <div key={i} className="compare-item">
                  <div className="ci-icon"><CheckCircle2 size={16} color="#dc2020" strokeWidth={1.8} /></div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="section-inner">
          <div ref={addRef} className="reveal">
            <div className="tag">How It Works</div>
            <h2 className="section-title">RAG in three steps</h2>
            <p className="section-sub">Retrieval-Augmented Generation means the AI fetches real knowledge before it speaks. Here's the pipeline behind every answer.</p>
          </div>
          <div ref={addRef} className="reveal steps-grid">
            {STEPS.map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-num">0{i + 1}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-inner">
          <div ref={addRef} className="reveal">
            <div className="tag">What You Get</div>
            <h2 className="section-title">Built specifically for<br />GATE EE &amp; ECE</h2>
          </div>
          <div ref={addRef} className="reveal features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="topics-section" id="topics">
        <div className="section-inner">
          <div ref={addRef} className="reveal">
            <div className="tag">Coverage</div>
            <h2 className="section-title">Every topic. Verified.</h2>
            <p className="section-sub">The knowledge base spans the complete GATE EE and ECE syllabi. Ask anything.</p>
          </div>
          {/* ✅ FIX 2: No highlight logic — all chips are uniform */}
          <div ref={addRef} className="reveal topics-wrap">
            {EE_TOPICS.map((t, i) => (
              <div key={i} className="topic-chip">{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-grid-overlay" />
        <div className="section-inner" style={{ position: 'relative' }}>
          <div ref={addRef} className="reveal">
            <div className="tag" style={{ justifyContent: 'center' }}>Get Started</div>
            <h2 className="section-title" style={{ textAlign: 'center', margin: '0 auto 18px' }}>
              Stop guessing.<br />Start knowing.
            </h2>
            <p className="section-sub" style={{ margin: '0 auto 40px', textAlign: 'center' }}>
              Create a free account and ask your first question in under 60 seconds.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="btn-hero-white" onClick={() => navigate(isLoggedIn ? '/chat' : '/auth')}>
                {isLoggedIn ? 'Go to Workspace' : 'Create Free Account'} <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-left">
          <div className="nav-logo-icon" style={{ width: 28, height: 28, borderRadius: 8 }}>
            <Zap size={13} color="#fff" strokeWidth={2.5} />
          </div>
          GATE Tutor
        </div>
        <div className="footer-right">© 2026 · Built for GATE EE &amp; ECE · RAG-powered</div>
      </footer>
    </>
  )
}