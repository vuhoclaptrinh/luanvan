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
      } finally {
        setLoading(false);
      }
    };

    if (NguoidungId && open) {
      fetchNguoidung();
    }
  }, [NguoidungId, open]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!Nguoidung) {
    return <Typography variant="body1">Không tìm thấy thông tin người dùng.</Typography>;
  }

  return(
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        {/* Tiêu đề */}
        <DialogTitle
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Chi tiết người dùng: {Nguoidung.ho_ten}
        </DialogTitle>
  
        {/* Nội dung */}
        <DialogContent dividers sx={{ backgroundColor: '#f9f9f9' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={150}>
              <CircularProgress />
            </Box>
          ) : Nguoidung ? (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: 'white' }}>
              <Grid container spacing={2}>
               <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Mã:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {Nguoidung.id}
                    </Typography>

                  </Box>
                </Grid>
  
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Họ tên:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {Nguoidung.ho_ten}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Email:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {Nguoidung.email}
                    </Typography>
                  </Box>
                </Grid>
  
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Số điện thoại:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {Nguoidung.so_dien_thoai}
                    </Typography>
                  </Box>
                </Grid>
  
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                     Điạ chỉ:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                     {Nguoidung.dia_chi}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                     Chức vụ:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                     {Nguoidung.role === 1 ? 'Admin' : 'Người dùng'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              </Grid>
            </Paper>
          ) : (
            <Typography variant="body1">Không tìm thấy thông tin </Typography>
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

export default NguoidungView;