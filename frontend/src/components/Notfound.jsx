import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate(); // Hook để chuyển hướng

  const handleGoHome = () => {
    navigate('/'); // Chuyển về trang chủ
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404</h1>
      <h2>Không tìm thấy trang</h2>
      <p>Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.</p>
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Quay lại trang chủ
      </Button>
    </div>
  );
};

export default NotFound;
