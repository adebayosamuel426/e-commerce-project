import Wrapper from "../assets/wrapper/products";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { addToCart, openSidebar } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";

const SearchProductsCus = () => {
  const { wishlist, addToWishList, removeFromWishList, getSearchProducts } =
    useOutletContext();
  const navigate = useNavigate();
  const products = getSearchProducts();
  const dispatch = useDispatch();

  const isWishlist = (product) => {
    const isWish = wishlist.some((item) => item.id == product.id);
    console.log(isWish);

    return isWish;
  };

  if (products.length === 0) {
    return (
      <Wrapper>
        <p className='no-products'>There are no such product</p>
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

export default SearchProductsCus;
