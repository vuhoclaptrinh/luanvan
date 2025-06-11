import { Container, Row, Col, Button } from "react-bootstrap"

function HeroSection() {
  return (
    <section
      className="position-relative d-flex align-items-center justify-content-center"
      style={{
        height: "650px",
        backgroundImage: "url(src/assets/img/baner.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "12px",
        overflow: "hidden", 
      }}
    >
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}></div>

      {/* Content */}
      <Container className="position-relative text-center text-white">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h1 className="display-4 fw-bold mb-4">
              Khám phá thế giới
              <span
                className="d-block"
                style={{
                  background: "linear-gradient(to right, #ff8a8a, #da8cff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Nước hoa cao cấp
              </span>
            </h1>
            <p className="lead mb-4">
              Bộ sưu tập nước hoa chính hãng từ các thương hiệu nổi tiếng thế giới. Tìm kiếm hương thơm hoàn hảo cho
              phong cách của bạn.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Button
                variant="primary"
                size="lg"
                style={{
                  background: "linear-gradient(to right, #e83e8c, #6f42c1)",
                  borderColor: "transparent",
                }}
              >
                Khám phá ngay
              </Button>
              <Button variant="outline-light" size="lg">
                Xem bộ sưu tập
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default HeroSection
