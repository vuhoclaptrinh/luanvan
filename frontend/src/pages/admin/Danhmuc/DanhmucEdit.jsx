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

const API = 'http://127.0.0.1:8000/api/danhmuc';

const DanhmucEdit = ({ open, onClose, DanhmucId, onUpdate }) => {
  const [formData, setFormData] = useState({
    ten_danh_muc: '',
    mo_ta: '',
  });

  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu danh mục khi dialog mở
  useEffect(() => {
    if (open && DanhmucId) {
      axios.get(`${API}/${DanhmucId}`)
        .then((res) => {
          const dm = res.data?.data || res.data;
          setFormData({
            ten_danh_muc: dm.ten_danh_muc || '',
            mo_ta: dm.mo_ta || '',
          });
        })
        .catch((err) => {
          console.error('Lỗi khi tải danh mục:', err);
          enqueueSnackbar('Không thể tải dữ liệu danh mục!', { variant: 'error' });
        });
    }
  }, [DanhmucId, open]);

  // Reset form khi đóng dialog
  useEffect(() => {
    if (!open) {
      setFormData({ ten_danh_muc: '', mo_ta: '' });
      setLoading(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.ten_danh_muc.trim()) {
      enqueueSnackbar('Tên danh mục không được để trống!', { variant: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`${API}/${DanhmucId}`, formData);
      if (res.status === 200) {
        enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
        onUpdate();   // cập nhật lại danh sách
        onClose();    // đóng dialog
      } else {
        enqueueSnackbar('Cập nhật thất bại!', { variant: 'error' });
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      enqueueSnackbar('Cập nhật danh mục thất bại!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            name="ten_danh_muc"
            label="Tên danh mục"
            fullWidth
            required
            value={formData.ten_danh_muc}
            onChange={handleChange}
          />
          <TextField
            name="mo_ta"
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={formData.mo_ta}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DanhmucEdit;
