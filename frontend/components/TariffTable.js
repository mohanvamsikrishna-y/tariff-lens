import { useState, useEffect } from 'react';

export default function TariffTable() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    fetch('/api/tariffs')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  const origins = Array.from(new Set(data.map((row) => row.origin))).sort();

  let filtered = data.filter((row) => {
    const q = debouncedQuery.toLowerCase();
    const matchesSearch =
      row.hs_code.toLowerCase().includes(q) ||
      row.description.toLowerCase().includes(q);
    const matchesOrigin = originFilter ? row.origin === originFilter : true;
    const matchesVerified = !veri!!verifiedOnly || row.verified || row.verified;
    return matchesSearch && matchesOrigin && matchesVerified;
  });

  // sort
  if (sortField) {
    filtered = filtered.slice().sort((a, b) => {
      let x = a[sortField];
      let y = b[sortField];
      if (typeof x === 'string') {
        x = x.toLowerCase();
        y = y.toLowerCase();
      }
      if (x < y) return sortOrder === 'asc' ? -1 : 1;
      if (x > y) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const downloadCSV = () => {
    if (filtered.length === 0) return;
    const rows = filtered.map((row) => ({
      hs_code: row.hs_code,
      description: row.description,
      origin: row.origin,
      base_duty: row.base_duty,
      surcharge: row.surcharge,
      last_updated: row.last_updated,
      source: row.source,
      verified: row.verified,
    }));
    const header = Object.keys(rows[0]);
    const csv = [header.join(','), ...rows.map((r) => header.map((h) => r[h]).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tariffs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by HS code or description"
          className="p-2 border rounded flex-1"
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
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
          />
          <span>Verified only</span>
        </label>
        <button onClick={downloadCSV} className="p-2 border rounded">
          Download CSV
        </button>
      </div>
      <table className="w-full text-left table-auto border-collapse">
        <thead>
          <tr>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort('hs_code')}>
              HS Code {sortField === 'hs_code' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort('description')}>
              Description {sortField === 'description' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort('origin')}>
              Origin {sortField === 'origin' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort('base_duty')}>
              Base Duty (%) {sortField === 'base_duty' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort('surcharge')}>
              Surcharge (%) {sortField === 'surcharge' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort('last_updated')}>
              Last Updated {sortField === 'last_updated' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th className="p-2">Source</th>
            <th className="p-2">Verified</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((row, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{row.hs_code}</td>
              <td className="p-2">{row.description}</td>
              <td className="p-2">{row.origin}</td>
              <td className="p-2">{row.base_duty}%</td>
              <td className="p-2">{row.surcharge}%</td>
              <td className="p-2">{row.last_updated}</td>
              <td className="p-2">
                <a href={row.source} target="_blank" className="text-blue-600 underline">
                  Source
                </a>
              </td>
              <td className="p-2">{row.verified ? '✔️' : ''}</td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td colSpan={8} className="p-2 text-center">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-2">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 border rounded"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
