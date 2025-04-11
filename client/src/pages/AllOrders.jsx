import Wrapper from "../assets/wrapper/OrderPage";
import { useLoaderData, redirect, Link } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

// Fetching orders from database using queryClient
const fetchOrders = async () => {
  const { data } = await customFetch.get(`/orders`);
  return data;
};
export const loader = (queryClient) => async () => {
  try {
    const { orders } = await queryClient.ensureQueryData({
      queryKey: ["allOrders"],
      queryFn: fetchOrders,
    });
    return { orders };
  } catch (error) {
    toast.error(error.response?.data?.message || "orders not found");
    return redirect("/");
  }
};

const AllOrders = () => {
  const { orders } = useLoaderData();
  return (
    <Wrapper>
      <main className='container'>
        <div className='header'>
          <h1>All Orders</h1>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length < 1 ? (
              <div>
                <p>No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user_id}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>{order.total_price}</td>
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
      </main>
    </Wrapper>
  );
};

export default AllOrders;
