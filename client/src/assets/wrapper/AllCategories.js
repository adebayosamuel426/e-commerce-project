import styled from "styled-components";

const Wrapper = styled.div `
  width: calc(100% - 40%);
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(10%, 45%);
 
  .container{
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 2rem 0rem;
   background-color: transparent;
  z-index: -100;
  }

  h1 {
  font-size: 2.5rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 2rem;
  }
  .sub-container {
    width: 100%;
    padding: 2rem;
    margin-left: 15rem;
    
  }
 .category {
  display: flex;
  justify-content: space-between;
  margin: 1rem;
  }
  button{
  background-color: var(--primary-50);
  padding: 1rem;
  border-radius: 1rem;
  border: none;
  margin: 0 1rem;
  cursor: pointer;
  font-size: 1.2rem;
  }
`

export default Wrapper;