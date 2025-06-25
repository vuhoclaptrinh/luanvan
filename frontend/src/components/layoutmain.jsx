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
  Avatar,
  Badge,
  Chip,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Inventory as InventoryIcon,
  RateReview as RateReviewIcon,
  Category as CategoryIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalOffer as DiscountIcon,
  Group as GroupIcon,
  BarChart as BarChartIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/img/logo.jpg";

const drawerWidth = 280;

const LayoutMain = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = sessionStorage.getItem('user');
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
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/home");
  };

  const menuItems = [
    { 
      text: "Thống Kê", 
      icon: <BarChartIcon />, 
      path: "/thongke",
      description: "Thống Kê"
    },
    { 
      text: "Quản Lý Danh Mục", 
      icon: <CategoryIcon />, 
      path: "/danhmuc",
      description: "Quản lý các danh mục sản phẩm"
    },
    { 
      text: "Quản Lý Sản Phẩm", 
      icon: <InventoryIcon />, 
      path: "/sanpham",
      description: "Quản lý sản phẩm"
    },
    // { 
    //   text: "Quản Lý Biến Thể", 
    //   icon: <InventoryIcon />, 
    //   path: "/bienthe",
    //   description: "Quản lý Biến Thể"
    // },
    { 
      text: "Quản Lý Đơn Hàng", 
      icon: <ShoppingCartIcon />, 
      path: "/donhang",
      description: "Xử lý đơn hàng khách hàng"
    },
    { 
      text: "Quản Lý Mã Giảm Giá", 
      icon: <DiscountIcon />, 
      path: "/magiamgia",
      description: "Tạo và quản lý khuyến mãi"
    },
    { 
      text: "Quản Lý Đánh Giá", 
      icon: <RateReviewIcon />, 
      path: "/danhgia",
      description: "Xem và phản hồi đánh giá"
    },
    { 
      text: "Quản Lý Người Dùng", 
      icon: <GroupIcon />, 
      path: "/nguoidung",
      description: "Quản lý tài khoản người dùng"
    },
  ];

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.text : "Trang Quản Trị";
  };

  const drawer = (
    <Box 
      sx={{ 
        height: "auto",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white"
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <img src={Logo} alt="Logo" width="150" height="150" className="rounded-circle" />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Perfumer Shop
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Hệ thống quản trị
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Paper 
          sx={{ 
            p: 2, 
            bgcolor: "rgba(255,255,255,0.1)", 
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.2)"
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar 
              sx={{ 
                bgcolor: "rgba(255,255,255,0.2)", 
                mr: 2,
                width: 40,
                height: 40
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                {user ? user.ho_ten : "Khách"}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Quản trị viên
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 2,
                  bgcolor: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                  backdropFilter: isActive ? "blur(10px)" : "none",
                  border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
                  transition: "all 0.3s ease",
                  "&:hover": { 
                    bgcolor: "rgba(255,255,255,0.15)",
                    transform: "translateX(8px)"
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: "white",
                    minWidth: 40,
                    opacity: isActive ? 1 : 0.8
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <Box flex={1}>
                  <ListItemText
                    primary={item.text}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontWeight: isActive ? "bold" : "medium",
                      fontSize: "0.9rem",
                      color: "white"
                    }}
                    secondaryTypographyProps={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.7)",
                      sx: { mt: 0.5 }
                    }}
                  />
                </Box>
                {isActive && (
                  <Box 
                    sx={{ 
                      width: 4, 
                      height: 4, 
                      borderRadius: "50%", 
                      bgcolor: "white",
                      ml: 1
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          color: "#1a202c",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: "none" },
              bgcolor: "rgba(103, 126, 234, 0.1)",
              "&:hover": { bgcolor: "rgba(103, 126, 234, 0.2)" }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              {getPageTitle()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Chào mừng bạn đến với hệ thống quản trị Perfumer Shop
            </Typography>
          </Box>

          {/* Notifications */}
          <IconButton sx={{ mr: 2 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderRadius: 6,
              cursor: "pointer",
              bgcolor: "rgba(103, 126, 234, 0.1)",
              border: "1px solid rgba(103, 126, 234, 0.2)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(103, 126, 234, 0.15)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(103, 126, 234, 0.2)"
              }
            }}
            onClick={handleAccountMenuOpen}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                mr: 1,
                bgcolor: "primary.main"
              }}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="medium">
                {user ? user.ho_ten : "Khách"}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Admin
              </Typography>
            </Box>
          </Paper>

          {/* Account Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleAccountMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: "1px solid rgba(0,0,0,0.08)"
              }
            }}
          >
            <MenuItem
              onClick={() => {
                handleAccountMenuClose();
                navigate("/profile");
              }}
              sx={{ py: 1.5, px: 2 }}
            >
              <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
              Hồ sơ cá nhân
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2, color: "error.main" }}>
              <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
              Đăng xuất
            </MenuItem>
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
              border: "none"
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
              border: "none"
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f8fafc"
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
            "&::-webkit-scrollbar": {
              width: 8,
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "rgba(0,0,0,0.1)",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "rgba(0,0,0,0.3)",
              borderRadius: 4,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.5)",
              },
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutMain;