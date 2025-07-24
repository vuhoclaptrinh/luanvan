"use client";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";

// import { addToCart } from "../userCart/addcart"
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const ProductGrid = ({
  filteredProducts,
  visibleCount,
  viewMode,
  handleCardClick,
  handleShowMore,
  resetFilters,
  getImageUrl,
}) => {
  const [khachHangId, setKhachHangId] = useState(null);

  const [reviewContent, setReviewContent] = useState({});
  const [ratings, setRatings] = useState({});
  const [selectedStars, setSelectedStars] = useState({});
  const [daMuaMap, setDaMuaMap] = useState({});
  const [reviewedMap, setReviewedMap] = useState({});
  const [_, setReviewCounts] = useState({});
  const navigate = useNavigate();

  // const [daDanhGiaMap, setDaDanhGiaMap] = useState({});

  //lay khacsh hàng
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setKhachHangId(parsedUser.id); // giả sử object user có thuộc tính `id`
    }
  }, []);
  // Kiểm tra đã mua sản phẩm
  const fetchDaMua = async (productId, khachHangId) => {
    if (daMuaMap[productId] !== undefined) return; // tránh gọi lại

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/danhgia/kiemtra-da-mua/${khachHangId}/${productId}`
      );
      const data = await res.json();
      setDaMuaMap((prev) => ({ ...prev, [productId]: data.da_mua }));
    } catch (err) {
      console.error("Lỗi kiểm tra đã mua:", err);
    }
  };

  // Kiểm tra đã mua và đã đánh giá khi khachHangId thay đổi
  const fetchRatings = async () => {
    const newRatings = {};
    const newCounts = {};
    await Promise.all(
      filteredProducts.map(async (product) => {
        try {
          const res = await fetch(
            `http://127.0.0.1:8000/api/danhgia/trungbinh/${product.id}`
          );
          const data = await res.json();
          newRatings[product.id] = data.trung_binh || 0;
          newCounts[product.id] = data.so_luong || 0;
        } catch (error) {
          console.log(error.message);
          newRatings[product.id] = 0;
          newCounts[product.id] = 0;
        }
      })
    );
    setRatings(newRatings);
    setReviewCounts(newCounts);
  };

  // Kiểm tra đã đánh giá
  const fetchReviewed = async () => {
    if (!khachHangId) return;
    const newReviewed = {};
    await Promise.all(
      filteredProducts.map(async (product) => {
        try {
          const res = await fetch(
            `http://127.0.0.1:8000/api/danhgia/da-danh-gia/${khachHangId}/${product.id}`
          );
          const data = await res.json();
          newReviewed[product.id] = data.da_danh_gia || false;
        } catch (err) {
          console.log(err);
          newReviewed[product.id] = false;
        }
      })
    );
    setReviewedMap(newReviewed);
  };

  useEffect(() => {
    if (filteredProducts.length > 0) {
      fetchRatings();
      if (khachHangId) {
        fetchReviewed();
      }
    }
  }, [filteredProducts, khachHangId]);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded shadow-sm">
        <i className="bi bi-search display-1 text-muted"></i>
        <h4 className="mt-3">Không tìm thấy sản phẩm nào</h4>
        <p className="text-muted">Vui lòng thử lại với bộ lọc khác</p>
        <Button variant="primary" onClick={resetFilters}>
          Xóa bộ lọc
        </Button>
      </div>
    );
  }

  return (
    <>
      <Row className={`g-3 ${viewMode === "list" ? "list-view" : ""}`}>
        {filteredProducts.slice(0, visibleCount).map((product) => (
          <Col
            key={product.id}
            xs={6}
            md={4}
            lg={3}
            xl={viewMode === "list" ? 12 : 3}
            className="mb-3"
          >
            <Card
              className={`h-100 product-card border-0 shadow-sm ${
                viewMode === "list" ? "list-card" : ""
              }`}
              onClick={() => handleCardClick(product)}
              style={{
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
              }}
            >
              <div
                className={`d-flex ${
                  viewMode === "list" ? "flex-row" : "flex-column"
                }`}
              >
                <div
                  className={`position-relative ${
                    viewMode === "list" ? "list-image-container" : ""
                  }`}
                >
                  <Card.Img
                    variant="top"
                    src={getImageUrl(product.hinh_anh)}
                    alt={product.ten_san_pham}
                    style={{
                      height: viewMode === "list" ? "180px" : "220px",
                      objectFit: "cover",
                      width: viewMode === "list" ? "180px" : "100%",
                    }}
                    className={viewMode === "list" ? "rounded-start" : ""}
                  />
                  {product.danh_muc_ten && (
                    <Badge
                      bg="primary"
                      className="position-absolute top-0 start-0 m-2"
                    >
                      {product.danh_muc_ten}
                    </Badge>
                  )}
                  {product.variants?.some(
                    (v) => v.so_luong_ton > 0 && v.so_luong_ton <= 5
                  ) && (
                    <Badge
                      bg="warning"
                      text="dark"
                      className="position-absolute top-0 end-0 m-2"
                    >
                      Sắp hết hàng
                    </Badge>
                  )}
                  {product.variants?.every((v) => v.so_luong_ton === 0) && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 end-0 m-2"
                    >
                      Hết hàng
                    </Badge>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    {product.thuong_hieu && (
                      <small className="text-muted d-block mb-1">
                        {product.thuong_hieu}
                      </small>
                    )}
                    <Card.Title
                      className={`${
                        viewMode === "list" ? "fs-5" : "fs-6"
                      } text-truncate`}
                    >
                      {product.ten_san_pham}
                    </Card.Title>
                    {ratings[product.id] !== undefined && (
                      <div className="text-warning mb-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <i
                            key={i}
                            className={`bi ${
                              i < ratings[product.id]
                                ? "bi-star-fill"
                                : "bi-star"
                            }`}
                          ></i>
                        ))}
                        <small className="ms-1 text-muted">
                          ({ratings[product.id]} sao)
                        </small>
                      </div>
                    )}
                    {/* Kiểm tra và hiện form đánh giá nếu đã mua */}
                    {khachHangId && !reviewedMap[product.id] && (
                      <>
                        {daMuaMap[product.id] === undefined && (
                          <Button
                            size="sm"
                            variant="link"
                            className="p-0 text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchDaMua(product.id, khachHangId);
                            }}
                          >
                            Đánh giá
                          </Button>
                        )}

                        {daMuaMap[product.id] === false && (
                          <div className="text-muted small">
                            Chỉ khách đã mua mới được đánh giá
                          </div>
                        )}

                        {daMuaMap[product.id] === true && (
                          <form
                            onClick={(e) => e.stopPropagation()}
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const so_sao = selectedStars[product.id] || 5;
                              const noi_dung =
                                reviewContent[product.id]?.trim();
                              if (!noi_dung) {
                                alert("Vui lòng nhập nội dung đánh giá.");
                                return;
                              }

                              const body = {
                                khach_hang_id: khachHangId,
                                san_pham_id: product.id,
                                so_sao,
                                noi_dung,
                                ngay_danh_gia: new Date()
                                  .toISOString()
                                  .split("T")[0],
                              };

                              try {
                                const res = await fetch(
                                  "http://127.0.0.1:8000/api/danhgia",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(body),
                                  }
                                );

                                const data = await res.json();
                                alert(
                                  data.message || "Gửi đánh giá thành công!"
                                );

                                setReviewedMap((prev) => ({
                                  ...prev,
                                  [product.id]: true,
                                }));
                                setReviewContent((prev) => ({
                                  ...prev,
                                  [product.id]: "",
                                }));
                                setSelectedStars((prev) => ({
                                  ...prev,
                                  [product.id]: 5,
                                }));
                                fetchRatings();
                              } catch (err) {
                                console.error("Lỗi gửi đánh giá:", err);
                                alert("Đánh giá thất bại.");
                              }
                            }}
                          >
                            <div className="d-flex align-items-center gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`bi ${
                                    (selectedStars[product.id] || 5) >= star
                                      ? "bi-star-fill"
                                      : "bi-star"
                                  } text-warning`}
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    setSelectedStars((prev) => ({
                                      ...prev,
                                      [product.id]: star,
                                    }))
                                  }
                                />
                              ))}
                            </div>
                            <textarea
                              className="form-control form-control-sm mb-2"
                              rows={2}
                              placeholder="Nhập nội dung đánh giá..."
                              value={reviewContent[product.id] || ""}
                              onChange={(e) =>
                                setReviewContent((prev) => ({
                                  ...prev,
                                  [product.id]: e.target.value,
                                }))
                              }
                            />
                            <Button type="submit" size="sm" variant="success">
                              Gửi đánh giá
                            </Button>
                          </form>
                        )}
                      </>
                    )}
                    {khachHangId && reviewedMap[product.id] && (
                      <div className="text-success small">
                        Bạn đã đánh giá sản phẩm này.
                      </div>
                    )}

                    {viewMode === "list" && product.mo_ta && (
                      <p className="text-muted small mb-2 text-truncate">
                        {product.mo_ta}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto">
                    {product.dung_tich && (
                      <small className="text-muted d-block mb-2">
                        Dung tích: {product.dung_tich}
                      </small>
                    )}
                    <div className="d-flex justify-content-center align-items-center mt-5">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sanpham/${product.id}`);
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {visibleCount < filteredProducts.length && (
        <div className="text-center mt-4">
          <Button
            variant="outline-primary"
            onClick={handleShowMore}
            className="px-4"
          >
            Xem thêm sản phẩm
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
