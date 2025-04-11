import Wrapper from "../assets/wrapper/products";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

import { FaRegHeart } from "react-icons/fa";
const SearchProducts = () => {
  const { wishlist, getSearchProducts } = useOutletContext();
  const products = getSearchProducts();
  const navigate = useNavigate();

  const isWishlist = (product) => {
    const isWish = wishlist.some((item) => item.id == product.id);

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
                onClick={() => navigate("/register")}
              >
                <FaRegHeart className='wish' />
                wishlist
              </button>
              <button className='btn-3' onClick={() => navigate("/register")}>
                Add to Cart
              </button>
              <Link to={`/register`}>
                <button className='btn-3'>View Details</button>
              </Link>
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default SearchProducts;
