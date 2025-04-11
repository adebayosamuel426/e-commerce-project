import { FormRow, PasswordRow, SubmitBtn } from "../components";
import { useNavigate, useLoaderData, useParams } from "react-router-dom";
import Wrapper from "../assets/wrapper/RegisterAndLoginPage";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const EditUser = () => {
  const { user: oldUser } = useLoaderData();
  const { id } = useParams();
  console.log("oldUser", oldUser);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const editUserMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      await customFetch.patch(`/users/${id}`, formData);
    },
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["user", id]);
      queryClient.invalidateQueries(["AdminUser", id]);
    },
    initialData: oldUser,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("address", user.address);
    formData.append("role", user.role);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await editUserMutation.mutateAsync({ id, formData });
      await queryClient.refetchQueries(["eachUser", id]);
      toast.success("User updated successfully!");
      navigate(`/adminDashboard/user-page/${id}`);
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Wrapper>
      <form method='post' onSubmit={handleSubmit} className='form'>
        <h4>Edit Profile</h4>
        <FormRow
          type='text'
          name='name'
          onChange={handleChange}
          defaultValue={oldUser.name}
        />
        <FormRow
          type='email'
          name='email'
          onChange={handleChange}
          defaultValue={oldUser.email}
        />
        <FormRow
          type='text'
          name='address'
          onChange={handleChange}
          defaultValue={oldUser.address}
        />
        <div className='form-row'>
          <label htmlFor='role' className='form-label'>
            Select the role:
          </label>
          <select
            name='role'
            id='role'
            className='form-select'
            onChange={handleChange}
            defaultValue={oldUser.role}
          >
            <option value=''>Select an option</option>
            <option value='admin'>admin</option>
            <option value='customer'>customer</option>
          </select>
        </div>
        <SubmitBtn />
      </form>
    </Wrapper>
  );
};

export default EditUser;
