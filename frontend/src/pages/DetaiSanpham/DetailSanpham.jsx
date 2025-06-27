"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Row, Col, Button, Card, Badge, Tabs, Tab, Table, Spinner } from "react-bootstrap"
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Award,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  ArrowLeft,
} from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { addToWishlist } from "../userWishlist/Addwishlist"
import { addToCart } from "../userCart/Addcart"

// Utility function for image URLs
const getImageUrl = (path) => {
  if (typeof path !== "string" || path.trim() === "") {
    return "/placeholder.svg?height=300&width=300";
  }
  if (path.startsWith("http")) return path;
  return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, "")}`;
};

export default function DetailSanpham() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/sanpham/${id}`)
        setProduct(res.data.data)
      } catch (err) {
        console.error("Không thể tải sản phẩm:", err)
        toast.error("Không thể tải sản phẩm")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id) return
      setLoadingReviews(true)
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/danhgia/sanpham/${product.id}`)
        setReviews(res.data.data || [])
      } catch (error) {
        console.error("Error fetching reviews:", error)
        setReviews([])
      } finally {
        setLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [product?.id])

  const selectedVariant = product?.variants?.find((v) => v.id === selectedVariantId)
  const displayPrice = selectedVariant
    ? `${Number(selectedVariant.gia).toLocaleString("vi-VN")} ₫`
    : product?.gia_format || ""
  const displayStock = selectedVariant ? selectedVariant.so_luong_ton : product?.so_luong_ton || 0

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + change, displayStock)))
  }

  const handleAddToCart = () => {
  addToCart(product, selectedVariantId, quantity, selectedVariant)
  
};

  const handleAddToWishlist = () => {
   addToWishlist(product)
 }

  const handleGoBack = () => {
    navigate(-1) // Go back to previous page
  }

  const handleGoHome = () => {
    navigate("/") // Go to home page
  }

  if (loading) {
    return (
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" size="lg" />
          <p className="mt-3">Đang tải sản phẩm...</p>
        </div>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="mb-4">Không tìm thấy sản phẩm</h2>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-primary" onClick={handleGoBack}>
              <ArrowLeft className="me-2" size={16} />
              Quay lại
            </Button>
            <Button variant="primary" onClick={handleGoHome}>
              Về trang chủ
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  const totalStock = product.variants?.length
    ? product.variants.reduce((sum, v) => sum + (v.so_luong_ton || 0), 0)
    : product.so_luong_ton || 0
    

  return (
    <div className="min-vh-100 bg-light">
      <Container className="py-4">
        {/* Back Button */}
        <Button variant="link" onClick={handleGoBack} className="mb-3 p-0">
          <ArrowLeft className="me-2" size={16} />
          Quay lại
        </Button>

        {/* Breadcrumb */}
        <nav className="text-muted small mb-4">
          <span
            className="cursor-pointer text-decoration-underline"
            onClick={handleGoHome}
            style={{ cursor: "pointer" }}
          >
            Trang chủ
          </span>
          {" / "}
          <span>{product.danh_muc_ten}</span>
          {" / "}
          <span className="text-dark ms-1">{product.ten_san_pham}</span>
        </nav>

        <Row className="mb-5">
          {/* Product Images */}
          <Col md={6} className="bg-light p-3 rounded shadow-sm">
              <div className="position-relative text-center mb-3">
                {(() => {
                  const currentImage = product.images?.[currentImageIndex];
                  const currentImagePath =
                    typeof currentImage === "string"
                      ? currentImage
                      : currentImage?.image_path ?? product.hinh_anh;

                  return (
                    <img
                      src={getImageUrl(currentImagePath)}
                      alt={product.ten_san_pham}
                      className="rounded border d-block mx-auto"
                      onClick={() => setLightboxOpen(true)}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        objectFit: "contain",
                        backgroundColor: "#ffffff",
                        padding: "10px",
                        cursor: "zoom-in",
                      }}
                    />
                  );
                })()}

                {product.images?.length > 1 && (
                  <>
                    <Button
                      variant="light"
                      size="sm"
                      className="position-absolute top-50 start-0 translate-middle-y rounded-circle p-2 shadow-sm"
                      onClick={() =>
                        setCurrentImageIndex(
                          currentImageIndex === 0
                            ? product.images.length - 1
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
                        setCurrentImageIndex((currentImageIndex + 1) % product.images.length)
                      }
                    >
                      <i className="bi bi-chevron-right"></i>
                    </Button>
                    <div className="text-center mt-2 text-muted small">
                      <i className="bi bi-info-circle me-1"></i>
                      Ảnh {currentImageIndex + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </div>

              {product.images?.length > 1 && (
                <Row className="g-3 mt-2 justify-content-center">
                  {product.images.map((img, index) => (
                    <Col key={index} xs={3}>
                      <img
                        src={getImageUrl(img.image_path)}
                        alt={`Thumbnail ${index + 1}`}
                        className={`img-thumbnail rounded-2 shadow-sm ${
                          index === currentImageIndex ? "border-primary border-2" : "border"
                        }`}
                        style={{
                          height: "60px",
                          width: "100%",
                          objectFit: "cover",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                          opacity: index === currentImageIndex ? 1 : 0.6,
                          transition: "opacity 0.3s",
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    </Col>
                  ))}
                </Row>
              )}

              {lightboxOpen && (
                <Lightbox
                  open={lightboxOpen}
                  close={() => setLightboxOpen(false)}
                  index={currentImageIndex}
                  slides={product.images.map((img) => ({
                    src: getImageUrl(img.image_path),
                  }))}
                  plugins={[Zoom]}
                />
              )}
            </Col>



          {/* Product Info */}
          <Col lg={6}>
            <div  className="bg-light p-3 rounded shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-3 ">
                <Badge bg="secondary" className="d-flex align-items-center gap-1">
                  <Award size={12} />
                  {product.thuong_hieu}
                </Badge>
                {product.danh_muc_ten &&
                 <Badge>{product.danh_muc_ten}</Badge>}
              </div>

              <h1 className="h3 mb-4">{product.ten_san_pham}</h1>

              {/* Variants Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-semibold">Dung tích:</label>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariantId === variant.id
                      const isOutOfStock = variant.so_luong_ton <= 0

                      return (
                        <Button
                          key={variant.id}
                          variant={isSelected ? "primary" : "outline-primary"}
                          size="sm"
                          disabled={isOutOfStock}
                          onClick={() => {
                            setSelectedVariantId(variant.id)
                            setQuantity(1)
                          }}
                          className={`d-flex flex-column p-2 ${isOutOfStock ? "text-decoration-line-through" : ""}`}
                          style={{ minWidth: "80px", opacity: isOutOfStock ? 0.5 : 1 }}
                        >
                          <span>{variant.dung_tich}</span>
                          {/* <small>{Number(variant.gia).toLocaleString("vi-VN")} ₫</small> */}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="h2 text-danger fw-bold mb-4">{displayPrice}</div>

              {/* Quantity Selection */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Số lượng:</label>
                <div className="d-flex align-items-center gap-2 justify-content-center">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="px-3 py-2 border rounded text-center" style={{ minWidth: "60px" }}>
                    {quantity}
                  </span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= displayStock}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {displayStock <= 0 && <small className="text-danger">Chọn dung tích</small>}
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick={handleAddToCart} disabled={displayStock <= 0}>
                  <ShoppingCart className="me-2" size={20} />
                  Thêm vào giỏ hàng
                </Button>

                <Row className="g-2">
                  <Col>
                    <Button variant="danger" className="w-100" onClick={handleAddToWishlist}>
                      <Heart className="me-2" size={16} />
                      Yêu thích
                    </Button>
                  </Col>
                  {/* <Col>
                    <Button variant="outline-primary" className="w-100">
                      Mua ngay
                    </Button>
                  </Col> */}
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Product Details */}
        <Card className="mb-4">
          <Card.Body>
            <Tabs defaultActiveKey="specifications" id="product-tabs" className="mb-3">
              <Tab eventKey="specifications" title="Thông Tin Sản Phẩm">
                <div className="table-responsive">
                  <Table borderless>
                    <tbody>
                      {product.thuong_hieu && (
                        <tr>
                          <td className="fw-semibold text-muted" style={{ width: "30%" }}>
                            Thương hiệu
                          </td>
                          <td>{product.thuong_hieu}</td>
                        </tr>
                      )}
                      {product.xuat_xu && (
                        <tr>
                          <td className="fw-semibold text-muted">Xuất xứ</td>
                          <td>{product.xuat_xu}</td>
                        </tr>
                      )}
                      {product.phong_cach && (
                        <tr>
                          <td className="fw-semibold text-muted">Phong cách</td>
                          <td>{product.phong_cach}</td>
                        </tr>
                      )}
                      {product.nam_phat_hanh && (
                        <tr>
                          <td className="fw-semibold text-muted">Năm phát hành</td>
                          <td>{product.nam_phat_hanh}</td>
                        </tr>
                      )}
                      {product.do_luu_huong && (
                        <tr>
                          <td className="fw-semibold text-muted">Độ lưu hương</td>
                          <td>{product.do_luu_huong}</td>
                        </tr>
                      )}
                      {product.do_toa_huong && (
                        <tr>
                          <td className="fw-semibold text-muted">Độ tỏa hương</td>
                          <td>{product.do_toa_huong}</td>
                        </tr>
                      )}
                      {product.dung_tich && !product.variants?.length && (
                        <tr>
                          <td className="fw-semibold text-muted">Dung tích</td>
                          <td>{product.dung_tich}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="fw-semibold text-muted">Tình trạng</td>
                        <td>
                          {totalStock > 0 ? (
                            <span className="d-flex align-items-center text-success">
                              <CheckCircle className="me-1" size={16} />
                              Còn hàng ({totalStock})
                            </span>
                          ) : (
                            <span className="d-flex align-items-center text-danger">
                              <XCircle className="me-1" size={16} />
                              Hết hàng
                            </span>
                          )}
                        </td>
                      </tr>
                      {product.danh_muc_ten && (
                        <tr>
                          <td className="fw-semibold text-muted">Danh mục</td>
                          <td>{product.danh_muc_ten}</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab eventKey="description" title="Bài viết mô tả">
                {product.mo_ta ? (
                  <div className="text-muted" dangerouslySetInnerHTML={{ __html: product.mo_ta }} />
                ) : (
                  <p className="text-muted text-center py-5">Chưa có mô tả cho sản phẩm này.</p>
                )}
              </Tab>

              <Tab eventKey="reviews" title="Đánh giá">
                <div>
                  {loadingReviews ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center text-muted py-5">Chưa có đánh giá nào cho sản phẩm này.</div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {reviews.map((review) => (
                        <Card key={review.id} className="border-light">
                          <Card.Body>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="fw-semibold">{review.ten_khach_hang}</span>
                              <div className="d-flex align-items-center gap-2">
                                <div className="d-flex">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={i < review.so_sao ? "text-warning" : "text-muted"}
                                      fill={i < review.so_sao ? "currentColor" : "none"}
                                    />
                                  ))}
                                </div>
                                <small className="text-muted">{review.ngay_danh_gia}</small>
                              </div>
                            </div>
                            <p className="text-muted mb-0">{review.noi_dung}</p>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
