// Export to use in other files
export const notifyAdminsOfNewOrder = (orderData) => {
    adminSockets.forEach((socketId) => {
        io.to(socketId).emit("new_order", orderData);
    });
};