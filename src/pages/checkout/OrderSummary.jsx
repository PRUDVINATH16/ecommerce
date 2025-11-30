import dayjs from 'dayjs';
import { formatMoney } from '../../utils/money';
import axios from 'axios';
import { useState } from 'react';

function CartItem({ cartItem, deliveryOptions, loadCart }) {
    const [quantity, setQuantity] = useState(cartItem.quantity);
    const [isEditing, setIsEditing] = useState(false);

    const selectedDeliveryOption = deliveryOptions.find((option) => {
        return option.id === cartItem.deliveryOptionId;
    })

    const deleteCartItem = async () => {
        await axios.delete(`/api/cart-items/${cartItem.productId}`);
        await loadCart();
    }

    const handleUpdateQuantity = () => {
        setIsEditing(true);
    }

    const doneButton = async () => {
        setIsEditing(false);
        const newQuantity = parseInt(quantity);
        if (isNaN(newQuantity) || newQuantity < 1) {
            alert('Please enter a valid quantity (1 or more).');
            return;
        }
        await axios.put(`/api/cart-items/${cartItem.productId}`, {
            quantity: newQuantity
        });
        await loadCart();
    }

    return (
        <div className="cart-item-container" key={cartItem.productId}>
            <div className="delivery-date">
                Delivery date: {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
            </div>

            <div className="cart-item-details-grid">
                <img className="product-image"
                    src={cartItem.product.image} />

                <div className="cart-item-details">
                    <div className="product-name">
                        {cartItem.product.name}
                    </div>
                    <div className="product-price">
                        ${formatMoney(cartItem.product.priceCents)}
                    </div>
                    <div className="product-quantity">
                        <span>
                            Quantity: <input type='text' className={`quantity-label quantity-label-${cartItem.productId}`} value={quantity} onChange={(e) => setQuantity(e.target.value)} disabled={!isEditing}></input>
                        </span>
                        {isEditing ? (
                            <span className="done-quantity-link link-primary" onClick={doneButton}>
                                Done
                            </span>
                        ) : (
                            <span className="update-quantity-link link-primary" onClick={handleUpdateQuantity}>
                                Update
                            </span>
                        )}
                        <span className="delete-quantity-link link-primary" onClick={deleteCartItem}>
                            Delete
                        </span>
                    </div>
                </div>

                <div className="delivery-options">
                    <div className="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    {deliveryOptions.map(option => {

                        let priceString = 'FREE Shipping';
                        if (option.priceCents > 0) {
                            priceString = '$' + formatMoney(option.priceCents);
                        }

                        const updateDeliveryOption = async () => {
                            await axios.put(`/api/cart-items/${cartItem.productId}`, {
                                deliveryOptionId: option.id
                            });
                            await loadCart();
                        }

                        return (
                            <div key={option.id} className="delivery-option" onClick={updateDeliveryOption}>
                                <input type="radio"
                                    checked={option.id === cartItem.deliveryOptionId} onChange={() => { }}
                                    className="delivery-option-input"
                                    name={`delivery-option-${cartItem.productId}`} />
                                <div>
                                    <div className="delivery-option-date">
                                        {dayjs(option.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                                    </div>
                                    <div className="delivery-option-price">
                                        {priceString}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
    return (
        <div className="order-summary">

            {deliveryOptions.length > 0 && cart.map(cartItem => (
                <CartItem
                    key={cartItem.productId}
                    cartItem={cartItem}
                    deliveryOptions={deliveryOptions}
                    loadCart={loadCart}
                />
            ))}
        </div>
    );
}