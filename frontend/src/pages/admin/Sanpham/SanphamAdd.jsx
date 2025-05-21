import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem, Select, InputLabel, FormControl, Box
} from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const API = 'http://127.0.0.1:8000/api/sanpham';
const DM_API = 'http://127.0.0.1:8000/api/danhmuc';

const SanphamAdd = ({ open, onClose, onUpdate }) => {
  const [formdata, setFormdata] = useState({
    ten_san_pham: '',
    thuong_hieu: '',
    mo_ta: '',
    dung_tich: '',
    gia: '',
    so_luong_ton: '',
    danh_muc_id: '',
  });

  const [fileAnh, setFileAnh] = useState(null);
  const [danhMucList, setDanhMucList] = useState([]);

  useEffect(() => {
    axios.get(DM_API).then(res => { if (res.data && res.data.data) setDanhMucList(res.data.data); })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileAnh(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      // Thêm các trường trừ ảnh
      for (const key in formdata) {
        data.append(key, formdata[key]);
      }

      // Thêm ảnh nếu có
      if (fileAnh) {
        data.append('hinh_anh', fileAnh);
      }

      await axios.post(API, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

       enqueueSnackbar('Thêm sản phẩm thành công!', { variant: 'success' });
      onUpdate();
      onClose();

      // Reset form
      setFormdata({
        ten_san_pham: '',
        thuong_hieu: '',
        mo_ta: '',
        dung_tich: '',
        gia: '',
        so_luong_ton: '',
        danh_muc_id: '',
      });
      setFileAnh(null);

    } catch (error) {
      console.error(error.response?.data || error);
      enqueueSnackbar('Thêm sản phẩm thất bại!', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm sản phẩm</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Tên sản phẩm" name="ten_san_pham" value={formdata.ten_san_pham} onChange={handleChange} fullWidth />
          <TextField label="Thương hiệu" name="thuong_hieu" value={formdata.thuong_hieu} onChange={handleChange} fullWidth />
          <TextField label="Mô tả" name="mo_ta" value={formdata.mo_ta} onChange={handleChange} fullWidth multiline rows={3} />
          <TextField label="Dung tích" name="dung_tich" value={formdata.dung_tich} onChange={handleChange} fullWidth />
          <TextField label="Giá" name="gia" type="number" value={formdata.gia} onChange={handleChange} fullWidth />
          <TextField label="Số lượng" name="so_luong_ton" type="number" value={formdata.so_luong_ton} onChange={handleChange} fullWidth />

          {/* File upload */}
          <Button variant="contained" component="label">
            Chọn hình ảnh
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {fileAnh && (
            <>
              <div>Đã chọn: {fileAnh.name}</div>
              <Box mt={1} textAlign="center">
                <img
                  src={URL.createObjectURL(fileAnh)}
                  alt="Preview"
                  style={{ maxHeight: 200, objectFit: 'contain' }}
                />
              </Box>
            </>
          )}

          {/* Danh mục */}
          <FormControl fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              name="danh_muc_id"
              value={formdata.danh_muc_id}
              onChange={handleChange}
              label="Danh mục"
            >
              {danhMucList.map(dm => (
                <MenuItem key={dm.id} value={dm.id}>
                  {dm.ten_danh_muc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>Thêm</Button>
      </DialogActions>
    </Dialog>
  );    
};

export default SanphamAdd;
