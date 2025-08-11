import measures from '../../../data/country_measures.json';

export default function handler(req, res) {
  const { q = '', status = '', region = '', changed_since = '' } = req.query;

  const qlc = q.toLowerCase();
  const want = new Set(status ? status.split(',') : []);
  const now = Date.now();
  const cutoff = changed_since
    ? (() => {
        const m = changed_since.match(/^(\d+)\s*d$/i);
        return m ? now - parseInt(m[1], 10) * 86400000 : 0;
      })()
    : 0;

  let rows = measures.map(m => ({
    iso2: m.iso2,
    country: m.country,
    status: m.status,
    headline_rate: m.headline_rate,
    scope: (m.scope || []).join(', '),
    effective_from: m.effective_from || null,
    deadline: m.deadline || null,
    updated_at: m.updated_at || null,
    source: (m.sources && m.sources[0]?.url) || null,
    summary: m.summary || null,
    region: m.region || null,
  }));

  if (qlc) {
    rows = rows.filter(r => r.country.toLowerCase().includes(qlc));
  }
  if (want.size) rows = rows.filter(r => want.has(r.status));
  if (region) rows = rows.filter(r => (r.region || '').toLowerCase() === region.toLowerCase());
  if (cutoff) rows = rows.filter(r => r.updated_at && Date.parse(r.updated_at) >= cutoff);

  rows.sort((a, b) => (Date.parse(b.updated_at || 0) - Date.parse(a.updated_at || 0)));

  res.status(200).json(rows);
}
