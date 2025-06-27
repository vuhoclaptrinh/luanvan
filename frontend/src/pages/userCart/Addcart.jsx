import { toast } from "react-toastify"

export const addToCart = (product, variantId = null, quantity = 1, selectedVariant = null) => {
  const existingCart = JSON.parse(sessionStorage.getItem("cart")) || []

  // Dữ liệu biến thể nếu có
  const resolvedVariantId = variantId || product.variant_id || (product.selectedVariant && product.selectedVariant.id)
  const resolvedQuantity = Number(quantity) > 0 ? Number(quantity) : 1

  if (Array.isArray(product.variants) && product.variants.length > 0 && !resolvedVariantId) {
    toast.warning("Vui lòng chọn loại/dung tích trước khi thêm vào giỏ hàng!")
    return
  }

  let cartName = product.ten_san_pham
  let maxQuantity = 0
  let cartItem

  if (resolvedVariantId) {
    const variant = selectedVariant || (product.variants || []).find(v => v.id === resolvedVariantId)
    if (!variant) {
      toast.error("Không tìm thấy biến thể sản phẩm!")
      return
    }

    maxQuantity = Number(variant.so_luong_ton) || 0
    cartName = `${product.ten_san_pham} (${variant.dung_tich || ''})`

    cartItem = {
      id: product.id,
      variant_id: resolvedVariantId,
      ten_san_pham: product.ten_san_pham,
      hinh_anh: product.hinh_anh,
      thuong_hieu: product.thuong_hieu,
      dung_tich: variant.dung_tich,
      gia: variant.gia,
      so_luong_ton: variant.so_luong_ton,
      quantity: resolvedQuantity,
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
      quantity: resolvedQuantity,
    }
  }

  const existingIndex = existingCart.findIndex((item) => {
    if (resolvedVariantId) return item.id === product.id && item.variant_id === resolvedVariantId
    return item.id === product.id && !item.variant_id
  })

  if (existingIndex !== -1) {
    const currentQty = existingCart[existingIndex].quantity
    if (currentQty + resolvedQuantity <= maxQuantity) {
      existingCart[existingIndex].quantity += resolvedQuantity
      toast.success(`Đã tăng số lượng "${cartName}" lên ${existingCart[existingIndex].quantity}`)
    } else if (currentQty < maxQuantity) {
      const added = maxQuantity - currentQty
      existingCart[existingIndex].quantity = maxQuantity
      toast.warning(`Chỉ có thể thêm tối đa ${added} sản phẩm nữa cho "${cartName}" (tổng: ${maxQuantity}).`)
    } else {
      toast.warning(`Bạn đã thêm tối đa ${maxQuantity} sản phẩm "${cartName}".`)
      return
    }
  } else {
    if (maxQuantity > 0) {
      if (resolvedQuantity > maxQuantity) {
        cartItem.quantity = maxQuantity
        toast.warning(`Chỉ có thể thêm tối đa ${maxQuantity} sản phẩm "${cartName}" vào giỏ hàng.`)
      }
      existingCart.push(cartItem)
      toast.success(`Đã thêm "${cartName}" vào giỏ hàng.`)
    } else {
      toast.error(`"${cartName}" hiện đã hết hàng và không thể thêm vào giỏ.`)
      return
    }
  }

  sessionStorage.setItem("cart", JSON.stringify(existingCart))
  window.dispatchEvent(new Event("cart-updated"))
}
