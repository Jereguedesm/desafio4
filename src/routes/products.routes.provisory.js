//import express from 'express'
import { Router } from "express";
import { promises as fs } from 'fs'



const path = "./public/json/products/products.json"
const prodsRouter = Router()

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
//
//const app = express()
//


const productManager = new ProductManager();













prodsRouter.get('/', async (req, res) => {
    const { limit } = req.query;

    try {
        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit));
            res.json({ products: limitedProducts });
        } else {
            res.json({ products });
        }
    } catch (error) {
        res.status(500).send('Error al leer los productos');
    }
});

/*
prodsRouter.get('/', async (req, res) => {
    const { limit } = req.query

    const prods = await productManager.getProducts()

    const products = prods.slice(0, limit)

    res.status(200).send(products)
})*/

prodsRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    const prod = await productManager.getProductById(parseInt(id))

    if (prod)
        res.status(200).send(prod)
    else
        res.status(404).send("Producto no encontrado")

})





prodsRouter.post('/', async (req, res) => {
    console.log(req.body);
    
    try {
        // Validaciones y creación del nuevo producto utilizando productManager
        // ...

        res.status(201).send("Producto creado");
    } catch (error) {
        res.status(400).send(error.message);
    }
});


/*
prodsRouter.post('/:id', async (req, res) => {


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



    /*try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        
    
        res.status(201).json({ message: 'Producto creado con éxito', product });
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el producto' });
    }

})*/

prodsRouter.put('/:id', async (req, res) => {

})

prodsRouter.delete('/:id', async (req, res) => {
/*    const { id } = req.params

    const prod = await productManager.getProductById(parseInt(id))

    if (prod)
        res.status(200).send(prod)
    else
        res.status(404).send("Producto no encontrado")*/

})
//Resto de las rutas

export default prodsRouter