import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Zap, MessageCircle, Send, Loader2, Play } from "lucide-react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const aiResponses = {
  "production status":
    "Current production status: 87.5% OEE, 24 active work orders, 12 completed today. All machines operational.",
  "work orders":
    "You have 24 active work orders. Top priority: WO-2025-5001 (P1001 Smart Home Controller) - 78% complete, on schedule.",
  inventory:
    "Current inventory level: 92% capacity. Critical components: C4003 WiFi Module (1,200 units), C2001 Microcontroller (2,200 units).",
  forecast:
    "Demand forecast for next week: 15% increase expected. Recommended production increase: 20% to maintain safety stock.",
  maintenance:
    "Predictive maintenance alert: Machine SMT-001 requires maintenance in 48 hours. Scheduling recommended.",
  quality:
    "Quality metrics: First Pass Yield 95.2%, Defect rate 0.75%, All inspections passed.",
  help:
    "I can help with: production status, work orders, inventory, forecasts, maintenance, and quality. What would you like to know?",
};

const defaultTasks = [
  { id: "1", name: "Email Order Processing", desc: "Automatically process sales orders from emails", progress: 65, status: "running" },
  { id: "2", name: "Demand Planning", desc: "Generate optimized schedule based on demand", progress: 100, status: "completed" },
  { id: "3", name: "Inventory Optimization", desc: "Optimize reorder points & safety stock", progress: 0, status: "idle" },
  { id: "4", name: "Predictive Maintenance", desc: "Monitor machine health and predict failures", progress: 45, status: "running" },
];

export default function AIAssistant({ open, onClose }) {
  const [tab, setTab] = useState("chat");

  // Chat
  const [messages, setMessages] = useState([
    { id: "m1", type: "bot", content: "Hello! I’m your AI Production Assistant. Ask me about work orders, inventory, forecast, maintenance.", t: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Automation
  const [tasks, setTasks] = useState(defaultTasks);

  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // small scroll correction
    setTimeout(() => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 50);
  }, [open, messages, tab]);

  const send = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { id: String(Date.now()), type: "user", content: trimmed, t: new Date() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      let response = "I’m not sure. Try: production status, work orders, inventory, forecast, maintenance, quality.";

      for (const k of Object.keys(aiResponses)) {
        if (lower.includes(k)) {
          response = aiResponses[k];
          break;
        }
      }

      setMessages((p) => [...p, { id: String(Date.now() + 1), type: "bot", content: response, t: new Date() }]);
      setLoading(false);
    }, 700);
  };

  const startTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "running", progress: 0 } : t))
    );

    const interval = setInterval(() => {
      setTasks((prev) => {
        const next = prev.map((t) => {
          if (t.id !== taskId) return t;
          if (t.status !== "running") return t;

          const p = Math.min(100, t.progress + Math.random() * 22);
          return { ...t, progress: p, status: p >= 100 ? "completed" : "running" };
        });

        const done = next.find((t) => t.id === taskId)?.status === "completed";
        if (done) clearInterval(interval);
        return next;
      });
    }, 500);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className="fixed top-0 right-0 z-50 h-screen w-200 sm:w-[26rem] bg-[#0f1b2d] border-l border-slate-800 shadow-2xl flex flex-col"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="font-bold">AI Assistant</div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-900/40 inline-flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="p-2 border-b border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTab("chat")}
                  className={cx(
                    "px-3 py-2 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2",
                    tab === "chat" ? "bg-cyan-600 text-white" : "bg-slate-900/40 border border-slate-800 text-slate-200"
                  )}
                >
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
                <button
                  onClick={() => setTab("automation")}
                  className={cx(
                    "px-3 py-2 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2",
                    tab === "automation" ? "bg-cyan-600 text-white" : "bg-slate-900/40 border border-slate-800 text-slate-200"
                  )}
                >
                  <Zap className="w-4 h-4" /> Automation
                </button>
              </div>
            </div>

            {/* Body */}
            {tab === "chat" ? (
              <>
                <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={cx("flex", m.type === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cx(
                          "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                          m.type === "user"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md"
                            : "bg-slate-900/50 border border-slate-800 text-slate-100 rounded-bl-md"
                        )}
                      >
                        <div>{m.content}</div>
                        <div className="text-[10px] opacity-70 mt-1">
                          {m.t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-2xl rounded-bl-md">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!loading) send(input);
                  }}
                  className="p-4 border-t border-slate-800"
                >
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 h-11 px-3 rounded-xl bg-slate-900/40 border border-slate-800 outline-none focus:border-cyan-500 text-sm"
                      disabled={loading}
                    />
                    <button
                      className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white inline-flex items-center justify-center disabled:opacity-50"
                      disabled={loading || !input.trim()}
                      type="submit"
                      title="Send"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {tasks.map((t) => (
                  <div key={t.id} className="rounded-2xl bg-slate-900/40 border border-slate-800 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{t.desc}</div>
                      </div>

                      {t.status === "idle" && (
                        <button
                          onClick={() => startTask(t.id)}
                          className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold inline-flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" /> Start
                        </button>
                      )}
                      {t.status === "running" && (
                        <div className="text-xs text-cyan-300 inline-flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Running
                        </div>
                      )}
                      {t.status === "completed" && <div className="text-xs text-green-300 font-bold">✓ Completed</div>}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>{t.status}</span>
                        <span>{Math.round(t.progress)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
                          style={{ width: `${t.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
