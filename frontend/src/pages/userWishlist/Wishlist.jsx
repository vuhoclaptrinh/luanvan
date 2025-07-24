"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Minus, X, ShoppingBag } from "lucide-react";
import { Modal, Badge, Button } from "react-bootstrap";

import "./wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCloseModal = () => setSelectedProduct(null);
  // Hàm xử lý ảnh
  const getImageUrl = (path) => {
    if (!path) return "/placeholder.svg?height=100&width=100";

    // Nếu là object có image_path (phòng trường hợp khác)
    if (typeof path === "object" && path.image_path) {
      path = path.image_path;
    }

    if (typeof path === "string" && path.startsWith("http")) return path;

    return `http://127.0.0.1:8000/storage/images/${path.replace(
      /^images\//,
      ""
    )}`;
  };

  // Lấy wishlist từ session
  const getWishlist = () => {
    return JSON.parse(sessionStorage.getItem("wishlist")) || [];
  };

  // Xoá 1 sản phẩm
  const removeFromWishlist = (productId) => {
    const wishlist = getWishlist();
    const updated = wishlist.filter((item) => item.id !== productId);
    sessionStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlist(updated);
  };

  // Xoá tất cả
  const clearWishlist = () => {
    sessionStorage.removeItem("wishlist");
    setWishlist([]);
  };

  // Lấy data
  useEffect(() => {
    setWishlist(getWishlist());
    setLoading(false);

    const handleUpdate = () => setWishlist(getWishlist());
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => window.removeEventListener("wishlist-updated", handleUpdate);
  }, []);

  if (loading) {
    return (
      <div className="luxury-loading">
        <div className="luxury-spinner">
          <div className="spinner-inner"></div>
        </div>
        <p>Đang tải Wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="luxury-empty-cart">
        <div className="empty-cart-content">
          <div className="empty-icon">
            <ShoppingBag size={60} strokeWidth={1.5} />
          </div>
          <h2>Danh sách yêu thích của bạn đang trống</h2>
          <p>
            Khám phá bộ sưu tập nước hoa cao cấp và thêm sản phẩm vào yêu thích
          </p>
          <Link to="/products" className="luxury-button">
            <span>Khám phá bộ sưu tập</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-cart-page">
      <Container>
        <div className="luxury-cart-header">
          <h1>Wishlist</h1>
          <p>{wishlist.length} sản phẩm yêu thích</p>
        </div>
        <div className="luxury-cart-content">
          <Row>
            <Col lg={12}>
              <div className="luxury-cart-items">
                <div className="cart-section-header">
                  <h2>Sản phẩm</h2>
                  <button className="clear-cart" onClick={clearWishlist}>
                    <Trash2 size={14} />
                    <span>Xoá tất cả</span>
                  </button>
                </div>

                <div className="luxury-items-list">
                  {wishlist.map((product) => (
                    <div key={product.id} className="luxury-item">
                      <div className="item-image">
                        <img
                          src={getImageUrl(product.hinh_anh)}
                          alt={product.ten_san_pham}
                        />
                      </div>
                      <div className="item-details">
                        <div className="item-info">
                          <h3>{product.ten_san_pham}</h3>
                          <div className="item-meta">
                            <span className="brand">
                              {product.thuong_hieu || "Thương hiệu"}
                            </span>
                            <span className="size">
                              {product.dung_tich || "100ml"}ml
                            </span>

                            <span className="size">
                              {product.xuat_xu || "..."}
                            </span>
                            <span className="size">
                              {product.phong_cach || "..."}
                            </span>
                            <span className="size">
                              {product.nma_phat_hanh || "..."}
                            </span>
                            <span className="size">
                              {product.do_luu_huong || "..."}
                            </span>
                            <span className="size">
                              {product.do_toa_huong || "..."}
                            </span>
                          </div>
                        </div>
                        <div className="item-actions">
                          <div className="item-price">
                            <div className="price-unit">
                              {product.gia
                                ? `${product.gia.toLocaleString()}₫`
                                : "Liên hệ"}
                            </div>
                          </div>

                          <div className="item-actions mt-2 d-flex gap-2">
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => navigate(`/sanpham/${product.id}`)}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                          <button
                            className="remove-item"
                            onClick={() => removeFromWishlist(product.id)}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="continue-shopping">
                  <Link to="/products">
                    <ArrowLeft size={16} />
                    <span>Tiếp tục xem sản phẩm</span>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        {selectedProduct && (
          <Modal show onHide={handleCloseModal} centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="fs-5 text-primary">
                <i className="bi bi-eye me-2"></i>
                Chi tiết sản phẩm
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {console.log("Ảnh phụ:", selectedProduct.images)}
              <Row>
                <Col md={6}>
                  <div className="position-relative mb-3">
                    <img
                      src={getImageUrl(
                        selectedProduct.images?.[currentImageIndex] ||
                          selectedProduct.hinh_anh
                      )}
                      alt={selectedProduct.ten_san_pham}
                      className="img-fluid rounded"
                      style={{
                        width: "100%",
                        height: "350px",
                        objectFit: "cover",
                      }}
                    />
                    {selectedProduct.images?.length > 1 && (
                      <>
                        <Button
                          variant="light"
                          size="sm"
                          className="position-absolute top-50 start-0 translate-middle-y rounded-circle p-2 shadow-sm"
                          onClick={() =>
                            setCurrentImageIndex(
                              currentImageIndex === 0
                                ? selectedProduct.images.length - 1
                                : currentImageIndex - 1
                            )
                          }
                        >
                          <i className="bi bi-chevron-left"></i>
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="position-absolute top-50 end-0 translate-middle-y rounded-circle p-2 shadow-sm"
                          onClick={() =>
                            setCurrentImageIndex(
                              (currentImageIndex + 1) %
                                selectedProduct.images.length
                            )
                          }
                        >
                          <i className="bi bi-chevron-right"></i>
                        </Button>
                        <div className="text-center mt-2 text-muted small">
                          <i className="bi bi-info-circle me-1"></i>
                          Ảnh {currentImageIndex + 1} /{" "}
                          {selectedProduct.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {selectedProduct.images?.length > 1 && (
                    <Row className="g-2 mt-2">
                      {selectedProduct.images.map((img, index) => (
                        <Col key={index} xs={3}>
                          <img
                            src={getImageUrl(img)}
                            alt={`Thumbnail ${index + 1}`}
                            className={`img-thumbnail cursor-pointer ${
                              index === currentImageIndex
                                ? "border-primary border-2"
                                : ""
                            }`}
                            style={{
                              height: "60px",
                              objectFit: "cover",
                              cursor: "pointer",
                              opacity: index === currentImageIndex ? 1 : 0.6,
                            }}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        </Col>
                      ))}
                    </Row>
                  )}
                </Col>
                <Col md={6}>
                  <h4>{selectedProduct.ten_san_pham}</h4>
                  <p className="text-muted">{selectedProduct.mo_ta}</p>
                  {/* <p><strong>Giá:</strong> {selectedProduct.gia?.toLocaleString()}₫</p> */}
                  <p>
                    <strong>Thương hiệu:</strong> {selectedProduct.thuong_hieu}
                  </p>
                  {/* <p><strong>Dung tích:</strong> {selectedProduct.dung_tich}</p> */}
                  <p>
                    <strong>Xuất xứ:</strong> {selectedProduct.xuat_xu}
                  </p>
                  <p>
                    <strong>Phong cách:</strong> {selectedProduct.phong_cach}
                  </p>
                  <p>
                    <strong>Năm phát hành:</strong>{" "}
                    {selectedProduct.nam_phat_hanh}
                  </p>
                  <p>
                    <strong>Độ lưu hương:</strong>{" "}
                    {selectedProduct.do_luu_huong}
                  </p>
                  <p>
                    <strong>Độ toả hương:</strong>{" "}
                    {selectedProduct.do_toa_huong}
                  </p>

                  <div className="d-grid gap-2 mt-3">
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleCloseModal();
                        navigate(`/sanpham/${selectedProduct.id}`);
                      }}
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i> Trang
                      chi tiết sản phẩm
                    </Button>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default Wishlist;
