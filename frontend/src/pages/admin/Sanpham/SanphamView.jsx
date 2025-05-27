import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  Badge,
} from '@mui/material';
import {
  ShoppingBag,
  Close,
  Category,
  MonetizationOn,
  Inventory,
  Business,
  AspectRatio,
  Description,
  Image,
  LocalOffer,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/';

const SanphamView = ({ open, onClose, sanphamId }) => {
  const [sanpham, setSanpham] = useState(null);
  const [loading, setLoading] = useState(false);
  const [danhMucMap, setDanhMucMap] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // Lấy danh mục
  useEffect(() => {
    axios.get(`${API_BASE}danhmuc`)
      .then(res => {
        const map = {};
        res.data.data.forEach(item => {
          map[item.id] = item.ten_danh_muc;
        });
        setDanhMucMap(map);
      })
      .catch(err => {
        console.error('Lỗi lấy danh mục:', err);
      });
  }, []);

  // Lấy sản phẩm theo ID
  useEffect(() => {
    if (open && sanphamId) {
      setLoading(true);
      axios.get(`${API_BASE}sanpham/${sanphamId}`)
        .then((res) => {
          const productData = res.data.data || null;
          setSanpham(productData);
          if (productData?.hinh_anh) {
            setSelectedImage(getImageUrl(productData.hinh_anh));
          }
        })
        .catch(() => {
          setSanpham(null);
        })
        .finally(() => setLoading(false));
    } else {
      setSanpham(null);
      setSelectedImage(null);
    }
  }, [open, sanphamId]);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, '')}`;
  };

  const InfoItem = ({ icon, label, value, color = "primary", valueColor = "text.primary" }) => (
    <Box display="flex" alignItems="center" mb={2}>
      <Box 
        sx={{ 
          mr: 2, 
          p: 1, 
          borderRadius: 2, 
          bgcolor: `${color}.light`,
          color: `${color}.contrastText`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 40,
          height: 40
        }}
      >
        {icon}
      </Box>
      <Box flex={1}>
        <Typography variant="caption" color="textSecondary" display="block" sx={{ fontSize: '0.75rem' }}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium" color={valueColor} sx={{ wordBreak: 'break-word' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  const getStockStatus = (soLuong) => {
    if (soLuong === 0) return { label: 'Hết hàng', color: 'error' };
    if (soLuong < 5) return { label: 'Sắp hết', color: 'warning' };
    return { label: 'Còn hàng', color: 'success' };
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5
        }}
      >
        <Box display="flex" alignItems="center">
          <ShoppingBag sx={{ mr: 1.5 }} />
          <Typography variant="h5" fontWeight="bold">
            Chi tiết sản phẩm
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          sx={{ 
            color: 'inherit',
            minWidth: 'auto',
            p: 1,
            borderRadius: 2
          }}
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <Box textAlign="center">
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography color="textSecondary">Đang tải thông tin sản phẩm...</Typography>
            </Box>
          </Box>
        ) : sanpham ? (
          <Card sx={{ m: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={4}>
                {/* Phần hình ảnh */}
                <Grid item xs={12} md={5}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                    }}
                  >
                    {/* Ảnh chính */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      {selectedImage ? (
                        <Box
                          component="img"
                          src={selectedImage}
                          alt={sanpham.ten_san_pham}
                          sx={{
                            width: '100%',
                            height: 300,
                            borderRadius: 2,
                            objectFit: 'contain',
                            bgcolor: 'white',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.02)'
                            }
                          }}
                        />
                      ) : (
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: 300, 
                            bgcolor: 'grey.100',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                          }}
                        >
                          <Image sx={{ fontSize: 64, color: 'text.disabled', mb: 1 }} />
                          <Typography color="textSecondary">Không có hình ảnh</Typography>
                        </Box>
                      )}
                      
                    </Box>
                    

                    {/* Ảnh phụ */}
                    {sanpham.images && sanpham.images.length > 0 && (
                      <>
                        <Divider sx={{ mb: 2 }}>
                          <Chip label="Ảnh khác" size="small" />
                        </Divider>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                          {/* Ảnh chính trong thumbnails */}
                          {sanpham.hinh_anh && (
                            <Avatar
                              src={getImageUrl(sanpham.hinh_anh)}
                              sx={{
                                width: 60,
                                
                                height: 60, 
                                cursor: 'pointer',
                                border: selectedImage === getImageUrl(sanpham.hinh_anh) ? '3px solid' : '3px solid',
                                borderColor: selectedImage === getImageUrl(sanpham.hinh_anh) ? 'primary.main' : 'grey.300',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  borderColor: 'primary.main'
                                }
                              }}
                              onClick={() => setSelectedImage(getImageUrl(sanpham.hinh_anh))}
                            />
                          )}
                          {/* Ảnh phụ */}
                          {sanpham.images.map((imgObj, idx) => (
                            <Avatar
                              key={idx}
                              src={getImageUrl(imgObj.image_path)}
                              sx={{
                                width: 60,
                                height: 60,
                                cursor: 'pointer',
                                border: selectedImage === getImageUrl(imgObj.image_path) ? '3px solid' : '3px solid',
                                borderColor: selectedImage === getImageUrl(imgObj.image_path) ? 'primary.main' : 'grey.300',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  borderColor: 'primary.main'
                                }
                              }}
                              onClick={() => setSelectedImage(getImageUrl(imgObj.image_path))}
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </Paper>
                </Grid>

                {/* Phần thông tin */}
                <Grid item xs={12} md={7}>
                  <Box mb={3}>
                    <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                      {sanpham.ten_san_pham}
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip 
                        label={`ID: ${sanpham.id}`} 
                        size="small" 
                        variant="outlined" 
                      />
                      {sanpham.so_luong_ton !== undefined && (
                        <Chip 
                          label={getStockStatus(sanpham.so_luong_ton).label}
                          color={getStockStatus(sanpham.so_luong_ton).color}
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon={<MonetizationOn fontSize="small" />}
                        label="Giá bán"
                        value={`${new Intl.NumberFormat('vi-VN').format(sanpham.gia || 0)} ₫`}
                        color="error"
                        valueColor="error.main"
                      />
                      <InfoItem
                        icon={<Inventory fontSize="small" />}
                        label="Số lượng tồn"
                        value={sanpham.so_luong_ton ?? 0}
                        color="success"
                      />
                      <InfoItem
                        icon={<Business fontSize="small" />}
                        label="Thương hiệu"
                        value={sanpham.thuong_hieu || 'Chưa cập nhật'}
                        color="info"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon={<AspectRatio fontSize="small" />}
                        label="Dung tích"
                        value={sanpham.dung_tich || 'Chưa cập nhật'}
                        color="secondary"
                      />
                      <InfoItem
                        icon={<Category fontSize="small" />}
                        label="Danh mục"
                        value={danhMucMap[sanpham.danh_muc_id] || 'Chưa phân loại'}
                        color="warning"
                      />
                      <InfoItem
                        icon={<LocalOffer fontSize="small" />}
                        label="Mã danh mục"
                        value={sanpham.danh_muc_id || 'N/A'}
                        color="primary"
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box 
                        sx={{ 
                          mr: 2, 
                          p: 1, 
                          borderRadius: 2, 
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 40,
                          height: 40
                        }}
                      >
                        <Description fontSize="small" />
                      </Box>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        Mô tả sản phẩm
                      </Typography>
                    </Box>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: 'grey.50',
                        maxHeight: 200,
                        overflow: 'auto'
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          whiteSpace: 'pre-line',
                          lineHeight: 1.7
                        }}
                      >
                        {sanpham.mo_ta || (
                          <Box display="flex" alignItems="center" color="text.disabled">
                            <Description sx={{ mr: 1, fontSize: 20 }} />
                            Chưa có mô tả cho sản phẩm này
                          </Box>
                        )}
                      </Typography>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Box textAlign="center" py={8}>
            <ShoppingBag sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="error" gutterBottom>
              Không tìm thấy sản phẩm
            </Typography>
            <Typography color="textSecondary">
              Sản phẩm có thể đã bị xóa hoặc không tồn tại
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          size="large"
          sx={{ 
            borderRadius: 2,
            px: 4,
            fontWeight: 'bold'
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SanphamView;