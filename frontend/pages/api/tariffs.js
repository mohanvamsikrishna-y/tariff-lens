import tariffs from '../../../data/mock_tariffs.json';

export default function handler(req, res) {
  const { query } = req;
  let results = tariffs;

  if (query.q) {
    const q = query.q.toLowerCase();
    results = results.filter(item =>
      item.hs_code.toLowerCase().includes(q) ||
      item.origin.toLowerCase().includes(q) ||
      item.destination.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  }

  res.status(200).json(results);
}
