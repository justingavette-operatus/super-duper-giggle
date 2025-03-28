import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductAdder() {
  const [dealId, setDealId] = useState(null);
  const [eligibleLives, setEligibleLives] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [enrollmentPercent, setEnrollmentPercent] = useState(0);
  const [calculatedQty, setCalculatedQty] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dealIdFromURL = urlParams.get('dealId');
    setDealId(dealIdFromURL);

    if (dealIdFromURL) {
      axios.get(`/api/loadDealData?dealId=${dealIdFromURL}`).then((res) => {
        setEligibleLives(res.data.eligibleLives);
        setProducts(res.data.products);
      });
    }
  }, []);

  useEffect(() => {
    const qty = Math.round((eligibleLives * (enrollmentPercent / 100)) || 0);
    setCalculatedQty(qty);
  }, [eligibleLives, enrollmentPercent]);

  const handleSubmit = async () => {
    if (!selectedProduct || !dealId) return;
    setStatus('Adding product...');
    try {
      await axios.post('/api/addLineItem', {
        dealId,
        productId: selectedProduct,
        quantity: calculatedQty,
      });
      setStatus('✅ Product added successfully!');
    } catch (err) {
      setStatus('❌ Error adding product');
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Add Product to Deal</h2>
      <p>Total Eligible Lives: {eligibleLives}</p>

      <select onChange={(e) => setSelectedProduct(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Select a product</option>
        {products.map((prod) => (
          <option key={prod.id} value={prod.id}>{prod.name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Estimated Enrollment %"
        className="w-full p-2 border rounded"
        onChange={(e) => setEnrollmentPercent(Number(e.target.value))}
      />

      <p>Calculated Quantity: {calculatedQty}</p>

      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
        Add Product to Deal
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}