import Logo from "./Logo";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import Wrapper from "../assets/wrapper/Navbar";
import { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../features/cart/cartSlice";

const CusNavbar = ({ user, logout, wishlist }) => {
  const { newCategories, getCategoryId, getSearch } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getSearch(searchTerm);
  }, [searchTerm]);

  const { amount } = useSelector((store) => store.cart);
  const dispatch = useDispatch();
  return (
    <Wrapper>
      <div className='navHead'>
        <div className='nav-1'>
          <div className='logo'>
            <Link>
              <Logo />
            </Link>
          </div>
          <h4>Hi {user.email.substring(0, 3)}</h4>
          <div className='searchDiv'>
            <input
              type='search'
              name='search'
              className='searchInput'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <label htmlFor='search'>
              <IoSearch
                className='searchIcon'
                onClick={() => {
                  getSearch(searchTerm);
                  navigate("/customerDashboard/search-page");
                }}
              />
            </label>
          </div>
          <div className='navIcons'>
            <Link
              className='cartIcon'
              onClick={() => {
                dispatch(openSidebar());
              }}
            >
              <span className='amount'>{amount}</span>
              <FaCartShopping className='cart' />
            </Link>
            <Link
              className='wishList'
              to='/customerDashboard/profile/wishlists'
            >
              <span className='list'>{wishlist.length}</span>
              <FaRegHeart className='wishlist' />
            </Link>
            <Link to='/customerDashboard/profile' className='btn-4'>
              <CgProfile className='profile' />
            </Link>
            <Link className='btn-2' onClick={logout}>
              logout
            </Link>
          </div>
        </div>
        <div className='categories'>
          {newCategories.map((category) => {
            return (
              <button
                type='button'
                key={category.id}
                className='category'
                onClick={() => {
                  getCategoryId(category.id);
                  navigate(`/customerDashboard`);
                }}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
};

export default CusNavbar;
