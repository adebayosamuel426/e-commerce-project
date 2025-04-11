import React from "react";
// import { cartItems } from "../utils/Categories";
import { CartItem } from "./CartItem";
import { Wrapper } from "../assets/wrapper/CartSlide";
import { closeSidebar, clearCart } from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
const CartSlide = () => {
  const dispatch = useDispatch();
  const { cartItems, total, amount } = useSelector((store) => store.cart);

  if (amount < 1) {
    return (
      <Wrapper>
        <section className='cart'>
          <header>
            <h2>cart</h2>
            <button
              className='close-btn'
              onClick={() => {
                dispatch(closeSidebar());
              }}
            >
              <IoCloseSharp />
            </button>
          </header>
          <p className='empty-cart'>Your cart is currently empty</p>
        </section>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <section className='cart'>
        <header>
          <h2>Cart</h2>
          <button
            className='close-btn'
            onClick={() => {
              dispatch(closeSidebar());
            }}
          >
            <IoCloseSharp />
          </button>
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
          <Link to='/customerDashboard/cart' className='btn clear-btn'>
            View cart
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
export default CartSlide;
