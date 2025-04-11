import { createSlice } from '@reduxjs/toolkit';
import { openModal } from '../modal/modalSlice';
const loadCartFromLocalStorage = (userId) => {
    const cartData = localStorage.getItem(`cart_${userId}`);
    return cartData ? JSON.parse(cartData) : { cartItems: [], amount: 0, total: 0 };
};
const initialState = {
    cartItems: [],
    amount: 0,
    total: 0,
    userId: null, // Stores the logged-in user ID
    isSidebarOpen: false, // Sidebar state
};
const saveCartToLocalStorage = (state, userId) => {
    localStorage.setItem(`cart_${userId}`, JSON.stringify({
        cartItems: state.cartItems,
        amount: state.amount,
        total: state.total
    }));

};
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {


        setUser: (state, action) => {
            state.userId = action.payload;
            const userCart = loadCartFromLocalStorage(state.userId);
            state.cartItems = userCart.cartItems;
            state.amount = userCart.amount;
            state.total = userCart.total;
        },
        addToCart: (state, action) => {
            if (!state.userId) return;
            const product = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({...product, quantity: 1 });
            }
            cartSlice.caseReducers.calculateTotals(state);
            saveCartToLocalStorage(state, state.userId);
        },

        increase: (state, { payload }) => {
            if (!state.userId) return;
            const cartItem = state.cartItems.find((item) => item.id === payload.id);
            if (cartItem) {
                cartItem.quantity += 1;
                cartSlice.caseReducers.calculateTotals(state);
                saveCartToLocalStorage(state, state.userId);
            }

        },

        decrease: (state, { payload }) => {
            if (!state.userId) return;
            const cartItem = state.cartItems.find((item) => item.id === payload.id);
            if (cartItem) {
                if (cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                } else {
                    state.cartItems = state.cartItems.filter((item) => item.id !== payload.id);
                }
                cartSlice.caseReducers.calculateTotals(state);
                saveCartToLocalStorage(state, state.userId);
            }
        },

        removeItem: (state, action) => {
            if (!state.userId) return;
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
            cartSlice.caseReducers.calculateTotals(state);
            saveCartToLocalStorage(state, state.userId);
        },

        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            state.cartItems.forEach((item) => {
                amount += item.quantity;
                total += item.quantity * item.price;
            });
            state.amount = amount;
            state.total = total;

        },

        clearCart: (state) => {
            if (!state.userId) return;
            state.cartItems = [];
            state.amount = 0;
            state.total = 0;
            saveCartToLocalStorage(state, state.userId);
        },

        openSidebar: (state) => {
            state.isSidebarOpen = true;

        },

        closeSidebar: (state) => {
            state.isSidebarOpen = false;
        },
    },
});




export const {
    setUser,
    addToCart,
    removeItem,
    increase,
    calculateTotals,
    decrease,
    clearCart,
    openSidebar,
    closeSidebar
} = cartSlice.actions;

export default cartSlice.reducer;