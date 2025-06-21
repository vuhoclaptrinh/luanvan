"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Row, Col, Container, Modal, Button, Badge, Spinner, Form } from "react-bootstrap"
import { FilterAlt, GridView, ViewList } from "@mui/icons-material"
import ProductGrid from "./ProductGrid"
import FilterSidebar from "./FilterSidebar"
import "./styles.css"
import { addToCart } from "../userCart/addcart"
import { addtowwishlist } from "../userWishlist/Addwishlist"

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg?height=300&width=300"
  if (path.startsWith("http")) return path
  return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, "")}`
}

const ViewSP = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visibleCount, setVisibleCount] = useState(9)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  // const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [sortOption, setSortOption] = useState("default")
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false)

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [maxPrice, setMaxPrice] = useState(10000000)
  const [searchQuery, setSearchQuery] = useState("")
  const [inStockOnly, setInStockOnly] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/sanpham")
        const productsData = response.data.data || []
        setProducts(productsData)
        setFilteredProducts(productsData)

        // Extract unique categories and brands
        const uniqueCategories = [...new Set(productsData.map((p) => p.danh_muc_ten).filter(Boolean))]
        const uniqueBrands = [...new Set(productsData.map((p) => p.thuong_hieu).filter(Boolean))]

        // Find max price
        const highestPrice = Math.max(
          ...productsData.map((p) => {
            const price = Number.parseFloat(p.gia_format?.replace(/[^\d]/g, "")) || 0
            return price
          }),
        )

        setMaxPrice(highestPrice || 10000000)
        setPriceRange([0, highestPrice || 10000000])
        setCategories(uniqueCategories)
        setBrands(uniqueBrands)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Không thể tải dữ liệu sản phẩm.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...products]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.ten_san_pham?.toLowerCase().includes(query) ||
          p.mo_ta?.toLowerCase().includes(query) ||
          p.thuong_hieu?.toLowerCase().includes(query),
      )
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.danh_muc_ten))
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.thuong_hieu))
    }

    // Filter by price range
    result = result.filter((p) => {
      const price = Number.parseFloat(p.gia_format?.replace(/[^\d]/g, "")) || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Filter by stock
    if (inStockOnly) {
      result = result.filter((p) => p.so_luong_ton > 0)
    }

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => {
          const priceA = Number.parseFloat(a.gia_format?.replace(/[^\d]/g, "")) || 0
          const priceB = Number.parseFloat(b.gia_format?.replace(/[^\d]/g, "")) || 0
          return priceA - priceB
        })
        break
      case "price-desc":
        result.sort((a, b) => {
          const priceA = Number.parseFloat(a.gia_format?.replace(/[^\d]/g, "")) || 0
          const priceB = Number.parseFloat(b.gia_format?.replace(/[^\d]/g, "")) || 0
          return priceB - priceA
        })
        break
      case "name-asc":
        result.sort((a, b) => (a.ten_san_pham || "").localeCompare(b.ten_san_pham || ""))
        break
      case "name-desc":
        result.sort((a, b) => (b.ten_san_pham || "").localeCompare(a.ten_san_pham || ""))
        break
      default:
        // Default sorting (newest first or featured)
        break
    }

    setFilteredProducts(result)
  }, [products, selectedCategories, selectedBrands, priceRange, inStockOnly, searchQuery, sortOption])

  const handleCardClick = (product) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
    setCurrentImageIndex(0)
  }

  const handleNextImage = () => {
    if (selectedProduct?.images?.length > 0) {
      setCurrentImageIndex((currentImageIndex + 1) % selectedProduct.images.length)
    }
  }

  const handlePrevImage = () => {
    if (selectedProduct?.images?.length > 0) {
      setCurrentImageIndex(currentImageIndex === 0 ? selectedProduct.images.length - 1 : currentImageIndex - 1)
    }
  }

  const handleShowMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 9, filteredProducts.length))
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, maxPrice])
    setInStockOnly(false)
    setSearchQuery("")
    setSortOption("default")
  }

  const toggleMobileFilters = () => {
    setMobileFiltersVisible(!mobileFiltersVisible)
  }

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
    <section className="py-4 bg-light">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <Button variant="outline-secondary" className="me-2 d-md-none" onClick={toggleMobileFilters}>
                  <FilterAlt fontSize="small" />
                </Button>
                <h5 className="m-0">Hiển thị {filteredProducts.length} sản phẩm</h5>
              </div>

              <div className="d-flex align-items-center">
                <div className="me-3 d-none d-md-flex">
                  <Button
                    variant={viewMode === "grid" ? "primary" : "outline-primary"}
                    className="me-1"
                    onClick={() => setViewMode("grid")}
                  >
                    <GridView fontSize="small" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "primary" : "outline-primary"}
                    onClick={() => setViewMode("list")}
                  >
                    <ViewList fontSize="small" />
                  </Button>
                </div>

                <Form.Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{ width: "auto" }}
                >
                  <option value="default">Sắp xếp mặc định</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
                </Form.Select>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Filter Sidebar - Desktop */}
          <Col md={3} lg={2} className="d-none d-md-block mb-4">
            <FilterSidebar
              categories={categories}
              brands={brands}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              resetFilters={resetFilters}
              mobileFiltersVisible={mobileFiltersVisible}
              toggleMobileFilters={toggleMobileFilters}
            />
          </Col>

          {/* Mobile Filter Overlay */}
          <div className={`mobile-filters-overlay ${mobileFiltersVisible ? "show" : ""}`}>
            <FilterSidebar
              categories={categories}
              brands={brands}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              resetFilters={resetFilters}
              mobileFiltersVisible={mobileFiltersVisible}
              toggleMobileFilters={toggleMobileFilters}
            />
          </div>

          {/* Products Grid */}
          <Col md={9} lg={10}>
            <ProductGrid
              filteredProducts={filteredProducts}
              visibleCount={visibleCount}
              viewMode={viewMode}
              handleCardClick={handleCardClick}
              handleShowMore={handleShowMore}
              resetFilters={resetFilters}
              getImageUrl={getImageUrl}
            />
          </Col>
        </Row>

        {/* Modal xem chi tiết sản phẩm */}
        <Modal
          show={selectedProduct !== null}
          onHide={handleCloseModal}
          size="lg"
          centered
          className="product-detail-modal"
        >
          <Modal.Header closeButton>
           <Modal.Title className="fs-5 text-primary">
                <i className="bi bi-eye me-2"></i>
                Chi tiết sản phẩm
              </Modal.Title>
          </Modal.Header> 
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <div className="position-relative mb-3">
                  <img
                    src={getImageUrl(selectedProduct?.images?.[currentImageIndex] || selectedProduct?.hinh_anh)}
                    alt={selectedProduct?.ten_san_pham}
                    className="img-fluid rounded"
                    style={{ width: "100%", height: "350px", objectFit: "cover" }}
                  />

                  {selectedProduct?.images?.length > 1 && (
                    <>
                      <Button
                        variant="light"
                        size="sm"
                        className="position-absolute top-50 start-0 translate-middle-y rounded-circle p-2 shadow-sm"
                        onClick={handlePrevImage}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        className="position-absolute top-50 end-0 translate-middle-y rounded-circle p-2 shadow-sm"
                        onClick={handleNextImage}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </Button>
                      <div className="text-center mt-2 text-muted small">
                        <i className="bi bi-info-circle me-1"></i>
                        Ảnh {currentImageIndex + 1} / {selectedProduct.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail gallery */}
                {selectedProduct?.images?.length > 1 && (
                  <Row className="g-2 mt-2">
                    {selectedProduct.images.map((img, index) => (
                      <Col key={index} xs={3}>
                        <img
                          src={getImageUrl(img) || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className={`img-thumbnail cursor-pointer ${index === currentImageIndex ? "border-primary" : ""}`}
                          style={{
                            height: "60px",
                            objectFit: "cover",
                            cursor: "pointer",
                            opacity: index === currentImageIndex ? 1 : 0.6,
                          }}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>

              <Col md={6}>
                <div className="mb-4">
                  {selectedProduct?.thuong_hieu && (
                    <div className="mb-2">
                      <Badge bg="light" text="dark" className="me-2 px-3 py-2">
                          <i className="bi bi-award me-1"></i>
                          {selectedProduct.thuong_hieu}
                        </Badge>
                      {selectedProduct?.danh_muc_ten && <Badge bg="primary">{selectedProduct.danh_muc_ten}</Badge>}
                    </div>
                  )}
                  <h3 className="fs-4 mb-3">{selectedProduct?.ten_san_pham}</h3>
                  <div className="fs-3 fw-bold text-primary mb-3">{selectedProduct?.gia_format}</div>
                </div>

                <div className="mb-4">
                  <table className="table table-borderless">
                    <tbody>
                      {selectedProduct?.dung_tich && (
                        <tr>
                          <td className="text-muted ps-0" style={{ width: "40%" }}>
                            Dung tích:
                          </td>
                          <td>{selectedProduct.dung_tich}</td>
                        </tr>
                      )}
                      {selectedProduct?.so_luong_ton !== undefined && (
                        <tr>
                          <td className="text-muted ps-0">Tình trạng:</td>
                          <td>
                            {selectedProduct.so_luong_ton > 0 ? (
                              <span className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Còn hàng ({selectedProduct.so_luong_ton})
                              </span>
                            ) : (
                              <span className="text-danger">
                                <i className="bi bi-x-circle me-1"></i>
                                Hết hàng
                              </span>
                            )}
                          </td>
                        </tr>
                      )}
                      {selectedProduct?.danh_muc_ten && (
                        <tr>
                          <td className="text-muted ps-0">Danh mục:</td>
                          <td>{selectedProduct.danh_muc_ten}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {selectedProduct?.mo_ta && (
                  <div className="mb-4">
                    <h5 className="fs-6 fw-bold mb-2">Mô tả sản phẩm:</h5>
                    <p className="text-muted">{selectedProduct.mo_ta}</p>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    style={{
                      background: "linear-gradient(to right, #e83e8c, #6f42c1)",
                      borderColor: "transparent",
                    }}
                     onClick={(e) => {
                    e.stopPropagation()
                    // Thêm vào giỏ hàng logic ở đây
                    addToCart(selectedProduct)

                    // alert(`Đã thêm ${selectedProduct.ten_san_pham} vào giỏ hàng!`)
                  }}
                  >
                    
                    <i className="bi bi-cart-plus me-2"></i>
                    Thêm vào giỏ hàng
                  </Button>
                  <Button variant="outline-secondary"  onClick={(e) => {
                    e.stopPropagation()
                    // Thêm vào giỏ hàng logic ở đây
                    addtowwishlist(selectedProduct)

                    // alert(`Đã thêm ${selectedProduct.ten_san_pham} vào wishlist!`)
                  }}>
                    <i className="bi bi-heart me-2"></i>
                    Thêm vào yêu thích
                  </Button>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Container>
    </section>
  )
}

export default ViewSP
