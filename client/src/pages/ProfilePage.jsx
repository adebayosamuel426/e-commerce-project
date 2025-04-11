import { MyProfileSidebar } from "../components";
import Wrapper from "../assets/wrapper/ProfilePage";
import { Outlet, useOutletContext } from "react-router-dom";
const ProfilePage = () => {
  const parentContext = useOutletContext();

  return (
    <Wrapper>
      <main className='containers'>
        <MyProfileSidebar className='sidebar' />
        <Outlet context={{ ...parentContext }} />
      </main>
    </Wrapper>
  );
};

export default ProfilePage;
