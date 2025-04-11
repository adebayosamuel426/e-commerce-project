import { Link, useOutletContext } from "react-router-dom";

import { addToCart } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import Wrapper from "../assets/wrapper/wishitem";

const WishItem = ({ product }) => {
  const dispatch = useDispatch();
  const { removeFromWishList } = useOutletContext();

  return (
    <Wrapper>
      <div className='main-container'>
        <img src={product.image_url} alt={product.name} />
        <div className='content'>
          <h2>{product.name}</h2>
          <p>Price: ${product.price}</p>
          <button
            className='wishlist'
            onClick={() => removeFromWishList(product)}
          >
            remove
          </button>
          <button
            className='btn-3'
            onClick={() => {
              dispatch(addToCart(product));
            }}
          >
            Add to Cart
          </button>
          <Link to={`/CustomerDashboard/product/${product.id}`}>
            <button className='btn-3'>View Details</button>
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default WishItem;
