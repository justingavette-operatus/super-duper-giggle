import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProductAdder from './ProductAdder';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductAdder />
  </StrictMode>,
);
