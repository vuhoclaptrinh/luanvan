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
          py: 2,
          px: 3,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Box display="flex" alignItems="center">
          <ShoppingBag sx={{ mr: 2, fontSize: 32 }} />
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
            borderRadius: 2,
            '&:hover': { bgcolor: 'primary.dark', color: 'white' }
          }}
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: 'grey.50' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <Box textAlign="center">
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography color="textSecondary">Đang tải thông tin sản phẩm...</Typography>
            </Box>
          </Box>
        ) : sanpham ? (
          <Card sx={{ m: 0, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', bgcolor: 'transparent' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 }, pb: 2 }}>
              <Grid container spacing={3} alignItems="stretch">
                {/* Cột trái: Hình ảnh */}
                <Grid item xs={12} md={5}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      minHeight: 420,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                    }}
                  >
                    {/* Ảnh chính */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 220,
                      height: 220,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: '1.5px solid #e0e0e0',
                      overflow: 'hidden',
                    }}>
                      {selectedImage ? (
                        <Box
                          component="img"
                          src={selectedImage}
                          alt={sanpham.ten_san_pham}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'scale(1.04)' }
                          }}
                        />
                      ) : (
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: '100%', 
                            bgcolor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                          }}
                        >
                          <Image sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                          <Typography color="textSecondary">Không có hình ảnh</Typography>
                        </Box>
                      )}
                    </Box>
                    {/* Ảnh phụ */}
                    {sanpham.images && sanpham.images.length > 0 && (
                      <>
                        <Divider sx={{ mb: 1, width: '100%' }}>
                          <Chip label="Ảnh khác" size="small" />
                        </Divider>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', width: '100%' }}>
                          {/* Ảnh chính trong thumbnails */}
                          {sanpham.hinh_anh && (
                            <Avatar
                              src={getImageUrl(sanpham.hinh_anh)}
                              sx={{
                                width: 44,
                                height: 44, 
                                cursor: 'pointer',
                                border: selectedImage === getImageUrl(sanpham.hinh_anh) ? '2px solid' : '2px solid',
                                borderColor: selectedImage === getImageUrl(sanpham.hinh_anh) ? 'primary.main' : 'grey.300',
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'scale(1.08)', borderColor: 'primary.main' }
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
                                width: 44,
                                height: 44,
                                cursor: 'pointer',
                                border: selectedImage === getImageUrl(imgObj.image_path) ? '2px solid' : '2px solid',
                                borderColor: selectedImage === getImageUrl(imgObj.image_path) ? 'primary.main' : 'grey.300',
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'scale(1.08)', borderColor: 'primary.main' }
                              }}
                              onClick={() => setSelectedImage(getImageUrl(imgObj.image_path))}
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </Paper>
                </Grid>
                {/* Cột phải: Thông tin sản phẩm */}
                <Grid item xs={12} md={7}>
                  <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, bgcolor: 'white', height: '100%' }}>
                    <Box mb={2}>
                      <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ mb: 1, lineHeight: 1.2 }}>
                        {sanpham.ten_san_pham}
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap" alignItems="center" mb={1}>
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
                    {/* Biến thể sản phẩm */}
                    {sanpham.variants && sanpham.variants.length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Box>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Box 
                              sx={{ 
                                mr: 2, 
                                p: 1, 
                                borderRadius: 2, 
                                bgcolor: 'success.light',
                                color: 'success.contrastText',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 40,
                                height: 40
                              }}
                            >
                              <AspectRatio fontSize="small" />
                            </Box>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                              Biến thể sản phẩm
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            {sanpham.variants.map((variant, idx) => (
                              <Grid item xs={12} sm={6} key={idx}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 1 }}>
                                  <InfoItem
                                    icon={<AspectRatio fontSize="small" />}
                                    label="Dung tích"
                                    value={variant.dung_tich ? `${variant.dung_tich} ` : 'Chưa cập nhật'}
                                    color="secondary"
                                  />
                                  <InfoItem
                                    icon={<MonetizationOn fontSize="small" />}
                                    label="Giá"
                                    value={variant.gia ? `${parseInt(variant.gia).toLocaleString('vi-VN')} ₫` : 'Chưa cập nhật'}
                                    color="success"
                                  />
                                  <InfoItem
                                    icon={<Inventory fontSize="small" />}
                                    label="Số lượng tồn"
                                    value={variant.so_luong_ton !== undefined ? variant.so_luong_ton : 'Chưa cập nhật'}
                                    color="info"
                                  />
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </>
                    )}
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                          icon={<Business fontSize="small" />}
                          label="Thương hiệu"
                          value={sanpham.thuong_hieu || 'Chưa cập nhật'}
                          color="info"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                          icon={<Category fontSize="small" />}
                          label="Danh mục"
                          value={danhMucMap[sanpham.danh_muc_id] || 'Chưa phân loại'}
                          color="warning"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                          icon={<LocalOffer fontSize="small" />}
                          label="Mã danh mục"
                          value={sanpham.danh_muc_id || 'N/A'}
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                          icon={<Inventory fontSize="small" />}
                          label="Tình trạng kho"
                          value={getStockStatus(sanpham.so_luong_ton).label}
                          color={getStockStatus(sanpham.so_luong_ton).color}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                          icon={<Category fontSize="small" />}
                          label="Xuất xứ"
                          value={sanpham.xuat_xu || 'Chưa cập nhật'}
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                          icon={<Category fontSize="small" />}
                          label="Phong cách"
                          value={sanpham.phong_cach || 'Chưa cập nhật'}
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                          icon={<Category fontSize="small" />}
                          label="Năm phát hành"
                          value={sanpham.nam_phat_hanh || 'Chưa cập nhật'}
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                          icon={<Category fontSize="small" />}
                          label="Độ lưu hương"
                          value={sanpham.do_luu_huong || 'Chưa cập nhật'}
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoItem
                          icon={<Category fontSize="small" />}
                          label="Độ tỏa hương"
                          value={sanpham.do_toa_huong || 'Chưa cập nhật'}
                          color="secondary"
                        />
                      </Grid>
                    </Grid>  
                  </Paper>
                </Grid>
              </Grid>
              {/* Mô tả sản phẩm - section riêng hoàn toàn dưới cùng */}
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

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
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