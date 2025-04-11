import Wrapper from "../assets/wrapper/myProfile";
import { Link } from "react-router-dom";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
const MyProfile = () => {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      await customFetch.delete(`/users/profile`);
    },
    onSuccess: () => {
      localStorage.removeItem("loggedInUser");
      queryClient.invalidateQueries(["users"]);
      toast.success("you have successfully deleted your profile");
      navigate("/");
    },
  });

  const handleClick = async () => {
    try {
      console.log(user.id);
      await deleteUserMutation.mutateAsync();
      await queryClient.refetchQueries(["users"]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete your profile"
      );
    }
  };
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
          <div className='edit-div'>
            <Link to='/customerDashboard/profile/edit-profile'>
              <button className='btn'>edit profile</button>
            </Link>
            <button className='btn' onClick={handleClick}>
              Delete my profile
            </button>
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default MyProfile;
