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
//import { addtowwishlist } from "../userWishlist/Addwishlist"
import { addToWishlist } from "../userWishlist/Addwishlist"
import ProductDetailModal from "../../components/ProductDetail"
//hook
import Chitiietspdg from "../../hook/Chitietspdg"

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
    setLoading(true);
    try {
      // B1: Gọi API tất cả sản phẩm
      const response = await axios.get("http://127.0.0.1:8000/api/sanpham");
      const allProducts = response.data.data || [];

      // B2: Lọc theo thương hiệu
      const brandProducts = allProducts.filter(
        (product) =>
          product.thuong_hieu?.toLowerCase() === decodedBrand.toLowerCase()
      );

      if (brandProducts.length === 0) {
        setProducts([]);
        setFilteredProducts([]);
        return;
      }

      // B3: Gán thông tin thương hiệu (sử dụng sản phẩm đầu tiên)
      setBrandInfo({
        ten_thuong_hieu: decodedBrand,
        so_luong_san_pham: brandProducts.length,
        mo_ta: `Khám phá bộ sưu tập nước hoa ${decodedBrand} chính hãng với ${brandProducts.length} sản phẩm đa dạng.`,
      });

      setProducts(brandProducts);
      setFilteredProducts(brandProducts);

      // B4: Lọc danh mục & thương hiệu (từ danh sách sản phẩm của thương hiệu)
      const uniqueCategories = [...new Set(brandProducts.map((p) => p.danh_muc_ten).filter(Boolean))];
      const uniqueBrands = [...new Set(brandProducts.map((p) => p.thuong_hieu).filter(Boolean))];

      // B5: Tính giá cao nhất
      const prices = brandProducts
        .map((p) => Number.parseFloat(p.gia_format?.replace(/[^\d]/g, "")) || 0)
        .filter((price) => price > 0);

      const highestPrice = prices.length > 0 ? Math.max(...prices) : 30000000;

      setMaxPrice(highestPrice);
      setPriceRange([0, highestPrice]);
      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm theo thương hiệu:", err);
      setError("Không thể tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  if (decodedBrand) {
    fetchBrandProducts();
  }
}, [decodedBrand]);


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
    const getMinPrice = (product) => {
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        const prices = product.variants
          .map((v) => Number(v.gia))
          .filter((gia) => !isNaN(gia));
        return prices.length > 0 ? Math.min(...prices) : 0;
      }

      return Number.parseFloat(product.gia_format?.replace(/[^\d]/g, "")) || 0;
    };
   // Filter by stock
      if (inStockOnly) {
      result = result.filter((p) => {
        if (Array.isArray(p.variants) && p.variants.length > 0) {
          return p.variants.some(v => Number(v.so_luong_ton) > 0);
        }
        return Number(p.so_luong_ton) > 0;
      });
    }

    // Apply sorting
    switch (sortOption) {
       case "price-asc":
        result.sort((a, b) => {
          const priceA = getMinPrice(a);
          const priceB = getMinPrice(b);
          return priceA - priceB;
        });
        break;
      case "price-desc":
        result.sort((a, b) => {
          const priceA = getMinPrice(a);
          const priceB = getMinPrice(b);
          return priceB - priceA;
        });
        break;
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
                {
                  products.filter((p) => {
                    if (Array.isArray(p.variants) && p.variants.length > 0) {
                      return p.variants.some(v => Number(v.so_luong_ton) > 0)
                    }
                    return Number(p.so_luong_ton) > 0
                  }).length
                }{" "}
                còn hàng
              </Badge>
                {categories.length > 0 && (
                  <Badge bg="info" className="fs-6 px-3 py-2">
                    <i className="bi bi-tags me-1"></i>
                    {categories.length} danh mục
                  </Badge>
                )}
             
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

          <ProductDetailModal
            product={selectedProduct}
            show={selectedProduct !== null}
            onHide={() => setSelectedProduct(null)}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
          />
         
        </Container>
      </section>
    </>
  )
}

export default ViewBrand
