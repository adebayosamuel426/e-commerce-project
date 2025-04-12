import styled from "styled-components";

const Wrapper = styled.div `
margin-top: 0px;
position: relative;
.container{
 background-color: var(--background-color);
 position: absolute;
 top: 150px;
 left: 20%; 
 display: flex;
 flex-direction: row;
 padding: 4rem 2rem;
 border: 1px solid;
 justify-content: space-between;
 width: 70vw;
 }

 img {
 width: 50%;
 height: 500px;
 margin-right: 2rem;
 }

 .content {
  width: 50%;
  height: 600px;
  display: flex;
  flex-direction: column;
 }

 .content h2{
  font-size: 3rem;
  margin-bottom: 2rem;
 }
  .content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  }

  .content .btn-3{
    padding: 1rem;
    background-color: var(--primary-50);
    font-size: 1rem;
    border: none;
    border-radius: 2rem;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    margin-bottom: 2rem;
  }
    .content .btn-3:hover {
    background-color: var(--primary-400);
    }
     .wishlist{
        background: transparent;
        border: none;
        font-size: 2rem;
       }
        .wish-1{
          color: red;
        }
       .wish{
          color: red;
        }
}
.review-box {
  position: absolute;
  top: 55rem;
  left: 10%;
  width: 80%;
  display: grid;
  margin-bottom: 2rem;
  padding: 2rem;
  
 
}
  form {
  margin: 2rem 0;
  }
  h4 {
  font-size: 2rem;
  margin-bottom: 1rem;
  }
  .form-select{
   font-size: 1.5rem;
   margin: 1rem 0;
   width: 40%;
   height: 4rem;
  }
   textarea{
   font-size: 1.5rem;
   margin: 1rem 0;
   width: 100%;
  }
  p{
  font-size: 1.0rem;
  }
  .customer{ 
    text-align: left;
    margin: 1rem 0.5rem;
  }
.comment{
  padding: 1rem;
  background-color: var(--grey-100);
  border-radius: 1rem;
}
  .main-comment{
    display: flex;
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
`

export default Wrapper;