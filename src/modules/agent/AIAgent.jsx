import { useEffect, useState, useRef } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import GlassPanel from "../../components/ui/GlassPanel";

const PROMPTS = [
  "Analyzing market structure...",
  "Scanning liquidity shifts...",
  "Detecting whale activity...",
  "Building trade hypothesis...",
];

export default function AIAgent() {
  const [displayText, setDisplayText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to Neon AI Terminal. Ask me anything about Solana markets.",
    },
  ]);

  const chatContainerRef = useRef(null);

  // Auto-scroll yang lebih agresif
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Typing animation logic
  useEffect(() => {
    let i = 0;
    const current = PROMPTS[promptIndex];
    const interval = setInterval(() => {
      setDisplayText(current.slice(0, i));
      i++;
      if (i > current.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPromptIndex((prev) =>
            prev === PROMPTS.length - 1 ? 0 : prev + 1,
          );
        }, 1500);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [promptIndex]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const currentInput = input;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const thinkingId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: thinkingId, role: "assistant", content: "Analyzing..." },
    ]);

    // Simulasi respons (ganti dengan logic generateAIResponse kamu)
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingId
            ? { ...msg, content: `Analysis complete for: ${currentInput}` }
            : msg,
        ),
      );
    }, 1000);
  };

  return (
    /* h-full dan min-h-0 di sini sangat penting agar flexbox bekerja */
    <div className="flex flex-col h-full min-h-0 overflow-hidden gap-4">
      {/* HEADER: Pakai shrink-0 agar tidak gepeng */}
      <div className="flex items-center justify-between shrink-0 p-1">
        <div>
          <h1 className="text-3xl font-bold text-[#00ffa3]">AI Agent</h1>
          <p className="text-slate-400 text-sm">Institutional AI assistant</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
          <Sparkles size={16} className="text-cyan-400" />
          <span className="text-cyan-300 text-xs font-bold">ONLINE</span>
        </div>
      </div>

      {/* CHAT PANEL: Gunakan flex-1 dan overflow-hidden */}
      <GlassPanel className="flex flex-col flex-1 min-h-0 overflow-hidden border-[#1a2332]">
        {/* MESSAGES AREA: Pastikan flex-1 dan overflow-y-auto */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 shrink-0 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Bot size={16} className="text-cyan-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl border p-3 text-sm leading-relaxed
                ${msg.role === "assistant" ? "bg-[#0f172a] border-[#1a2332] text-white" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"}`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT AREA: Harus shrink-0 dan lebar full */}
        <div className="shrink-0 p-4 border-t border-[#1a2332]">
          <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-[#070a11] px-3 py-2 focus-within:border-cyan-500/50 transition-all w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={input === "" ? `${displayText}█` : ""}
              /* w-full dan flex-1 memastikan input memenuhi ruang */
              className="flex-1 w-full bg-transparent outline-none text-white text-sm py-1 placeholder:text-slate-600"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0 p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-all disabled:opacity-30"
            >
              <Send size={16} className="text-cyan-400" />
            </button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
