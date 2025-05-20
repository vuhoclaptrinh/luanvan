import React from "react";
import "./App.css"; // Import CSS
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

// Gọi các component
import Layoutmain from "./components/layoutmain";
import SanphamList from "./pages/admin/Sanpham/SanphamList";
import NotFound from "./components/Notfound";

// const PrivateRoute = ({ children }) => {
//   const user = localStorage.getItem("user");
//   return user ? children : <Navigate to="/login" />;
// };

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Route chính dùng Layout bọc */}
          <Route
            path="/"
            element={ 
                <Layoutmain  />   
            }
          >
            {/* Đây là các route con nằm trong Layout */}
            <Route
              index
              element={<h1>Trang chủ - thêm /sanpham để xem sản phẩm</h1>}
            />
            <Route path="sanpham" element={<SanphamList />} />
          </Route>

          {/* Route cho các path không khớp */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
