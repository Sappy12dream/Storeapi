require('dotenv').config();
require('express-async-errors');

//async errors

const express = require('express');
const app = express();
const connectDB = require('./DB/connectDB');
const productsRouter = require('./Routes/products');


//Midddlewares
const notFoundMiddleware = require('./Middlewares/notFound');
const errorHandlerMiddleware = require('./Middlewares/errorHandlers');

//Middlewares

app.use(express.json());

//Routes
app.get('/', (req,res)=>{
    res.send('<h1>Store Api</h1><a href="/api/v1/products">Products</a>');
})

app.use('/api/v1/products', productsRouter);


//Products Routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async ()=>{
    try {
        //connectDB
        await connectDB(process.env.MONGOOSE_URI);
        app.listen(port, console.log(`Server is listening at port ${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();