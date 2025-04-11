import styled from "styled-components";

const Wrapper = styled.div `
  margin-top: 0px;
  width: calc(100% - 30%);
  .container{
    background-color: red;
    position: relative;
  }
    .main-container{
      padding: 2rem;
      position: absolute;
      top: 200px;
      left: 40%;
      background-color: var(--background-color);
      box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.8);
      width: 90%;
      font-size: 1.5rem;
    }
      h1 {
        font-size: 2.5rem;
        margin-bottom: 2rem;
        font-weight: bold;
        text-align: center;
      }
      .sub-container h2 {
        font-size: 1.5rem;
        margin: 2rem;
        font-weight: bold;
      }
        .btn {
          padding: 1rem 4rem;
          background: var(--primary-50);
          color: var(--black);
          font-size: 1.2rem;
          border-radius: 1rem;
          margin: 4rem;
          cursor: pointer;
        }
          .edit-div{
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            width: 100%;
          }
`
export default Wrapper;