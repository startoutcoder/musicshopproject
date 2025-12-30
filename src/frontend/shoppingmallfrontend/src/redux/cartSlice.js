import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        /**
         * Adds a product to the cart. If the product already exists,
         * its quantity is increased.
         */
        addToCart: (state, action) => {
            const productToAdd = action.payload;

            const existingItem = state.items.find(item => item.product.productId === productToAdd.productId);

            if (existingItem) {
                existingItem.quantity++;
                existingItem.totalPrice += productToAdd.productPrice;
            } else {
                state.items.push({
                    product: productToAdd,
                    quantity: 1,
                    totalPrice: productToAdd.productPrice,
                });
            }

            state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
        },

        /**
         * Removes one instance of a product from the cart. If the quantity
         * reaches zero, the item is removed entirely.
         */
        removeFromCart: (state, action) => {
            const productIdToRemove = action.payload;
            const existingItem = state.items.find(item => item.product.productId === productIdToRemove);

            if (!existingItem) return;

            if (existingItem.quantity === 1) {
                state.items = state.items.filter(item => item.product.productId !== productIdToRemove);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice -= existingItem.product.productPrice;
            }

            state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
        },

        /**
         * Clears the entire cart.
         */
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
