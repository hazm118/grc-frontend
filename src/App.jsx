import { useState, useRef, useEffect } from "react"
import axios from "axios"

const MODES = [
  { id: "auto", label: "🤖 Auto Detect" },
  { id: "control", label: "🔍 Control Mapping" },
  { id: "risk", label: "⚠️ Risk Scoring" },
  { id: "gap", label: "📊 Gap Analysis" },
  { id: "audit", label: "🎯 Audit Mode" },
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
    try {
      const response = await axios.post("https://grc-agent-api.onrender.com/chat", {
        message: userMessage
      })
      setMessages(prev => [...prev, { role: "agent", text: response.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: "agent", text: "⚠️ Connection error. Make sure the backend is running." }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickPrompts = [
    "We use AWS S3 with no encryption",
    "We share passwords between employees",
    "simulate audit",
    "We have antivirus but no backup policy",
  ]

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#0a0f1e",
      fontFamily: "'Segoe UI', sans-serif",
      overflow: "hidden"
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: "260px",
        minWidth: "260px",
        background: "#0d1426",
        borderRight: "1px solid #1e2d4a",
        display: "flex",
        flexDirection: "column",
        padding: "0"
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px 20px",
          borderBottom: "1px solid #1e2d4a"
        }}>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>
            🛡️ GRC Assistant
          </div>
          <div style={{ fontSize: "11px", color: "#4a6fa5", marginTop: "4px" }}>
            Enterprise Decision Tool
          </div>
        </div>

        {/* Modes */}
        <div style={{ padding: "16px 12px" }}>
          <div style={{ fontSize: "11px", color: "#4a6fa5", marginBottom: "8px", paddingLeft: "8px", letterSpacing: "1px" }}>
            MODES
          </div>
          {MODES.map(mode => (
            <button key={mode.id} onClick={() => setActiveMode(mode.id)} style={{
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
            }}>
              {mode.label}
            </button>
          ))}
        </div>

        {/* Frameworks */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid #1e2d4a" }}>
          <div style={{ fontSize: "11px", color: "#4a6fa5", marginBottom: "12px", paddingLeft: "8px", letterSpacing: "1px" }}>
            LOADED FRAMEWORKS
          </div>
          {[
            { name: "ISO 27001:2022", color: "#2563eb" },
            { name: "NCA ECC-2:2024", color: "#16a34a" },
            { name: "SAMA CSF", color: "#9333ea" },
          ].map(f => (
            <div key={f.name} style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 8px",
              marginBottom: "4px"
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: f.color, flexShrink: 0
              }} />
              <span style={{ fontSize: "12px", color: "#6688aa" }}>{f.name}</span>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid #1e2d4a", flex: 1 }}>
          <div style={{ fontSize: "11px", color: "#4a6fa5", marginBottom: "8px", paddingLeft: "8px", letterSpacing: "1px" }}>
            QUICK PROMPTS
          </div>
          {quickPrompts.map((prompt, i) => (
            <button key={i} onClick={() => setInput(prompt)} style={{
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
            }}>
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>

        {/* Header */}
        <div style={{
          padding: "16px 28px",
          borderBottom: "1px solid #1e2d4a",
          background: "#0d1426",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#fff" }}>
              GRC Decision Assistant
            </div>
            <div style={{ fontSize: "12px", color: "#4a6fa5" }}>
              Powered by real framework documents · RAG enabled
            </div>
          </div>
          <div style={{
            display: "flex", gap: "8px"
          }}>
            {["ISO 27001", "NCA ECC", "SAMA"].map(tag => (
              <span key={tag} style={{
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "11px",
                background: "#1a2d4a",
                color: "#4da6ff",
                border: "1px solid #1e3a5a"
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: "12px",
              alignItems: "flex-start"
            }}>
              {msg.role === "agent" && (
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "#1a2d4a", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "16px", flexShrink: 0
                }}>🛡️</div>
              )}
              <div style={{
                maxWidth: "70%",
                padding: "14px 18px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
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
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "#2563eb", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: "700", color: "#fff",
                  flexShrink: 0
                }}>U</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "#1a2d4a", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "16px"
              }}>🛡️</div>
              <div style={{
                padding: "14px 18px", borderRadius: "18px 18px 18px 4px",
                background: "#111827", border: "1px solid #1e2d4a",
                color: "#4a6fa5", fontSize: "14px"
              }}>
                Searching frameworks...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "20px 28px",
          borderTop: "1px solid #1e2d4a",
          background: "#0d1426"
        }}>
          <div style={{
            display: "flex",
            gap: "12px",
            background: "#111827",
            border: "1px solid #1e2d4a",
            borderRadius: "14px",
            padding: "4px 4px 4px 16px",
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
                padding: "12px 0",
                maxHeight: "120px",
                lineHeight: "1.5"
              }}
              placeholder="Describe your scenario, system, or type 'simulate audit'..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
              background: loading || !input.trim() ? "#1e2d4a" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              margin: "4px",
              transition: "background 0.2s"
            }}>
              {loading ? "..." : "Send →"}
            </button>
          </div>
          <div style={{ fontSize: "11px", color: "#2a3a4a", marginTop: "8px", textAlign: "center" }}>
            Answers sourced from real framework documents · ISO 27001 · NCA ECC-2:2024 · SAMA
          </div>
        </div>
      </div>
    </div>
  )
}