import React, {useEffect
, useState  
} from 'react'
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import ConfirmDeleteDialog from '../../../components/cfdelete';
import { enqueueSnackbar } from 'notistack';

import MagiamgiaAdd from './MagiamgiaAdd';
import MagiamgiaView from './MagiamgiaView';    
import MagiamgiaEdit from './MagiamgiaEdit';

const API_BASE = 'http://127.0.0.1:8000/api/';
const MagiamgiaList = () => {

    const [Magiamgia,setMagiamgia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    // hành động mở dialog
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedMagiamgiaId, setSelectedMagiamgiaId] = useState(null);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
// lấy danh sách mã giảm giá
  const fetchMagiamgia = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}magiamgia`);
      if (res.data?.data && Array.isArray(res.data.data)) {
        setMagiamgia(res.data.data);
      } else {
        console.error('Dữ liệu mã giảm giá không đúng định dạng:', res.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy mã giảm giá:', error);
    } finally {
      setLoading(false);
    }
  };
// Handlers: Add
  const handleCloseAdd = () => {
    setAddOpen(false);
  };

  // Handlers: Edit
  const handleEdit = (row) => {
    setSelectedMagiamgiaId(row.id);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedMagiamgiaId(null);
  };

  // Handlers: View
  const handleView = (row) => {
    setSelectedMagiamgiaId(row.id);
    setViewOpen(true);
  };

  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedMagiamgiaId(null);
  };

  // Handlers: Delete
  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}magiamgia/${deleteId}`);
      enqueueSnackbar('Xoá mã giảm giá  thành công!', { variant: 'success' });
      setMagiamgia((prev) => prev.filter((dm) => dm.id !== deleteId));
    } catch (error) {
      if (error.response?.status === 409) {
        enqueueSnackbar(error.response.data.message || 'Không thể xoá do ràng buộc dữ liệu', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Lỗi khi xoá mã giảm giá', { variant: 'error' });
      }
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchMagiamgia();
  }, []);
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'ma', headerName: 'Tên mã giảm giá', flex: 1, minWidth: 150 },
        { field: 'phan_tram_giam', headerName: 'Phần trăm giảm', flex: 1, minWidth: 200 },
        { field: 'ngay_bat_dau', headerName: 'Ngày bắt đầu', width: 150 },
        { field: 'ngay_ket_thuc', headerName: 'Ngày kết thúc', width: 150 },
        { field: 'dieu_kien_ap_dung', headerName: 'Điều kiện áp dụng', width: 150 },
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
              Danh Sách Mã Giảm Giá
            </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Thêm Mã giảm giá
        </Button>
      </Stack>

      <Box sx={{ width: '100%', height: 600, marginTop: 2 }}>
        <DataGrid
          rows={Magiamgia}
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
      <MagiamgiaAdd open={addOpen} onClose={handleCloseAdd} onUpdate={fetchMagiamgia} />
      <MagiamgiaEdit open={editOpen} onClose={handleCloseEdit} MagiamgiaId={selectedMagiamgiaId} onUpdate={fetchMagiamgia} />
      <MagiamgiaView open={viewOpen} onClose={handleCloseView} MagiamgiaId={selectedMagiamgiaId} />
      <ConfirmDeleteDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default MagiamgiaList