const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const router = require('./routes/authRoutes');

dotenv.config();

const app = express();

connectDB();

const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.use('/api/auth', router);

app.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
