"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "ai";
  content: string;
}

const SUGGESTIONS = [
  "Siapa GOAT",
  "kamu main crypto ga bang?",
  "Bagi tips buat punya badan keren bro",
  "Cerita dong soal Ballon d'Or lo",
];

function formatMessage(text: string) {
  const parts = text.split(/(SIUUUU+)/gi);
  return parts.map((part, i) =>
    /SIUUUU+/i.test(part) ? (
      <span key={i}>{part.toUpperCase()}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const title = messages[0].content.slice(0, 36) + (messages[0].content.length > 36 ? "..." : "");
      const session: ChatSession = { id: Date.now().toString(), title, messages };
      setHistory((prev) => [session, ...prev]);
    }
    setMessages([]);
    setInput("");
    setActiveId(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setActiveId(session.id);
    setSidebarOpen(false);
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");
      setMessages([...newMessages, { role: "ai", content: data.message }]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setMessages([
        ...newMessages,
        { role: "ai", content: `Aduh, ada error bro! ${errorMsg} Tapi CR7 gak pernah menyerah! SIUUUU` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const AiAvatar = () => (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", overflow: "hidden",
      flexShrink: 0, border: "1.5px solid #e8ddd4"
    }}>
      <Image src="/ronaldo.jpg" alt="CR7" width={32} height={32}
        style={{ objectFit: "cover", width: "100%", height: "100%" }} />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #f5efe8;
          color: #2c2420;
          height: 100vh;
          overflow: hidden;
        }

        .layout {
          display: flex;
          height: 100vh;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: #ede5db;
          border-right: 1px solid #ddd4c8;
          display: flex;
          flex-direction: column;
          padding: 20px 16px;
          flex-shrink: 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          padding: 4px 8px;
        }

        .logo-avatar {
          width: 34px; height: 34px; border-radius: 50%; overflow: hidden;
          border: 2px solid #c8502a;
        }

        .logo-text {
          font-family: 'Lora', serif;
          font-size: 17px;
          font-weight: 500;
          color: #2c2420;
          letter-spacing: -0.01em;
        }

        .logo-sub {
          font-size: 10px;
          color: #9a8a80;
          font-weight: 300;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .new-chat-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
          padding: 7px 14px;
          background: transparent;
          color: #2c2420;
          border: 1px solid #ddd4c8;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
          letter-spacing: 0.01em;
          margin-bottom: 20px;
        }

        .new-chat-btn:hover { background: #e8ddd4; border-color: #ccc4bc; }

        .sidebar-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #b0a098;
          font-weight: 500;
          padding: 0 6px;
          margin-bottom: 8px;
        }

        .sidebar-empty {
          font-size: 13px;
          color: #c0b0a8;
          padding: 0 6px;
          font-style: italic;
        }

        .history-item {
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 12.5px;
          color: #5a4a42;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: background 0.15s;
        }

        .history-item:hover { background: #e0d4ca; }
        .history-item.active { background: #ddd0c6; font-weight: 500; }

        /* Main chat area */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #f5efe8;
        }

        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid #e5dbd2;
        }

        .top-bar-title {
          font-family: 'Lora', serif;
          font-size: 16px;
          font-weight: 500;
          color: #2c2420;
        }

        .badge {
          font-size: 11px;
          background: #fdf0ea;
          color: #c8502a;
          border: 1px solid #f0d8cc;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.04em;
          font-weight: 500;
        }

        /* Chat scroll */
        .chat-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 32px 0;
          scroll-behavior: smooth;
        }

        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #d8cec6; border-radius: 4px; }

        .messages-inner {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Welcome */
        .welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 200px);
          text-align: center;
          padding: 40px 24px;
          gap: 20px;
          animation: fadeUp 0.5s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .welcome-avatar {
          width: 72px; height: 72px; border-radius: 50%; overflow: hidden;
          border: 3px solid #e8ddd4;
          box-shadow: 0 4px 20px rgba(200,80,42,0.15);
        }

        .welcome-title {
          font-family: 'Lora', serif;
          font-size: 28px;
          font-weight: 500;
          color: #2c2420;
          letter-spacing: -0.02em;
        }

        .welcome-sub {
          font-size: 14.5px;
          color: #7a6a60;
          max-width: 380px;
          line-height: 1.6;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 8px;
          max-width: 480px;
        }

        .chip {
          padding: 9px 16px;
          background: #fff;
          border: 1px solid #e0d4ca;
          border-radius: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #4a3a32;
          cursor: pointer;
          transition: all 0.18s;
        }

        .chip:hover {
          background: #c8502a;
          color: #fff;
          border-color: #c8502a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(200,80,42,0.2);
        }

        /* Messages */
        .msg-row {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          animation: fadeUp 0.3s ease;
        }

        .msg-row.user { flex-direction: row-reverse; }

        .bubble {
          max-width: 76%;
          padding: 13px 17px;
          border-radius: 16px;
          font-size: 14.5px;
          line-height: 1.65;
          letter-spacing: 0.005em;
        }

        .bubble.ai {
          background: #fff;
          color: #2c2420;
          border: 1px solid #e8ddd4;
          border-top-left-radius: 4px;
          box-shadow: 0 1px 6px rgba(44,36,32,0.06);
        }

        .bubble.user {
          background: #c8502a;
          color: #fff;
          border-top-right-radius: 4px;
        }

        .avatar-user {
          width: 32px; height: 32px; border-radius: 50%;
          background: #e8ddd4;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        /* Typing dots */
        .typing {
          display: flex; gap: 5px; align-items: center; padding: 4px 2px;
        }
        .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #c8b0a4;
          animation: bounce 1.2s ease-in-out infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* Input */
        .input-area {
          padding: 16px 32px 24px;
          border-top: 1px solid #e5dbd2;
          background: #f5efe8;
        }

        .input-box {
          max-width: 700px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid #e0d4ca;
          border-radius: 16px;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          padding: 12px 14px;
          box-shadow: 0 2px 12px rgba(44,36,32,0.07);
          transition: border-color 0.18s, box-shadow 0.18s;
        }

        .input-box:focus-within {
          border-color: #c8502a;
          box-shadow: 0 2px 16px rgba(200,80,42,0.12);
        }

        textarea {
          flex: 1;
          border: none;
          outline: none;
          resize: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          color: #2c2420;
          line-height: 1.55;
          max-height: 120px;
          overflow-y: auto;
        }

        textarea::placeholder { color: #c0b0a8; }

        .send-btn {
          width: 36px; height: 36px; border-radius: 10px;
          background: #c8502a;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 16px;
          flex-shrink: 0;
          transition: background 0.18s, transform 0.12s;
        }

        .send-btn:hover:not(:disabled) { background: #b34425; transform: scale(1.05); }
        .send-btn:disabled { background: #e0d4ca; cursor: not-allowed; }

        .input-hint {
          max-width: 700px;
          margin: 8px auto 0;
          font-size: 11.5px;
          color: #c0b0a8;
          text-align: center;
          letter-spacing: 0.02em;
        }

        .input-hint span { color: #a89080; font-weight: 500; }

        .credit {
          position: fixed;
          bottom: 14px;
          right: 20px;
          font-size: 11px;
          color: #c8b8b0;
          letter-spacing: 0.04em;
          font-style: italic;
          pointer-events: none;
          font-family: 'Lora', serif;
        }

        /* Mobile overlay */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(44,36,32,0.35);
          z-index: 40;
        }

        .hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: #2c2420;
          font-size: 20px;
          line-height: 1;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .hamburger:hover { background: #e8ddd4; }

        @media (max-width: 640px) {
          body {
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
          }

          .layout {
            height: 100dvh;
          }

          .sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            width: 240px;
            box-shadow: 4px 0 24px rgba(44,36,32,0.12);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay.visible {
            display: block;
          }

          .hamburger {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .top-bar {
            padding: 14px 16px;
            flex-shrink: 0;
          }

          .input-area {
            padding: 12px 16px 16px;
            flex-shrink: 0;
          }

          .messages-inner {
            padding: 0 16px;
          }

          .welcome {
            padding: 32px 20px;
            min-height: unset;
          }

          .bubble {
            max-width: 88%;
            font-size: 14px;
          }

          .input-hint {
            display: none;
          }

          .credit {
            display: none;
          }
        }
      `}</style>

      <div className="layout">
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-avatar">
              <Image src="/ronaldo.jpg" alt="CR7" width={34} height={34}
                style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
            <div>
              <div className="logo-text">CR7 AI</div>
              <div className="logo-sub">by Mr. Mawan</div>
            </div>
          </div>

          <button className="new-chat-btn" onClick={handleNewChat}>
            ✏️ New Chat
          </button>

          <div className="sidebar-label">History</div>
          {history.length === 0 ? (
            <div className="sidebar-empty">Belum ada chat</div>
          ) : (
            history.map((s) => (
              <div
                key={s.id}
                className={`history-item ${activeId === s.id ? "active" : ""}`}
                onClick={() => loadSession(s)}
              >
                {s.title}
              </div>
            ))
          )}
        </aside>

        {/* Main */}
        <main className="main">
          <div className="top-bar">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="hamburger" onClick={() => setSidebarOpen(true)} title="Menu">
                ☰
              </button>
              <span className="top-bar-title">CR7 AI</span>
            </div>
          
          </div>

          <div className="chat-scroll">
            {messages.length === 0 && !isLoading ? (
              <div className="welcome">
                <div className="welcome-avatar">
                  <Image src="/ronaldo.jpg" alt="CR7" width={72} height={72}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </div>
                <div className="welcome-title">Halo, gue CR7! 👋</div>
                <p className="welcome-sub">
                  Tanya apa aja ke gue — manusia tersempurna di galaxy ini.
                  Dijamin jawaban gue lebih keren dari Messi. 😏
                </p>
                <div className="chips">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="chip" onClick={() => sendMessage(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="messages-inner">
                {messages.map((msg, i) => (
                  <div key={i} className={`msg-row ${msg.role}`}>
                    {msg.role === "ai" ? (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1.5px solid #e8ddd4" }}>
                        <Image src="/ronaldo.jpg" alt="CR7" width={32} height={32}
                          style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      </div>
                    ) : (
                      <div className="avatar-user">👤</div>
                    )}
                    <div className={`bubble ${msg.role}`}>
                      {msg.role === "ai" ? formatMessage(msg.content) : msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="msg-row ai">
                    <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1.5px solid #e8ddd4" }}>
                      <Image src="/ronaldo.jpg" alt="CR7" width={32} height={32}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                    </div>
                    <div className="bubble ai">
                      <div className="typing">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          <div className="input-area">
            <div className="input-box">
              <textarea
                ref={textareaRef}
                placeholder="Tanya CR7 sesuatu..."
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                title="Kirim pesan"
              >
                ➤
              </button>
            </div>
            <p className="input-hint">
              Tekan <span>Enter</span> untuk kirim · <span>Shift+Enter</span> untuk baris baru
            </p>
          </div>
        </main>
      </div>
      <div className="credit">by Mawan ✦</div>
    </>
  );
}