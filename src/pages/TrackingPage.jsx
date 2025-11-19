import './TrackingPage.css';
import { Header } from '../components/Header.jsx';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import dayjs from 'dayjs';

export function TrackingPage({ cart }) {

  const { orderId, productId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders/${orderId}?expand=products`)
      .then((response) => {
        setOrderDetails(response.data);
      })
      .catch((error) => {
        console.log("Error fetching order details:", error);
      });
  }, [orderId]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const product = orderDetails.products.find((orderProduct) => {
    return orderProduct.productId === productId;
  });
  const deliveryDate = dayjs(orderDetails.deliveryDate).format('dddd, MMMM D');

  const totalDeliveryTimeMs = product.estimateddeliveryDateMs - orderDetails.orderTimeMs;
  const timePassedMs = dayjs().valueOf() - orderDetails.orderTimeMs;

  let deliveryPercent = (timePassedMs / totalDeliveryTimeMs) * 100;
  if (deliveryPercent > 100) {
    deliveryPercent = 100;
  }


  return (
    <>
      <title>Order Tracking</title>

      <Header cart={cart} />

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            {deliveryDate}
            {/* Arriving on {dayjs(product.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
            {deliveryPercent >= 100 ? 'Delivered on' : 'Arriving on'}
            {dayjs(product.estimatedDeliveryTimeMs).format('dddd, MMMM D')} */}
          </div>

          <div className="product-info">
            {product.name}
          </div>

          <div className="product-info">
            Quantity: {product.quantity}
          </div>

          <img className="product-image" src={product.product.image} />

          <div className="progress-labels-container">
            <div className="progress-label">
              Preparing
            </div>
            <div className="progress-label current-status">
              Shipped
            </div>
            <div className="progress-label">
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${deliveryPercent}%` }}></div>
          </div>
        </div>
      </div>
    </>
  );
}