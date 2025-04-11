import Wrapper from "../assets/wrapper/ProfilePage";
import { Outlet, useOutletContext } from "react-router-dom";

const AdminProfilePage = () => {
  const parentContext = useOutletContext();
  return (
    <Wrapper>
      <main className='containers'>
        <Outlet context={{ ...parentContext }} />
      </main>
    </Wrapper>
  );
};

export default AdminProfilePage;
