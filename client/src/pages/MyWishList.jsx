import Wrapper from "../assets/wrapper/wishlist";
import { WishItem } from "../components";
import { useOutletContext } from "react-router-dom";
const MyWishList = () => {
  const { wishlist } = useOutletContext();
  console.log({ myWishlist: wishlist });

  return (
    <Wrapper>
      <main className='container'>
        <div className='header'>
          <h1>My Wishlist</h1>
        </div>
        <div className='sub-container'>
          {wishlist < 1 ? (
            <h3>There is no wishlist available</h3>
          ) : (
            wishlist.map((product) => {
              return <WishItem key={product.id} product={product} />;
            })
          )}
        </div>
      </main>
    </Wrapper>
  );
};

export default MyWishList;
