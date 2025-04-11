import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Wrapper from "../assets/wrapper/RegisterAndLoginPage";
import { clearCart } from "../features/cart/cartSlice";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const CheckOutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems } = useSelector((store) => store.cart);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const { data } = await customFetch.post("/orders", orderData);
      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create order.");
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async ({ localOrderId, status }) => {
      await customFetch.patch(`/orders/payment/${localOrderId}`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
  // Create the order on mount and get the PaymentIntent client secret
  if (!stripe || !elements) {
    // Stripe.js has not yet loaded.
    return (
      <Wrapper>
        <div className='loading'></div>
      </Wrapper>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    console.log("Form submission started...");

    let localClientSecret;
    let localOrderId;

    try {
      const orderData = {
        items: cartItems,
        payment_method: "card",
      };

      // 🛒 Create order & get clientSecret
      const { clientSecret, orderId } = await createOrderMutation.mutateAsync(
        orderData
      );

      console.log("Client Secret received:", clientSecret);

      localClientSecret = clientSecret;
      localOrderId = orderId;
    } catch (err) {
      setProcessing(false);
      if (err.response && err.response.status === 400) {
        // Handle stock errors

        toast.error(err.response.data.message);
        return;
      } else {
        //  Handle other payment errors
        console.error("Payment Error:", err.message);
        toast.error("Payment failed. Please try again.");
      }
      return;
    }

    console.log("Processing payment with Client Secret:", localClientSecret);

    if (!localClientSecret) {
      toast.error("Payment could not be processed.");
      setProcessing(false);
      return;
    }

    //  Confirm Card Payment
    const cardElement = elements.getElement(CardElement);
    const { error: paymentError, paymentIntent } =
      await stripe.confirmCardPayment(localClientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

    //For payment error
    const paymentFailed =
      paymentError || !paymentIntent || paymentIntent.status !== "succeeded";

    if (paymentFailed) {
      const message =
        paymentError?.message || "Payment failed or was incomplete.";
      toast.error(message);
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment succeeded!");
      setProcessing(false);

      if (localOrderId) {
        navigate(`/CustomerDashboard/order/${localOrderId}`, { replace: true });
      } else {
        toast.error("Could not redirect to order page.");
      }

      try {
        // update payment status
        await createPaymentMutation.mutateAsync({
          localOrderId,
          status: paymentIntent.status,
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Payment status could not be updated."
        );
        return;
      }

      //  Clear the cart after successful payment
      dispatch(clearCart());
    }
  };

  return (
    <Wrapper>
      <div>
        <h4>Checkout</h4>
        <form method='post' onSubmit={handleSubmit} className='form'>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "30px",
                  color: "#32325d",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#fa755a",
                },
              },
              hidePostalCode: true,
            }}
          />
          <button
            type='submit'
            disabled={processing}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              hover: true,
            }}
          >
            {processing ? "Processing…" : "Pay"}
          </button>
        </form>
      </div>
    </Wrapper>
  );
};

export default CheckOutPage;
