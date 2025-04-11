import styled from "styled-components";

export const Wrapper = styled.div `
.cart{
position: absolute;
top: 12%;
right: 0%;
// visibility: hidden;
 background-color: var(--primary-500);
 padding: 1rem 1rem;
 width: 20vw;
 overflow-y: auto;
}

header {
  position: relative;
}
 h2{
  color: var(--white);
  text-align: center;

  }
  .cart-total{
    text-align: right;
    color: var(--white);
    margin-top: 1rem;
    font-size: 2rem;
    
  }
    .btn{
      margin: 1rem 30%;
      padding: 5px;
      width: 10rem;
    }
      p{
      color: var(--white);
        text-align: center;
        margin: 1rem 0;
      }
      .close-btn{
        font-size: 2rem;
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        color: var(--white);
        background-color: transparent;
        border: none;
      }
        .close-btn:hover{
        color: var(--black);
        }
}
`