import measures from '../../../data/country_measures.json';

export default function handler(req, res) {
  const rows = measures.map(m => ({
    iso2: m.iso2,
    status: m.status,
  }));
  res.status(200).json(rows);
}
