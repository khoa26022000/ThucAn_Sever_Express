require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRouter = require("../src/routes/auth");
const categoryRouter = require("../src/routes/category");
const restaurantRouter = require("../src/routes/restaurant");
const menuRouter = require("../src/routes/menu");
const foodRouter = require("../src/routes/food");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@detai75-thucan.vgddw.mongodb.net/detai75-thucan?retryWrites=true&w=majority`
    );

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);

app.use("/api/category", categoryRouter);

app.use("/api/restaurant", restaurantRouter);

app.use("/api/menu", menuRouter);

app.use("/api/food", foodRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
