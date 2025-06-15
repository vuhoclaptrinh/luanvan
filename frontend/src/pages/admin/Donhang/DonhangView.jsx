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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  Receipt,
  LocalOffer,
  ShoppingCart,
  Close,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/';
const IMAGE_BASE_URL = 'http://127.0.0.1:8000/storage/';

const DonhangView = ({ open, onClose, donhangId }) => {
  const [loading, setLoading] = useState(false);
  const [chiTietDonhang, setChiTietDonhang] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [donhangInfo, setDonhangInfo] = useState(null);

  useEffect(() => {
    if (!open || !donhangId) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        // 1. Lấy thông tin đơn hàng (có kèm khách hàng)
        const resDonhang = await axios.get(`${API_BASE}donhang/${donhangId}`);
        const donhang = resDonhang.data;
        setDonhangInfo(donhang);

        // 2. Lấy chi tiết đơn hàng
        const resChiTiet = await axios.get(`${API_BASE}chitietdonhang?don_hang_id=${donhangId}`);
        const chitiet = resChiTiet.data.data.filter(item => item.don_hang_id === donhangId);
        setChiTietDonhang(chitiet);

        // 3. Lấy thông tin các sản phẩm
        const productIds = [...new Set(chitiet.map(item => item.san_pham_id))];
        const productsData = {};
        await Promise.all(
          productIds.map(async (id) => {
            const resProduct = await axios.get(`${API_BASE}sanpham/${id}`);
            productsData[id] = resProduct.data.data;
          })
        );
        setProductsMap(productsData);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng hoặc sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [open, donhangId]);

  const InfoItem = ({ icon, label, value, color = "primary" }) => (
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
        <Typography variant="body1" fontWeight="medium" sx={{ wordBreak: 'break-word' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'đã giao':
        return 'success';
      case 'pending':
      case 'chờ xử lý':
        return 'warning';
      case 'cancelled':
      case 'đang giao':
        return 'primary';
      default:
        return 'primary';
    }
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
          py: 2.5
        }}
      >
        <Box display="flex" alignItems="center">
          <Receipt sx={{ mr: 1.5 }} />
          <Typography variant="h5" fontWeight="bold">
            Chi tiết đơn hàng #ID{donhangId}
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
              <Typography color="textSecondary">Đang tải thông tin...</Typography>
            </Box>
          </Box>
        ) : (
          <>
            {/* Thông tin khách hàng */}
            {donhangInfo && (
              <Card sx={{ m: 3, mb: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      Thông tin khách hàng
                    </Typography>
                    {donhangInfo.trang_thai && (
                      <Chip 
                        label={donhangInfo.trang_thai}
                        color={getStatusColor(donhangInfo.trang_thai)}
                        size="small"
                        sx={{ ml: 'auto' }}
                      />
                    )}
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<Person fontSize="small" />}
                            label="Họ và tên"
                            value={donhangInfo.ten_khach_hang}
                            color="primary"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<Phone fontSize="small" />}
                            label="Số điện thoại"
                            value={donhangInfo.so_dien_thoai}
                            color="success"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<Email fontSize="small" />}
                            label="Email"
                            value={donhangInfo.email}
                            color="info"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Grid container spacing={6}>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<LocationOn fontSize="small" />}
                            label="Địa chỉ giao hàng"
                            value={donhangInfo.dia_chi}
                            color="warning"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<CalendarToday fontSize="small" />}
                            label="Ngày đặt hàng"
                            value={donhangInfo.ngay_dat}
                            color="secondary"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem
                            icon={<Receipt fontSize="small" />}
                            label="Tổng tiền"
                            value={donhangInfo.tong_tien_format_giam}
                            color="error"
                          />
                        </Grid>
                        {donhangInfo.ten_ma_giam_gia && (
                          <Grid item xs={12} sm={6}>
                            <InfoItem
                              icon={<LocalOffer fontSize="small" />}
                              label="Mã giảm giá"
                              value={donhangInfo.ten_ma_giam_gia}
                              color="success"
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                    
                </CardContent>
              </Card>
            )}

            {/* Chi tiết sản phẩm */}
            <Card sx={{ m: 3, mt: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <ShoppingCart sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    Chi tiết sản phẩm
                  </Typography>
                  <Chip 
                    label={`${chiTietDonhang.length} sản phẩm`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                {chiTietDonhang.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <ShoppingCart sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography color="textSecondary">
                      Không có chi tiết đơn hàng
                    </Typography>
                  </Box>
                ) : (
                  <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Hình ảnh</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Tên sản phẩm</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', py: 2, textAlign: 'center' }}>Số lượng</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', py: 2, textAlign: 'right' }}>Đơn giá</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', py: 2, textAlign: 'right' }}>Thành tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {chiTietDonhang.map((item) => {
                          const product = productsMap[item.san_pham_id];
                          const imgSrc = product
                            ? product.images && product.images.length > 0
                              ? IMAGE_BASE_URL + product.images[0].image_path
                              : IMAGE_BASE_URL + product.hinh_anh
                            : null;

                          const thanhTien = Number(item.gia) * item.so_luong;

                          return (
                            <TableRow 
                              key={item.id}
                              sx={{ 
                                '&:nth-of-type(odd)': { bgcolor: 'grey.25' },
                                '&:hover': { bgcolor: 'primary.50' }
                              }}
                            >
                              <TableCell sx={{ py: 2 }}>
                                {imgSrc ? (
                                  <Avatar
                                    variant="rounded"
                                    src={imgSrc}
                                    alt={product?.ten_san_pham}
                                    sx={{ 
                                      width: 64, 
                                      height: 64,
                                      border: '2px solid',
                                      borderColor: 'grey.200',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                  />
                                ) : (
                                  <Box 
                                    sx={{ 
                                      width: 64, 
                                      height: 64, 
                                      bgcolor: 'grey.100',
                                      borderRadius: 2,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <Typography variant="caption" color="textSecondary">
                                      Không có ảnh
                                    </Typography>
                                  </Box>
                                )}
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                <Typography variant="body1" fontWeight="medium">
                                  {product ? product.ten_san_pham : 'Đang tải...'}
                                </Typography>
                                {product?.mo_ta && (
                                  <Typography variant="caption" color="textSecondary" display="block">
                                    {product.mo_ta.length > 50 
                                      ? product.mo_ta.substring(0, 50) + '...' 
                                      : product.mo_ta
                                    }
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell sx={{ py: 2, textAlign: 'center' }}>
                                <Chip 
                                  label={item.so_luong}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                />
                              </TableCell>
                              <TableCell sx={{ py: 2, textAlign: 'right' }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {Number(item.gia).toLocaleString('vi-VN')} ₫
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ py: 2, textAlign: 'right' }}>
                                <Typography variant="body1" fontWeight="bold" color="primary.main">
                                  {thanhTien.toLocaleString('vi-VN')} ₫
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {/* Tổng tiền, giảm giá, tổng thanh toán */}
                        {chiTietDonhang.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold', border: 0 }}>
                              Tổng tiền gốc:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', border: 0 }}>
                              {chiTietDonhang.reduce((sum, item) => sum + Number(item.gia) * item.so_luong, 0).toLocaleString('vi-VN')} ₫
                            </TableCell>
                          </TableRow>
                        )}
                        {donhangInfo && donhangInfo.ten_ma_giam_gia && chiTietDonhang.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold', border: 0 }}>
                              Mã giảm giá ({donhangInfo.ten_ma_giam_gia}):
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main', border: 0 }}>
                              - {(
                                chiTietDonhang.reduce((sum, item) => sum + Number(item.gia) * item.so_luong, 0) - Number(donhangInfo.tong_tien)
                              ).toLocaleString('vi-VN')} ₫
                            </TableCell>
                          </TableRow>
                        )}
                        {donhangInfo && chiTietDonhang.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold', border: 0 }}>
                              Tổng thanh toán:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main', border: 0 }}>
                              {Number(donhangInfo.tong_tien).toLocaleString('vi-VN')} ₫
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </>
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

export default DonhangView;