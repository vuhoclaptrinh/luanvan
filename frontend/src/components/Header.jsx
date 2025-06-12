import { useState, useEffect } from "react";
import {
  Navbar, Nav, Container, Form, Button,
  InputGroup, Badge, Offcanvas, Dropdown
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/img/logo.jpg";
import { Box, Avatar, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

  //Nav
const NAV_LINKS = [
  { href: "/home", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/categories", label: "Danh mục" },
  { href: "/brands", label: "Thương hiệu" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/contact", label: "Liên hệ" },
];

//set ten
const getFullName = (user) => {
  if (!user) return "";
  return `${user.first_name || ""} ${user.last_name || ""}`.trim();
};

function Header({ cartCount = 0, wishlistCount = 0 }) {
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Lấy user 
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Lỗi khi lấy user:", err);
      }
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/home");
  };

  return (
    <header>
      <Navbar bg="white" expand="lg" className="shadow-sm py-3">
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center">
            <img src={Logo} alt="Logo" width="32" height="32" className="rounded-circle" />
            <span className="ms-2 fw-bold">PerfumeShop</span>
          </Navbar.Brand>

          {/* Mobile icons */}
          <div className="d-flex align-items-center ms-auto d-lg-none">
            <Button variant="link" className="text-dark me-2" onClick={() => setShowSearch(!showSearch)}>
              <i className="bi bi-search"></i>
            </Button>
            
            <Link to="/cart" className="text-dark position-relative me-2">
              <i className="bi bi-bag"></i>
              {cartCount > 0 && (
                <Badge pill bg="primary" className="position-absolute top-0 end-0 translate-middle">
                  {cartCount}
                </Badge>
              )}
            </Link>

            <Button variant="link" className="text-dark" onClick={() => setShowOffcanvas(true)}>
              <i className="bi bi-list fs-4"></i>
            </Button>
          </div>

          {/* Main menu (desktop) */}
          <Nav className="mx-auto d-none d-lg-flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Nav.Link key={href} as={Link} to={href} className="mx-2">
                {label}
              </Nav.Link>
            ))}
          </Nav>

          {/* phải */}
          <div className="d-none d-lg-flex align-items-center">
            {/* tìm kiếm */}
            <Form onSubmit={handleSearch} className="me-3">
              <InputGroup>
                <Form.Control
                  placeholder="Tìm kiếm nước hoa..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button type="submit" variant="outline-secondary">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </Form>

            {/* yêu thích */}
            <Link to="/wishlist" className="text-dark position-relative me-2">
              <i className="bi bi-heart"></i>
              {wishlistCount > 0 && (
                <Badge pill bg="danger" className="position-absolute top-0 end-0 translate-middle">
                  {wishlistCount}
                </Badge>
              )}
            </Link>

            {/* giỏ hàng */}
            <Link to="/cart" className="text-dark position-relative me-2">
              <i className="bi bi-bag"></i>
              {cartCount > 0 && (
                <Badge pill bg="primary" className="position-absolute top-0 end-0 translate-middle">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* tài khoản */}
           {user ? (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="text-dark d-flex align-items-center p-0 border-0"
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "gray",
                      width: 40,
                      height: 40,
                      fontSize: 16,
                      mr: 1,
                    }}
                  >
                    {getFullName(user).charAt(0).toUpperCase()}
                  </Avatar>
                  
                </Box>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">
                <div className="d-flex justify-content-center align-items-center">
                    {user.ho_ten}
                  </div>
                <p></p>
                  <i className="bi bi-person me-2"></i>Hồ sơ
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            ) : (
              <Link to="/login" className="text-dark p-1">
                <i className="bi bi-person fs-5"></i>
              </Link>
            )}

          </div>
          
        </Container>
      </Navbar>

      {/* Search Mobile */}
      {showSearch && (
        <div className="py-3 border-top d-lg-none">
          <Container>
            <Form onSubmit={handleSearch}>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm nước hoa..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </InputGroup>
            </Form>
          </Container>
        </div>
      )}

      {/* Offcanvas Mobile Menu */}
      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {NAV_LINKS.map(({ href, label }) => (
              <Nav.Link key={href} as={Link} to={href} className="py-2 fs-5" onClick={() => setShowOffcanvas(false)}>
                {label}
              </Nav.Link>
            ))}
            <hr />
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile" className="py-2 fs-5">
                  <i className="bi bi-person me-2"></i>Xin chào, {getFullName(user)}
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className="py-2 fs-5">
                  <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="py-2 fs-5">
                <i className="bi bi-person me-2"></i>Đăng nhập
              </Nav.Link>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
}

export default Header;
