import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertCircle, CheckCircle, Gauge } from "lucide-react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const productionData = [
  { time: "00:00", output: 450, target: 500 },
  { time: "04:00", output: 520, target: 500 },
  { time: "08:00", output: 480, target: 500 },
  { time: "12:00", output: 510, target: 500 },
  { time: "16:00", output: 490, target: 500 },
  { time: "20:00", output: 530, target: 500 },
];

const workOrderStatus = [
  { name: "Completed", value: 12, fill: "#10b981" },
  { name: "In Progress", value: 18, fill: "#0ea5e9" },
  { name: "Pending", value: 8, fill: "#f59e0b" },
  { name: "On Hold", value: 2, fill: "#ef4444" },
];

const machineStatus = [
  { name: "SMT-001", status: "Operational", utilization: 92, oee: 88 },
  { name: "SMT-002", status: "Operational", utilization: 85, oee: 85 },
  { name: "WS-012", status: "Maintenance", utilization: 0, oee: 0 },
  { name: "WS-015", status: "Operational", utilization: 78, oee: 82 },
];

const workOrders = [
  { id: "WO-2025-5001", product: "P1001 Smart Home Controller", quantity: 2000, completed: 1560, status: "In Progress", priority: "HIGH" },
  { id: "WO-2025-5002", product: "P1002 IoT Gateway Device", quantity: 1500, completed: 1200, status: "In Progress", priority: "NORMAL" },
  { id: "WO-2025-5003", product: "P1003 Industrial Sensor", quantity: 3000, completed: 3000, status: "Completed", priority: "NORMAL" },
  { id: "WO-2025-5004", product: "P2001 Temperature Monitor", quantity: 1000, completed: 0, status: "Pending", priority: "LOW" },
];

export default function ProductionPage() {
  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-slate-400">Overall Equipment Effectiveness</div>
              <div className="text-3xl font-bold mt-1">87.5%</div>
              <div className="text-xs text-green-300 mt-2">↑ 2.3% from yesterday</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-green-500/15 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-green-300" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-slate-400">Active Work Orders</div>
              <div className="text-3xl font-bold mt-1">24</div>
              <div className="text-xs text-sky-300 mt-2">18 in progress</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-500/15 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-sky-300" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-slate-400">Today's Production</div>
              <div className="text-3xl font-bold mt-1">2,980</div>
              <div className="text-xs text-cyan-300 mt-2">Units produced</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-slate-400">Active Alerts</div>
              <div className="text-3xl font-bold mt-1">3</div>
              <div className="text-xs text-orange-300 mt-2">1 critical</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-orange-500/15 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Production trend */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
          <div className="font-semibold mb-3">Production Trend (24h)</div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#223046" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b1220",
                    border: "1px solid #223046",
                    borderRadius: "12px",
                  }}
                />
                <Line type="monotone" dataKey="output" stroke="#0ea5e9" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#64748b" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work order status */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
          <div className="font-semibold mb-3">Work Order Status</div>

          {/* ✅ Legend on top (prevents broken UI) */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {workOrderStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
                <span className="text-slate-300">{s.name}</span>
                <span className="ml-auto font-semibold">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workOrderStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  labelLine={false}
                >
                  {workOrderStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b1220",
                    border: "1px solid #223046",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Machine status */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
        <div className="font-semibold mb-4">Machine Status</div>
        <div className="space-y-3">
          {machineStatus.map((m) => (
            <div key={m.name} className="rounded-2xl bg-slate-900/50 border border-slate-800 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cx("w-2.5 h-2.5 rounded-full", m.status === "Maintenance" ? "bg-yellow-400" : "bg-green-400")} />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.status}</div>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="text-sm font-semibold">{m.utilization}%</div>
                    <div className="text-[11px] text-slate-400">Utilization</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{m.oee}%</div>
                    <div className="text-[11px] text-slate-400">OEE</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${m.utilization}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work orders table */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
        <div className="font-semibold mb-3">Active Work Orders</div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="text-left py-3 px-3 font-semibold">Work Order</th>
                <th className="text-left py-3 px-3 font-semibold">Product</th>
                <th className="text-left py-3 px-3 font-semibold">Qty</th>
                <th className="text-left py-3 px-3 font-semibold">Progress</th>
                <th className="text-left py-3 px-3 font-semibold">Status</th>
                <th className="text-left py-3 px-3 font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((o) => {
                const pct = Math.round((o.completed / o.quantity) * 100);
                return (
                  <tr key={o.id} className="border-b border-slate-800/70 hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-mono text-cyan-300">{o.id}</td>
                    <td className="py-3 px-3">{o.product}</td>
                    <td className="py-3 px-3">{o.quantity}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={cx(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          o.status === "Completed"
                            ? "bg-green-500/15 text-green-300"
                            : o.status === "In Progress"
                            ? "bg-sky-500/15 text-sky-300"
                            : "bg-orange-500/15 text-orange-300"
                        )}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={cx(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          o.priority === "HIGH"
                            ? "bg-red-500/15 text-red-300"
                            : o.priority === "NORMAL"
                            ? "bg-sky-500/15 text-sky-300"
                            : "bg-slate-500/15 text-slate-300"
                        )}
                      >
                        {o.priority}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-slate-500 mt-3">
          Tip: On mobile, scroll horizontally to view all columns.
        </div>
      </div>
    </div>
  );
}
