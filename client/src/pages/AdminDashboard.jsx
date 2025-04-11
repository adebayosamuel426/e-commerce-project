import { AdminNavbar, AdminSidebar } from "../components";
import {
  Outlet,
  redirect,
  useLoaderData,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
const fetchUserProfile = async () => {
  const { data } = await customFetch.get("/users/profile");
  return data.user;
};

export const loader = (queryClient) => async () => {
  try {
    const user = await queryClient.ensureQueryData({
      queryKey: ["AdminUser"],
      queryFn: fetchUserProfile,
    });
    return { user };
  } catch (error) {
    return redirect("/");
  }
};
const AdminDashboard = () => {
  const { user } = useLoaderData();
  const parentContext = useOutletContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //logout user
  const logout = async () => {
    try {
      await customFetch.get("/auth/logout");
      toast.success("user logging out");
      queryClient.invalidateQueries();
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      <AdminNavbar logout={logout} />
      <AdminSidebar />
      <Outlet context={{ ...parentContext, user }} />
    </>
  );
};

export default AdminDashboard;
