import { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css";

const GEMINI_API_KEY = "AIzaSyA25nTUr7IHwZdPoOmr0fQaBQWXFYpHNjc";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// System prompt untuk konteks chatbot
const SYSTEM_CONTEXT = `Kamu adalah asisten AI untuk website Analisis Spasial Vegetasi Perkotaan - Pohon Peneduh. 
Website ini berisi:
1. Peta Interaktif - berbagai tema peta (HeatMap Suhu, Humanitarian, OSM, Satelit, CyclOSM, Terrain, Hybrid) untuk visualisasi lokasi pohon peneduh
2. Visualisasi Data - grafik dan statistik kondisi pohon (sehat/tidak sehat), distribusi per lokasi, diameter pohon
3. Insight & Analisis - temuan dan rekomendasi berdasarkan data pohon peneduh termasuk efek pendinginan suhu
4. Dataset - data mentah pohon peneduh yang bisa diunduh
5. Kontak - informasi tim pengembang

Data yang tersedia mencakup: lokasi pohon, jenis (P=Pohon Peneduh, BP=Bukan Pohon), diameter, kondisi kesehatan, suhu sekitar pohon, suhu di luar naungan pohon, dan jarak dari jalan.

Jawab pertanyaan dengan ramah, informatif, dan dalam Bahasa Indonesia. Jika ditanya tentang hal di luar konteks website, tetap jawab dengan sopan tapi arahkan kembali ke topik vegetasi perkotaan jika memungkinkan.`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Halo! 👋 Saya asisten virtual untuk website Analisis Vegetasi Perkotaan. Ada yang bisa saya bantu tentang data pohon peneduh, peta interaktif, atau fitur lainnya?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input saat chat dibuka
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Siapkan history untuk konteks
      const chatHistory = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: SYSTEM_CONTEXT }],
            },
            {
              role: "model",
              parts: [
                {
                  text: "Baik, saya mengerti. Saya akan menjadi asisten untuk website Analisis Spasial Vegetasi Perkotaan dan menjawab pertanyaan seputar pohon peneduh, peta interaktif, dan fitur website lainnya.",
                },
              ],
            },
            ...chatHistory,
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const assistantMessage = data.candidates[0].content.parts[0].text;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantMessage },
        ]);
      } else if (data.error) {
        throw new Error(data.error.message || "API Error");
      } else {
        throw new Error("Tidak ada respons dari AI");
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi. 🙏",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat telah direset. Ada yang bisa saya bantu tentang website Analisis Vegetasi Perkotaan? 🌳",
      },
    ]);
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">🌳</div>
            <div className="chatbot-header-text">
              <h4>Asisten Virtual</h4>
              <span className="chatbot-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button
              className="chatbot-btn-clear"
              onClick={clearChat}
              title="Reset Chat"
            >
              🗑️
            </button>
            <button
              className="chatbot-btn-close"
              onClick={() => setIsOpen(false)}
              title="Tutup"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-message ${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="message-avatar">🤖</div>
              )}
              <div className="message-content">
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chatbot-message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input-container">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Ketik pesan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className="chatbot-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <span className="send-loading"></span>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="chatbot-footer">
          <span>Powered by Gemini AI • Vegetasi Perkotaan</span>
        </div>
      </div>

      {/* Floating Button */}
      <button
        className={`chatbot-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Tutup chat" : "Buka chat"}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
        {!isOpen && <span className="chatbot-badge">1</span>}
      </button>
    </div>
  );
}
