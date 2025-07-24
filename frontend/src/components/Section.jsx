import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      src: "src/assets/img/logost.png",
      title: "Khám phá thế giới",
      subtitle: "Nước hoa cao cấp",
      description:
        "Bộ sưu tập nước hoa chính hãng từ các thương hiệu nổi tiếng thế giới. Tìm kiếm hương thơm hoàn hảo cho phong cách của bạn.",
    },
    {
      src: "src/assets/img/logo.png",
      title: "Hương thơm quyến rũ",
      subtitle: "Dành cho phái đẹp",
      description:
        "Khám phá những mùi hương nữ tính, quyến rũ và đầy mê hoặc từ các thương hiệu danh tiếng.",
    },
    {
      src: "src/assets/img/credd.jpg",
      title: "Phong cách nam tính",
      subtitle: "Mạnh mẽ & cuốn hút",
      description:
        "Bộ sưu tập nước hoa nam với hương thơm mạnh mẽ, nam tính và đầy cuốn hút.",
    },
  ];

  // thời gian chuyển trang
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentImage = heroImages[currentSlide];

  return (
    <section
      className="position-relative d-flex align-items-center justify-content-center"
      style={{
        height: "650px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* chuỷen ảnh */}
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

      {/* nội dung */}
      <Container
        className="position-relative text-center text-white"
        style={{ zIndex: 3 }}
      >
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
                  background: "pink",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: `fadeInUp 1s ease-out ${
                    currentSlide * 0.1 + 0.2
                  }s both`,
                }}
              >
                {currentImage.subtitle}
              </span>
            </h1>
            <p
              className="lead mb-4"
              style={{
                animation: `fadeInUp 1s ease-out ${
                  currentSlide * 0.1 + 0.4
                }s both`,
              }}
            >
              {currentImage.description}
            </p>
            <div
              className="d-flex flex-column flex-sm-row justify-content-center gap-3"
              style={{
                animation: `fadeInUp 1s ease-out ${
                  currentSlide * 0.1 + 0.6
                }s both`,
              }}
            >
              <Button
                variant="primary"
                size="lg"
                style={{
                  background: "gray",
                  borderColor: "transparent",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(232, 62, 140, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
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
                onClick={(e) => {
                  e.preventDefault();
                  toast.success("Đang chuyển đến bộ sưu tập...");

                  setTimeout(() => {
                    window.location.href = "/products";
                  }, 1500);
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Xem bộ sưu tập
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* chấm chuển ảnh */}
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 mb-4"
        style={{ zIndex: 4 }}
      >
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
                e.target.style.background = "rgba(255,255,255,0.7)";
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentSlide) {
                e.target.style.background = "transparent";
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
