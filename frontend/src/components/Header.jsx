"use client"
import { useState, useEffect } from "react"
import { Navbar, Nav, Container, Badge, Offcanvas, Dropdown, Row, Col, Button } from "react-bootstrap"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Box, Avatar, Tooltip } from "@mui/material"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import FavoriteIcon from "@mui/icons-material/Favorite"
import MenuIcon from "@mui/icons-material/Menu"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import Logo from "../assets/img/logo.jpg"
import axios from "axios"

// Navigation 
const LEFT_NAV_LINKS = [
  { href: "/home", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { label: "Danh mục" },
  {  label: "Thương hiệu" },
]

const RIGHT_NAV_LINKS = [
  { href: "/about", label: "Về chúng tôi" },
  { href: "/contact", label: "Liên hệ" },
]

// menu mobile
const ALL_NAV_LINKS = [...LEFT_NAV_LINKS, ...RIGHT_NAV_LINKS]


const getFullName = (user) => {
  if (!user) return ""

  if (user.ho_ten) return user.ho_ten

  const firstName = user.first_name || ""
  const lastName = user.last_name || ""
  return `${firstName} ${lastName}`.trim()
}


const getInitials = (user) => {
  if (!user) return "U"

  const fullName = user.ho_ten || getFullName(user)
  return fullName.charAt(0).toUpperCase()
}

const getAvatarColor = (user) => {
  if (!user) return "#6f42c1"

  const colors = [
    "#e83e8c", // pink
    "#6f42c1", // purple
    "#007bff", // blue
    "#20c997", // teal
    "#fd7e14", // orange
  ]

  const name = user.ho_ten || getFullName(user)
  const index = name.length % colors.length
  return colors[index]
}

function Header({ cartCount = 0, wishlistCount = 0 }) {
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [user, setUser] = useState(null)
  const [showMegaMenu, setShowMegaMenu] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(cartCount)

  // Thêm state cho danh mục
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  // Thêm state cho thuonghieu
  const [thuonghieu, setThuonghieu] = useState([])
  const [loadingThuonghieu, setLoadingThuonghieu] = useState(false)

  //  lấy số lượng sản phẩm trong giỏ hàng
  const getCartItemsCount = () => {
    try {
      const cartItems = JSON.parse(sessionStorage.getItem("cart")) || []

       return cartItems.reduce((total, item) => total + item.quantity, 0) //tổng tất cả sản phẩm
      //return cartItems.length
    } catch (error) { 
      console.error("Lỗi khi đọc giỏ hàng:", error) 
      return 0
    }
  }

  // Lấy user sessionStorage 
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error("Lỗi khi lấy user:", err)
      }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    setCartItemCount(getCartItemsCount())

    // scroll 
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    //  sự kiện cập nhật giỏ hàng
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        setCartItemCount(getCartItemsCount())
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("storage", handleStorageChange)

    // Fetch danh mục 
    setLoadingCategories(true)
    axios
      .get("http://127.0.0.1:8000/api/danhmuc")
      .then((res) => {
        
        const categoriesData = res.data.data || res.data
        setCategories(categoriesData)
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh mục:", err)
      })
      .finally(() => {
        setLoadingCategories(false)
      })

    setLoadingThuonghieu(true)
    axios
      .get("http://127.0.0.1:8000/api/sanpham")
      .then((res) => {
        const sanphamData = res.data.data || res.data

        // Lọc thương hiệu 
        const uniqueBrands = [...new Set(sanphamData.map((sp) => sp.thuong_hieu))]

        
        setThuonghieu(uniqueBrands)
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thương hiệu của sản phẩm:", err)
      })
      .finally(() => {
        setLoadingThuonghieu(false)
      })

    // Cleanup event listeners
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // cập nhật số lượng sản phẩm
  useEffect(() => {
    // cập nhật
    const handleCartUpdate = () => {
      setCartItemCount(getCartItemsCount())
    }

    // Đăng ký 
    window.addEventListener("cart-updated", handleCartUpdate)

    // Cleanup
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate)
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("token")
    setUser(null)
    navigate("/home")
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  // Hàm render mega menu
  const renderMegaMenu = (label) => {
    if (label === "Danh mục" && showMegaMenu === "Danh mục") {
      return (
        <div
          className="position-absolute bg-white shadow-lg rounded-3 p-4"
          style={{
            top: "100%",
            left: "-100px",
            width: "300px",
            zIndex: 1000,
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <h6 className="fw-bold mb-3">Danh mục phổ biến</h6>
          {loadingCategories ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : categories.length > 0 ? (
            <Row>
              {categories.slice(0, 10).map((category, index) => (
                <Col xs={6} key={category.id || index}>
                  <Link
                    to={`/danhmuc/${category.id}`}
                    className="text-decoration-none text-dark d-block mb-2 py-1"
                    onClick={() => setShowMegaMenu(null)}
                  >
                    {category.ten_danh_muc || category.name}
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-muted small">Không có danh mục nào.</p>
          )}
        </div>
      )
    }

    if (label === "Thương hiệu" && showMegaMenu === "Thương hiệu") {
      return (
        <div
          className="position-absolute bg-white shadow-lg rounded-3 p-4"
          style={{
            top: "100%",
            left: "-100px",
            width: "300px",
            zIndex: 1000,
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <h6 className="fw-bold mb-3">Thương hiệu phổ biến</h6>
          {loadingThuonghieu ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : thuonghieu.length > 0 ? (
            <Row>
              {thuonghieu.slice(0, 10).map((brand, index) => (
                <Col xs={6} key={index}>
                  <Link
                    to={`/thuonghieu/${brand}`}
                    className="text-decoration-none text-dark d-block mb-2 py-1"
                    onClick={() => setShowMegaMenu(null)}
                  >
                    {brand}
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-muted small">Không có thương hiệu nào.</p>
          )}
        </div>
      )
    }

    return null
  }

  //Hàm render nav link
  const renderNavLink = ({ href, label }, index) => (
    <Nav.Link
      key={`${href}-${index}`}
      as={Link}
      to={href}
      className={`mx-2 position-relative ${isActive(href) ? "fw-bold" : ""}`}
      onMouseEnter={() =>
        label === "Sản phẩm" || label === "Danh mục" || label === "Thương hiệu" ? setShowMegaMenu(label) : null
      }
      onMouseLeave={() => setShowMegaMenu(null)}
    >
      {label}
      {isActive(href) && (
        <span
          className="position-absolute"
          style={{
            height: "2px",
            width: "80%",
            backgroundColor: "#e83e8c",
            bottom: "0",
            left: "10%",
          }}
        ></span>
      )}
      {renderMegaMenu(label)}
    </Nav.Link>
  )
//   const renderNavLink = ({ href, label }, index) => {
//   const isDropdown = label === "Danh mục" || label === "Thương hiệu" // kiểm tra có phải là mục đặc biệt có menu phụ không

//   return (
//     <div
//       key={`${href}-${index}`}
//       className="position-relative mx-2"
//       onMouseEnter={() => setShowMegaMenu(label)} // hiển thị menu khi hover
//       onMouseLeave={() => setShowMegaMenu(null)}  // ẩn menu khi rời chuột
//     >
//       {/*  Nếu có href: tạo Nav.Link để điều hướng */}
//       {href ? (
//         <Nav.Link
//           as={Link}              // sử dụng Link của react-router thay cho thẻ <a>
//           to={href}              // đường dẫn cần chuyển đến
//           className={`position-relative ${isActive(href) ? "fw-bold" : ""}`}
//         >
//           {label}                

//           {/* Gạch dưới khi đang ở trang hiện tại */}
//           {isActive(href) && (
//             <span
//               className="position-absolute"
//               style={{
//                 height: "2px",
//                 width: "80%",
//                 backgroundColor: "#e83e8c",
//                 bottom: "0",
//                 left: "10%",
//               }}
//             ></span>
//           )}
//         </Nav.Link>
//       ) : (
//         //  KHÔNG dùng <a> nếu không có href —> dùng <span> thay thế
//         <span className="nav-link text-dark">{label}</span>
//       )}

//       {/* menu con hiển thị khi hover (mega menu) */}
//       {renderMegaMenu(label)}
//     </div>
//   )
// }

  return (
    <header>
      {/* Top Bar */}
      <div
        className={`py-2 d-none d-lg-block ${isScrolled ? "d-lg-none" : ""}`}
        style={{
          background: "linear-gradient(to right, #6f42c1, #e83e8c)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center me-4" style={{ opacity: 0.9 }}>
                  <LocalShippingIcon fontSize="small" className="me-1" />
                  <small className="fw-medium">Voucher cho đơn hàng từ 500.000đ</small>
                </div>  
                <div className="d-flex align-items-center me-4"  style={{ opacity: 0.9 }}>
                  <i className="bi bi-clock me-1"></i>
                  <small className="fw-medium">Giao hàng trong 24h</small>
                </div>
                <div className="d-flex align-items-center me-4" style={{ opacity: 0.9 }}>
                 <i className="bi bi-box me-1"></i>
                <small>Đổi trả trong 7 ngày</small>
              </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-end align-items-center">
                
               <div className="d-flex align-items-center me-4" style={{ opacity: 0.9 }}>
                  <i className="bi bi-cash-coin me-1"></i>
                  <small className="fw-medium">Thanh toán khi nhận hàng</small>
                </div>
                <div className="me-4 d-flex align-items-center" style={{ opacity: 0.9 }}>
                  <SupportAgentIcon fontSize="small" className="me-1" />
                   <small>Hỗ trợ: 0965765861   (8h - 22h)</small> 
                </div>  
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar
        className={`py-3 ${isScrolled ? "sticky-header shadow-sm" : ""}`}
        style={{
          position: isScrolled ? "fixed" : "relative",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
          background: isScrolled ? "rgba(255, 255, 255, 0.95)" : "white",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
        }}
      >
        <Container>
          <div className="d-flex justify-content-between align-items-center w-100">
            {/* Mobile menu button (left) */}
            <div className="d-lg-none">
              <Button variant="link" className="text-dark p-1" onClick={() => setShowOffcanvas(true)}>
                <MenuIcon />
              </Button>
            </div>

            {/* Left navigation links (desktop) */}
            <Nav className="d-none d-lg-flex">{LEFT_NAV_LINKS.map((link, index) => renderNavLink(link, index))}</Nav>

            {/* Logo (centered) */}
            <Navbar.Brand as={Link} to="/home" className="mx-auto d-flex align-items-center">
              <img
                src={Logo || "/placeholder.svg"}
                alt="PerfumeShop Logo"
                width={isScrolled ? "30" : "40"}
                height={isScrolled ? "30" : "40"}
                className="rounded-circle"
                style={{ transition: "all 0.3s ease" }}
              />
              <div className="ms-2">
                <span
                  className="fw-bold d-block"
                  style={{
                    fontSize: isScrolled ? "1rem" : "1.2rem",
                    lineHeight: 1.2,
                    transition: "all 0.3s ease",
                  }}
                >
                  PerfumeShop
                </span>
                <small
                  className="text-muted"
                  style={{
                    fontSize: isScrolled ? "0.6rem" : "0.7rem",
                    letterSpacing: "0.5px",
                    transition: "all 0.3s ease",
                  }}
                >
                  LUXURY FRAGRANCE
                </small>
              </div>
            </Navbar.Brand>

            {/* Right navigation links and actions (desktop) */}
            <div className="d-none d-lg-flex align-items-center">
              {/* Right navigation links */}
              <Nav className="me-3">{RIGHT_NAV_LINKS.map((link, index) => renderNavLink(link, index))}</Nav>

              {/* User actions */}
              <div className="d-flex align-items-center">
                {/* Wishlist */}
                <Tooltip title="Yêu thích">
                  <Link to="/wishlist" className="text-dark position-relative me-3 p-1">
                    <FavoriteIcon />
                    {wishlistCount > 0 && (
                      <Badge
                        pill
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {wishlistCount}
                      </Badge>
                    )}
                  </Link>
                </Tooltip>

                {/* Cart */}
                <Tooltip title="Giỏ hàng">
                  <Link to="/cart" className="text-dark position-relative me-3 p-1">
                    <ShoppingCartIcon />
                    {cartItemCount > 0 && (
                      <Badge
                        pill
                        bg="primary"
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </Tooltip>

                {/* User Account */}
                {user ? (
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="link"
                      className="text-dark d-flex align-items-center p-0 border-0 text-decoration-none"
                      style={{ boxShadow: "none" }}
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: getAvatarColor(user),
                            width: 36,
                            height: 36,
                            fontSize: 16,
                          }}
                        >
                          {getInitials(user)}
                        </Avatar>
                      </Box>
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={{
                        minWidth: "220px",
                        padding: "0.5rem",
                        marginTop: "0.5rem",
                        boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div className="px-3 py-2 border-bottom mb-2">
                        <div className="d-flex align-items-center">
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(user),
                              width: 40,
                              height: 40,
                              fontSize: 16,
                              mr: 1.5,
                            }}
                          >
                            {getInitials(user)}
                          </Avatar>
                          <div>
                            <div className="fw-medium">{getFullName(user)}</div>
                            <small className="text-muted">{user.email || "user@example.com"}</small>
                          </div>
                        </div>
                      </div>

                      <Dropdown.Item as={Link} to="/profilehome" className="rounded-2 mb-1">
                        <i className="bi bi-person me-2"></i>Hồ sơ cá nhân
                      </Dropdown.Item>

                      <Dropdown.Item as={Link} to="/orders" className="rounded-2 mb-1">
                        <i className="bi bi-bag me-2"></i>Đơn hàng của tôi
                      </Dropdown.Item>

                      <Dropdown.Item as={Link} to="/wishlist" className="rounded-2 mb-1">
                        <i className="bi bi-heart me-2"></i>Danh sách yêu thích
                      </Dropdown.Item>

                      {/* <Dropdown.Item as={Link} to="/addresses" className="rounded-2 mb-1">
                        <i className="bi bi-geo-alt me-2"></i>Địa chỉ giao hàng
                      </Dropdown.Item> */}

                      <Dropdown.Divider />

                      <Dropdown.Item onClick={handleLogout} className="text-danger rounded-2">
                        <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <div className="d-flex">
                    <Link to="/login" className="btn btn-sm btn-outline-primary me-2">
                      Đăng nhập 
                    </Link>
                    <Link to="/login" className="btn btn-sm btn-primary">
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile icons (right) */}
            <div className="d-flex align-items-center d-lg-none">
              <Link to="/wishlist" className="text-dark position-relative me-2 p-1">
                <FavoriteIcon />
                {wishlistCount > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Link>

              <Link to="/cart" className="text-dark position-relative p-1">
                <ShoppingCartIcon />
                {cartItemCount > 0 && (
                  <Badge
                    pill
                    bg="primary"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Offcanvas Mobile Menu */}
      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="d-flex align-items-center">
            <img src={Logo || "/placeholder.svg"} alt="Logo" width="30" height="30" className="rounded-circle me-2" />
            <span className="fw-bold">PerfumeShop</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          {/* User info in mobile menu */}
          {user ? (
            <div className="p-3 bg-light">
              <div className="d-flex align-items-center">
                <Avatar
                  sx={{
                    bgcolor: getAvatarColor(user),
                    width: 40,
                    height: 40,
                    fontSize: 16,
                    mr: 2,
                  }}
                >
                  {getInitials(user)}
                </Avatar>
                <div>
                  <div className="fw-medium">{getFullName(user)}</div>
                  <small className="text-muted">{user.email || "user@example.com"}</small>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary flex-grow-1">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary flex-grow-1">
                Đăng ký
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <div className="border-bottom">
            <Nav className="flex-column">
              {ALL_NAV_LINKS.map(({ href, label }) => (
                <Nav.Link
                  key={href}
                  as={Link}
                  to={href}
                  className={`py-3 px-3 border-bottom ${isActive(href) ? "fw-bold" : ""}`}
                  onClick={() => setShowOffcanvas(false)}
                >
                  {label}
                </Nav.Link>
              ))}
            </Nav>
          </div>

          {/* Quick Links */}
          <div className="p-3">
            {/* <h6 className="text-uppercase text-muted mb-3" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
              Liên kết nhanh
            </h6> */}
            <Nav className="flex-column">
              {/* <Nav.Link as={Link} to="/track-order" className="px-0 py-2" onClick={() => setShowOffcanvas(false)}>
                <i className="bi bi-truck me-2"></i>Theo dõi đơn hàng
              </Nav.Link> */}
              <Nav.Link as={Link} to="/wishlist" className="px-0 py-2" onClick={() => setShowOffcanvas(false)}>
                <i className="bi bi-heart me-2"></i>Danh sách yêu thích
              </Nav.Link>
              <Nav.Link as={Link} to="/cart" className="px-0 py-2" onClick={() => setShowOffcanvas(false)}>
                <i className="bi bi-bag me-2"></i>Giỏ hàng
              </Nav.Link>
              {user && (
                <>
                  <Nav.Link as={Link} to="/profile" className="px-0 py-2" onClick={() => setShowOffcanvas(false)}>
                    <i className="bi bi-person me-2"></i>Hồ sơ cá nhân
                  </Nav.Link>
                  <Nav.Link as={Link} to="/orders" className="px-0 py-2" onClick={() => setShowOffcanvas(false)}>
                    <i className="bi bi-receipt me-2"></i>Đơn hàng của tôi
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout} className="px-0 py-2 text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                  </Nav.Link>
                </>
              )}
            </Nav>
          </div>

          {/* Contact Info */}
          <div className="p-3 bg-light mt-auto">
            <h6 className="text-uppercase text-muted mb-3" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
              Liên hệ
            </h6>
            <div className="mb-2">
              <i className="bi bi-telephone me-2"></i>
              <a href="tel:1900-1234" className="text-decoration-none">
                1900 1234
              </a>
            </div>
            <div className="mb-2">
              <i className="bi bi-envelope me-2"></i>
              <a href="mailto:info@perfumeshop.com" className="text-decoration-none">
                info@perfumeshop.com
              </a>
            </div>
            <div className="d-flex gap-2 mt-3">
              <a href="#" className="btn btn-sm btn-outline-dark rounded-circle">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-dark rounded-circle">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-dark rounded-circle">
                <i className="bi bi-tiktok"></i>
              </a>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Scroll to top button */}
      {isScrolled && (
        <button
          className="btn btn-primary rounded-circle position-fixed"
          style={{
            bottom: "20px",
            right: "20px",
            width: "40px",
            height: "40px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            background: "linear-gradient(to right, #e83e8c, #6f42c1)",
            border: "none",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}

      {/* CSS cho header */}
      {/* <style jsx="true">{`
        .sticky-header {
          animation: slideDown 0.3s ease-in-out;
        }
        
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style> */}
    </header>
  )
}

export default Header
