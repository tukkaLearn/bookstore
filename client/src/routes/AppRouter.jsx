import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../Layout/Layout";

import Cart from "../pages/Cart";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book/:id" element={<Products />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
