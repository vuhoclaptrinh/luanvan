"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  X,
  ShoppingBag,
} from "lucide-react"
import { Modal, Badge, Button } from "react-bootstrap"
import { addToCart } from "../userCart/addcart" // Cập nhật đường dẫn nếu cần

import "./wishlist.css"

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState(null)


  const handleCloseModal = () => setSelectedProduct(null)
  // Hàm xử lý ảnh
  const getImageUrl = (path) => {
    if (!path) return "/placeholder.svg?height=100&width=100"
    if (path.startsWith("http")) return path
    return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, "")}`
  }

  // Lấy wishlist từ session
  const getWishlist = () => {
    return JSON.parse(sessionStorage.getItem("wishlist")) || []
  }

  // Xoá 1 sản phẩm
  const removeFromWishlist = (productId) => {
    const wishlist = getWishlist()
    const updated = wishlist.filter((item) => item.id !== productId)
    sessionStorage.setItem("wishlist", JSON.stringify(updated))
    setWishlist(updated)
  }

  // Xoá tất cả
  const clearWishlist = () => {
    sessionStorage.removeItem("wishlist")
    setWishlist([])
  }

  // Lấy data
  useEffect(() => {
    setWishlist(getWishlist())
    setLoading(false)

    const handleUpdate = () => setWishlist(getWishlist())
    window.addEventListener("wishlist-updated", handleUpdate)
    return () => window.removeEventListener("wishlist-updated", handleUpdate)
  }, [])

  if (loading) {
    return (
      <div className="luxury-loading">
        <div className="luxury-spinner"><div className="spinner-inner"></div></div>
        <p>Đang tải Wishlist...</p>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="luxury-empty-cart">
        <div className="empty-cart-content">
          <div className="empty-icon"><ShoppingBag size={60} strokeWidth={1.5} /></div>
          <h2>Danh sách yêu thích của bạn đang trống</h2>
          <p>Khám phá bộ sưu tập nước hoa cao cấp và thêm sản phẩm vào yêu thích</p>
          <Link to="/products" className="luxury-button">
            <span>Khám phá bộ sưu tập</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    )
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
                            <span className="brand">{product.thuong_hieu || "Thương hiệu"}</span>
                            <span className="size">{product.dung_tich || "100ml"}</span>

                            <span className="size">{product.mo_ta || "..."}</span>
                          </div>
                        </div>
                        <div className="item-actions">
                          <div className="item-price">
                            <div className="price-unit">
                              {product.gia ? `${product.gia.toLocaleString()}₫` : "Liên hệ"}
                            </div>
                          </div>
                          

                          <div className="item-actions mt-2 d-flex gap-2">
                            <Button size="sm" variant="info" onClick={() => setSelectedProduct(product)}>
                                Xem chi tiết
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => addToCart(product)}
                            >
                                Thêm vào giỏ
                            </Button>
                        </div>
                        <button className="remove-item" onClick={() => removeFromWishlist(product.id)}>
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
            <Modal.Title>Chi tiết sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Row>
                <Col md={6}>
                <img
                    src={getImageUrl(selectedProduct.hinh_anh)}
                    alt={selectedProduct.ten_san_pham}
                    className="img-fluid rounded"
                    style={{ height: "300px", objectFit: "cover", width: "100%" }}
                />
                </Col>
                <Col md={6}>
                <h4>{selectedProduct.ten_san_pham}</h4>
                <p className="text-muted">{selectedProduct.mo_ta}</p>
                <p><strong>Giá:</strong> {selectedProduct.gia?.toLocaleString()}₫</p>
                <p><strong>Thương hiệu:</strong> {selectedProduct.thuong_hieu}</p>
                <p><strong>Dung tích:</strong> {selectedProduct.dung_tich}</p>
                <p>
                    <strong>Tình trạng:</strong>{" "}
                    {selectedProduct.so_luong_ton > 0 ? (
                    <span className="text-success">Còn hàng</span>
                    ) : (
                    <span className="text-danger">Hết hàng</span>
                    )}
                </p>
                <div className="d-grid gap-2 mt-3">
                    <Button
                    variant="primary"
                    onClick={() => {
                        addToCart(selectedProduct)
                        handleCloseModal()
                    }}
                    >
                    <i className="bi bi-cart-plus me-1"></i> Thêm vào giỏ hàng
                    </Button>
                </div>
                </Col>
            </Row>
            </Modal.Body>
        </Modal>
        )}
      </Container>
    </div>
  )
}

export default Wishlist
