import { FormRow, Logo, SubmitBtn, PasswordRow } from "../components";
import { Link, Form, redirect } from "react-router-dom";
import Wrapper from "../assets/wrapper/RegisterAndLoginPage";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration successful!");
    return redirect("/login");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong!");
    return error;
  }
};
const Register = () => {
  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Link to='/' className='logo'>
          <Logo />
        </Link>
        <h4>Register</h4>
        <FormRow type='text' name='name' />
        <FormRow type='text' name='address' />
        <FormRow type='email' name='email' />
        <PasswordRow />
        <SubmitBtn />
        <p>
          Already a member?
          <Link to='/login' className='member-btn'>
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Register;
