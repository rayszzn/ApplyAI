export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      ...( req.body.pdfMode ? { 'anthropic-beta': 'pdfs-2024-09-25' } : {} ),
    },
    body: JSON.stringify(req.body.payload),
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}
