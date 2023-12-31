const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const userRouter = require('./routes/user');
const orderRouter = require('./routes/order');
const productRouter = require('./routes/product');
const checkoutRouter = require('./routes/checkout');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-commerce REST API",
            version: "1.0.0",
            description: "A basic e-commerce API"
        },
        schema: [
            "http",
            "https"
        ],
        servers: [
            {
                url: "https://jims-ecommerce-rest-api.herokuapp.com/",
            }
        ],
    },
    apis: ["./swagger.yml"]
}

const specs = swaggerJsDoc(options);

const app = express();

const origin = {
    origin: process.env.CORS_ORIGIN,
    credentials: true
}

app.use(compression());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.use(express.json());
app.use(cors(origin)); 
app.options('*', cors(origin));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/checkout', checkoutRouter);

app.use((err, req, res, next) => {
    const { message, status } = err;
    res.status(status || 500).send(message);
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})