import React from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Bounce, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Import theme
import theme from "./theme";

// Import components
import Layoutmain from "./components/layoutmain";
import NotFound from "./components/Notfound";
import AboutPage from "./components/About";
import ContactPage from "./components/Contact";
import ProfilePage from "./components/ProfileHome";
import BackToTop from "./components/Backtotop";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// Import pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Thongke from "./pages/Thongke";


// Import admin pages
import SanphamList from "./pages/admin/Sanpham/SanphamList";
import DanhmucList from "./pages/admin/Danhmuc/DanhmucList";
import MagiamgiaList from "./pages/admin/Magiamgia/MagiamgiaList";
import DonhangList from "./pages/admin/Donhang/DonhangList";
import NguoidungList from "./pages/admin/Nguoidung/NguoidungList";
import NguoidungView from "./pages/admin/Nguoidung/NguoidungView";
import Profile from "./pages/Profile";
import DanhgiaList from "./pages/admin/Danhgia/DanhgiaList";
import BientheList from "./pages/admin/Bienthe/BientheList";



import SanphamUser from "./pages/userSanpham/SanphamUser";
import Cartuser from "./pages/userCart/Cartuser";
import Checkout from "./pages/userCart/Checkout";
import OrderDetails from "./pages/userCart/Detailcart";
import Detailproducts from "./pages/userCart/Detailproducts";
import Dannhmuchome from "./pages/userDanhmuc/Danhmuchome";
import Thuonghieuhome from "./pages/userThuonghieu/ThuonghieuUser";
import Wishlist from "./pages/userWishlist/Wishlist";
import WishlistUser from "./pages/userWishlist/WishlistUser";
import DetailSanpham from "./pages/DetaiSanpham/DetailSanpham";
import DetailSanphamUser from "./pages/DetaiSanpham/DetailSanphamUser";





//test cho thai đoi tu thong ke qua

// Protected Route Component
const PrivateRoute = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user ? <Outlet /> : <Navigate to="/home" />;
};

// Main Dashboard Component
const Dashboard = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🏠 Trang chủ Admin Dashboard</h1>
      
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider   
        maxSnack={3} 
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        
      >
         <ToastContainer position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce} />
        <BackToTop/>  
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<Home />} />
             <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route path="/products" element={<SanphamUser />} />
              <Route path="/cart" element={<Cartuser/>}/>
              <Route path="/checkout" element={<Checkout/>}/>
              <Route path="/orders" element={<OrderDetails/>}/>
              <Route path="/donhang/:id" element={<Detailproducts/>}/>
              <Route path="/danhmuc/:id" element={<Dannhmuchome/>}/>
              <Route path="/thuonghieu/:brand" element={<Thuonghieuhome/>}/>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/profilehome" element={<ProfilePage />} />
              <Route path="/wishlist" element={<WishlistUser />} />
              <Route path="/sanpham/:id" element={<DetailSanphamUser />} />
              {/* <Route path="/wishlist/:id" element={<Wishlist />} /> */}


            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              {/* Admin Dashboard Routes */}
              <Route path="/" element={<Layoutmain />}>
                <Route index element={<Dashboard />} />
                <Route path="sanpham" element={<SanphamList />} />
                <Route path="bienthe" element={<BientheList />} />

                <Route path="danhmuc" element={<DanhmucList />} />
                <Route path="magiamgia" element={<MagiamgiaList />} />
                <Route path="donhang" element={<DonhangList />} />
                <Route path="nguoidung" element={<NguoidungList />} />
                <Route path="profile" element={<Profile/>}/>
                <Route path="danhgia" element={<DanhgiaList/>}/>
                <Route path="thongke" element={<Thongke/>}/>
                {/* <Route path="list" element={<DSlist/>}></Route> */}

                {/* Nested Routes for Nguoidung */}
              </Route>
              
              {/* Separate Home Route (outside admin layout) */}
              <Route path="/home" element={<Home />} />
             
            
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;