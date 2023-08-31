import express from 'express'

const path = "./src/public/json/carts/carts.json"
//const PORT = 4000;
const app = express()

app.use(express.json())




    export default class CartsManager {
    constructor(){
        this.carts = []
    }

    // Función para crear un nuevo carrito
    createCart(products) {
        const id = this.generateUniqueId();
        const cart = {
            id,
            products: []
        }
        if (products) {
            cart.products = products
        }
        this.carts.push(cart)
        return cart
    }

    // Función para generar un ID único
    generateUniqueId() {
        const ids = this.carts.map(cart => cart.id)
        let newId = 1
        while (ids.includes(newId)) {
            newId++
        }
        return newId
    }

}



    export class Cart {
    constructor(id, products){
        if (!id || !products){
            throw new Error ("Todos los campos obligatorios deben ser proporcionados")
        }
        if (typeof id !== "number"){
            throw new Error ("El id debe ser un número")
        }


        this.id = Cart.incrementarId()
        this.products = []
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

const cartManager = new CartsManager()











//export default CartsManager