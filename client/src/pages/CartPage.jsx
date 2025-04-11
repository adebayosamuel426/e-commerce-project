import React from "react";
// import { cartItems } from "../utils/Categories";
import { CartItem } from "../components/CartItem";
import { Wrapper } from "../assets/wrapper/CartPage";
import { clearCart } from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems, total, amount } = useSelector((store) => store.cart);

  if (amount < 1) {
    return (
      <Wrapper>
        <section className='cart'>
          <header>
            <h2>cart</h2>
          </header>
          <p className='empty-cart'>Your cart is currently empty</p>
          <Link to='/customerDashboard'>
            <button className='btn'>continue shopping</button>
          </Link>
        </section>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <section className='cart'>
        <header>
          <h2>Cart</h2>
        </header>
        <div>
          {cartItems.map((item) => {
            return <CartItem key={item.id} {...item} />;
          })}
        </div>
        <footer>
          <hr />
          <div className='cart-total'>
            <h4>
              total <span>{total.toFixed(2)}</span>
            </h4>
          </div>

          <Link to='/CustomerDashboard/checkout'>
            <button className='btn clear-btn'>checkout</button>
          </Link>

          <button
            className='btn checkout-btn'
            onClick={() => {
              dispatch(clearCart());
            }}
          >
            clear cart
          </button>
        </footer>
      </section>
    </Wrapper>
  );
};
export default CartPage;
