"use client";
import { Form, Button, Accordion } from "react-bootstrap";
import { Close } from "@mui/icons-material";
import { Range } from "react-range";

const FilterSidebar = ({
  categories,
  brands,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  maxPrice,
  inStockOnly,
  setInStockOnly,
  searchQuery,
  setSearchQuery,
  resetFilters,
  mobileFiltersVisible,
  toggleMobileFilters,
}) => {
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div
      className={`filter-sidebar bg-white p-3 rounded shadow-sm ${
        mobileFiltersVisible ? "mobile-filters-visible" : ""
      }`}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">Bộ lọc</h5>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={resetFilters}
            className="d-flex align-items-center"
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i> Đặt lại
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="d-md-none"
            onClick={toggleMobileFilters}
          >
            <Close fontSize="small" />
          </Button>
        </div>
      </div>

      <Form.Group className="mb-3">
        <Form.Control
          type="search"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      <Accordion
        defaultActiveKey={["0", "1", "2"]}
        alwaysOpen
        className="filter-accordion"
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>Danh mục</Accordion.Header>
          <Accordion.Body className="py-2 px-1">
            <div
              className="category-list"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {categories.map((category, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  id={`category-${index}`}
                  label={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="mb-2"
                />
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Thương hiệu</Accordion.Header>
          <Accordion.Body className="py-2 px-1">
            <div
              className="brand-list"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {brands.map((brand, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  id={`brand-${index}`}
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="mb-2"
                />
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Giá</Accordion.Header>
          <Accordion.Body className="py-3 px-2">
            <div className="price-range-slider mb-3">
              <Range
                step={50000}
                min={0}
                max={maxPrice}
                values={priceRange}
                onChange={(values) => setPriceRange(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "6px",
                      width: "100%",
                      backgroundColor: "#e9ecef",
                    }}
                  >
                    <div
                      style={{
                        height: "6px",
                        width: `${
                          ((priceRange[1] - priceRange[0]) * 100) / maxPrice
                        }%`,
                        left: `${(priceRange[0] * 100) / maxPrice}%`,
                        position: "absolute",
                        backgroundColor: "#6f42c1",
                        borderRadius: "3px",
                      }}
                    />
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => {
                  const { key, ...rest } = props;
                  return (
                    <div
                      key={key}
                      {...rest}
                      style={{
                        ...rest.style,
                        height: "20px",
                        width: "20px",
                        backgroundColor: "#ffffff",
                        border: "2px solid #6f42c1",
                        borderRadius: "50%",
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
                      }}
                    />
                  );
                }}
              />
            </div>
            <div className="d-flex justify-content-between">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="mt-3">
        <Form.Check
          type="switch"
          id="in-stock-switch"
          label="Chỉ hiển thị sản phẩm còn hàng"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
        />
      </div>
    </div>
  );
};

export default FilterSidebar;
