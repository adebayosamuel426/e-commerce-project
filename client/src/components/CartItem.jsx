import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Wrapper } from "../assets/wrapper/CartItem";
import { removeItem, increase, decrease } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";

export const CartItem = ({ id, name, image_url, quantity, price }) => {
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <article className='cart-item'>
        <img src={image_url} alt={name} />
        <div className='info'>
          <div>
            <h3>{name}</h3>
            <h4 className='item-price'>${price}</h4>
            <button
              className='remove-btn'
              onClick={() => {
                dispatch(removeItem(id));
              }}
            >
              remove
            </button>
          </div>
          <div className='amount-div'>
            <button
              className='amount-btn'
              onClick={() => {
                dispatch(increase({ id }));
              }}
            >
              <FaChevronUp />
            </button>
            <p className='amount'>{quantity}</p>
            <button
              className='amount-btn'
              onClick={() => {
                if (quantity === 1) {
                  dispatch(removeItem(id));
                  return;
                }
                dispatch(decrease({ id }));
              }}
            >
              <FaChevronDown />
            </button>
          </div>
        </div>
      </article>
    </Wrapper>
  );
};
