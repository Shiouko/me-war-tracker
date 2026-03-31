export async function onRequest(context) {
  const API_KEY = '026213ae456861e1cd9741ab86999ee48a0a16e78e16fdc2a051122147b46152';
  const API_BASE = 'https://api.oilpriceapi.com/v1/prices/latest';
  
  const codes = [
    'BRENT_CRUDE_USD', 'WTI_CRUDE_USD', 'NATURAL_GAS_USD', 'GASOLINE_USD',
    'DUTCH_TTF_EUR', 'GOLD_USD', 'SILVER_USD', 'JET_FUEL_USD', 'DIESEL_USD'
  ];
  const results = {};
  
  for (const code of codes) {
    try {
      const res = await fetch(`${API_BASE}?code=${code}`, {
        headers: { 'Authorization': `Token ${API_KEY}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        let key = code.replace('_USD','').replace('_EUR','').replace('_CRUDE','').replace('DUTCH_TTF','ttf').toLowerCase();
        // Map code names to frontend keys
        const keyMap = { brent:'brent', wti:'wti', natural_gas:'natural_gas', gasoline:'gasoline', ttf:'ttf', gold:'gold', silver:'silver', jet_fuel:'jet_fuel', diesel:'diesel' };
        const mappedKey = keyMap[key] || key;
        results[mappedKey] = {
          price: data.data.price,
          currency: data.data.currency,
          unit: data.data.unit,
          change24h: data.data.changes?.['24h']?.percent || 0,
          updated: data.data.updated_at
        };
      }
    } catch (e) {
      // skip failed fetches
    }
  }
  
  return new Response(JSON.stringify(results), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 's-maxage=60'
    }
  });
}
