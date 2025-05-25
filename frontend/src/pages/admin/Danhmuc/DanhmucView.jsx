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

const DanhmucView = ({ open, onClose, DanhmucId }) => {
  const [danhmuc, setDanhmuc] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch chi tiết danh mục khi mở dialog
  useEffect(() => {
    if (open && DanhmucId) {
      setLoading(true);
      axios
        .get(`${API_BASE}danhmuc/${DanhmucId}`)
        .then((res) => {
          setDanhmuc(res.data.data || res.data);
        })
        .catch(() => {
          setDanhmuc(null);
        })
        .finally(() => setLoading(false));
    } else {
      setDanhmuc(null);
    }
  }, [open, DanhmucId]);

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
        Chi tiết danh mục
      </DialogTitle>

      {/* Nội dung */}
      <DialogContent dividers sx={{ backgroundColor: '#f9f9f9' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={150}>
            <CircularProgress />
          </Box>
        ) : danhmuc ? (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: 'white' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                {/* Tên danh mục */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {danhmuc.ten_danh_muc}
                </Typography>

                {/* Thông tin chi tiết */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    ['ID', danhmuc.id],
                    ['Mô tả', danhmuc.mo_ta || 'N/A'],
                  ].map(([label, value], index) => (
                    <Box key={index} display="flex">
                      <Typography sx={{ width: 130, fontWeight: 500 }}>{label}:</Typography>
                      <Typography>{value}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* hiển thị danh sách sản phẩm */}
                {danhmuc.sanphams?.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Sản phẩm thuộc danh mục ({danhmuc.sanphams.length}):
                    </Typography>

                    {danhmuc.sanphams.map((sp) => (
                      <Box key={sp.id} display="flex" gap={2} mb={0.5}>
                        <Typography sx={{ width: 100, fontWeight: 500 }}>
                          ID: {sp.id}
                        </Typography>
                        <Typography>
                          Tên: {sp.ten_san_pham}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Typography align="center" color="error" sx={{ py: 5 }}>
            Không tìm thấy dữ liệu danh mục.
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

export default DanhmucView;
