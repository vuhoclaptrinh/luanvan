import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem, Select, InputLabel,
  FormControl, CircularProgress, Box, Typography
} from '@mui/material';
import axios from 'axios';

const API_SANPHAM = 'http://127.0.0.1:8000/api/sanpham';
const API_DANHMUC = 'http://127.0.0.1:8000/api/danhmuc';

const SanphamEdit = ({ open, onClose, sanphamId, onUpdate }) => {
  const [formdata, setFormdata] = useState({
    ten_san_pham: '',
    thuong_hieu: '',
    mo_ta: '',
    dung_tich: '',
    gia: '',
    so_luong_ton: '',
    danh_muc_id: '',
  });

  const [danhmucList, setDanhmucList] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load danh mục khi mở
  useEffect(() => {
    if (open) {
      axios.get(API_DANHMUC)
        .then(res => {
          setDanhmucList(res.data?.data || []);
        })
        .catch(err => console.error('Lỗi load danh mục:', err));
    }
  }, [open]);

  // Load chi tiết sản phẩm
  useEffect(() => {
    if (sanphamId && open) {
      axios.get(`${API_SANPHAM}/${sanphamId}`)
        .then(res => {
          const sp = res.data?.data;
          if (sp) {
            setFormdata({
              ten_san_pham: sp.ten_san_pham || '',
              thuong_hieu: sp.thuong_hieu || '',
              mo_ta: sp.mo_ta || '',
              dung_tich: sp.dung_tich || '',
              gia: sp.gia || '',
              so_luong_ton: sp.so_luong_ton || '',
              danh_muc_id: sp.danh_muc_id || '',
            });
            setCurrentImage(sp.hinh_anh || '');
            setNewImageFile(null);
          }
        })
        .catch(console.error);
    }
  }, [sanphamId, open]);

  // Reset khi đóng
  useEffect(() => {
    if (!open) {
      setFormdata({
        ten_san_pham: '',
        thuong_hieu: '',
        mo_ta: '',
        dung_tich: '',
        gia: '',
        so_luong_ton: '',
        danh_muc_id: '',
      });
      setCurrentImage('');
      setNewImageFile(null);
      setLoading(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setNewImageFile(e.target.files[0]);
      setCurrentImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const getImageUrl = () => {
    if (!currentImage) return null;
    if (currentImage.startsWith('blob:')) return currentImage;
    return `http://127.0.0.1:8000/storage/images/${currentImage}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formdata).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (newImageFile) data.append('hinh_anh', newImageFile);

      await axios.post(`${API_SANPHAM}/${sanphamId}?_method=PUT`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Cập nhật thành công!');
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      alert('Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Tên sản phẩm"
            name="ten_san_pham"
            value={formdata.ten_san_pham}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Thương hiệu"
            name="thuong_hieu"
            value={formdata.thuong_hieu}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Mô tả"
            name="mo_ta"
            value={formdata.mo_ta}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Dung tích"
            name="dung_tich"
            value={formdata.dung_tich}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Giá"
            name="gia"
            type="number"
            inputProps={{ min: 0 }}
            value={formdata.gia}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Số lượng tồn"
            name="so_luong_ton"
            type="number"
            inputProps={{ min: 0 }}
            value={formdata.so_luong_ton}
            onChange={handleChange}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel id="danhmuc-label">Danh mục</InputLabel>
            <Select
              labelId="danhmuc-label"
              name="danh_muc_id"
              value={formdata.danh_muc_id}
              onChange={handleChange}
              label="Danh mục"
              required
            >
              {danhmucList.map(dm => (
                <MenuItem key={dm.id} value={dm.id}>
                  {dm.ten_danh_muc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {getImageUrl() && (
            <Box textAlign="center">
              <Typography variant="subtitle2" gutterBottom>Ảnh hiện tại</Typography>
              <Box
                component="img"
                src={getImageUrl()}
                alt="Ảnh sản phẩm"
                sx={{
                  width: 150,
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 1,
                  border: '1px solid #ccc',
                }}
              />
            </Box>
          )}

          <Button variant="outlined" component="label">
            Chọn ảnh mới
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SanphamEdit;
