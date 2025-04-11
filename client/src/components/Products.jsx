import Wrapper from "../assets/wrapper/products";
import { Link, useOutletContext } from "react-router-dom";
import { addToCart, openSidebar } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";

import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";

const Products = () => {
  const { getSelectedProducts, wishlist, addToWishList, removeFromWishList } =
    useOutletContext();
  const dispatch = useDispatch();

  const products = getSelectedProducts();

  const isWishlist = (product) => {
    const isWish = wishlist.some((item) => item.id == product.id);
    return isWish;
  };

  if (products.length === 0) {
    return (
      <Wrapper>
        <p className='no-products'>There are no products in this category</p>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div className='products'>
        {products.map((product) => {
          return (
            <div key={product.id} className='product'>
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <p>ratings:{product.ratings}</p>
              <button
                className='wishlist'
                onClick={() =>
                  isWishlist(product)
                    ? removeFromWishList(product)
                    : addToWishList(product)
                }
              >
                {isWishlist(product) ? (
                  <FaHeart className='wish-1' />
                ) : (
                  <FaRegHeart className='wish' />
                )}{" "}
                Wishlist
              </button>
              <button
                className='btn-3'
                onClick={() => {
                  dispatch(addToCart(product));
                  dispatch(openSidebar());
                }}
              >
                Add to Cart
              </button>
              <Link to={`/CustomerDashboard/product/${product.id}`}>
                <button className='btn-3'>View Details</button>
              </Link>
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default Products;
