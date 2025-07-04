"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Container, Row, Col, Card, Form, Button, Alert, Nav, InputGroup } from "react-bootstrap"
import { Eye, EyeOff, User, Mail, Lock, LogIn, UserPlus, ArrowLeft } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"
import Logo from "../assets/img/logo.jpg"
import "./Login.css"

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState("login")
  const [formData, setFormData] = useState({
    email: "",
    mat_khau: "",
    confirm_password: "",
    ho_ten: "",
  })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/home"

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setError("")
    setFormData({ email: "", mat_khau: "", confirm_password: "", ho_ten: "" })
    setShowPassword(false)
    setValidated(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setValidated(true)

    if (form.checkValidity() === false) {
      e.stopPropagation()
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email: formData.email,
        mat_khau: formData.mat_khau,
      })

      const user = response.data.user
      if (user) {
        sessionStorage.setItem("user", JSON.stringify(user))
        toast.success("Đăng nhập thành công!")

        if (user.role === 1) {
          navigate("/thongke")
          toast.info("Chào mừng Admin!")
        } else {
          navigate(from)
          toast.info("Chào mừng bạn quay trở lại!")
        }
      } else {
        setError("Đăng nhập thất bại!")
      }
    } catch (error) {
      console.error(error)
      setError("Email hoặc mật khẩu không đúng!")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setValidated(true)

    if (form.checkValidity() === false) {
      e.stopPropagation()
      return
    }

    setError("")
    setLoading(true)
    if (formData.mat_khau !== formData.confirm_password) {
      setError("Mật khẩu xác nhận không khớp.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/khachhang/register", {
        ho_ten: formData.ho_ten,
        email: formData.email,
        mat_khau: formData.mat_khau,
      })

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.")
      setActiveTab("login")
      setFormData({ email: formData.email, mat_khau: "", ho_ten: "" })
      setValidated(false)
    } catch (error) {
      console.error(error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError("Có lỗi xảy ra khi đăng ký!")
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>

      <Container className="auth-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={5} md={7} sm={9}>
            <Card className="auth-card">
              {/* Header */}
              <div className="auth-header">
                <div className="auth-logo">
                  <img src={Logo || "/placeholder.svg"} alt="PerfumeShop Logo" className="logo-image" />
                </div>
                <h1 className="auth-title">PerfumeShop</h1>
                <p className="auth-subtitle">Hệ thống nước hoa cao cấp</p>
              </div>

              {/* Navigation Tabs */}
              <div className="auth-tabs">
                <Nav variant="pills" className="auth-nav">
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "login"}
                      onClick={() => handleTabChange("login")}
                      className="auth-nav-link"
                    >
                      <LogIn size={18} className="me-2" />
                      Đăng nhập
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "register"}
                      onClick={() => handleTabChange("register")}
                      className="auth-nav-link"
                    >
                      <UserPlus size={18} className="me-2" />
                      Đăng ký
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              {/* Content */}
              <div className="auth-content">
                {error && (
                  <Alert variant="danger" className="auth-alert">
                    {error}
                  </Alert>
                )}

                {/* Login Form */}
                {activeTab === "login" && (
                  <Form noValidate validated={validated} onSubmit={handleLogin} className="auth-form">
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <Mail size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Nhập email của bạn"
                          required
                        />
                        <Form.Control.Feedback type="invalid">Vui lòng nhập email hợp lệ.</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Mật khẩu</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <Lock size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="mat_khau"
                          value={formData.mat_khau}
                          onChange={handleInputChange}
                          placeholder="Nhập mật khẩu"
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            togglePasswordVisibility();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="password-toggle"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                        <Form.Control.Feedback type="invalid">Vui lòng nhập mật khẩu.</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <div className="text-end mb-3">
                    <Button variant="link" className="p-0 text-primary" onClick={() => navigate("/forgot-password")}>
                      Quên mật khẩu?
                    </Button>
                  </div>

                    <Button type="submit" className="auth-submit-btn" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Đang đăng nhập...
                        </>
                      ) : (
                        <>
                          <LogIn size={18} className="me-2" />
                          Đăng nhập
                        </>
                      )}
                    </Button>
                  </Form>
                )}

                {/* Register Form */}
                {activeTab === "register" && (
                  <Form noValidate validated={validated} onSubmit={handleRegister} className="auth-form">
                    <Form.Group className="mb-3">
                      <Form.Label>Họ tên</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <User size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="ho_ten"
                          value={formData.ho_ten}
                          onChange={handleInputChange}
                          placeholder="Nhập họ tên của bạn"
                          required
                        />
                        <Form.Control.Feedback type="invalid">Vui lòng nhập họ tên.</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <Mail size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Nhập email của bạn"
                          required
                        />
                        <Form.Control.Feedback type="invalid">Vui lòng nhập email hợp lệ.</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Mật khẩu</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <Lock size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="mat_khau"
                          value={formData.mat_khau}
                          onChange={handleInputChange}
                          placeholder="Nhập mật khẩu"
                          required
                          minLength={6}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={togglePasswordVisibility}
                          className="password-toggle"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                        <Form.Control.Feedback type="invalid">Mật khẩu phải có ít nhất 6 ký tự.</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Xác nhận mật khẩu</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <Lock size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleInputChange}
                          placeholder="Nhập lại mật khẩu"
                          required
                          isInvalid={validated && formData.confirm_password !== formData.mat_khau}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={togglePasswordVisibility}
                          className="password-toggle"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                        <Form.Control.Feedback type="invalid">Mật khẩu xác nhận không khớp.</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>


                    <Button type="submit" className="auth-submit-btn" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Đang đăng ký...
                        </>
                      ) : (
                        <>
                          <UserPlus size={18} className="me-2" />
                          Đăng ký
                        </>
                      )}
                    </Button>
                  </Form>
                )}
              </div>

              {/* Footer */}
              <div className="auth-footer">
                <div className="auth-divider">
                  <span>© 2025 PerfumeShop</span>
                </div>
                <p className="auth-footer-text">Hệ thống nước hoa chuyên nghiệp</p>
                <Button variant="link" className="back-to-home" onClick={() => navigate("/home")}>
                  <ArrowLeft size={16} className="me-1" />
                  Quay về trang chủ
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default LoginRegister
