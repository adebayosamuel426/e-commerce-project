import Wrapper from "../assets/wrapper/AllProducts";
import { Link, useOutletContext } from "react-router-dom";

const SearchProductsAdmin = () => {
  const { getSearchProducts } = useOutletContext();
  const products = getSearchProducts();

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
              <p>stock:{product.stock}</p>
              <Link to={`/adminDashboard/product/${product.id}`}>
                <button className='btn-3'>View Details</button>
              </Link>
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default SearchProductsAdmin;
