import { toast } from "react-toastify"
export const addtowwishlist = (product) => {
  const existingWishlist = JSON.parse(sessionStorage.getItem("wishlist")) || []

  const existingIndex = existingWishlist.findIndex((item) => item.id === product.id)

  if (existingIndex !== -1) {
     toast.warning(`"${product.ten_san_pham}" đã có trong danh sách yêu thích.`)
    return
  } else {
    existingWishlist.push(product)
     toast.success(`Đã thêm "${product.ten_san_pham}" vào danh sách yêu thích.`)
  }

  sessionStorage.setItem("wishlist", JSON.stringify(existingWishlist))
  window.dispatchEvent(new Event("wishlist-updated"))
 
}