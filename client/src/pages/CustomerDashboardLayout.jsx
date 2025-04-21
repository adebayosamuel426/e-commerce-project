import React from "react";
import { CusNavbar } from "../components";
import {
  Outlet,
  redirect,
  useLoaderData,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import customFetch from "../utils/customFetch";
import { useDispatch } from "react-redux";
import { setUser } from "../features/cart/cartSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchUserProfile = async () => {
  const { data } = await customFetch.get("users/profile");
  return data.user;
};
const fetchWishlist = async () => {
  const { data } = await customFetch.get("/wishlist");
  return data.wishlist;
};

export const loader = (queryClient) => async () => {
  try {
    const user = await queryClient.ensureQueryData({
      queryKey: ["user"],
      queryFn: fetchUserProfile,
    });

    return { user };
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "You are not authorized to view this page"
    );
    return redirect("/");
  }
};

const loginUser = (user) => {
  localStorage.setItem(
    "loggedInUser",
    JSON.stringify({ id: user.id, email: user.email, role: user.role })
  );
};

const CustomerDashboardLayout = () => {
  const { user } = useLoaderData();
  const parentContext = useOutletContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  loginUser(user);
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // Assume user info is stored in localStorage
    if (loggedInUser?.id && loggedInUser?.role === "customer") {
      dispatch(setUser(loggedInUser.id));
    } else {
      // Redirect or handle unexpected role
      navigate("/");
    }
  }, [dispatch]);

  // wishlist functionalities
  const {
    data: wishlist = [],
    isLoading: wishlistLoading,
    error: wishlistError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });

  const addToWishListMutation = useMutation({
    mutationFn: async (product) => await customFetch.post("/wishlist", product),
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]); // invalidates and updates the wishlist
      toast.success("item added to wishlist");
    },
    onError: () => {
      toast.error("Failed to add item to wishlist");
    },
  });

  //removing from the which list
  const removeFromWishListMutation = useMutation({
    mutationFn: async (product) => {
      await customFetch.delete("/wishlist", {
        data: { id: product.id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]); // invalidates and updates the wishlist
      toast.success("item removed from wishlist");
    },
    onError: () => {
      toast.error(
        error.response?.data?.message || "Failed to remove item from wishlist"
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await customFetch.get("/auth/logout");
    },
    onSuccess: () => {
      // Clear React Query state
      queryClient.clear();
    },
  });
  //logout user
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Force hard reload
      window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to logout user");
    }
  };

  return (
    <>
      <CusNavbar user={user} wishlist={wishlist} logout={logout} />
      {wishlistLoading && <p>Loading wishlist...</p>}
      {wishlistError && <p>Error loading wishlist</p>}
      <Outlet
        context={{
          ...parentContext,
          user,
          wishlist,
          addToWishList: addToWishListMutation.mutate,
          removeFromWishList: removeFromWishListMutation.mutate,
        }}
      />
    </>
  );
};

export default CustomerDashboardLayout;
