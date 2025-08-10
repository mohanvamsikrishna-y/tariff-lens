import tariffs from '../../../data/mock_tariffs.json';

export default function handler(req, res) {
  const { origin, from, hs, hs_code, value, item_value } = req.query;
  const orig = (origin || from || '').toLowerCase();
  const hsCode = (hs || hs_code || '').toLowerCase();
  const val = parseFloat(value || item_value || 0);

  // find matching tariff entry for the given origin and HS code
  const item = tariffs.find(t =>
    t.origin.toLowerCase() === orig &&
    t.hs_code.toLowerCase() === hsCode
  ) || {};

  const baseRate = item.base_duty || 0;
  const surchargeRate = item.surcharge || 0;
  const duty = val * baseRate / 100;
  const surcharge = val * surchargeRate / 100;
  const vat = 0;
  const other = 0;
  const total = val + duty + surcharge + vat + other;

  res.status(200).json({
    origin: orig,
    destination: 'USA',
    hs: hsCode,
    value: val,
    baseRate,
    surchargeRate,
    duty,
    surcharge,
    vat,
    other,
    total,
    source: item.source || ''
  });
}
