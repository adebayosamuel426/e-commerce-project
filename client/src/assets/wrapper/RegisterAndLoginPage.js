import styled from 'styled-components';

const Wrapper = styled.section `
  display: grid;
  align-items: center;
  transform: translate(30%, 25%);
 width: calc(100% - 40%);
  .form {
    margin-bottom: 2rem;
    border-top: 5px solid var(--primary-500);
    margin-top: 4rem;
  }
  h4 {
    text-align: center;
    margin-bottom: 1.38rem;
    font-size: 1.5rem;
    
  }
  p {
    margin-top: 1rem;
    text-align: center;
    line-height: 1.5;
    font-weight: bold;
    font-size: 1.5rem;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    color: var(--primary-500);
    letter-spacing: var(--letter-spacing);
    margin-left: 0.25rem;
  }
    .logo{
      width: 20rem;
    }
    .image-preview {
    width: 20rem;
    height: 20rem;
    }
`;
export default Wrapper;