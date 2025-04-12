import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HomeLayout,
  LandingPage,
  Login,
  Register,
  ProfilePage,
  CustomerDashboard,
  CustomerDashboardLayout,
  MyProfile,
  MyOrders,
  MyWishList,
  Product,
  CartPage,
  Error,
  AdminDashboard,
  AddProduct,
  AllProducts,
  EditProduct,
  AllCategories,
  AddCategory,
  AllUsers,
  EditUser,
  AllOrders,
  UpdateOrderStatus,
  CheckOutPage,
  OrderPage,
  EditMyProfile,
  SearchPage,
  SearchPageCus,
  AdminProduct,
  UserPage,
  AdminOrderPage,
  SearchPageAdmin,
  AdminProfilePage,
  MyAdminProfile,
  EditMyAdminProfile,
  EditCategories,
  AllReviews,
  Stats,
} from "./pages";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as ProductAction } from "./pages/AddProduct";
import { action as EditMyProfileAction } from "./pages/EditMyProfile";
import { action as EditMyAdminProfileAction } from "./pages/EditMyAdminProfile";
import { loader as customerLoader } from "./pages/CustomerDashboardLayout";
import { loader as AdminLoader } from "./pages/AdminDashboard";
import { loader as homeLoader } from "./utils/dashboardLoader";
import { loader as productLoader } from "./pages/Product";
import { loader as orderLoader } from "./pages/OrderPage";
import { loader as AdminOrderLoader } from "./pages/AdminOrderPage";
import { loader as myOrdersLoaders } from "./pages/MyOrders";
import { loader as AdminProductLoader } from "./pages/AdminProduct";
import { loader as AllUsersLoader } from "./pages/AllUsers";
import { loader as UserLoader } from "./pages/UserPage";
import { loader as AllOrdersLoader } from "./pages/AllOrders";
import { loader as AllReviewsLoader } from "./pages/AllReviews";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    loader: homeLoader(queryClient),
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "login",
        element: <Login />,
        action: loginAction(queryClient),
      },
      {
        path: "register",
        element: <Register />,
        action: registerAction,
      },
      {
        path: "search-page",
        element: <SearchPage />,
      },
      {
        path: "customerDashboard",
        element: <CustomerDashboardLayout />,
        loader: customerLoader(queryClient),
        children: [
          {
            index: true,
            element: <CustomerDashboard />,
          },
          {
            path: "cart",
            element: <CartPage />,
          },
          {
            path: "checkout",
            element: <CheckOutPage />,
          },
          {
            path: "order/:id",
            element: <OrderPage />,
            loader: orderLoader(queryClient),
          },
          {
            path: "search-page",
            element: <SearchPageCus />,
          },
          {
            path: "product/:id",
            element: <Product />,
            loader: productLoader(queryClient),
          },
          {
            path: "profile",
            element: <ProfilePage />,
            children: [
              {
                index: true,
                element: <MyProfile />,
              },
              {
                path: "orders",
                element: <MyOrders />,
                loader: myOrdersLoaders(queryClient),
              },
              {
                path: "wishlists",
                element: <MyWishList />,
              },
              {
                path: "edit-profile",
                element: <EditMyProfile />,
                action: EditMyProfileAction(queryClient),
              },
            ],
          },
        ],
      },
      {
        path: "adminDashboard",
        element: <AdminDashboard />,
        loader: AdminLoader(queryClient),
        children: [
          {
            index: true,
            element: <AllProducts />,
          },
          {
            path: "add-product",
            element: <AddProduct />,
            action: ProductAction(queryClient),
          },
          {
            path: "product/:id",
            element: <AdminProduct />,
            loader: AdminProductLoader(queryClient),
          },
          {
            path: "edit-product/:id",
            element: <EditProduct />,
            loader: productLoader(queryClient),
          },
          {
            path: "search-page",
            element: <SearchPageAdmin />,
          },
          {
            path: "all-categories",
            element: <AllCategories />,
          },
          {
            path: "add-category",
            element: <AddCategory />,
          },
          {
            path: "edit-category/:id",
            element: <EditCategories />,
          },
          {
            path: "all-users",
            element: <AllUsers />,
            loader: AllUsersLoader(queryClient),
          },
          {
            path: "user-page/:id",
            element: <UserPage />,
            loader: UserLoader(queryClient),
          },
          {
            path: "user-order/:id",
            element: <AdminOrderPage />,
            loader: AdminOrderLoader(queryClient),
          },
          {
            path: "edit-user/:id",
            element: <EditUser />,
            loader: UserLoader(queryClient),
          },
          {
            path: "all-orders",
            element: <AllOrders />,
            loader: AllOrdersLoader(queryClient),
          },
          {
            path: "update-order-status/:id",
            element: <UpdateOrderStatus />,
            loader: AdminOrderLoader(queryClient),
          },
          {
            path: "all-reviews",
            element: <AllReviews />,
            loader: AllReviewsLoader(queryClient),
          },
          {
            path: "stats",
            element: <Stats />,
          },
          {
            path: "profile",
            element: <AdminProfilePage />,
            children: [
              {
                index: true,
                element: <MyAdminProfile />,
              },
              {
                path: "edit-profile",
                element: <EditMyAdminProfile />,
                action: EditMyAdminProfileAction(queryClient),
              },
            ],
          },
        ],
      },
    ],
  },
]);
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Elements stripe={stripePromise}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
      </Elements>
    </QueryClientProvider>
  );
}

export default App;
