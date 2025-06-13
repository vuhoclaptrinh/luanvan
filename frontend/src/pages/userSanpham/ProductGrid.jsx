"use client"
import { Row, Col, Card, Button, Badge } from "react-bootstrap"

import { addToCart } from "../userCart/Addcart"

const ProductGrid = ({
  filteredProducts,
  visibleCount,
  viewMode,
  handleCardClick,
  handleShowMore,
  resetFilters,
  getImageUrl,
}) => {
  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded shadow-sm">
        <i className="bi bi-search display-1 text-muted"></i>
        <h4 className="mt-3">Không tìm thấy sản phẩm nào</h4>
        <p className="text-muted">Vui lòng thử lại với bộ lọc khác</p>
        <Button variant="primary" onClick={resetFilters}>
          Xóa bộ lọc
        </Button>
      </div>
    )
  }

  return (
    <>
      <Row className={`g-3 ${viewMode === "list" ? "list-view" : ""}`}>
        {filteredProducts.slice(0, visibleCount).map((product) => (
          <Col key={product.id} xs={6} md={4} lg={3} xl={viewMode === "list" ? 12 : 3} className="mb-3">
            <Card
              className={`h-100 product-card border-0 shadow-sm ${viewMode === "list" ? "list-card" : ""}`}
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
              <div className={`d-flex ${viewMode === "list" ? "flex-row" : "flex-column"}`}>
                <div className={`position-relative ${viewMode === "list" ? "list-image-container" : ""}`}>
                  <Card.Img
                    variant="top"
                    src={getImageUrl(product.hinh_anh)}
                    alt={product.ten_san_pham}
                    style={{
                      height: viewMode === "list" ? "180px" : "220px",
                      objectFit: "cover",
                      width: viewMode === "list" ? "180px" : "100%",
                    }}
                    className={viewMode === "list" ? "rounded-start" : ""}
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
                    <Card.Title className={`${viewMode === "list" ? "fs-5" : "fs-6"} text-truncate`}>
                      {product.ten_san_pham}
                    </Card.Title>
                    {viewMode === "list" && product.mo_ta && (
                      <p className="text-muted small mb-2 text-truncate">{product.mo_ta}</p>
                    )}
                  </div>
                  <div className="mt-auto">
                    {product.dung_tich && (
                      <small className="text-muted d-block mb-2">Dung tích: {product.dung_tich}</small>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`${viewMode === "list" ? "fs-5" : "fs-6"} fw-bold text-primary`}>
                        {product.gia_format}
                      </span>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                           addToCart(product)
                          // Thêm vào giỏ hàng logic ở đây
                          // alert(`Đã thêm ${product.ten_san_pham} vào giỏ hàng!`)
                        }}
                      >
                        <i className="bi bi-cart-plus"></i>
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {visibleCount < filteredProducts.length && (
        <div className="text-center mt-4">
          <Button variant="outline-primary" onClick={handleShowMore} className="px-4">
            Xem thêm sản phẩm
          </Button>
        </div>
      )}
    </>
  )
}

export default ProductGrid
