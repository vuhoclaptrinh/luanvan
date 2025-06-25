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
  Stack,
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
  Public,
  Palette,
  DateRange,
  Refresh,
  Tune,
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

  const InfoCard = ({ icon, label, value, color = "primary", fullWidth = false }) => (
    <Card 
      variant="outlined" 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': { 
          transform: 'translateY(-2px)', 
          boxShadow: 2,
          borderColor: `${color}.main`
        },
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      <CardContent sx={{ p: 2.5, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box 
          sx={{ 
            width: 48,
            height: 48,
            borderRadius: 2, 
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2
          }}
        >
          {icon}
        </Box>
        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography 
          variant="body1" 
          fontWeight="600" 
          color="text.primary" 
          sx={{ 
            fontSize: fullWidth ? '0.9rem' : '0.85rem',
            wordBreak: 'break-word',
            lineHeight: 1.3
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const SectionHeader = ({ icon, title, color = "primary" }) => (
    <Box display="flex" alignItems="center" mb={2}>
      <Box 
        sx={{ 
          mr: 2, 
          p: 1.5, 
          borderRadius: 2, 
          bgcolor: `${color}.main`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" fontWeight="bold" color={`${color}.main`}>
        {title}
      </Typography>
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
      maxWidth="xl" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
          maxHeight: '90vh',
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
          py: 2.5,
          px: 3,
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
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: 'grey.50', maxHeight: 'calc(90vh - 140px)', overflow: 'auto' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <Box textAlign="center">
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography color="textSecondary">Đang tải thông tin sản phẩm...</Typography>
            </Box>
          </Box>
        ) : sanpham ? (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* PHẦN HÌNH ẢNH - Cột trái */}
              <Grid item xs={12} lg={4}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    bgcolor: 'white',
                    height: 'fit-content',
                    position: 'sticky',
                    top: 20
                  }}
                >
                  {/* Ảnh chính */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 280,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    border: '2px solid',
                    borderColor: 'grey.200',
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
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                      />
                    ) : (
                      <Box 
                        sx={{ 
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

                  {/* Thumbnail images */}
                  {(sanpham.hinh_anh || (sanpham.images && sanpham.images.length > 0)) && (
                    <Box>
                      <Divider sx={{ mb: 2 }}>
                        <Chip label="Hình ảnh khác" size="small" />
                      </Divider>
                      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                        {sanpham.hinh_anh && (
                          <Avatar
                            src={getImageUrl(sanpham.hinh_anh)}
                            sx={{
                              width: 56,
                              height: 56, 
                              cursor: 'pointer',
                              border: '3px solid',
                              borderColor: selectedImage === getImageUrl(sanpham.hinh_anh) ? 'primary.main' : 'grey.300',
                              transition: 'all 0.2s',
                              '&:hover': { transform: 'scale(1.1)', borderColor: 'primary.main' }
                            }}
                            onClick={() => setSelectedImage(getImageUrl(sanpham.hinh_anh))}
                          />
                        )}
                        {sanpham.images?.map((imgObj, idx) => (
                          <Avatar
                            key={idx}
                            src={getImageUrl(imgObj.image_path)}
                            sx={{
                              width: 56,
                              height: 56,
                              cursor: 'pointer',
                              border: '3px solid',
                              borderColor: selectedImage === getImageUrl(imgObj.image_path) ? 'primary.main' : 'grey.300',
                              transition: 'all 0.2s',
                              '&:hover': { transform: 'scale(1.1)', borderColor: 'primary.main' }
                            }}
                            onClick={() => setSelectedImage(getImageUrl(imgObj.image_path))}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* PHẦN THÔNG TIN - Cột phải */}
              <Grid item xs={12} lg={8}>
                <Stack spacing={3}>
                  {/* HEADER THÔNG TIN SẢN PHẨM */}
                  <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ mb: 2, lineHeight: 1.2 }}>
                      {sanpham.ten_san_pham}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                      <Chip 
                        label={`ID: ${sanpham.id}`} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                      {sanpham.so_luong_ton !== undefined && (
                        <Chip 
                          label={getStockStatus(sanpham.so_luong_ton).label}
                          color={getStockStatus(sanpham.so_luong_ton).color}
                          size="small"
                        />
                      )}
                      {sanpham.thuong_hieu && (
                        <Chip 
                          label={sanpham.thuong_hieu}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                    </Stack>
                  </Paper>

                  {/* BIẾN THỂ SẢN PHẨM */}
                  {sanpham.variants && sanpham.variants.length > 0 && (
                    <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
                      <SectionHeader 
                        icon={<AspectRatio />} 
                        title="Biến thể sản phẩm" 
                        color="success"
                      />
                      <Grid container spacing={2}>
                        {sanpham.variants.map((variant, idx) => (
                          <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card 
                              variant="outlined" 
                              sx={{ 
                                p: 2, 
                                borderRadius: 2,
                                bgcolor: 'success.light',
                                border: '1px solid',
                                borderColor: 'success.main',
                                '&:hover': { boxShadow: 2 }
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight="bold" color="success.dark" sx={{ mb: 2 }}>
                                Biến thể {idx + 1}
                              </Typography>
                              <Stack spacing={1}>
                                <Box display="flex" justifyContent="space-between">
                                  <Typography variant="caption" color="textSecondary">Dung tích:</Typography>
                                  <Typography variant="body2" fontWeight="600">
                                    {variant.dung_tich || 'N/A'}
                                  </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                  <Typography variant="caption" color="textSecondary">Giá:</Typography>
                                  <Typography variant="body2" fontWeight="600" color="success.dark">
                                    {variant.gia ? `${parseInt(variant.gia).toLocaleString('vi-VN')} ₫` : 'N/A'}
                                  </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                  <Typography variant="caption" color="textSecondary">Tồn kho:</Typography>
                                  <Typography variant="body2" fontWeight="600">
                                    {variant.so_luong_ton ?? 'N/A'}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  )}

                  {/* THÔNG TIN CƠ BẢN */}
                  <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
                    <SectionHeader 
                      icon={<Category />} 
                      title="Thông tin cơ bản" 
                      color="primary"
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          icon={<Business />}
                          label="Thương hiệu"
                          value={sanpham.thuong_hieu || 'Chưa cập nhật'}
                          color="info"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          icon={<Category />}
                          label="Danh mục"
                          value={danhMucMap[sanpham.danh_muc_id] || 'Chưa phân loại'}
                          color="warning"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          icon={<Inventory />}
                          label="Tình trạng kho"
                          value={getStockStatus(sanpham.so_luong_ton).label}
                          color={getStockStatus(sanpham.so_luong_ton).color}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* THÔNG TIN CHI TIẾT */}
                  <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
                    <SectionHeader 
                      icon={<Tune />} 
                      title="Thông tin chi tiết" 
                      color="info"
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          icon={<Public />}
                          label="Xuất xứ"
                          value={sanpham.xuat_xu || 'Chưa cập nhật'}
                          color="white"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          icon={<Palette />}
                          label="Phong cách"
                          value={sanpham.phong_cach || 'Chưa cập nhật'}
                          color="white"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          icon={<DateRange />}
                          label="Năm phát hành"
                          value={sanpham.nam_phat_hanh || 'Chưa cập nhật'}
                          color="white"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          icon={<Refresh />}
                          label="Độ lưu hương"
                          value={sanpham.do_luu_huong || 'Chưa cập nhật'}
                          color="white"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          icon={<Tune />}
                          label="Độ tỏa hương"
                          value={sanpham.do_toa_huong || 'Chưa cập nhật'}
                          color="white"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InfoCard
                          icon={<LocalOffer />}
                          label="Mã danh mục"
                          value={sanpham.danh_muc_id || 'N/A'}
                          color="white"
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* MÔ TẢ SẢN PHẨM */}
                  <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
                    <SectionHeader 
                      icon={<Description />} 
                      title="Mô tả sản phẩm" 
                      color="primary"
                    />
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        bgcolor: 'grey.50',
                        maxHeight: 200,
                        overflow: 'auto',
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          whiteSpace: 'pre-line',
                          lineHeight: 1.7,
                          color: sanpham.mo_ta ? 'text.primary' : 'text.disabled'
                        }}
                      >
                        {sanpham.mo_ta || (
                          <Box display="flex" alignItems="center" justifyContent="center" py={4}>
                            <Description sx={{ mr: 1, fontSize: 24 }} />
                            Chưa có mô tả cho sản phẩm này
                          </Box>
                        )}
                      </Typography>
                    </Paper>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Box>
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

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'grey.200' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          size="large"
          sx={{ 
            borderRadius: 2,
            px: 4,
            fontWeight: 'bold',
            textTransform: 'none'
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SanphamView;