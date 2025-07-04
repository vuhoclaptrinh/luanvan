import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';

import {
  BarChart as BarChartIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Group as GroupIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  StarRate as StarRateIcon,
} from '@mui/icons-material';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/';

const Thongke = () => {
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
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      label: 'Đơn hàng',
      value: stats.totalOrder,
      icon: <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />,
    },
    {
      label: 'Sản phẩm',
      value: stats.totalProduct,
      icon: <InventoryIcon color="success" sx={{ fontSize: 40, mb: 1 }} />,
    },
    {
      label: 'Người dùng',
      value: stats.totalUser,
      icon: <GroupIcon color="info" sx={{ fontSize: 40, mb: 1 }} />,
    },
    {
      label: 'Doanh thu',
      value: stats.totalRevenue.toLocaleString('vi-VN') + ' ₫',
      icon: <BarChartIcon color="error" sx={{ fontSize: 40, mb: 1 }} />,
      color: 'error.main',
    },
    {
      label: 'Danh mục',
      value: stats.totalCategory,
      icon: <CategoryIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />,
    },
    {
      label: 'Mã giảm giá',
      value: stats.totalCoupon,
      icon: <LocalOfferIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />,
    },
    {
      label: 'Đánh giá',
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {statItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
                  {item.icon}
                  <Typography variant="h6">{item.label}</Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={item.color || 'text.primary'}
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
                  tickFormatter={(value) =>
                    (value / 1000000).toFixed(1) + 'M'
                  }
                />
                <Tooltip
                  formatter={(value) =>
                    value.toLocaleString('vi-VN') + ' ₫'
                  }
                />
                <Bar dataKey="revenue" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Thongke;
