import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const API = 'http://127.0.0.1:8000/api/magiamgia';

const MagiamgiaAdd = ({ open, onClose, onUpdate }) => {
   const [formData, setFormData] = useState({
      ma: '',
      phan_tram_giam: '',
      ngay_bat_dau: '',
      ngay_ket_thuc: '',
      dieu_kien_ap_dung: '',
    });
    const [loading, setLoading] = useState(false);
    // tạo lại form 
      useEffect(() => {
        if (!open) return;
        setFormData({ ma: '', phan_tram_giam: '', ngay_bat_dau: '', ngay_ket_thuc: '', dieu_kien_ap_dung: '' });
      }, [open]);
    // Cập nhật 
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    // thêm mới magiamgia
      const handleSubmit = async () => {
        if (!formData.ma.trim()) {
          enqueueSnackbar('Mã không được để trống!', { variant: 'warning' });
          return;
        }
        if (!formData.phan_tram_giam.trim()) {
          enqueueSnackbar('Phần trăm giảm không được để trống!', { variant: 'warning' });
          return;
        }
        if (!formData.ngay_bat_dau.trim()) {
          enqueueSnackbar('Ngày bắt đầu không được để trống!', { variant: 'warning' });
          return;
        }
        if (!formData.ngay_ket_thuc.trim()) {
          enqueueSnackbar('Ngày kết thúc không được để trống!', { variant: 'warning' });
          return;
        }
        if (!formData.dieu_kien_ap_dung.trim()) {
          enqueueSnackbar('Điều kiện áp dụng không được để trống!', { variant: 'warning' });
          return;
        }

        setLoading(true);
        try {
          await axios.post(API, formData);
          enqueueSnackbar('Thêm mới mã giảm giá thành công!', { variant: 'success' });
          onUpdate();
          onClose();
        } catch (error) {
          enqueueSnackbar('Lỗi khi thêm mới mã giảm giá', { variant: 'error' });
        } finally {
          setLoading(false);
        }
      };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm mới mã giảm giá</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Mã"
            name="ma"
            value={formData.ma}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phần trăm giảm"
            name="phan_tram_giam"
            value={formData.phan_tram_giam}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Ngày bắt đầu"
            name="ngay_bat_dau"
            type="date"
            value={formData.ngay_bat_dau}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Ngày kết thúc"
            name="ngay_ket_thuc"
            type="date"
            value={formData.ngay_ket_thuc}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Điều kiện áp dụng"
            name="dieu_kien_ap_dung"
            value={formData.dieu_kien_ap_dung}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MagiamgiaAdd;