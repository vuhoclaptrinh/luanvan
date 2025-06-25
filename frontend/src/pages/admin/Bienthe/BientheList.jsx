// src/pages/admin/Bienthe/BientheList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';

const API_BASE = 'http://127.0.0.1:8000/api';

const BientheList = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ dung_tich: '', gia: '', so_luong_ton: '' });
  const [editId, setEditId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/bienthe`);
      if (res.data?.data && Array.isArray(res.data.data)) {
        setVariants(res.data.data); // Không lọc theo sản phẩm nữa
      } else {
        console.error('Dữ liệu biến thể không đúng định dạng:', res.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy biến thể:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form };
      if (editId) {
        await axios.put(`${API_BASE}/bienthe/${editId}`, payload);
        enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
      } else {
        await axios.post(`${API_BASE}/bienthe`, payload);
        enqueueSnackbar('Thêm thành công', { variant: 'success' });
      }
      setForm({ dung_tich: '', gia: '', so_luong_ton: '' });
      setEditId(null);
      setDialogOpen(false);
      fetchVariants();
    } catch (err) {
      enqueueSnackbar('Lỗi khi gửi dữ liệu', { variant: 'error' });
    }
  };

  const handleEdit = (v) => {
    setForm({ dung_tich: v.dung_tich, gia: v.gia, so_luong_ton: v.so_luong_ton });
    setEditId(v.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/bienthe/${id}`);
      enqueueSnackbar('Đã xoá biến thể', { variant: 'success' });
      fetchVariants();
    } catch (err) {
      enqueueSnackbar('Xoá thất bại', { variant: 'error' });
    }
  };

  const columns = [
    { field: 'dung_tich', headerName: 'Dung tích', width: 150 },
    {
      field: 'gia',
      headerName: 'Giá',
      width: 150,
      valueFormatter: (params) => `${parseInt(params.value).toLocaleString('vi-VN')} ₫`
    },
    { field: 'so_luong_ton', headerName: 'SL tồn', width: 100 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" color="warning" variant="outlined" onClick={() => handleEdit(params.row)}>
            <Edit fontSize="small" />
          </Button>
          <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(params.row.id)}>
            <Delete fontSize="small" />
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center" color="primary">
        Quản lý biến thể sản phẩm
      </Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)} sx={{ mb: 2 }}>
        Thêm biến thể
      </Button>

      <DataGrid
        rows={variants}
        columns={columns}
        getRowId={(row) => row.id || `${row.dung_tich}-${row.gia}`}
        autoHeight
        loading={loading}
        disableRowSelectionOnClick
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editId ? 'Cập nhật biến thể' : 'Thêm biến thể'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Dung tích" name="dung_tich" value={form.dung_tich} onChange={handleChange} fullWidth />
            <TextField label="Giá" name="gia" type="number" value={form.gia} onChange={handleChange} fullWidth />
            <TextField label="Số lượng tồn" name="so_luong_ton" type="number" value={form.so_luong_ton} onChange={handleChange} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BientheList;