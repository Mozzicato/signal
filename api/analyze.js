const SYSTEM_PROMPT = `You are Signal, an evidence analysis assistant. You do not decide whether a place is safe and you never present certainty as fact. Analyze reports for corroboration, contradiction, hearsay, freshness, and source independence. Five forwarded messages from one origin are not five independent reports. Return JSON only with this shape: {"status":"corroborated|conflicting|unverified|insufficient evidence","summary":"string","corroborated":["string"],"conflicting":["string"],"unverified":["string"],"whatChanged":"string","whatWouldChange":"string","evidenceQuality":0}. evidenceQuality is an explicit heuristic from 0 to 10, not a probability of truth.`;

function json(response, status, body) {
  response.status(status).setHeader('content-type', 'application/json; charset=utf-8').send(JSON.stringify(body));
}

function fallback(reports) {
  const hearsay = reports.filter(report => /someone said|forward|rumou?r|heard that/i.test(report.text));
  const direct = reports.length - hearsay.length;
  return {
    status: direct > 1 && hearsay.length ? 'conflicting' : reports.length > 1 ? 'insufficient evidence' : 'unverified',
    summary: 'Reports have been collected, but available evidence does not independently confirm the full claim. Conditions may be changing.',
    corroborated: direct > 1 ? ['More than one report describes activity in the area.'] : [],
    conflicting: hearsay.length && direct ? ['Direct observations and forwarded claims do not establish the same conclusion.'] : [],
    unverified: hearsay.length ? ['Forwarded or hearsay claims require independent confirmation.'] : ['There is not enough independent evidence yet.'],
    whatChanged: 'The latest report set has been compared by source type and wording.',
    whatWouldChange: 'A time-stamped, independent firsthand observation would strengthen or change this assessment.',
    evidenceQuality: Math.min(10, Math.max(1, Math.round((direct / Math.max(1, reports.length)) * 7 * 10) / 10)),
    source: 'local heuristic'
  };
}

function extractJson(text) {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Method not allowed' });
  const reports = Array.isArray(request.body?.reports) ? request.body.reports.slice(0, 100) : [];
  if (!reports.length) return json(response, 400, { error: 'At least one report is required' });

  const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY || process.env.XAI_KEY;
  if (!apiKey) return json(response, 200, fallback(reports));

  try {
    const upstream = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || 'grok-3-mini',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify({ reports }) }
        ]
      })
    });
    if (!upstream.ok) throw new Error(`xAI returned ${upstream.status}`);
    const payload = await upstream.json();
    const result = extractJson(payload.choices?.[0]?.message?.content || '');
    return json(response, 200, { ...result, source: 'Grok' });
  } catch (error) {
    console.error('Analysis provider failed:', error.message);
    return json(response, 200, { ...fallback(reports), source: 'local heuristic fallback' });
  }
};
