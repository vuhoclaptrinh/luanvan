"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap"
import { Save, CheckCircle, AlertCircle } from "lucide-react"
import axios from "axios"
import Header from "../components/Header"
import "./Contact.css"

const API_BASE = "http://127.0.0.1:8000/api/";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    dia_chi: "",
    mat_khau: "", 
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const [nguoiDungId, setNguoiDungId] = useState(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    const sessionUser = userStr ? JSON.parse(userStr) : null;

    const fetchUser = async () => {
      if (!sessionUser?.email) return;
      setStatus((prev) => ({ ...prev, loading: true }));

      try {
        const res = await axios.get(`${API_BASE}khachhang`);
        const found = res.data.data.find(u => u.email === sessionUser.email);

        if (found) {
          setProfileData({
            ho_ten: found.ho_ten || "",
            email: found.email || "",
            so_dien_thoai: found.so_dien_thoai || "",
            dia_chi: found.dia_chi || "",
            mat_khau: "", // không load về
          });
          setNguoiDungId(found.id);
        } else {
          setStatus({ loading: false, success: false, error: "Không tìm thấy người dùng" });
        }
      } catch (err) {
        console.error(err);
        setStatus({ loading: false, success: false, error: "Lỗi khi lấy thông tin người dùng" });
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nguoiDungId) return;

    try {
      setStatus({ loading: true, success: false, error: null });

      // Gửi lên chỉ những trường cần thiết
      const dataToSend = {
        ho_ten: profileData.ho_ten,
        email: profileData.email,
        so_dien_thoai: profileData.so_dien_thoai,
        dia_chi: profileData.dia_chi,
      };

      // ✅ Gửi mật khẩu nếu có nhập
      if (profileData.mat_khau.trim() !== "") {
        dataToSend.mat_khau = profileData.mat_khau;
      }

      await axios.put(`${API_BASE}khachhang/${nguoiDungId}`, dataToSend);

      setStatus({ loading: false, success: true, error: null });
      setProfileData((prev) => ({ ...prev, mat_khau: "" })); // xóa mật khẩu sau khi gửi
      setTimeout(() => setStatus((prev) => ({ ...prev, success: false })), 4000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false, error: "Cập nhật không thành công." });
    }
  };

  return (
    <div className="profile-page">
      <Header />

      <section className="profile-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="profile-card p-4">
                <h2 className="mb-4">Thông Tin Cá Nhân</h2>

                {status.loading && (
                  <Alert variant="info">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang tải hoặc gửi dữ liệu...
                  </Alert>
                )}

                {status.success && (
                  <Alert variant="success" className="d-flex align-items-center">
                    <CheckCircle size={20} className="me-2" />
                    Cập nhật thành công!
                  </Alert>
                )}

                {status.error && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <AlertCircle size={20} className="me-2" />
                    {status.error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và Tên</Form.Label>
                    <Form.Control
                      type="text"
                      name="ho_ten"
                      value={profileData.ho_ten}
                      onChange={handleChange}
                      placeholder="Họ tên của bạn"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="text"
                      name="so_dien_thoai"
                      value={profileData.so_dien_thoai}
                      onChange={handleChange}
                      placeholder="Số điện thoại"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control
                      type="text"
                      name="dia_chi"
                      value={profileData.dia_chi}
                      onChange={handleChange}
                      placeholder="Địa chỉ nhận hàng"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Mật khẩu mới <span className="text-muted">(nếu muốn thay đổi)</span></Form.Label>
                    <Form.Control
                      type="password"
                      name="mat_khau"
                      value={profileData.mat_khau}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" disabled={status.loading}>
                    <Save size={18} className="me-2" />
                    Lưu Thông Tin
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ProfilePage;
