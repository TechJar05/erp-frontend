import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Zap, MessageCircle, Send, Loader2, Play } from "lucide-react";
import { sendChatMessage } from "../api/chat";

const cx = (...classes) => classes.filter(Boolean).join(" ");

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
                    "px-3 py-2 rounded-xl text-sm font-semibold",
                    tab === "chat"
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-900/40 border border-slate-800 text-slate-200"
                  )}
                >
                  Chat
                </button>
                <button
                  onClick={() => setTab("automation")}
                  className={cx(
                    "px-3 py-2 rounded-xl text-sm font-semibold",
                    tab === "automation"
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-900/40 border border-slate-800 text-slate-200"
                  )}
                >
                  Automation
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
                      className="w-11 h-11 rounded-xl bg-cyan-600 text-white"
                      disabled={loading || !input.trim()}
                      type="submit"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 p-4 text-slate-400">
                Automation UI will be wired next.
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
