import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';

import ConfirmDeleteDialog from '../../../components/cfdelete';
import DanhmucAdd from './DanhmucAdd';
import DanhmucEdit from './DanhmucEdit';
import DanhmucView from './DanhmucView';

const API_BASE = 'http://127.0.0.1:8000/api/';

const DanhmucList = () => {
  // State
  const [danhmuc, setDanhmuc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  // hành động mở dialog
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedDanhmucId, setSelectedDanhmucId] = useState(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // lấy danh sách danh mục
  const fetchDanhMuc = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}danhmuc`);
      if (res.data?.data && Array.isArray(res.data.data)) {
        setDanhmuc(res.data.data);
      } else {
        console.error('Dữ liệu danh mục không đúng định dạng:', res.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDanhMuc();
  }, []);

  // Handlers: Add
  const handleCloseAdd = () => {
    setAddOpen(false);
  };

  // Handlers: Edit
  const handleEdit = (row) => {
    setSelectedDanhmucId(row.id);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedDanhmucId(null);
  };

  // Handlers: View
  const handleView = (row) => {
    setSelectedDanhmucId(row.id);
    setViewOpen(true);
  };

  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedDanhmucId(null);
  };

  // Handlers: Delete
  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}danhmuc/${deleteId}`);
      enqueueSnackbar('Xoá danh mục thành công!', { variant: 'success' });
      setDanhmuc((prev) => prev.filter((dm) => dm.id !== deleteId));
    } catch (error) {
      if (error.response?.status === 409) {
        enqueueSnackbar(error.response.data.message || 'Không thể xoá do ràng buộc dữ liệu', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Lỗi khi xoá danh mục', { variant: 'error' });
      }
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // DataGrid Columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'ten_danh_muc', headerName: 'Tên danh mục', flex: 1, minWidth: 150 },
    { field: 'mo_ta', headerName: 'Mô tả', flex: 1, minWidth: 200 },
    { 
      field: 'created_at', 
      headerName: 'Ngày tạo', 
      width: 160,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">
          {formatDate(params.value)}
        </Typography>
      )
    },
     { 
      field: 'updated_at', 
      headerName: 'Ngày cập nhật', 
      width: 160,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">
          {formatDate(params.value)}
        </Typography>
      )
    },
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
    <Box>
       <Typography
              variant="h4"
              fontWeight="bold"
              mb={2}
              color="primary.main"
              textAlign="center"
            >
              Danh Sách Danh Mục
            </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Thêm danh mục
        </Button>
      </Stack>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <DataGrid
          rows={danhmuc}
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
      <DanhmucAdd open={addOpen} onClose={handleCloseAdd} onUpdate={fetchDanhMuc} />
      <DanhmucEdit open={editOpen} onClose={handleCloseEdit} DanhmucId={selectedDanhmucId} onUpdate={fetchDanhMuc} />
      <DanhmucView open={viewOpen} onClose={handleCloseView} DanhmucId={selectedDanhmucId} />
      <ConfirmDeleteDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default DanhmucList;
