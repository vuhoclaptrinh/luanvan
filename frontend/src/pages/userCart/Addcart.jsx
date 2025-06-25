import { toast } from "react-toastify"

export const addToCart = (product) => {
  const existingCart = JSON.parse(sessionStorage.getItem("cart")) || []

  // Nếu có variant_id (hoặc selectedVariant), xử lý theo biến thể
  const variantId = product.variant_id || (product.selectedVariant && product.selectedVariant.id)

  // Nếu có nhiều biến thể mà chưa chọn biến thể
  if (Array.isArray(product.variants) && product.variants.length > 0 && !variantId) {
    toast.warning("Vui lòng chọn loại/dung tích trước khi thêm vào giỏ hàng!")
    return
  }

  let maxQuantity = 0
  let cartName = product.ten_san_pham
  let userQuantity = Number(product.quantity) > 0 ? Number(product.quantity) : 1
  let cartItem

  if (variantId) {
    // Tìm biến thể trong product.variants
    const variant = (product.variants || []).find(v => v.id === variantId)
    if (!variant) {
      toast.error("Không tìm thấy biến thể sản phẩm!")
      return
    }
    maxQuantity = Number(variant.so_luong_ton) || 0
    cartName = `${product.ten_san_pham} (${variant.dung_tich || ''})`
    cartItem = {
      id: product.id, // id sản phẩm gốc
      variant_id: variantId,
      ten_san_pham: product.ten_san_pham,
      hinh_anh: product.hinh_anh,
      thuong_hieu: product.thuong_hieu,
      dung_tich: variant.dung_tich,
      gia: variant.gia,
      so_luong_ton: variant.so_luong_ton,
      quantity: userQuantity,
      // các trường khác nếu cần
    }
  } else {
    maxQuantity = Number(product.so_luong_ton) || 0
    cartItem = {
      id: product.id,
      ten_san_pham: product.ten_san_pham,
      hinh_anh: product.hinh_anh,
      thuong_hieu: product.thuong_hieu,
      dung_tich: product.dung_tich,
      gia: product.gia,
      so_luong_ton: product.so_luong_ton,
      quantity: userQuantity,
      // các trường khác nếu cần
    }
  }

  // Tìm trong giỏ hàng theo id và variant_id nếu có
  const existingIndex = existingCart.findIndex((item) => {
    if (variantId) return item.id === product.id && item.variant_id === variantId
    return item.id === product.id && !item.variant_id
  })

  if (existingIndex !== -1) {
    const existingQuantity = existingCart[existingIndex].quantity
    if (existingQuantity + userQuantity <= maxQuantity) {
      existingCart[existingIndex].quantity += userQuantity
      toast.success(`Đã tăng số lượng "${cartName}" lên ${existingCart[existingIndex].quantity}`)
    } else if (existingQuantity < maxQuantity) {
      const added = maxQuantity - existingQuantity
      existingCart[existingIndex].quantity = maxQuantity
      toast.warning(`Chỉ có thể thêm tối đa ${added} sản phẩm nữa cho "${cartName}" (tổng: ${maxQuantity}).`)
    } else {
      toast.warning(`Bạn đã thêm tối đa ${maxQuantity} sản phẩm "${cartName}" (số lượng còn lại trong kho).`)
      return
    }
  } else {
    if (maxQuantity > 0) {
      if (userQuantity > maxQuantity) {
        cartItem.quantity = maxQuantity
        toast.warning(`Chỉ có thể thêm tối đa ${maxQuantity} sản phẩm "${cartName}" vào giỏ hàng.`)
      }
      existingCart.push(cartItem)
      toast.success(`Đã thêm "${cartName}" vào giỏ hàng.`)
    } else {
      toast.error(`"${cartName}" hiện đã hết hàng (maxQuantity=${maxQuantity}) và không thể thêm vào giỏ.`)
      return
    }
  }

  sessionStorage.setItem("cart", JSON.stringify(existingCart))
  window.dispatchEvent(new Event("cart-updated"))
}
