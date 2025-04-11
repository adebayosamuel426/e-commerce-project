import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "./customFetch";


const fetchCategories = async(req, res) => {
    const { data } = await customFetch.get("/categories");
    const categories = data.categories
    return categories;
}
const fetchProducts = async(req, res) => {
    const { data } = await customFetch.get("/products");
    const products = data.products
    return products;
};
export const loader = (queryClient) => async() => {
    try {

        await queryClient.prefetchQuery({
            queryKey: ["categories"],
            queryFn: fetchCategories,
        });
        await queryClient.prefetchQuery({
            queryKey: ["products"],
            queryFn: fetchProducts,
        });
        const categories = queryClient.ensureQueryData(["categories"]) || []


        const products = queryClient.getQueryData(["products"]) || []

        return { categories, products };

    } catch (error) {

        toast.error("Something went wrong");
        return redirect("/");

    }
}