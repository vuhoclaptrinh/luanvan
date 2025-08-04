import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api/";
const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg?height=300&width=300";
  if (path.startsWith("http")) return path;
  return `http://127.0.0.1:8000/storage/images/${path.replace(
    /^images\//,
    ""
  )}`;
};

function Spdexuat() {
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE}sanpham/de-xuat/${user.id}`)
      .then((res) => setSuggested(res.data.data || []))
      .catch(() => setSuggested([]))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (offset) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải đề xuất...</p>
      </div>
    );

  if (suggested.length === 0) return null;

  return (
    <section style={{ backgroundColor: "#fcecec", padding: "4rem 0" }}>
      <div className="container position-relative">
        <h4 className="fw-bold text-danger mb-3">👍 SẢN PHẨM DÀNH CHO BẠN</h4>
        <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
          Dựa theo sản phẩm bạn đã mua
        </p>
        {/* Nút trái */}
        <Button
          variant="light"
          className="position-absolute  start-0 translate-middle-y shadow-sm z-3"
          onClick={() => scroll(-300)}
          style={{ borderRadius: "50%", top: "60%" }}
        >
          <i className="bi bi-chevron-left fs-4"></i>
        </Button>

        {/* Cuộn ngang */}
        <div
          ref={scrollRef}
          className="d-flex gap-3 px-2"
          style={{
            scrollBehavior: "smooth",
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // Internet Explorer
          }}
        >
          {suggested.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-sm border rounded p-2"
              style={{
                width: 250,
                minWidth: 240,
                cursor: "pointer",
                flexShrink: 0,
              }}
              onClick={() => navigate(`/sanpham/${product.id}`)}
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
              <img
                src={getImageUrl(product.hinh_anh)}
                alt={product.ten_san_pham}
                className="w-100 rounded"
                style={{ height: 160, objectFit: "contain" }}
              />

              <div className="mt-2">
                <div className="text-truncate " title={product.ten_san_pham}>
                  {product.ten_san_pham}
                </div>

                <div
                  className="text-truncate fw-semibold"
                  title={product.thuong_hieu}
                >
                  {product.thuong_hieu}
                </div>

                <div className="mt-1">
                  <Badge bg="danger" className="rounded-pill px-2 py-1">
                    Dành cho bạn
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nút phải */}
        <Button
          variant="light"
          className="position-absolute  end-0 translate-middle-y shadow-sm z-3"
          onClick={() => scroll(300)}
          style={{ borderRadius: "50%", top: "60%" }}
        >
          <i className="bi bi-chevron-right fs-4"></i>
        </Button>
      </div>
    </section>
  );
}

export default Spdexuat;
