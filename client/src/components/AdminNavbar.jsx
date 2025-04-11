import Logo from "./Logo";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import Wrapper from "../assets/wrapper/Navbar";
// import { categories } from "../utils/Categories";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import Notification from "./Notification";

const AdminNavbar = ({ logout }) => {
  const { newCategories, getCategoryId, getSearch } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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
                  navigate("/adminDashboard/search-page");
                }}
              />
            </label>
          </div>
          <div>
            <Notification />
          </div>
          <div className='navIcons'>
            <Link to='/adminDashboard/profile' className='btn-4'>
              <CgProfile className='profile' />
            </Link>
            <Link to='/login' className='btn-2' onClick={logout}>
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
                  navigate(`/adminDashboard`);
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

export default AdminNavbar;
