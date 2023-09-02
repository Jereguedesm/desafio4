import express from 'express'
import multer from 'multer'
import prodsRouter from "./routes/products.routes.js";
import cartsRouter from './routes/carts.router.js';
import { __dirname } from './path.js';
import {engine} from "express-handlebars"
import {Server} from "socket.io"
import path from 'path';

const PORT = 8080
const app = express()

//Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img') //null hace referencia a que no envia errores
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`) //Concateno el nombre original de mi archivo con milisegundos con Date.now()
    }
})


const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})


//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname, "./views"))

const upload = multer({ storage: storage })

//server de socket.io
const io = new Server(server)

io.on("connection", () => {
    console.log("Servidor Socket.io conectado")
})




//Routes
app.use('/api/products', prodsRouter)
app.use("/api/carts", cartsRouter)
app.use('/static', express.static(path.join(__dirname, '/public')))

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
})

