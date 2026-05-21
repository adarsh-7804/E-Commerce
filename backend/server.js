const express  = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require("cors");


dotenv.config();

connectDB();

const app = express();

app.use(express.json());
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://localhost:5174'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const addressRoutes = require("./routes/addressRoutes");
const socialAuthRoutes = require('./routes/socialAuthRoutes');


app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/addresses", addressRoutes);
app.use('/api/auth', socialAuthRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})