import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Zap, MessageCircle, Send, Loader2, Play } from "lucide-react";
import { sendChatMessage } from "../api/chat";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const defaultTasks = [
  { id: "1", name: "Email Order Processing", desc: "Automatically process sales orders from emails", progress: 65, status: "running" },
  { id: "2", name: "Demand Planning", desc: "Generate optimized schedule based on demand", progress: 100, status: "completed" },
  { id: "3", name: "Inventory Optimization", desc: "Optimize reorder points & safety stock", progress: 0, status: "idle" },
  { id: "4", name: "Predictive Maintenance", desc: "Monitor machine health and predict failures", progress: 45, status: "running" },
];




function Section({ title, children, tone = "slate" }) {
  const tones = {
    slate: "border-slate-800 text-slate-200",
    cyan: "border-cyan-500/30 text-cyan-200",
    amber: "border-amber-500/30 text-amber-200",
    emerald: "border-emerald-500/30 text-emerald-200",
    red: "border-red-500/30 text-red-200",
  };

  return (
    <div className={cx("mt-3 rounded-xl border p-3 text-sm", tones[tone])}>
      {title && (
        <div className="text-[11px] uppercase tracking-wide opacity-70 mb-1">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function DataTable({ columns, rows }) {
  if (!rows || rows.length === 0) {
    return <div className="text-xs text-slate-400">No rows</div>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-800 mt-2">
      <table className="w-full text-xs">
        <thead className="bg-slate-900/60">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-2 py-1 text-left text-slate-300">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-800">
              {columns.map((c) => (
                <td key={c} className="px-2 py-1 text-slate-200">
                  {String(row[c] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BotMessage({ msg }) {
  const r = msg.response;

  return (
    <div>
      {/* Summary */}
      {r.summary && <div className="text-sm text-slate-100">{r.summary}</div>}

      {/* Insights */}
      {Array.isArray(r.insights) && r.insights.length > 0 && (
        <Section title="Insights" tone="cyan">
          <ul className="list-disc list-inside space-y-1">
            {r.insights.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Suggestions */}
      {Array.isArray(r.suggestions) && r.suggestions.length > 0 && (
        <Section title="Suggestions" tone="emerald">
          <ul className="list-disc list-inside space-y-1">
            {r.suggestions.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Table */}
      {r.formatted_data?.type === "table" && (
        <Section title="Result Table">
          <DataTable
            columns={r.formatted_data.columns}
            rows={r.formatted_data.rows}
          />
        </Section>
      )}
    </div>
  );
}

export default function AIAssistant({ open, onClose, session }) {
  const [tab, setTab] = useState("chat");

  const [tasks, setTasks] = useState(defaultTasks);

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


  const [messages, setMessages] = useState([
    {
      id: "m1",
      type: "bot",
      content:
        "Hello! Open a workspace and ask me about inventory, sales, production, or tasks.",
      t: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(
      () => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }),
      50
    );
  }, [open, messages, tab]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!session) {
      setMessages((p) => [
        ...p,
        {
          id: String(Date.now()),
          type: "bot",
          content: "Please open a workspace first.",
          t: new Date(),
        },
      ]);
      return;
    }

    const userMsg = {
      id: String(Date.now()),
      type: "user",
      content: trimmed,
      t: new Date(),
    };

    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(session.sessionId, trimmed);

      setMessages((p) => [
        ...p,
        {
          id: String(Date.now() + 1),
          type: "bot",
          response: response,
          t: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((p) => [
        ...p,
        {
          id: String(Date.now() + 1),
          type: "bot",
          content: "Error talking to server.",
          t: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
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
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <div className="font-bold">AI Assistant</div>
              </div>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            {/* Tabs */}
            <div className="p-2 border-b border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTab("chat")}
                  className={cx(
                    "px-3 py-2 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2",
                    tab === "chat"
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-900/40 border border-slate-800 text-slate-200"
                  )}
                >
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
                <button
                  onClick={() => setTab("automation")}
                  className={cx(
                    "px-3 py-2 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2",
                    tab === "automation"
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-900/40 border border-slate-800 text-slate-200"
                  )}
                >
                  <Zap className="w-4 h-4" /> Automation
                </button>
              </div>
            </div>

            {/* Body */}
            {tab === "chat" ? (
  <>
    <div
      ref={listRef}
      className="flex-1 overflow-auto p-4 space-y-3"
    >
      {messages.map((m) => (
        <div
          key={m.id}
          className={cx(
            "flex",
            m.type === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cx(
              "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
              m.type === "user"
                ? "bg-cyan-600 text-white"
                : "bg-slate-900/50 border border-slate-800 text-slate-100"
            )}
          >
            {m.type === "bot" && m.response ? (
              <BotMessage msg={m} />
            ) : (
              <div>{m.content}</div>
            )}

            <div className="text-[10px] opacity-70 mt-1">
              {m.t.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-2xl">
            <Loader2 className="w-4 h-4 animate-spin" />
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
          className="flex-1 h-11 px-3 rounded-xl bg-slate-900/40 border border-slate-800 outline-none"
          disabled={loading}
        />
        <button
          className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center"
          disabled={loading || !input.trim()}
          type="submit"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  </>
) : (
  <div className="flex-1 overflow-auto p-4 space-y-3">
    {tasks.map((t) => (
      <div
        key={t.id}
        className="rounded-2xl bg-slate-900/40 border border-slate-800 p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold text-slate-100">{t.name}</div>
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

          {t.status === "completed" && (
            <div className="text-xs text-green-300 font-bold">
              ✓ Completed
            </div>
          )}
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
