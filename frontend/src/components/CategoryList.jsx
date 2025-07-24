"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Button,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addToCart } from "./../pages/userCart/Addcart";
import { addToWishlist } from "../pages/userWishlist/Addwishlist";
import ProductDetailModal from "./ProductDetail";

const API_BASE = "http://127.0.0.1:8000/api/";
const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg?height=300&width=300";
  if (path.startsWith("http")) return path;
  return `http://127.0.0.1:8000/storage/images/${path.replace(
    /^images\//,
    ""
  )}`;
};

function FeaturedCategories() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}sanpham`)
      .then((response) => {
        const allProducts = response.data.data || [];

        const sortedByDate = [...allProducts].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setProducts(sortedByDate);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải dữ liệu sản phẩm.");
        setLoading(false);
      });
  }, []);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner
          animation="border"
          role="status"
          variant="primary"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-3">Đang tải sản phẩm...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Sản phẩm mới nhất</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Khám phá những sản phẩm vừa được thêm gần đây
          </p>
        </div>

        <Row className="g-4">
          {products.slice(0, visibleCount).map((product) => (
            <Col key={product.id} xs={12} sm={6} lg={4}>
              <Card
                className="h-100 product-card border-0 shadow-sm"
                onClick={() => handleCardClick(product)}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
                }}
              >
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={getImageUrl(product.hinh_anh)}
                    alt={product.ten_san_pham}
                    style={{ height: "280px", objectFit: "cover" }}
                  />
                  {product.danh_muc_ten && (
                    <Badge
                      bg="primary"
                      className="position-absolute top-0 start-0 m-2"
                    >
                      {product.danh_muc_ten}
                    </Badge>
                  )}
                  {product.variants?.some(
                    (v) => v.so_luong_ton > 0 && v.so_luong_ton <= 5
                  ) && (
                    <Badge
                      bg="warning"
                      text="dark"
                      className="position-absolute top-0 end-0 m-2"
                    >
                      Sắp hết hàng
                    </Badge>
                  )}
                  {product.variants?.every((v) => v.so_luong_ton === 0) && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 end-0 m-2"
                    >
                      Hết hàng
                    </Badge>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    {product.thuong_hieu && (
                      <small className="text-muted d-block mb-1">
                        {product.thuong_hieu}
                      </small>
                    )}
                    <Card.Title className="fs-5 text-truncate">
                      {product.ten_san_pham}
                    </Card.Title>
                  </div>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-center  align-items-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          navigate(`/sanpham/${product.id}`);
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal xem chi tiết sản phẩm */}
        <ProductDetailModal
          product={selectedProduct}
          show={selectedProduct !== null}
          onHide={() => setSelectedProduct(null)}
          addToCart={addToCart}
          addToWishlist={addToWishlist}
        />
      </Container>
    </section>
  );
}

export default FeaturedCategories;
