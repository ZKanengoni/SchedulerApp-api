const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const PORT = 8000;

const cors = require('./helpers/cors');

// Import Routes
const authRoute = require('./routes/auth');
const classesRoute = require('./routes/classes');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true }, () => {
  console.log('Connnected to db!');
});

// Middleware
app.use(express.json());
app.use(cors);

// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/school', classesRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
