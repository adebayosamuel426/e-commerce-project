import { FormRow, Logo, SubmitBtn } from "../components";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";
import Wrapper from "../assets/wrapper/RegisterAndLoginPage";
import { useState } from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateOrderStatus = () => {
  const [formData, setFormData] = useState({
    status: "",
  });
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const { order } = useLoaderData();
  const oldStatus = order.order_status.trim().toLowerCase();
  const queryClient = useQueryClient();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ formData, orderId }) => {
      await customFetch.patch(`/orders/${orderId}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allOrders"]); // invalidates and updates the order
      queryClient.invalidateQueries(["orders"]); // invalidates and updates user orders
      queryClient.invalidateQueries(["adminOrder", orderId]); // invalidates and updates the order
      queryClient.invalidateQueries(["order", orderId]);

      toast.success("Order status updated successfully!");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateOrderStatusMutation.mutateAsync({ formData, orderId });
      await queryClient.refetchQueries(["adminOrder", orderId]);
      return navigate(`/adminDashboard/user-order/${orderId}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );

      return null; // Prevent execution if there's an error updating order status to the database
    }
  };

  return (
    <Wrapper>
      <form method='post' className='form' onSubmit={handleSubmit}>
        <h2>Update Order Status</h2>
        <div className='form-row'>
          <label htmlFor='status' className='form-label'>
            Select the status:
          </label>
          <select
            name='status'
            id='status'
            className='form-select'
            onChange={handleChange}
            defaultValue={formData.status || oldStatus}
          >
            <option value=''>Select an option</option>
            <option value='pending'>pending</option>
            <option value='shipped'>shipped</option>
            <option value='delivered'>delivered</option>
            <option value='cancelled'>cancelled</option>
          </select>
        </div>
        <SubmitBtn />
      </form>
    </Wrapper>
  );
};

export default UpdateOrderStatus;
