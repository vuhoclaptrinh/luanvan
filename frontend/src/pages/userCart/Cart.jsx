"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { ArrowLeft, Trash2, Plus, Minus, X, ShoppingBag, CreditCard, Gift } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./cart.css"



const Cart = () => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const navigate = useNavigate()  
  // Shipping options
  const shippingOptions = [
    { id: 1, name: "Giao hàng tiêu chuẩn", price: 30000, days: "3-5" },
    { id: 2, name: "Giao hàng nhanh", price: 60000, days: "1-2" },
    { id: 3, name: "Giao hàng hỏa tốc", price: 100000, days: "Trong ngày" },
  ]
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0])

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const storedCart = JSON.parse(sessionStorage.getItem("cart")) || []

      // Add image URLs and other details if they don't exist
      const enhancedCart = storedCart.map((item) => ({
        ...item,
        image: item.hinh_anh || `/placeholder.svg?height=100&width=100`,
        brand: item.thuong_hieu || "Thương hiệu",
        size: item.dung_tich || "100ml",
      }))

      setCart(enhancedCart)
      setLoading(false)
    }, 500)
  }, [])

  //kiẻm tra sô lượng tồn
    const updateQuantity = (id, newQuantity) => {
    const updatedCart = cart.map((item) => {
        if (item.id === id) {
        if (newQuantity > item.so_luong_ton) {
            alert(`Chỉ còn ${item.so_luong_ton} sản phẩm "${item.ten_san_pham}" trong kho!`)
            return item
        }
        if (newQuantity < 1) return item
        return { ...item, quantity: newQuantity }
        }
        return item
    })

    sessionStorage.setItem("cart", JSON.stringify(updatedCart))
    setCart(updatedCart)
    }

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    sessionStorage.setItem("cart", JSON.stringify(updatedCart))
    setCart(updatedCart)
  }

  const clearCart = () => {
    sessionStorage.removeItem("cart")
    setCart([])
  }

  const applyCoupon = () => {
    // Simple coupon logic - in a real app, this would validate with backend
    if (couponCode.toLowerCase() === "giamgia10") {
      setCouponApplied(true)
      setDiscountAmount(subtotal * 0.1) // 10% discount
    } else if (couponCode.toLowerCase() === "giamgia20") {
      setCouponApplied(true)
      setDiscountAmount(subtotal * 0.2) // 20% discount
    } else {
      alert("Mã giảm giá không hợp lệ!")
      setCouponApplied(false)
      setDiscountAmount(0)
    }
  }

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.gia * item.quantity, 0)
  const shippingCost = selectedShipping.price
  const total = subtotal + shippingCost - discountAmount

  // Format price with VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return "/placeholder.svg?height=100&width=100"
    if (path.startsWith("http")) return path
    return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, "")}`
  }

  if (loading) {
    return (
      <div className="luxury-loading">
        <div className="luxury-spinner">
          <div className="spinner-inner"></div>
        </div>
        <p>Đang tải giỏ hàng của bạn...</p>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="luxury-empty-cart">
        <div className="empty-cart-content">
          <div className="empty-icon">
            <ShoppingBag size={60} strokeWidth={1.5} />
          </div>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Khám phá bộ sưu tập nước hoa cao cấp và thêm sản phẩm vào giỏ hàng</p>
          <Link to="/products" className="luxury-button">
            <span>Khám phá bộ sưu tập</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    )
  }

  //chéc out
  

  const handleCheckout = () => {
    
    const user = JSON.parse(sessionStorage.getItem("user"))
    if (!user) {
      alert("Vui lòng đăng nhập để tiếp tục đặt hàng.")
      navigate("/login")
      return
    }

    navigate("/checkout", {
      state: {
        cart: cart,
        shipping: selectedShipping,
        discount: discountAmount,
        coupon: couponCode    
      }
    })
  }
  

  return (
    <div className="luxury-cart-page">
      <Container>
        <div className="luxury-cart-header">
          <h1>Giỏ hàng</h1>
          <p>{cart.length} sản phẩm trong giỏ hàng</p>
        </div>

        <div className="luxury-cart-content">
          <Row>
            <Col lg={8}>
              <div className="luxury-cart-items">
                <div className="cart-section-header">
                  <h2>Sản phẩm</h2>
                  <button className="clear-cart" onClick={clearCart}>
                    <Trash2 size={14} />
                    <span>Xóa tất cả</span>
                  </button>
                </div>

                <div className="luxury-items-list">
                  {cart.map((item) => (
                    <div key={item.id} className="luxury-item">
                      <div className="item-image">
                        <img src={getImageUrl(item.image) || "/placeholder.svg"} alt={item.ten_san_pham} />
                      </div>
                      <div className="item-details">
                        <div className="item-info">
                          <h3>{item.ten_san_pham}</h3>
                          <div className="item-meta">
                            <span className="brand">{item.brand}</span>
                            <span className="size">{item.size}</span>
                          </div>
                        </div>
                        <div className="item-actions">
                            {/*kiem tra so luong*/}
                         <div className="luxury-quantity">
                        <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.so_luong_ton}
                        >
                            <Plus size={14} />
                        </button>
                        </div>
                          <div className="item-price">
                            <div className="price-total">{formatPrice(item.gia * item.quantity)}</div>
                            <div className="price-unit">{formatPrice(item.gia)} / sản phẩm</div>
                          </div>
                          <button className="remove-item" onClick={() => removeFromCart(item.id)}>
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
                    <span>Tiếp tục mua sắm</span>
                  </Link>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="luxury-cart-sidebar">
                <div className="sidebar-section summary">
                  <h2>Tóm tắt đơn hàng</h2>
                  <div className="summary-content">
                    <div className="summary-row">
                      <span>Tạm tính</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {couponApplied && (
                      <div className="summary-row discount">
                        <span>Giảm giá</span>
                        <span>- {formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="summary-row">
                      <span>Phí vận chuyển</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="summary-total">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(total)}</span>
                    </div>  
                    <button className="checkout-button"  onClick={handleCheckout}>
                      <CreditCard size={16} />
                      <span>Tiến hành đặt hàng</span>
                    </button>
                  </div>
                </div>

                <div className="sidebar-section shipping">
                  <h2>Phương thức vận chuyển</h2>
                  <div className="shipping-options">
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`shipping-option ${selectedShipping.id === option.id ? "selected" : ""}`}
                        onClick={() => setSelectedShipping(option)}
                      >
                        <div className="option-radio">
                          <div className="radio-outer">
                            <div className={`radio-inner ${selectedShipping.id === option.id ? "active" : ""}`}></div>
                          </div>
                        </div>
                        <div className="option-info">
                          <div className="option-name">{option.name}</div>
                          <div className="option-time">Thời gian: {option.days}</div>
                        </div>
                        <div className="option-price">{formatPrice(option.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sidebar-section coupon">
                  <h2>Mã giảm giá</h2>
                  <div className="coupon-form">
                    <div className="input-wrapper">
                      <Gift size={16} />
                      <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                    </div>
                    <button className="apply-button" onClick={applyCoupon}>
                      Áp dụng
                    </button>
                  </div>
                  {couponApplied && <div className="coupon-success">Mã giảm giá đã được áp dụng thành công!</div>}
                  <div className="coupon-examples">
                    <div className="example">
                      <span className="code">GIAMGIA10</span>
                      <span className="desc">Giảm 10%</span>
                    </div>
                    <div className="example">
                      <span className="code">GIAMGIA20</span>
                      <span className="desc">Giảm 20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default Cart
