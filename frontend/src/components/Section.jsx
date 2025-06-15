
import { useState, useEffect } from "react"
import { Container, Row, Col, Button } from "react-bootstrap"

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Danh sách hình ảnh cho carousel
  const heroImages = [
    {
      src: "src/assets/img/baner.png",
      title: "Khám phá thế giới",
      subtitle: "Nước hoa cao cấp",
      description:
        "Bộ sưu tập nước hoa chính hãng từ các thương hiệu nổi tiếng thế giới. Tìm kiếm hương thơm hoàn hảo cho phong cách của bạn.",
    },
    {
      
      src: "src/assets/img/logo1.png",
      title: "Hương thơm quyến rũ",
      subtitle: "Dành cho phái đẹp",
      description: "Khám phá những mùi hương nữ tính, quyến rũ và đầy mê hoặc từ các thương hiệu danh tiếng.",
    },
    {
      src: "src/assets/img/logo2.png",
      title: "Phong cách nam tính",
      subtitle: "Mạnh mẽ & cuốn hút",
      description: "Bộ sưu tập nước hoa nam với hương thơm mạnh mẽ, nam tính và đầy cuốn hút.",
    },
  ]

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  // }

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  // }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const currentImage = heroImages[currentSlide]

  return (
    <section
      className="position-relative d-flex align-items-center justify-content-center"
      style={{
        height: "650px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: index === currentSlide ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            zIndex: 1,
          }}
        />
      ))}

      {/* Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 2,
        }}
      />

      {/* Navigation Arrows */}
      {/* <button
        className="position-absolute start-0 top-50 translate-middle-y btn btn-link text-white p-3"
        onClick={prevSlide}
        style={{
          zIndex: 4,
          fontSize: "2rem",
          marginLeft: "20px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          border: "2px solid rgba(255,255,255,0.3)",
          transition: "all 0.3s ease",
        }} 
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255,255,255,0.2)"
          e.target.style.transform = "scale(1.1)"
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255,255,255,0.1)"
          e.target.style.transform = "scale(1)"
        }}
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      <button
        className="position-absolute end-0 top-50 translate-middle-y btn btn-link text-white p-3"
        onClick={nextSlide}
        style={{
          zIndex: 4,
          fontSize: "2rem",
          marginRight: "20px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          border: "2px solid rgba(255,255,255,0.3)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255,255,255,0.2)"
          e.target.style.transform = "scale(1.1)"
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255,255,255,0.1)"
          e.target.style.transform = "scale(1)"
        }}
      >
        <i className="bi bi-chevron-right"></i>
      </button> */}

      {/* Content */}
      <Container className="position-relative text-center text-white" style={{ zIndex: 3 }}>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h1
              className="display-4 fw-bold mb-4"
              style={{
                animation: `fadeInUp 1s ease-out ${currentSlide * 0.1}s both`,
              }}
            >
              {currentImage.title}
              <span
                className="d-block"
                style={{
                  background: "linear-gradient(to right, #ff8a8a, #da8cff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: `fadeInUp 1s ease-out ${currentSlide * 0.1 + 0.2}s both`,
                }}
              >
                {currentImage.subtitle}
              </span>
            </h1>
            <p
              className="lead mb-4"
              style={{
                animation: `fadeInUp 1s ease-out ${currentSlide * 0.1 + 0.4}s both`,
              }}
            >
              {currentImage.description}
            </p>
            <div
              className="d-flex flex-column flex-sm-row justify-content-center gap-3"
              style={{
                animation: `fadeInUp 1s ease-out ${currentSlide * 0.1 + 0.6}s both`,
              }}
            >
              <Button
                variant="primary"
                size="lg"
                style={{
                  background: "linear-gradient(to right, #e83e8c, #6f42c1)",
                  borderColor: "transparent",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 8px 25px rgba(232, 62, 140, 0.3)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "none"
                }}
              >
                Khám phá ngay
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                href="/products"
                style={{
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.backgroundColor = "rgba(255,255,255,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.backgroundColor = "transparent"
                }}
              >
                Xem bộ sưu tập
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Slide Indicators */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 mb-4" style={{ zIndex: 4 }}>
        {heroImages.map((_, index) => (
          <button
            key={index}
            className="btn p-0"
            onClick={() => goToSlide(index)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.5)",
              background: index === currentSlide ? "white" : "transparent",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (index !== currentSlide) {
                e.target.style.background = "rgba(255,255,255,0.7)"
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentSlide) {
                e.target.style.background = "transparent"
              }
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div
        className="position-absolute bottom-0 start-0 w-100"
        style={{
          height: "4px",
          background: "rgba(255,255,255,0.2)",
          zIndex: 4,
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(to right, #e83e8c, #6f42c1)",
            width: `${((currentSlide + 1) / heroImages.length) * 100}%`,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* CSS Animations */}
      {/* <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .btn:focus {
          box-shadow: none !important;
        } */}

        
        {/* section:hover .progress-bar {
          animation-play-state: paused;
        }
      `}</style> */}
    </section>
  )
}

export default HeroSection
