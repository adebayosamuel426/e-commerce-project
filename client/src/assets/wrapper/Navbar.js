import styled from "styled-components";

const Wrapper = styled.nav `
  max-height: var(--nav-height);
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  background: var(--background-secondary-color);
  padding-bottom: 8rem;
   padding-right: 2rem;
  position: fixed;
  width: 100%;
  z-index: 100;
  .navHead{
  width: 90%;
  }
.nav-1{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin-bottom : auto;
    margin-left : 2rem;
}
.searchDiv {
  position: relative;
}
.searchInput{
  width: 25rem;
  height: 3rem;
  font-size: 1.5rem; 
  padding: 0 2rem;
  border: var(--border-radius) solid var(--grey-300:)
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
};
.searchDiv .searchIcon{
  color: var(--grey-300);
  font-size: 2rem;
  margin-top: 5px;
  position: absolute;
  padding-left: 5px;
  padding-top: 4px;
};
.searchDiv .searchIcon:hover {
  color: var(--primary-color);
  }
.navIcons {
 display: flex;
 justify-content: space-between;
 width: 20rem;
 overflow: visible;
}
.cartIcon, .wishList, .btn-4 {
  padding: 9.8px;
  position: relative;
  border: 5px solid var(--background-secondary-color);
  border-radius: 50%;
  box-shadow: var(--shadow-2);
  margin: 10px;
}
  .cartIcon:hover, .wishList:hover {
  background: var(--primary-50);
  }
  .cartIcon .cart, .wishList .wishlist, .profile{
  font-size: 1.9rem;
  color: var(--black);
  }

  .cartIcon .amount, .wishList .list {
  position: absolute;
  color: var(--white);
  padding: 2px;
  background: var(--black);
  right: 10%;
  top: 2px;
  font-size:0.5;
  }
  .btn-1,.btn-2 {
  padding: 0.5rem 1rem;

  color: var(--black);
  margin-top: 20px;
  margin-left: 1rem;
  background: var(--primary-50);
  font-size: 1.0rem;
  border: none;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
  height:3rem;
 
  transition: background-color 0.3s ease-in-out;
   box-shadow: var(--shadow-2);
  }
   .btn-1:hover,.btn-2:hover {
   background: var(--black);
   color: var(--primary-50);
   }
   .categories {
   width: 70%;   
   display: flex;
   align-items: center;
   flex-wrap: wrap;
   justify-content: space-between;
   margin-left: auto;
   margin-right: auto;
   margin-top: 5px;
   margin-bottom: 5px;
   
   }
   .category{
    background: transparent;
    font-size: 1.3rem;
    color: var(--grey-400);
    border: none;
    cursor: pointer;
   }
    .category:hover {
     color: var(--grey-800);
     }
  .logo {
    width: 20rem;
    cursor: pointer;
  }
  
`

export default Wrapper;