import { useState, useEffect } from "react";
import { Modal, Button, Col, Row, Badge, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg?height=300&width=300";
  if (path.startsWith("http")) return path;
  return `http://127.0.0.1:8000/storage/images/${path.replace(
    /^images\//,
    ""
  )}`;
};

const ProductDetailModal = ({
  product,
  show,
  onHide,
  addToCart,
  addToWishlist,
}) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleViewDetail = () => {
    if (product?.id) {
      navigate(`/sanpham/${product.id}`);
    }
  };
  useEffect(() => {
    if (product && show) {
      setCurrentImageIndex(0);
      setShowReviewPanel(false);
      setReviews([]);
      setSelectedVariantId(null); // Reset biến thể khi đổi sản phẩm
      setQuantity(1);
    }
  }, [product, show]);

  useEffect(() => {
    if (showReviewPanel && product?.id) {
      const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
          const res = await axios.get(
            `http://127.0.0.1:8000/api/danhgia/sanpham/${product.id}`
          );
          setReviews(res.data.data || []);
        } catch (error) {
          setReviews([]);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [showReviewPanel, product?.id]);
  if (!product) return null;
  // Lấy biến thể đã chọn
  const selectedVariant =
    Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants.find((v) => v.id === selectedVariantId)
      : null;

  // Giá và tồn kho hiển thị
  const displayPrice = selectedVariant
    ? Number(selectedVariant.gia).toLocaleString("vi-VN") + " ₫"
    : product.gia_format || "";
  const displayStock = selectedVariant
    ? selectedVariant.so_luong_ton
    : product.so_luong_ton;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
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
          <Col md={showReviewPanel ? 7 : 12}>
            <Row>
              <Col md={6}>
                <div className="position-relative mb-3">
                  <img
                    src={getImageUrl(
                      product.images?.[currentImageIndex] || product.hinh_anh
                    )}
                    alt={product.ten_san_pham}
                    className="img-fluid rounded"
                    style={{
                      width: "100%",
                      height: "350px",
                      objectFit: "contain",
                    }}
                  />
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
                        <i className="bi bi-chevron-left"></i>
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
                        <i className="bi bi-chevron-right"></i>
                      </Button>
                      <div className="text-center mt-2 text-muted small">
                        <i className="bi bi-info-circle me-1"></i>
                        Ảnh {currentImageIndex + 1} / {product.images.length}
                      </div>
                    </>
                  )}
                </div>

                {product.images?.length > 1 && (
                  <Row className="g-2 mt-2">
                    {product.images.map((img, index) => (
                      <Col key={index} xs={3}>
                        <img
                          src={getImageUrl(img)}
                          alt={`Thumbnail ${index + 1}`}
                          className={`img-thumbnail cursor-pointer ${
                            index === currentImageIndex ? "border-primary" : ""
                          }`}
                          style={{
                            height: "60px",
                            objectFit: "contain",
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
                  {product.thuong_hieu && (
                    <div className="mb-2">
                      <Badge bg="light" text="dark" className="me-2 px-3 py-2">
                        <i className="bi bi-award me-1"></i>
                        {product.thuong_hieu}
                      </Badge>
                      {product.danh_muc_ten && (
                        <Badge bg="primary">{product.danh_muc_ten}</Badge>
                      )}
                    </div>
                  )}
                  <h3 className="fs-4 mb-3">{product.ten_san_pham}</h3>
                  {/* Chọn biến thể nếu có */}
                  {Array.isArray(product.variants) &&
                    product.variants.length > 0 && (
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Dung tích:
                        </label>
                        <div className="d-flex gap-2 flex-wrap">
                          {product.variants.map((v) => {
                            const isActive = selectedVariantId === v.id;
                            const isOut = Number(v.so_luong_ton) <= 0;
                            return (
                              <button
                                key={v.id}
                                type="button"
                                className={`btn btn-outline-primary px-3 py-2${
                                  isActive ? " active border-2 fw-bold" : ""
                                }${
                                  isOut ? " text-decoration-line-through" : ""
                                }`}
                                style={{
                                  minWidth: 90,
                                  opacity: isOut ? 0.5 : 1,
                                  pointerEvents: isOut ? "none" : "auto",
                                  borderColor: isActive ? "#0d6efd" : undefined,
                                  background: isActive ? "#e7f1ff" : undefined,
                                  color: isActive ? "red" : "#0d6efd",
                                }}
                                disabled={isOut}
                                onClick={() => {
                                  setSelectedVariantId(v.id);
                                  setQuantity(1);
                                }}
                              >
                                <div>{v.dung_tich}ml</div>
                                {/* <div className="small text-muted">{Number(v.gia).toLocaleString('vi-VN')} ₫</div> */}
                              </button>
                            );
                          })}
                        </div>
                        {selectedVariantId && (
                          <div className="mb-2 text-muted">
                            Còn lại:{" "}
                            <span
                              className={
                                displayStock <= 5
                                  ? "text-danger fw-semibold"
                                  : "fw-semibold"
                              }
                            >
                              {displayStock}
                            </span>{" "}
                            sản phẩm
                          </div>
                        )}
                      </div>
                    )}
                  {/* Hiển thị giá và số lượng tồn theo biến thể đã chọn */}
                  <div className="fs-3 fw-bold text-primary mb-3">
                    {displayPrice}
                  </div>
                  {/* Chọn số lượng */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Số lượng:</label>
                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      max={displayStock || 1}
                      value={quantity}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val < 1) val = 1;
                        if (val > (displayStock || 1)) val = displayStock || 1;
                        setQuantity(val);
                      }}
                      disabled={displayStock <= 0}
                      style={{ width: 120 }}
                    />
                    {displayStock <= 0 && (
                      <div className="text-danger small mt-1">Hết hàng</div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <table className="table table-borderless">
                    <tbody>
                      {product.thuong_hieu && (
                        <tr>
                          <td
                            className="text-muted ps-0"
                            style={{ width: "40%" }}
                          >
                            Thương hiệu:
                          </td>
                          <td>{product.thuong_hieu}</td>
                        </tr>
                      )}
                      {product.xuat_xu && (
                        <tr>
                          <td className="text-muted ps-0">Xuất xứ:</td>
                          <td>{product.xuat_xu}</td>
                        </tr>
                      )}
                      {product.phong_cach && (
                        <tr>
                          <td className="text-muted ps-0">Phong cách:</td>
                          <td>{product.phong_cach}</td>
                        </tr>
                      )}
                      {product.nam_phat_hanh && (
                        <tr>
                          <td className="text-muted ps-0">Năm phát hành:</td>
                          <td>{product.nam_phat_hanh}</td>
                        </tr>
                      )}
                      {product.do_luu_huong && (
                        <tr>
                          <td className="text-muted ps-0">Độ lưu hương:</td>
                          <td>{product.do_luu_huong}</td>
                        </tr>
                      )}
                      {product.do_toa_huong && (
                        <tr>
                          <td className="text-muted ps-0">Độ tỏa hương:</td>
                          <td>{product.do_toa_huong}</td>
                        </tr>
                      )}
                      {product.dung_tich && !product.variants?.length && (
                        <tr>
                          <td className="text-muted ps-0">Dung tích:</td>
                          <td>{product.dung_tich}</td>
                        </tr>
                      )}
                      {/* Tình trạng: tổng hợp cho cả variants và không variants */}
                      <tr>
                        <td className="text-muted ps-0">Tình trạng:</td>
                        <td>
                          {(() => {
                            let total = 0;
                            if (
                              Array.isArray(product.variants) &&
                              product.variants.length > 0
                            ) {
                              total = product.variants.reduce(
                                (sum, v) => sum + (Number(v.so_luong_ton) || 0),
                                0
                              );
                            } else {
                              total = Number(product.so_luong_ton) || 0;
                            }
                            return total > 0 ? (
                              <span className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Còn hàng ({total})
                              </span>
                            ) : (
                              <span className="text-danger">
                                <i className="bi bi-x-circle me-1"></i>
                                Hết hàng
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                      {product.danh_muc_ten && (
                        <tr>
                          <td className="text-muted ps-0">Danh mục:</td>
                          <td>{product.danh_muc_ten}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* {product.mo_ta && (
                  <div className="mb-4">
                    <h5 className="fs-6 fw-bold mb-2">Mô tả sản phẩm:</h5>
                    <p className="text-muted">{product.mo_ta}</p>
                  </div>
                )} */}

                <div className="d-grid gap-2">
                  <Button
                    variant="dark"
                    className="mt-3 w-100"
                    onClick={() => {
                      handleViewDetail();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Xem chi tiết sản phẩm
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      if (
                        Array.isArray(product.variants) &&
                        product.variants.length > 0
                      ) {
                        if (!selectedVariantId) {
                          toast.warning(
                            "Vui lòng chọn loại/dung tích trước khi thêm vào giỏ hàng!"
                          );
                          return;
                        }
                        addToCart(
                          {
                            ...product,
                            variant_id: selectedVariantId,
                            variants: product.variants,
                            so_luong_ton: selectedVariant
                              ? selectedVariant.so_luong_ton
                              : 0,
                            gia: selectedVariant ? selectedVariant.gia : 0,
                            dung_tich: selectedVariant
                              ? selectedVariant.dung_tich
                              : "",
                          },
                          selectedVariantId,
                          quantity,
                          selectedVariant
                        );
                      } else {
                        addToCart({ ...product, quantity: quantity });
                      }
                    }}
                    disabled={displayStock <= 0}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="w-100"
                    onClick={() => addToWishlist(product)}
                  >
                    <i className="bi bi-heart me-2"></i>
                    Thêm vào yêu thích
                  </Button>

                  <Button
                    variant={
                      showReviewPanel ? "outline-danger" : "outline-info"
                    }
                    onClick={() => setShowReviewPanel(!showReviewPanel)}
                  >
                    <i className="bi bi-chat-left-text me-2"></i>
                    {showReviewPanel ? "Ẩn đánh giá" : "Xem đánh giá"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>

          {showReviewPanel && (
            <Col md={5} className="border-start ps-4">
              <h5 className="mb-3">Đánh giá sản phẩm</h5>
              {loadingReviews ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center text-muted py-4">
                  Chưa có đánh giá nào cho sản phẩm này.
                </div>
              ) : (
                <div style={{ maxHeight: 350, overflowY: "auto" }}>
                  {reviews.map((rv, idx) => (
                    <div
                      key={idx}
                      className="mb-3 p-3"
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #dee2e6",
                        borderRadius: "12px",
                      }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <span className="fw-semibold me-2">
                          {rv.ten_khach_hang || "Ẩn danh"}
                        </span>
                        <span className="text-warning">
                          {Array.from({ length: 5 }, (_, i) => (
                            <i
                              key={i}
                              className={`bi ${
                                i < rv.so_sao ? "bi-star-fill" : "bi-star"
                              }`}
                              style={{ marginRight: "2px" }}
                            ></i>
                          ))}
                        </span>
                        <span className="ms-auto text-muted small">
                          {rv.ngay_danh_gia}
                        </span>
                      </div>
                      <div className="text-muted">{rv.noi_dung}</div>
                    </div>
                  ))}
                </div>
              )}
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProductDetailModal;
