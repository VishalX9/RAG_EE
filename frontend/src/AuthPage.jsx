import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body, #root {
    font-family: 'DM Sans', sans-serif;
    background: #ffffff;
    color: #111111;
    min-height: 100vh;
  }

  :root {
    --red: #dc2020;
    --red-dark: #b91c1c;
    --red-light: #fee2e2;
    --red-mid: #fca5a5;
    --text: #111111;
    --text-muted: #6b7280;
    --border: #e5e7eb;
    --input-bg: #f9fafb;
    --white: #ffffff;
  }

  .auth-shell {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
  }

  /* ─── LEFT PANEL — solid red ─── */
  .auth-left {
    position: relative;
    background: linear-gradient(145deg, #ef4444 0%, #b91c1c 100%);
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 48px 56px;
    overflow: hidden;
  }

  .auth-left::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .auth-left-orb {
    position: absolute; bottom: -120px; right: -120px;
    width: 420px; height: 420px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.12);
    pointer-events: none;
  }
  .auth-left-orb2 {
    position: absolute; bottom: -60px; right: -60px;
    width: 260px; height: 260px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.18);
    pointer-events: none;
  }

  .back-btn {
    position: relative; z-index: 1;
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 13px; color: rgba(255,255,255,0.65);
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px; padding: 7px 14px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.18s;
  }
  .back-btn:hover { background: rgba(255,255,255,0.22); color: #fff; }

  .left-logo {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 10px;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px;
    color: #ffffff;
  }
  .logo-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }

  .left-body {
    position: relative; z-index: 1;
    flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 60px 0;
  }

  .left-tagline {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(28px, 3vw, 42px); line-height: 1.08;
    letter-spacing: -0.025em; color: #ffffff;
    margin-bottom: 18px;
  }
  .left-tagline .white-dim { color: rgba(255,255,255,0.75); }

  .left-sub {
    font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.75);
    line-height: 1.75; max-width: 340px; margin-bottom: 44px;
  }

  .left-points { display: flex; flex-direction: column; gap: 16px; }
  .left-point {
    display: flex; align-items: flex-start; gap: 12px;
    font-size: 13.5px; color: rgba(255,255,255,0.8); line-height: 1.55;
  }
  .point-dot {
    width: 20px; height: 20px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
  }
  .point-check {
    width: 8px; height: 8px; border-radius: 50%;
    background: #fff;
  }

  .left-bottom {
    position: relative; z-index: 1;
    font-size: 12px; color: rgba(255,255,255,0.4);
  }

  /* ─── RIGHT PANEL — white ─── */
  .auth-right {
    display: flex; align-items: center; justify-content: center;
    padding: 48px 56px;
    background: #ffffff;
    position: relative;
  }

  .auth-right::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 240px; height: 240px;
    background: linear-gradient(225deg, #fee2e2 0%, transparent 65%);
    pointer-events: none;
  }

  .auth-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 400px;
    animation: fadeUp 0.5s ease both;
  }

  .auth-card-header { margin-bottom: 32px; }

  .auth-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 30px; color: var(--text); letter-spacing: -0.03em;
    margin-bottom: 8px;
  }
  .auth-sub {
    font-size: 14px; color: var(--text-muted); font-weight: 300; line-height: 1.6;
  }

  /* ─── Tabs ─── */
  .tabs {
    display: flex;
    background: #f3f4f6;
    border: 1.5px solid var(--border); border-radius: 12px;
    padding: 4px; margin-bottom: 28px;
  }
  .tab {
    flex: 1; text-align: center; padding: 10px 0;
    font-size: 13.5px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    border-radius: 9px; cursor: pointer; border: none;
    color: var(--text-muted); background: none;
    transition: all 0.2s;
  }
  .tab.active {
    background: var(--red); color: #fff;
    box-shadow: 0 4px 14px rgba(220,32,32,0.3);
  }

  /* ─── Form ─── */
  .auth-form { display: flex; flex-direction: column; gap: 18px; }

  .field { display: flex; flex-direction: column; gap: 7px; }
  .field-label {
    font-size: 11.5px; font-weight: 600; color: #374151;
    letter-spacing: 0.06em; text-transform: uppercase;
  }

  .field-wrap { position: relative; display: flex; align-items: center; }

  .field-icon {
    position: absolute; left: 14px; color: #9ca3af;
    pointer-events: none;
  }

  .field-input {
    width: 100%; background: var(--input-bg);
    border: 1.5px solid var(--border); border-radius: 11px;
    padding: 12px 14px 12px 42px;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    color: var(--text); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .field-input::placeholder { color: #d1d5db; }
  .field-input:focus {
    border-color: var(--red);
    box-shadow: 0 0 0 3px rgba(220,32,32,0.1);
    background: #fff;
  }
  .field-input.has-toggle { padding-right: 44px; }

  .toggle-pw {
    position: absolute; right: 12px; background: none; border: none;
    cursor: pointer; color: #9ca3af; padding: 4px;
    display: flex; align-items: center; transition: color 0.15s;
  }
  .toggle-pw:hover { color: var(--red); }

  .field-select {
    width: 100%; background: var(--input-bg);
    border: 1.5px solid var(--border); border-radius: 11px;
    padding: 12px 14px 12px 42px;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    color: var(--text); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none; cursor: pointer;
  }
  .field-select:focus {
    border-color: var(--red);
    box-shadow: 0 0 0 3px rgba(220,32,32,0.1);
  }
  .field-select option { background: #fff; color: var(--text); }

  .forgot { text-align: right; margin-top: -6px; }
  .forgot a {
    font-size: 12.5px; color: var(--red); text-decoration: none;
    font-weight: 500; transition: opacity 0.15s;
  }
  .forgot a:hover { opacity: 0.75; }

  .submit-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #ef4444, #b91c1c);
    border: none; border-radius: 11px; cursor: pointer;
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 15px; color: #fff;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s; margin-top: 4px;
    box-shadow: 0 6px 24px rgba(220,32,32,0.3);
  }
  .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 32px rgba(220,32,32,0.45); }
  .submit-btn:active { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .terms {
    font-size: 11.5px; color: var(--text-muted); text-align: center; line-height: 1.65;
  }
  .terms a { color: var(--red); text-decoration: none; font-weight: 500; }
  .terms a:hover { opacity: 0.75; }

  .switch-text {
    text-align: center; font-size: 13.5px; color: var(--text-muted); margin-top: 20px;
  }
  .switch-text button {
    background: none; border: none; cursor: pointer;
    color: var(--red); font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 600; padding: 0;
    transition: opacity 0.15s;
  }
  .switch-text button:hover { opacity: 0.75; }

  /* ─── Success & Error ─── */
  .success-card {
    text-align: center; padding: 40px 0;
    animation: fadeUp 0.4s ease both;
  }
  .success-icon {
    width: 68px; height: 68px; border-radius: 20px;
    background: linear-gradient(135deg, #ef4444, #b91c1c);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px; color: #fff;
    box-shadow: 0 8px 32px rgba(220,32,32,0.3);
  }
  .success-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 26px; color: var(--text); margin-bottom: 10px; letter-spacing: -0.02em;
  }
  .success-sub { font-size: 14px; color: var(--text-muted); line-height: 1.7; }

  .error-box {
    background: rgba(220, 32, 32, 0.08);
    color: var(--red-dark);
    padding: 12px 14px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 20px;
    border: 1px solid rgba(220, 32, 32, 0.15);
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeUp 0.2s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .auth-shell { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { padding: 40px 24px; }
  }
`

export default function AuthPage({ onNavigate }) {
  // ✅ FIX: single useNavigate call inside the component — correct React hook usage
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', stream: 'EE' })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (tab === 'register' && form.password !== form.confirm) {
      return setErrorMsg("Passwords do not match!")
    }

    setIsLoading(true)

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register'

      const payload = tab === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, stream: form.stream }

      const res = await axios.post(`${BASE_URL}${endpoint}`, payload)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      setDone(true)
      setTimeout(() => {
        setDone(false)
        navigate('/chat')
      }, 1800)

    } catch (error) {
      const message = error.response?.data?.error || "Something went wrong. Please try again."
      setErrorMsg(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabSwitch = (newTab) => {
    setTab(newTab)
    setErrorMsg('')
    setForm({ name: '', email: '', password: '', confirm: '', stream: 'EE' })
  }

  return (
    <>
      <style>{style}</style>
      <div className="auth-shell">

        {/* ── LEFT: Red branding panel ── */}
        <div className="auth-left">
          <div className="auth-left-orb" />
          <div className="auth-left-orb2" />

          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={14} strokeWidth={2} /> Back to home
          </button>

          <div className="left-body">
            <div className="left-logo" style={{ marginBottom: 44 }}>
              <div className="logo-icon"><Zap size={18} color="#fff" strokeWidth={2.5} /></div>
              GATE Tutor
            </div>
            <h2 className="left-tagline">
              The RAG-powered<br />
              <span className="white-dim">GATE prep</span><br />
              assistant
            </h2>
            <p className="left-sub">
              Join EE &amp; ECE students who get grounded, textbook-verified answers — not generic AI guesses.
            </p>
            <div className="left-points">
              {[
                'Answers from Hayt, Nagrath & Kothari, Sedra/Smith',
                '10+ years of GATE PYQs in the knowledge base',
                'LaTeX-rendered formulas, step-by-step derivations',
                'Full GATE EE & ECE syllabus with topic weightage',
              ].map((p, i) => (
                <div key={i} className="left-point">
                  <div className="point-dot"><div className="point-check" /></div>
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="left-bottom">© 2026 GATE Tutor · RAG-powered</div>
        </div>

        {/* ── RIGHT: Auth form ── */}
        <div className="auth-right">
          <div className="auth-card">

            {done ? (
              <div className="success-card">
                <div className="success-icon">
                  <Zap size={30} strokeWidth={2} />
                </div>
                <div className="success-title">{tab === 'login' ? 'Welcome back!' : 'Account created!'}</div>
                <div className="success-sub">Taking you to the tutor…</div>
              </div>
            ) : (
              <>
                <div className="auth-card-header">
                  <div className="auth-title">
                    {tab === 'login' ? 'Welcome back' : 'Get started free'}
                  </div>
                  <div className="auth-sub">
                    {tab === 'login'
                      ? 'Log in to continue your GATE preparation.'
                      : 'Create your account and start asking in 60 seconds.'}
                  </div>
                </div>

                {errorMsg && (
                  <div className="error-box">
                    <Zap size={14} strokeWidth={2.5} />
                    {errorMsg}
                  </div>
                )}

                <div className="tabs">
                  <button className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => handleTabSwitch('login')}>Log in</button>
                  <button className={`tab ${tab === 'register' ? 'active' : ''}`} onClick={() => handleTabSwitch('register')}>Register</button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>

                  {tab === 'register' && (
                    <div className="field">
                      <label className="field-label">Full Name</label>
                      <div className="field-wrap">
                        <span className="field-icon"><User size={15} strokeWidth={1.8} /></span>
                        <input
                          className="field-input" type="text" placeholder="Your name"
                          value={form.name} onChange={e => set('name', e.target.value)} required
                        />
                      </div>
                    </div>
                  )}

                  <div className="field">
                    <label className="field-label">Email</label>
                    <div className="field-wrap">
                      <span className="field-icon"><Mail size={15} strokeWidth={1.8} /></span>
                      <input
                        className="field-input" type="email" placeholder="you@example.com"
                        value={form.email} onChange={e => set('email', e.target.value)} required
                      />
                    </div>
                  </div>

                  {tab === 'register' && (
                    <div className="field">
                      <label className="field-label">GATE Stream</label>
                      <div className="field-wrap">
                        <span className="field-icon"><Zap size={15} strokeWidth={1.8} /></span>
                        <select className="field-select" value={form.stream} onChange={e => set('stream', e.target.value)}>
                          <option value="EE">Electrical Engineering (EE)</option>
                          <option value="ECE">Electronics &amp; Communication (ECE)</option>
                          <option value="BOTH">Both EE + ECE</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="field">
                    <label className="field-label">Password</label>
                    <div className="field-wrap">
                      <span className="field-icon"><Lock size={15} strokeWidth={1.8} /></span>
                      <input
                        className="field-input has-toggle"
                        type={showPw ? 'text' : 'password'}
                        placeholder={tab === 'register' ? 'Create a password' : 'Your password'}
                        value={form.password} onChange={e => set('password', e.target.value)} required
                      />
                      <button type="button" className="toggle-pw" onClick={() => setShowPw(v => !v)}>
                        {showPw ? <EyeOff size={14} strokeWidth={1.8} /> : <Eye size={14} strokeWidth={1.8} />}
                      </button>
                    </div>
                  </div>

                  {tab === 'register' && (
                    <div className="field">
                      <label className="field-label">Confirm Password</label>
                      <div className="field-wrap">
                        <span className="field-icon"><Lock size={15} strokeWidth={1.8} /></span>
                        <input
                          className="field-input has-toggle"
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Repeat password"
                          value={form.confirm} onChange={e => set('confirm', e.target.value)} required
                        />
                        <button type="button" className="toggle-pw" onClick={() => setShowConfirm(v => !v)}>
                          {showConfirm ? <EyeOff size={14} strokeWidth={1.8} /> : <Eye size={14} strokeWidth={1.8} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {tab === 'login' && (
                    <div className="forgot"><a href="#">Forgot password?</a></div>
                  )}

                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Processing...' : (tab === 'login' ? 'Log in' : 'Create account')}
                    {!isLoading && <ArrowRight size={15} strokeWidth={2.5} />}
                  </button>

                  {tab === 'register' && (
                    <p className="terms">
                      By registering you agree to our{' '}
                      <a href="#">Terms of Service</a> and{' '}
                      <a href="#">Privacy Policy</a>.
                    </p>
                  )}
                </form>

                <p className="switch-text">
                  {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={() => handleTabSwitch(tab === 'login' ? 'register' : 'login')}>
                    {tab === 'login' ? 'Register free' : 'Log in'}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
