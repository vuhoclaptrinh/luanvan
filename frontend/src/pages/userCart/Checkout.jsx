"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { ArrowLeft, CreditCard, Truck, CheckCircle, User, MapPin, ShoppingBag } from "lucide-react"
import axios from "axios"
import "./checkout.css"
import Header from "../../components/Header"

const Checkout = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    dia_chi: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "cod",
    notes: "",
  })

  // Validation state
  const [validated, setValidated] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Get user data from session storage
    const userData = sessionStorage.getItem("user")

    if (!userData) {
      navigate("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Pre-fill form with user data
      setFormData((prev) => ({
        ...prev,
        ho_ten: parsedUser.ho_ten || `${parsedUser.first_name || ""} ${parsedUser.last_name || ""}`.trim(),
        email: parsedUser.email || "",
        so_dien_thoai: parsedUser.so_dien_thoai || parsedUser.phone || "",
        dia_chi: parsedUser.dia_chi || parsedUser.address || "",
        city: parsedUser.thanh_pho || parsedUser.city || "",
        district: parsedUser.quan_huyen || parsedUser.district || "",
        ward: parsedUser.phuong_xa || parsedUser.ward || "",
      }))
    } catch (err) {
      console.error("Error parsing user data:", err)
      navigate("/login")
      return
    }

    setLoading(false)
  }, [navigate])

  // Redirect if no cart data
  if (!loading && (!state || !state.cart || state.cart.length === 0)) {
    return (
      <>
        <Header />
        <div className="empty-cart-container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">
              <ShoppingBag size={60} strokeWidth={1.5} />
            </div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
            <Button variant="primary" className="empty-cart-button" onClick={() => navigate("/products")}>
              <span>Khám phá sản phẩm</span>
              <ArrowLeft size={16} className="ms-2" />
            </Button>
          </div>
        </div>
      </>
    )
  }

  // If order is complete, show success page
  if (orderComplete) {
    return (
      <>
        <Header />
        <div className="checkout-success">
          <div className="success-content">
            <div className="success-icon">
              <CheckCircle size={60} />
            </div>
            <h2>Đặt hàng thành công!</h2>
            <p className="order-id">
              Mã đơn hàng: <span>#{orderId}</span>
            </p>

            <div className="success-message">
              <p>
                Cảm ơn bạn đã đặt hàng tại PerfumeShop. Chúng tôi đã xác nhận đơn hàng của
                bạn.
              </p>
              <p>Đơn hàng của bạn sẽ được xử lý và giao đến trong thời gian sớm nhất.</p>
            </div>

            <div className="success-actions">
              <Button variant="outline-secondary" onClick={() => navigate("/products")} className="continue-shopping">
                <ArrowLeft size={16} className="me-2" />
                Tiếp tục mua sắm
              </Button>

              <Button variant="primary" onClick={() => navigate(`/orders`)} className="view-orders">
                Xem đơn hàng
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Extract cart data from state
  const { cart, shipping, discount, coupon, couponId ,total,shippingcost } = state
  const subtotal = cart.reduce((total, item) => total + item.gia * item.quantity, 0)
  //const total = subtotal + shipping.price - discount

  // Format price with VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return "/placeholder.svg?height=80&width=80"
    if (path.startsWith("http")) return path
    return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, "")}`
  }

  // Handle form input changes  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.ho_ten.trim()) newErrors.ho_ten = "Vui lòng nhập họ tên"
    if (!formData.so_dien_thoai.trim()) newErrors.so_dien_thoai = "Vui lòng nhập số điện thoại"
    else if (!/^[0-9]{10}$/.test(formData.so_dien_thoai.trim())) newErrors.so_dien_thoai = "Số điện thoại không hợp lệ"

    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ"

    if (!formData.dia_chi.trim()) newErrors.dia_chi = "Vui lòng nhập địa chỉ"
    if (!formData.city.trim()) newErrors.city = "Vui lòng chọn thành phố"
    if (!formData.district.trim()) newErrors.district = "Vui lòng chọn quận/huyện"
    if (!formData.ward.trim()) newErrors.ward = "Vui lòng chọn phường/xã"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)
    setError("")
    setMessage("")

    if (!validateForm()) {
      setError("Vui lòng điền đầy đủ thông tin người nhận.")
      return
    }

    setSubmitting(true)

    try {
      // Combine address parts
      const fullAddress = `${formData.dia_chi}, ${formData.ward}, ${formData.district}, ${formData.city}`

      // Submit order to API
      const res = await axios.post("http://localhost:8000/api/donhang", {
        khach_hang_id: user.id,
        ngay_dat: new Date().toISOString().split("T")[0],
        tong_tien: total,
        tong_tien_truoc_giam: subtotal,           // ✅ tổng trước giảm
        giam_gia_tien: discount,                  // ✅ số tiền giảm
        phi_van_chuyen: shippingcost,             // ✅ phí ship
        ten_phuong_thuc_van_chuyen: shipping.name,// ✅ tên dịch vụ
        trang_thai: "chờ xử lý",
        ma_giam_gia_id: couponId || null,
        ho_ten_nguoi_nhan: formData.ho_ten,
        email_nguoi_nhan: formData.email,
        so_dien_thoai: formData.so_dien_thoai,
        dia_chi: fullAddress,
        ghi_chu: formData.notes || "",
        paymentMethod: formData.paymentMethod,
      })

      const donhang = res.data.data

      // Create order details for each cart item
      await Promise.all(
        cart.map((item) =>
          axios.post("http://localhost:8000/api/chitietdonhang", {
            don_hang_id: donhang.id,
            san_pham_id: item.id,
            so_luong: item.quantity,
            gia: item.gia,
          }),
        ),
      )

      // Clear cart from session storage
      sessionStorage.removeItem("cart")

      // Dispatch event to update cart count in header
      window.dispatchEvent(new Event("cart-updated"))

      // Show success message and redirect
      setOrderId(donhang.id)
      setOrderComplete(true)
    } catch (err) {
      console.error("Checkout error:", err)
      setError("Đặt hàng thất bại. Vui lòng thử lại.")
      window.scrollTo(0, 0)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="luxury-loading">
        <div className="luxury-spinner">
          <div className="spinner-inner"></div>
        </div>
        <p>Đang tải thông tin thanh toán...</p>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <Header />

      <div className="checkout-hero">
        <Container>
          <h1 className="checkout-title">Thanh toán</h1>
          <div className="checkout-steps">
            <div className="step active">
              <div className="step-number">1</div>
              <div className="step-label">Giỏ hàng</div>
            </div>
            <div className="step-connector active"></div>
            <div className="step active">
              <div className="step-number">2</div>
              <div className="step-label">Thanh toán</div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-label">Hoàn tất</div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="checkout-container">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        {message && (
          <Alert variant="success" className="mb-4">
            {message}
          </Alert>
        )}

        <Row>
          <Col lg={8}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Customer Information */}
              <Card className="checkout-card">
                <Card.Header>
                  <div className="card-header-content">
                    <User className="card-icon" />
                    <h3 className="section-title">Thông tin khách hàng</h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>
                          Họ tên <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="ho_ten"
                          value={formData.ho_ten}
                          onChange={handleInputChange}
                          isInvalid={validated && !!errors.ho_ten}
                          required
                        />
                        <Form.Control.Feedback type="invalid">{errors.ho_ten}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>
                          Số điện thoại <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="so_dien_thoai"
                          value={formData.so_dien_thoai}
                          onChange={handleInputChange}
                          isInvalid={validated && !!errors.so_dien_thoai}
                          required
                        />
                        <Form.Control.Feedback type="invalid">{errors.so_dien_thoai}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="form-group">
                    <Form.Label>
                      Email <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={validated && !!errors.email}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Shipping Address */}
              <Card className="checkout-card">
                <Card.Header>
                  <div className="card-header-content">
                    <MapPin className="card-icon" />
                    <h3 className="section-title">Địa chỉ giao hàng</h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="form-group">
                    <Form.Label>
                      Địa chỉ <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="dia_chi"
                      value={formData.dia_chi}
                      onChange={handleInputChange}
                      isInvalid={validated && !!errors.dia_chi}
                      required
                      placeholder="Số nhà, tên đường"
                    />
                    <Form.Control.Feedback type="invalid">{errors.dia_chi}</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="form-group">
                        <Form.Label>
                          Tỉnh/Thành phố <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          isInvalid={validated && !!errors.city}
                          required
                        />
                        <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="form-group">
                        <Form.Label>
                          Quận/Huyện <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          isInvalid={validated && !!errors.district}
                          required
                        />
                        <Form.Control.Feedback type="invalid">{errors.district}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="form-group">
                        <Form.Label>
                          Phường/Xã <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="ward"
                          value={formData.ward}
                          onChange={handleInputChange}
                          isInvalid={validated && !!errors.ward}
                          required
                        />
                        <Form.Control.Feedback type="invalid">{errors.ward}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Payment Method */}
              <Card className="checkout-card">
                <Card.Header>
                  <div className="card-header-content">
                    <CreditCard className="card-icon" />
                    <h3 className="section-title">Phương thức thanh toán</h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="payment-methods">
                    <div
                      className={`payment-method-option ${formData.paymentMethod === "cod" ? "selected" : ""}`}
                      onClick={() => setFormData({ ...formData, paymentMethod: "cod" })}
                    >
                      <Form.Check
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        value="cod"
                        label="Thanh toán khi nhận hàng (COD)"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="payment-radio"
                      />
                      <div className="payment-icon cod-icon">
                        <Truck size={20} />
                      </div>
                    </div>

                    <div
                      className={`payment-method-option disabled`}
                      style={{ opacity: 0.6, cursor: "not-allowed" }}
                      title="Phương thức chuyển khoản ngân hàng đang được bảo trì"
                      onClick={() => alert("Phương thức chuyển khoản ngân hàng đang được bảo trì.")}
                      
                    >
                      <Form.Check
                        type="radio"
                        id="bank-transfer"
                        name="paymentMethod"
                        value="bank-transfer"
                        label="Chuyển khoản ngân hàng"
                        checked={formData.paymentMethod === "bank-transfer"}
                        disabled
                        className="payment-radio"
                        
                      />
                      <div className="payment-icon bank-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M2 22H22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 2L2 9H22L12 2Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.5 9V16.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20.5 9V16.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 9V16.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 9V16.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 9V16.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 22H22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 19H22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div
                      className={`payment-method-option disabled`}
                      style={{ opacity: 0.6, cursor: "not-allowed" }}
                      title="Phương thức thanh toán thẻ tín dụng đang được bảo trì"
                      onClick={() => alert("Phương thức thanh toán thẻ tín dụng đang được bảo trì.")}
                    >
                      <Form.Check
                        type="radio"
                        id="credit-card"
                        name="paymentMethod"
                        value="credit-card"
                        label="Thẻ tín dụng/Ghi nợ"
                        checked={formData.paymentMethod === "credit-card"}
                        disable
                        className="payment-radio"
                      />
                      <div className="payment-icon card-icon">
                        <CreditCard size={20} />
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === "bank-transfer" && (
                    <div className="bank-info">
                      <div className="bank-info-header">
                        <h4>Thông tin chuyển khoản</h4>
                      </div>
                      <div className="bank-info-content">
                        <div className="bank-detail">
                          <span className="bank-label">Ngân hàng:</span>
                          <span className="bank-value">Vietcombank</span>
                        </div>
                        <div className="bank-detail">
                          <span className="bank-label">Số tài khoản:</span>
                          <span className="bank-value">1234567890</span>
                        </div>
                        <div className="bank-detail">
                          <span className="bank-label">Chủ tài khoản:</span>
                          <span className="bank-value">PERFUME SHOP</span>
                        </div>
                        <div className="bank-detail">
                          <span className="bank-label">Nội dung:</span>
                          <span className="bank-value">Thanh toan don hang [{formData.ho_ten}]</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Order Notes */}
              <Card className="checkout-card">
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
                    <h3 className="section-title">Ghi chú đơn hàng</h3>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                      className="notes-textarea"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              <div className="checkout-actions">
                <Button
                  variant="outline"
                  onClick={() => navigate("/cart")}
                  className="back-button"
                  disabled={submitting}
                >
                  <ArrowLeft size={16} className="me-2" />
                  Quay lại giỏ hàng
                </Button>

                <Button variant="primary" type="submit" className="order-button" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Đang xử lý...</span>
                      </div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Đặt hàng
                      <CheckCircle size={16} className="ms-2" />
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Col>

          <Col lg={4}>
            {/* Order Summary */}
            <Card className="checkout-card order-summary">
              <Card.Header>
                <div className="card-header-content">
                  <ShoppingBag className="card-icon" />
                  <h3 className="section-title">Tóm tắt đơn hàng</h3>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="product-list">
                  {cart.map((item) => (
                    <div key={item.id} className="product-item">
                      <div className="product-image">
                        <img
                          src={getImageUrl(item.hinh_anh || item.images)}
                          alt={item.ten_san_pham}
                          width="60"
                          height="60"
                        />
                      </div>
                      <div className="product-details">
                        <h5 className="product-title">{item.ten_san_pham}</h5>
                        <div className="product-meta">
                          {item.thuong_hieu && <span className="product-brand">{item.thuong_hieu}</span>}
                          {item.dung_tich && <span className="product-size">{item.dung_tich}</span>}
                        </div>
                        <div className="product-price-row">
                          <div className="product-quantity">SL: {item.quantity}</div>
                          <div className="product-price">{formatPrice(item.gia * item.quantity)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="price-summary">
                  <div className="price-row">
                    <span className="price-label">Tạm tính</span>
                    <span className="price-value">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="price-row">
                    <span className="price-label">Phí vận chuyển</span>
                    <span className="price-value">{formatPrice(shipping.price)}</span>
                  </div>

                  <div className="shipping-method">
                    <Truck size={14} className="me-1" />
                    <span>
                      {shipping.name} ({shipping.days} ngày)
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="price-row discount">
                      <span className="price-label">Giảm giá {coupon && `(${coupon})`}</span>
                      <span className="price-value">- {formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="price-total">
                    <span className="total-label">Tổng cộng</span>
                    <span className="total-value">{formatPrice(total)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Shipping Information */}
            <Card className="checkout-card shipping-info">
              <Card.Body>
                <div className="shipping-header">
                  <Truck className="shipping-icon" />
                  <h5>Thông tin vận chuyển</h5>
                </div>

                <div className="shipping-details">
                  <div className="shipping-name">{shipping.name}</div>
                  <div className="shipping-time">
                    <span className="shipping-label">Thời gian giao hàng:</span>
                    <span className="shipping-value">{shipping.days} ngày</span>
                  </div>
                  <div className="shipping-price">
                    <span className="shipping-label">Phí vận chuyển:</span>
                    <span className="shipping-value">{formatPrice(shipping.price)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Checkout
