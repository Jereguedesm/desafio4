import express from 'express'
import { promises as fs } from 'fs'

const path = "./src/public/json/products/products.json"
//const PORT = 4000;
const app = express()

app.use(express.json())


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
            this.products.push(product);
            await this.writeProductsToFile(this.products);
        }
    }

    async getProducts() {
        const prods = await this.readProductsFromFile()
        console.log(prods)
    }

    async getProductById(id) {
        const prods = await this.readProductsFromFile()
        const producto = prods.find(prod => prod.id === id)

        if (producto) {
            console.log(producto)
        } else {
            console.log("Producto no encontrado")
        }
    }

    async deleteProduct(id) {
        const prods = await this.readProductsFromFile()
        const product = prods.find(prod => prod.id === id)

        if (product) {
            this.products = this.products.filter(prod => prod.id !== id)
            await this.writeProductsToFile()
            console.log("Producto eliminado")
        } else {
            console.log("Producto no encontrado")
        }
    }

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



 class Product {
    constructor(title, description, price, code, stock, thumbnail) {
        if (!title || !description || !price || !code || !stock || !thumbnail) {
            throw new Error("Todos los campos obligatorios deben ser proporcionados.")
        }
        if (typeof title !== "string") {
            throw new Error("El título debe ser una cadena de texto.")
        }
        if (typeof description !== "string") {
            throw new Error("La descripción debe ser una cadena de texto.")
        }
        if (typeof price !== "number") {
            throw new Error("El precio debe ser un número.")
        }
        if (typeof code !== "string") {
            throw new Error("El código debe ser una cadena de texto.")
        }
        if (typeof stock !== "number") {
            throw new Error("El stock debe ser un número.")
        }
        /*if (typeof thumbnail !== "string") {
            throw new Error("La URL de la imagen (thumbnail) debe ser una cadena de texto.")
        }*/ 
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.id = Product.incrementarId()
    }
    static incrementarId() {
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }
}

const productManager = new ProductManager()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Muy buenos días')
});

app.get('/products', async (req, res) => {
    const { limit } = req.query

    try {
        const products = await productManager.readProductsFromFile()

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

app.get('/products/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid)

    try {
        const products = await productManager.readProductsFromFile()
        const product = products.find((prod) => prod.id === pid)

        if(prod){
            res.status(200).send(prod)
        }else{
            res.status(400).send("Producto no encontrado")
        }

        /*if (product) {
            res.json({ product })
        } else {
            res.status(404).send('Producto no encontrado')
        }*/
    } catch (error) {
        res.status(500).send('Error al leer los productos')
    }
})






app.post("/products", async (req, res) => {
    console.log(req.body)
    
    const product = productManager.products.find(prod => prod.code === req.body.code)

    if (product) {
        res.status(400).send("Producto ya existente")
    } else {
        try {
            const newProduct = new Product(
                req.body.title,
                req.body.description,
                req.body.price,
                req.body.code,
                req.body.stock,
                req.body.thumbnail
            );
            productManager.products.push(newProduct)
            await productManager.writeProductsToFile(productManager.products)
            res.status(200).send("Producto creado")
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
})



app.put("/products/:id", (req, res) => {
    const {id} = parseInt(req.params)
    const {title, description, price, code, stock, thumbnail} = req.body

    const productIndex = prods.findIndex(prod => prod.id === parseInt(id))

    if(productIndex != -1){
        prods[productIndex].title = title
        prods[productIndex].description = description
        prods[productIndex].price = price
        prods[productIndex].thumbnail = thumbnail
        prods[productIndex].code = code
        prods[productIndex].stock = stock

        res.status(200).send(`Producto ${nombre} actualizado`)
    }else{
        res.status(404).send("Producto no encontrado")
    }
})

app.delete("/products/:id", (req, res) => {
    const {id} = parseInt(req.params)
    

    const productIndex = prods.findIndex(prod => prod.id === parseInt(id))

    if(productIndex != -1){
        prods.filter(prod => prod.id != parseInt(id))

        res.status(200).send(`Producto eliminado`)
    }else{
        res.status(404).send("Producto no encontrado")
    }
})


export default ProductManager

/*
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
*/