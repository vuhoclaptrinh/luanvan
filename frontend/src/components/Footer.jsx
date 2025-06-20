import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap"
import Logo from  '../assets/img/logo.jpg';

function Footer() {
  return (
    <footer className="bg-light border-top mt-5">
      <Container className="py-5">
        <Row className="gy-4">
          {/* thương hiệu */}
          <Col xs={12} md={6} lg={3}>
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <img
                  src={Logo}
                  alt="Logo"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
                
                <span className="ms-2 fs-4 fw-bold">PerfumeShop</span>
              </div>
              <p className="text-muted small">
                Chuyên cung cấp nước hoa chính hãng từ các thương hiệu nổi tiếng thế giới với giá cả hợp lý.
              </p>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" size="sm" className="rounded-circle p-1">
                  <i className="bi bi-facebook"></i>
                </Button>
                <Button variant="outline-secondary" size="sm" className="rounded-circle p-1">
                  <i className="bi bi-instagram"></i>
                </Button>
                <Button variant="outline-secondary" size="sm" className="rounded-circle p-1">
                  <i className="bi bi-twitter"></i>
                </Button>
                <Button variant="outline-secondary" size="sm" className="rounded-circle p-1">
                  <i className="bi bi-youtube"></i>
                </Button>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="fw-bold mb-3">Liên kết nhanh</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/about" className="text-decoration-none text-muted">
                  Về chúng tôi
                </a>
              </li>
              <li className="mb-2">
                <a href="/products" className="text-decoration-none text-muted">
                  Sản phẩm
                </a>
              </li>
              <li className="mb-2">
                <a  className="text-decoration-none text-muted">
                  Thương hiệu
                </a>
              </li>
              <li className="mb-2">
                <a  className="text-decoration-none text-muted">
                  Blog
                </a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="text-decoration-none text-muted">
                  Liên hệ
                </a>
              </li>
            </ul>
          </Col>

          {/* Customer Service */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="fw-bold mb-3">Hỗ trợ khách hàng</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/shipping" className="text-decoration-none text-muted">
                  Chính sách vận chuyển
                </a>
              </li>
              <li className="mb-2">
                <a href="/returns" className="text-decoration-none text-muted">
                  Đổi trả hàng
                </a>
              </li>
              <li className="mb-2">
                <a href="/warranty" className="text-decoration-none text-muted">
                  Bảo hành
                </a>
              </li>
              <li className="mb-2">
                <a href="/privacy" className="text-decoration-none text-muted">
                  Chính sách bảo mật
                </a>
              </li>
              <li className="mb-2">
                <a href="/terms" className="text-decoration-none text-muted">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="fw-bold mb-3">Thông tin liên hệ</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-geo-alt text-muted me-2"></i>
                <span>180 Cao lỗ, Quận 8, TP.HCM</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-telephone text-muted me-2"></i>
                <span>0965765861</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-envelope text-muted me-2"></i>
                <span>info@perfumeshop.com</span>
              </li>
            </ul>
            <div className="mt-3">
              <p className="mb-1 fw-medium">Giờ làm việc:</p>
              <p className="text-muted small">Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
            </div>
          </Col>
        </Row>

        {/* Newsletter
        <div className="border-top pt-4 mt-4">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <div className="text-center">
                <h5 className="fw-bold mb-3">Đăng ký nhận tin</h5>
                <p className="text-muted small mb-3">Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt</p>
                <InputGroup className="mb-3">
                  <Form.Control placeholder="Nhập email của bạn" aria-label="Email" />
                  <Button variant="primary">Đăng ký</Button>
                </InputGroup>
              </div>
            </Col>
          </Row>
        </div> */}

        {/* Copyright */}
        <div className="border-top pt-4 mt-4 text-center">
          <p className="text-muted small">© 2025 PerfumeShop..</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
