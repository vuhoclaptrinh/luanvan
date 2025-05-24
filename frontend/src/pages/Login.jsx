import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

const LoginRegister = () => {
  const [tab, setTab] = useState(0); // 0: login, 1: register
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setEmail('');
    setMatKhau('');
    setHoTen('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        mat_khau: matKhau,
      });

      const user = response.data.user;
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        enqueueSnackbar('Đăng nhập thành công!', { variant: 'success' });
      
        if (user.role === 1) {
          navigate('/');  // chuyển trang admin
          enqueueSnackbar('Đăng nhập bằng admin!', { variant: 'info' });
        } else {
          navigate('/Home'); // chuyển trang người dùng thường
          enqueueSnackbar('Đăng nhập bằng người dùng thường!', { variant: 'info' });
        }
      } else {
        setError('Đăng nhập thất bại!');
      }
    } catch (error) {
      console.error(error);
      setError('Email hoặc mật khẩu không đúng!');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!hoTen.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/khachhang/register', {
        email,
        mat_khau: matKhau,
        ho_ten: hoTen,
      });

      if (response.data.success) {
        enqueueSnackbar('Đăng ký thành công! Vui lòng đăng nhập.', { variant: 'success' });
        setTab(0);
        setEmail('');
        setMatKhau('');
        setHoTen('');
      } else {
        setError('Đăng ký thất bại!');
      }
    } catch (error) {
      console.error(error);
      setError('Có lỗi xảy ra khi đăng ký!');
    }
  };

  // Các style dùng chung cho TextField
  const textFieldSx = {
    backgroundColor: '#fff',
    borderRadius: 1,
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
      },
    },
  };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3, p: 4, mt: 8 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {tab === 0 ? 'Đăng nhập' : 'Đăng ký'}
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ width: '100%', mb: 3 }}
        >
          <Tab label="Đăng nhập" />
          <Tab label="Đăng ký" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2, boxShadow: 1, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        {tab === 0 && (
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
              sx={textFieldSx}
            />

            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              required
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              margin="normal"
              variant="outlined"
              sx={textFieldSx}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#155a9c',
                },
                boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
              }}
            >
              Đăng nhập
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
            <TextField
              label="Họ tên"
              fullWidth
              required
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              margin="normal"
              variant="outlined"
              sx={textFieldSx}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
              sx={textFieldSx}
            />

            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              required
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              margin="normal"
              variant="outlined"
              sx={textFieldSx}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#155a9c',
                },
                boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
              }}
            >
              Đăng ký
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default LoginRegister;
