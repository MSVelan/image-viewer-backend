require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth-routes.js");
const homeRoutes = require("./routes/home-routes.js");
const adminRoutes = require("./routes/admin-routes.js");
const connectToDB = require("./database/db.js");
connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// middleware
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
