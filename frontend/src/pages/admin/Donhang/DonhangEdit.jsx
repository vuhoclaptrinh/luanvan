import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem, Select, InputLabel,
  FormControl, CircularProgress, Box, Typography, IconButton
} from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';


const DonhangEdit = ({ open, onClose, donhangId, onUpdate }) => {
const [formdata, setFormdata] = useState({
    khach_hang_id: '',
    ten_khach_hang: '',
    ngay_dat: '',
    tong_tien: '',
    trang_thai: '',
    ma_giam_gia_id: '',
    ten_ma_giam_gia: '',  
  });
const [loading, setLoading] = useState(false);

useEffect(() => {
    if (donhangId && open) {
      axios.get(`http://127.0.0.1:8000/api/donhang/${donhangId}`)
        .then(res => {
            
          const dh = res.data;
          if (dh) {
            setFormdata({
              khach_hang_id: dh.khach_hang_id   || '',
              ten_khach_hang: dh.ten_khach_hang || '',
              ngay_dat: dh.ngay_dat ? dh.ngay_dat.split(' ')[0] : '',
              tong_tien: dh.tong_tien || '',
              trang_thai: dh.trang_thai || '',  
              ma_giam_gia_id: dh.ma_giam_gia_id || '',
              ten_ma_giam_gia: dh.ten_ma_giam_gia || '',
            });
          }
        })
        .catch(console.error);
    }
  }, [donhangId , open]);
// Reset form khi đóng dialog
  useEffect(() => {
    if (!open) {
      setFormdata({
        khach_hang_id: '',
        ten_khach_hang: '',
        ngay_dat: '',
        tong_tien: '',
        trang_thai: '',
        ma_giam_gia_id: '',
      });
      setLoading(false);
    }
  }, [open]);
 // Xử lý thay đổi input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata(prev => ({ ...prev, [name]: value }));
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
      // Gửi request PUT
      const response = await axios.post(
        `http://127.0.0.1:8000/api/donhang/${donhangId}?_method=PUT`,
        formPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        enqueueSnackbar('Cập nhật đơn hàng thành công!', { variant: 'success' });
        onUpdate();
        onClose();
      } else {
        enqueueSnackbar('Cập nhật đơn hàng thất bại!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      enqueueSnackbar('Cập nhật đơn hàng thất bại!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Cập nhật đơn hàng</DialogTitle>
    <DialogContent>
      <Stack spacing={2} mt={1}>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Khách hàng ID"
          name="khach_hang_id"
          value={formdata.khach_hang_id}  
          onChange={handleChange}
          fullWidth
          disabled
        />
        <TextField
          label="Tên khách hàng"
          name="ten_khach_hang"
          value={formdata.ten_khach_hang}
          onChange={handleChange}
          fullWidth
          disabled 
        /></Stack>    
        <TextField
          label="Ngày đặt"
          type="date"
          name="ngay_dat"
          value={formdata.ngay_dat}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          disabled 
        />
        <TextField
          label="Tổng tiền"
          name="tong_tien"
          value={formdata.tong_tien}
          onChange={handleChange}
          fullWidth
          disabled
        />
       <FormControl fullWidth>
        <InputLabel>Trạng thái</InputLabel>
        <Select
          label="Trạng thái"
          name="trang_thai"
          value={formdata.trang_thai}
          onChange={handleChange}
        >
          <MenuItem value="chờ xử lý">Chờ xử lý</MenuItem>
          <MenuItem value="chưa thanh toán">Chưa thanh toán</MenuItem>
          <MenuItem value="đã thanh toán">Đã thanh toán</MenuItem>
          <MenuItem value="đang giao">Đang giao</MenuItem>
          <MenuItem value="đã giao">Đã giao</MenuItem>
          <MenuItem value="đã hủy">Đã hủy</MenuItem>
        </Select>
      </FormControl>
        <Stack direction="row" spacing={2}> 
        <TextField
          label="Mã giảm giá ID"
          name="ma_giam_gia_id"
          value={formdata.ma_giam_gia_id}
          onChange={handleChange}
          fullWidth
          disabled
          
        />
        <TextField
          label="Tên Mã giảm giá"
          name="ten_ma_giam_gia"
          value={formdata.ten_ma_giam_gia}
          onChange={handleChange}
          fullWidth
          disabled
        />
        </Stack> 
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

export default DonhangEdit