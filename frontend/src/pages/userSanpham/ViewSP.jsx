"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Row, Col, Container, Modal, Button, Badge, Spinner, Form , Offcanvas } from "react-bootstrap"
import { FilterAlt, GridView, ViewList } from "@mui/icons-material"
import ProductGrid from "./ProductGrid"
import FilterSidebar from "./FilterSidebar"
import "./styles.css"
import { addToCart } from "../userCart/addcart"
// import { addtowwishlist } from "../userWishlist/Addwishlist"
import { addToWishlist } from "../userWishlist/Addwishlist"
import ProductDetailModal from "../../components/ProductDetail"

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
    setLoading(true);
    try {
      const { data } = await axios.get("http://127.0.0.1:8000/api/sanpham");
      const productsData = data?.data || [];

      setProducts(productsData);
      setFilteredProducts(productsData);

      // Lọc danh mục và thương hiệu duy nhất
      const uniqueCategories = [...new Set(productsData.map(p => p.danh_muc_ten).filter(Boolean))];
      const uniqueBrands = [...new Set(productsData.map(p => p.thuong_hieu).filter(Boolean))];

      // Tính giá cao nhất (fallback nếu không có giá nào)
      const prices = productsData
        .map(p => Number.parseFloat(p.gia_format?.replace(/[^\d]/g, "")) || 0)
        .filter(p => p > 0);

      const highestPrice = prices.length > 0 ? Math.max(...prices) : 30000000;

      setMaxPrice(highestPrice);
      setPriceRange([0, highestPrice]);
      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
      setError("Không thể tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


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
  // Nếu có biến thể, duyệt từng variant để lấy giá
    if (Array.isArray(p.variants) && p.variants.length > 0) {
      return p.variants.some((v) => {
        const gia = Number(v.gia) || 0;
        return gia >= priceRange[0] && gia <= priceRange[1];
      });
    }

    // Nếu không có biến thể, dùng giá gốc
    const gia = Number.parseFloat(p.gia_format?.replace(/[^\d]/g, "")) || 0;
    return gia >= priceRange[0] && gia <= priceRange[1];
    });

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
        // Nếu có biến thể, chỉ giữ sản phẩm có ít nhất 1 biến thể còn hàng
        return p.variants.some(v => Number(v.so_luong_ton) > 0);
      }
      // Nếu không có biến thể, dùng so_luong_ton gốc
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

        <ProductDetailModal
            product={selectedProduct}
            show={selectedProduct !== null}
            onHide={() => setSelectedProduct(null)}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
          />
      </Container>
    </section>
  )
}

export default ViewSP
