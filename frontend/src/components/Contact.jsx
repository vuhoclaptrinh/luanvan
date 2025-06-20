"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react"
import Header from "../components/Header"
import "./Contact.css"

const ContactPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null,
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Vui lòng nhập tiêu đề"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung tin nhắn"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Tin nhắn phải có ít nhất 10 ký tự"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setFormStatus({ loading: true, success: false, error: null })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real app, you would make an actual API call:
      // await axios.post('/api/contact', formData)

      setFormStatus({ loading: false, success: true, error: null })
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.",
      })
    }
  }

  useEffect(() => {
    if (formStatus.success) {
      const timer = setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, success: false }))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [formStatus.success])

  return (
    <div className="contact-page">
      <Header />

      {/* Hero Section */}
      <section className="contact-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="hero-title">Liên Hệ Với Chúng Tôi</h1>
              <p className="hero-subtitle">Chúng tôi luôn sẵn sàng hỗ trợ bạn tìm được mùi hương hoàn hảo</p>
              <div className="hero-divider"></div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form & Info */}
      <section className="contact-content py-5">
        <Container>
          <Row>
            {/* Contact Form */}
            <Col lg={8} className="mb-5">
              <Card className="contact-form-card">
                <Card.Body className="p-4">
                  <h2 className="form-title">Gửi Tin Nhắn Cho Chúng Tôi</h2>
                  <p className="form-subtitle">Điền thông tin bên dưới và chúng tôi sẽ phản hồi trong vòng 24 giờ</p>

                  {formStatus.success && (
                    <Alert variant="success" className="d-flex align-items-center">
                      <CheckCircle size={20} className="me-2" />
                      Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
                    </Alert>
                  )}

                  {formStatus.error && (
                    <Alert variant="danger" className="d-flex align-items-center">
                      <AlertCircle size={20} className="me-2" />
                      {formStatus.error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Họ và Tên *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            isInvalid={!!errors.name}
                            placeholder="Nhập họ và tên của bạn"
                          />
                          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            isInvalid={!!errors.email}
                            placeholder="Nhập địa chỉ email"
                          />
                          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Số Điện Thoại *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            isInvalid={!!errors.phone}
                            placeholder="Nhập số điện thoại"
                          />
                          <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tiêu Đề *</Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            isInvalid={!!errors.subject}
                            placeholder="Tiêu đề tin nhắn"
                          />
                          <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label>Nội Dung *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        isInvalid={!!errors.message}
                        placeholder="Nhập nội dung tin nhắn của bạn..."
                      />
                      <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" className="submit-btn" disabled={formStatus.loading}>
                      {formStatus.loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send size={18} className="me-2" />
                          Gửi Tin Nhắn
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Info */}
            <Col lg={4}>
              <div className="contact-info">
                <Card className="info-card mb-4">
                  <Card.Body className="p-4">
                    <h3 className="info-title">Thông Tin Liên Hệ</h3>

                    <div className="info-item">
                      <div className="info-icon">
                        <MapPin size={20} />
                      </div>
                      <div className="info-content">
                        <h4>Địa Chỉ Cửa Hàng</h4>
                        <p>
                          180 Đường Cao Lỗ
                          <br />
                          Quận 8, TP. Hồ Chí Minh
                        </p>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <Phone size={20} />
                      </div>
                      <div className="info-content">
                        <h4>Hotline</h4>
                        <p>
                          0123 456 789
                          <br />
                          0987 654 321
                        </p>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <Mail size={20} />
                      </div>
                      <div className="info-content">
                        <h4>Email</h4>
                        <p>
                          info@perfumeshop.vn
                          <br />
                          support@perfumeshop.vn
                        </p>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <Clock size={20} />
                      </div>
                      <div className="info-content">
                        <h4>Giờ Mở Cửa</h4>
                        <p>
                          Thứ 2 - Thứ 6: 9:00 - 21:00
                          <br />
                          Thứ 7 - CN: 9:00 - 22:00
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Social Media */}
                <Card className="social-card">
                  <Card.Body className="p-4 text-center">
                    <h3 className="social-title">Kết Nối Với Chúng Tôi</h3>
                    <div className="social-links">
                      <a href="#" className="social-link facebook">
                        <Facebook size={24} />
                      </a>
                      <a href="#" className="social-link instagram">
                        <Instagram size={24} />
                      </a>
                      <a href="#" className="social-link zalo">
                        <MessageCircle size={24} />
                      </a>
                    </div>
                    <p className="social-text">Theo dõi chúng tôi để cập nhật những sản phẩm mới nhất</p>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <Container fluid className="p-0">
          <div className="map-container">
            <iframe
               src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15676.321232773546!2d106.678469!3d10.738423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1718877650000!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PerfumeShop Location"
            ></iframe>
            <div className="map-overlay">
              <div className="map-info">
                <h4>PerfumeShop</h4>
                <p>180 Đường Cao Lỗ, Phường 4, Quận 8, TP.HCM</p>
                <Button variant="outline-light" size="sm">
                  <MapPin size={16} className="me-1" />
                  Xem Đường Đi
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
export default ContactPage
