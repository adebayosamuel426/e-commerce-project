import { FormRow, SubmitBtn } from "../components";
import {
  useNavigate,
  useOutletContext,
  useLoaderData,
  useParams,
} from "react-router-dom";
import Wrapper from "../assets/wrapper/RegisterAndLoginPage";
import customFetchProduct from "../utils/customFetchProduct";
import { toast } from "react-toastify";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EditProduct = () => {
  const { categories } = useOutletContext();
  const { product } = useLoaderData();
  console.log("product", product);
  const queryClient = useQueryClient();
  const editProductMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      await customFetchProduct.patch(`/products/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["product", id]);
      queryClient.invalidateQueries(["AdminProduct", id]);
    },
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category_id", newProduct.category_id);
    formData.append("stock", newProduct.stock);
    if (newProduct.image instanceof File) {
      formData.append("image", newProduct.image); // append new image if image changes
    }
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
    console.log(imagePreview);

    try {
      await editProductMutation.mutateAsync({ id, formData });
      await queryClient.refetchQueries(["AdminProduct", id]); //refreshes the admin product
      toast.success("Product updated successfully!");
      navigate("/adminDashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProduct((prev) => ({ ...prev, image: file })); // Update the new product state with the new image file
      setImagePreview(URL.createObjectURL(file)); // Preview image before upload
    }
  };
  return (
    <Wrapper>
      <form
        method='post'
        className='form'
        encType='multipart/form-data'
        onSubmit={handleSubmit}
      >
        <h4>Edit Product</h4>
        <FormRow
          type='text'
          name='name'
          labelText='name of product'
          onChange={handleInputChange}
          defaultValue={product.name}
        />
        <FormRow
          type='text'
          name='description'
          labelText='description of the product'
          onChange={handleInputChange}
          defaultValue={product.description}
        />
        <div className='form-row'>
          <label htmlFor='price' className='form-label'>
            Enter the Price:
          </label>
          <input
            name='price'
            type='number'
            // value={newProduct.price}
            step='0.01'
            min='0'
            className='form-input'
            onChange={handleInputChange}
            defaultValue={product.price}
          />
        </div>
        <FormRow
          type='number'
          name='stock'
          labelText='Number of product in stock'
          // value={newProduct.stock}
          onChange={handleInputChange}
          defaultValue={product.stock}
        />
        <div className='form-row'>
          <label htmlFor='category_id' className='form-label'>
            Select the category:
          </label>
          <select
            name='category_id'
            id='category_id'
            className='form-select'
            // value={newProduct.category_id}
            onChange={handleInputChange}
            defaultValue={product.category_id}
          >
            {categories.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className='form-row'>
          <label htmlFor='image' className='form-label'>
            Select an image file (max 0.5 MB)
          </label>
          <input
            id='image'
            type='file'
            name='image'
            className='form-input'
            accept='image/*'
            onChange={handleImageChange}
          />
        </div>
        {imagePreview && (
          <img
            src={imagePreview}
            alt='Preview'
            width='100'
            className='image-prev'
          />
        )}
        <SubmitBtn />
      </form>
    </Wrapper>
  );
};

export default EditProduct;
