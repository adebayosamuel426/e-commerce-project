import Wrapper from "../assets/wrapper/myProfile";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

const MyAdminProfile = () => {
  const { user } = useOutletContext();
  return (
    <Wrapper>
      <main className='container'>
        <div className='main-container'>
          <h1>My Profile</h1>
          <div className='sub-container'>
            <h2>Name: {user.name}</h2>
            <h2>email:{user.email}</h2>
            <h2>address:{user.address}</h2>
          </div>
          <Link to='/adminDashboard/profile/edit-profile'>
            <button className='btn'>edit profile</button>
          </Link>
        </div>
      </main>
    </Wrapper>
  );
};

export default MyAdminProfile;
