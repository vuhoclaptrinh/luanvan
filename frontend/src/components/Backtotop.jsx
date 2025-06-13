import { useEffect, useState } from "react";

function BackToTop() {
  const [showButton, setShowButton] = useState(false);

  // Theo dõi vị trí scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cuộn lên đầu trang
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return showButton ? (
    <button
      className="btn btn-primary rounded-circle position-fixed"
      style={{
        bottom: "20px",
        right: "20px",
        width: "40px",
        height: "40px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        background: "linear-gradient(to right, #e83e8c, #6f42c1)",
        border: "none",
      }}
      onClick={handleBackToTop}
    >
      <i className="bi bi-arrow-up"></i>
    </button>
  ) : null;
}

export default BackToTop;
