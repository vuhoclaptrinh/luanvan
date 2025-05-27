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

const API = 'http://127.0.0.1:8000/api/khachhang';

const NguoidungEdit = ({open ,onClose,NguoidungId , onUpdate}) => {
const [formData, setFormData] = useState({
  'ho_ten': '',
  'email': '',
  'mat_khau': '',
  'so_dien_thoai': '',
  'dia_chi': '',
  'role': '',
});
const [loading, setLoading] = useState(false);
useEffect(() => {
  if (open && NguoidungId) {
    axios.get(`${API}/${NguoidungId}`)
      .then((res) => {
        const nd = res.data?.data || res.data;
        setFormData({
          'ho_ten': nd.ho_ten || '',
          'email': nd.email || '',
          'mat_khau': nd.mat_khau || '',
          'so_dien_thoai': nd.so_dien_thoai || '',
          'dia_chi': nd.dia_chi || '',
          'role': nd.role || '',
        });
      })
      .catch((err) => {
        console.error('Lỗi khi tải người dùng:', err);
        enqueueSnackbar('Không thể tải dữ liệu người dùng!', { variant: 'error' });
      });
  }
}, [NguoidungId, open]);
// Reset form khi đóng dialog
    useEffect(() => {
      if (!open) {
        setFormData({ 'ho_ten': '', 'email': '', 'mat_khau': '', 'so_dien_thoai': '', 'dia_chi': '', 'role': '' });
        setLoading(false);
      }
    }, [open]);
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async () => {
     

      setLoading(true);
      try {
        const res = await axios.put(`${API}/${NguoidungId}`, formData);
        if (res.status === 200) {
          enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
          onUpdate();   // cập nhật lại danh sách
          onClose();    // đóng dialog
        } else {
          enqueueSnackbar('Cập nhật thất bại!', { variant: 'error' });
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật:', err);
        enqueueSnackbar('Cập nhật người dùng thất bại!', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>Cập nhật người dùng</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                name="ho_ten"
                label="Họ tên"
                fullWidth
                required
                value={formData.ho_ten}
                onChange={handleChange}
              />
              <TextField
                name="email"
                label="Email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                name="mat_khau"
                label="Mật khẩu"
                type="password"
                fullWidth
                required
                value={formData.mat_khau}
                onChange={handleChange}
              />
              <TextField
                name="so_dien_thoai"
                label="Số điện thoại"
                fullWidth
                required
                value={formData.so_dien_thoai}
                onChange={handleChange}
              />
              <TextField
                name="dia_chi"
                label="Địa chỉ"
                fullWidth
                required
                value={formData.dia_chi}
                onChange={handleChange}
              />
              <TextField
                name="role"
                label="Chức vụ (1: Admin, 2: Người dùng)"
                fullWidth
                required
                value={formData.role}
                onChange={handleChange}/>
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
  );
}

export default NguoidungEdit