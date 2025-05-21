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
import SanphamEdit from "./pages/admin/Sanpham/SanphamEdit";


// Route bảo vệ: nếu có "user" trong localStorage thì cho vào, không thì chuyển tới /login
const PrivateRoute = () => {
  const user = localStorage.getItem("user");
  return user ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}></SnackbarProvider>
      <Router>
        <Routes>
          {/* Route đăng nhập */}
          <Route path="/login" element={<Login />} />

          {/* Các route cần đăng nhập, nằm trong layout chính */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layoutmain />}>
              <Route
                index
                element={<h1>Trang chủ - thêm /sanpham để xem sản phẩm</h1>}
              />
              <Route path="sanpham" element={<SanphamList />} />
              <Route path="sanpham/edit/:id" element={<SanphamEdit />} />
            </Route>
          </Route>

          {/* Route cho path không khớp */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
