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
  Stack,
} from '@mui/material';

import axios from 'axios';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PercentIcon from '@mui/icons-material/Percent';
import RuleIcon from '@mui/icons-material/Rule';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';

const API_BASE = 'http://127.0.0.1:8000/api/';

const InfoItem = ({ icon: Icon, label, value }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1 }}>
    <Icon color="primary" sx={{ fontSize: 30 }} />
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

const MagiamgiaView = ({ open, onClose, MagiamgiaId }) => {
  const [magiamgia, setMagiamgia] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: 20,
        }}
      >
        <ConfirmationNumberIcon fontSize="large" />
        Chi tiết mã giảm giá
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#f9f9f9' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={180}>
            <CircularProgress />
          </Box>
        ) : magiamgia ? (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={3}>
              {/* Cột trái */}
              <Grid item xs={12} sm={6}>
                <InfoItem icon={ConfirmationNumberIcon} label="Mã" value={magiamgia.ma} />
                 <InfoItem
                  icon={PercentIcon}
                  label="Phần trăm giảm"
                  value={`${magiamgia.phan_tram_giam}%`}
                />
                <InfoItem
                  icon={RuleIcon}
                  label="Điều kiện áp dụng"
                  value={magiamgia.dieu_kien_ap_dung || 'Không có'}
                />
               
                
              </Grid>

              {/* Cột phải */}
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon={EventAvailableIcon}
                  label="Ngày bắt đầu"
                  value={new Date(magiamgia.ngay_bat_dau).toLocaleDateString('vi-VN')}
                />
                <InfoItem
                  icon={EventBusyIcon}
                  label="Ngày kết thúc"
                  value={new Date(magiamgia.ngay_ket_thuc).toLocaleDateString('vi-VN')}
                />
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 5 }}>
            Không tìm thấy thông tin mã giảm giá.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="primary" onClick={onClose} fullWidth>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MagiamgiaView;
