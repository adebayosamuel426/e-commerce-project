import { SubmitBtn } from "../components";
import { Form, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrapper/RegisterAndLoginPage";
import { useState } from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const AddCategoryMutation = useMutation({
    mutationFn: async (formData) => {
      await customFetch.post("/categories", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]); // invalidates and updates the categories
      toast.success("Category added successfully!");
    },
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add category to the database here

    try {
      await AddCategoryMutation.mutateAsync(formData); // Trigger the mutation to add the category to the database
      setFormData({ name: "" });
      return navigate("/adminDashboard/all-categories");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return null; // Prevent execution if there's an error in adding category to the database
    }
  };

  return (
    <Wrapper>
      <form method='post' className='form' onSubmit={handleSubmit}>
        <h2>Add Category</h2>
        <div className='form-row'>
          <label htmlFor='name' className='form-label'>
            Enter the category name:
          </label>
          <input
            name='name'
            type='text'
            className='form-input'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <SubmitBtn />
      </form>
    </Wrapper>
  );
};

export default AddCategory;
