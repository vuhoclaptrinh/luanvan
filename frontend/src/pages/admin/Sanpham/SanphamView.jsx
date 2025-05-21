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
  Divider,
  Paper,
} from '@mui/material';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/';

const SanphamView = ({ open, onClose, sanphamId }) => {
  const [sanpham, setSanpham] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && sanphamId) {
      setLoading(true);
      axios.get(`${API_BASE}sanpham/${sanphamId}`)
        .then((res) => {
          setSanpham(res.data.data || null);
        })
        .catch(() => {
          setSanpham(null);
        })
        .finally(() => setLoading(false));
    } else {
      setSanpham(null);
    }
  }, [open, sanphamId]);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, '')}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>
        Chi tiết sản phẩm
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#f9f9f9' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={150}>
            <CircularProgress />
          </Box>
        ) : sanpham ? (
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 2, backgroundColor: 'white', mb: 2 }}
          >
            {/* Hình ảnh */}
            {sanpham.hinh_anh && (
              <Box
                component="img"
                src={getImageUrl(sanpham.hinh_anh)}
                alt={sanpham.ten_san_pham}
                sx={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: 300,
                  marginBottom: 3,
                  borderRadius: 2,
                  objectFit: 'contain',
                  boxShadow: 3,
                }}
              />
            )}

            {/* Thông tin sản phẩm */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {sanpham.ten_san_pham}
              </Typography>

              <Typography>
                <strong>ID:</strong> {sanpham.id}
              </Typography>

              <Typography>
                <strong>Thương hiệu:</strong> {sanpham.thuong_hieu || 'N/A'}
              </Typography>

              <Typography sx={{ whiteSpace: 'pre-line' }}>
                <strong>Mô tả:</strong> {sanpham.mo_ta || 'Không có mô tả'}
              </Typography>

              <Typography>
                <strong>Dung tích:</strong> {sanpham.dung_tich || 'N/A'}
              </Typography>

              <Typography>
                <strong>Giá (VND):</strong>{' '}
                {new Intl.NumberFormat('vi-VN').format(sanpham.gia || 0)}
              </Typography>

              <Typography>
                <strong>Số lượng tồn:</strong> {sanpham.so_luong_ton ?? 0}
              </Typography>

              <Typography>
                <strong>Danh mục ID:</strong> {sanpham.danh_muc_id || 'N/A'}
              </Typography>
            </Box>
          </Paper>
        ) : (
          <Typography align="center" color="error" sx={{ py: 5 }}>
            Không tìm thấy dữ liệu sản phẩm.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ padding: '12px 24px' }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SanphamView;
