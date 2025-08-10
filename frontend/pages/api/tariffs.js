import tariffs from '../../../data/mock_tariffs.json';

export default function handler(req, res) {
  const { q, origin } = req.query;
  let results = tariffs;

  if (origin) {
    const o = origin.toLowerCase();
    results = results.filter(item => item.origin.toLowerCase().includes(o));
  }

  if (q) {
    const search = q.toLowerCase();
    results = results.filter(item =>
      item.hs_code.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.origin.toLowerCase().includes(search)
    );
  }

  res.status(200).json(results);
}
