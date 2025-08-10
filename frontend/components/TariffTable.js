import { useState, useEffect } from 'react';

export default function TariffTable() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/tariffs')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  const filtered = data.filter((row) => {
    const q = query.toLowerCase();
    return (
      row.hs_code.toLowerCase().includes(q) ||
      row.origin.toLowerCase().includes(q) ||
      row.destination.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search by HS code or country"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-background">
              <th className="px-2 py-1 text-left">HS Code</th>
              <th className="px-2 py-1 text-left">Description</th>
              <th className="px-2 py-1 text-left">Origin</th>
              <th className="px-2 py-1 text-left">Destination</th>
              <th className="px-2 py-1 text-left">Base Duty</th>
              <th className="px-2 py-1 text-left">MFN Duty</th>
              <th className="px-2 py-1 text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-background' : ''}>
                <td className="px-2 py-1">{row.hs_code}</td>
                <td className="px-2 py-1">{row.description}</td>
                <td className="px-2 py-1">{row.origin}</td>
                <td className="px-2 py-1">{row.destination}</td>
                <td className="px-2 py-1">{row.base_duty}%</td>
                <td className="px-2 py-1">{row.mfn_duty}%</td>
                <td className="px-2 py-1">{row.last_updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
