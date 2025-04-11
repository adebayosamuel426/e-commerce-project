import Wrapper from "../assets/wrapper/OrderPage";
import {
  useLoaderData,
  redirect,
  useNavigate,
  Link,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
const fetchSingleUser = async (id) => {
  const { data } = await customFetch.get(`/users/${id}`);
  return data;
};
export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      const { id } = params;
      const { user } = await queryClient.ensureQueryData({
        queryKey: ["eachUser", id],
        queryFn: () => fetchSingleUser(id),
      });
      return { user };
    } catch (error) {
      toast.error(error.response?.data?.message || "user not found");
      return redirect("/");
    }
  };

const UserPage = () => {
  const { user } = useLoaderData();
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: userOrders } = useQuery({
    queryKey: ["UserOrders", id],
    queryFn: async () => {
      const { data } = await customFetch.get(`/orders/user/${id}`);
      const userOrders = data.orders;
      return userOrders;
    },
    staleTime: 0,
  });
  useEffect(() => {
    if (!userOrders) return;
    setOrders(userOrders);
  }, [userOrders]);

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      await customFetch.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User deleted successfully");
    },
  });
  const handleClick = async () => {
    try {
      await deleteUserMutation.mutateAsync(id);
      await queryClient.refetchQueries(["users"]);
      navigate("/adminDashboard/all-users");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <Wrapper>
      <div className='container'>
        <h2 className='container-text'>User Details</h2>
        <div>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>User Name:</strong> {user.name}
          </p>
          <p>
            <strong>User Email:</strong> {user.email}
          </p>
          <p>
            <strong>User Role:</strong> {user.role}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(user.created_at).toLocaleString()}
          </p>
          <p>
            <strong>User Address:</strong> {user.address}
          </p>
        </div>
        <div>
          <Link to={`/adminDashboard/edit-user/${user.id}`}>
            <button className='btn-4'>Edit User</button>
          </Link>
          <button className='btn-4' onClick={handleClick}>
            Delete User
          </button>
        </div>

        <h3>User Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length < 1 ? (
              <tr>no orders made by this user</tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>$ {parseFloat(order.total_price).toFixed(2)}</td>
                  <td>{order.order_status}</td>
                  <td>
                    <Link to={`/adminDashboard/user-order/${order.id}`}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
};

export default UserPage;
