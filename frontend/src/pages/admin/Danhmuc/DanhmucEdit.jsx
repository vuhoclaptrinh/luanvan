import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack
} from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const DanhmucEdit = ({ open, onClose, DanhmucId, onUpdate }) => {
  const [formdata, setFormdata] = useState({
    ten_danh_muc: '',
    mo_ta: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (DanhmucId && open) {
      axios.get(`http://127.0.0.1:8000/api/danhmuc/${DanhmucId}`)
        .then(res => {
           const dm = res.data?.data || res.data;
          if (dm) {
            setFormdata({
              ten_danh_muc: dm.ten_danh_muc || '',
              mo_ta: dm.mo_ta || '',
            });
          }
        })
        .catch(error => {
          console.error('Lỗi khi lấy dữ liệu:', error);
          enqueueSnackbar('Không thể tải dữ liệu danh mục', { variant: 'error' });
        });
    }
  }, [DanhmucId, open]);

  useEffect(() => {
    if (!open) {
      setFormdata({
        ten_danh_muc: '',
        mo_ta: '',
      });
      setLoading(false);
    }
  }, [open]);

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
      const response = await axios.put(
        `http://127.0.0.1:8000/api/danhmuc/${DanhmucId}`,
        formdata
      );

      if (response.status === 200) {
        enqueueSnackbar('Cập nhật danh mục thành công!', { variant: 'success' });
        onUpdate();
        onClose();
      } else {
        enqueueSnackbar('Cập nhật thất bại!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
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

export default DanhmucEdit;
