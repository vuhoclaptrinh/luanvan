import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Typography,
  Stack,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ConfirmDeleteDialog from "../../../components/cfdelete";
import { enqueueSnackbar } from "notistack";

import SanphamEdit from "./SanphamEdit";
import SanphamAdd from "./SanphamAdd";
import SanphamView from "./SanphamView";

const API_BASE = "http://127.0.0.1:8000/api/";

const SanphamList = () => {
  const [sanpham, setSanpham] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedSanphamId, setSelectedSanphamId] = useState(null);

  // xác nhận delete
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Lọc
  const [danhMucMap, setDanhMucMap] = useState({});
  const [selectedDanhMuc, setSelectedDanhMuc] = useState("");
  const [searchText, setSearchText] = useState("");

  // Phân trang
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchSanpham = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}sanpham`);
      if (res.data?.data && Array.isArray(res.data.data)) {
        console.log("Sanpham data:", res.data.data);
        setSanpham(res.data.data);
      } else {
        console.error("Dữ liệu sản phẩm không đúng định dạng:", res.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDanhMuc = async () => {
    try {
      const res = await axios.get(`${API_BASE}danhmuc`);
      if (res.data?.data && Array.isArray(res.data.data)) {
        const map = {};
        res.data.data.forEach((dm) => {
          map[dm.id] = dm.ten_danh_muc;
        });
        setDanhMucMap(map);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  useEffect(() => {
    fetchDanhMuc();
    fetchSanpham();
  }, []);

  const handleEdit = (row) => {
    setSelectedSanphamId(row.id);
    setEditOpen(true);
  };

  const handleView = (row) => {
    setSelectedSanphamId(row.id);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}sanpham/${deleteId}`);
      enqueueSnackbar("Xoá sản phẩm thành công!", { variant: "success" });
      setSanpham((prev) => prev.filter((sp) => sp.id !== deleteId));
    } catch (error) {
      if (error.response?.status === 409) {
        enqueueSnackbar(
          error.response.data.message || "Không thể xoá do ràng buộc dữ liệu",
          {
            variant: "error",
          }
        );
      } else enqueueSnackbar("Xóa thất bại!", { variant: "error" });
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedSanphamId(null);
  };

  const handleCloseAdd = () => {
    setAddOpen(false);
  };

  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedSanphamId(null);
  };

  const sanphamFiltered = sanpham.filter((sp) => {
    const matchSearch = sp.ten_san_pham
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchThuongHieu = sp.thuong_hieu
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchDanhMuc = selectedDanhMuc
      ? sp.danh_muc_id === parseInt(selectedDanhMuc)
      : true;
    return (matchSearch || matchThuongHieu) && matchDanhMuc;
  });

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "ten_san_pham", headerName: "Tên sản phẩm", width: 200 },
    { field: "thuong_hieu", headerName: "Thương hiệu", width: 150 },
    { field: "mo_ta", headerName: "Mô tả", width: 200 },
    {
      field: "dung_tich",
      headerName: "Dung tích | Giá | SL tồn",
      width: 260,
      renderCell: (params) => {
        if (!params.row.variants || params.row.variants.length === 0)
          return "Không có biến thể";
        return (
          <Box>
            {params.row.variants.map((v, idx) => (
              <Typography key={idx} variant="body2">
                {v.dung_tich}: {parseInt(v.gia).toLocaleString("vi-VN")} ₫ — SL:{" "}
                {v.so_luong_ton}
              </Typography>
            ))}
          </Box>
        );
      },
    },

    {
      field: "hinh_anh",
      headerName: "Hình ảnh",
      width: 120,
      renderCell: (params) => {
        if (!params.value) return null;
        let imagePath = params.value;
        if (imagePath.startsWith("images/")) {
          imagePath = imagePath.replace(/^images\//, "");
        }
        const url = imagePath.startsWith("http")
          ? imagePath
          : `http://127.0.0.1:8000/storage/images/${imagePath}`;
        return (
          <img
            src={url}
            alt="ảnh sản phẩm"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: "danh_muc_id",
      headerName: "Danh mục",
      width: 150,
      renderCell: (params) => danhMucMap[params.value] || "Không xác định",
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 250,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={() => handleView(params.row)}
            title="Xem chi tiết"
          >
            <VisibilityIcon fontSize="small" />
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            onClick={() => handleEdit(params.row)}
            title="Chỉnh sửa"
          >
            <EditIcon fontSize="small" />
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            title="Xóa"
          >
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
        Danh Sách Sản Phẩm
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        mb={2}
        flexWrap="wrap"
      >
        <TextField
          label="Tìm kiếm theo tên"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <TextField
          select
          label="Lọc theo danh mục"
          size="small"
          value={selectedDanhMuc}
          onChange={(e) => setSelectedDanhMuc(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">Tất Cả</MenuItem>
          {Object.entries(danhMucMap).map(([id, name]) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ whiteSpace: "nowrap" }}
        >
          Thêm sản phẩm
        </Button>
      </Stack>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={sanphamFiltered}
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
      <SanphamAdd
        open={addOpen}
        onClose={handleCloseAdd}
        onUpdate={fetchSanpham}
      />
      <SanphamEdit
        open={editOpen}
        onClose={handleCloseEdit}
        sanphamId={selectedSanphamId}
        onUpdate={fetchSanpham}
      />
      <SanphamView
        open={viewOpen}
        onClose={handleCloseView}
        sanphamId={selectedSanphamId}
      />
      <ConfirmDeleteDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default SanphamList;
