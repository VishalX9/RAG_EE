import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import { Send, Zap, Sun, Moon, Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeftOpen, LogOut, Paperclip, X, Image as ImageIcon } from 'lucide-react'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const buildStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .katex { font-size: 1.05em; }
  .katex-display { margin: 12px 0; overflow-x: auto; }

  .bubble.ai h1, .bubble.ai h2, .bubble.ai h3 { margin: 10px 0 6px; font-weight: 600; }
  .bubble.ai p { margin: 6px 0; }
  .bubble.ai ul, .bubble.ai ol { margin: 8px 0 8px 18px; }
  .bubble.ai li { margin: 4px 0; }
  .bubble.ai code {
    background: ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
    padding: 2px 6px; border-radius: 6px;
    font-family: 'Geist Mono', monospace; font-size: 13px;
  }
  .bubble.ai pre {
    background: #0f172a; color: #e5e7eb;
    padding: 12px; border-radius: 10px; overflow-x: auto; margin: 10px 0;
  }
  .bubble.ai pre code { background: transparent; padding: 0; }
  .bubble.ai blockquote {
    border-left: 3px solid #dc2626; padding-left: 10px; margin: 8px 0; opacity: 0.85;
  }

  /* ── Background ── */
  body {
    background: ${dark
      ? 'radial-gradient(ellipse 80% 50% at 50% -10%, #1a0505 0%, #0a0000 60%)'
      : 'radial-gradient(ellipse 80% 50% at 50% -10%, #fef2f2 0%, #ffffff 50%)'
    };
    background-attachment: fixed;
    min-height: 100vh;
    transition: background 0.4s ease;
  }

  .shell { display: flex; height: 100vh; width: 100%; overflow: hidden; }

  /* ── Sidebar ── */
  .sidebar {
    width: 260px; min-width: 260px;
    display: flex; flex-direction: column;
    background: ${dark ? 'rgba(220,38,38,0.06)' : 'rgba(255,255,255,0.6)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-right: 1px solid ${dark ? 'rgba(220,38,38,0.12)' : 'rgba(0,0,0,0.05)'};
    transition: width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
  }
  .sidebar.closed { width: 0; min-width: 0; border-right: none; }

  .sidebar-top {
    padding: 20px 18px 12px;
    border-bottom: 1px solid ${dark ? 'rgba(220,38,38,0.1)' : 'rgba(0,0,0,0.05)'};
  }

  .sidebar-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: ${dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)'};
    margin-bottom: 12px; display: block;
  }

  .new-btn {
    display: flex; align-items: center; gap: 8px; width: 100%;
    padding: 9px 13px; border-radius: 10px;
    border: 1.5px dashed ${dark ? 'rgba(220,38,38,0.3)' : 'rgba(0,0,0,0.15)'};
    background: transparent; cursor: pointer;
    font-family: 'Geist', sans-serif; font-size: 13px; font-weight: 500;
    color: ${dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};
    transition: all 0.18s ease; white-space: nowrap;
  }
  .new-btn:hover {
    border-color: ${dark ? 'rgba(220,38,38,0.6)' : 'rgba(220,38,38,0.4)'};
    color: ${dark ? '#ff6b6b' : '#dc2626'};
    background: ${dark ? 'rgba(220,38,38,0.08)' : 'rgba(220,38,38,0.05)'};
  }

  .hist-list { flex: 1; overflow-y: auto; padding: 8px 12px 20px; }
  .hist-list::-webkit-scrollbar { width: 3px; }
  .hist-list::-webkit-scrollbar-thumb {
    background: ${dark ? 'rgba(220,38,38,0.2)' : 'rgba(0,0,0,0.1)'}; border-radius: 4px;
  }

  .hist-item {
    display: flex; align-items: center; gap: 9px; padding: 8px 10px;
    border-radius: 10px; cursor: pointer; transition: background 0.15s ease; margin-bottom: 2px;
  }
  .hist-item:hover { background: ${dark ? 'rgba(220,38,38,0.08)' : 'rgba(0,0,0,0.04)'}; }
  .hist-item.active { background: ${dark ? 'rgba(220,38,38,0.15)' : 'rgba(220,38,38,0.08)'}; }

  .hist-icon { color: ${dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}; flex-shrink: 0; }
  .hist-item.active .hist-icon { color: ${dark ? '#ff6b6b' : '#dc2626'}; }

  .hist-txt {
    flex: 1; font-size: 12.5px; font-weight: 400;
    color: ${dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)'};
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .hist-item.active .hist-txt { color: ${dark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)'}; font-weight: 500; }

  .hist-del {
    opacity: 0; background: none; border: none; cursor: pointer; padding: 2px; border-radius: 4px;
    color: ${dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
    display: flex; align-items: center; transition: all 0.12s;
  }
  .hist-item:hover .hist-del { opacity: 1; }
  .hist-del:hover { color: #dc2626; }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: transparent; }

  /* ── Topbar ── */
  .topbar {
    display: flex; align-items: center; gap: 12px; padding: 14px 28px;
    background: ${dark ? 'rgba(10,0,0,0.7)' : 'rgba(255,255,255,0.6)'};
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid ${dark ? 'rgba(220,38,38,0.12)' : 'rgba(0,0,0,0.05)'};
  }

  .ghost-btn {
    background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px;
    color: ${dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
    display: flex; align-items: center; transition: all 0.15s;
  }
  .ghost-btn:hover {
    background: ${dark ? 'rgba(220,38,38,0.1)' : 'rgba(0,0,0,0.06)'};
    color: ${dark ? '#ff6b6b' : '#dc2626'};
  }

  .logo-mark {
    width: 32px; height: 32px; border-radius: 10px;
    background: linear-gradient(135deg, #ef4444, #b91c1c);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(220,38,38,0.35);
  }

  .app-name {
    font-size: 15px; font-weight: 600; letter-spacing: -0.01em;
    color: ${dark ? '#ffffff' : '#111827'};
  }

  .right-controls { margin-left: auto; display: flex; align-items: center; gap: 8px; }

  .pill-badge {
    font-size: 10.5px; font-weight: 500; letter-spacing: 0.04em;
    color: ${dark ? '#fca5a5' : '#dc2626'};
    background: ${dark ? 'rgba(220,38,38,0.15)' : 'rgba(220,38,38,0.08)'};
    border: 1px solid ${dark ? 'rgba(220,38,38,0.3)' : 'rgba(220,38,38,0.2)'};
    padding: 4px 11px; border-radius: 99px;
  }

  .icon-pill {
    width: 34px; height: 34px; border-radius: 10px; cursor: pointer; border: none;
    background: ${dark ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.8)'};
    border: 1px solid ${dark ? 'rgba(220,38,38,0.15)' : 'rgba(0,0,0,0.08)'};
    display: flex; align-items: center; justify-content: center;
    color: ${dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};
    transition: all 0.15s;
  }
  .icon-pill:hover {
    background: ${dark ? 'rgba(220,38,38,0.2)' : 'rgba(220,38,38,0.08)'};
    border-color: ${dark ? 'rgba(220,38,38,0.4)' : 'rgba(220,38,38,0.25)'};
    color: ${dark ? '#ff6b6b' : '#dc2626'};
  }

  /* ── Chat area ── */
  .chat-scroll { flex: 1; overflow-y: auto; padding: 40px 0; scroll-behavior: smooth; }
  .chat-scroll::-webkit-scrollbar { width: 4px; }
  .chat-scroll::-webkit-scrollbar-thumb {
    background: ${dark ? 'rgba(220,38,38,0.2)' : 'rgba(0,0,0,0.1)'}; border-radius: 4px;
  }

  .chat-inner { width: 100%; max-width: none; padding: 0 40px; }

  /* ── Hero ── */
  .hero {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 60vh; gap: 14px;
    animation: fadeUp 0.6s ease; text-align: center;
  }

  .hero-orb {
    width: 64px; height: 64px; border-radius: 20px;
    background: ${dark
      ? 'linear-gradient(135deg, rgba(185,28,28,0.4), rgba(220,38,38,0.3))'
      : 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.15))'
    };
    border: 1px solid ${dark ? 'rgba(220,38,38,0.4)' : 'rgba(220,38,38,0.2)'};
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 6px;
    box-shadow: ${dark ? '0 8px 32px rgba(220,38,38,0.2)' : '0 8px 32px rgba(220,38,38,0.1)'};
  }

  .hero-title {
    font-size: 32px; font-weight: 600; letter-spacing: -0.03em;
    color: ${dark ? '#ffffff' : '#111827'}; line-height: 1.15;
  }

  .hero-sub {
    font-size: 15px; font-weight: 400; line-height: 1.65;
    color: ${dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'};
    max-width: 380px; margin-top: -2px;
  }

  .chips { display: flex; flex-wrap: wrap; gap: 9px; justify-content: center; margin-top: 12px; max-width: 500px; }

  .chip {
    font-size: 13px; font-weight: 400;
    color: ${dark ? '#fca5a5' : '#b91c1c'};
    background: ${dark ? 'rgba(220,38,38,0.08)' : '#ffffff'};
    border: 1px solid ${dark ? 'rgba(220,38,38,0.25)' : 'rgba(220,38,38,0.2)'};
    padding: 8px 16px; border-radius: 99px; cursor: pointer;
    font-family: 'Geist', sans-serif; transition: all 0.18s;
    backdrop-filter: blur(8px);
  }
  .chip:hover {
    background: ${dark ? 'rgba(220,38,38,0.18)' : 'rgba(239,68,68,0.08)'};
    border-color: ${dark ? 'rgba(220,38,38,0.5)' : 'rgba(220,38,38,0.4)'};
    transform: translateY(-2px);
    box-shadow: ${dark ? '0 4px 16px rgba(220,38,38,0.15)' : '0 4px 16px rgba(220,38,38,0.1)'};
  }

  /* ── Messages ── */
  .msg-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 28px; animation: fadeUp 0.3s ease; }

  .msg-lbl {
    font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: ${dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)'};
    padding: 0 4px;
  }
  .msg-lbl.right { text-align: right; }

  .bubble {
    padding: 13px 18px; border-radius: 18px;
    font-size: 14.5px; line-height: 1.7; max-width: 78%; word-break: break-word;
  }

  /* FIX 1: User bubble always uses red gradient (matching landing page) */
  .bubble.user {
    background: linear-gradient(135deg, #ef4444, #b91c1c);
    color: #ffffff; align-self: flex-end; border-bottom-right-radius: 5px;
    box-shadow: 0 4px 20px rgba(220,38,38,0.3);
  }

  .bubble.ai {
    background: ${dark ? 'rgba(220,38,38,0.07)' : '#ffffff'};
    color: ${dark ? 'rgba(255,255,255,0.9)' : '#1f2937'};
    align-self: flex-start; border-bottom-left-radius: 5px;
    border: 1px solid ${dark ? 'rgba(220,38,38,0.15)' : 'rgba(0,0,0,0.08)'};
    backdrop-filter: blur(12px);
    box-shadow: ${dark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.04)'};
  }

  /* FIX 2: Image inside user bubble */
  .bubble.user img {
    max-width: 260px; max-height: 200px; border-radius: 10px;
    display: block; margin-bottom: 8px;
    border: 2px solid rgba(255,255,255,0.2);
  }
  .bubble.user img:only-child { margin-bottom: 0; }

  /* ── Thinking ── */
  .thinking {
    display: flex; align-items: center; gap: 6px; padding: 13px 18px;
    background: ${dark ? 'rgba(220,38,38,0.07)' : '#ffffff'};
    border: 1px solid ${dark ? 'rgba(220,38,38,0.15)' : 'rgba(0,0,0,0.08)'};
    border-radius: 18px; border-bottom-left-radius: 5px;
    width: fit-content; margin-bottom: 28px; animation: fadeUp 0.3s ease;
    backdrop-filter: blur(12px);
  }
  .dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #dc2626;
    animation: pulse 1.3s ease infinite; opacity: 0.5;
  }
  .dot:nth-child(2) { animation-delay: 0.22s; }
  .dot:nth-child(3) { animation-delay: 0.44s; }

  /* ── Input bar ── */
  .input-zone {
    padding: 16px 28px 28px;
    background: ${dark ? 'rgba(10,0,0,0.85)' : 'rgba(255,255,255,0.8)'};
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid ${dark ? 'rgba(220,38,38,0.1)' : 'rgba(0,0,0,0.06)'};
  }

  /* FIX 3: Image preview above input row */
  .img-preview-wrap {
    max-width: 720px; margin: 0 auto 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .img-preview-inner {
    position: relative; display: inline-flex;
  }
  .img-preview-inner img {
    height: 64px; border-radius: 10px;
    border: 2px solid rgba(220,38,38,0.4);
    box-shadow: 0 2px 12px rgba(220,38,38,0.2);
  }
  .img-preview-label {
    font-size: 12px; font-weight: 500;
    color: ${dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'};
  }
  .img-remove-btn {
    position: absolute; top: -7px; right: -7px;
    background: #dc2626; color: white; border: none; border-radius: 50%;
    width: 18px; height: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 6px rgba(220,38,38,0.4); transition: background 0.15s;
  }
  .img-remove-btn:hover { background: #b91c1c; }

  .input-row {
    max-width: 720px; margin: 0 auto;
    display: flex; align-items: flex-end; gap: 10px;
    background: ${dark ? 'rgba(255,255,255,0.04)' : '#ffffff'};
    border: 1.5px solid ${dark ? 'rgba(220,38,38,0.15)' : 'rgba(0,0,0,0.1)'};
    border-radius: 16px; padding: 11px 11px 11px 18px;
    transition: border-color 0.2s, box-shadow 0.2s;
    backdrop-filter: blur(12px);
  }
  .input-row:focus-within {
    border-color: ${dark ? 'rgba(220,38,38,0.4)' : 'rgba(220,38,38,0.4)'};
    box-shadow: ${dark ? '0 0 0 4px rgba(220,38,38,0.06)' : '0 0 0 4px rgba(220,38,38,0.08)'};
  }

  .txt-input {
    flex: 1; border: none; outline: none; resize: none;
    font-size: 14.5px; font-family: 'Geist', sans-serif;
    color: ${dark ? '#ffffff' : '#111827'};
    background: transparent; padding: 4px 0; line-height: 1.55;
    max-height: 130px; overflow-y: auto;
  }
  .txt-input::placeholder { color: ${dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}; }

  .send-btn {
    width: 36px; height: 36px; border-radius: 11px; border: none; cursor: pointer; flex-shrink: 0;
    background: linear-gradient(135deg, #ef4444, #b91c1c);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s;
    box-shadow: 0 4px 14px rgba(220,38,38,0.3);
  }
  .send-btn:hover:not(:disabled) { transform: scale(1.07); box-shadow: 0 6px 20px rgba(220,38,38,0.4); }
  .send-btn:disabled { background: ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}; box-shadow: none; cursor: not-allowed; }

  .hint {
    max-width: 720px; margin: 9px auto 0;
    font-size: 11px; text-align: center; letter-spacing: 0.02em;
    color: ${dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'};
  }

  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:0.25;transform:scale(0.75)} 50%{opacity:1;transform:scale(1)} }
`

const CHIPS = [
  'Synchronous machines', "Thevenin's theorem",
  'Power factor correction', 'Op-amp virtual ground',
  'Laplace transforms', 'Bode plot basics',
]

let _id = 0
const uid = () => ++_id

export default function ChatApp() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [input, setInput] = useState('')
  const [selectedImage, setSelectedImage] = useState(null) // base64 string
  const fileInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState([{ id: 1, title: 'New chat', messages: [] }])
  const [activeId, setActiveId] = useState(1)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!token) { navigate('/auth'); return }

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/chat/history`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data && res.data.length > 0) {
          const formattedHistory = res.data.map((chat) => ({
            id: chat._id,
            title: chat.question.slice(0, 30) + '...',
            messages: [
              { role: 'user', content: chat.question, image: null },
              { role: 'ai', content: chat.answer }
            ]
          }))
          setSessions(formattedHistory)
          setActiveId(formattedHistory[0].id)
        }
      } catch (error) {
        console.error("Failed to load history", error)
      }
    }

    fetchHistory()
  }, [navigate, token])

  const active = sessions.find(s => s.id === activeId)
  const messages = active?.messages ?? []

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isLoading])

  const updateSession = (id, fn) => setSessions(p => p.map(s => s.id === id ? fn(s) : s))

  const newChat = () => {
    const id = uid()
    setSessions(p => [{ id, title: 'New chat', messages: [] }, ...p])
    setActiveId(id); setInput(''); setSelectedImage(null)
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  const deleteSession = (e, id) => {
    e.stopPropagation()
    setSessions(p => {
      const next = p.filter(s => s.id !== id)
      if (!next.length) { const f = { id: uid(), title: 'New chat', messages: [] }; setActiveId(f.id); return [f] }
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setSelectedImage(reader.result)
    reader.readAsDataURL(file)
    // reset so same file can be re-uploaded
    e.target.value = ''
  }

  const send = async (text) => {
    const q = (text ?? input).trim()
    if (!q && !selectedImage) return
    setInput('')
    setIsLoading(true)

    const imgSnapshot = selectedImage
    setSelectedImage(null)

    const title = !active?.messages.length
      ? (q || 'Image').slice(0, 38) + ((q || 'Image').length > 38 ? '…' : '')
      : undefined

    // FIX: store image alongside the message so it renders inline in the bubble
    updateSession(activeId, s => ({
      ...s,
      ...(title ? { title } : {}),
      messages: [...s.messages, { role: 'user', content: q, image: imgSnapshot }]
    }))

    try {
      const res = await axios.post(`${BASE_URL}/api/chat/ask-ai`,
        { question: q, image: imgSnapshot },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      updateSession(activeId, s => ({
        ...s,
        messages: [...s.messages, { role: 'ai', content: res.data.answer }]
      }))
    } catch (error) {
      console.error("The exact error is:", error)
      if (error.response?.status === 401) navigate('/auth')
      updateSession(activeId, s => ({
        ...s,
        messages: [...s.messages, { role: 'ai', content: 'Something went wrong. Please try again.' }]
      }))
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <>
      <style>{buildStyles(dark)}</style>
      <div className="shell">

        {/* ── Sidebar ── */}
        <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
          <div className="sidebar-top">
            <span className="sidebar-label">History</span>
            <button className="new-btn" onClick={newChat}>
              <Plus size={13} strokeWidth={2.5} /> New chat
            </button>
          </div>
          <div className="hist-list">
            {sessions.map(s => (
              <div
                key={s.id}
                className={`hist-item ${s.id === activeId ? 'active' : ''}`}
                onClick={() => setActiveId(s.id)}
              >
                <MessageSquare size={13} className="hist-icon" strokeWidth={1.8} />
                <span className="hist-txt">{s.title}</span>
                <button className="hist-del" onClick={e => deleteSession(e, s.id)}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main">

          {/* Topbar */}
          <header className="topbar">
            <button className="ghost-btn" onClick={() => setSidebarOpen(v => !v)}>
              {sidebarOpen
                ? <PanelLeftClose size={17} strokeWidth={1.8} />
                : <PanelLeftOpen size={17} strokeWidth={1.8} />
              }
            </button>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
  <div className="logo-mark">
    <Zap size={15} color="#fff" strokeWidth={2.5} />
  </div>
  <span className="app-name">GATE Tutor</span>
</Link>
            <div className="right-controls">
              <span className="pill-badge">{user.stream || 'EE'} · 2026</span>
              <button className="icon-pill" onClick={() => setDark(v => !v)}>
                {dark ? <Sun size={14} strokeWidth={2} /> : <Moon size={14} strokeWidth={2} />}
              </button>
              <button className="icon-pill" onClick={handleLogout} title="Log Out">
                <LogOut size={14} strokeWidth={2} />
              </button>
            </div>
          </header>

          {/* Chat scroll */}
          <div className="chat-scroll">
            <div className="chat-inner">
              {!messages.length && !isLoading ? (
                <div className="hero">
                  <div className="hero-orb">
                    <Zap size={26} color={dark ? '#ff6b6b' : '#dc2626'} strokeWidth={2} />
                  </div>
                  <h1 className="hero-title">Ask anything, EE edition</h1>
                  <p className="hero-sub">Your personal tutor for Electrical and Electronics Engineering concepts and GATE prep.</p>
                  <div className="chips">
                    {CHIPS.map(c => <button key={c} className="chip" onClick={() => send(c)}>{c}</button>)}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className="msg-group">
                      <span className={`msg-lbl ${msg.role === 'user' ? 'right' : ''}`}>
                        {msg.role === 'user' ? 'You' : 'Tutor'}
                      </span>
                      <div className={`bubble ${msg.role}`}>
                        {/* FIX: render image inline inside the bubble if it exists */}
                        {msg.role === 'user' && msg.image && (
                          <img src={msg.image} alt="Attached" />
                        )}
                        {msg.content && (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="thinking">
                      <div className="dot" /><div className="dot" /><div className="dot" />
                    </div>
                  )}
                  <div ref={bottomRef} />
                </>
              )}
            </div>
          </div>

          {/* Input zone */}
          <div className="input-zone">

            {/* Image preview above input row */}
            {selectedImage && (
              <div className="img-preview-wrap">
                <div className="img-preview-inner">
                  <img src={selectedImage} alt="Preview" />
                  <button className="img-remove-btn" onClick={() => setSelectedImage(null)}>
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
                <span className="img-preview-label">Image attached</span>
              </div>
            )}

            <div className="input-row">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <button
                className="ghost-btn"
                onClick={() => fileInputRef.current.click()}
                disabled={isLoading}
                title="Attach image"
              >
                <Paperclip size={18} strokeWidth={2} />
              </button>
              <textarea
                ref={inputRef}
                className="txt-input"
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask a question or upload a circuit diagram..."
                disabled={isLoading}
              />
              <button
                className="send-btn"
                onClick={() => send()}
                disabled={isLoading || (!input.trim() && !selectedImage)}
              >
                <Send size={14} color="#fff" strokeWidth={2.5} />
              </button>
            </div>

            <p className="hint">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </>
  )
}
