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

const MagiamgiaView = ({open, onClose, MagiamgiaId}) => {
  const [magiamgia, setMagiamgia] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch chi tiết mã giảm giá  khi mở dialog
  useEffect(() => {
    if (open && MagiamgiaId) {
      setLoading(true);
      axios
        .get(`${API_BASE}magiamgia/${MagiamgiaId}`)
        .then((res) => {
          setMagiamgia(res.data.data || res.data);
        })
        .catch(() => {
          setMagiamgia(null);
        })
        .finally(() => setLoading(false));
    } else {
      setMagiamgia(null);
    }
  }, [open, MagiamgiaId]);




  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Tiêu đề */}
      <DialogTitle
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        Chi tiết mã giảm giá
      </DialogTitle>

      {/* Nội dung */}
      <DialogContent dividers sx={{ backgroundColor: '#f9f9f9' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={150}>
            <CircularProgress />
          </Box>
        ) : magiamgia ? (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: 'white' }}>
            <Grid container spacing={2}>
             <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Mã:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {magiamgia.ma}
                  </Typography>
                  
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Phần trăm giảm:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {magiamgia.phan_tram_giam}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                   Điều kiện áp dụng:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {magiamgia.dieu_kien_ap_dung}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Ngày bắt đầu:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {new Date(magiamgia.ngay_bat_dau).toLocaleDateString('vi-VN')}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Ngày kết thúc:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {new Date(magiamgia.ngay_ket_thuc).toLocaleDateString('vi-VN')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            </Grid>
          </Paper>
        ) : (
          <Typography variant="body1">Không tìm thấy thông tin mã giảm giá.</Typography>
        )}
      </DialogContent>

      {/* Hành động */}
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MagiamgiaView;