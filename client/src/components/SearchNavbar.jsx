import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import Wrapper from "../assets/wrapper/Navbar";

const SearchNavbar = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <div className='navHead'>
        <div className='nav-1'>
          <div className='logo'>
            <Link to='/'>
              <Logo />
            </Link>
          </div>
          <div className='navIcons'>
            <div className='cartIcon' onClick={() => navigate("/register")}>
              <span className='amount'>0</span>
              <FaCartShopping className='cart' />
            </div>
            <div className='wishList' onClick={() => navigate("/register")}>
              <span className='list'>0</span>
              <FaRegHeart className='wishlist' />
            </div>
            <Link to='/login' className='btn-1'>
              Login
            </Link>
            <Link to='/register' className='btn-2'>
              Register
            </Link>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SearchNavbar;
