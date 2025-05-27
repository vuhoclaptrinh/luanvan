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
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  Fade,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  Store as StoreIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

const LoginRegister = () => {
  const [tab, setTab] = useState(0); 
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setEmail('');
    setMatKhau('');
    setHoTen('');
    setShowPassword(false);
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
  setLoading(true);

  if (!hoTen.trim() || !email.trim() || !matKhau.trim()) {
    setError('Vui lòng điền đầy đủ thông tin');
    setLoading(false);
    return;
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/khachhang/register', {
      ho_ten: hoTen,
      email: email,
      mat_khau: matKhau,
    });

    enqueueSnackbar('Đăng ký thành công! Vui lòng đăng nhập.', { variant: 'success' });
    setTab(0); // chuyển về tab đăng nhập
    setEmail('');
    setMatKhau('');
    setHoTen('');
  } catch (error) {
    console.error(error);
    if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else {
      setError('Có lỗi xảy ra khi đăng ký!');
    }
  } finally {
    setLoading(false);
  }
};


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  mx: 'auto',
                  mb: 2,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <StoreIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Perfumer Shop
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Hệ thống nước hoa cao cấp
              </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ p: 4 }}>
              {/* Tabs */}
              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  mb: 3,
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                    py: 2,
                  },
                  '& .Mui-selected': {
                    color: '#667eea !important',
                  },
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    height: 3,
                    borderRadius: 2,
                  },
                }}
              >
                <Tab 
                  icon={<LoginIcon />}
                  iconPosition="start"
                  label="Đăng nhập" 
                />
                <Tab 
                  icon={<PersonAddIcon />}
                  iconPosition="start"
                  label="Đăng ký" 
                />
              </Tabs>

              {/* Error Alert */}
              {error && (
                <Fade in timeout={300}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: '1.5rem',
                      },
                    }}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              {/* Login Form */}
              {tab === 0 && (
                <Fade in timeout={500}>
                  <Box component="form" onSubmit={handleLogin}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />

                    <TextField
                      label="Mật khẩu"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      required
                      value={matKhau}
                      onChange={(e) => setMatKhau(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                  </Box>
                </Fade>
              )}

              {/* Register Form */}
              {tab === 1 && (
                <Fade in timeout={500}>
                  <Box component="form" onSubmit={handleRegister}>
                    <TextField
                      label="Họ tên"
                      fullWidth
                      required
                      value={hoTen}
                      onChange={(e) => setHoTen(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />

                    <TextField
                      label="Mật khẩu"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      required
                      value={matKhau}
                      onChange={(e) => setMatKhau(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth 
                      variant="contained"
                      disabled={loading}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </Button>
                  </Box>
                </Fade>
              )}

              {/* Footer */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Divider sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    © 2025 Perfumer Shop
                  </Typography>
                </Divider>
                <Typography variant="caption" color="textSecondary">
                  Hệ thống nước hoa chuyên nghiệp
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginRegister;