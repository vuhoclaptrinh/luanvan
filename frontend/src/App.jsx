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
import theme from "./theme";
import { SnackbarProvider } from 'notistack';

// Gọi các component
import Layoutmain from "./components/layoutmain";
import NotFound from "./components/Notfound";
import Login from "./pages/Login";


import SanphamList from "./pages/admin/Sanpham/SanphamList";

import DanhmucList from "./pages/admin/Danhmuc/DanhmucList";



// Route bảo vệ: nếu có "user" trong sessionStorage thì cho vào, không thì chuyển tới /login
const PrivateRoute = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}></SnackbarProvider>
      <Router>
        <Routes>   
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layoutmain />}>
              <Route index element={<h1>Trang chủ - thêm /sanpham để xem sản phẩm</h1>}/>
              <Route path="sanpham" element={<SanphamList />} />
              <Route path="danhmuc" element={<DanhmucList />} />
              {/* Thêm các route khác ở đây */}
             
            </Route>  
          </Route>

         
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
