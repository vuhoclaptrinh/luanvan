"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";

const API_BASE = "http://127.0.0.1:8000/api/";

const categoryColors = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
];

const getCategoryIcon = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("nam")) return "👨";
  if (lower.includes("nữ")) return "👩";
  if (lower.includes("unisex")) return "👫";
  if (lower.includes("mini")) return "🧴";
  if (lower.includes("cao cấp")) return "💎";
  if (lower.includes("trẻ em")) return "👶";
  return "🧴";
};

function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  //  Lấy danh sách danh mục + số lượng sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}danhmuc`);
        const danhmucs = res.data?.data || [];

        const detailedData = await Promise.all(
          danhmucs.map(async (dm, i) => {
            const detail = await axios.get(`${API_BASE}danhmuc/${dm.id}`);
            const count = detail.data?.sanphams?.length || 0;
            return {
              id: dm.id,
              name: dm.ten_danh_muc,
              count,
              gradient: categoryColors[i % categoryColors.length],
              icon: getCategoryIcon(dm.ten_danh_muc),
            };
          })
        );

        setCategories(detailedData);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-5 bg-light">
      <Container>
        {/*  Tiêu đề */}
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">
            <span className="text-primary">Danh mục</span> nổi bật
          </h2>
          <p className="text-muted mx-auto lead" style={{ maxWidth: "700px" }}>
            Khám phá các dòng nước hoa với hàng trăm sản phẩm chất lượng
          </p>
          <div className="d-flex justify-content-center mt-3">
            <div
              style={{
                width: "100px",
                height: "4px",
                background: "blue",
                borderRadius: "2px",
              }}
            ></div>
          </div>
        </div>
        {/*  Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner
              animation="border"
              variant="primary"
              style={{ width: "3rem", height: "3rem" }}
            />
            <p className="mt-3 text-muted">Đang tải danh mục...</p>
          </div>
        ) : (
          //  Hiển thị danh sách danh mục
          <Row className="g-4">
            {categories.map((cat) => (
              <Col key={cat.id} xs={12} sm={6} lg={4} xl={3}>
                <Card
                  className="border-0 h-100 category-card shadow-sm"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0,0,0,0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
                  }}
                >
                  <div
                    className="position-relative p-4 text-white text-center"
                    style={{
                      background: cat.gradient,
                      minHeight: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="mb-3"
                      style={{
                        fontSize: "3rem",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                      }}
                    >
                      {cat.icon}
                    </div>
                    <h4 className="fw-bold mb-2 text-shadow">{cat.name}</h4>
                    <Badge
                      bg="light"
                      text="dark"
                      className="px-3 py-2"
                      style={{
                        fontSize: "0.9rem",
                        borderRadius: "20px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {cat.count} sản phẩm
                    </Badge>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/*  Thống kê  */}
        {!loading && categories.length > 0 && (
          <div className="text-center mt-5 pt-4 border-top">
            <Row className="justify-content-center">
              <Col md={8}>
                <div className="d-flex justify-content-around align-items-center flex-wrap">
                  <div className="text-center mb-3">
                    <div className="fs-2 fw-bold text-primary">
                      {categories.length}
                    </div>
                    <small className="text-muted">Danh mục</small>
                  </div>
                  <div className="text-center mb-3">
                    <div className="fs-2 fw-bold text-success">
                      {categories.reduce((sum, cat) => sum + cat.count, 0)}
                    </div>
                    <small className="text-muted">Sản phẩm</small>
                  </div>
                  <div className="text-center mb-3">
                    <div className="fs-2 fw-bold text-warning">⭐</div>
                    <small className="text-muted">Chất lượng cao</small>
                  </div>
                  <div className="text-center mb-3">
                    <div className="fs-2 fw-bold text-info">🚚</div>
                    <small className="text-muted">Giao hàng nhanh</small>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </section>
  );
}

export default FeaturedCategories;
