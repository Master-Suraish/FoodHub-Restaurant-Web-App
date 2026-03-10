import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "./services/api";

import { useToast } from "./context/ToastContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Cart from "./cart/Cart";
import AdminInventoy from "./admin/AdminInventoy";
import AdminContacts from "./admin/AdminContacts";
import AdminLogin from "./auth/AdminLogin";
import ProtectedRoute from "./auth/ProtectedRoute";
import OrderPage from "./pages/OrderPage";
import AdminNavbar from "./admin/AdminNavbar";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";
import VerifyEmailPage from "./pages/VerifyEmailPage";

function App() {
  const showToast = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [foods, setFoods] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const setUserAfterLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setCartItems([]);
      navigate("/");
      showToast("Logged out successfully!", "success");
      localStorage.clear();
    } catch (error) {
      showToast("Logout failed", "error");
    }
  };

  const removeFromCart = (foodId) => {
    setCartItems(cartItems.filter((item) => item.id !== foodId));
  };

  const updateCartQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === foodId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-light">
      {user?.role === "admin" ? (
        <AdminNavbar user={user} handleLogout={handleLogout} />
      ) : (
        <Navbar
          cartCount={cartItems.length}
          user={user}
          handleLogout={handleLogout}
        />
      )}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={<Login setUserAfterLogin={setUserAfterLogin} />}
          />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/signup" element={<Signup />} />

          {/* Cart Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart
                  foods={foods}
                  cartItems={cartItems}
                  removeFromCart={removeFromCart}
                  updateCartQuantity={updateCartQuantity}
                  clearCart={clearCart}
                />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/foods"
            element={
              <ProtectedRoute>
                <AdminInventoy foods={foods} setFoods={setFoods} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <ProtectedRoute>
                <AdminContacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={<AdminLogin setUserAfterLogin={setUserAfterLogin} />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
