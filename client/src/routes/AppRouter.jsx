import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../Layout/Layout";

import AddBook from "../pages/AddBook";
import AdminBooks from "../pages/AdminBooks";
import AdminDashboard from "../pages/AdminDashboard";
import AdminReaders from "../pages/AdminReaders";
import Cart from "../pages/Cart";
import EditBook from "../pages/EditBook";
import EditReader from "../pages/EditReader";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Profile from "../pages/Profile";
import ReaderDetails from "../pages/ReaderDetails";
import SavedBooks from "../pages/SavedBooks";
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
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-books" element={<SavedBooks />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/books/add" element={<AddBook />} />
            <Route path="/admin/books/edit/:id" element={<EditBook />} />
            <Route path="/admin/readers" element={<AdminReaders />} />
            <Route path="/admin/readers/:id" element={<ReaderDetails />} />
            <Route path="/admin/readers/edit/:id" element={<EditReader />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
