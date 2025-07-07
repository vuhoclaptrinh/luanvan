import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Grid,
  Stack,
} from "@mui/material";

import axios from "axios";

import CategoryIcon from "@mui/icons-material/Category";

const API_BASE = "http://127.0.0.1:8000/api/";

const InfoRow = ({ label, value }) => (
  <Box display="flex" mb={1}>
    <Typography sx={{ width: 130, fontWeight: "600", color: "text.secondary" }}>
      {label}:
    </Typography>
    <Typography sx={{ wordBreak: "break-word" }}>{value}</Typography>
  </Box>
);

const DanhmucView = ({ open, onClose, DanhmucId }) => {
  const [danhmuc, setDanhmuc] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (open && DanhmucId) {
      setLoading(true);
      axios
        .get(`${API_BASE}danhmuc/${DanhmucId}`)
        .then((res) => {
          setDanhmuc(res.data.data || res.data);
        })
        .catch(() => {
          setDanhmuc(null);
        })
        .finally(() => setLoading(false));
    } else {
      setDanhmuc(null);
    }
  }, [open, DanhmucId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "#1976d2",
          color: "white",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: 20,
        }}
      >
        <CategoryIcon fontSize="large" />
        Chi tiết danh mục
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: "#f9f9f9" }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={180}
          >
            <CircularProgress />
          </Box>
        ) : danhmuc ? (
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 2, backgroundColor: "white" }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {danhmuc.ten_danh_muc}
                </Typography>

                <Box>
                  <InfoRow label="ID" value={danhmuc.id} />
                  <InfoRow label="Mô tả" value={danhmuc.mo_ta || "N/A"} />
                </Box>

                {danhmuc.sanphams?.length > 0 && (
                  <Box mt={4}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={1}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Sản phẩm thuộc danh mục ({danhmuc.sanphams.length})
                      </Typography>
                    </Stack>

                    {danhmuc.sanphams.map((sp) => (
                      <Box
                        key={sp.id}
                        display="flex"
                        gap={2}
                        mb={1}
                        px={1}
                        py={0.75}
                        sx={{
                          borderBottom: "1px solid #e0e0e0",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            width: 80,
                            fontWeight: "600",
                            color: "text.secondary",
                          }}
                        >
                          ID: {sp.id}
                        </Typography>
                        <Typography sx={{ fontWeight: "500" }}>
                          {sp.ten_san_pham}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Typography align="center" color="error" sx={{ py: 5 }}>
            Không tìm thấy dữ liệu danh mục.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary" fullWidth>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DanhmucView;
