import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryIcon from "@mui/icons-material/Inventory";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DiscountIcon from "@mui/icons-material/LocalOffer";
import GroupIcon from "@mui/icons-material/Group";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const LayoutMain = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Menu tài khoản
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy user info từ localStorage (giả sử user info được lưu dưới key "user")
  // const userJson = localStorage.getItem("user");
  // const user = userJson ? JSON.parse(userJson) : null;
  // const userName = user ? user.name : "Khách";

  const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;
console.log("User hiện tại:", user);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAccountMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleAccountMenuClose();
    localStorage.removeItem("user"); // Xóa thông tin user khi logout
    localStorage.removeItem("token"); // Xóa token nếu có
    navigate("/login"); // Chuyển về trang đăng nhập
  };

  const menuItems = [
    { text: "Quản Lý Danh Mục", icon: <CategoryIcon />, path: "/danhmuc" },
    { text: "Quản Lý Sản Phẩm", icon: <InventoryIcon />, path: "/sanpham" },
    { text: "Quản Lý Đơn Hàng", icon: <ShoppingCartIcon />, path: "/donhang" },
    { text: "Quản Lý Mã Giảm Giá", icon: <DiscountIcon />, path: "/magiamgia" },
    { text: "Quản Lý Đánh Giá", icon: <RateReviewIcon />, path: "/danhgia" },
    { text: "Quản Lý Khách Hàng", icon: <GroupIcon />, path: "/khachhang" },
    { text: "Thống Kê", icon: <BarChartIcon />, path: "/thongke" },
  ];

  const drawer = (
    <Box sx={{ bgcolor: "#f5f5f5", height: "100%" }}>
      <Toolbar>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2" }}>
          Perfumer Shop
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  bgcolor: isActive ? "#e3f2fd" : "inherit",
                  "&:hover": { bgcolor: "#e3f2fd" },
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "#1976d2" : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "#1976d2" : "inherit",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          color: "#1976d2",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Perfumer - Trang Quản Trị
          </Typography>

          {/* Tên người dùng + icon tài khoản */}
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={handleAccountMenuOpen}
          >
            <Typography variant="body1" sx={{ mr: 1 }}>
              Xin chào, {user ? user.ho_ten : "Khách"}
            </Typography>
            <AccountCircleIcon fontSize="large" />
          </Box>

          {/* Menu tài khoản */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleAccountMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                handleAccountMenuClose();
                navigate("/profile"); // Trang profile nếu có
              }}
            >
              Hồ sơ cá nhân
            </MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="menu sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "auto",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default LayoutMain;
