import styled from 'styled-components';

const Wrapper = styled.section `
  min-height: 100vh;
  display: grid;
  align-items: center;
  .form {
    max-width: 800px;
    border-top: 5px solid var(--primary-500);
  }
  h4 {
    text-align: center;
    margin-bottom: 1.38rem;
    font-size: 2.5rem;
    
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