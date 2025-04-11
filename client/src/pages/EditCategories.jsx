import { SubmitBtn } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "../assets/wrapper/RegisterAndLoginPage";
import { useState, useEffect } from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const EditCategories = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const editCategoryMutation = useMutation({
    mutationFn: async ({ formData, id }) => {
      await customFetch.patch(`/categories/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]); // invalidates and updates the categories
      toast.success("Category edited successfully!");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { data: category } = useQuery({
    queryKey: ["category", id],
    queryFn: async ({ queryKey }) => {
      const [, categoryId] = queryKey; // Extracting id
      const { data } = await customFetch.get(`/categories/${categoryId}`);
      const { category } = data;
      return category;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add category to the database here
    try {
      await editCategoryMutation.mutateAsync({ formData, id });
      await queryClient.refetchQueries(["categories"]);
      setFormData({ name: "" });
      return navigate("/adminDashboard/all-categories");
    } catch (error) {
      toast.error(error.response?.data?.message || "unable to edit category");
      return null; // Prevent execution if there's an error in adding category to the database
    }
  };
  return (
    <Wrapper>
      <form method='post' className='form' onSubmit={handleSubmit}>
        <h2>Edit Category</h2>
        <div className='form-row'>
          <label htmlFor='name' className='form-label'>
            Enter the category name:
          </label>
          <input
            name='name'
            type='text'
            className='form-input'
            defaultValue={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <SubmitBtn />
      </form>
    </Wrapper>
  );
};

export default EditCategories;
