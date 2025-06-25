"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Row, Col, Container, Modal, Button, Badge, Spinner, Form } from "react-bootstrap"
import { FilterAlt, GridView, ViewList } from "@mui/icons-material"
import ProductGrid from "../userSanpham/ProductGrid"

import FilterSidebar from "../userSanpham/FilterSidebar"
import "./styles.css"
import { addToCart } from "../userCart/addcart"
import { useParams } from "react-router-dom"
import { addtowwishlist } from "../userWishlist/Addwishlist"
import ProductDetailModal from "../../components/ProductDetail"

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg?height=300&width=300"
  if (path.startsWith("http")) return path
  return `http://127.0.0.1:8000/storage/images/${path.replace(/^images\//, "")}`
}

const ViewDM = () => {
  const { id } = useParams()
  const [categoryInfo, setCategoryInfo] = useState(null)
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
    const fetchCategoryAndProducts = async () => {
      setLoading(true)
      try {
        console.log(`Fetching category ${id}...`)

        // Step 1: Fetch category info and basic product list
        const categoryResponse = await axios.get(`http://127.0.0.1:8000/api/danhmuc/${id}`)
        console.log("Category API Response:", categoryResponse.data)

        const categoryData = categoryResponse.data
        const basicProducts = categoryData.sanphams || []

        // Set category info
        setCategoryInfo({
          id: categoryData.id,
          ten_danh_muc: categoryData.ten_danh_muc,
          mo_ta: categoryData.mo_ta,
          created_at: categoryData.created_at,
          updated_at: categoryData.updated_at,
        })

        if (basicProducts.length === 0) {
          setProducts([])
          setFilteredProducts([])
          setLoading(false)
          return
        }

        // Step 2: Fetch detailed product information
        console.log(`Fetching detailed info for ${basicProducts.length} products...`)
        const productIds = basicProducts.map((p) => p.id)

        // Fetch all products and filter by IDs (more efficient than individual calls)
        const allProductsResponse = await axios.get("http://127.0.0.1:8000/api/sanpham")
        const allProducts = allProductsResponse.data.data || []

        // Filter products that belong to this category
        const detailedProducts = allProducts.filter((product) => productIds.includes(product.id))

        console.log(`Found ${detailedProducts.length} detailed products`)
        console.log("Sample product:", detailedProducts[0])

        setProducts(detailedProducts)
        setFilteredProducts(detailedProducts)

        // Extract unique categories and brands from detailed products
        const uniqueCategories = [...new Set(detailedProducts.map((p) => p.danh_muc_ten).filter(Boolean))]
        const uniqueBrands = [...new Set(detailedProducts.map((p) => p.thuong_hieu).filter(Boolean))]

        // Find max price
        const prices = detailedProducts
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
        console.log(`- Products: ${detailedProducts.length}`)
        console.log(`- Categories: ${uniqueCategories.length}`)
        console.log(`- Brands: ${uniqueBrands.length}`)
        console.log(`- Max Price: ${highestPrice.toLocaleString("vi-VN")}`)
      } catch (err) {
        console.error("Error fetching data:", err)
        if (err.response?.status === 404) {
          setError("Không tìm thấy danh mục này.")
        } else if (err.response?.data?.messsage) {
          setError(err.response.data.messsage)
        } else {
          setError("Không thể tải dữ liệu danh mục.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCategoryAndProducts()
    }
  }, [id])

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
      case "newest":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case "popular":
        // Sort by stock quantity (higher stock = more popular)
        result.sort((a, b) => (b.so_luong_ton || 0) - (a.so_luong_ton || 0))
        break
      default:
        // Default sorting
        break
    }

    setFilteredProducts(result)
    console.log(`Filtered results: ${result.length} products`)
  }, [products, selectedCategories, selectedBrands, priceRange, inStockOnly, searchQuery, sortOption])

  const handleCardClick = (product) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
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
    setVisibleCount(9)
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
        <div className="mt-3">
          <p>Đang tải thông tin danh mục...</p>
          <small className="text-muted">Vui lòng đợi trong giây lát</small>
        </div>
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
      {/* Breadcrumb */}
      {categoryInfo && (
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
                  Danh mục
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {categoryInfo.ten_danh_muc}
              </li>
            </ol>
          </nav>
        </Container>
      )}

      {/* Category Header */}
      {categoryInfo && (
        <Container className="mb-4">
          <div
            className="brand-header text-white p-4 rounded"
            style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            position: "relative",
            overflow: "hidden",
            }}
          >
            <div className="position-relative z-2"      >
              <h1 className="display-4 fw-bold mb-3">{categoryInfo.ten_danh_muc}</h1>
              {categoryInfo.mo_ta && <p className="lead mb-3 opacity-90">{categoryInfo.mo_ta}</p>}
              <div className="d-flex justify-content-center gap-3">
                <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                  <i className="bi bi-box-seam me-1"></i>
                  {products.length} sản phẩm
                </Badge>
                <Badge bg="success" className="fs-6 px-3 py-2">
                  <i className="bi bi-check-circle me-1"></i>
                  {products.filter((p) => p.so_luong_ton > 0).length} còn hàng
                </Badge>
              </div>
            </div>
            {/* Decorative elements */}
            
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
                  <i className="bi bi-box display-1 text-muted"></i>
                  <h4 className="mt-3">Danh mục này chưa có sản phẩm</h4>
                  <p className="text-muted">Vui lòng quay lại sau hoặc xem các danh mục khác</p>
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

          <ProductDetailModal product={selectedProduct}
            show={selectedProduct !== null}
            onHide={() => setSelectedProduct(null)}
            addToCart={addToCart}
            addToWishlist={addtowwishlist}/>
        </Container>
      </section>
    </>
  )
}

export default ViewDM
