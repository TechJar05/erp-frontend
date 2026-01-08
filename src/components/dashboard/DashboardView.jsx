import React, { useEffect, useMemo, useState } from "react";
import { fetchDashboard } from "../../api/analytics";
import ChartRenderer from "./ChartRenderer";


const cx = (...classes) => classes.filter(Boolean).join(" ");

function formatValue(v) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") return Intl.NumberFormat().format(v);
  return String(v);
}

function SoftBadge({ children, tone = "slate" }) {
  const tones = {
    slate:
      "bg-slate-900/40 text-slate-200 ring-1 ring-slate-800/70 shadow-sm",
    emerald:
      "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/25 shadow-sm",
    amber:
      "bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/25 shadow-sm",
    red: "bg-red-500/10 text-red-200 ring-1 ring-red-500/25 shadow-sm",
    cyan: "bg-cyan-500/10 text-cyan-200 ring-1 ring-cyan-500/25 shadow-sm",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tones[tone] || tones.slate
      )}
    >
      {children}
    </span>
  );
}

function Card({ title, right, children, className }) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/40",
        "shadow-[0_0_0_1px_rgba(15,23,42,0.25)]",
        className
      )}
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-24 right-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

      {(title || right) && (
        <div className="flex items-start justify-between gap-3 border-b border-slate-800/60 px-5 py-4">
          <div className="min-w-0">
            {title && (
              <div className="text-sm font-semibold text-slate-100">
                {title}
              </div>
            )}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </div>
      )}

      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5"
          >
            <div className="h-3 w-24 rounded bg-slate-800/70 animate-pulse" />
            <div className="mt-3 h-8 w-32 rounded bg-slate-800/70 animate-pulse" />
            <div className="mt-2 h-3 w-16 rounded bg-slate-800/70 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5"
          >
            <div className="h-4 w-40 rounded bg-slate-800/70 animate-pulse" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 6 }).map((__, j) => (
                <div
                  key={j}
                  className="h-3 w-full rounded bg-slate-800/60 animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataTable({ data }) {
  const columns = useMemo(() => Object.keys(data?.[0] || {}), [data]);

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/30 p-6 text-center">
        <div className="text-sm font-semibold text-slate-200">No data</div>
        <div className="mt-1 text-xs text-slate-400">
          Nothing to show for this section yet.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/70">
      <div className="max-h-[360px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur">
            <tr>
              {columns.map((k) => (
                <th
                  key={k}
                  className="text-left text-[11px] uppercase tracking-wide text-slate-400 px-3 py-2 border-b border-slate-800/70"
                >
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className={cx(
                  "border-b border-slate-900/70",
                  "hover:bg-slate-900/30 transition-colors"
                )}
              >
                {columns.map((col) => (
                  <td key={col} className="px-3 py-2 text-slate-200">
                    <span className="line-clamp-2">
                      {formatValue(row?.[col])}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DashboardView({ session }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchDashboard(session.sessionId);
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [session]);

  if (!session) return null;

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <Card
        title="Dashboard"
        right={<SoftBadge tone="red">Error</SoftBadge>}
        className="border-red-500/20"
      >
        <div className="text-sm text-red-200">{error}</div>
        <div className="mt-1 text-xs text-slate-400">
          Please try again or check API logs.
        </div>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header strip */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        {/* <div>
          <div className="text-xs text-slate-400">Session</div>
          <div className="text-lg font-semibold text-slate-100">
            Analytics Dashboard
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Session ID:{" "}
            <span className="text-slate-300 font-medium">
              {session.sessionId}
            </span>
          </div>
        </div> */}
        <div className="flex items-center gap-2">
          <SoftBadge tone="cyan">Live</SoftBadge>
          <SoftBadge>{new Date().toLocaleString()}</SoftBadge>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(data.kpis || []).map((kpi) => {
          // optional fields if your API returns them later
          const delta = kpi.delta ?? null; // e.g. +12.3
          const deltaTone =
            delta === null
              ? "slate"
              : delta > 0
              ? "emerald"
              : delta < 0
              ? "red"
              : "amber";

          return (
            <div
              key={kpi.metric}
              className={cx(
                "group relative overflow-hidden rounded-2xl border border-slate-800/70",
                "bg-gradient-to-b from-slate-950/55 to-slate-950/25",
                "p-5 shadow-sm"
              )}
            >
              <div className="pointer-events-none absolute -top-16 -right-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    {kpi.title}
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-white leading-none">
                    {formatValue(kpi.value)}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {kpi.unit || "—"}
                  </div>
                </div>

                <div className="shrink-0">
                  {delta !== null ? (
                    <SoftBadge tone={deltaTone}>
                      {delta > 0 ? "▲" : delta < 0 ? "▼" : "•"}{" "}
                      {formatValue(delta)}
                    </SoftBadge>
                  ) : (
                    <SoftBadge>Metric</SoftBadge>
                  )}
                </div>
              </div>

              <div className="mt-4 h-1.5 w-full rounded-full bg-slate-900/70 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-slate-200/20 group-hover:w-2/3 transition-all duration-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(data.charts || []).map((chart) => (
          <Card
            key={chart.metric}
            title={chart.title}
            right={<SoftBadge tone="slate">{chart.metric}</SoftBadge>}
          >
           <ChartRenderer chart={chart} />

          </Card>
        ))}
      </div>

      {/* TABLES */}
      {(data.tables || []).length > 0 && (
        <div className="space-y-4">
          {data.tables.map((table, i) => (
            <Card
              key={i}
              title={table.title}
              right={
                <SoftBadge tone="amber">
                  Rows: {(table.data || []).length}
                </SoftBadge>
              }
            >
              <DataTable data={table.data || []} />
            </Card>
          ))}
        </div>
      )}

      {/* AI INSIGHTS */}
{data.ai_insights && (
  <Card
    title="AI Insights"
    right={<SoftBadge tone="cyan">AI</SoftBadge>}
    className="border-cyan-500/20"
  >
    <div className="space-y-4">
      {/* Summary */}
      {data.ai_insights.summary && (
        <div className="text-sm text-slate-200">
          {data.ai_insights.summary}
        </div>
      )}

      {/* Insights */}
      {Array.isArray(data.ai_insights.insights) && (
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
            Key Insights
          </div>
          <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
            {data.ai_insights.insights.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks */}
      {Array.isArray(data.ai_insights.risks) && (
        <div>
          <div className="text-xs uppercase tracking-wide text-amber-400 mb-1">
            Risks
          </div>
          <ul className="list-disc list-inside text-sm text-amber-200 space-y-1">
            {data.ai_insights.risks.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {Array.isArray(data.ai_insights.recommendations) && (
        <div>
          <div className="text-xs uppercase tracking-wide text-emerald-400 mb-1">
            Recommendations
          </div>
          <ul className="list-disc list-inside text-sm text-emerald-200 space-y-1">
            {data.ai_insights.recommendations.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </Card>
)}

    </div>
  );
}
