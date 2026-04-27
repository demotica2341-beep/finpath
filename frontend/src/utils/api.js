const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || '';

export async function requestChat({ messages, systemPrompt, signal }) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    signal,
    body: JSON.stringify({
      messages,
      systemPrompt
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.reply || 'Riya could not answer right now.');
  }

  return data;
}
