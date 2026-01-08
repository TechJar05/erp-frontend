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
  "#22d3ee",
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#a78bfa",
  "#fb7185",
];

function guessKeys(data) {
  if (!data || data.length === 0) return { x: null, y: null };

  const keys = Object.keys(data[0]);

  // heuristic:
  // first string key → x axis
  // first number key → y axis
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

export default function ChartRenderer({ chart }) {
  const { chart_type, data } = chart;

  if (!data || data.length === 0) {
    return <div className="text-sm text-slate-400">No chart data</div>;
  }

  const { x, y } = guessKeys(data);

  if (!x || !y) {
    return <div className="text-sm text-red-400">Invalid chart data</div>;
  }

  if (chart_type === "bar") {
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
  dataKey={x}
  interval={0}
  tickFormatter={(v) =>
    typeof v === "string" ? v.slice(0, 6) + "…" : v
  }
/>

            <YAxis />
            <Tooltip
  formatter={(value, name) => [value, name]}
  labelFormatter={(label) => `ID: ${label}`}
/>

            <Legend />
            <Bar dataKey={y} fill="#22d3ee" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chart_type === "line") {
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
  dataKey={x}
  interval={0}
  tickFormatter={(v) =>
    typeof v === "string" ? v.slice(0, 6) + "…" : v
  }
/>

            <YAxis />
           <Tooltip
  formatter={(value, name) => [value, name]}
  labelFormatter={(label) => `ID: ${label}`}
/>

            <Legend />
            <Line dataKey={y} stroke="#60a5fa" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chart_type === "pie") {
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={y}
              nameKey={x}
              outerRadius={100}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="text-sm text-slate-400">
      Unsupported chart type: {chart_type}
    </div>
  );
}
