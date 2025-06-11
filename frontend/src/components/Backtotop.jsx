import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

function BackToTop() {
  const [showButton, setShowButton] = useState(false);

  // Theo dõi scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200); // Hiện nút khi cuộn quá 200px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cuộn lên đầu
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return showButton ? (
    <Button
      onClick={handleBackToTop}
      variant="primary"
      className="position-fixed bottom-0 end-0 m-4"
      style={{ zIndex: 1000, borderRadius: "50%", width: "45px", height: "45px" }}
    >
      <i className="bi bi-arrow-up"></i>
    </Button>
  ) : null;
}

export default BackToTop;
