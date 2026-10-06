const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes")
connectDB();

const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors(
    {
        origin: allowedOrigins,
        credentials: true
    }
));
app.use(express.json())
app.get("/", (req, res) => {
    res.send("wardrobe backend is working properly on site");
    console.log("wardrobe backend is working properly");
});

app.use('/api/auth', authRoutes );
app.use('/api/products', require("./routes/productsRoutes.js") );
app.use('/api/orders', require("./routes/ordersRoutes.js") );
app.use('/api/payments', require("./routes/paymentsRoutes.js") );
app.use('/api/analytics', require("./routes/analyticsRoutes.js") );

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}else{
    app.get("/",(req,res)=>{
        res.send("backend is running in development mode");
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
}) 

