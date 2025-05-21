import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

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
        // Lưu user vào localStorage
        localStorage.setItem('user', JSON.stringify(user));
        alert('Đăng nhập thành công!');
        navigate('/');  // chuyển trang main
      } else {
        setError('Đăng nhập thất bại!');
      }
    } catch (error) {
      console.error(error);
      setError('Email hoặc mật khẩu không đúng!');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" height="100vh" justifyContent="center">
        <Typography variant="h4">Đăng nhập</Typography>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3, width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />

          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            required
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            margin="normal"
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Đăng nhập
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
