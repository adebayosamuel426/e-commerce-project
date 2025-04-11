import styled from "styled-components";

const Wrapper = styled.div `
width: 100%;
  .main-container {
    width: 80%;
    display: flex !important;
   flex-direction: row;
  }

  .content{
    display: flex;
    flex-direction: column; 
    margin: 2rem;
  }
img {
  width: 25rem;
  height: 25rem;
}
  h2 {
    font-size: 5rem;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.5rem;
  }
  button {
    padding: 1rem 1rem;
    font-size: 1.5rem;
    cursor: pointer;
    background-color: var(--primary-400);
    border:none;
    border-radius: 1rem;
    color: var(--white);
    margin-bottom: 1rem;
  }
`

export default Wrapper;