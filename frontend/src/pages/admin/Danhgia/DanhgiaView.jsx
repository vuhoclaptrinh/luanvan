import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
  CircularProgress, Box, Card, CardContent, Chip, Divider, Avatar, Rating, Grid
} from '@mui/material';
import {
  RateReview as RateReviewIcon, Person as PersonIcon, ShoppingBag as ShoppingBagIcon,
  Close as CloseIcon, CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/';

const DanhgiaView = ({ open, onClose, DanhgiaId }) => {
  const [danhgia, setDanhgia] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && DanhgiaId) {
      setLoading(true);
      axios.get(`${API_BASE}danhgia/${DanhgiaId}`)
        .then(res => setDanhgia(res.data|| null))
        .catch(() => setDanhgia(null))
        .finally(() => setLoading(false));
    } else {  
      setDanhgia(null);
    }
  }, [open, DanhgiaId ]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 24px 48px rgba(0,0,0,0.12)' } }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
        <Box display="flex" alignItems="center">
          <RateReviewIcon sx={{ mr: 1.5 }} />
          <Typography variant="h5" fontWeight="bold">Chi tiết đánh giá</Typography>
        </Box>
        <Button onClick={onClose} sx={{ color: 'inherit', minWidth: 'auto', p: 1, borderRadius: 2 }}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
          </Box>
        ) : danhgia ? (
          <Card sx={{ m: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" mb={2}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {danhgia.ten_khach_hang || 'Khách hàng'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {danhgia.email || ''}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box textAlign="center">
                    <Typography variant="subtitle2" color="textSecondary">Số sao đánh giá</Typography>
                    <Rating value={Number(danhgia.so_sao) || 0} readOnly precision={0.5} size="large" sx={{ mt: 0.5 }} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">Sản phẩm</Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <ShoppingBagIcon color="primary" />
                      <Typography variant="body1" fontWeight="bold">
                        {danhgia.ten_san_pham || 'Sản phẩm'}
                      </Typography>
                      {danhgia.san_pham_id && (
                        <Chip label={`ID: ${danhgia.san_pham_id}`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">Nội dung đánh giá</Typography>
                    <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                      {danhgia.noi_dung || <i>Không có nội dung</i>}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon color="info" />
                    <Typography variant="caption" color="textSecondary">
                      {danhgia.ngay_danh_gia ? `Ngày đánh giá: ${danhgia.ngay_danh_gia}` : ''}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Box textAlign="center" py={8}>
            <RateReviewIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="error" gutterBottom>
              Không tìm thấy đánh giá
            </Typography>
            <Typography color="textSecondary">
              Đánh giá có thể đã bị xóa hoặc không tồn tại
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Button onClick={onClose} variant="contained" size="large" sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DanhgiaView;