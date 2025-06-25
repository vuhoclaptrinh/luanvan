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
    xuat_xu: '',
    phong_cach: '',
    nam_phat_hanh: '',
    do_luu_huong: '',
    do_toa_huong: '',
    mo_ta: '',
    danh_muc_id: '',
  });

  const [variants, setVariants] = useState([{ dung_tich: '', gia: '', so_luong_ton: '' }]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { dung_tich: '', gia: '', so_luong_ton: '' }]);
  };

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
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

      for (const key in formdata) {
        data.append(key, formdata[key]);
      }

      variants.forEach((v, index) => {
        data.append(`variants[${index}][dung_tich]`, v.dung_tich);
        data.append(`variants[${index}][gia]`, v.gia);
        data.append(`variants[${index}][so_luong_ton]`, v.so_luong_ton);
      });

      if (fileAnh) {
        data.append('hinh_anh', fileAnh);
      }

      anhPhu.forEach(file => {
        data.append('hinh_phu[]', file);
      });

      await axios.post(API, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      enqueueSnackbar('Thêm sản phẩm thành công!', { variant: 'success' });
      onUpdate();
      onClose();

      setFormdata({
        ten_san_pham: '', thuong_hieu: '', xuat_xu: '', phong_cach: '', nam_phat_hanh: '',
        do_luu_huong: '', do_toa_huong: '', mo_ta: '', danh_muc_id: ''
      });
      setVariants([{ dung_tich: '', gia: '', so_luong_ton: '' }]);
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
          <TextField label="Tên sản phẩm" name="ten_san_pham" value={formdata.ten_san_pham} onChange={handleChange} fullWidth />
          <TextField label="Thương hiệu" name="thuong_hieu" value={formdata.thuong_hieu} onChange={handleChange} fullWidth />
          <TextField label="Xuất xứ" name="xuat_xu" value={formdata.xuat_xu} onChange={handleChange} fullWidth />
          <TextField label="Phong cách" name="phong_cach" value={formdata.phong_cach} onChange={handleChange} fullWidth />
          <TextField label="Năm phát hành" name="nam_phat_hanh" value={formdata.nam_phat_hanh} onChange={handleChange} fullWidth />
          <TextField label="Độ lưu hương" name="do_luu_huong" value={formdata.do_luu_huong} onChange={handleChange} fullWidth />
          <TextField label="Độ tỏa hương" name="do_toa_huong" value={formdata.do_toa_huong} onChange={handleChange} fullWidth />
          <TextField label="Mô tả" name="mo_ta" value={formdata.mo_ta} onChange={handleChange} fullWidth multiline rows={3} />

          {variants.map((variant, index) => (
            <Box key={index} display="flex" gap={2}>
              <TextField label="Dung tích" value={variant.dung_tich} onChange={(e) => handleVariantChange(index, 'dung_tich', e.target.value)} fullWidth />
              <TextField label="Giá" value={variant.gia} onChange={(e) => handleVariantChange(index, 'gia', e.target.value)} fullWidth />
              <TextField label="Số lượng" value={variant.so_luong_ton} onChange={(e) => handleVariantChange(index, 'so_luong_ton', e.target.value)} fullWidth />
              {index > 0 && <Button onClick={() => removeVariant(index)}>-</Button>}
            </Box>
          ))}
          <Button onClick={addVariant}>Thêm biến thể</Button>

          <Button variant="contained" component="label">Chọn ảnh chính<input type="file" hidden accept="image/*" onChange={handleFileChange} /></Button>
          {fileAnh && (
            <Box mt={1} textAlign="center">
              <div>Đã chọn: {fileAnh.name}</div>
              <img src={URL.createObjectURL(fileAnh)} alt="Ảnh chính" style={{ maxHeight: 200, objectFit: 'contain' }} />
            </Box>
          )}

          <Button variant="contained" component="label" color="secondary">Chọn ảnh phụ<input type="file" hidden multiple accept="image/*" onChange={handleMultiFileChange} /></Button>
          {anhPhu.length > 0 && (
            <Box mt={1} display="flex" gap={2} flexWrap="wrap">
              {anhPhu.map((file, idx) => (
                <img key={idx} src={URL.createObjectURL(file)} alt={`Ảnh phụ ${idx}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
              ))}
            </Box>
          )}

          <FormControl fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select name="danh_muc_id" value={formdata.danh_muc_id} onChange={handleChange} label="Danh mục">
              {danhMucList.map(dm => (
                <MenuItem key={dm.id} value={dm.id}>{dm.ten_danh_muc}</MenuItem>
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
