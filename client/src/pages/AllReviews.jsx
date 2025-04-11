import Wrapper from "../assets/wrapper/OrderPage";
import { useLoaderData, redirect, Link } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Fetching orders from database using queryClient
const fetchAllReviews = async () => {
  const { data } = await customFetch.get("/ratings");
  return data;
};
export const loader = (queryClient) => async () => {
  try {
    const { ratings } = await queryClient.ensureQueryData({
      queryKey: ["allReviews"],
      queryFn: fetchAllReviews,
    });
    return { ratings };
  } catch (error) {
    toast.error("reviews not found");
    return redirect("/");
  }
};

const AllReviews = () => {
  const { ratings } = useLoaderData();
  const queryClient = useQueryClient();
  //delete Mutation
  const deleteRatingMutation = useMutation({
    mutationFn: async (id) => {
      await customFetch.delete(`/ratings/${id}`);
    },
    onSuccess: (id) => {
      toast.success("review deleted successfully");
      queryClient.invalidateQueries(["allReviews"]);
      queryClient.invalidateQueries(["reviews", id]);
    },
  });
  //function to delete rating and review by writer
  const handleDelete = async (id) => {
    try {
      await deleteRatingMutation.mutateAsync(id);
      await queryClient.refetchQueries(["allReviews"]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete rating.");
    }
  };

  return (
    <Wrapper>
      <main className='container'>
        <div className='header'>
          <h1>All Reviews</h1>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>Review ID</th>
              <th>User ID</th>

              <th>Product ID</th>
              <th>Review Comment</th>
              <th>Review Date</th>
            </tr>
          </thead>
          <tbody>
            {ratings.length < 1 ? (
              <div>
                <p>No reviews yet</p>
              </div>
            ) : (
              ratings.map((rating) => (
                <tr key={rating.id}>
                  <td>{rating.id}</td>
                  <td>{rating.user_id}</td>
                  <td>{rating.product_id}</td>
                  <td>{rating.review}</td>
                  <td>{new Date(rating.created_at).toLocaleString()}</td>

                  <td>
                    <button
                      className='delete-btn'
                      type='button'
                      onClick={() => handleDelete(rating.id)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </Wrapper>
  );
};

export default AllReviews;
