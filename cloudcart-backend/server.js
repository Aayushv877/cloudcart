const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const productRoutes = require("./src/routes/productRoutes");
const vendorRoutes = require("./src/routes/vendorRoutes");

const app = express();

/*
 Middleware
*/
app.use(cors());
app.use(express.json());

/*
 Routes
*/
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

/*
 Test Route
*/
app.get("/", (req, res) => {
  res.send("CloudCart Backend Running");
});

/*
 Port Configuration
*/
const PORT = process.env.PORT || 5000;

/*
 Start Server
*/
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
