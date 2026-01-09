import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";

const COLORS = [
  "#38bdf8",
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#a78bfa",
  "#fb7185",
];

// Normalize backend chart types
function normalizeChartType(type) {
  if (!type) return null;
  const t = String(type).toLowerCase();
  if (t.includes("bar")) return "bar";
  if (t.includes("line")) return "line";
  if (t.includes("pie") || t.includes("donut")) return "pie";
  return null;
}

// Guess X and Y keys
function guessKeys(data) {
  if (!data || data.length === 0) return { x: null, y: null };

  const keys = Object.keys(data[0]);

  let xKey = keys[0];
  let yKey = keys[1];

  for (const k of keys) {
    if (typeof data[0][k] === "string") {
      xKey = k;
      break;
    }
  }

  for (const k of keys) {
    if (typeof data[0][k] === "number") {
      yKey = k;
      break;
    }
  }

  return { x: xKey, y: yKey };
}

// Detect ISO date string
function isDateString(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v);
}

// Format date nicely
function formatDateLabel(v) {
  try {
    const d = new Date(v);
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return v;
  }
}

export default function ChartRenderer({ chart }) {
  const rawType = chart?.chart_type;
  const chartType = normalizeChartType(rawType);
  const data = chart?.data || [];

  if (!data || data.length === 0) {
    return <div className="text-sm text-slate-400">No chart data</div>;
  }

  const { x, y } = guessKeys(data);

  if (!x || !y) {
    return (
      <div className="text-sm text-red-400">
        Invalid chart data format
      </div>
    );
  }

  const isDateAxis = isDateString(data[0][x]);

  // If many points → show fewer ticks
  const tickStep = data.length > 40 ? Math.ceil(data.length / 8) : 0;

  // Tooltip style
 const tooltipProps = {
  contentStyle: {
    backgroundColor: "#020617",
    border: "1px solid #0f172a",
    borderRadius: "10px",
    color: "#e5e7eb",
  },
  labelStyle: { color: "#38bdf8", fontWeight: 600 },
  itemStyle: { color: "#38bdf8" },   // ✅ THIS fixes Pie text
  formatter: (value, name) => [value, name],
};


  const xAxisProps = {
    dataKey: x,
    interval: tickStep === 0 ? 0 : tickStep - 1,
    angle: 0,
    height: 50,
    tick: { fill: "#38bdf8", fontSize: 11 },
    tickFormatter: (v) =>
      isDateAxis ? formatDateLabel(v) : typeof v === "string" ? v.slice(0, 8) : v,
  };

  const yAxisProps = {
    tick: { fill: "#94a3b8", fontSize: 11 },
  };

  // BAR
  if (chartType === "bar") {
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip
              {...tooltipProps}
              labelFormatter={(label) =>
                isDateAxis ? `Date: ${label}` : `ID: ${label}`
              }
            />
            <Legend />
            <Bar dataKey={y} fill="#38bdf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // LINE
  if (chartType === "line") {
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip
              {...tooltipProps}
              labelFormatter={(label) =>
                isDateAxis ? `Date: ${label}` : `ID: ${label}`
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={y}
              stroke="#60a5fa"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // PIE
  if (chartType === "pie") {
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip {...tooltipProps} />
            <Legend />
            <Pie
              data={data}
              dataKey={y}
              nameKey={x}
              outerRadius={110}
              innerRadius={50}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="text-sm text-slate-400">
      Unsupported chart type: {rawType}
    </div>
  );
}
