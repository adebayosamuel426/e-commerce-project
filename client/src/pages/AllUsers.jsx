import Wrapper from "../assets/wrapper/OrderPage";
import { useLoaderData, redirect, Link } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { IoSearch } from "react-icons/io5";
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";

//fetching users from database
const fetchUsers = async () => {
  const { data } = await customFetch.get(`/users`);
  return data.users || [];
};

// loader for prefetching data;
export const loader = (queryClient) => async () => {
  try {
    const { users } = await queryClient.ensureQueryData({
      queryKey: ["users"],
      queryFn: fetchUsers,
    });
    return { users };
  } catch (error) {
    toast.error(error.response?.data?.message || "users not found");
    return redirect("/");
  }
};

const AllUsers = () => {
  const { users } = useLoaderData();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Fetch all users
  const {
    data: allUsers = [],
    isLoading: isAllUsersLoading,
    isError: isAllUsersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    initialData: users,
  });
  // Fetch searched users
  const { data: searchedUsers = [], isLoading: isSearchLoading } = useQuery({
    queryKey: ["searchUsers", debouncedQuery],
    queryFn: async () => {
      const res = await customFetch.get("/users/search", {
        params: { query: debouncedQuery },
      });
      const searchedUsers = res.data.users;
      return searchedUsers;
    },
    enabled: !!debouncedQuery, // Only fetch when query is not empty
    staleTime: 0, // Forces fresh fetch
  });
  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((search) => {
      setDebouncedQuery(search);
    }, 500),
    []
  );

  // Handle search input changes
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };
  // Trigger search on input change
  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel(); // cleanup
  }, [query, debouncedSearch]);
  // Display searched users if there is a query; otherwise, show all users
  // Determine which users to display
  const usersToDisplay = debouncedQuery ? searchedUsers : allUsers;
  const isLoading = isAllUsersLoading || isSearchLoading;
  return (
    <Wrapper>
      <main className='container'>
        <div className='header'>
          <h1>All Users</h1>
        </div>
        <div className='searchDiv'>
          <input
            name='search'
            type='text'
            className='search-input'
            placeholder='Search by name or email...'
            value={query}
            onChange={handleSearchChange}
          />
          <label htmlFor='search'>
            <IoSearch className='searchIcon' />
          </label>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>User Role</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <p>Loading...</p>}
            {isAllUsersError && <p>Failed to load users.</p>}
            {usersToDisplay.length === 0 && !isLoading && (
              <p>No users found.</p>
            )}
            {usersToDisplay.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>
                  <Link to={`/adminDashboard/user-page/${user.id}`}>
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

export default AllUsers;
