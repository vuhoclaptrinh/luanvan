export const addToCart = (product) => {
  const existingCart = JSON.parse(sessionStorage.getItem("cart")) || []

  const existingIndex = existingCart.findIndex((item) => item.id === product.id)

  if (existingIndex !== -1) {
    const existingQuantity = existingCart[existingIndex].quantity
    const maxQuantity = product.so_luong_ton

    if (existingQuantity < maxQuantity) {
      existingCart[existingIndex].quantity += 1
      alert(`Đã tăng số lượng "${product.ten_san_pham}" lên ${existingQuantity + 1}`)
    } else {
      alert(`Bạn đã thêm tối đa ${maxQuantity} sản phẩm "${product.ten_san_pham}" (số lượng còn lại trong kho).`)
      
       alert(`"${product.ten_san_pham}" hiện đã hết hàng và không thể thêm vào giỏ.`)
      return
    }
  } else {
    if (product.so_luong_ton > 0) {
      existingCart.push({ ...product, quantity: 1 })
      alert(`Đã thêm "${product.ten_san_pham}" vào giỏ hàng.`)
    } else {
       alert(`"${product.ten_san_pham}" hiện đã hết hàng và không thể thêm vào giỏ.`)
      return
    }
  }

  sessionStorage.setItem("cart", JSON.stringify(existingCart))
}
