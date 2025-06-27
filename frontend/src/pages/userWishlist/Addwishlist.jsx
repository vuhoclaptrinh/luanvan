import { toast } from "react-toastify"

export const addToWishlist = (product) => {
  const existingWishlist = JSON.parse(sessionStorage.getItem("wishlist")) || []

  const existingIndex = existingWishlist.findIndex((item) => item.id === product.id)

  if (existingIndex !== -1) {
    toast.warning(`"${product.ten_san_pham}" đã có trong danh sách yêu thích.`)
    return
  }

  // Chỉ lấy các trường cần thiết
  const wishlistItem = {
    id: product.id,
    ten_san_pham: product.ten_san_pham,
    hinh_anh: product.hinh_anh,
    thuong_hieu: product.thuong_hieu,
    gia: product.gia || product?.variants?.[0]?.gia || 0,
    dung_tich: product.dung_tich || product?.variants?.[0]?.dung_tich || '',
    images: product.images || [], 
  }

  existingWishlist.push(wishlistItem)
  sessionStorage.setItem("wishlist", JSON.stringify(existingWishlist))

  // Gửi sự kiện cho component khác (nếu có)
  window.dispatchEvent(new Event("wishlist-updated"))

  toast.success(`Đã thêm "${product.ten_san_pham}" vào danh sách yêu thích.`)
}
