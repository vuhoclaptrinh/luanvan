"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Tabs,
  Tab,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Award,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  ArrowLeft,
  ZoomIn,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { addToCart } from "../userCart/Addcart";
import { addToWishlist } from "../userWishlist/Addwishlist";

// Utility function for image URLs
const getImageUrl = (path) => {
  if (typeof path !== "string" || path.trim() === "") {
    return "/placeholder.svg?height=300&width=300";
  }
  if (path.startsWith("http")) return path;
  return `http://127.0.0.1:8000/storage/images/${path.replace(
    /^images\//,
    ""
  )}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewStar, setReviewStar] = useState(5);
  const [reviewContent, setReviewContent] = useState("");

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const [filterStar, setFilterStar] = useState(0);
  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/sanpham/${id}`);
        const data = await res.json();
        setProduct(data.data);
      } catch (err) {
        console.error("Không thể tải sản phẩm:", err);
        toast.error("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.thuong_hieu) return;

      setLoadingRelated(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/sanpham`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        // Filter products by brand and exclude current product
        const filtered = (data.data || [])
          .filter(
            (item) =>
              item.thuong_hieu === product.thuong_hieu && item.id !== product.id
          )
          .slice(0, 6); // Limit to 6 products

        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm liên quan:", error);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id) return;

      setLoadingReviews(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/danhgia/sanpham/${product.id}`
        );
        const data = await res.json();
        setReviews(data.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product?.id]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const khachHangId = user?.id;

    if (product?.id && khachHangId) {
      const fetchPermission = async () => {
        try {
          const [res1, res2] = await Promise.all([
            fetch(
              `http://127.0.0.1:8000/api/danhgia/kiemtra-da-mua/${khachHangId}/${product.id}`
            ),
            fetch(
              `http://127.0.0.1:8000/api/danhgia/da-danh-gia/${khachHangId}/${product.id}`
            ),
          ]);

          if (!res1.ok || !res2.ok) {
            throw new Error("API check quyền đánh giá lỗi");
          }

          const daMua = await res1.json();
          const daDanhGia = await res2.json();

          setCanReview(daMua.da_mua && !daDanhGia.da_danh_gia);
        } catch (err) {
          console.error("Lỗi kiểm tra đánh giá:", err);
          setCanReview(false);
        }
      };

      fetchPermission();
    }
  }, [product?.id]);
  //lọcdanhgia
  const filteredReviews =
    filterStar === 0 ? reviews : reviews.filter((r) => r.so_sao === filterStar);
  //hạn chế đánh giá
  const [showAllReviews, setShowAllReviews] = useState(false);

  const selectedVariant = product?.variants?.find(
    (v) => v.id === selectedVariantId
  );
  const displayPrice = selectedVariant
    ? `${Number(selectedVariant.gia).toLocaleString("vi-VN")} ₫`
    : product?.gia_format || "";

  const displayStock = selectedVariant
    ? selectedVariant.so_luong_ton
    : product?.so_luong_ton || 0;

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + change, displayStock)));
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariantId, quantity, selectedVariant);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const khachHangId = user?.id;
    if (!khachHangId) return toast.error("Bạn cần đăng nhập");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/danhgia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          khach_hang_id: khachHangId,
          san_pham_id: product.id,
          so_sao: reviewStar,
          noi_dung: reviewContent,
          ngay_danh_gia: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) throw new Error("Gửi thất bại");

      const data = await response.json();
      toast.success("Gửi đánh giá thành công!");

      setReviews((prev) => [
        ...prev,
        {
          ten_khach_hang: "Bạn",
          so_sao: reviewStar,
          noi_dung: reviewContent,
          ngay_danh_gia: new Date().toLocaleDateString("vi-VN"),
        },
      ]);

      setReviewStar(5);
      setReviewContent("");
      setCanReview(false); // Chỉ cho đánh giá 1 lần
    } catch (error) {
      toast.error("Không gửi được đánh giá");
      console.error(error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/sanpham/${productId}`);
  };

  if (loading) {
    return (
      <Container
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center"
      >
        <div className="text-center">
          <Spinner animation="border" size="lg" />
          <p className="mt-3">Đang tải sản phẩm...</p>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center"
      >
        <div className="text-center">
          <h2 className="mb-4">Không tìm thấy sản phẩm</h2>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-primary" onClick={handleGoBack}>
              <ArrowLeft className="me-2" size={16} />
              Quay lại
            </Button>
            <Button variant="primary" onClick={handleGoHome}>
              Về trang chủ
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const totalStock = product.variants?.length
    ? product.variants.reduce((sum, v) => sum + (v.so_luong_ton || 0), 0)
    : product.so_luong_ton || 0;

  return (
    <div className="min-vh-100 bg-light">
      <Container className="py-4">
        {/* Back Button */}
        <Button variant="link" onClick={handleGoBack} className="mb-3 p-0">
          <ArrowLeft className="me-2" size={16} />
          Quay lại
        </Button>

        {/* Breadcrumb */}
        <nav className="text-muted small mb-4">
          <span
            className="cursor-pointer text-decoration-underline"
            onClick={handleGoHome}
            style={{ cursor: "pointer" }}
          >
            Trang chủ
          </span>
          {" / "}
          <span>{product.danh_muc_ten}</span>
          {" / "}
          <span className="text-dark ms-1">{product.ten_san_pham}</span>
        </nav>

        <Row className="mb-5">
          {/* Product Images */}
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <div className="position-relative text-center mb-3">
                  {(() => {
                    const currentImage = product.images?.[currentImageIndex];
                    const currentImagePath =
                      typeof currentImage === "string"
                        ? currentImage
                        : currentImage?.image_path ?? product.hinh_anh;

                    return (
                      <div className="position-relative">
                        <img
                          src={
                            getImageUrl(currentImagePath) || "/placeholder.svg"
                          }
                          alt={product.ten_san_pham}
                          className="img-fluid rounded border"
                          style={{
                            maxHeight: "400px",
                            objectFit: "contain",
                            backgroundColor: "#ffffff",
                            padding: "10px",
                            cursor: "zoom-in",
                            width: "100%",
                          }}
                        />
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-opacity">
                          <ZoomIn className="text-white" size={32} />
                        </div>
                      </div>
                    );
                  })()}

                  {product.images?.length > 1 && (
                    <>
                      <Button
                        variant="light"
                        size="sm"
                        className="position-absolute top-50 start-0 translate-middle-y rounded-circle p-2 shadow-sm"
                        onClick={() =>
                          setCurrentImageIndex(
                            currentImageIndex === 0
                              ? product.images.length - 1
                              : currentImageIndex - 1
                          )
                        }
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        className="position-absolute top-50 end-0 translate-middle-y rounded-circle p-2 shadow-sm"
                        onClick={() =>
                          setCurrentImageIndex(
                            (currentImageIndex + 1) % product.images.length
                          )
                        }
                      >
                        <ChevronRight size={16} />
                      </Button>
                      <div className="text-center mt-2 text-muted small">
                        Ảnh {currentImageIndex + 1} / {product.images.length}
                      </div>
                    </>
                  )}
                </div>

                {product.images?.length > 1 && (
                  <Row className="g-2 justify-content-center">
                    {product.images.map((img, index) => (
                      <Col key={index} xs={3}>
                        <img
                          src={
                            getImageUrl(img.image_path) || "/placeholder.svg"
                          }
                          alt={`Thumbnail ${index + 1}`}
                          className={`img-thumbnail rounded shadow-sm w-100 ${
                            index === currentImageIndex
                              ? "border-primary border-2"
                              : "border"
                          }`}
                          style={{
                            height: "60px",
                            objectFit: "cover",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            opacity: index === currentImageIndex ? 1 : 0.6,
                            transition: "opacity 0.3s",
                          }}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Product Info */}
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Badge
                    bg="secondary"
                    className="d-flex align-items-center gap-1"
                  >
                    <Award size={12} />
                    {product.thuong_hieu}
                  </Badge>
                  {product.danh_muc_ten && (
                    <Badge>{product.danh_muc_ten}</Badge>
                  )}
                </div>

                <h1 className="h3 mb-4">{product.ten_san_pham}</h1>

                {/* Variants Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Dung tích:</label>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      {product.variants.map((variant) => {
                        const isSelected = selectedVariantId === variant.id;
                        const isOutOfStock = variant.so_luong_ton <= 0;

                        return (
                          <Button
                            key={variant.id}
                            variant={isSelected ? "primary" : "outline-primary"}
                            size="sm"
                            disabled={isOutOfStock}
                            onClick={() => {
                              setSelectedVariantId(variant.id);
                              setQuantity(1);
                            }}
                            className={`${
                              isOutOfStock ? "text-decoration-line-through" : ""
                            }`}
                            style={{ opacity: isOutOfStock ? 0.5 : 1 }}
                          >
                            {variant.dung_tich} ml
                          </Button>
                        );
                      })}
                    </div>
                    {selectedVariant && (
                      <div className="mb-2 text-muted">
                        {" "}
                        Còn lại:{" "}
                        <span
                          className={
                            displayStock <= 5 ? "text-danger" : "fw=semibold"
                          }
                        >
                          {displayStock}
                        </span>{" "}
                        sản phẩm
                      </div>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="h2 text-danger fw-bold mb-4">
                  {displayPrice}
                </div>

                {/* Quantity Selection */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Số lượng:</label>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </Button>

                    <input
                      type="number"
                      className="form-control text-center"
                      style={{ width: "80px" }}
                      value={quantity}
                      min={1}
                      max={displayStock}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          setQuantity(Math.min(Math.max(val, 1), displayStock)); // ràng buộc min/max
                        }
                      }}
                    />

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= displayStock}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>

                  {displayStock <= 0 && (
                    <small className="text-danger">Chọn dung tích</small>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={displayStock <= 0}
                  >
                    <ShoppingCart className="me-2" size={20} />
                    Thêm vào giỏ hàng
                  </Button>

                  <Button
                    variant="outline-danger"
                    className="w-100"
                    onClick={handleAddToWishlist}
                  >
                    <Heart className="me-2" size={16} />
                    Yêu thích
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Product Details */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Tabs
              defaultActiveKey="specifications"
              id="product-tabs"
              className="mb-3"
            >
              <Tab eventKey="specifications" title="Thông Tin Sản Phẩm">
                <div className="table-responsive">
                  <Table borderless>
                    <tbody>
                      {product.thuong_hieu && (
                        <tr>
                          <td
                            className="fw-semibold text-muted"
                            style={{ width: "30%" }}
                          >
                            Thương hiệu
                          </td>
                          <td>{product.thuong_hieu}</td>
                        </tr>
                      )}
                      {product.xuat_xu && (
                        <tr>
                          <td className="fw-semibold text-muted">Xuất xứ</td>
                          <td>{product.xuat_xu}</td>
                        </tr>
                      )}
                      {product.phong_cach && (
                        <tr>
                          <td className="fw-semibold text-muted">Phong cách</td>
                          <td>{product.phong_cach}</td>
                        </tr>
                      )}
                      {product.nam_phat_hanh && (
                        <tr>
                          <td className="fw-semibold text-muted">
                            Năm phát hành
                          </td>
                          <td>{product.nam_phat_hanh}</td>
                        </tr>
                      )}
                      {product.do_luu_huong && (
                        <tr>
                          <td className="fw-semibold text-muted">
                            Độ lưu hương
                          </td>
                          <td>{product.do_luu_huong}</td>
                        </tr>
                      )}
                      {product.do_toa_huong && (
                        <tr>
                          <td className="fw-semibold text-muted">
                            Độ tỏa hương
                          </td>
                          <td>{product.do_toa_huong}</td>
                        </tr>
                      )}
                      {product.dung_tich && !product.variants?.length && (
                        <tr>
                          <td className="fw-semibold text-muted">Dung tích</td>
                          <td>{product.dung_tich}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="fw-semibold text-muted">Tình trạng</td>
                        <td>
                          {totalStock > 0 ? (
                            <span className="d-flex align-items-center text-success">
                              <CheckCircle className="me-1" size={16} />
                              Còn hàng ({totalStock})
                            </span>
                          ) : (
                            <span className="d-flex align-items-center text-danger">
                              <XCircle className="me-1" size={16} />
                              Hết hàng
                            </span>
                          )}
                        </td>
                      </tr>
                      {product.danh_muc_ten && (
                        <tr>
                          <td className="fw-semibold text-muted">Danh mục</td>
                          <td>{product.danh_muc_ten}</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab eventKey="description" title="Bài viết mô tả">
                {product.mo_ta ? (
                  <div
                    className="text-muted"
                    dangerouslySetInnerHTML={{ __html: product.mo_ta }}
                  />
                ) : (
                  <p className="text-muted text-center py-5">
                    Chưa có mô tả cho sản phẩm này.
                  </p>
                )}
              </Tab>

              <Tab eventKey="reviews" title="Đánh giá">
                <div>
                  {canReview && (
                    <Card className="mb-4">
                      <Card.Body>
                        <h5 className="mb-3">Gửi đánh giá của bạn</h5>
                        <form onSubmit={handleSubmitReview}>
                          <div className="mb-3">
                            <div className="d-flex justify-content-center gap-2">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  size={24}
                                  className={
                                    i < reviewStar
                                      ? "text-warning"
                                      : "text-muted"
                                  }
                                  fill={
                                    i < reviewStar ? "currentColor" : "none"
                                  }
                                  onClick={() => setReviewStar(i + 1)}
                                  style={{ cursor: "pointer" }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Nội dung:</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={reviewContent}
                              onChange={(e) => setReviewContent(e.target.value)}
                              placeholder="Nhập nội dung đánh giá..."
                            />
                          </div>
                          <Button type="submit" variant="primary">
                            Gửi đánh giá
                          </Button>
                        </form>
                      </Card.Body>
                    </Card>
                  )}
                  {loadingReviews ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      Chưa có đánh giá nào cho sản phẩm này.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {/* Bộ lọc số sao */}
                      <div className="mb-3 d-flex gap-2 align-items-center">
                        <span>Lọc theo số sao:</span>
                        {[0, 5, 4, 3, 2, 1].map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            variant={
                              filterStar === s ? "primary" : "outline-secondary"
                            }
                            onClick={() => setFilterStar(s)}
                          >
                            {s === 0 ? "Tất cả" : `${s}★`}
                          </Button>
                        ))}
                      </div>

                      {filteredReviews.length === 0 ? (
                        <div className="text-center text-muted py-5">
                          Không có đánh giá phù hợp với bộ lọc.
                        </div>
                      ) : (
                        filteredReviews
                          .slice(0, showAllReviews ? filteredReviews.length : 3)
                          .map((review) => (
                            <Card
                              key={review.id || Math.random()}
                              className="border-light"
                            >
                              <Card.Body>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <span className="fw-semibold">
                                    {review.ten_khach_hang}
                                  </span>
                                  <div className="d-flex align-items-center gap-2">
                                    <div className="d-flex">
                                      {Array.from({ length: 5 }, (_, i) => (
                                        <Star
                                          key={`star-${review.id}-${i}`}
                                          size={16}
                                          className={
                                            i < review.so_sao
                                              ? "text-warning"
                                              : "text-muted"
                                          }
                                          fill={
                                            i < review.so_sao
                                              ? "currentColor"
                                              : "none"
                                          }
                                        />
                                      ))}
                                    </div>
                                    <small className="text-muted">
                                      {new Date(
                                        review.ngay_danh_gia
                                      ).toLocaleDateString("vi-VN")}
                                    </small>
                                  </div>
                                </div>
                                <p className="text-muted mb-0">
                                  {review.noi_dung}
                                </p>
                              </Card.Body>
                            </Card>
                          ))
                      )}
                      {filteredReviews.length > 5 && (
                        <div className="text-center mt-3">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setShowAllReviews(!showAllReviews)}
                          >
                            {showAllReviews ? "Ẩn bớt" : "Xem thêm đánh giá"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Card className="shadow-sm">
            <Card.Header>
              <Card.Title className="d-flex align-items-center gap-2 text-primary mb-0">
                <Award size={20} />
                Sản phẩm cùng thương hiệu
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {loadingRelated ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                  <p className="mt-2 text-muted">
                    Đang tải sản phẩm liên quan...
                  </p>
                </div>
              ) : (
                <div className="position-relative">
                  <div
                    className="d-flex gap-3 overflow-auto pb-2"
                    style={{
                      scrollBehavior: "smooth",
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                      WebkitScrollbar: { display: "none" },
                    }}
                    id="related-products-scroll"
                  >
                    {relatedProducts.map((item) => (
                      <div
                        key={item.id}
                        className="flex-shrink-0"
                        style={{ width: "250px" }}
                      >
                        <Card
                          className="h-100 shadow-sm border-0 hover-shadow"
                          style={{
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s",
                          }}
                          onClick={() => {
                            handleRelatedProductClick(item.id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 1px 3px rgba(0,0,0,0.12)";
                          }}
                        >
                          <div className="position-relative overflow-hidden">
                            <img
                              src={
                                getImageUrl(item.hinh_anh) || "/placeholder.svg"
                              }
                              alt={item.ten_san_pham}
                              className="card-img-top"
                              style={{
                                height: "180px",
                                objectFit: "cover",
                                transition: "transform 0.3s",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = "scale(1)";
                              }}
                            />
                          </div>
                          <Card.Body className="p-3">
                            <h6
                              className="card-title mb-2"
                              style={{
                                fontSize: "0.9rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: "1.3",
                                height: "2.6em",
                              }}
                            >
                              {item.ten_san_pham}
                            </h6>

                            {item.thuong_hieu && (
                              <small className="text-muted d-block">
                                {item.thuong_hieu}
                              </small>
                            )}
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>

                  {/* Scroll Buttons */}
                  <Button
                    variant="light"
                    className="position-absolute top-50 start-0 translate-middle-y rounded-circle shadow-sm d-none d-md-block"
                    style={{
                      zIndex: 10,
                      width: "40px",
                      height: "40px",
                      marginLeft: "-20px",
                    }}
                    onClick={() => {
                      const container = document.getElementById(
                        "related-products-scroll"
                      );
                      container.scrollBy({ left: -250, behavior: "smooth" });
                    }}
                  >
                    <ChevronLeft size={20} />
                  </Button>

                  <Button
                    variant="light"
                    className="position-absolute top-50 end-0 translate-middle-y rounded-circle shadow-sm d-none d-md-block"
                    style={{
                      zIndex: 10,
                      width: "40px",
                      height: "40px",
                      marginRight: "-20px",
                    }}
                    onClick={() => {
                      const container = document.getElementById(
                        "related-products-scroll"
                      );
                      container.scrollBy({ left: 250, behavior: "smooth" });
                    }}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              )}

              {relatedProducts.length === 0 && !loadingRelated && (
                <Alert variant="info" className="text-center">
                  <Award className="me-2" size={16} />
                  Không có sản phẩm liên quan nào được tìm thấy.
                </Alert>
              )}
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}
