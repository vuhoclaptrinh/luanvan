"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Badge } from "react-bootstrap"
import { Star, Award, Truck, Shield, Heart, Sparkles, MapPin, Phone, Mail } from "lucide-react"
import Header from "../components/Header"

import "./About.css"    
import Footer from "./Footer"

const AboutPage = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    brands: 0,
    rating: 0,
  })

  useEffect(() => {
    // Animate stats on component mount
    const animateStats = () => {
      const targets = { customers: 10000, products: 500, brands: 50, rating: 4.9 }
      const duration = 2000
      const steps = 60
      const stepTime = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setStats({
          customers: Math.floor(targets.customers * progress),
          products: Math.floor(targets.products * progress),
          brands: Math.floor(targets.brands * progress),
          rating: Math.floor(targets.rating * progress * 10) / 10,
        })

        if (currentStep >= steps) {
          clearInterval(timer)
          setStats(targets)
        }
      }, stepTime)
    }

    animateStats()
  }, [])

  return (
    <div className="about-page">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2">
                Established 2025
              </Badge>
              <h1 className="hero-title">PerfumeShop</h1>
              <p className="hero-subtitle">LUXURY FRAGRANCE</p>
              <div className="hero-divider"></div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="about-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="section-title">Về Chúng Tôi</h2>
              <p className="about-text">
                PerfumeShop là điểm đến hàng đầu cho những tín đồ yêu thích nước hoa cao cấp. Với hơn 4 năm kinh nghiệm
                trong ngành, chúng tôi tự hào mang đến những chai nước hoa chính hãng từ các thương hiệu danh tiếng thế
                giới.
              </p>
              <p className="about-text">
                Sứ mệnh của chúng tôi là giúp mỗi khách hàng tìm được mùi hương hoàn hảo, thể hiện cá tính và phong cách
                riêng biệt của bản thân.
              </p>
              <div className="rating-section">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star-filled" size={20} />
                  ))}
                </div>
                <span className="rating-text">4.9/5 từ 2,500+ đánh giá</span>
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-image-container">
                <img
                  src="src/assets/img/logo.jpg"
                  alt="Luxury perfume collection"
                  className="about-image"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Tầm Nhìn & Sứ Mệnh</h2>
              <p className="section-subtitle">Chúng tôi cam kết mang đến trải nghiệm mua sắm nước hoa tuyệt vời nhất</p>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="mission-card h-100">
                <Card.Body className="p-4">
                  <div className="mission-header">
                    <div className="mission-icon mission-icon-rose">
                      <Heart size={24} />
                    </div>
                    <h3 className="mission-title">Sứ Mệnh</h3>
                  </div>
                  <p className="mission-text">
                    Mang đến những chai nước hoa chính hãng, chất lượng cao với giá cả hợp lý. Tư vấn tận tâm giúp khách
                    hàng tìm được mùi hương phù hợp nhất với cá tính và sở thích.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="mission-card h-100">
                <Card.Body className="p-4">
                  <div className="mission-header">
                    <div className="mission-icon mission-icon-purple">
                      <Sparkles size={24} />
                    </div>
                    <h3 className="mission-title">Tầm Nhìn</h3>
                  </div>
                  <p className="mission-text">
                    Trở thành cửa hàng nước hoa hàng đầu Việt Nam, được khách hàng tin tưởng và lựa chọn bởi sự chuyên
                    nghiệp, chất lượng sản phẩm và dịch vụ xuất sắc.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section className="features-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Tại Sao Chọn PerfumeShop?</h2>
              <p className="section-subtitle">Những lý do khiến khách hàng tin tưởng và yêu thích chúng tôi</p>
            </Col>
          </Row>

          <Row>
            <Col lg={3} md={6} className="mb-4">
              <Card className="feature-card h-100 text-center">
                <Card.Body className="p-4">
                  <div className="feature-icon feature-icon-green">
                    <Shield size={32} />
                  </div>
                  <h3 className="feature-title">100% Chính Hãng</h3>
                  <p className="feature-text">Cam kết tất cả sản phẩm đều chính hãng, có tem phụ và hóa đơn đầy đủ</p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <Card className="feature-card h-100 text-center">
                <Card.Body className="p-4">
                  <div className="feature-icon feature-icon-blue">
                    <Truck size={32} />
                  </div>
                  <h3 className="feature-title">Giao Hàng Nhanh</h3>
                  <p className="feature-text">Giao hàng toàn quốc trong 1-3 ngày, đóng gói cẩn thận và an toàn</p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <Card className="feature-card h-100 text-center">
                <Card.Body className="p-4">
                  <div className="feature-icon feature-icon-purple">
                    <Award size={32} />
                  </div>
                  <h3 className="feature-title">Tư Vấn Chuyên Nghiệp</h3>
                  <p className="feature-text">Đội ngũ tư vấn giàu kinh nghiệm, hiểu biết sâu về nước hoa</p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <Card className="feature-card h-100 text-center">
                <Card.Body className="p-4">
                  <div className="feature-icon feature-icon-rose">
                    <Heart size={32} />
                  </div>
                  <h3 className="feature-title">Dịch Vụ Tận Tâm</h3>
                  <p className="feature-text">Hỗ trợ khách hàng 24/7, đổi trả dễ dàng trong 7 ngày</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <Container>
          <Row className="text-center">
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <div className="stat-number">{stats.customers.toLocaleString()}+</div>
                <div className="stat-label">Khách Hàng Hài Lòng</div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <div className="stat-number">{stats.products}+</div>
                <div className="stat-label">Sản Phẩm Đa Dạng</div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <div className="stat-number">{stats.brands}+</div>
                <div className="stat-label">Thương Hiệu Nổi Tiếng</div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <div className="stat-number">{stats.rating}/5</div>
                <div className="stat-label">Đánh Giá Trung Bình</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <Footer />
    </div>
  )
}

export default AboutPage