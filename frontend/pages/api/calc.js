import tariffs from '../../../../../data/mock_tariffs.json';

export default function handler(req, res) {
  const { query } = req;
  const origin = (query.origin || query.from || '').toLowerCase();
  const destination = (query.destination || query.to || '').toLowerCase();
  const hs = (query.hs || query.hs_code || '').toLowerCase();
  const value = parseFloat(query.value || query.item_value || 0);

  const item = tariffs.find(t =>
    t.origin.toLowerCase() === origin &&
    t.destination.toLowerCase() === destination &&
    t.hs_code.toLowerCase() === hs
  ) || {};

  const dutyPercent = item.base_duty || 0;
  const duty = value * dutyPercent / 100;
  const vat = 0;
  const other = 0;
  const total = value + duty + vat + other;

  res.status(200).json({
    origin,
    destination,
    hs,
    value,
    duty,
    vat,
    other,
    total,
    source: item.source || ''
  });
}
