import './HomePage.css';
import { Header } from '../../components/Header';
import { useEffect, useState } from 'react';
import { ProductsGrid } from './productsGrid.jsx';
import axios from 'axios';

export function HomePage({ cart, loadCart }) {

  const [products, setProducts] = useState([]);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/products')
      .then((response) => {
        setProducts(response.data);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    setCurrentSearchTerm(searchTerm);
  };

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
      (product.keywords && product.keywords.some(keyword =>
        keyword.toLowerCase().includes(currentSearchTerm.toLowerCase())
      ))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <title>Ecommerce</title>

      <Header cart={cart} onSearch={handleSearch} />

      <div className="home-page">
        <ProductsGrid products={filteredProducts} loadCart={loadCart} />
      </div>
    </>
  );
}