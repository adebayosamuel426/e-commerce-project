import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddCategory from "../../src/pages/AddCategory";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Mock SubmitBtn to avoid useNavigation() error
vi.mock("../../src/components/SubmitBtn", () => ({
  __esModule: true,
  default: () => <button type='submit'>Mock Submit</button>,
}));

// ✅ Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// ✅ Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ✅ Mock customFetch
vi.mock("../../src/utils/customFetch", () => ({
  default: {
    post: vi.fn().mockResolvedValue({}),
  },
}));
const queryClient = new QueryClient();

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("AddCategory Page", () => {
  it("renders the form elements correctly", () => {
    renderWithProviders(<AddCategory />);
    expect(
      screen.getByRole("heading", { name: /add category/i })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/enter the category name/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("submits the form and calls API + shows toast + navigates", async () => {
    const inputValue = "New Category";
    renderWithProviders(<AddCategory />);

    fireEvent.change(screen.getByLabelText(/enter the category name/i), {
      target: { value: inputValue },
    });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/adminDashboard/all-categories"
      );
    });
  });
});
