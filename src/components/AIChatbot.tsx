"use client"
import React, { useRef, useEffect, useState } from "react";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant" | "system"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState<'gemini' | 'openai'>("gemini");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Detect dark mode (prefers-color-scheme)
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(match.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    match.addEventListener('change', handler);
    return () => match.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);
    setError("");
    try {
      let aiMessage = "";
      if (provider === "gemini") {
        const result = await generateText({
          model: google("models/gemini-2.0-flash-exp"),
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: input },
          ],
        });
        aiMessage = result.text || "";
        setMessages((prev) => [...prev, { role: "assistant", content: aiMessage }]);
      } else if (provider === "openai") {
        // Stream from /api/chat-openai
        let streamed = "";
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
        const res = await fetch("/api/chat-openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: input },
          ] })
        });
        if (!res.body) throw new Error("No response body");
        const reader = res.body.getReader();
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = new TextDecoder().decode(value);
            streamed += chunk;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: streamed };
              return updated;
            });
          }
        }
      }
    } catch (err: any) {
      setError("Failed to get response. Please try again.");
    }
    setInput("");
    setLoading(false);
  };

  // Color palette for dark/light
  const palette = isDark
    ? {
        bg: "#181c23",
        border: "#23272f",
        headerBg: "#23272f",
        headerText: "#fff",
        userBubble: "#0070f3",
        userText: "#fff",
        aiBubble: "#23272f",
        aiText: "#e2e8f0",
        inputBg: "#23272f",
        inputText: "#fff",
        inputBorder: "#333a45",
        sendBg: "#0070f3",
        sendBgDisabled: "#2d3748",
        sendText: "#fff",
        placeholder: "#7b8494",
        spinner: "#0070f3",
        spinnerBg: "#23272f"
      }
    : {
        bg: "#fff",
        border: "#e0e0e0",
        headerBg: "#f8fafc",
        headerText: "#222",
        userBubble: "#0070f3",
        userText: "#fff",
        aiBubble: "#f1f5f9",
        aiText: "#222",
        inputBg: "#fff",
        inputText: "#222",
        inputBorder: "#e0e0e0",
        sendBg: "#0070f3",
        sendBgDisabled: "#b3d4fc",
        sendText: "#fff",
        placeholder: "#888",
        spinner: "#0070f3",
        spinnerBg: "#f1f5f9"
      };

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${palette.border}`, padding: 0, background: palette.bg, maxWidth: 420, margin: "0 auto", boxShadow: isDark ? "0 4px 24px 0 rgba(0,0,0,0.32)" : "0 4px 24px 0 rgba(0,0,0,0.08)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 24px 12px 24px", borderBottom: `1px solid ${palette.border}`, background: palette.headerBg, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <span style={{ fontSize: 28, color: palette.sendBg }}>🤖</span>
        <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: -1, color: palette.headerText }}>{provider === 'gemini' ? 'Eric Chatbot (Gemini)' : 'Eric Chatbot (OpenAI)'}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => setProvider('gemini')}
            style={{ background: provider === 'gemini' ? palette.sendBg : palette.headerBg, color: provider === 'gemini' ? '#fff' : palette.headerText, border: `1.5px solid ${palette.inputBorder}`, borderRadius: 8, padding: '4px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
            disabled={loading}
          >
            Gemini
          </button>
          <button
            onClick={() => setProvider('openai')}
            style={{ background: provider === 'openai' ? palette.sendBg : palette.headerBg, color: provider === 'openai' ? '#fff' : palette.headerText, border: `1.5px solid ${palette.inputBorder}`, borderRadius: 8, padding: '4px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
            disabled={loading}
          >
            OpenAI
          </button>
        </div>
      </div>
      {/* Chat area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px 0 24px", minHeight: 220, maxHeight: 320, background: palette.bg }}>
        {messages.length === 0 && <div style={{ color: palette.placeholder, textAlign: "center", marginTop: 40 }}>Start the conversation...</div>}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div
              style={{
                background: msg.role === "user" ? palette.userBubble : palette.aiBubble,
                color: msg.role === "user" ? palette.userText : palette.aiText,
                borderRadius: 16,
                padding: "10px 16px",
                maxWidth: "80%",
                fontSize: 15,
                boxShadow: msg.role === "user" ? (isDark ? "0 2px 8px 0 rgba(0,112,243,0.18)" : "0 2px 8px 0 rgba(0,112,243,0.08)") : (isDark ? "0 2px 8px 0 rgba(0,0,0,0.18)" : "0 2px 8px 0 rgba(0,0,0,0.04)"),
                borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                borderBottomLeftRadius: msg.role === "assistant" ? 4 : 16,
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
            <div style={{ background: palette.aiBubble, color: palette.aiText, borderRadius: 16, padding: "10px 16px", fontSize: 15, maxWidth: "80%", display: "flex", alignItems: "center", gap: 8 }}>
              <span className="spinner" style={{ width: 16, height: 16, border: `2px solid ${palette.spinner}`, borderTop: `2px solid ${palette.spinnerBg}`, borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite" }} />
              AI is typing...
            </div>
          </div>
        )}
        {error && <div style={{ color: "#ff6b6b", textAlign: "center", marginTop: 8 }}>{error}</div>}
        <div ref={chatEndRef} />
      </div>
      {/* Input area */}
      <form
        onSubmit={e => { e.preventDefault(); handleSend(); }}
        style={{ display: "flex", gap: 10, padding: "18px 24px 20px 24px", borderTop: `1px solid ${palette.border}`, background: palette.headerBg, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !loading) handleSend(); }}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${palette.inputBorder}`, fontSize: 16, outline: "none", background: palette.inputBg, color: palette.inputText }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: loading || !input.trim() ? palette.sendBgDisabled : palette.sendBg, color: palette.sendText, fontWeight: 600, fontSize: 16, cursor: loading || !input.trim() ? "not-allowed" : "pointer", transition: "background 0.2s" }}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIChatbot; 