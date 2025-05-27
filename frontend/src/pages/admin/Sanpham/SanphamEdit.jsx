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
              mo_ta: sp.mo_ta || '',
              dung_tich: sp.dung_tich || '',
              gia: sp.gia || '',
              so_luong_ton: sp.so_luong_ton || '',
              danh_muc_id: sp.danh_muc_id || '',
            });
            setCurrentImage(sp.hinh_anh || '');
            setNewImageFile(null);

            // Ảnh phụ hiện có
            setImagesPhu(sp.images || []);
            setNewImagesPhuFiles([]);
            setImagesPhuDeletedIds([]);
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
        formPayload.append('images_phu[]', file);
      });

      // Danh sách ảnh phụ bị xóa (gửi id về backend để xóa)
      formPayload.append('images_phu_deleted', JSON.stringify(imagesPhuDeletedIds));

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
        enqueueSnackbar('Cập nhật sản phẩm thành công!', { variant: 'success' });
        onUpdate();
        onClose();
      } else {
        enqueueSnackbar('Cập nhật sản phẩm thất bại!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
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
