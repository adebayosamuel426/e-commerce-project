import styled from "styled-components";

export const Wrapper = styled.div `
  .cart-item {
  width: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  border: 0px solid rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 1px 0 rgba(255, 255, 255, 0.5)
  margin-bottom: 1rem;
  }
  }
  img {
    width: 7rem;
    height: 10rem;

    }
.info{
  color: #fff;
  padding: 1rem;
  display: flex;
  flex-direction: row;
}
  .info h3 {
    font-size: 1.2rem;
    margin-top: 1rem;
    text-align: center;
  }
  .info .item-price{
  font-size: 1.3rem;
  }
  .info .remove-btn {
  font-size: 1.3rem;
  color: var(--black);
  cursor: pointer;
  margin-top: 20px;
  background-color: var(--primary-50);
  padding: 5px 6px;
  border-radius: 7px;
  border: none;
  }
  .info .remove-btn:hover {
    background-color: var(--black);
    color: var(--primary-50);
  }
  .amount-div {
    margin: 20px;
    font-size: 2rem;
    display: grid;
    align-items: center;
    justify-content: space-between;
  }
    .amount-btn {
      background-color: transparent;
      border: none;
      font-size: 2.5rem;
      margin-right: 2px;
      cursor: pointer;
      color: #fff;
    }
    .amount-btn:hover {
        color: var(--black);
        background-color: transparent;
      }
      .amount {
        margin-left: 9px;
      }
`