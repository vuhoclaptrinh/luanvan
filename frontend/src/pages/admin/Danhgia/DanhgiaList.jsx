import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';

import ConfirmDeleteDialog from '../../../components/cfdelete';
import DanhgiaView from './DanhgiaView';

const API_BASE = 'http://127.0.0.1:8000/api/';

const DanhgiaList = () => {
  // State
  const [Danhgia, setDanhgia] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedDanhgiaId, setSelectedDangiaId] = useState(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState('');
  const [starFilter, setStarFilter] = useState('');

  // Lấy danh sách đánh giá
  const fetchDanhGia = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}danhgia`);
      if (res.data?.data && Array.isArray(res.data.data)) {
        setDanhgia(res.data.data);
      } else {
        console.error('Dữ liệu đánh giá không đúng định dạng:', res.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy đánh giá:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDanhGia();
  }, []);

  // Lọc dữ liệu theo tên và số sao
  useEffect(() => {
    const filtered = Danhgia.filter((item) => {
      const matchSearch =
        item.ten_khach_hang?.toLowerCase().includes(search.toLowerCase()) ||
        item.ten_san_pham?.toLowerCase().includes(search.toLowerCase());
      const matchStar = starFilter ? item.so_sao === parseInt(starFilter) : true;
      return matchSearch && matchStar;
    });
    setFilteredData(filtered);
  }, [Danhgia, search, starFilter]);

  // Handlers: View
  const handleView = (row) => {
    setSelectedDangiaId(row.id);
    setViewOpen(true);
  };

  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedDangiaId(null);
  };

  // Handlers: Delete
  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}danhgia/${deleteId}`);
      enqueueSnackbar('Xoá đánh giá thành công!', { variant: 'success' });
      setDanhgia((prev) => prev.filter((dg) => dg.id !== deleteId));
    } catch (error) {
      if (error.response?.status === 409) {
        enqueueSnackbar(error.response.data.message || 'Không thể xoá do ràng buộc dữ liệu', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Lỗi khi xoá đánh giá', { variant: 'error' });
      }
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
  };

  // Cột của DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'ten_khach_hang', headerName: 'Tên Khách Hàng', flex: 1, minWidth: 150 },
    { field: 'ten_san_pham', headerName: 'Tên Sản Phẩm', flex: 1, minWidth: 150 },
    { field: 'so_sao', headerName: 'Số Sao', width: 90,renderCell: (params) => (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography>
        {params.value} ⭐
      </Typography>
    </Box>
  ), },
    { field: 'noi_dung', headerName: 'Nội Dung', width: 250 },
    { field: 'ngay_danh_gia', headerName: 'Ngày Đánh Giá', width: 120 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      type: 'actions',
      width: 250,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" color="info" onClick={() => handleView(params.row)}>
            <VisibilityIcon />
          </Button>
          <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
       <Typography
              variant="h4"
              fontWeight="bold"
              mb={2}
              color="primary.main"
              textAlign="center"
            >
              Danh Sách Đánh Giá
            </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
        <TextField
          label="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tên khách hàng hoặc sản phẩm"
          sx={{ minWidth: 250 }}
        />
        <TextField
          select
          label="Số sao"
          value={starFilter}
          onChange={(e) => setStarFilter(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {[1, 2, 3, 4, 5].map((star) => (
            <MenuItem key={star} value={star}>
              {star} ⭐
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
      </Stack>

      <Box sx={{ width: '100%', height: 600, marginTop: 2 }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50]}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Dialogs */}
      <DanhgiaView open={viewOpen} onClose={handleCloseView} DanhgiaId={selectedDanhgiaId} />
      <ConfirmDeleteDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default DanhgiaList;
