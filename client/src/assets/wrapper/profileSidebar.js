import styled from "styled-components";

const Wrapper = styled.aside `
  width: 15%;
  height: calc(100vh - 100px);
  position: fixed;
  top: 100px;
  left: 0;
  background-color: var(--primary-50);
  padding: 0;

  .nav-links {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    flex-direction: column;
    width: 100%;
    margin-top: 60px;
  }
  .nav-link{
   text-decoration: none;
   font-size: 1.5rem;
   margin: 10px;
   background-color: transparent;
   width: 100%;
   text-align: center;
   padding: 5rem
   color: red;
   border-bottom: 1px solid black;
   &:hover {
     background-color: white;
     color: black;
     margin-top:0;
     transform: scaleY(1.5);
     transition: var(--transition);
   }

  }
`

export default Wrapper;