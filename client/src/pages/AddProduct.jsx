import React from "react";
import { FormRow, SubmitBtn } from "../components";
import { Form, redirect, useOutletContext } from "react-router-dom";
import Wrapper from "../assets/wrapper/RegisterAndLoginPage";
import customFetchProduct from "../utils/customFetchProduct";
import { toast } from "react-toastify";
import { useState } from "react";

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();

    const file = formData.get("image");

    // Check if the file is selected
    if (!file) {
      toast.error("Please select an image file.");
      return null;
    }
    if (file && file.size > 500000) {
      toast.error("Image size too large");
      return null; // Prevent execution if image is too large
    }

    // Log form data properly
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    try {
      await customFetchProduct.post("/products", formData);
      toast.success("Product added successfully!");
      queryClient.invalidateQueries(["products"]);
      return redirect("/AdminDashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return null;
    }
  };
const AddProduct = () => {
  const { categories } = useOutletContext();
  console.log(categories);

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Preview image before upload
    }
  };
  return (
    <Wrapper>
      <Form
        method='post'
        className='form'
        encType='multipart/form-data'
        onSubmit={() => console.log(" Form submitted!")}
      >
        <h4>Add Product</h4>
        <FormRow type='text' name='name' labelText='name of product' />
        <FormRow
          type='text'
          name='description'
          labelText='description of the product '
        />
        <div className='form-row'>
          <label htmlFor='price' className='form-label'>
            Enter the Price:
          </label>
          <input
            name='price'
            type='number'
            step='0.01'
            min='0'
            className='form-input'
          />
        </div>
        <FormRow
          type='number'
          name='stock'
          labelText='Number of product in stock'
        />
        <div className='form-row'>
          <label htmlFor='category_id' className='form-label'>
            Select the category:
          </label>
          <select name='category_id' id='category_id' className='form-select'>
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
        {imagePreview && <img src={imagePreview} alt='Preview' width='100' />}
        <SubmitBtn />
      </Form>
    </Wrapper>
  );
};

export default AddProduct;
