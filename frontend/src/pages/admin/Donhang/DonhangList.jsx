import React, {  useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  Chip,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import ConfirmDeleteDialog from '../../../components/cfdelete';
import { enqueueSnackbar } from 'notistack';

import DonhangEdit from './DonhangEdit';
  
import DonhangView from './DonhangView';

const API_BASE = 'http://127.0.0.1:8000/api/';

const DonhangList = () => {
 const [Donhang, setDonhang] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog
  const [editOpen, setEditOpen] = useState(false);
 
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedDonhangId, setSelectedDonhangId] = useState(null);

  // xác nhận delete
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Lọc
  const [khachhangmap, setKhachhangmap] = useState({});
  const [selectedKhachhang, setSelectedKhachhang] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchName,setSearchName]= useState('');

  // Phân trang
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const fetchDonhang = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}donhang`);
      if (res.data?.data && Array.isArray(res.data.data)) {
        setDonhang(res.data.data);
      } else {
        console.error('Dữ liệu đơn hàng không đúng định dạng:', res.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng :', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchKhachhang = async () => {
      try {
        const res = await axios.get(`${API_BASE}khachhang`);
        if (res.data?.data && Array.isArray(res.data.data)) {
          const map = {};
          res.data.data.forEach((kh) => {
            map[kh.id] = kh.ho_ten;
          });
          setKhachhangmap(map);
        }
      } catch (error) {
        console.error('Lỗi khi lấy khách hàng:', error);
      }
    };
    useEffect(() => {
        fetchDonhang();
        fetchKhachhang();
    } , []);

    const handleEdit = (row) => {
        setSelectedDonhangId(row.id);
        setEditOpen(true);
    };

    const handleView = (row) => {
        setSelectedDonhangId(row.id);
        setViewOpen(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenConfirm(true);
    };

    const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}donhang/${deleteId}`);
      enqueueSnackbar('Xoá đơn hàng thành công!', { variant: 'success' });
      setDonhang((prev) => prev.filter((sp) => sp.id !== deleteId));
    } catch (error) {
      if (error.response?.status === 409) {
             enqueueSnackbar(error.response.data.message || 'Không thể xoá do ràng buộc dữ liệu', {
               variant: 'error',
             });
           } else 
      enqueueSnackbar('Xóa thất bại!', { variant: 'error' });
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedDonhangId(null);
  };
 

  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedDonhangId(null);
  };
  const donhangFiltered = Donhang.filter((dh) => {
  const matchSearch = dh.trang_thai?.toLowerCase().includes(searchText.toLowerCase());
  const matchKhachhang = selectedKhachhang ? dh.khach_hang_id === parseInt(selectedKhachhang) : true;
  const matchName=dh.ten_khach_hang?.toLowerCase().includes(searchName.toLowerCase());
  return matchSearch && matchKhachhang && matchName;
});

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    //{ field: 'khach_hang_id', headerName: 'Mã Khách Hàng', width: 200 },
    { field: 'ten_khach_hang', headerName: 'Tên Khách Hàng', width: 200 },
    { field: 'ngay_dat', headerName: 'Ngày Đặt  ', width: 150 },
    { field: 'tong_tien_format', headerName: 'Tổng tiền (VND)', width: 200 },
    { field: 'tong_tien_format_giam', headerName: 'Tổng tiền sau giảm(VND)', width: 200 },
    { field: 'trang_thai', headerName: 'Trạng Thái', width: 250,
     renderCell: (params) => {
    const { value } = params;

    let chipColor = 'default'; // fallback nếu không xác định

    switch (value.toLowerCase()) {
      case 'chờ xử lý':
        chipColor = 'warning';
        break;
      case 'chưa thanh toán':
        chipColor = 'error';
        break;
      case 'đã thanh toán':
        chipColor = 'success';
        break;
      case 'đang giao':
        chipColor = 'info';
        break;
      case 'đã giao':
        chipColor = 'success';
        break;
      default:
        chipColor = 'default';
    }

    return (
      <Chip
        label={value}
        color={chipColor}
        variant="outlined"
        size="small"
        sx={{ fontWeight: 500, textTransform: 'capitalize' }}
      />
    );
     },
    },
    // { field: 'ten_ma_giam_gia', headerName: 'Mã Giảm Giá', width: 100 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 250,
      sortable: false,
      filterable: false,
     renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{
        width: '100%',
        height: '100%', 
        alignItems: 'center',       
        justifyContent: 'center',
         
      }}>
        <Button size="small" variant="outlined" color="info" onClick={() => handleView(params.row)}>
            <VisibilityIcon />
        </Button>
        <Button size="small" variant="outlined" color="warning" onClick={() => handleEdit(params.row)}>
            <EditIcon />
        </Button>
        <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize="small" />
        </Button>
        </Stack>
    ),
    },
  ];





  return (
   <Box >
       <Typography
              variant="h4"
              fontWeight="bold"
              mb={2}
              color="primary.main"
              textAlign="center"
            >
              Danh Sách Đơn Hàng
            </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
        <TextField
          label="Tìm kiếm theo tên khách hàng"
          size="small"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ width: 250 }}
        />
        <TextField
          label="Tìm kiếm theo trạng thái"
          size="small"  
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <TextField
          select
          label="Lọc theo Khách hàng"   
          size="small"
          value={selectedKhachhang}
          onChange={(e) => setSelectedKhachhang(e.target.value)}
         sx={{ width: 200 }}
        >
          <MenuItem value="">Tất Cả </MenuItem>
          {Object.entries(khachhangmap).map(([id, name]) => (
            <MenuItem key={id} value={id}>{name}</MenuItem>
          ))}
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        {/* <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Thêm sản phẩm
        </Button> */}
      </Stack>

      <Box sx={{ width: '100%' , height: 600, marginTop: 2}}>
        <DataGrid
          rows={donhangFiltered}    
          columns={columns}
          loading={loading}
          autoHeight
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50]}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Dialogs */}
      {/* <SanphamAdd open={addOpen} onClose={handleCloseAdd} onUpdate={fetchSanpham} /> */}
      <DonhangEdit open={editOpen} onClose={handleCloseEdit} donhangId={selectedDonhangId} onUpdate={fetchDonhang} />
      <DonhangView open={viewOpen} onClose={handleCloseView} donhangId={selectedDonhangId} />
      <ConfirmDeleteDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default DonhangList