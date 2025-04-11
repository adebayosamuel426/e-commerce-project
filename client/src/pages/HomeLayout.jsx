import { Outlet, useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchCategories = async () => {
  const { data } = await customFetch.get("/categories");
  return data.categories;
};

const fetchProducts = async () => {
  const { data } = await customFetch.get("/products");
  return data.products;
};
const HomeLayout = () => {
  const { categories, products } = useLoaderData();
  const [categoryId, setCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  //React Query will return the prefetched data instantly
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    initialData: categories,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialData: products,
  });

  if (categoriesLoading || productsLoading) {
    return <p className='loading'></p>;
  }

  const { data: selectedProducts = productsData } = useQuery({
    queryKey: ["selectedProducts", categoryId || "all"],
    queryFn: async () => {
      if (!categoryId || categoryId === "" || categoryId === "all-products")
        return productsData;
      const { data } = await customFetch.get(
        `/categories/${categoryId}/products`
      );
      const { categoryProducts } = data;
      return categoryProducts;
    },
    enabled: !!productsData,
  });

  const { data: searchedProducts = [] } = useQuery({
    queryKey: ["searchProducts", searchTerm],
    queryFn: async () => {
      const { data } = await customFetch.get(
        `/products/search?query=${searchTerm}`
      );
      const { products: searchProducts } = data;
      return searchProducts;
    },
    enabled: !!searchTerm,
  });

  const getCategoryId = (categoryId) => {
    setCategoryId(categoryId);
  };
  const getSearch = (search) => {
    setSearchTerm(search);
  };

  const getSelectedProducts = () => {
    return selectedProducts;
  };

  const getSearchProducts = () => {
    return searchedProducts;
  };

  return (
    <>
      <Outlet
        context={{
          newCategories: [
            { id: "all-products", name: "All Products" },
            ...categoriesData,
          ],
          products: productsData,
          getCategoryId,
          getSelectedProducts,
          getSearch,
          categories: categoriesData,
          getSearchProducts,
        }}
      />
    </>
  );
};

export default HomeLayout;
