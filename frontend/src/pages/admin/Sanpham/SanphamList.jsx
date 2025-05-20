import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, Stack } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

const SanphamList = () => {
  const [sanpham, setSanpham] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = 'http://127.0.0.1:8000/api/';

  useEffect(() => {
    const fetchSanpham = async () => {
      try {
        const response = await axios.get(`${API}sanpham`);
        if (response.data && Array.isArray(response.data.data)) {
          setSanpham(response.data.data);
        } else {
          console.error("Sai định dạng API:", response.data);
        }
      } catch (error) {
        console.error("Lỗi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSanpham();
  }, []);

  const handleEdit = (row) => {
    console.log("Edit:", row);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`${API}sanpham/${id}`);
        setSanpham(prev => prev.filter(sp => sp.id !== id));
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'ten_san_pham', headerName: 'Tên sản phẩm', width: 200 },
    { field: 'thuong_hieu', headerName: 'Thương hiệu', width: 150 },
    { field: 'mo_ta', headerName: 'Mô tả', width: 250 },
    { field: 'dung_tich', headerName: 'Dung tích', width: 100 },
    { field: 'gia', headerName: 'Giá (VND)', width: 150 },
    { field: 'so_luong_ton', headerName: 'Tồn kho', width: 100 },
    {
      field: 'hinh_anh',
      headerName: 'Hình ảnh',
      width: 120,
      renderCell: (params) => (
        <img
          src={`http://127.0.0.1:8000/storage/images/${params.value}`}
          alt="ảnh sản phẩm"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
    },
    { field: 'danh_muc_id', headerName: 'Danh mục ID', width: 120 },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 180,
      
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(params.row)} variant="outlined">
            Sửa
          </Button>
          <Button size="small" color="error"   startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row.id)} variant="outlined">
            Xóa
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}> 
    
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">
      Danh Sách Sản Phẩm
    </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => console.log("Thêm sản phẩm")}>
          Thêm sản phẩm
        </Button>
      </Stack>

      <Box sx={{ flexGrow: 1 }}>
        <DataGrid
          rows={sanpham}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default SanphamList;
