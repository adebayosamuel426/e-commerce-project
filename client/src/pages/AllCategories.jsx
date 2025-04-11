import { useOutletContext, Link, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrapper/AllCategories";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AllCategories = () => {
  const { newCategories, getCategoryId } = useOutletContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const filterCategories = newCategories.filter((category) => {
    return category.id !== "all-products";
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      await customFetch.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("category deleted successfully");
      queryClient.invalidateQueries(["categories"]);
    },
  });
  const handleClick = async (id) => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
      await queryClient.refetchQueries(["categories"]);
      navigate("/adminDashboard/all-categories");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };
  return (
    <Wrapper>
      <div className='container'>
        <h1>All Categories</h1>
        <div className='sub-container'>
          {filterCategories.map((category) => (
            <div key={category.id} className='category'>
              <h4>{category.name}</h4>
              <div>
                <button
                  onClick={() => {
                    getCategoryId(category.id);
                    navigate(`/adminDashboard`);
                  }}
                >
                  View Products
                </button>
                <Link to={`/adminDashboard/edit-category/${category.id}`}>
                  <button>Edit </button>
                </Link>
                <button onClick={() => handleClick(category.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default AllCategories;
