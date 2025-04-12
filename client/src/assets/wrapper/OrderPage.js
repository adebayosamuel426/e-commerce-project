import styled from "styled-components";

const Wrapper = styled.div `
  width: 100%;
  position: relative;
  .container{
  position: absolute;
  top: 160px;
  left: 18%;
  background-color: var(--background-color);
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.8);
  width: 90%;
  padding: 2rem 4rem;
  }
  table{
  width: 90%;
  }
  thead{
  width: 90%;
  }
  th, td {
  padding: 1rem;
  text-align: left;
  font-size: 1.2rem;
  }
  img {
    width: 100px;
  height: 100px;
  }

  .btn-4{
    margin: 1rem 0.5rem;
    padding: 1.5rem;
    background-color: var(--primary-50);
    font-weight: bold;
    font-size: 1rem;
    border: none;
    border-radius: 0.5rem;
    transition: background-color 0.3s ease-in-out;
    box-shadow: var(--shadow-2);
    cursor: pointer;
  }

  p{
   margin: 1rem 0.5rem; 
  }
  .btn-4:hover {
  background-color: var(--primary-60);
  }
.searchDiv {
position: absolute;
top: 50px;
right: 5%;
}
input[type="text"] {
  padding: 0.5rem;
  font-size: 1.2rem;
  width: 20rem;
  border: none;
  border-radius: 0.5rem;
  }
  .searchIcon{
  font-size: 1rem;
  }

  .delete-btn{
  padding 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--grey-500)
}
  .delete-btn:hover {
     color: var(--grey-900);
  }
     span{
     text-align: center;
     margin-left: 2rem;
     }
`

export default Wrapper;