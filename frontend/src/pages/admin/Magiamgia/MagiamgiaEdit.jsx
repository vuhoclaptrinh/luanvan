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

const MagiamgiaEdit = ({ open, onClose, MagiamgiaId, onUpdate }) => {
 const [formData, setFormData] = useState({
      ma: '',
      phan_tram_giam: '',
      ngay_bat_dau: '',
      ngay_ket_thuc: '',
      dieu_kien_ap_dung: '',
    });
 const [loading, setLoading] = useState(false);
// Lấy dữ liệu mã giảm giá khi dialog mở
  useEffect(() => {
    if (open && MagiamgiaId) {
      axios.get(`${API}/${MagiamgiaId}`)
        .then((res) => {
          const mg = res.data?.data || res.data;
          setFormData({
            ma: mg.ma || '',
            phan_tram_giam: mg.phan_tram_giam || '',
            ngay_bat_dau: mg.ngay_bat_dau || '',
            ngay_ket_thuc: mg.ngay_ket_thuc || '',
            dieu_kien_ap_dung: mg.dieu_kien_ap_dung  || '',
          });
        })
        .catch((err) => {
          console.error('Lỗi khi tải mã giảm giá:', err);
          enqueueSnackbar('Không thể tải dữ liệu mã giảm giá!', { variant: 'error' });
        });
    }
  }, [MagiamgiaId, open]);
 // Reset form khi đóng dialog
    useEffect(() => {
      if (!open) {
        setFormData({ ma: '', phan_tram_giam: '', ngay_bat_dau: '', ngay_ket_thuc: '', dieu_kien_ap_dung: '' });
        setLoading(false);
      }
    }, [open]);
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  const handleSubmit = async () => {
      if (!formData.ma.trim()) {
        enqueueSnackbar('Mã không được để trống!', { variant: 'warning' });
        return;
      }

      setLoading(true);
      try {
        const res = await axios.put(`${API}/${MagiamgiaId}`, formData);
        if (res.status === 200) {
          enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
          onUpdate();   // cập nhật lại danh sách
          onClose();    // đóng dialog
        } else {
          enqueueSnackbar('Cập nhật thất bại!', { variant: 'error' });
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật:', err);
        enqueueSnackbar('Cập nhật mã giảm giá thất bại!', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            name="ma"
            label="Tên Mã giảm giá"
            fullWidth
            required
            value={formData.ma}
            onChange={handleChange}
          />
          <TextField
            name="phan_tram_giam"
            label="Phần trăm giảm"
            fullWidth
            required
            value={formData.phan_tram_giam}
            onChange={handleChange}
          />
          <TextField
            name="ngay_bat_dau"
            label="Ngày bắt đầu"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={formData.ngay_bat_dau}
            onChange={handleChange}
          />
          <TextField
            name="ngay_ket_thuc"
            label="Ngày kết thúc"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={formData.ngay_ket_thuc}
            onChange={handleChange}
          />
          <TextField
            name="dieu_kien_ap_dung"
            label="Điều kiện áp dụng"
            fullWidth
            required
            value={formData.dieu_kien_ap_dung}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Huỷ bỏ
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog> 
  )
}

export default MagiamgiaEdit