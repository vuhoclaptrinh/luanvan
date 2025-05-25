import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack
} from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const API = 'http://127.0.0.1:8000/api/danhmuc';

const DanhmucAdd = ({ open, onClose, onUpdate }) => {
  const [formdata, setFormdata] = useState({
    ten_danh_muc: '',
    mo_ta: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formdata.ten_danh_muc.trim()) {
      enqueueSnackbar('Tên danh mục không được để trống!', { variant: 'warning' });
      return;
    }

    setLoading(true);
    try {
      await axios.post(API, formdata);
      enqueueSnackbar('Thêm danh mục thành công!', { variant: 'success' });
      onClose();           // đóng dialog
      onUpdate();          // gọi lại danh sách
      setFormdata({ ten_danh_muc: '', mo_ta: '' }); // reset form
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      enqueueSnackbar('Thêm thất bại!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm danh mục</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            name="ten_danh_muc"
            label="Tên danh mục"
            fullWidth
            value={formdata.ten_danh_muc}
            onChange={handleChange}
          />
          <TextField
            name="mo_ta"
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={formdata.mo_ta}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DanhmucAdd;
