import Wrapper from "../assets/wrapper/product";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import {
  useLoaderData,
  redirect,
  Link,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { addToCart } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchSingleProduct = async (id) => {
  const { data } = await customFetch.get(`/products/${id}`);
  return data;
};
export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      const { id } = params;
      const product = await queryClient.ensureQueryData({
        queryKey: ["product", id],
        queryFn: () => fetchSingleProduct(id),
      });

      return product;
    } catch (error) {
      toast.error(error.response?.data?.message || "product not found");
      return redirect("/");
    }
  };
const Product = () => {
  const { product } = useLoaderData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { wishlist, addToWishList, removeFromWishList } = useOutletContext();
  console.log(wishlist);
  const [formRating, setFormRating] = useState({
    rating: "",
    review: "",
  });
  const [reviews, setReviews] = useState([]);
  const isWishlist = (product) => {
    const isWish = wishlist.some((item) => item.id == product.id);
    console.log(isWish);

    return isWish;
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

  isWishlist(product);

  const ratingMutation = useMutation({
    mutationFn: async ({ formData, id }) => {
      await customFetch.post(`/ratings/${id}`, formData);
    },
    onSuccess: (id) => {
      toast.success("Rating added successfully!");
      queryClient.invalidateQueries(["reviews", id]);
      queryClient.invalidateQueries(["allReviews"]);
    },
  });

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

  // for form reviews
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("rating", formRating.rating);
    formData.append("review", formRating.review);

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
    try {
      await ratingMutation.mutateAsync({ formData, id: product.id });
      await queryClient.refetchQueries(["reviews", product.id]);
      toast.success("Review added successfully!");
      setFormRating({ rating: "", review: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit reviews.");
    }
  };

  const handleInputRatings = (e) => {
    const { name, value } = e.target;
    setFormRating((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Wrapper>
      <div className='container'>
        <img src={product.image_url} alt={product.name} />
        <div className='content'>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Category: {product.category_name}</p>
          <p>Price: ${product.price}</p>
          <p>ratings:{product.ratings}</p>
          <p>stock: {product.stock}</p>
          <button
            className='wishlist'
            onClick={() =>
              isWishlist(product)
                ? removeFromWishList(product)
                : addToWishList(product)
            }
          >
            {isWishlist(product) ? (
              <FaHeart className='wish-1' />
            ) : (
              <FaRegHeart className='wish' />
            )}
            Wishlist
          </button>
          <button
            className='btn-3'
            onClick={() => {
              dispatch(addToCart(product));
            }}
          >
            Add to Cart
          </button>
          <Link to='/customerDashboard/cart'>
            <button className='btn-3'>View cart</button>
          </Link>
        </div>

        <div className='review-box'>
          <h3>Reviews</h3>
          <div className='reviews'>
            {reviews.length < 1 ? (
              <div>
                <p>
                  No reviews for this product yet. you can drop your reviews
                  about the products
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
          <form onSubmit={handleRatingSubmit}>
            <div>
              <select
                name='rating'
                id='rating'
                className='form-select'
                onChange={handleInputRatings}
                value={formRating.rating}
              >
                <option value=''>Select rating</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
              </select>
            </div>
            <textarea
              name='review'
              onChange={handleInputRatings}
              value={formRating.review}
              placeholder='Your Review'
              rows='4'
              cols='50'
            ></textarea>
            <button type='submit' className='btn'>
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default Product;
