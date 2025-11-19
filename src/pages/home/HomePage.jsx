import './HomePage.css';
import { Header } from '../../components/Header';
//import { products } from '../data/products';
import { useEffect, useState } from 'react';
import { ProductsGrid } from './productsGrid.jsx';
import axios from 'axios';

export function HomePage({ cart }) {

  const [products, setProducts] = useState([]);


  useEffect(() => {
    axios.get('/api/products')
      .then((response) => {
        setProducts(response.data);
      });
  }, []);


  return (
    <>
      <title>Ecommerce</title>

      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} />
      </div>
    </>
  );
}