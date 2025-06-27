import { useState, useEffect } from "react"
import axios from "axios"
import { Card, Row, Col, Container, Modal, Button, Badge, Spinner } from "react-bootstrap"
import { addToCart } from './../pages/userCart/Addcart';
import { addToWishlist } from "../pages/userWishlist/Addwishlist";
import ProductDetailModal from "./ProductDetail";
// import { addtowwishlist } from "../pages/userWishlist/Addwishlist";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg?height=300&width=300"
  if (path.startsWith("http")) return path
  return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, "")}`
}

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  //const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visibleCount, setVisibleCount ] = useState(3) 

  useEffect(() => {
    setLoading(true)
    axios
      .get("http://127.0.0.1:8000/api/sanpham")
      .then(async (response) => {
        const allProducts = response.data.data
        // Lấy đánh giá cho từng sản phẩm
        const productsWithAvgStar = await Promise.all(
          allProducts.map(async (product) => {
            try {
              const res = await axios.get(`http://127.0.0.1:8000/api/danhgia/sanpham/${product.id}`)
              const reviews = res.data.data || []
              if (reviews.length === 0) return null
              const totalStars = reviews.reduce((sum, rv) => sum + (rv.so_sao || 0), 0)
              const avgStar = totalStars / reviews.length
              return avgStar > 0 ? { ...product, avgStar, reviewCount: reviews.length } : null
            } catch {
              return null
            }
          })
        )
        // Lọc và sắp xếp sản phẩm có đánh giá, ưu tiên nhiều sao hơn
        const filtered = productsWithAvgStar.filter(Boolean).sort((a, b) => b.avgStar - a.avgStar)
        setProducts(filtered)
        setLoading(false)
      })
      .catch(() => {
        setError("Không thể tải dữ liệu sản phẩm.")
        setLoading(false)
      })
  }, [])

  const handleCardClick = (product) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
  }

  // const handleCloseModal = () => {
  //   setSelectedProduct(null)
  //   setCurrentImageIndex(0)
  // }

  // const handleNextImage = () => {
  //   if (selectedProduct?.images?.length > 0) {
  //     setCurrentImageIndex((currentImageIndex + 1) % selectedProduct.images.length)
  //   }
  // }

  // const handlePrevImage = () => {
  //   if (selectedProduct?.images?.length > 0) {
  //     setCurrentImageIndex(currentImageIndex === 0 ? selectedProduct.images.length - 1 : currentImageIndex - 1)
  //   }
  // }

  // const handleShowMore = () => {
  //   setVisibleCount((prevCount) => Math.min(prevCount + 6, products.length))
  // }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-3">Đang tải sản phẩm...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </Container>
    )
  }

  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Sản phẩm nổi bật</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Khám phá bộ sưu tập nước hoa cao cấp được yêu thích nhất
          </p>
        </div>

        <Row className="g-4">
          {products.slice(0, visibleCount).map((product) => (
            <Col key={product.id} xs={12} sm={6} lg={4}>
              <Card
                className="h-100 product-card border-0 shadow-sm"
                onClick={() => handleCardClick(product)}
                style={{ cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)"
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 0.125rem 0.25rem rgba(0,0,0,0.075)"
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
                    <Badge bg="primary" className="position-absolute top-0 start-0 m-2">
                      {product.danh_muc_ten}
                    </Badge>
                  )}
                  {product.so_luong_ton <= 5 && product.so_luong_ton > 0 && (
                    <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2">
                      Sắp hết hàng
                    </Badge>
                  )}
                  {product.so_luong_ton === 0 && (
                    <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                      Hết hàng
                    </Badge>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    {product.thuong_hieu && <small className="text-muted d-block mb-1">{product.thuong_hieu}</small>}
                    <Card.Title className="fs-5 text-truncate">{product.ten_san_pham}</Card.Title>
                    {/* Hiển thị số sao trung bình và số lượt đánh giá */}
                    <div className="d-flex align-items-center mt-1 mb-2">
                      <span className="text-warning me-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <i key={i} className={`bi ${i < Math.round(product.avgStar) ? 'bi-star-fill' : 'bi-star'}`}></i>
                        ))}
                      </span>
                      <span className="small text-muted">{product.avgStar.toFixed(1)}/5 ({product.reviewCount} đánh giá)</span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    {product.dung_tich && (
                      <small className="text-muted d-block mb-2">Dung tích: {product.dung_tich}</small>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-5 fw-bold text-primary">{product.gia_format}</span>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Thêm vào giỏ hàng logic ở đây
                          addToCart(product)

                          // alert(`Đã thêm ${product.ten_san_pham} vào giỏ hàng!`)
                        }}
                      >
                        <i className="bi bi-cart-plus"></i>
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
  )
}

export default ProductList
