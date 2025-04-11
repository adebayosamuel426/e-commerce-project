import Wrapper from "../assets/wrapper/OrderPage";
import { useLoaderData, redirect, Link } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

const fetchUserOrders = async (id) => {
  const { data } = await customFetch.get(`/orders/${id}`);
  return data;
};
export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      const { id } = params;

      const data = await queryClient.ensureQueryData({
        queryKey: ["adminOrder", id],
        queryFn: () => fetchUserOrders(id),
      });
      if (!data) {
        throw new Error("No data returned");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "order not found");
      return redirect("/");
    }
  };
const AdminOrderPage = () => {
  const { order, items, payment } = useLoaderData();
  return (
    <Wrapper>
      <div className='container'>
        <h2 className='container-text'>Order Details</h2>
        <div>
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>User ID:</strong> {order.user_id}
          </p>
          <p>
            <strong>User Name:</strong> {order.name}
          </p>
          <p>
            <strong>User email:</strong> {order.email}
          </p>
          <p>
            <strong>Shipping Address:</strong> {order.address}
          </p>
          <p>
            <strong>Total Price:</strong> $
            {parseFloat(order.total_price).toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {order.order_status}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Payment Method:</strong> {payment.payment_method}
          </p>
          <p>
            <strong>Transaction ID:</strong> {payment.transaction_id}
          </p>
          <p>
            <strong>Transaction status:</strong> {payment.payment_status}
          </p>
        </div>
        <Link to={`/adminDashboard/update-order-status/${order.id}`}>
          <button type='button' className='btn-4'>
            Update order Status
          </button>
        </Link>
        <h3>Ordered Items</h3>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Picture</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.product_id}>
                <td>{item.product_id}</td>
                <td>{item.name}</td>
                <td>
                  <img src={item.image_url} alt={item.name} />
                </td>
                <td>{item.qty}</td>
                <td>${parseFloat(item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
};

export default AdminOrderPage;
