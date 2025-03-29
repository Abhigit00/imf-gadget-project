require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const gadgetRoutes = require('./routes/gadgets');
const authRoutes = require("./routes/auth");



const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/gadgets',gadgetRoutes);
app.use("/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("IMF Gadget API is running...");
});


sequelize
 .sync()
 .then(()=>{
  console.log("Database Connected!");
  app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
    
  })


 })
 .catch((error)=>{
  console.log("Database connection failed",error);
  
 });