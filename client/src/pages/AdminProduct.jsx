import Wrapper from "../assets/wrapper/product";
// import { product } from "../utils/Categories";
import { useLoaderData, useNavigate, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const fetchAdminProduct = async (id) => {
  const { data } = await customFetch.get(`/products/${id}`);
  return data;
};
export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      const { id } = params;
      const { product } = await queryClient.ensureQueryData({
        queryKey: ["AdminProduct", id],
        queryFn: () => fetchAdminProduct(id),
      });
      return { product };
    } catch (error) {
      toast.error("product not found");
      return redirect("/adminDashboard");
    }
  };

const AdminProduct = () => {
  const { product } = useLoaderData();
  const [reviews, setReviews] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      await customFetch.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries(["products"]);
    },
  });
  const deleteProduct = async (id) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      await queryClient.refetchQueries(["products"]);
      navigate("/adminDashboard");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        `Failed to delete product: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  //caching the review
  const { data: review } = useQuery({
    queryKey: ["reviews", product.id],
    queryFn: async () => {
      const { data } = await customFetch.get(`/ratings/${product.id}`);
      return data.review;
    },
    enabled: !!product.id,
  });

  useEffect(() => {
    if (review) {
      setReviews(review);
    }
  }, [review]);

  //delete Mutation
  const deleteRatingMutation = useMutation({
    mutationFn: async (id) => {
      await customFetch.delete(`/ratings/${id}`);
    },
    onSuccess: (id) => {
      toast.success("review deleted successfully");
      queryClient.invalidateQueries(["reviews", id]);
      queryClient.invalidateQueries(["allReviews"]);
    },
  });
  //function to delete rating and review by writer
  const handleDelete = async (id) => {
    try {
      await deleteRatingMutation.mutateAsync(id);
      await queryClient.refetchQueries(["reviews", product.id]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete rating.");
    }
  };
  return (
    <Wrapper>
      <div className='container'>
        <img src={product.image_url} alt={product.name} />
        <div className='content'>
          <h2>{product.name}</h2>
          <p>{product.id}</p>
          <p>{product.description}</p>
          <p>Category: {product.category_name}</p>
          <p>Price: ${product.price}</p>
          <p>stock: {product.stock}</p>
          <button className='btn-3' onClick={() => deleteProduct(product.id)}>
            delete
          </button>
          <button
            className='btn-3'
            onClick={() =>
              navigate(`/adminDashboard/edit-product/${product.id}`)
            }
          >
            Edit
          </button>
        </div>
        <div className='review-box'>
          <h3>Reviews</h3>
          <div className='reviews'>
            {reviews.length < 1 ? (
              <div>
                <p>
                  No reviews for this product yet. You can drop your reviews
                  about the product.
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id}>
                  <p className='customer'>{review.user_email.slice(0, 9)}</p>
                  <div className='main-comment'>
                    <div className='comment'>
                      <p>{review.user_review}</p>
                    </div>
                    <button
                      className='delete-btn'
                      type='button'
                      onClick={() => handleDelete(review.id)}
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default AdminProduct;
