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

// Import theme
import theme from "./theme";

// Import components
import Layoutmain from "./components/layoutmain";
import NotFound from "./components/Notfound";

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


import SanphamUser from "./pages/user/SanphamUser";

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
          horizontal: 'right',
        }}
      >
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<Home />} />
             <Route path="/login" element={<Login />} />
              <Route path="/products" element={<SanphamUser />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              {/* Admin Dashboard Routes */}
              <Route path="/" element={<Layoutmain />}>
                <Route index element={<Dashboard />} />
                <Route path="sanpham" element={<SanphamList />} />
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