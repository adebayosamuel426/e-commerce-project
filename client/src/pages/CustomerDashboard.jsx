import React from "react";
import { CartSlide } from "../components";
import { Products } from "../components";
import { useSelector } from "react-redux";
const CustomerDashboard = () => {
  const { isSidebarOpen } = useSelector((store) => store.cart);

  return (
    <main>
      <Products />
      {isSidebarOpen && <CartSlide />}
    </main>
  );
};

export default CustomerDashboard;
