import { useState, useRef, useEffect } from "react"
import axios from "axios"

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: "Hello! I am your GRC Assistant. I can help you with ISO 27001, NCA ECC, and SAMA frameworks. What would you like to know?"
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
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
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: userMessage
      })
      setMessages(prev => [...prev, { role: "agent", text: response.data.reply }])
    } catch (error) {
      setMessages(prev => [...prev, { role: "agent", text: "Sorry, something went wrong. Please try again." }])
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
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>🛡️</div>
        <div>
          <div style={styles.headerTitle}>GRC AI Agent</div>
          <div style={styles.headerSub}>ISO 27001 · NCA ECC · SAMA</div>
        </div>
      </div>

      <div style={styles.messagesBox}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.messageRow,
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
          }}>
            {msg.role === "agent" && <div style={styles.avatar}>🛡️</div>}
            <div style={{
              ...styles.bubble,
              background: msg.role === "user" ? "#2563eb" : "#1e293b",
              color: "#fff",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px"
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
            <div style={styles.avatar}>🛡️</div>
            <div style={{ ...styles.bubble, background: "#1e293b", color: "#94a3b8" }}>
              Searching documents...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <textarea
          style={styles.input}
          placeholder="Ask about ISO 27001, NCA ECC, or SAMA..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button
          style={{
            ...styles.sendBtn,
            opacity: loading || !input.trim() ? 0.5 : 1
          }}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#0f172a",
    fontFamily: "sans-serif",
    maxWidth: "800px",
    margin: "0 auto"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "20px 24px",
    background: "#1e293b",
    borderBottom: "1px solid #334155"
  },
  headerIcon: { fontSize: "32px" },
  headerTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#f1f5f9"
  },
  headerSub: {
    fontSize: "12px",
    color: "#64748b"
  },
  messagesBox: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px"
  },
  avatar: {
    fontSize: "20px",
    marginBottom: "4px"
  },
  bubble: {
    maxWidth: "70%",
    padding: "12px 16px",
    fontSize: "14px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap"
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    padding: "16px 24px",
    background: "#1e293b",
    borderTop: "1px solid #334155"
  },
  input: {
    flex: 1,
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#f1f5f9",
    fontSize: "14px",
    resize: "none",
    outline: "none"
  },
  sendBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  }
}