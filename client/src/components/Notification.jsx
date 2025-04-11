import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import Wrapper from "../assets/wrapper/Notification";
import { Link } from "react-router-dom";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const socket = io({
  SOCKET_URL,
  withCredentials: true,
}); // Change to your backend in production

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const clearTimerRef = useRef(null);
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("admin_join");

    const handleNewOrder = (order) => {
      setNotifications((prev) => [order, ...prev]);
      setUnreadCount((count) => count + 1);

      if ((unreadCount + 1) % 5 === 0) {
        toast.info(` ${unreadCount + 1} new orders`);
      }
    };

    // 🧹 Prevent duplicates before attaching
    socket.off("new_order", handleNewOrder);
    socket.on("new_order", handleNewOrder);

    return () => {
      socket.off("new_order", handleNewOrder); // clean specific listener
    };
  }, [unreadCount]);
  const handleBellClick = () => {
    setDropdownOpen((prev) => {
      const opening = !prev;

      if (opening) {
        //  Set the timer
        clearTimerRef.current = setTimeout(() => {
          setUnreadCount(0);
        }, 10000);
      } else {
        // Clear if dropdown is being closed early
        clearTimeout(clearTimerRef.current);
      }

      return opening;
    });
  };

  useEffect(() => {
    return () => {
      // Clear timer if component is unmounted while dropdown is open
      clearTimeout(clearTimerRef.current);
    };
  }, []);
  return (
    <Wrapper>
      <div className='notification-wrapper'>
        <FaBell className='bell-icon' onClick={handleBellClick} />
        {unreadCount > 0 && (
          <span className='notification-badge'>{unreadCount}</span>
        )}
        {dropdownOpen && (
          <div className='notification-dropdown'>
            <h4>New Orders</h4>
            {notifications.length === 0 ? (
              <p>No recent orders</p>
            ) : (
              notifications.slice(0, 5).map((order, index) => (
                <Link to={`/adminDashboard/user-order/${order.orderId}`}>
                  <div key={index} className='notification-item'>
                    <strong>Order #{order.orderId}</strong>
                    <p>
                      {order.customer_name} ({order.customer_email})
                    </p>
                    <small>{new Date(order.created_at).toLocaleString()}</small>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Notification;
