import './styles/App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Products from "./pages/Products/Products.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import Login from "./pages/Login/Login.jsx";
import Admin from "./pages/Admin/Admin/Admin.jsx";
import AddProduct from "./pages/Admin/AddProduct/AddProduct.jsx";
import ManageProducts from "./pages/Admin/ManageProducts/ManageProducts.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/products" element={<Products />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/manage-products" element={<ManageProducts />} />
            <Route path="/login" element={<Login />} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    </>
  )
}

export default App
