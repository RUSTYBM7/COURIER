import { useState, useRef, useEffect } from "react";
import { AppNav } from "@/components/AppNav";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, Search, MoreHorizontal, Phone, Video } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  time: string;
}

const CONTACTS = [
  { id: 1, name: "Airpak Assistant", subtitle: "AI Support · Online", initial: "A", color: "var(--apple-blue)", active: true },
  { id: 2, name: "Billing Support", subtitle: "Last message 2h ago", initial: "B", color: "var(--apple-green)" },
  { id: 3, name: "Customs Team", subtitle: "Last message 1d ago", initial: "C", color: "var(--apple-purple)" },
];

const QUICK_ACTIONS = ["Track a package", "Get a quote", "File a claim", "Contact support"];

const BOT_RESPONSES: Record<string, string> = {
  default: "I'm here to help! You can ask about tracking, quotes, billing, or any other Airpak Express service.",
  track: "Please provide your tracking number (format: APX-YYYY-NNN) and I'll look it up right away.",
  quote: "To get a quote, I need: origin postcode, destination country, package weight (kg), and dimensions (cm). Please share those details.",
  claim: "I'm sorry to hear about the issue. Please provide your tracking number and describe the problem. I'll escalate to our claims team immediately.",
  support: "Connecting you to a human agent… Average wait time is under 3 minutes. You can also reach us at support@airpak-express.site.",
};

function getBotReply(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("track")) return BOT_RESPONSES.track;
  if (lower.includes("quote") || lower.includes("price")) return BOT_RESPONSES.quote;
  if (lower.includes("claim") || lower.includes("lost") || lower.includes("damage")) return BOT_RESPONSES.claim;
  if (lower.includes("human") || lower.includes("agent") || lower.includes("support")) return BOT_RESPONSES.support;
  return BOT_RESPONSES.default;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "bot", text: "Hi there! I'm your Airpak Express assistant. How can I help you today?", time: formatTime(new Date()) },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [activeContact, setActiveContact] = useState(1);
  const [searchContacts, setSearchContacts] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim(), time: formatTime(new Date()) };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    setTyping(false);
    const botMsg: Message = { id: Date.now() + 1, role: "bot", text: getBotReply(text), time: formatTime(new Date()) };
    setMessages(prev => [...prev, botMsg]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--apple-bg)" }}>
      <AppNav variant="app" showSidebar sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="dashboard-layout" style={{ paddingTop: "var(--nav-height)" }}>
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main id="main-content" style={{ flex: 1, display: "flex", height: "calc(100vh - var(--nav-height))", overflow: "hidden" }}>
          {/* Contacts List */}
          <aside style={{ width: 280, minWidth: 280, borderRight: "1px solid var(--apple-separator)", display: "flex", flexDirection: "column", background: "var(--apple-bg-secondary)" }} aria-label="Conversations list">
            <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--apple-separator)" }}>
              <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-bold)", marginBottom: 12 }}>Messages</h2>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--apple-label-tertiary)" }} aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search conversations…"
                  aria-label="Search conversations"
                  value={searchContacts}
                  onChange={e => setSearchContacts(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 32, height: 36, fontSize: "var(--text-sm)" }}
                />
              </div>
            </div>
            <nav style={{ flex: 1, overflowY: "auto" }} aria-label="Conversations">
              {CONTACTS.filter(c => c.name.toLowerCase().includes(searchContacts.toLowerCase())).map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setActiveContact(contact.id)}
                  aria-pressed={activeContact === contact.id}
                  style={{
                    width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
                    background: activeContact === contact.id ? "var(--apple-fill)" : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                    borderBottom: "1px solid var(--apple-separator)",
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: contact.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "var(--font-bold)", fontSize: "var(--text-lg)", flexShrink: 0 }} aria-hidden="true">{contact.initial}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "var(--font-semibold)", fontSize: "var(--text-sm)", marginBottom: 2 }}>{contact.name}</div>
                    <div style={{ color: "var(--apple-label-secondary)", fontSize: "var(--text-xs)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.subtitle}</div>
                  </div>
                  {contact.active && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--apple-green)", flexShrink: 0 }} aria-label="Online" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* Chat Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Chat Header */}
            <header style={{ padding: "12px 20px", borderBottom: "1px solid var(--apple-separator)", display: "flex", alignItems: "center", gap: 12, background: "var(--apple-bg-secondary)" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--apple-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "var(--font-bold)" }} aria-hidden="true">A</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "var(--font-semibold)" }}>Airpak Assistant</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--apple-green)", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} aria-hidden="true" />
                  Online · Ready to help
                </div>
              </div>
              <button className="nav-icon" aria-label="Voice call"><Phone size={18} aria-hidden="true" /></button>
              <button className="nav-icon" aria-label="Video call"><Video size={18} aria-hidden="true" /></button>
              <button className="nav-icon" aria-label="More options"><MoreHorizontal size={18} aria-hidden="true" /></button>
            </header>

            {/* Messages */}
            <div role="log" aria-label="Chat messages" aria-live="polite" style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Quick actions */}
              {messages.length === 1 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} aria-label="Quick actions">
                  {QUICK_ACTIONS.map(action => (
                    <button
                      key={action}
                      className="btn-secondary"
                      style={{ fontSize: "var(--text-sm)", padding: "6px 14px" }}
                      onClick={() => sendMessage(action)}
                    >{action}</button>
                  ))}
                </div>
              )}

              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    alignItems: "flex-end", gap: 8,
                  }}
                >
                  {msg.role === "bot" && (
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--apple-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "var(--text-sm)", fontWeight: "var(--font-bold)", flexShrink: 0 }} aria-hidden="true">A</div>
                  )}
                  <div
                    style={{
                      maxWidth: "68%", padding: "10px 14px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: msg.role === "user" ? "var(--apple-blue)" : "var(--apple-fill)",
                      color: msg.role === "user" ? "white" : "var(--apple-label)",
                      fontSize: "var(--text-md)", lineHeight: 1.5,
                    }}
                    role="article"
                    aria-label={`${msg.role === "user" ? "You" : "Airpak Assistant"} at ${msg.time}: ${msg.text}`}
                  >
                    {msg.text}
                    <div style={{ fontSize: "var(--text-xs)", opacity: 0.6, marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</div>
                  </div>
                </div>
              ))}

              {typing && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }} aria-label="Airpak Assistant is typing">
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--apple-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "var(--text-sm)", fontWeight: "var(--font-bold)" }} aria-hidden="true">A</div>
                  <div style={{ padding: "10px 16px", borderRadius: "18px 18px 18px 4px", background: "var(--apple-fill)", display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--apple-gray)", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--apple-separator)", background: "var(--apple-bg-secondary)", display: "flex", gap: 10, alignItems: "flex-end" }}>
              <button className="nav-icon" aria-label="Attach file"><Paperclip size={18} aria-hidden="true" /></button>
              <label className="sr-only" htmlFor="chat-input">Message Airpak Assistant</label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send)"
                rows={1}
                style={{
                  flex: 1, resize: "none", border: "1.5px solid var(--apple-separator)", borderRadius: 20,
                  padding: "10px 16px", fontSize: "var(--text-md)", fontFamily: "inherit",
                  background: "var(--apple-fill-tertiary)", color: "var(--apple-label)",
                  maxHeight: 120, lineHeight: 1.5, outline: "none",
                }}
                aria-label="Message input"
              />
              <button className="nav-icon" aria-label="Emoji"><Smile size={18} aria-hidden="true" /></button>
              <button
                className="btn-primary"
                style={{ borderRadius: "50%", width: 40, height: 40, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
      `}</style>
    </div>
  );
}
