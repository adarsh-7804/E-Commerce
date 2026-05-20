const express  = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require("cors");


dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const addressRoutes = require("./routes/addressRoutes");

app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/addresses", addressRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})