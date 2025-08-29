// api/glm4.ts  –  temporary hard-coded key
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

export async function askAI(
  messages: { role: 'user' | 'assistant'; content: string }[]
) {
  const GLM4_API_KEY = '318ecc7babdc4b1f8233866bf737e98c.qKHbEWQ63LDQpyKj'; // ← your real key

  console.log('🔑 Sending key:', GLM4_API_KEY); // quick log

  const payload = {
    model: 'glm-4',
    messages,
    temperature: 0.7,
    max_tokens: 512,
    stream: false,
  };

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GLM4_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  console.log('GLM response status:', res.status);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GLM-4 error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content || '';
}