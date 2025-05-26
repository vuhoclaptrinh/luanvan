import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [danhmucs, setDanhmucs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/sanpham')
      .then(response => {
        const products = response.data.data || [];
        const grouped = products.reduce((acc, product) => {
          const category = product.danh_muc_ten || 'Chưa phân loại';
          if (!acc[category]) acc[category] = [];
          acc[category].push(product);
          return acc;
        }, {});
        setDanhmucs(grouped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải sản phẩm:', err);
        setError('Không tải được dữ liệu sản phẩm.');
        setLoading(false);
      });
  }, []);

  const handleImageClick = (sp) => {
    let images = [];
    if (sp.images && sp.images.length > 0) {
      images = sp.images.map(img =>
        typeof img === 'string'
          ? `http://127.0.0.1:8000/storage/${img}`
          : `http://127.0.0.1:8000/storage/${img.image_path}`
      );
    }
    const mainImage = `http://127.0.0.1:8000/storage/${sp.hinh_anh}`;
    if (!images.includes(mainImage)) {
      images.unshift(mainImage);
    }
    setGalleryImages(images);
    setGalleryIndex(0);
    setGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setGalleryOpen(false);
    setGalleryImages([]);
    setGalleryIndex(0);
  };

  const handlePrev = () => setGalleryIndex(i => (i === 0 ? galleryImages.length - 1 : i - 1));
  const handleNext = () => setGalleryIndex(i => (i === galleryImages.length - 1 ? 0 : i + 1));

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '20px auto',
        padding: 15,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 30, color: '#333' }}>
        Danh sách danh mục và sản phẩm nước hoa
      </h1>

      {Object.entries(danhmucs).map(([category, products]) => (
        <div key={category} style={{ marginBottom: 40 }}>
          <h2
            style={{
              borderBottom: '2px solid #d9534f',
              paddingBottom: 6,
              color: '#d9534f',
              marginBottom: 15,
            }}
          >
            {category}
          </h2>

          {products.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 20,
                justifyContent: 'flex-start',
              }}
            >
              {products.map(sp => (
                <div
                  key={sp.id}
                  style={{
                    cursor: 'pointer',
                    flex: '0 0 calc(50% - 10px)', // 2 sp 1 hàng, cách nhau 20px gap nên trừ 10px mỗi bên
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    padding: 12,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => handleImageClick(sp)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={`http://127.0.0.1:8000/storage/${sp.hinh_anh}`}
                    alt={sp.ten_san_pham}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 6,
                      marginRight: 12,
                      flexShrink: 0,
                      boxShadow: '0 1px 5px rgba(0,0,0,0.15)',
                    }}
                  />
                  <div>
                    <strong
                      style={{
                        fontSize: 16,
                        color: '#222',
                        marginBottom: 6,
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 250,
                      }}
                    >
                      {sp.ten_san_pham}
                    </strong>
                    <div
                      style={{
                        fontWeight: 'bold',
                        color: '#d9534f',
                        marginBottom: 8,
                        fontSize: 14,
                      }}
                    >
                      {sp.gia_format}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: '#555',
                        maxHeight: 40,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={sp.mo_ta}
                    >
                      {sp.mo_ta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p><i>Không có sản phẩm nào.</i></p>
          )}
        </div>
      ))}

      {/* Modal gallery ảnh */}
      {galleryOpen && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.8)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={handleCloseGallery}
        >
          <div
            style={{
              position: 'relative',
              background: '#fff',
              padding: 20,
              borderRadius: 8,
              maxWidth: '90vw',
              maxHeight: '90vh',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={galleryImages[galleryIndex]}
              alt="gallery"
              style={{ maxWidth: '100%', maxHeight: '70vh', display: 'block', margin: '0 auto', borderRadius: 6 }}
            />
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.4)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    cursor: 'pointer',
                  }}
                  aria-label="Previous image"
                >
                  ◀
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.4)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    cursor: 'pointer',
                  }}
                  aria-label="Next image"
                >
                  ▶
                </button>
              </>
            )}
            <button
              onClick={handleCloseGallery}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '5px 10px',
                cursor: 'pointer',
              }}
              aria-label="Close gallery"
            >
              Đóng
            </button>
            <div style={{ textAlign: 'center', marginTop: 8, fontWeight: 'bold', color: '#333' }}>
              {galleryIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
