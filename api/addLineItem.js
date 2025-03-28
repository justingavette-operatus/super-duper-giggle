export default async function handler(req, res) {
  const { dealId, productId, quantity } = req.body;
  const HUBSPOT_API_KEY = import.meta.env.VITE_HUBSPOT_API_KEY;

  const headers = {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const lineItemResp = await fetch('https://api.hubapi.com/crm/v3/objects/line_items', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        properties: {
          hs_product_id: productId,
          quantity: quantity.toString(),
        },
      }),
    });

    const lineItemData = await lineItemResp.json();
    const lineItemId = lineItemData.id;

    await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/line_items/${lineItemId}/deal_to_line_item`, {
      method: 'PUT',
      headers,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating line item or associating with deal' });
  }
}