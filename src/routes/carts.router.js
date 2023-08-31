import { Router } from "express"

import CartsManager from "../helpers/cartsManager.js"

const path = "./public/json/carts/carts.json"
const cartsRouter = Router()


const cartManager = new CartsManager()

// Definir las rutas para carritos
/*cartsRouter.post('/', async (req, res) => {
    
    try {

        const newCart = new Cart(
          req.body.products
        )

          await cartManager.carts.push(newCart)
          
        // Genera un nuevo carrito con un ID único
    
        // Agrega el carrito a la lista de carritos
    
        // Guarda la lista de carritos en el archivo "carrito.json"
    
        res.status(201).json({ message: 'Carrito creado con éxito', cart })
      } catch (error) {
        res.status(400).json({ error: 'Error al crear el carrito' })
      }

})*/


cartsRouter.post('/', async (req, res) => {
  try {
      const { products } = req.body;
      const newCart = cartManager.createCart(products);
      // Guarda la lista de carritos en el archivo "carrito.json" (debes implementar esta parte)
      res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart })
  } catch (error) {
      res.status(400).json({ error: 'Error al crear el carrito' })
  }
})


cartsRouter.get('/:cid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = cartManager.getCartById(cartId);

  if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.status(200).json(cart.products);
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = parseInt(req.body.quantity || 1); // Default quantity is 1

  const cart = cartManager.getCartById(cartId);

  if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  // Verifica si el producto ya existe en el carrito
  const existingProduct = cart.products.find(product => product.id === productId);

  if (existingProduct) {
      // Si el producto ya existe, incrementa la cantidad
      existingProduct.quantity += quantity;
  } else {
      // Si el producto no existe, agrégalo al carrito
      cart.products.push({ id: productId, quantity });
  }

  // Guarda la lista de carritos en el archivo "carrito.json" (debes implementar esta parte)

  res.status(200).json({ message: 'Producto agregado al carrito con éxito', cart });
});



export default cartsRouter