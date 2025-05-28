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
  Avatar,
  Divider,
} from '@mui/material';
import { Person as PersonIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/';

const NguoidungView = ({ open, onClose, NguoidungId }) => {
  const [loading, setLoading] = useState(false);
  const [Nguoidung, setNguoidung] = useState(null);

  useEffect(() => {
    const fetchNguoidung = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}khachhang/${NguoidungId}`);
        setNguoidung(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        setNguoidung(null);
      } finally {
        setLoading(false);
      }
    };

    if (NguoidungId && open) {
      fetchNguoidung();
    } else {
      setNguoidung(null);
    }
  }, [NguoidungId, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
          overflow: 'visible',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
          px: 3,
          fontWeight: 'bold',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon />
          <Typography variant="h5" fontWeight="bold">
            Chi tiết người dùng
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          sx={{ color: 'inherit', minWidth: 'auto', p: 1, borderRadius: 2 }}
          aria-label="close"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: '#f9f9f9' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
            <CircularProgress size={48} />
          </Box>
        ) : Nguoidung ? (
          <Paper
            elevation={3}
            sx={{ m: 3, p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', bgcolor: 'white' }}
          >
            <Box textAlign="center" mb={3}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto' }}>
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" mt={1}>
                {Nguoidung.ho_ten || 'Người dùng'}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Mã:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {Nguoidung.id}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Email:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {Nguoidung.email}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Số điện thoại:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {Nguoidung.so_dien_thoai}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Địa chỉ:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {Nguoidung.dia_chi}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Chức vụ:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {Nguoidung.role === 1 ? 'Admin' : 'Người dùng'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Box textAlign="center" py={8}>
            <PersonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="error" gutterBottom>
              Không tìm thấy thông tin người dùng
            </Typography>
            <Typography color="textSecondary">
              Thông tin có thể đã bị xóa hoặc không tồn tại
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NguoidungView;
