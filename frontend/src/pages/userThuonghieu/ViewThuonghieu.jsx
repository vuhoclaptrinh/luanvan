"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { Container, Row, Col, Button, Modal, Badge, Spinner, Form } from "react-bootstrap"
import { FilterAlt, GridView, ViewList } from "@mui/icons-material"
import { Helmet } from "react-helmet"
import axios from "axios"

// Import components từ ViewDM
import ProductGrid from "../userSanpham/ProductGrid"
import FilterSidebar from "../userSanpham/FilterSidebar"
import { addToCart } from "../userCart/addcart"
import "./styles.css"
import { addtowwishlist } from "../userWishlist/Addwishlist"

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg?height=300&width=300"
  if (path.startsWith("http")) return path
  return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, "")}`
}

const ViewBrand = () => {
  const { brand } = useParams()
  const decodedBrand = decodeURIComponent(brand)

  // States tương tự ViewDM
  const [brandInfo, setBrandInfo] = useState(null)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visibleCount, setVisibleCount] = useState(9)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [viewMode, setViewMode] = useState("grid")
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
    const fetchBrandProducts = async () => {
      setLoading(true)
      try {
        console.log(`Fetching products for brand: ${decodedBrand}`)

        // Fetch tất cả sản phẩm từ API
        const response = await axios.get("http://127.0.0.1:8000/api/sanpham")
        console.log("All products response:", response.data)

        const allProducts = response.data.data || []

        // Filter sản phẩm theo thương hiệu
        const brandProducts = allProducts.filter(
          (product) => product.thuong_hieu?.toLowerCase() === decodedBrand.toLowerCase(),
        )

        console.log(`Found ${brandProducts.length} products for brand: ${decodedBrand}`)

        if (brandProducts.length === 0) {
          setProducts([])
          setFilteredProducts([])
          setLoading(false)
          return
        }

        // Set brand info từ sản phẩm đầu tiên
        setBrandInfo({
          ten_thuong_hieu: decodedBrand,
          so_luong_san_pham: brandProducts.length,
          mo_ta: `Khám phá bộ sưu tập nước hoa ${decodedBrand} chính hãng với ${brandProducts.length} sản phẩm đa dạng.`,
        })

        setProducts(brandProducts)
        setFilteredProducts(brandProducts)

        // Extract unique categories và brands từ sản phẩm của thương hiệu
        const uniqueCategories = [...new Set(brandProducts.map((p) => p.danh_muc_ten).filter(Boolean))]
        const uniqueBrands = [...new Set(brandProducts.map((p) => p.thuong_hieu).filter(Boolean))]

        // Find max price
        const prices = brandProducts
          .map((p) => {
            const price = Number.parseFloat(p.gia_format?.replace(/[^\d]/g, "")) || 0
            return price
          })
          .filter((price) => price > 0)

        const highestPrice = prices.length > 0 ? Math.max(...prices) : 10000000

        setMaxPrice(highestPrice)
        setPriceRange([0, highestPrice])
        setCategories(uniqueCategories)
        setBrands(uniqueBrands)

        console.log(`Setup complete:`)
        console.log(`- Products: ${brandProducts.length}`)
        console.log(`- Categories: ${uniqueCategories.length}`)
        console.log(`- Max Price: ${highestPrice.toLocaleString("vi-VN")}`)
      } catch (err) {
        console.error("Error fetching brand products:", err)
        setError("Không thể tải dữ liệu sản phẩm.")
      } finally {
        setLoading(false)
      }
    }

    if (decodedBrand) {
      fetchBrandProducts()
    }
  }, [decodedBrand])

  // Apply filters - tương tự ViewDM
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

    // Filter by brands (trong trường hợp này sẽ luôn là brand hiện tại)
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
      case "newest":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case "popular":
        result.sort((a, b) => (b.so_luong_ton || 0) - (a.so_luong_ton || 0))
        break
      default:
        break
    }

    setFilteredProducts(result)
    console.log(`Filtered results: ${result.length} products`)
  }, [products, selectedCategories, selectedBrands, priceRange, inStockOnly, searchQuery, sortOption])

  // Event handlers - tương tự ViewDM
  const handleCardClick = useCallback((product) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
  }, [])

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

  const resetFilters = useCallback(() => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, maxPrice])
    setInStockOnly(false)
    setSearchQuery("")
    setSortOption("default")
    setVisibleCount(9)
  }, [maxPrice])

  const toggleMobileFilters = () => {
    setMobileFiltersVisible(!mobileFiltersVisible)
  }

  // Loading state
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <div className="mt-3">
          <p>Đang tải sản phẩm thương hiệu {decodedBrand}...</p>
          <small className="text-muted">Vui lòng đợi trong giây lát</small>
        </div>
      </Container>
    )
  }

  // Error state
  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
        <div className="d-flex gap-2 justify-content-center">
          <Button variant="primary" onClick={() => window.location.reload()}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Thử lại
          </Button>
          <Button variant="outline-secondary" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left me-1"></i>
            Quay lại
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <>
      <Helmet>
        <title>{decodedBrand} - Nước hoa chính hãng | PerfumeShop</title>
        <meta
          name="description"
          content={`Khám phá ${products.length} sản phẩm nước hoa ${decodedBrand} chính hãng với giá tốt nhất. Giao hàng nhanh, đảm bảo chất lượng.`}
        />
        <meta name="keywords" content={`${decodedBrand}, nước hoa, perfume, ${categories.join(", ")}`} />
      </Helmet>

      {/* Breadcrumb */}
      {brandInfo && (
        <Container className="py-2">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/home" className="text-decoration-none">
                  <i className="bi bi-house-door me-1"></i>
                  Trang chủ
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="" className="text-decoration-none">
                  Thương hiệu
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {decodedBrand}
              </li>
            </ol>
          </nav>
        </Container>
      )}

      {/* Brand Header */}
      {brandInfo && (
        <Container className="mb-4">
          <div
            className="brand-header text-white p-4 rounded"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="position-relative z-2">
              <h1 className="display-4 fw-bold mb-3">{decodedBrand}</h1>
              {brandInfo.mo_ta && <p className="lead mb-3 opacity-90">{brandInfo.mo_ta}</p>}
              <div className="d-flex justify-content-center gap-3">
                <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                  <i className="bi bi-box-seam me-1"></i>
                  {products.length} sản phẩm
                </Badge>
                <Badge bg="success" className="fs-6 px-3 py-2">
                  <i className="bi bi-check-circle me-1"></i>
                  {products.filter((p) => p.so_luong_ton > 0).length} còn hàng
                </Badge>
                {categories.length > 0 && (
                  <Badge bg="info" className="fs-6 px-3 py-2">
                    <i className="bi bi-tags me-1"></i>
                    {categories.length} danh mục
                  </Badge>
                )}
                {/* {products.length > 0 && (
                  <Badge bg="warning" text="dark" className="fs-6 px-3 py-2">
                    <i className="bi bi-currency-dollar me-1"></i>
                    Từ{" "}
                    {Math.min(
                      ...products.map((p) => Number.parseFloat(p.gia_format?.replace(/[^\d]/g, "")) || 0),
                    ).toLocaleString("vi-VN")}
                    ₫
                  </Badge>
                )} */}
              </div>
            </div>
          </div>
        </Container>
      )}

      <section className="py-4 bg-light">
        <Container fluid>
          {/* Controls Bar */}
          <Row className="mb-4">
            <Col>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="d-flex align-items-center mb-2 mb-md-0">
                    <Button variant="outline-primary" className="me-3 d-md-none" onClick={toggleMobileFilters}>
                      <FilterAlt fontSize="small" className="me-1" />
                      Bộ lọc
                    </Button>
                    <div>
                      <h5 className="m-0 text-primary">
                        <i className="bi bi-grid me-2"></i>
                        {filteredProducts.length} sản phẩm
                      </h5>
                      {filteredProducts.length !== products.length && (
                        <small className="text-muted">(từ tổng số {products.length} sản phẩm)</small>
                      )}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {/* View Mode Toggle */}
                    <div className="btn-group d-none d-md-flex" role="group">
                      <Button
                        variant={viewMode === "grid" ? "primary" : "outline-primary"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        title="Xem dạng lưới"
                      >
                        <GridView fontSize="small" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "primary" : "outline-primary"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        title="Xem dạng danh sách"
                      >
                        <ViewList fontSize="small" />
                      </Button>
                    </div>

                    {/* Sort Dropdown */}
                    <Form.Select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      style={{ width: "200px" }}
                      size="sm"
                    >
                      <option value="default">Sắp xếp mặc định</option>
                      <option value="newest">Mới nhất</option>
                      <option value="popular">Phổ biến nhất</option>
                      <option value="price-asc">Giá: Thấp → Cao</option>
                      <option value="price-desc">Giá: Cao → Thấp</option>
                      <option value="name-asc">Tên: A → Z</option>
                      <option value="name-desc">Tên: Z → A</option>
                    </Form.Select>
                  </div>
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
              {products.length === 0 ? (
                <div className="text-center py-5 bg-white rounded shadow-sm">
                  <i className="bi bi-search display-1 text-muted"></i>
                  <h4 className="mt-3">Không tìm thấy sản phẩm nào</h4>
                  <p className="text-muted">Thương hiệu "{decodedBrand}" hiện không có sản phẩm nào.</p>
                  <Button variant="primary" onClick={() => window.history.back()}>
                    <i className="bi bi-arrow-left me-1"></i>
                    Quay lại
                  </Button>
                </div>
              ) : (
                <ProductGrid
                  filteredProducts={filteredProducts}
                  visibleCount={visibleCount}
                  viewMode={viewMode}
                  handleCardClick={handleCardClick}
                  handleShowMore={handleShowMore}
                  resetFilters={resetFilters}
                  getImageUrl={getImageUrl}
                />
              )}
            </Col>
          </Row>

          {/* Product Detail Modal  */}
          <Modal
            show={selectedProduct !== null}
            onHide={handleCloseModal}
            size="lg"
            centered
            className="product-detail-modal"
          >
            <Modal.Header closeButton className="border-0 pb-0">
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
                      className="img-fluid rounded shadow-sm"
                      style={{ width: "100%", height: "350px", objectFit: "cover" }}
                    />

                    {selectedProduct?.images?.length > 1 && (
                      <>
                        <Button
                          variant="light"
                          size="sm"
                          className="position-absolute top-50 start-0 translate-middle-y rounded-circle p-2 shadow"
                          onClick={handlePrevImage}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="position-absolute top-50 end-0 translate-middle-y rounded-circle p-2 shadow"
                          onClick={handleNextImage}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </Button>
                        <div className="text-center mt-2">
                          <Badge bg="dark" className="opacity-75">
                            {currentImageIndex + 1} / {selectedProduct.images.length}
                          </Badge>
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
                            className={`img-thumbnail cursor-pointer ${index === currentImageIndex ? "border-primary border-2" : ""}`}
                            style={{
                              height: "60px",
                              objectFit: "cover",
                              cursor: "pointer",
                              opacity: index === currentImageIndex ? 1 : 0.7,
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
                      <div className="mb-3">
                        <Badge bg="light" text="dark" className="me-2 px-3 py-2">
                          <i className="bi bi-award me-1"></i>
                          {selectedProduct.thuong_hieu}
                        </Badge>
                        {selectedProduct?.danh_muc_ten && (
                          <Badge bg="primary" className="px-3 py-2">
                            <i className="bi bi-tag me-1"></i>
                            {selectedProduct.danh_muc_ten}
                          </Badge>
                        )}
                      </div>
                    )}
                    <h3 className="fs-4 mb-3 text-dark">{selectedProduct?.ten_san_pham}</h3>
                    <div className="fs-2 fw-bold text-primary mb-3">{selectedProduct?.gia_format}</div>
                  </div>

                  <div className="mb-4">
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <tbody>
                          {selectedProduct?.dung_tich && (
                            <tr>
                              <td className="text-muted ps-0 fw-medium" style={{ width: "40%" }}>
                                <i className="bi bi-droplet me-2"></i>
                                Dung tích:
                              </td>
                              <td className="fw-medium">{selectedProduct.dung_tich}</td>
                            </tr>
                          )}
                          {selectedProduct?.so_luong_ton !== undefined && (
                            <tr>
                              <td className="text-muted ps-0 fw-medium">
                                <i className="bi bi-box-seam me-2"></i>
                                Tình trạng:
                              </td>
                              <td>
                                {selectedProduct.so_luong_ton > 0 ? (
                                  <Badge bg="success" className="px-3 py-2">
                                    <i className="bi bi-check-circle me-1"></i>
                                    Còn hàng ({selectedProduct.so_luong_ton})
                                  </Badge>
                                ) : (
                                  <Badge bg="danger" className="px-3 py-2">
                                    <i className="bi bi-x-circle me-1"></i>
                                    Hết hàng
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          )}
                          {selectedProduct?.danh_muc_ten && (
                            <tr>
                              <td className="text-muted ps-0 fw-medium">
                                <i className="bi bi-collection me-2"></i>
                                Danh mục:
                              </td>
                              <td className="fw-medium">{selectedProduct.danh_muc_ten}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {selectedProduct?.mo_ta && (
                    <div className="mb-4">
                      <h5 className="fs-6 fw-bold mb-2 text-primary">
                        <i className="bi bi-info-circle me-2"></i>
                        Mô tả sản phẩm:
                      </h5>
                      <p className="text-muted lh-lg">{selectedProduct.mo_ta}</p>
                    </div>
                  )}

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      className="fw-bold"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderColor: "transparent",
                        padding: "12px 24px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(selectedProduct)
                      }}
                      disabled={selectedProduct?.so_luong_ton === 0}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      {selectedProduct?.so_luong_ton === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                    </Button>
                    <Button variant="outline-secondary" size="lg" onClick={(e) => {
                      e.stopPropagation()
                      addtowwishlist(selectedProduct)
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
    </>
  )
}

export default ViewBrand
