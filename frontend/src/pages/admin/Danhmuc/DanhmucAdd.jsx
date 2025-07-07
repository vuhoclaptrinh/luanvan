import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const API = "http://127.0.0.1:8000/api/danhmuc";

const DanhmucAdd = ({ open, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    ten_danh_muc: "",
    mo_ta: "",
  });

  const [loading, setLoading] = useState(false);

  // tạo lại form
  useEffect(() => {
    if (!open) return;
    setFormData({ ten_danh_muc: "", mo_ta: "" });
  }, [open]);

  // Cập nhật
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // thêm mới danh mục
  const handleSubmit = async () => {
    if (!formData.ten_danh_muc.trim()) {
      enqueueSnackbar("Tên danh mục không được để trống!", {
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(API, formData);
      enqueueSnackbar("Thêm danh mục thành công!", { variant: "success" });
      onClose();
      onUpdate();
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      enqueueSnackbar("Thêm thất bại , tên trùng!", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm danh mục</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            name="ten_danh_muc"
            label="Tên danh mục"
            fullWidth
            required
            value={formData.ten_danh_muc}
            onChange={handleChange}
          />
          <TextField
            name="mo_ta"
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={formData.mo_ta}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DanhmucAdd;
