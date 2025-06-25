import { useEffect, useState } from "react";
import axios from "axios";

const Chitiietspdg = (productId, enabled = true) => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (!productId || !enabled) return;

    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/danhgia/sanpham/${productId}`);
        setReviews(res.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [productId, enabled]);

  return { reviews, loadingReviews };
};

export default Chitiietspdg;
