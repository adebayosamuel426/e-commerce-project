import React from "react";
import Wrapper from "../assets/wrapper/profileSidebar";
import { adminLinks as links } from "../utils/Categories";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <Wrapper>
      <div className='nav-links'>
        {links.map((link) => {
          const { text, path } = link;
          return (
            <NavLink to={path} key={text} className='nav-link'>
              {text}
            </NavLink>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default AdminSidebar;
