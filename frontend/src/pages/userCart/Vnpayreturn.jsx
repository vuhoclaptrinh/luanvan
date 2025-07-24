import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "react-bootstrap";
import "./Checkout.css";

function VnpayReturn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isProcessed = false;

    const query = new URLSearchParams(location.search);
    const responseCode = query.get("vnp_ResponseCode");
    const transactionStatus = query.get("vnp_TransactionStatus");

    console.log("✅ Debug:", { responseCode, transactionStatus });

    if (responseCode === "00" && transactionStatus === "00") {
      const waitForOrderData = async () => {
        let retries = 10;
        let orderData = null;

        while (retries > 0) {
          orderData = localStorage.getItem("vnpay_order_data");
          if (orderData) break;

          console.warn("⏳ Chờ dữ liệu vnpay_order_data...");
          await new Promise((res) => setTimeout(res, 300)); // đợi 300ms
          retries--;
        }

        if (!orderData || isProcessed) return;

        isProcessed = true;

        localStorage.removeItem("vnpay_order_data");
        const parsed = JSON.parse(orderData);
        parsed.trang_thai = "đã thanh toán";

        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/donhang",
            parsed
          );
          const newOrderId = res.data?.data?.id;
          if (!newOrderId) throw new Error("Không nhận được ID đơn hàng");

          setOrderId(newOrderId);

          const chiTiet = parsed.chi_tiet || [];
          for (const item of chiTiet) {
            await axios.post("http://127.0.0.1:8000/api/chitietdonhang", {
              don_hang_id: newOrderId,
              san_pham_id: item.san_pham_id,
              bien_the_id: item.bien_the_id,
              so_luong: item.so_luong,
              gia: item.gia,
            });
          }

          setSuccess(true);
          sessionStorage.removeItem("cart");
          window.dispatchEvent(new Event("cart-updated"));
        } catch (err) {
          console.error(
            "❌ Lỗi lưu đơn hàng:",
            err?.response?.data || err.message
          );
          setSuccess(false);
        } finally {
          setLoading(false);
        }
      };

      waitForOrderData();
    } else {
      console.warn("⚠️ Thanh toán không thành công hoặc sai trạng thái.");
      setSuccess(false);
      setLoading(false);
    }
  }, [location]);

  if (loading)
    return <div className="text-center mt-5">Đang xác nhận thanh toán...</div>;

  return (
    <div className="checkout-success text-center mt-5">
      {success ? (
        <>
          <div className="checkout-success">
            <div className="success-content">
              <div className="success-icon">
                <CheckCircle size={60} />
              </div>
              <h2>Đặt hàng thành công!</h2>
              <p className="order-id">
                Mã đơn hàng: <span>#{orderId}</span>
              </p>

              <div className="success-message">
                <p>
                  Cảm ơn bạn đã đặt hàng tại PerfumeShop. Chúng tôi đã xác nhận
                  đơn hàng của bạn.
                </p>
                <p>
                  Đơn hàng của bạn sẽ được xử lý và giao đến trong thời gian sớm
                  nhất.
                </p>
              </div>

              <div className="success-actions">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/products")}
                  className="continue-shopping"
                >
                  <ArrowLeft size={16} className="me-2" />
                  Tiếp tục mua sắm
                </Button>

                <Button
                  variant="primary"
                  onClick={() => navigate(`/orders`)}
                  className="view-orders"
                >
                  Xem đơn hàng
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-danger">
          <h3>❌ Thanh toán thất bại!</h3>
          <p>Vui lòng kiểm tra lại hoặc thử phương thức thanh toán khác.</p>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => navigate("/checkout")}
          >
            Quay lại thanh toán
          </Button>
        </div>
      )}
    </div>
  );
}

export default VnpayReturn;
