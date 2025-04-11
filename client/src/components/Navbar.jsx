import Logo from "./Logo";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import Wrapper from "../assets/wrapper/Navbar";
import { useState } from "react";

const Navbar = () => {
  const { newCategories, getCategoryId, getSearch } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  getSearch(searchTerm);

  return (
    <Wrapper>
      <div className='navHead'>
        <div className='nav-1'>
          <div className='logo'>
            <Logo />
          </div>
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
                  navigate("/search-page");
                }}
              />
            </label>
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
        <div className='categories'>
          {newCategories.map((category) => {
            return (
              <button
                type='button'
                key={category.id}
                className='category'
                onClick={() => {
                  getCategoryId(category.id);
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

export default Navbar;
