import { FormRow, PasswordRow, Logo, SubmitBtn } from "../components";
import { Link, Form, redirect, useOutletContext } from "react-router-dom";
import Wrapper from "../assets/wrapper/RegisterAndLoginPage";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      await customFetch.patch("/users/profile", data);
      toast.success(" update profile successful!");
      //invalidate the user query
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["users"]);
      await queryClient.refetchQueries(["user"]);
      return redirect("/customerDashboard/profile");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Something went wrong!");
      return error;
    }
  };
const EditMyProfile = () => {
  const { user } = useOutletContext();
  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Link to='/'>
          <Logo />
        </Link>
        <h4>Edit Profile</h4>
        <FormRow type='text' name='name' defaultValue={user.name} />
        <FormRow type='text' name='address' defaultValue={user.address} />
        <FormRow type='email' name='email' defaultValue={user.email} />
        <PasswordRow />
        <SubmitBtn />
      </Form>
    </Wrapper>
  );
};

export default EditMyProfile;
