import { useState, useEffect } from 'react';

export default function TariffTable() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [originFilter, setOriginFilter] = useState('');

  useEffect(() => {
    fetch('/api/tariffs')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  const origins = Array.from(new Set(data.map((row) => row.origin))).sort();

  const filtered = data.filter((row) => {
    const q = query.toLowerCase();
    const matchesSearch =
      row.hs_code.toLowerCase().includes(q) ||
      row.description.toLowerCase().includes(q);
    const matchesOrigin = originFilter ? row.origin === originFilter : true;
    return matchesSearch && matchesOrigin;
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by HS code or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={originFilter}
          onChange={(e) => setOriginFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Origins</option>
          {origins.map((origin) => (
            <option key={origin} value={origin}>
              {origin}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">HS Code</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Origin</th>
              <th className="px-4 py-2 text-left">Base Duty (%)</th>
              <th className="px-4 py-2 text-left">Surcharge (%)</th>
              <th className="px-4 py-2 text-left">Last Updated</th>
              <th className="px-4 py-2 text-left">Source</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2">{row.hs_code}</td>
                <td className="px-4 py-2">{row.description}</td>
                <td className="px-4 py-2">{row.origin}</td>
                <td className="px-4 py-2">{row.base_duty}%</td>
                <td className="px-4 py-2">{row.surcharge}%</td>
                <td className="px-4 py-2">{row.last_updated}</td>
                <td className="px-4 py-2">
                  <a href={row.source} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Source
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
