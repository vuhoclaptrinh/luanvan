import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem, Select, InputLabel,
  FormControl, CircularProgress, Box, Typography, IconButton
} from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';

const SanphamEdit = ({ open, onClose, sanphamId, onUpdate }) => {
  const [formdata, setFormdata] = useState({
    ten_san_pham: '',
    thuong_hieu: '',
    xuat_xu: '',
    phong_cach: '',
    nam_phat_hanh: '',
    do_luu_huong: '',
    do_toa_huong: '',
    mo_ta: '',
    dung_tich: '',
    gia: '',
    so_luong_ton: '',
    danh_muc_id: '',
  });

  
  const [danhmucList, setDanhmucList] = useState([]);

  const [currentImage, setCurrentImage] = useState('');  
  const [newImageFile, setNewImageFile] = useState(null);

  const [imagesPhu, setImagesPhu] = useState([]); 
  const [newImagesPhuFiles, setNewImagesPhuFiles] = useState([]); 
  const [imagesPhuDeletedIds, setImagesPhuDeletedIds] = useState([]); 

  const [variants, setVariants] = useState([]); // Thêm state lưu biến thể

  const [loading, setLoading] = useState(false);

  // Load danh mục khi mở dialog
  useEffect(() => {
    if (open) {
      axios.get('http://127.0.0.1:8000/api/danhmuc')
        .then(res => setDanhmucList(res.data?.data || []))
        .catch(console.error);
    }
  }, [open]);

  // Load chi tiết sản phẩm khi mở dialog
  useEffect(() => {
    if (sanphamId && open) {
      axios.get(`http://127.0.0.1:8000/api/sanpham/${sanphamId}`)
        .then(res => {
          const sp = res.data?.data;
          if (sp) {
            setFormdata({
              ten_san_pham: sp.ten_san_pham || '',
              thuong_hieu: sp.thuong_hieu || '',
              xuat_xu: sp.xuat_xu || '',
              phong_cach: sp.phong_cach || '',
              nam_phat_hanh: sp.nam_phat_hanh || '',
              do_luu_huong: sp.do_luu_huong || '',
              do_toa_huong: sp.do_toa_huong || '',
              mo_ta: sp.mo_ta || '',
              dung_tich: sp.dung_tich || '',
              gia: sp.gia || '',
              so_luong_ton: sp.so_luong_ton || '',
              danh_muc_id: sp.danh_muc_id || '',
            });
            setCurrentImage(sp.hinh_anh || '');
            setNewImageFile(null);
            setImagesPhu(sp.images || []);
            setNewImagesPhuFiles([]);
            setImagesPhuDeletedIds([]);
            setVariants(sp.variants || []); // Lưu biến thể
          }
        })
        .catch(console.error);
    }
  }, [sanphamId, open]);

  // Reset form khi đóng dialog
  useEffect(() => {
    if (!open) {
      setFormdata({
        ten_san_pham: '',
        thuong_hieu: '',
        xuat_xu: '',
        phong_cach: '',
        nam_phat_hanh: '',
        do_luu_huong: '',
        do_toa_huong: '',
        mo_ta: '',
        dung_tich: '',
        gia: '',
        so_luong_ton: '',
        danh_muc_id: '',
      });
      setCurrentImage('');
      setNewImageFile(null);
      setImagesPhu([]);
      setNewImagesPhuFiles([]);
      setImagesPhuDeletedIds([]);
      setVariants([]); // Reset biến thể
      setLoading(false);
    }
  }, [open]);

  // Xử lý thay đổi input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn file ảnh chính mới
  const handleMainImageChange = (e) => {
    if (e.target.files?.[0]) {
      setNewImageFile(e.target.files[0]);
      setCurrentImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Xử lý chọn nhiều ảnh phụ mới
  const handleNewImagesPhuChange = (e) => {
    if (e.target.files?.length) {
      // Thêm ảnh mới vào mảng newImagesPhuFiles
      const filesArray = Array.from(e.target.files);
      setNewImagesPhuFiles(prev => [...prev, ...filesArray]);
    }
  };

  // Xóa ảnh phụ hiện tại (có id)
  const handleDeleteExistingImagePhu = (id) => {
    // Thêm id ảnh bị xóa vào danh sách xóa
    setImagesPhuDeletedIds(prev => [...prev, id]);
   
    setImagesPhu(prev => prev.filter(img => img.id !== id));
  };

  // Xóa ảnh phụ mới (chưa upload) 
  const handleDeleteNewImagePhu = (index) => {
    setNewImagesPhuFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('blob:')) return path;
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8000/storage/${path}`;
  };

  // Xử lý thay đổi input variant
  const handleVariantChange = (idx, field, value) => {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  };

  // Submit form cập nhật
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formPayload = new FormData();

      // Thêm các trường dữ liệu
      Object.entries(formdata).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      // Ảnh chính mới
      if (newImageFile) {
        formPayload.append('hinh_anh', newImageFile);
      }

      // Ảnh phụ mới
      newImagesPhuFiles.forEach((file, ) => { 
        formPayload.append('hinh_phu[]', file);
      });

      // Danh sách ảnh phụ bị xóa (gửi id về backend để xóa)
      formPayload.append('images_phu_deleted', JSON.stringify(imagesPhuDeletedIds));

      // Gửi từng trường của từng variant theo dạng mảng lồng
      const variantsToSend = variants.map(v => ({
        ...v,
        dung_tich: v.dung_tich !== '' ? Number(v.dung_tich) : '',
        gia: v.gia !== '' ? Number(v.gia) : '',
        so_luong_ton: v.so_luong_ton !== '' ? Number(v.so_luong_ton) : '',
      }));
      variantsToSend.forEach((v, idx) => {
        Object.entries(v).forEach(([key, value]) => {
          formPayload.append(`variants[${idx}][${key}]`, value);
        });
      });

      // Gửi request PUT
      const response = await axios.post(
        `http://127.0.0.1:8000/api/sanpham/${sanphamId}?_method=PUT`,
        formPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        enqueueSnackbar('Cập nhật sản phẩm thành công!', { variant: 'success',position:"top-center" });
        onUpdate();
        onClose();
      } else {
        
        enqueueSnackbar('Cập nhật sản phẩm thất bại!', { variant: 'error' });
      }
    } catch (error) {
       console.error('Lỗi cập nhật:', error.response?.data || error.message || error);
      console.error('Lỗi cập nhật:', error?.response?.data || error);
      enqueueSnackbar('Cập nhật sản phẩm thất bại!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          {/* Các input như trước */}
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
            label="Xuất xứ"
            name="xuat_xu"
            value={formdata.xuat_xu}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phong cách"
            name="phong_cach"
            value={formdata.phong_cach}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Năm phát hành"
            name="nam_phat_hanh"
            value={formdata.nam_phat_hanh}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Độ lưu hương"
            name="do_luu_huong"
            value={formdata.do_luu_huong}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Độ tỏa hương"
            name="do_toa_huong"
            value={formdata.do_toa_huong}
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
         {/* Biến thể sản phẩm */}
          {variants.length > 0 && (
            <Box>
              <Typography variant="subtitle1" mt={2} mb={1}>Biến thể sản phẩm</Typography>
              <Stack spacing={2}>
                {variants.map((variant, idx) => (
                  <Box key={variant.id || idx} p={2} border={1} borderColor="#eee" borderRadius={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <TextField
                        label="Dung tích (ml)"
                        type="number"
                        value={variant.dung_tich}
                        onChange={e => handleVariantChange(idx, 'dung_tich', e.target.value)}
                        size="small"
                      />
                      <TextField
                        label="Giá (₫)"
                        type="number"
                        value={variant.gia}
                        onChange={e => handleVariantChange(idx, 'gia', e.target.value)}
                        size="small"
                      />
                      <TextField
                        label="Số lượng tồn"
                        type="number"
                        value={variant.so_luong_ton}
                        onChange={e => handleVariantChange(idx, 'so_luong_ton', e.target.value)}
                        size="small"
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
            
          )}

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
          {/* Ảnh chính */}
          {currentImage && (
            <Box textAlign="center">
              <Typography variant="subtitle2" gutterBottom>Ảnh chính hiện tại</Typography>
              <Box
                component="img"
                src={getImageUrl(currentImage)}
                alt="Ảnh sản phẩm"
                sx={{
                  width: 150,
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 1,
                  border: '1px solid #ccc',
                  mx: 'auto',
                }}
              />
            </Box>
          )}

          <Button variant="outlined" component="label">
            Chọn ảnh chính mới
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleMainImageChange}
            />
          </Button>

          {/* Ảnh phụ */}
          <Typography variant="subtitle1" mt={2}>Ảnh phụ hiện có</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {imagesPhu.length === 0 && <Typography>Chưa có ảnh phụ</Typography>}
            {imagesPhu.map(img => (
              <Box key={img.id} position="relative" sx={{ width: 100, height: 100 }}>
                <Box
                  component="img"
                  src={getImageUrl(img.image_path)}
                  alt="Ảnh phụ"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid #ccc',
                  }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteExistingImagePhu(img.id)}
                  sx={{ position: 'absolute', top: 0, right: 0 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>

          {/* Thêm ảnh phụ mới */}
          <Typography variant="subtitle1" mt={2}>Thêm ảnh phụ mới</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
            {newImagesPhuFiles.map((file, idx) => (
              <Box key={idx} position="relative" sx={{ width: 100, height: 100 }}>
                <Box
                  component="img"
                  src={URL.createObjectURL(file)}
                  alt="Ảnh phụ mới"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid #ccc',
                  }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteNewImagePhu(idx)}
                  sx={{ position: 'absolute', top: 0, right: 0 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>

          <Button variant="outlined" component="label">
            Chọn ảnh phụ mới
            <input
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={handleNewImagesPhuChange}
            />
          </Button>

          

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SanphamEdit;
