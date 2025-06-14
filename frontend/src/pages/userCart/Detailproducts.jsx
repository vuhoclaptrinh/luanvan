"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Container, Row, Col, Card, Button, Alert, Badge } from "react-bootstrap"
import { ArrowLeft, Package, Calendar, CreditCard, MapPin, Phone, Mail, User } from "lucide-react"
import Header from "../../components/Header"
import "./Detailproducts.css"

const Detailproducts = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [donhangInfo, setDonhangInfo] = useState(null)
  const [chiTietDonhang, setChiTietDonhang] = useState([])
  const [productsMap, setProductsMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_BASE = "http://127.0.0.1:8000/api/"

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // 1. Lấy thông tin đơn hàng (có kèm khách hàng)
        const resDonhang = await axios.get(`${API_BASE}donhang/${id}`)
        const donhang = resDonhang.data
        setDonhangInfo(donhang)

        // 2. Lấy chi tiết đơn hàng
        const resChiTiet = await axios.get(`${API_BASE}chitietdonhang?don_hang_id=${id}`)
        const chitiet = resChiTiet.data.data.filter((item) => item.don_hang_id === Number.parseInt(id))
        setChiTietDonhang(chitiet)

        // 3. Lấy thông tin các sản phẩm
        const productIds = [...new Set(chitiet.map((item) => item.san_pham_id))]
        const productsData = {}
        await Promise.all(
          productIds.map(async (productId) => {
            try {
              const resProduct = await axios.get(`${API_BASE}sanpham/${productId}`)
              productsData[productId] = resProduct.data.data
            } catch (err) {
              console.error(`Error fetching product ${productId}:`, err)
              // Fallback product data
              productsData[productId] = {
                id: productId,
                ten_san_pham: "Sản phẩm không tìm thấy",
                hinh_anh: null,
                thuong_hieu: "",
                dung_tich: "",
              }
            }
          }),
        )
        setProductsMap(productsData)
      } catch (err) {
        console.error("Error fetching order data:", err)
        setError("Lỗi khi tải thông tin đơn hàng: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [id])

  // Format price with VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "chưa thanh toán":
        return "warning"
      case "đã thanh toán":
        return "success"
      case "đang xử lý":
        return "info"
      case "đang giao":
        return "primary"
      case "đã giao":
        return "success"
      case "đã hủy":
        return "danger"
      default:
        return "secondary"
    }
  }

  // Get payment method display
  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng"
      case "bank-transfer":
        return "Chuyển khoản ngân hàng"
      case "credit-card":
        return "Thẻ tín dụng/Ghi nợ"
      default:
        return method || "Không xác định"
    }
  }

  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return "/placeholder.svg?height=80&width=80"
    if (path.startsWith("http")) return path
    return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, "")}`
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="luxury-loading">
          <div className="luxury-spinner">
            <div className="spinner-inner"></div>
          </div>
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <Container className="mt-5">
          <div className="error-container">
            <Alert variant="danger" className="error-alert">
              <h4>Có lỗi xảy ra</h4>
              <p>{error}</p>
              <Button variant="outline-danger" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} className="me-2" />
                Quay lại
              </Button>
            </Alert>
          </div>
        </Container>
      </>
    )
  }

  const subtotal = chiTietDonhang.reduce((sum, item) => sum + item.so_luong * item.gia, 0)

  return (
    <div className="order-details-page">
      <Header />

      <div className="order-hero">
        <Container>
          <div className="hero-content">
            <Button variant="link" className="back-link" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} className="me-2" />
              Quay lại
            </Button>
            <h1 className="order-title">Chi tiết đơn hàng</h1>
            <div className="order-id">#{id}</div>
          </div>
        </Container>
      </div>

      <Container className="order-container">
        <Row>
          <Col lg={8}>
            {/* Order Status */}
            {donhangInfo && (
              <Card className="order-card status-card">
                <Card.Body>
                  <div className="status-header">
                    <div className="status-info">
                      <h3>Trạng thái đơn hàng</h3>
                      <Badge bg={getStatusVariant(donhangInfo.trang_thai)} className="status-badge">
                        {donhangInfo.trang_thai || "Không xác định"}
                      </Badge>
                    </div>
                    <div className="order-date">
                      <Calendar size={16} className="me-2" />
                      Đặt hàng: {formatDate(donhangInfo.ngay_dat)}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Products List */}
            <Card className="order-card products-card">
              <Card.Header>
                <div className="card-header-content">
                  <Package className="card-icon" />
                  <h3 className="section-title">Sản phẩm đã đặt</h3>
                </div>
              </Card.Header>
              <Card.Body>
                {chiTietDonhang.length === 0 ? (
                  <div className="empty-products">
                    <Package size={48} className="empty-icon" />
                    <p>Đơn hàng không có sản phẩm nào.</p>
                  </div>
                ) : (
                  <div className="products-list">
                    {chiTietDonhang.map((item, index) => {
                      const product = productsMap[item.san_pham_id] || {}
                      return (
                        <div key={item.id} className="product-item">
                          <div className="product-image">
                            <img
                              src={getImageUrl(product.hinh_anh) || "/placeholder.svg"}
                              alt={product.ten_san_pham || "Sản phẩm"}
                              width="80"
                              height="80"
                            />
                          </div>
                          <div className="product-details">
                            <h5 className="product-name">{product.ten_san_pham || "Sản phẩm không tìm thấy"}</h5>
                            <div className="product-meta">
                              {product.thuong_hieu && <span className="product-brand">{product.thuong_hieu}</span>}
                              {product.dung_tich && <span className="product-size">{product.dung_tich}</span>}
                            </div>
                            <div className="product-pricing">
                              <div className="product-quantity">Số lượng: {item.so_luong}</div>
                              <div className="product-price">
                                <span className="unit-price">
                                  {formatPrice(item.gia)} x {item.so_luong}
                                </span>
                                <span className="total-price">{formatPrice(item.so_luong * item.gia)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Customer Information */}
            {donhangInfo && (
              <Card className="order-card customer-card">
                <Card.Header>
                  <div className="card-header-content">
                    <User className="card-icon" />
                    <h3 className="section-title">Thông tin khách hàng</h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="info-item">
                        <User size={16} className="info-icon" />
                        <div>
                          <div className="info-label">Họ tên</div>
                          <div className="info-value">{donhangInfo.ten_khach_hang}</div>
                        </div>
                      </div>
                      <div className="info-item">
                        <Phone size={16} className="info-icon" />
                        <div>
                          <div className="info-label">Số điện thoại</div>
                          <div className="info-value">{donhangInfo.so_dien_thoai}</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <Mail size={16} className="info-icon" />
                        <div>
                          <div className="info-label">Email</div>
                          <div className="info-value">{donhangInfo.email}</div>
                        </div>
                      </div>
                      <div className="info-item">
                        <MapPin size={16} className="info-icon" />
                        <div>
                          <div className="info-label">Địa chỉ giao hàng</div>
                          <div className="info-value">{donhangInfo.dia_chi}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col lg={4}>
            {/* Order Summary */}
            <Card className="order-card summary-card">
              <Card.Header>
                <div className="card-header-content">
                  <CreditCard className="card-icon" />
                  <h3 className="section-title">Tóm tắt đơn hàng</h3>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="summary-label">Tạm tính</span>
                    <span className="summary-value">{formatPrice(subtotal)}</span>
                  </div>

                  {donhangInfo?.phi_van_chuyen && (
                    <div className="summary-row">
                      <span className="summary-label">Phí vận chuyển</span>
                      <span className="summary-value">{formatPrice(donhangInfo.phi_van_chuyen)}</span>
                    </div>
                  )}

                  {donhangInfo?.giam_gia && donhangInfo.giam_gia > 0 && (
                    <div className="summary-row discount">
                      <span className="summary-label">Giảm giá</span>
                      <span className="summary-value">-{formatPrice(donhangInfo.giam_gia)}</span>
                    </div>
                  )}

                  <div className="summary-total">
                    <span className="total-label">Tổng cộng</span>
                    <span className="total-value">{formatPrice(donhangInfo?.tong_tien || subtotal)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Payment Information */}
            {donhangInfo && (
              <Card className="order-card payment-card">
                <Card.Header>
                  <div className="card-header-content">
                    <CreditCard className="card-icon" />
                    <h3 className="section-title">Thông tin thanh toán</h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="payment-info">
                    <div className="payment-method">
                      <div className="payment-label">Phương thức thanh toán</div>
                      <div className="payment-value">{getPaymentMethodDisplay(donhangInfo.paymentMethod)}</div>
                    </div>

                    <div className="payment-status">
                      <div className="payment-label">Trạng thái thanh toán</div>
                      <Badge bg={getStatusVariant(donhangInfo.trang_thai)} className="payment-badge">
                        {donhangInfo.trang_thai}
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Order Notes */}
            {donhangInfo?.ghi_chu && (
              <Card className="order-card notes-card">
                <Card.Header>
                  <div className="card-header-content">
                    <svg
                      className="card-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 12.2H15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 16.2H12.38"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h3 className="section-title">Ghi chú</h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="notes-content">{donhangInfo.ghi_chu}</p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Detailproducts
