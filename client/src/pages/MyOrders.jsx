import Wrapper from "../assets/wrapper/OrderPage";
import { useLoaderData, redirect, Link } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

const fetchOrders = async () => {
  const { data } = await customFetch.get(`/orders/user`);
  return data;
};

export const loader = (queryClient) => async () => {
  try {
    const orders = await queryClient.ensureQueryData({
      queryKey: ["orders"],
      queryFn: fetchOrders,
    });
    return orders;
  } catch (error) {
    toast.error(error.response?.data?.message || "orders not found");
    return redirect("/");
  }
};
const MyOrders = () => {
  const { orders } = useLoaderData();
  return (
    <Wrapper>
      <main className='container'>
        <div className='header'>
          <h1>My Orders</h1>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>$ {parseFloat(order.total_price).toFixed(2)}</td>
                <td>{order.order_status}</td>
                <td>
                  <Link to={`/CustomerDashboard/order/${order.id}`}>
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Wrapper>
  );
};

export default MyOrders;
