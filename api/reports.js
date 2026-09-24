import store from '../lib/store.js';

export default function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' });
  const latest = store.reports.at(-1);
  return response.status(200).json({
    reports: store.reports,
    changes: latest ? [`New report from ${latest.sourceType.toLowerCase()}`] : []
  });
};
