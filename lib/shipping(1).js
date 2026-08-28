export function getShippingRoute(shipping = {}) {
  const country = String(shipping?.country_code || '').toUpperCase();
  if (country === 'MY') {
    return {
      originCountry: 'MY',
      originLabel: 'Malaysia',
      destinationCountry: 'MY',
      destinationLabel: 'Kuala Lumpur, Malaysia',
      routeLabel: 'Malaysia → Kuala Lumpur',
      warehouseLabel: 'Malaysia fulfillment'
    };
  }
  return {
    originCountry: 'ID',
    originLabel: 'Bandung, Indonesia',
    destinationCountry: country || '',
    destinationLabel: shipping?.city ? `${shipping.city}, ${country || ''}`.replace(/, $/, '') : country,
    routeLabel: `Bandung, Indonesia → ${country || 'International'}`,
    warehouseLabel: 'Bandung, Indonesia fulfillment'
  };
}

export function normalizeShipping(shipping = {}) {
  const s = { ...shipping };
  if (String(s.country_code || '').toUpperCase() === 'MY') {
    s.country_code = 'MY';
    s.city = 'Kuala Lumpur';
    s.state = 'Kuala Lumpur';
    s.fulfillment_origin = 'Malaysia';
    s.shipping_route = 'Malaysia → Kuala Lumpur';
  } else {
    s.fulfillment_origin = s.fulfillment_origin || 'Bandung, Indonesia';
  }
  return s;
}
