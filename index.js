const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const setupRoutes = require('./routers/routes');


dotenv.config();

const port = process.env.PORT || 8000;


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log(err));

const app = express();

app.use(cors())  
app.use(express.json())

setupRoutes(app);


app.listen(process.env.PORT, () => {
    console.log('Backend server is running !!!');
    console.log(`Server run on ${port}`);
  });

module.exports = app;