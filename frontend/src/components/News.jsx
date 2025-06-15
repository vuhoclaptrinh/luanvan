import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap"

function Newsletter() {
  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(to right, #e83e8c, #6f42c1)",
        color: "white",
      }}
    >
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <h2 className="display-6 fw-bold mb-3">Đăng ký nhận tin tức mới nhất</h2>
            <p className="mb-4 color-red" >Nhận thông báo về sản phẩm mới, ưu đãi đặc biệt và các mẹo chăm sóc nước hoa</p>
            <InputGroup className="mb-3">
              <Form.Control placeholder="Nhập email của bạn" aria-label="Email" className="bg-white" />
              <Button variant="light">Đăng ký ngay</Button>
            </InputGroup>
            <p className="small opacity-75">Chúng tôi cam kết bảo mật thông tin của bạn và không spam</p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Newsletter
