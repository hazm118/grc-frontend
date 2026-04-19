import { useState, useRef, useEffect } from "react"
import axios from "axios"

const MODES = [
  { id: "auto", label: "🤖 Auto Detect" },
  { id: "control", label: "🔍 Control Mapping" },
  { id: "risk", label: "⚠️ Risk Scoring" },
  { id: "gap", label: "📊 Gap Analysis" },
  { id: "audit", label: "🎯 Audit Mode" },
]

const quickPrompts = [
  "We use AWS S3 with no encryption",
  "We share passwords between employees",
  "simulate audit",
  "We have antivirus but no backup policy",
]

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: "Welcome to GRC Decision Assistant 🛡️\n\nI can help you with:\n🔍 Control Mapping — describe your tech stack\n⚠️ Risk Scoring — describe a situation\n📊 Gap Analysis — describe your current security\n🎯 Audit Mode — type 'simulate audit'\n\nPowered by ISO 27001 · NCA ECC-2:2024 · SAMA"
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeMode, setActiveMode] = useState("auto")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: userMessage }])
    setLoading(true)
    setSidebarOpen(false)
    try {
      const response = await axios.post("https://grc-agent-api.onrender.com/chat", {
        message: userMessage
      })
      setMessages(prev => [...prev, { role: "agent", text: response.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: "agent", text: "⚠️ Connection error. Please try again." }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100dvh",
      width: "100vw",
      background: "#0a0f1e",
      fontFamily: "'Segoe UI', sans-serif",
      overflow: "hidden"
    }}>

      {/* TOP HEADER — always visible */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "#0d1426",
        borderBottom: "1px solid #1e2d4a",
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: "transparent",
            border: "none",
            color: "#4da6ff",
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px"
          }}>☰</button>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>🛡️ GRC Assistant</div>
            <div style={{ fontSize: "10px", color: "#4a6fa5" }}>ISO 27001 · NCA ECC · SAMA</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["ISO", "ECC", "SAMA"].map(tag => (
            <span key={tag} style={{
              padding: "3px 8px",
              borderRadius: "20px",
              fontSize: "10px",
              background: "#1a2d4a",
              color: "#4da6ff",
              border: "1px solid #1e3a5a"
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* SIDEBAR OVERLAY — slides in on mobile */}
      {sidebarOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 100,
          display: "flex"
        }}>
          {/* Backdrop */}
          <div onClick={() => setSidebarOpen(false)} style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)"
          }} />

          {/* Sidebar panel */}
          <div style={{
            position: "relative",
            width: "280px",
            background: "#0d1426",
            borderRight: "1px solid #1e2d4a",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            zIndex: 101
          }}>
            <div style={{ padding: "20px 16px", borderBottom: "1px solid #1e2d4a" }}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>🛡️ GRC Assistant</div>
              <div style={{ fontSize: "11px", color: "#4a6fa5" }}>Enterprise Decision Tool</div>
            </div>

            {/* Modes */}
            <div style={{ padding: "16px 12px" }}>
              <div style={{ fontSize: "11px", color: "#4a6fa5", marginBottom: "8px", paddingLeft: "8px", letterSpacing: "1px" }}>MODES</div>
              {MODES.map(mode => (
                <button key={mode.id} onClick={() => { setActiveMode(mode.id); setSidebarOpen(false) }} style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: activeMode === mode.id ? "#1a2d4a" : "transparent",
                  color: activeMode === mode.id ? "#4da6ff" : "#8899aa",
                  fontSize: "13px",
                  cursor: "pointer",
                  marginBottom: "4px",
                  borderLeft: activeMode === mode.id ? "3px solid #4da6ff" : "3px solid transparent"
                }}>{mode.label}</button>
              ))}
            </div>

            {/* Frameworks */}
            <div style={{ padding: "16px 12px", borderTop: "1px solid #1e2d4a" }}>
              <div style={{ fontSize: "11px", color: "#4a6fa5", marginBottom: "12px", paddingLeft: "8px", letterSpacing: "1px" }}>LOADED FRAMEWORKS</div>
              {[
                { name: "ISO 27001:2022", color: "#2563eb" },
                { name: "NCA ECC-2:2024", color: "#16a34a" },
                { name: "SAMA CSF", color: "#9333ea" },
              ].map(f => (
                <div key={f.name} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", marginBottom: "4px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "#6688aa" }}>{f.name}</span>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div style={{ padding: "16px 12px", borderTop: "1px solid #1e2d4a" }}>
              <div style={{ fontSize: "11px", color: "#4a6fa5", marginBottom: "8px", paddingLeft: "8px", letterSpacing: "1px" }}>QUICK PROMPTS</div>
              {quickPrompts.map((prompt, i) => (
                <button key={i} onClick={() => { setInput(prompt); setSidebarOpen(false) }} style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  border: "1px solid #1e2d4a",
                  background: "transparent",
                  color: "#6688aa",
                  fontSize: "11px",
                  cursor: "pointer",
                  marginBottom: "6px",
                  lineHeight: "1.4"
                }}>{prompt}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MESSAGES AREA */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            gap: "8px",
            alignItems: "flex-start"
          }}>
            {msg.role === "agent" && (
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "#1a2d4a", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "14px", flexShrink: 0
              }}>🛡️</div>
            )}
            <div style={{
              maxWidth: "80%",
              padding: "12px 14px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user" ? "#2563eb" : "#111827",
              color: "#e2e8f0",
              fontSize: "14px",
              lineHeight: "1.7",
              whiteSpace: "pre-wrap",
              border: msg.role === "agent" ? "1px solid #1e2d4a" : "none"
            }}>
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "#2563eb", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "700", color: "#fff", flexShrink: 0
              }}>U</div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "#1a2d4a", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "14px"
            }}>🛡️</div>
            <div style={{
              padding: "12px 14px", borderRadius: "16px 16px 16px 4px",
              background: "#111827", border: "1px solid #1e2d4a",
              color: "#4a6fa5", fontSize: "14px"
            }}>Searching frameworks...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR — pinned to bottom */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid #1e2d4a",
        background: "#0d1426",
        flexShrink: 0
      }}>
        <div style={{
          display: "flex",
          gap: "8px",
          background: "#111827",
          border: "1px solid #1e2d4a",
          borderRadius: "12px",
          padding: "4px 4px 4px 14px",
          alignItems: "flex-end"
        }}>
          <textarea
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              fontSize: "14px",
              resize: "none",
              padding: "10px 0",
              maxHeight: "100px",
              lineHeight: "1.5"
            }}
            placeholder="Ask about ISO 27001, NCA ECC, or SAMA..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
            background: loading || !input.trim() ? "#1e2d4a" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            margin: "4px",
            whiteSpace: "nowrap"
          }}>
            {loading ? "..." : "Send →"}
          </button>
        </div>
        <div style={{ fontSize: "10px", color: "#2a3a4a", marginTop: "6px", textAlign: "center" }}>
          ISO 27001 · NCA ECC-2:2024 · SAMA
        </div>
      </div>
    </div>
  )
}