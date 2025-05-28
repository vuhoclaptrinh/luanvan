import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Grid,
  Divider,
  Paper,
} from '@mui/material';

// Import icon MUI
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';

const API_BASE = 'http://127.0.0.1:8000/api/';

const Profile = () => {
  const userStr = sessionStorage.getItem('user');
  const sessionUser = userStr ? JSON.parse(userStr) : null;

  const [nguoiDung, setNguoiDung] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNguoiDung = async () => {
      if (!sessionUser?.email) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}khachhang`);
        const dsNguoiDung = res.data.data;
        const foundUser = dsNguoiDung.find((nd) => nd.email === sessionUser.email);
        setNguoiDung(foundUser || null);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNguoiDung();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!nguoiDung) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h6" color="error">
          Không tìm thấy thông tin người dùng.
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth={600} mx="auto" mt={6} px={2}>
      <Paper elevation={4} sx={{ borderRadius: 3, p: 3 }}>
        {/* Header */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            sx={{ bgcolor: 'primary.main', width: 72, height: 72, mb: 1.5, fontSize: 28 }}
          >
            {nguoiDung.ho_ten?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {nguoiDung.ho_ten}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {nguoiDung.role === 1 ? 'Quản trị viên' : 'Người dùng thường'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Thông tin chi tiết */}
        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" alignItems="center" gap={1}>
            <EmailIcon color="action" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography>{nguoiDung.email || 'Chưa cập nhật'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center" gap={1}>
            <PhoneIcon color="action" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Số điện thoại
              </Typography>
              <Typography>{nguoiDung.so_dien_thoai || 'Chưa cập nhật'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center" gap={1}>
            <HomeIcon color="action" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Địa chỉ
              </Typography>
              <Typography>{nguoiDung.dia_chi || 'Chưa cập nhật'}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
