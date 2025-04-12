import styled from "styled-components";

const Wrapper = styled.div `
  width: calc(100% - 40%);
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(40%, 45%);
 
  .container{
  display: flex;
  flex-direction: column;
   justify-content: center;
  align-items: center;
  padding: 2rem 0rem;
  z-index: -100;
  }

  h1 {
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 2rem;
  }
  h4{
  margin-right: 2rem;
  }
  .sub-container {
    padding: 2rem;
  }
 .category {
  display: flex;
  justify-content: space-between;
  margin: 2rem 6rem;
  
  }

  .sub-category{
    margin-right: 1rem;
  }
  button{
  background-color: var(--primary-50);
  padding: 1rem;
  border-radius: 1rem;
  border: none;
  margin: 0 2rem;
  cursor: pointer;
  font-size: 1.2rem;
  }
`

export default Wrapper;