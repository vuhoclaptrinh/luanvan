import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';


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
                    setSanpham([]);
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

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'ten_san_pham', headerName: 'Tên sản phẩm', width: 200 },
        { field: 'thuong_hieu', headerName: 'Thương hiệu', width: 150 },
        { field: 'mo_ta', headerName: 'Mô tả', width: 250 },
        { field: 'dung_tich', headerName: 'Dung tích', width: 100 },
        {
            field: 'gia',
            headerName: 'Giá (VND)',
            width: 150,
            
        },
        { field: 'so_luong_ton', headerName: 'Tồn kho', width: 100 },
        {
            field: 'hinh_anh',
            headerName: 'Hình ảnh',
            width: 150,
            renderCell: (params) => (
                <img
                    src={`http://127.0.0.1:8000/storage/images/${params.value}`}
                    alt={params.value}
                    style={{ width: '50px', height: '50px' }}
                />
            ),
        },
        { field: 'danh_muc_id', headerName: 'Danh mục ID', width: 120 },
    ];

    return (
        <Box sx={{ height: 500, width: '100%', p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Danh Sách Sản Phẩm
            </Typography>
            <DataGrid
                rows={sanpham}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                loading={loading}
                disableSelectionOnClick
            />
        </Box>
    );
};

export default SanphamList;
