import { Router } from "express"
//import { promises as fs } from 'fs'




import ProductManager from "../helpers/productManager.js"





const path = "./src/public/json/products/products.json"
const prodsRouter = Router()

/*
class ProductManager {
    constructor() {
        this.products = []
    }

    async readProductsFromFile() {
        const prodsData = await fs.readFile(path, "utf-8")
        return JSON.parse(prodsData)
    }

    async writeProductsToFile(products) {
        try {
            await fs.writeFile(path, JSON.stringify(products))
        } catch (error) {
            console.error("Error al escribir en el archivo:", error)
            throw new Error("Error al guardar los productos.")
        }
    }

    async addProduct(product) {
        const prods = await this.readProductsFromFile()
        const prod = prods.find((prod) => prod.code === product.code)

        if (prod) {
            console.log("Producto ya existente")
        } else if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.thumbnail) {
            throw new Error("Todos los campos obligatorios deben ser proporcionados.")
        } else {
            this.products.push(product)
            await this.writeProductsToFile(this.products)
        }
    }

    async getProducts() {
        const prods = await this.readProductsFromFile()
        return prods; // Devuelve la lista de productos
    }

    async getProductById(id) {
        const prods = await this.readProductsFromFile()
        const producto = prods.find(prod => prod.id === id)
        return producto; // Devuelve el producto o undefined si no se encuentra
    }


    async deleteProduct(req, res) {
        const { id } = req.params
    
        try {
            // Obtener el producto existente por ID
            const existingProduct = await this.getProductById(id)
    
            if (!existingProduct) {
                return res.status(404).send("Producto no encontrado")
            }
    
            // Filtrar los productos para excluir el producto a eliminar
            this.products = this.products.filter((product) => product.id !== id)
    
            // Guardar los cambios en el archivo
            await this.writeProductsToFile(this.products)
    
            return res.status(200).send("Producto eliminado")
        } catch (error) {
            return res.status(500).send("Error al eliminar el producto")
        }
    }
    

/*
    async deleteProduct(id) {
        const prods = await this.readProductsFromFile()
        const product = prods.find(prod => prod.id === id)

        if (product) {
            this.products = this.products.filter(prod => prod.id !== id)
            await this.writeProductsToFile(this.products); // Agregué this.products
            console.log("Producto eliminado")
        } else {
            console.log("Producto no encontrado")
        }
    }
*/
/*
    async updateProduct(req, res) {
        const { id } = req.params
        const updatedProduct = req.body

        try {
            // Obtener el producto existente por ID
            const existingProduct = await this.getProductById(id)
    
            if (!existingProduct) {
                return res.status(404).send("Producto no encontrado")
            }
    
            // Actualizar los campos del producto existente con los nuevos datos
            existingProduct.title = updatedProduct.title
            existingProduct.description = updatedProduct.description
            existingProduct.price = updatedProduct.price
            existingProduct.thumbnail = updatedProduct.thumbnail
            existingProduct.code = updatedProduct.code
            existingProduct.stock = updatedProduct.stock
    
            // Guardar los cambios en el archivo
            await this.writeProductsToFile(this.products)
    
            return res.status(200).send("Producto actualizado")
        } catch (error) {
            return res.status(500).send("Error al actualizar el producto")
        }
    }
    

/*
    async updateProducts(id, producto) {
        const prods = await this.readProductsFromFile()
        const index = prods.findIndex(prod => prod.id === id)

        if (index !== -1) {
            prods[index].title = producto.title
            prods[index].description = producto.description
            prods[index].price = producto.price
            prods[index].thumbnail = producto.thumbnail
            prods[index].code = producto.code
            prods[index].stock = producto.stock
            await this.writeProductsToFile(prods)
            console.log("Producto actualizado:", prods[index])
        } else {
            console.log("Producto no encontrado")
        }
    }

}
*/
const productManager = new ProductManager()

prodsRouter.get('/', async (req, res) => {
    const { limit } = req.query

    try {
        const products = await productManager.getProducts()

        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit))
            res.json({ products: limitedProducts })
        } else {
            res.json({ products })
        }
    } catch (error) {
        res.status(500).send('Error al leer los productos')
    }
})

prodsRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productManager.getProductById(parseInt(id))

        if (prod)
            res.status(200).send(prod)
        else
            res.status(404).send("Producto no encontrado")

    } catch (error) {
        res.status(500).send('Error al buscar el producto')
    }
});

prodsRouter.post('/', async (req, res) => {
    console.log(req.body)

    try {
        const newProduct = new Product(
            req.body.title,
            req.body.description,
            req.body.price,
            req.body.code,
            req.body.stock,
            req.body.thumbnail
        )
        productManager.products.push(newProduct)
        await productManager.writeProductsToFile(productManager.products)
        res.status(200).send("Producto creado")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

prodsRouter.put('/:id', async (req, res) => {
    await productManager.updateProduct(req, res)
})


prodsRouter.delete('/:id', async (req, res) => {
    await productManager.deleteProduct(req, res)
})


export default prodsRouter
