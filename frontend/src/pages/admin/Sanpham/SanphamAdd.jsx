import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem, Select, InputLabel,
  FormControl, Box
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

  // 2 state riêng để xử lý nhập và hiển thị giá tiền có định dạng
  const [ giaRaw, setGiaRaw] = useState('');
  const [ giaHienThi, setGiaHienThi] = useState('');

  const [fileAnh, setFileAnh] = useState(null);
  const [anhPhu, setAnhPhu] = useState([]);
  const [danhMucList, setDanhMucList] = useState([]);

  useEffect(() => {
    axios.get(DM_API)
      .then(res => {
        if (res.data && res.data.data) setDanhMucList(res.data.data);
      })
      .catch(console.error);
  }, []);

  // Hàm định dạng số thành tiền VND dạng chuỗi
  const formatVND = (value) => {
    if (!value) return '';
    // Loại bỏ tất cả ký tự không phải số rồi parse
    const number = parseInt(value.replace(/\D/g, ''), 10);
    if (isNaN(number)) return '';
    return number.toLocaleString('vi-VN') ;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Xử lý riêng cho trường 'gia' (giá)
    if (name === 'gia') {
      // Lấy chỉ số nguyên từ chuỗi nhập vào
      const rawValue = value.replace(/\D/g, '');
      setGiaRaw(rawValue);
      setGiaHienThi(formatVND(rawValue));
      setFormdata(prev => ({ ...prev, gia: rawValue }));
    } else {
      setFormdata(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileAnh(e.target.files[0]);
    }
  };

  const handleMultiFileChange = (e) => {
    setAnhPhu(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      // Thêm dữ liệu từ form
      for (const key in formdata) {
        data.append(key, formdata[key]);
      }

      // Ảnh chính
      if (fileAnh) {
        data.append('hinh_anh', fileAnh);
      }

      // Ảnh phụ
      anhPhu.forEach(file => {
        data.append('hinh_phu[]', file);
      });

      // Gửi lên API
      await axios.post(API, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      enqueueSnackbar('Thêm sản phẩm thành công!', { variant: 'success' });
      onUpdate();
      onClose();

      // Reset
      setFormdata({
        ten_san_pham: '',
        thuong_hieu: '',
        mo_ta: '',
        dung_tich: '',
        gia: '',
        so_luong_ton: '',
        danh_muc_id: '',
      });
      setGiaRaw('');
      setGiaHienThi('');
      setFileAnh(null);
      setAnhPhu([]);

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
          <TextField
            label="Tên sản phẩm"
            name="ten_san_pham"
            value={formdata.ten_san_pham}
            onChange={handleChange}
            fullWidth
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

          {/* Trường giá dùng nhập kiểu text để dễ định dạng */}
          <TextField
            label="Giá"
            name="gia"
            value={giaHienThi}
            onChange={handleChange}
            fullWidth
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            placeholder="Nhập giá sản phẩm"
          />

          <TextField
            label="Số lượng"
            name="so_luong_ton"
            type="number"
            value={formdata.so_luong_ton}
            onChange={handleChange}
            fullWidth
          />

          {/* Chọn ảnh chính */}
          <Button variant="contained" component="label">
            Chọn ảnh chính
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {fileAnh && (
            <Box mt={1} textAlign="center">
              <div>Đã chọn: {fileAnh.name}</div>
              <img
                src={URL.createObjectURL(fileAnh)}
                alt="Ảnh chính"
                style={{ maxHeight: 200, objectFit: 'contain' }}
              />
            </Box>
          )}

          {/* Chọn nhiều ảnh phụ */}
          <Button variant="contained" component="label" color="secondary">
            Chọn ảnh phụ
            <input type="file" hidden multiple accept="image/*" onChange={handleMultiFileChange} />
          </Button>
          {anhPhu.length > 0 && (
            <Box mt={1} display="flex" gap={2} flexWrap="wrap">
              {anhPhu.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`Ảnh phụ ${idx}`}
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                />
              ))}
            </Box>
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
