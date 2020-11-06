const AddToCart = (product) => {
  const localCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')):[]
  const newItem = {
    name: product.name,
    id:product._id,
    image:product.image[0],
    price:product.price,
    count: 1
  }
  if(!(localCart.find(x => x.id === newItem.id))){
    const newCart = [...localCart, newItem]
    localStorage.setItem('cart', JSON.stringify(newCart))
  }
}
const emptyCart = () => {
  localStorage.setItem('cart', [])
}

export {AddToCart, emptyCart}