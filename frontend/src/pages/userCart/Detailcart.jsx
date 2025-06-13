"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Container, Row, Col, Card, Button, Badge, Alert } from "react-bootstrap"
import { ShoppingBag, Calendar, ArrowRight, Clock, Package } from "lucide-react"
import Header from "../../components/Header"
import "./Detailcart.css"

const Detailcart = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"))

    if (!user) {
      navigate("/login", { state: { from: "/orders" } })
      return
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/donhang/khachhang/${user.id}`)
        if (res.data.status) {
          setOrders(res.data.data)
        } else {
          setError("Không thể tải đơn hàng.")
        }
      } catch (err) {
        setError("Lỗi tải dữ liệu: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [navigate])

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

  if (loading) {
    return (
      <>
        <Header />
        <div className="luxury-loading">
          <div className="luxury-spinner">
            <div className="spinner-inner"></div>
          </div>
          <p>Đang tải danh sách đơn hàng...</p>
        </div>
      </>
    )
  }

  return (
    <div className="order-list-page">
      <Header />

      <div className="order-list-hero">
        <Container>
          <div className="hero-content">
            <h1 className="order-list-title">Đơn hàng của bạn</h1>
            <p className="order-list-subtitle">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
          </div>
        </Container>
      </div>

      <Container className="order-list-container">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-content">
              <div className="empty-icon">
                <ShoppingBag size={60} strokeWidth={1.5} />
              </div>
              <h2>Bạn chưa có đơn hàng nào</h2>
              <p>Hãy khám phá các sản phẩm của chúng tôi và đặt hàng ngay!</p>
              <Button variant="primary" className="shop-now-button" onClick={() => navigate("/products")}>
                Mua sắm ngay
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="order-count">
              <Package size={20} className="me-2" />
              <span>Tổng cộng: {orders.length} đơn hàng</span>
            </div>

            <Row>
              {orders.map((order) => (
                <Col lg={6} key={order.id} className="mb-4">
                  <Card className="order-card">
                    <Card.Body>
                      <div className="order-header">
                        <div className="order-id">
                          <h5>Đơn hàng #{order.id}</h5>
                          <Badge bg={getStatusVariant(order.trang_thai)} className="status-badge">
                            {order.trang_thai}
                          </Badge>
                        </div>
                        <div className="order-date">
                          <Calendar size={16} className="me-1" />
                          <span>{formatDate(order.ngay_dat)}</span>
                        </div>
                      </div>

                      <div className="order-info">
                        <div className="info-row">
                          <div className="info-label">Người nhận:</div>
                          <div className="info-value">{order.ten_khach_hang}</div>
                        </div>
                        <div className="info-row">
                          <div className="info-label">Địa chỉ:</div>
                          <div className="info-value address">{order.dia_chi}</div>
                        </div>
                        <div className="info-row">
                          <div className="info-label">Tổng tiền:</div>
                          <div className="info-value price">{formatPrice(order.tong_tien)}</div>
                        </div>
                      </div>

                      <div className="order-footer">
                        <div className="delivery-time">
                          <Clock size={16} className="me-1" />
                          <span>Dự kiến giao: 3-5 ngày</span>
                        </div>
                        <Button
                          variant="outline-primary"
                          className="view-details-btn"
                          onClick={() => navigate(`/donhang/${order.id}`)}
                        >
                          <span>Xem chi tiết</span>
                          <ArrowRight size={16} className="ms-1" />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  )
}

export default Detailcart
