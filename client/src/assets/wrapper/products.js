import styled from "styled-components";

const Wrapper = styled.div `
  width: 90%;
  position: absolute;
  top:130px;
  padding: 1rem 1rem;

  .products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem 10rem;
  padding: 20px;
  justify-content: center;
  align-items: center;
    
  }
  .product{
    width: 400px;
    margin: 0 auto;
    background-color: var(--grey-400);
    padding: 2rem;
    box-shadow: box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border-radius: 10px;
    display: grid;
  }
    img {
      width: 100%;
      margin: auto;
      height: 300px;
    }
    img:hover{
      transform: scaleX(1.08);
    }
    h3 {
      font-size: 1.8rem;
      margin: 0;
      color: #fff;
      font-weight: bold;
    }
      p {
      font-size: 1.4rem;
      margin: 0.5rem 0px;
      color: var(--grey-600);
      font-weight: bold;
      }
    }
      .btn-3 {
      padding: 0.5rem 0.5rem;
      background: var(--primary-50);
      font-size: 1.0rem;
      border: none;
      font-weight: bold;
      border-radius: 1rem;
      transition: background-color 0.3s ease-in-out;
      box-shadow: var(--shadow-2);
      place-items: right;
      width: 60%;
      padding: 1rem;
      color: var(--black);
      margin-top: 2rem;
      }
      
       .btn-3:hover {
       background: var(--black);
       color: var(--primary-50);
       }
       .no-products {
       text-align: center;
       margin-top: 3rem;
       font-size: 2rem;
       }
       .wishlist{
        background: transparent;
        border: none;
        font-size: 2rem;
       }
        .wish-1{
          color: red;
        }
       .wish{
          color: red;
        }
}
`

export default Wrapper;