import styled from "styled-components";

const Wrapper = styled.div `
  width: calc(100% - 30%);
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(20%, 45%);
  .container{
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  //box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.8);
  width: 90%;
  padding: 2rem;
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