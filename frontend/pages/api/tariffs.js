import tariffs from '../../../data/mock_tariffs.json';

export default function handler(req, res) {
  const { q, origin, verified } = req.query;
  let results = tariffs;

  // filter by origin if provided
  if (origin) {
    const o = origin.toLowerCase();
    results = results.filter(item => item.origin.toLowerCase().includes(o));
  }

  // filter by search query across hs_code, description, origin
  if (q) {
    const search = q.toLowerCase();
    results = results.filter(item =>
      item.hs_code.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.origin.toLowerCase().includes(search)
    );
  }

  // filter by verified flag if provided
  if (verified) {
    const v = verified.toLowerCase();
    if (v === 'true' || v === '1') {
      results = results.filter(item => item.verified);
    }
    if (v === 'false' || v === '0') {
      results = results.filter(item => !item.verified);
    }
  }

  res.status(200).json(results);
}
