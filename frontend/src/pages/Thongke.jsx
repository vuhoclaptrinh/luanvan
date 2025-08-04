import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import {
  BarChart as BarChartIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Group as GroupIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  StarRate as StarRateIcon,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/";

const Thongke = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [productStats, setProductStats] = useState([]);

  const [detailData, setDetailData] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  const handleViewDetails = async (productId) => {
    try {
      const res = await axios.get(`${API_BASE}thongke/sanpham/${productId}`);
      setDetailData(res.data.data || []);
      setOpenDetail(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết biến thể:", err);
    }
  };
  const fetchProductStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}thongke/sanpham`, {
        params: {
          date: selectedDate,
          month: selectedMonth,
          year: selectedYear,
        },
      });
      setProductStats(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy thống kê sản phẩm:", err);
    }
  };
  console.log({ selectedDate, selectedMonth, selectedYear });

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrder: 0,
    totalProduct: 0,
    totalUser: 0,
    totalRevenue: 0,
    totalCategory: 0,
    totalCoupon: 0,
    totalReview: 0,
  });
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [
          orderRes,
          productRes,
          userRes,
          categoryRes,
          couponRes,
          reviewRes,
          revenueRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}donhang`),
          axios.get(`${API_BASE}sanpham`),
          axios.get(`${API_BASE}khachhang`),
          axios.get(`${API_BASE}danhmuc`),
          axios.get(`${API_BASE}magiamgia`),
          axios.get(`${API_BASE}danhgia`),
          axios.get(`${API_BASE}doanhthutheothang`),
        ]);

        const orders = orderRes.data.data || [];
        const products = productRes.data.data || [];
        const users = userRes.data.data || [];
        const categories = categoryRes.data.data || [];
        const coupons = couponRes.data.data || [];
        const reviews = reviewRes.data.data || [];
        const revenueRaw = revenueRes.data.data || [];

        const totalRevenue = orders
          .filter((order) => order.trang_thai?.toLowerCase() === "đã giao")
          .reduce((sum, order) => sum + Number(order.tong_tien || 0), 0);

        // Map month number to label: 1 → Tháng 1
        const formattedRevenue = revenueRaw.map((item) => ({
          month: ` ${item.month}`,
          revenue: item.revenue,
        }));

        setStats({
          totalOrder: orders.length,
          totalProduct: products.length,
          totalUser: users.length,
          totalRevenue,
          totalCategory: categories.length,
          totalCoupon: coupons.length,
          totalReview: reviews.length,
        });

        setRevenueData(formattedRevenue);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      label: "Đơn hàng",
      value: stats.totalOrder,
      icon: <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />,
    },
    {
      label: "Sản phẩm",
      value: stats.totalProduct,
      icon: <InventoryIcon color="success" sx={{ fontSize: 40, mb: 1 }} />,
    },
    {
      label: "Người dùng",
      value: stats.totalUser,
      icon: <GroupIcon color="info" sx={{ fontSize: 40, mb: 1 }} />,
    },
    {
      label: "Doanh thu",
      value: stats.totalRevenue.toLocaleString("vi-VN") + " ₫",
      icon: <BarChartIcon color="error" sx={{ fontSize: 40, mb: 1 }} />,
      color: "error.main",
    },
    {
      label: "Danh mục",
      value: stats.totalCategory,
      icon: <CategoryIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />,
    },
    {
      label: "Mã giảm giá",
      value: stats.totalCoupon,
      icon: <LocalOfferIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />,
    },
    {
      label: "Đánh giá",
      value: stats.totalReview,
      icon: <StarRateIcon color="success" sx={{ fontSize: 40, mb: 1 }} />,
    },
  ];

  return (
    <Box p={3}>
      {/* <Typography variant="h4" fontWeight="bold" mb={3} color="primary.main">
        Thống kê tổng quan
      </Typography> */}

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {statItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
                >
                  {item.icon}
                  <Typography variant="h6">{item.label}</Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={item.color || "text.primary"}
                  >
                    {item.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Biểu đồ doanh thu */}
          <Box mt={5} p={3} component={Paper} elevation={3} borderRadius={3}>
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              color="primary.main"
              textAlign="center"
            >
              Biểu đồ doanh thu theo tháng
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => (value / 1000000).toFixed(1) + "M"}
                />
                <Tooltip
                  formatter={(value) => value.toLocaleString("vi-VN") + " ₫"}
                />
                <Bar dataKey="revenue" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          {/* Thống kê sản phẩm đã bán */}
          <Box mt={5} component={Paper} p={3} borderRadius={3}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              📊 Thống kê sản phẩm đã bán
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <label>Chọn ngày</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <label>Chọn tháng</label>
                <select
                  className="form-control"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={6} md={4}>
                <label>Chọn năm</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="VD: 2025"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                />
              </Grid>
            </Grid>

            <button
              className="btn btn-primary mt-3"
              onClick={fetchProductStats}
            >
              Thống kê
            </button>

            {productStats.length > 0 ? (
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Kết quả:
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell align="center">Số lượng đã bán</TableCell>
                        <TableCell align="center">Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productStats.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.ten_san_pham}</TableCell>
                          <TableCell align="center">
                            {item.tong_so_luong}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewDetails(item.id)}
                            >
                              Xem
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 3 }}>
                Không có đơn hàng nào trong tháng.
              </Alert>
            )}
          </Box>
        </>
      )}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chi tiết biến thể đã bán</DialogTitle>
        <DialogContent>
          {detailData.length === 0 ? (
            <Typography>Không có dữ liệu.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Dung tích</TableCell>
                  <TableCell align="right">Giá</TableCell>
                  <TableCell align="right">Số lượng đã bán</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.dung_tich}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.gia)}
                    </TableCell>
                    <TableCell align="right">{item.so_luong_ban}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Thongke;
