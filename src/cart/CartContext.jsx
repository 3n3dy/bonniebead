import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const add = (product, catName) => {
    setItems(prev => {
      const exists = prev.find(i => i.product.id === product.id)
      if (exists) return prev.map(i =>
        i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
      )
      return [...prev, { product, catName, qty: 1 }]
    })
    setIsOpen(true)
  }

  const remove = (productId) =>
    setItems(prev => prev.filter(i => i.product.id !== productId))

  const updateQty = (productId, qty) => {
    if (qty < 1) return remove(productId)
    setItems(prev => prev.map(i =>
      i.product.id === productId ? { ...i, qty } : i
    ))
  }

  const clear = () => setItems([])
  const totalCount = items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, totalCount, isOpen, setIsOpen, add, remove, updateQty, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
