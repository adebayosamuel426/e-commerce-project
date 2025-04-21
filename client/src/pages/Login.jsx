import { FormRow, Logo, SubmitBtn, PasswordRow } from "../components";
import { Link, Form, redirect } from "react-router-dom";
import Wrapper from "../assets/wrapper/RegisterAndLoginPage";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    try {
      const response = await customFetch.post("/auth/login", data);
      queryClient.invalidateQueries();
      toast.success("Login successful!");
      const { role } = response.data.user;
      if (role === "admin") {
        return redirect("/adminDashboard");
      } else if (role === "customer") {
        return redirect("/customerDashboard");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials!");
      return error;
    }
  };
const Login = () => {
  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Link to='/' className='logo'>
          <Logo />
        </Link>
        <h4>login</h4>
        <FormRow type='email' name='email' />
        <PasswordRow />
        <SubmitBtn />
        <p>
          Not a member yet?
          <Link to='/register' className='member-btn'>
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Login;
