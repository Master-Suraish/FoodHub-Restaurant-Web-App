import axios from "axios";

// const API_BASE_URL = "http://localhost:3001/api";
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_RAILWAY_URL}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        await apiClient.post("/auth/refresh-token");

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh token failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Global error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data);
    console.error("API Message:", error.message);
    return Promise.reject(error);
  },
);

export const contactAPI = {
  sendMessage: (formData) => apiClient.post("/contact", formData),
  getAllContacts: (page = 1, limit = 10) =>
    apiClient.get("/contact/all", { params: { page, limit } }),

  deleteContact: (id) => apiClient.delete(`/contact/delete/${id}`),
};

export const foodAPI = {
  getAllFoods: async (
    page = 1,
    limit = 6,
    selectedCategory = "all",
    search = "",
  ) => {
    return apiClient.get(
      `/foods?page=${page}&limit=${limit}&selectedCategory=${selectedCategory}&searchFood=${search}`,
    );
  },

  getFoodById: (id) => apiClient.get(`/foods/${id}`),

  addFood: (foodData) => apiClient.post("/foods/add", foodData),

  updateFood: (id, foodData) =>
    apiClient.patch(`/foods/update/${id}`, foodData),

  deleteFood: (id) => apiClient.delete(`/foods/delete/${id}`),
};

export const addressAPI = {
  getUserAddresses: () => apiClient.get("/address"),

  getAddressById: (id) => apiClient.get(`/address/${id}`),

  createAddress: (data) => apiClient.post("/address", data),

  updateAddress: (id, data) => apiClient.patch(`/address/update/${id}`, data),
  deleteAddress: (id) => apiClient.delete(`/address/delete/${id}`),
};

export const orderAPI = {
  createOrder: (orderData) => apiClient.post("/orders", orderData),

  getUserOrders: (status) => {
    return apiClient.get("/orders", {
      params: status ? { status } : {},
    });
  },
  getAllOrders: (status) => {
    return apiClient.get("/orders/all", {
      params: status ? { status } : {},
    });
  },

  getOrderById: (id) => apiClient.get(`/orders/${id}`),

  updateOrderStatus: (id, status) =>
    apiClient.patch(`/orders/${id}/status`, { status }),

  cancelOrder: (id) => apiClient.delete(`/orders/${id}`),

  getUserAddresses: () => addressAPI.getUserAddresses(),
};

export const cartAPI = {
  addToCart: (foodId, quantity = 1) =>
    apiClient.post("/cart/add", { foodId, quantity }),

  getCart: () => apiClient.get("/cart"),

  removeFromCart: (foodId) => apiClient.delete(`/cart/remove/${foodId}`),

  updateCartQuantity: (foodId, quantity) =>
    apiClient.put(`/cart/update/${foodId}`, { quantity }),

  clearCart: () => apiClient.delete("/cart/clear"),
};

export const userAPI = {
  getAllUsers: () => apiClient.get("/users"),
  deleteUser: (id) => apiClient.delete(`/users/delete/${id}`),
  verifyEmail: (token) => apiClient.get(`/auth/verify-email/${token}`),
};

export const authAPI = {
  login: (email, password) =>
    apiClient.post("/auth/user/login", { email, password }),
  logout: () => apiClient.post("/auth/user/logout"),
  me: () => apiClient.get("/auth/me"),
};
