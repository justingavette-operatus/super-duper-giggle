export default async function handler(req, res) {
  const { dealId } = req.query;
  const HUBSPOT_API_KEY = import.meta.env.VITE_HUBSPOT_API_KEY;

  const headers = {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const dealResp = await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=total_eligible_lives`, { headers });
    const dealData = await dealResp.json();
    const eligibleLives = parseInt(dealData.properties.total_eligible_lives || '0');

    const productsResp = await fetch('https://api.hubapi.com/crm/v3/objects/products?properties=name', { headers });
    const productsData = await productsResp.json();

    const products = productsData.results.map((p) => ({ id: p.id, name: p.properties.name }));

    res.status(200).json({ eligibleLives, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error loading deal or product data' });
  }
}