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
} from '@mui/material';

import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/';

const SanphamView = ({ open, onClose, sanphamId }) => {
  const [sanpham, setSanpham] = useState(null);
  const [loading, setLoading] = useState(false);
  const [danhMucMap, setDanhMucMap] = useState({});

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>
        Chi tiết sản phẩm
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#f9f9f9' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={150}>
            <CircularProgress />
          </Box>
        ) : sanpham ? (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: 'white' }}>
            <Grid container spacing={3}>
              {/* Hình ảnh bên trái */}
              <Grid item xs={12} md={5}>
                {sanpham.hinh_anh ? (
                  <Box
                    component="img"
                    src={getImageUrl(sanpham.hinh_anh)}
                    alt={sanpham.ten_san_pham}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: 300,
                      borderRadius: 2,
                      objectFit: 'contain',
                      boxShadow: 3,
                    }}
                  />
                ) : (
                  <Typography align="center">Không có hình ảnh</Typography>
                )}

                {/* Ảnh phụ */}
               {sanpham.images && sanpham.images.length > 0 && (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                      Ảnh phụ:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {sanpham.images.map((imgObj, idx) => (
                        <Box
                          key={idx}
                          component="img"
                          src={getImageUrl(imgObj.image_path)}
                          alt={`Ảnh phụ ${idx + 1}`}
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1,
                            boxShadow: 2,
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Grid>

              {/* Thông tin bên phải */}
              <Grid item xs={12} md={7}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {sanpham.ten_san_pham}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    ['ID', sanpham.id],
                    ['Thương hiệu', sanpham.thuong_hieu || 'N/A'],
                    ['Dung tích', sanpham.dung_tich || 'N/A'],
                    ['Giá (VND)', new Intl.NumberFormat('vi-VN').format(sanpham.gia || 0)],
                    ['Số lượng', sanpham.so_luong_ton ?? 0],
                    ['Danh mục ID', sanpham.danh_muc_id || 'N/A'],
                    ['Tên danh mục', danhMucMap[sanpham.danh_muc_id] || 'N/A'],
                  ].map(([label, value], index) => (
                    <Box key={index} display="flex">
                      <Typography sx={{ width: 130, fontWeight: 500 }}>{label}:</Typography>
                      <Typography>{value}</Typography>
                    </Box>
                  ))}

                  <Box display="flex" alignItems="flex-start">
                    <Typography sx={{ width: 130, fontWeight: 500 }}>Mô tả:</Typography>
                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                      {sanpham.mo_ta || 'Không có mô tả'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
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
