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


import NguoidungView from './NguoidungView';
import NguoidungEdit from './NguoidungEdit';

const API_BASE = 'http://127.0.0.1:8000/api/';


const NguoidungList = () => {
    const [Nguoidung,setNguoidung   ] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    // hành động mở dialog
    const [editOpen, setEditOpen] = useState(false);
    // const [addOpen, setAddOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedNguoidungId, setSelectedNguoidungId] = useState(null);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

const fetchNguoidung   = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}khachhang`);
      if (res.data?.data && Array.isArray(res.data.data)) {
        setNguoidung(res.data.data);
      } else {
        console.error('Dữ liệu người dùng không đúng định dạng:', res.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy người dùng:', error);
    } finally {
      setLoading(false);
    }
  };
// // Handlers: Add
//   const handleCloseAdd = () => {
//     setAddOpen(false);
//   };

  // Handlers: Edit
  const handleEdit = (row) => {
    setSelectedNguoidungId(row.id);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedNguoidungId(null);
  };

  // Handlers: View
  const handleView = (row) => {
    setSelectedNguoidungId(row.id);
    setViewOpen(true);
  };

  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedNguoidungId(null);
  };

  // Handlers: Delete
  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}khachhang/${deleteId}`);
      enqueueSnackbar('Xoá người dùng thành công!', { variant: 'success' });
      setNguoidung((prev) => prev.filter((dm) => dm.id !== deleteId));
    } catch (error) {
      if (error.response?.status === 409) {
        enqueueSnackbar(error.response.data.message || 'Không thể xoá do ràng buộc dữ liệu', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Lỗi khi xoá người dùng', { variant: 'error' });
      }
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchNguoidung();
  }, []);
 const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'ho_ten', headerName: 'Họ tên', flex: 1, minWidth: 150 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
        { field: 'mat_khau', headerName: 'Mật khẩu', width: 150 },
        { field: 'so_dien_thoai', headerName: 'Số điện thoại', width: 150 },
        { field: 'dia_chi', headerName: 'Địa chỉ', width: 150 },
        {
        field: 'role',
        headerName: 'Chức vụ',
        width: 150,
        renderCell: (params) => {
            const role = params.row?.role;
            return (
            <span style={{ color: role === 1 ? 'red' : 'blue', fontWeight: 'bold' }}>
                {role === 1 ? 'Admin' : 'Người dùng'}
            </span>
            );
        }
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
      <Typography variant="h4" gutterBottom>
        Danh sách Người dùng
      </Typography>
{/* 
      <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Thêm Người dùng
        </Button>
      </Stack> */}

      <Box sx={{ width: '100%', height: 600, marginTop: 2 }}>
        <DataGrid
          rows={Nguoidung}
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
      {/* <NguoidungAdd open={addOpen} onClose={handleCloseAdd} onUpdate={fetchNguoidung} /> */}
      <NguoidungEdit open={editOpen} onClose={handleCloseEdit} NguoidungId={selectedNguoidungId} onUpdate={fetchNguoidung} />
      <NguoidungView open={viewOpen} onClose={handleCloseView} NguoidungId={selectedNguoidungId} />
      <ConfirmDeleteDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );

};

export default NguoidungList