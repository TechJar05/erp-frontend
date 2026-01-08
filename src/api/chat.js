const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function sendChatMessage(sessionId, message) {
  const res = await fetch(
    `${API_BASE}/chat?context_session_id=${sessionId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    }
  );

  if (!res.ok) throw new Error("Chat request failed");

  return res.json();
}