// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// export async function fetchInventoryMetric(sessionId, metric) {
//   const res = await fetch(
//     `${API_BASE}/analytics/inventory?context_session_id=${sessionId}&metric=${metric}`
//   );
//   if (!res.ok) throw new Error("Failed to load inventory metric");
//   return res.json();
// }

// export async function fetchSalesMetric(sessionId, metric) {
//   const res = await fetch(
//     `${API_BASE}/analytics/sales?context_session_id=${sessionId}&metric=${metric}`
//   );
//   if (!res.ok) throw new Error("Failed to load sales metric");
//   return res.json();
// }

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchDashboard(sessionId) {
  const res = await fetch(
    `${API_BASE}/dashboard?context_session_id=${sessionId}`
  );
  if (!res.ok) throw new Error("Failed to load dashboard");
  return res.json();
}
